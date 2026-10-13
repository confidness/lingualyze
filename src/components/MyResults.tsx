import React from 'react';
import { Play, Trophy, Lightbulb, Clock, CheckCircle2, BookOpenText } from 'lucide-react';
import { ActiveTab, CEFRLevel, LanguageCode, ParticipantProfile, TrialResult } from '../types';
import { translations } from '../data/translations';

// Plain-language names of the 3 test parts, shared with the test runner
export const skillNames = (lang: LanguageCode) =>
  lang === 'kk' ? ['Мағынасын түсіну', 'Оқиғалар реті', 'Сөз жалғаулары']
  : lang === 'ru' ? ['Понимание смысла', 'Порядок событий', 'Окончания слов']
  : ['Understanding meaning', 'Order of events', 'Word endings'];

const skillTips = (lang: LanguageCode) =>
  lang === 'kk' ? [
    'Оқығаннан кейін сөйлемді өз сөзіңізбен қайталап көріңіз: кім? не істеді?',
    'Сөйлемді бөліктерге бөліп, оқиғалардың ретін бақылаңыз. Қазақ тілінде етістік әдетте сөйлемнің соңында тұрады.',
    'Септік жалғауларына (-ға/-ге, -дан/-ден, -ды/-ді) көңіл бөліңіз: олар кім кімге не істегенін көрсетеді.',
  ] : lang === 'ru' ? [
    'После чтения перескажите предложение своими словами: кто? что сделал?',
    'Делите предложение на части и следите за порядком событий. В казахском глагол обычно стоит в конце.',
    'Обращайте внимание на падежные окончания (-ға/-ге, -дан/-ден, -ды/-ді): они показывают, кто кому что сделал.',
  ] : [
    'After reading, retell the sentence in your own words: who did what?',
    'Split the sentence into parts and follow the order of events. In Kazakh the verb usually comes last.',
    'Watch the case endings (-ға/-ге, -дан/-ден, -ды/-ді): they show who did what to whom.',
  ];

const pct = (part: number, whole: number) => (whole > 0 ? Math.round((part / whole) * 100) : 0);

interface MyResultsProps {
  allTrials: TrialResult[];
  currentParticipant: ParticipantProfile;
  lang: LanguageCode;
  setActiveTab: (tab: ActiveTab) => void;
}

