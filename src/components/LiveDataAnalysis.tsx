import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { CEFRLevel, LanguageCode, LanguageDominanceGroup, TrialResult, WordOrderCondition } from '../types';
import { summarize } from '../utils/statistics';

interface LiveDataAnalysisProps {
  allTrials: TrialResult[];
  lang: LanguageCode;
}

const ORDERS: WordOrderCondition[] = ['SOV', 'OSV', 'SVO', 'OVS'];
const COHORTS: LanguageDominanceGroup[] = ['kazakh_dominant', 'bilingual_balanced', 'kazakh_l2'];
const COHORT_LABEL: Record<LanguageDominanceGroup, string> = {
  kazakh_dominant: 'L1',
  bilingual_balanced: 'Bilingual',
  kazakh_l2: 'L2',
};
const LEVELS: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const num = (v: number, digits = 0) => (Number.isFinite(v) ? v.toFixed(digits) : '—');
const acc = (rows: TrialResult[], pick: (t: TrialResult) => boolean | undefined = t => t.isCorrect) => {
  const answered = rows.filter(t => pick(t) !== undefined);
  return answered.length ? `${Math.round((answered.filter(pick).length / answered.length) * 100)}%` : '—';
};

const Section: React.FC<{ title: string; note?: string; children: React.ReactNode }> = ({ title, note, children }) => (
  <section className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
    <div>
      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{title}</h3>
      {note && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{note}</p>}
    </div>
    <div className="overflow-x-auto">{children}</div>
  </section>
);

const th = 'p-2.5 text-left font-semibold whitespace-nowrap';
const td = 'p-2.5 whitespace-nowrap';
const tableCls = 'w-full text-xs font-mono border border-slate-200 dark:border-slate-800';
const headCls = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300';
const bodyCls = 'divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200';

