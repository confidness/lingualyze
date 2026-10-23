// Supabase project "lingualyze" (eu-central-1). The publishable key is public by design:
// both tables are closed to it, and every read/write goes through the database functions
// in supabase/migrations. Reading or deleting data requires the researcher passcode.
const SUPABASE_URL = 'https://ckawemvlxbjmnfdvsygm.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_CGW79pp8_Dh7fRJjzWLi6g_7FQ7xEMU';

export async function rpc<T = void>(fn: string, args: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`, {
    method: 'POST',
    headers: { apikey: SUPABASE_PUBLISHABLE_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(args),
  });
  if (!res.ok) throw new Error(`${fn} failed (${res.status})`);
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

// Stores the research session token (or a legacy passcode) for authorized reads.
const PASSCODE_KEY = 'lingualyze_researcher_passcode';
export const researcherPasscode = {
  get: (): string | null => {
    try { return localStorage.getItem(PASSCODE_KEY); } catch { return null; }
  },
  set: (passcode: string) => {
    try { localStorage.setItem(PASSCODE_KEY, passcode); } catch { /* storage blocked */ }
  },
  clear: () => {
    const token = researcherPasscode.get();
    if (token) void rpc('researcher_logout', { token }).catch(() => undefined);
    try { localStorage.removeItem(PASSCODE_KEY); } catch { /* storage blocked */ }
  },
};