export const MyResults: React.FC<MyResultsProps> = ({ allTrials, currentParticipant, lang, setActiveTab }) => {
  const t = translations[lang] as Record<string, string>;
  const tr = (kk: string, ru: string, en: string) => (lang === 'kk' ? kk : lang === 'ru' ? ru : en);
  const mine = allTrials.filter(trial => trial.participantId === currentParticipant.id);

  if (mine.length === 0) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm text-center space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
          <Trophy className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {tr('Әзірге нәтиже жоқ', 'Пока нет результатов', 'No results yet')}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {tr('Тестті тапсырыңыз, сонда нәтижеңіз осында пайда болады.', 'Пройдите тест, и ваш результат появится здесь.', 'Take the test and your results will show up here.')}
          </p>
        </div>
        <button
          onClick={() => setActiveTab('experiment')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm cursor-pointer"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>{tr('Тестті бастау', 'Начать тест', 'Start the test')}</span>
        </button>
      </div>
    );
  }

  const score = pct(mine.filter(trial => trial.isCorrect).length, mine.length);
  const avgReadSec = (mine.reduce((a, b) => a + b.readingTimeMs, 0) / mine.length / 1000).toFixed(1);

  const skillScores = [
    mine.filter(x => x.part1Correct !== undefined),
    mine.filter(x => x.part2Correct !== undefined),
    mine.filter(x => x.part3Correct !== undefined),
  ].map((rows, i) => pct(rows.filter(x => [x.part1Correct, x.part2Correct, x.part3Correct][i]).length, rows.length));
  const weakest = skillScores.indexOf(Math.min(...skillScores));

  const verdict = score >= 85
    ? { title: tr('Тамаша!', 'Отлично!', 'Excellent!'), text: tr('Сіз қазақша мәтінді сенімді түсінесіз.', 'Вы уверенно понимаете текст на казахском.', 'You understand Kazakh text with confidence.') }
    : score >= 65
    ? { title: tr('Жақсы нәтиже', 'Хороший результат', 'Good result'), text: tr('Негізгі мағынаны түсінесіз, бірақ кейбір тұстарды жаттықтырған жөн.', 'Вы понимаете основной смысл, но кое-что стоит потренировать.', 'You get the main idea, but a few things are worth practicing.') }
    : { title: tr('Жаттығуды жалғастырыңыз', 'Продолжайте тренироваться', 'Keep practicing'), text: tr('Төмендегі кеңес көмектеседі. Жеңілірек деңгейден бастап көріңіз.', 'Совет ниже поможет. Попробуйте начать с более лёгкого уровня.', 'The tip below will help. Try starting at an easier level.') };

  const levels = (['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as CEFRLevel[])
    .map(lvl => {
      const rows = mine.filter(x => x.cefrLevel === lvl);
      return { lvl, n: rows.length, score: pct(rows.filter(x => x.isCorrect).length, rows.length) };
    })
    .filter(l => l.n > 0);

  const barColor = (v: number) => (v >= 85 ? 'bg-emerald-500' : v >= 65 ? 'bg-amber-500' : 'bg-rose-500');

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">

      {/* Headline score */}
      <section className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {currentParticipant.studentName || tr('Сіздің нәтижеңіз', 'Ваш результат', 'Your result')}
        </p>
        <div className="mt-2 flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-8">
          <div>
            <span className="text-6xl font-extrabold text-slate-900 dark:text-slate-100">{score}%</span>
            <span className="block text-sm text-slate-500 dark:text-slate-400">{tr('дұрыс жауап', 'верных ответов', 'correct')}</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">{verdict.title}</h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{verdict.text}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 flex items-center gap-2.5">
            <BookOpenText className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="text-slate-700 dark:text-slate-200">
              <strong>{mine.length}</strong> {tr('сөйлем оқылды', 'предложений прочитано', 'sentences read')}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="text-slate-700 dark:text-slate-200">
              <strong>{avgReadSec} {lang === 'en' ? 's' : 'сек'}</strong> {tr('бір сөйлемге орта есеппен', 'в среднем на предложение', 'per sentence on average')}
            </span>
          </div>
        </div>
      </section>

      {/* Skill breakdown */}
      <section className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-5">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          {tr('Дағдыларыңыз', 'Ваши навыки', 'Your skills')}
        </h2>
        {skillNames(lang).map((name, i) => (
          <div key={name}>
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-slate-800 dark:text-slate-200">{name}</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">{skillScores[i]}%</span>
            </div>
            <div
              className="mt-1.5 h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden"
              role="progressbar" aria-valuenow={skillScores[i]} aria-valuemin={0} aria-valuemax={100} aria-label={name}
            >
              <div className={`h-full rounded-full ${barColor(skillScores[i])}`} style={{ width: `${skillScores[i]}%` }} />
            </div>
          </div>
        ))}

        {skillScores[weakest] < 100 ? (
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-sm">
              <span className="font-bold text-slate-900 dark:text-slate-100 block">
                {tr('Кеңес', 'Совет', 'Tip')}: {skillNames(lang)[weakest]}
              </span>
              <p className="text-slate-700 dark:text-slate-300 mt-0.5">{skillTips(lang)[weakest]}</p>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 flex items-center gap-3 text-sm text-slate-800 dark:text-slate-200">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{tr('Барлық тапсырма мінсіз! Келесі жолы қиынырақ деңгейді таңдап көріңіз.', 'Все задания без ошибок! В следующий раз попробуйте уровень сложнее.', 'Every task perfect! Next time try a harder level.')}</span>
          </div>
        )}
      </section>

      {/* By level */}
      {levels.length > 1 && (
        <section className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {tr('Деңгей бойынша', 'По уровням', 'By level')}
          </h2>
          <ul className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
            {levels.map(l => (
              <li key={l.lvl} className="py-2.5 flex items-center justify-between gap-4">
                <span className="text-slate-700 dark:text-slate-200">{t[`level${l.lvl}`] || l.lvl}</span>
                <span className="text-slate-500 dark:text-slate-400 shrink-0">
                  <strong className="text-slate-900 dark:text-slate-100">{l.score}%</strong> · {l.n} {tr('сөйлем', 'предл.', 'sentences')}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="flex justify-center">
        <button
          onClick={() => setActiveTab('experiment')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm cursor-pointer"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>{tr('Тестті қайта тапсыру', 'Пройти тест снова', 'Take the test again')}</span>
        </button>
      </div>
    </div>
  );
};