export const LiveDataAnalysis: React.FC<LiveDataAnalysisProps> = ({ allTrials, lang }) => {
  const tr = (kk: string, ru: string, en: string) => (lang === 'kk' ? kk : lang === 'ru' ? ru : en);

  if (allTrials.length === 0) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">{tr('Әзірге жазылған сынақ жоқ.', 'Пока нет записанных проб.', 'No trials recorded yet.')}</p>;
  }

  // Outlier screen: < 200 ms, or beyond ±2.5 SD of the trial's word-order condition mean
  const condStats = Object.fromEntries(ORDERS.map(o => [o, summarize(allTrials.filter(t => t.wordOrder === o).map(t => t.readingTimeMs))]));
  const isOutlier = (t: TrialResult) => {
    const s = condStats[t.wordOrder];
    return t.readingTimeMs < 200 || (s.n > 2 && Math.abs(t.readingTimeMs - s.mean) > 2.5 * s.sd);
  };
  const outliers = allTrials.filter(isOutlier).length;
  const participants = new Set(allTrials.map(t => t.participantId));
  const sprTrials = allTrials.filter(t => t.perWordRtMs?.length);
  const noCohort = allTrials.filter(t => !t.dominanceGroup).length;

  // SPR: reading time per word position
  const maxWords = Math.max(0, ...sprTrials.map(t => t.perWordRtMs!.length));
  const positions = Array.from({ length: maxWords }, (_, i) =>
    summarize(sprTrials.map(t => t.perWordRtMs![i]).filter((v): v is number => v !== undefined))
  );

  const byParticipant = [...participants].map(id => {
    const rows = allTrials.filter(t => t.participantId === id);
    return {
      id,
      cohort: rows.find(r => r.dominanceGroup)?.dominanceGroup,
      rows,
      rt: summarize(rows.map(r => r.readingTimeMs)),
      load: summarize(rows.map(r => r.cognitiveLoadScore)),
    };
  });

  return (
    <div className="space-y-6">

      {/* Dataset overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
        {[
          [tr('Сынақтар', 'Пробы', 'Trials'), allTrials.length],
          [tr('Қатысушылар', 'Участники', 'Participants'), participants.size],
          [tr('SPR сынақтары', 'Пробы SPR', 'SPR trials'), sprTrials.length],
          [tr('Шығыңқы мәндер', 'Выбросы', 'Flagged outliers'), outliers],
        ].map(([label, value]) => (
          <div key={label} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-[10px] uppercase text-slate-500 dark:text-slate-400 block">{label}</span>
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100">{value}</span>
          </div>
        ))}
      </div>

      {noCohort > 0 && (
        <p className="text-xs text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          {tr(`${noCohort} сынақта когорта белгісі жоқ (ескі жазбалар), олар когорта кестесіне кірмейді.`,
              `У ${noCohort} проб нет метки когорты (старые записи); они исключены из когортной таблицы.`,
              `${noCohort} trials have no cohort label (older records) and are excluded from the cohort table.`)}
        </p>
      )}

      <Section
        title={tr('Сөз тәртібі бойынша оқу уақыты', 'Время чтения по порядку слов', 'Reading time by word order')}
        note={tr('Барлық мәндер нақты сынақтардан есептелген. 95% CI t-үлестіріммен.', 'Все значения рассчитаны по реальным пробам. 95% ДИ по t-распределению.', 'Computed from recorded trials only. 95% CI uses the t distribution. RT in ms.')}
      >
        <table className={tableCls}>
          <thead className={headCls}>
            <tr>
              {['Order', 'n', 'Mean RT', 'SD', '95% CI ±', 'Median', 'Acc', 'P1 acc', 'P2 acc', 'P3 acc', 'Mean Q-RT', 'Load'].map(h => <th key={h} className={th}>{h}</th>)}
            </tr>
          </thead>
          <tbody className={bodyCls}>
            {ORDERS.map(o => {
              const rows = allTrials.filter(t => t.wordOrder === o);
              const s = condStats[o];
              return (
                <tr key={o}>
                  <td className={`${td} font-bold`}>{o}</td>
                  <td className={td}>{s.n}</td>
                  <td className={td}>{num(s.mean)}</td>
                  <td className={td}>{num(s.sd)}</td>
                  <td className={td}>{num(s.ci95)}</td>
                  <td className={td}>{num(s.median)}</td>
                  <td className={td}>{acc(rows)}</td>
                  <td className={td}>{acc(rows, t => t.part1Correct)}</td>
                  <td className={td}>{acc(rows, t => t.part2Correct)}</td>
                  <td className={td}>{acc(rows, t => t.part3Correct)}</td>
                  <td className={td}>{num(summarize(rows.map(t => t.questionResponseTimeMs)).mean)}</td>
                  <td className={td}>{num(summarize(rows.map(t => t.cognitiveLoadScore)).mean, 1)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Section>

      <Section
        title={tr('Сөз тәртібі × Когорта', 'Порядок слов × Когорта', 'Word order × Cohort')}
        note={tr('Әр ұяшық: орташа RT (мс) · дәлдік · n', 'Ячейка: средн. RT (мс) · точность · n', 'Cell: mean RT (ms) · accuracy · n')}
      >
        <table className={tableCls}>
          <thead className={headCls}>
            <tr>
              <th className={th}>Cohort</th>
              {ORDERS.map(o => <th key={o} className={th}>{o}</th>)}
            </tr>
          </thead>
          <tbody className={bodyCls}>
            {COHORTS.map(c => (
              <tr key={c}>
                <td className={`${td} font-bold`}>{COHORT_LABEL[c]}</td>
                {ORDERS.map(o => {
                  const rows = allTrials.filter(t => t.dominanceGroup === c && t.wordOrder === o);
                  return (
                    <td key={o} className={td}>
                      {rows.length ? `${num(summarize(rows.map(t => t.readingTimeMs)).mean)} · ${acc(rows)} · ${rows.length}` : '—'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <Section title={tr('CEFR деңгейі бойынша', 'По уровню CEFR', 'By CEFR level')}>
        <table className={tableCls}>
          <thead className={headCls}>
            <tr>{['Level', 'n', 'Mean RT', 'SD', 'Mean WPM', 'Acc'].map(h => <th key={h} className={th}>{h}</th>)}</tr>
          </thead>
          <tbody className={bodyCls}>
            {LEVELS.map(l => {
              const rows = allTrials.filter(t => t.cefrLevel === l);
              if (!rows.length) return null;
              const s = summarize(rows.map(t => t.readingTimeMs));
              return (
                <tr key={l}>
                  <td className={`${td} font-bold`}>{l}</td>
                  <td className={td}>{s.n}</td>
                  <td className={td}>{num(s.mean)}</td>
                  <td className={td}>{num(s.sd)}</td>
                  <td className={td}>{num(summarize(rows.map(t => t.readingSpeedWpm)).mean)}</td>
                  <td className={td}>{acc(rows)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Section>

      {positions.length > 0 && (
        <Section
          title={tr('SPR: сөз позициясы бойынша оқу уақыты', 'SPR: время чтения по позиции слова', 'SPR: reading time by word position')}
          note={tr('Тек сөзбе-сөз режиміндегі сынақтар.', 'Только пробы в пословном режиме.', 'Self-paced trials only. RT in ms.')}
        >
          <table className={tableCls}>
            <thead className={headCls}>
              <tr>{['Position', 'n', 'Mean', 'SD', 'Median'].map(h => <th key={h} className={th}>{h}</th>)}</tr>
            </thead>
            <tbody className={bodyCls}>
              {positions.map((s, i) => (
                <tr key={i}>
                  <td className={`${td} font-bold`}>W{i + 1}</td>
                  <td className={td}>{s.n}</td>
                  <td className={td}>{num(s.mean)}</td>
                  <td className={td}>{num(s.sd)}</td>
                  <td className={td}>{num(s.median)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>
      )}

      <Section title={tr('Қатысушылар бойынша', 'По участникам', 'By participant')}>
        <table className={tableCls}>
          <thead className={headCls}>
            <tr>{['Participant', 'Cohort', 'n', 'Acc', 'Mean RT', 'SD', 'Load'].map(h => <th key={h} className={th}>{h}</th>)}</tr>
          </thead>
          <tbody className={bodyCls}>
            {byParticipant.map(p => (
              <tr key={p.id}>
                <td className={`${td} font-bold`}>{p.id}</td>
                <td className={td}>{p.cohort ? COHORT_LABEL[p.cohort] : '—'}</td>
                <td className={td}>{p.rows.length}</td>
                <td className={td}>{acc(p.rows)}</td>
                <td className={td}>{num(p.rt.mean)}</td>
                <td className={td}>{num(p.rt.sd)}</td>
                <td className={td}>{num(p.load.mean, 1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

    </div>
  );
};
