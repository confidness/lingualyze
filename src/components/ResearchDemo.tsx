import React, { useEffect, useState } from 'react';
import { rpc, researcherPasscode } from '../utils/db';
import { LanguageCode } from '../types';

interface DemoParticipant {
  id: string; name: string; cohort: string;
  results: { stimulus_id: string; sentence: string; word_order: string; cefr_level: string;
    reading_time_ms: number; question: string; selected_answer: string; expected_answer: string; correct: boolean }[];
}

export function ResearchDemo({ lang }: { lang: LanguageCode }) {
  const [data, setData] = useState<DemoParticipant[]>([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const tr = (kk: string, ru: string, en: string) => lang === 'kk' ? kk : lang === 'ru' ? ru : en;
  useEffect(() => {
    let active = true;
    rpc<DemoParticipant[]>('research_demo_data', { passcode: researcherPasscode.get() })
      .then(rows => { if (active) setData(rows); })
      .catch(() => { if (active) setError(true); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);
  return <section className="my-6 rounded-2xl border border-amber-300 bg-amber-50 p-5 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
    <h2 className="text-lg font-bold">{tr('Демо деректер', 'Демонстрационные данные', 'Demo data')}</h2>
    <p className="my-2 text-sm">{tr(
      'Жасанды мысалдар. Нақты еріктілер емес. Зерттеу талдауына, қорытындыларына және экспортына кірмейді.',
      'Искусственные примеры, не реальные добровольцы. Исключены из анализа, выводов и экспорта исследования.',
      'Synthetic examples, not real volunteers. Excluded from research analysis, conclusions, and exports.')}</p>
    {loading && <p>{tr('Жүктелуде…', 'Загрузка…', 'Loading…')}</p>}
    {error && <p role="alert">{tr('Демо деректерді жүктеу мүмкін болмады.', 'Не удалось загрузить демо данные.', 'Could not load demo data.')}</p>}
    {!loading && !error && <p className="mb-3 text-sm">{data.length} {tr('демо қатысушы', 'демо участников', 'demo participants')} · {data.reduce((n,p)=>n+p.results.length,0)} {tr('демо жауап', 'демо ответов', 'demo responses')}</p>}
    {data.map(p => <details key={p.id} className="border-t border-amber-200 py-3">
      <summary className="cursor-pointer font-semibold">{p.name} · {p.cohort} · {p.results.filter(r=>r.correct).length}/{p.results.length}</summary>
      {p.results.map(r => <div key={r.stimulus_id} className="mt-3 rounded-lg bg-white p-3 text-sm dark:bg-slate-800">
        <p className="font-semibold">{r.sentence}</p>
        <p>{r.word_order} · {r.cefr_level} · {r.reading_time_ms} ms</p>
        <p className="mt-2">{r.question}</p>
        <p>{tr('Демо жауап', 'Демо ответ', 'Demo answer')}: {r.selected_answer} {r.correct ? '✓' : '✗'}</p>
        <p>{tr('Дұрыс жауап', 'Правильный ответ', 'Expected answer')}: {r.expected_answer}</p>
      </div>)}
    </details>)}
  </section>;
}
