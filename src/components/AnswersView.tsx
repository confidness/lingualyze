import React, { useEffect, useMemo, useState } from 'react';
import { Search, RefreshCw, X, Check, ClipboardList } from 'lucide-react';
import { LanguageCode, LanguageDominanceGroup, StoredTestRecord, WordOrderCondition } from '../types';
import { storageEngine, DB_CHANGE_EVENT } from '../utils/storageEngine';
import { skillNames } from './MyResults';

interface Person {
  id: string;
  name: string;
  phone?: string;
  age?: number;
  cohort: LanguageDominanceGroup;
  records: StoredTestRecord[]; // newest first
  score: number;
  skills: number[];
  avgReadMs: number;
  last: string;
}

const pct = (part: number, whole: number) => (whole > 0 ? Math.round((part / whole) * 100) : 0);
const ORDERS: WordOrderCondition[] = ['SOV', 'OSV', 'SVO', 'OVS'];

const toPeople = (records: StoredTestRecord[]): Person[] => {
  const byId = new Map<string, StoredTestRecord[]>();
  records.forEach(r => byId.set(r.participant_id, [...(byId.get(r.participant_id) ?? []), r]));
  return [...byId.entries()].map(([id, rs]) => {
    const sorted = [...rs].sort((a, b) => b.timestamp.localeCompare(a.timestamp));
    const d = sorted.map(r => r.detailed_responses[0]).filter(Boolean);
    const first = sorted[0];
    return {
      id,
      name: first.student_name || id,
      phone: first.phone_number,
      age: first.age,
      cohort: first.cohort,
      records: sorted,
      score: pct(d.filter(x => x.is_overall_correct).length, d.length),
      skills: [
        pct(d.filter(x => x.part1_correct).length, d.length),
        pct(d.filter(x => x.part2_correct).length, d.length),
        pct(d.filter(x => x.part3_correct).length, d.length),
      ],
      avgReadMs: sorted.reduce((a, r) => a + r.reading_time_ms, 0) / sorted.length,
      last: first.timestamp,
    };
  }).sort((a, b) => b.last.localeCompare(a.last));
};

