-- Named researcher accounts. Provision passwords privately, never in source control.
create table private.researcher_accounts (
  username text primary key,
  password_hash text not null
);
create table private.researcher_sessions (
  token_hash text primary key,
  username text not null references private.researcher_accounts(username) on delete cascade,
  expires_at timestamptz not null
);
revoke all on private.researcher_accounts, private.researcher_sessions from public, anon, authenticated;

create function public.researcher_login(username text, password text) returns text
language plpgsql security definer set search_path = '' as $$
declare
  session_token text;
begin
  if not exists (
    select 1 from private.researcher_accounts a
    where a.username = researcher_login.username
      and a.password_hash = extensions.crypt(researcher_login.password, a.password_hash)
  ) then
    return null;
  end if;
  delete from private.researcher_sessions where expires_at <= now();
  session_token := encode(extensions.gen_random_bytes(32), 'hex');
  insert into private.researcher_sessions(token_hash, username, expires_at)
  values (encode(extensions.digest(session_token, 'sha256'), 'hex'), researcher_login.username, now() + interval '8 hours');
  return session_token;
end;
$$;

create or replace function private.check_passcode(passcode text) returns boolean
language sql stable set search_path = '' as $$
  select exists (
    select 1 from private.researcher_sessions s
    where s.token_hash = encode(extensions.digest(coalesce(passcode, ''), 'sha256'), 'hex')
      and s.expires_at > now()
  ) or exists (
    select 1 from private.researcher_passcodes p
    where p.hash = extensions.crypt(coalesce(passcode, ''), p.hash)
  );
$$;
revoke all on function private.check_passcode(text) from public, anon, authenticated;
revoke all on function public.researcher_login(text, text) from public;
grant execute on function public.researcher_login(text, text) to anon, authenticated;

create function public.researcher_logout(token text) returns void
language sql security definer set search_path = '' as $$
  delete from private.researcher_sessions
  where token_hash = encode(extensions.digest(token, 'sha256'), 'hex');
$$;
revoke all on function public.researcher_logout(text) from public;
grant execute on function public.researcher_logout(text) to anon, authenticated;
