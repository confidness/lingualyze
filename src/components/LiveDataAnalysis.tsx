import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { CEFRLevel, LanguageCode, LanguageDominanceGroup, StimulusSentence, TrialResult, WordOrderCondition } from '../types';
import { summarize, pearson } from '../utils/statistics';

interface LiveDataAnalysisProps {
  allTrials: TrialResult[];
  lang: LanguageCode;
  stimuli?: StimulusSentence[]; // to show sentence text in the item analysis
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

export const LiveDataAnalysis: React.FC<LiveDataAnalysisProps> = ({ allTrials, lang, stimuli = [] }) => {
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

  // Score distribution: each participant's overall accuracy in 10-point bins
  const accuracy = (rows: TrialResult[]) => rows.filter(r => r.isCorrect).length / rows.length;
  const trialsOf = new Map<string, TrialResult[]>();
  allTrials.forEach(t => trialsOf.set(t.participantId, [...(trialsOf.get(t.participantId) ?? []), t]));
  const scores = [...trialsOf.values()].map(rows => Math.round(accuracy(rows) * 100));
  const bins = Array.from({ length: 10 }, (_, i) => ({ from: i * 10, to: i === 9 ? 100 : i * 10 + 9, count: 0 }));
  scores.forEach(s => bins[Math.min(9, Math.floor(s / 10))].count++);
  const maxBin = Math.max(1, ...bins.map(b => b.count));
  const scoreStats = summarize(scores);
  const speedAccuracy = pearson(allTrials.map(t => t.readingTimeMs), allTrials.map(t => (t.isCorrect ? 1 : 0)));

  // Item analysis: difficulty (share correct) and discrimination (corrected item-total correlation:
  // correct on this sentence vs the same person's accuracy on all their other sentences)
  const sentenceOf = new Map(stimuli.map(s => [s.id, s.sentenceKazakh]));
  const itemRows = new Map<string, TrialResult[]>();
  allTrials.forEach(t => itemRows.set(t.stimulusId, [...(itemRows.get(t.stimulusId) ?? []), t]));
  const items = [...itemRows.entries()].map(([id, rows]) => {
    const xs: number[] = [];
    const ys: number[] = [];
    rows.forEach(r => {
      const others = (trialsOf.get(r.participantId) ?? []).filter(o => o !== r);
      if (others.length) {
        xs.push(r.isCorrect ? 1 : 0);
        ys.push(accuracy(others));
      }
    });
    return {
      id,
      sentence: sentenceOf.get(id) ?? id,
      order: rows[0].wordOrder,
      level: rows[0].cefrLevel,
      rows,
      p: accuracy(rows),
      rt: summarize(rows.map(r => r.readingTimeMs)).mean,
      disc: xs.length >= 5 ? pearson(xs, ys) : NaN,
    };
  }).sort((a, b) => a.p - b.p);
  const flag = (it: (typeof items)[number]) =>
    it.disc < 0 ? tr('Тексеру керек', 'Проверить', 'Review')
    : it.rows.length >= 5 && it.p >= 0.9 ? tr('Тым оңай', 'Слишком лёгкое', 'Too easy')
    : it.rows.length >= 5 && it.p <= 0.3 ? tr('Тым қиын', 'Слишком трудное', 'Too hard')
    : '';

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
        title={tr('Нәтижелердің таралуы', 'Распределение результатов', 'Score distribution')}
        note={tr(
          `Әр қатысушының дұрыс жауап үлесі. Орташа ${Math.round(scoreStats.mean)}%, медиана ${Math.round(scoreStats.median)}%. Жылдамдық пен дәлдік байланысы r = ${num(speedAccuracy, 2)} (теріс мән: баяу оқу қатемен қатар жүреді).`,
          `Доля верных ответов каждого участника. Среднее ${Math.round(scoreStats.mean)}%, медиана ${Math.round(scoreStats.median)}%. Связь скорости и точности r = ${num(speedAccuracy, 2)} (отрицательное значение: медленное чтение сопровождает ошибки).`,
          `Each participant's share of correct answers. Mean ${Math.round(scoreStats.mean)}%, median ${Math.round(scoreStats.median)}%. Speed–accuracy r = ${num(speedAccuracy, 2)} (negative: slower reading goes with wrong answers).`
        )}
      >
        <div className="space-y-0.5 max-w-xl" role="list">
          {bins.map(b => (
            <div
              key={b.from}
              role="listitem"
              title={tr(`${b.from}–${b.to}%: ${b.count} адам`, `${b.from}–${b.to}%: ${b.count} чел.`, `${b.from}–${b.to}%: ${b.count} people`)}
              className="flex items-center gap-3 text-xs"
            >
              <span className="w-16 shrink-0 text-right font-mono text-slate-500 dark:text-slate-400">{b.from}–{b.to}%</span>
              <span className="flex-1 h-5 flex items-center gap-2">
                {b.count > 0 && (
                  <span className="h-full rounded-r-[4px] bg-emerald-600 dark:bg-emerald-500" style={{ width: `${(b.count / maxBin) * 100}%` }} />
                )}
                <span className="font-mono text-slate-700 dark:text-slate-300">{b.count}</span>
              </span>
            </div>
          ))}
        </div>
      </Section>

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

      <Section
        title={tr('Сөйлемдер талдауы', 'Анализ предложений', 'Sentence (item) analysis')}
        note={tr(
          'Ең қиын сөйлемдер жоғарыда. Дұрыс: сөйлемге дұрыс жауап бергендер үлесі. Ажырату: осы сөйлемдегі нәтиже мен адамның басқа сөйлемдердегі нәтижесінің корреляциясы (0.3-тен жоғары жақсы, теріс мән сөйлемді тексеруді қажет етеді; n ≥ 5).',
          'Самые трудные предложения сверху. Верно: доля верных ответов. Различение: корреляция ответа на это предложение с результатом человека на остальных (выше 0.3 хорошо, отрицательное значение требует проверки; n ≥ 5).',
          'Hardest sentences first. Correct: share who answered it right. Discrimination: correlation between this sentence and the same person’s score on their other sentences (above 0.3 is good; negative means review the sentence; needs n ≥ 5).'
        )}
      >
        <div className="max-h-[28rem] overflow-auto">
          <table className={tableCls}>
            <thead className={`${headCls} sticky top-0`}>
              <tr>
                {[tr('Сөйлем', 'Предложение', 'Sentence'), 'Order', 'Level', 'n', tr('Дұрыс', 'Верно', 'Correct'), 'P1', 'P2', 'P3', 'Mean RT', tr('Ажырату', 'Различение', 'Discrimination'), ''].map((h, i) => <th key={i} className={th}>{h}</th>)}
              </tr>
            </thead>
            <tbody className={bodyCls}>
              {items.map(it => (
                <tr key={it.id}>
                  <td lang="kk" className="p-2.5 font-sans min-w-[16rem] max-w-[22rem]">{it.sentence}</td>
                  <td className={`${td} font-bold`}>{it.order}</td>
                  <td className={td}>{it.level ?? '—'}</td>
                  <td className={td}>{it.rows.length}</td>
                  <td className={`${td} font-bold`}>{Math.round(it.p * 100)}%</td>
                  <td className={td}>{acc(it.rows, t => t.part1Correct)}</td>
                  <td className={td}>{acc(it.rows, t => t.part2Correct)}</td>
                  <td className={td}>{acc(it.rows, t => t.part3Correct)}</td>
                  <td className={td}>{num(it.rt)}</td>
                  <td className={td}>{num(it.disc, 2)}</td>
                  <td className={`${td} font-sans`}>
                    {flag(it) && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
                        <AlertTriangle className="w-3 h-3" />
                        {flag(it)}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
