-- Participants (users) and their per-sentence test results.
-- Both tables have RLS on and no policies, so the public API cannot touch them directly;
-- the app goes through the security-definer functions below.
-- Each participant's browser holds a random secret token; only its bcrypt hash is stored, and
-- updating a participant or adding their tests requires it, so the public key can't overwrite others.
--
-- After running this, add a researcher passcode (pick your own, keep it out of git):
--   insert into private.researcher_passcodes (hash)
--   values (extensions.crypt('YOUR-PASSCODE', extensions.gen_salt('bf')));
create extension if not exists pgcrypto with schema extensions;

create table public.participants (
  id          text primary key check (char_length(id) between 3 and 64),
  name        text not null check (char_length(name) between 2 and 100),
  phone       text check (char_length(phone) <= 20),
  age         int check (age between 6 and 99),
  cohort      text not null check (cohort in ('kazakh_dominant', 'bilingual_balanced', 'kazakh_l2')),
  token_hash  text not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table public.tests (
  id                 text primary key check (char_length(id) <= 64),
  participant_id     text not null references public.participants (id) on delete cascade,
  created_at         timestamptz not null default now(),
  stimulus_id        text not null,
  sentence           text,
  word_order         text not null check (word_order in ('SOV', 'OSV', 'SVO', 'OVS')),
  cefr_level         text check (cefr_level in ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
  complexity         text,
  length             text,
  predictability     text,
  presentation_mode  text,
  reading_time_ms    int not null check (reading_time_ms > 0),
  reading_speed_wpm  int,
  question_rt_ms     int,
  part1_correct      boolean,
  part1_rt_ms        int,
  part2_correct      boolean,
  part2_rt_ms        int,
  part3_correct      boolean,
  part3_rt_ms        int,
  is_correct         boolean not null,
  accuracy_score     int check (accuracy_score between 0 and 100),
  cognitive_load     real,
  per_word_rt_ms     int[],
  selected_option    text,
  error_type         text
);
create index tests_participant_id_idx on public.tests (participant_id);

alter table public.participants enable row level security;
alter table public.tests enable row level security;

-- Researcher passcodes, stored as bcrypt hashes in a schema the API does not expose
create schema if not exists private;
create table private.researcher_passcodes (hash text primary key);

create function private.check_passcode(passcode text) returns boolean
language sql stable set search_path = '' as $$
  select exists (
    select 1 from private.researcher_passcodes p
    where p.hash = extensions.crypt(coalesce(passcode, ''), p.hash)
  );
$$;
revoke all on function private.check_passcode(text) from public, anon, authenticated;

-- Public API -----------------------------------------------------------------

create function public.is_researcher(passcode text) returns boolean
language sql stable security definer set search_path = '' as $$
  select private.check_passcode(passcode);
$$;

-- Creates a participant, or updates one only when the caller presents that participant's token
create function public.save_participant(p jsonb) returns void
language sql security definer set search_path = '' as $$
  insert into public.participants (id, name, phone, age, cohort, token_hash)
  select r.id, trim(r.name), r.phone, r.age, r.cohort,
         extensions.crypt(p->>'token', extensions.gen_salt('bf'))
  from jsonb_populate_record(null::public.participants, p) r
  where char_length(coalesce(p->>'token', '')) >= 16
  on conflict (id) do update
    set name = excluded.name, phone = excluded.phone, age = excluded.age,
        cohort = excluded.cohort, updated_at = now()
    where public.participants.token_hash = extensions.crypt(p->>'token', public.participants.token_hash);
$$;

create function public.save_test(t jsonb) returns void
language sql security definer set search_path = '' as $$
  insert into public.tests (
    id, participant_id, stimulus_id, sentence, word_order, cefr_level, complexity, length,
    predictability, presentation_mode, reading_time_ms, reading_speed_wpm, question_rt_ms,
    part1_correct, part1_rt_ms, part2_correct, part2_rt_ms, part3_correct, part3_rt_ms,
    is_correct, accuracy_score, cognitive_load, per_word_rt_ms, selected_option, error_type
  )
  select
    r.id, r.participant_id, r.stimulus_id, r.sentence, r.word_order, r.cefr_level, r.complexity, r.length,
    r.predictability, r.presentation_mode, r.reading_time_ms, r.reading_speed_wpm, r.question_rt_ms,
    r.part1_correct, r.part1_rt_ms, r.part2_correct, r.part2_rt_ms, r.part3_correct, r.part3_rt_ms,
    r.is_correct, r.accuracy_score, r.cognitive_load, r.per_word_rt_ms, r.selected_option, r.error_type
  from jsonb_populate_record(null::public.tests, t) r
  where exists (
    select 1 from public.participants pt
    where pt.id = r.participant_id
      and pt.token_hash = extensions.crypt(coalesce(t->>'token', ''), pt.token_hash)
  )
  on conflict (id) do nothing;
$$;

create function public.research_data(passcode text) returns jsonb
language plpgsql stable security definer set search_path = '' as $$
begin
  if not private.check_passcode(passcode) then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  return jsonb_build_object(
    'participants', coalesce((select jsonb_agg(to_jsonb(p) - 'token_hash' order by p.created_at) from public.participants p), '[]'::jsonb),
    'tests',        coalesce((select jsonb_agg(to_jsonb(t) order by t.created_at desc) from public.tests t), '[]'::jsonb)
  );
end;
$$;

create function public.delete_test(passcode text, test_id text) returns void
language plpgsql security definer set search_path = '' as $$
begin
  if not private.check_passcode(passcode) then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  delete from public.tests where id = test_id;
end;
$$;