export const AnswersView: React.FC<{ lang: LanguageCode }> = ({ lang }) => {
  const tr = (kk: string, ru: string, en: string) => (lang === 'kk' ? kk : lang === 'ru' ? ru : en);
  const locale = lang === 'kk' ? 'kk-KZ' : lang === 'ru' ? 'ru-RU' : 'en-GB';
  const when = (iso: string) => new Date(iso).toLocaleString(locale, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  const sec = (ms: number) => `${(ms / 1000).toFixed(1)} ${lang === 'en' ? 's' : 'сек'}`;
  const groupName = (c: LanguageDominanceGroup) =>
    c === 'kazakh_dominant' ? tr('Негізінен қазақша', 'В основном казахский', 'Mostly Kazakh')
    : c === 'bilingual_balanced' ? tr('Екі тілде', 'Двуязычный', 'Bilingual')
    : tr('Үйренуші', 'Изучает язык', 'Learner');

  const [records, setRecords] = useState<StoredTestRecord[]>(() => storageEngine.getAllSessions());
  useEffect(() => {
    const load = () => setRecords(storageEngine.getAllSessions());
    window.addEventListener(DB_CHANGE_EVENT, load);
    return () => window.removeEventListener(DB_CHANGE_EVENT, load);
  }, []);

  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const people = useMemo(() => toPeople(records), [records]);
  const q = query.trim().toLowerCase();
  const shown = q ? people.filter(p => [p.name, p.phone, p.id].some(v => v?.toLowerCase().includes(q))) : people;
  const selected = people.find(p => p.id === selectedId);

  const refresh = async () => {
    setRefreshing(true);
    await storageEngine.syncWithCentralBackend();
    setRefreshing(false);
  };

  const open = (id: string) => {
    setSelectedId(id);
    requestAnimationFrame(() => document.getElementById('answer-sheet')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-slate-100">
            {tr('Жауаптар', 'Ответы', 'Answers')}
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {tr(
              `${people.length} қатысушы, ${records.length} сөйлем. Адамды таңдап, оның әр жауабын көріңіз.`,
              `${people.length} участников, ${records.length} предложений. Выберите человека, чтобы увидеть каждый ответ.`,
              `${people.length} people, ${records.length} sentences. Pick a person to see every answer.`
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="relative">
            <span className="sr-only">{tr('Іздеу', 'Поиск', 'Search')}</span>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={tr('Аты, телефон немесе ID', 'Имя, телефон или ID', 'Name, phone or ID')}
              className="w-56 sm:w-64 pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30"
            />
          </label>
          <button
            type="button"
            onClick={refresh}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{tr('Жаңарту', 'Обновить', 'Refresh')}</span>
          </button>
        </div>
      </header>

      {/* People */}
      <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
        {shown.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-500 dark:text-slate-400">
            <ClipboardList className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
            {people.length === 0
              ? tr('Әзірге ешкім тест тапсырған жоқ.', 'Пока никто не прошёл тест.', 'Nobody has taken the test yet.')
              : tr('Ешкім табылмады.', 'Никого не найдено.', 'No one matches that search.')}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold">{tr('Аты-жөні', 'Имя', 'Name')}</th>
                  <th className="px-4 py-3 font-semibold">{tr('Телефон', 'Телефон', 'Phone')}</th>
                  <th className="px-4 py-3 font-semibold">{tr('Жасы', 'Возраст', 'Age')}</th>
                  <th className="px-4 py-3 font-semibold">{tr('Тілі', 'Язык', 'Language')}</th>
                  <th className="px-4 py-3 font-semibold text-right">{tr('Сөйлем', 'Предл.', 'Sentences')}</th>
                  <th className="px-4 py-3 font-semibold text-right">{tr('Нәтиже', 'Результат', 'Score')}</th>
                  <th className="px-4 py-3 font-semibold">{tr('Дағдылар', 'Навыки', 'Skills')}</th>
                  <th className="px-4 py-3 font-semibold">{tr('Соңғы рет', 'Последний раз', 'Last active')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {shown.map(p => (
                  <tr
                    key={p.id}
                    onClick={() => open(p.id)}
                    className={`cursor-pointer hover:bg-emerald-50/60 dark:hover:bg-emerald-950/20 ${p.id === selectedId ? 'bg-emerald-50 dark:bg-emerald-950/30' : ''}`}
                  >
                    <td className="px-4 py-3">
                      <button type="button" onClick={e => { e.stopPropagation(); open(p.id); }} className="font-semibold text-slate-900 dark:text-slate-100 hover:underline text-left cursor-pointer">
                        {p.name}
                      </button>
                      <span className="block text-[11px] font-mono text-slate-400">{p.id}</span>
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-700 dark:text-slate-300 whitespace-nowrap">{p.phone || '—'}</td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{p.age ?? '—'}</td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300 whitespace-nowrap">{groupName(p.cohort)}</td>
                    <td className="px-4 py-3 text-right text-slate-700 dark:text-slate-300">{p.records.length}</td>
                    <td className="px-4 py-3 text-right font-bold text-slate-900 dark:text-slate-100">{p.score}%</td>
                    <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-500 dark:text-slate-400" title={skillNames(lang).join(' / ')}>
                      {p.skills.map(s => `${s}%`).join(' / ')}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-slate-500 dark:text-slate-400">{when(p.last)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* One person's answer sheet */}
      {selected && (
        <section id="answer-sheet" className="scroll-mt-24 space-y-4">
          <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-xl font-semibold text-slate-900 dark:text-slate-100">{selected.name}</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {[selected.phone, selected.age ? tr(`${selected.age} жас`, `${selected.age} лет`, `age ${selected.age}`) : null, groupName(selected.cohort)].filter(Boolean).join(', ')}
                </p>
              </div>
              <button type="button" onClick={() => setSelectedId(null)} aria-label={tr('Жабу', 'Закрыть', 'Close')} className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-6 items-start">
              <div>
                <span className="text-4xl font-extrabold text-slate-900 dark:text-slate-100">{selected.score}%</span>
                <span className="block text-sm text-slate-500 dark:text-slate-400">
                  {tr(`${selected.records.length} сөйлемнен дұрыс`, `верно из ${selected.records.length}`, `correct of ${selected.records.length}`)}
                </span>
                <span className="block mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {tr('Орташа оқу', 'Среднее чтение', 'Avg reading')}: {sec(selected.avgReadMs)}
                </span>
              </div>

              <div className="space-y-2.5">
                {skillNames(lang).map((name, i) => (
                  <div key={name}>
                    <div className="flex justify-between text-xs text-slate-600 dark:text-slate-300">
                      <span>{name}</span><span className="font-bold">{selected.skills[i]}%</span>
                    </div>
                    <div className="mt-1 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div className="h-full rounded-full bg-emerald-600" style={{ width: `${selected.skills[i]}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* The hypothesis at the level of one person */}
              <table className="text-xs font-mono border border-slate-200 dark:border-slate-800">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300">
                  <tr><th className="px-2.5 py-1.5 text-left">{tr('Тәртіп', 'Порядок', 'Order')}</th><th className="px-2.5 py-1.5 text-right">n</th><th className="px-2.5 py-1.5 text-right">%</th><th className="px-2.5 py-1.5 text-right">{tr('Оқу', 'Чтение', 'Read')}</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {ORDERS.map(o => {
                    const rs = selected.records.filter(r => r.word_order === o);
                    return (
                      <tr key={o}>
                        <td className="px-2.5 py-1.5 font-bold">{o}</td>
                        <td className="px-2.5 py-1.5 text-right">{rs.length}</td>
                        <td className="px-2.5 py-1.5 text-right">{rs.length ? `${pct(rs.filter(r => r.detailed_responses[0]?.is_overall_correct).length, rs.length)}` : '—'}</td>
                        <td className="px-2.5 py-1.5 text-right">{rs.length ? sec(rs.reduce((a, r) => a + r.reading_time_ms, 0) / rs.length) : '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <ol className="space-y-3">
            {selected.records.map(r => {
              const d = r.detailed_responses[0];
              const a = r.answers;
              const parts = [
                { ok: d?.part1_correct, question: a?.question1, chosen: a?.part1, expected: a?.part1_expected },
                { ok: d?.part2_correct, question: undefined, chosen: a?.part2, expected: a?.part2_expected },
                { ok: d?.part3_correct, question: a?.question3, chosen: a?.part3, expected: a?.part3_expected },
              ];
              return (
                <li key={r.test_id} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                    <span>{when(r.timestamp)}</span>
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{r.cefr_level}</span>
                    <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">{r.word_order}</span>
                    <span>{tr('Оқу', 'Чтение', 'Reading')}: {sec(r.reading_time_ms)}</span>
                    <span>{tr('Жауап', 'Ответ', 'Answering')}: {sec(r.reaction_time_ms)}</span>
                    <span className={`ml-auto font-semibold ${d?.is_overall_correct ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                      {d?.is_overall_correct ? tr('Дұрыс', 'Верно', 'Correct') : tr('Қате', 'Ошибка', 'Wrong')}
                    </span>
                  </div>
                  <p lang="kk" className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-100">«{d?.sentence_kazakh}»</p>

                  <dl className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                    {parts.map((part, i) => (
                      <div key={i} className={`p-3 rounded-xl border text-sm ${part.ok ? 'border-emerald-200 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/20' : 'border-rose-200 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/20'}`}>
                        <dt className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                          {part.ok ? <Check className="w-4 h-4 text-emerald-600" /> : <X className="w-4 h-4 text-rose-600" />}
                          {skillNames(lang)[i]}
                        </dt>
                        {part.question && <dd lang="kk" className="mt-1 text-xs text-slate-500 dark:text-slate-400">{part.question}</dd>}
                        {part.chosen ? (
                          <dd lang="kk" className="mt-1.5 text-slate-800 dark:text-slate-200">
                            <span className="text-xs text-slate-500 dark:text-slate-400">{tr('Жауабы', 'Ответ', 'Answered')}: </span>{part.chosen}
                          </dd>
                        ) : (
                          <dd className="mt-1.5 text-xs text-slate-400">{tr('Жауап мәтіні сақталмаған', 'Текст ответа не сохранён', 'Answer text not recorded')}</dd>
                        )}
                        {!part.ok && part.expected && (
                          <dd lang="kk" className="mt-1 text-slate-800 dark:text-slate-200">
                            <span className="text-xs text-slate-500 dark:text-slate-400">{tr('Дұрысы', 'Правильно', 'Correct')}: </span>{part.expected}
                          </dd>
                        )}
                      </div>
                    ))}
                  </dl>
                </li>
              );
            })}
          </ol>
        </section>
      )}
    </div>
  );
};
