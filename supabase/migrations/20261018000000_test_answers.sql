-- Store what each participant chose in each part of a sentence, next to the expected answers,
-- so scientists and teachers can read every answer sheet.
alter table public.tests
  add column answers jsonb check (answers is null or pg_column_size(answers) < 8192);

create or replace function public.save_test(t jsonb) returns void
language sql security definer set search_path = '' as $$
  insert into public.tests (
    id, participant_id, stimulus_id, sentence, word_order, cefr_level, complexity, length,
    predictability, presentation_mode, reading_time_ms, reading_speed_wpm, question_rt_ms,
    part1_correct, part1_rt_ms, part2_correct, part2_rt_ms, part3_correct, part3_rt_ms,
    is_correct, accuracy_score, cognitive_load, per_word_rt_ms, selected_option, error_type, answers
  )
  select
    r.id, r.participant_id, r.stimulus_id, r.sentence, r.word_order, r.cefr_level, r.complexity, r.length,
    r.predictability, r.presentation_mode, r.reading_time_ms, r.reading_speed_wpm, r.question_rt_ms,
    r.part1_correct, r.part1_rt_ms, r.part2_correct, r.part2_rt_ms, r.part3_correct, r.part3_rt_ms,
    r.is_correct, r.accuracy_score, r.cognitive_load, r.per_word_rt_ms, r.selected_option, r.error_type, r.answers
  from jsonb_populate_record(null::public.tests, t) r
  where exists (
    select 1 from public.participants pt
    where pt.id = r.participant_id
      and pt.token_hash = extensions.crypt(coalesce(t->>'token', ''), pt.token_hash)
  )
  on conflict (id) do nothing;
$$;
