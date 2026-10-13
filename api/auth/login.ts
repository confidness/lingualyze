// Researcher sign-in. Runs as a Vercel Function in production; server.ts reuses the check locally.
// ponytail: passcodes live in source (repo is public); move to a RESEARCHER_PASSCODE env var when access matters.
export const isResearcherPasscode = (passcode: unknown) =>
  typeof passcode === 'string' && ['23032011', 'admin123'].includes(passcode.trim());

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  if (!isResearcherPasscode(body?.passcode)) {
    return Response.json({ success: false, message: 'Invalid passcode. Access denied.' }, { status: 401 });
  }
  return Response.json({ success: true, role: 'researcher', message: 'Authenticated as Scientist / Researcher' });
}
