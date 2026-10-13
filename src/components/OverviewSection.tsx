import React from 'react';
import {
  Play,
  ArrowRight,
  UserPlus,
  BookOpenText,
  Trophy,
  MessageSquareText,
  ListOrdered,
  SpellCheck,
  Clock
} from 'lucide-react';
import { ActiveTab, LanguageCode, ParticipantProfile, TrialResult } from '../types';
import { skillNames } from './MyResults';

interface OverviewSectionProps {
  setActiveTab: (tab: ActiveTab) => void;
  lang: LanguageCode;
  allTrials?: TrialResult[];
  currentParticipant?: ParticipantProfile;
}

export const OverviewSection: React.FC<OverviewSectionProps> = ({
  setActiveTab,
  lang,
  allTrials = [],
  currentParticipant
}) => {
  const tr = (kk: string, ru: string, en: string) => (lang === 'kk' ? kk : lang === 'ru' ? ru : en);

  const myTrials = currentParticipant
    ? allTrials.filter(t => t.participantId === currentParticipant.id)
    : [];
  const myScore = myTrials.length > 0
    ? Math.round((myTrials.filter(t => t.isCorrect).length / myTrials.length) * 100)
    : null;
  const firstName = currentParticipant?.studentName?.split(' ')[0];

  const steps = [
    {
      icon: <UserPlus className="w-5 h-5" />,
      title: tr('Атыңызды енгізіңіз', 'Введите своё имя', 'Enter your name'),
      desc: tr('Нәтижеңіз сақталуы үшін бірнеше жолды толтырыңыз.', 'Заполните пару полей, чтобы сохранить результат.', 'Fill in a few fields so your result is saved.'),
    },
    {
      icon: <BookOpenText className="w-5 h-5" />,
      title: tr('Сөйлемдерді оқыңыз', 'Читайте предложения', 'Read the sentences'),
      desc: tr('Әр сөйлемнен кейін 3 қысқа сұраққа жауап беріңіз.', 'После каждого предложения ответьте на 3 коротких вопроса.', 'Answer 3 short questions after each sentence.'),
    },
    {
      icon: <Trophy className="w-5 h-5" />,
      title: tr('Нәтижеңізді көріңіз', 'Узнайте результат', 'See your results'),
      desc: tr('Қай жерде мықты екеніңізді және нені жаттықтыру керегін білесіз.', 'Узнаете свои сильные стороны и что стоит подтянуть.', 'Find out what you are good at and what to practice.'),
    },
  ];

  const skills = [
    {
      icon: <MessageSquareText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      title: skillNames(lang)[0],
      desc: tr('Сөйлемде кім не істегенін дұрыс түсіндіңіз бе?', 'Поняли ли вы, кто и что сделал в предложении?', 'Did you get who did what in the sentence?'),
    },
    {
      icon: <ListOrdered className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
      title: skillNames(lang)[1],
      desc: tr('Сөйлемдегі ойды суреттермен ретімен құрастыра аласыз ба?', 'Сможете ли выстроить картинки в порядке предложения?', 'Can you put the pictures in the order of the sentence?'),
    },
    {
      icon: <SpellCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
      title: skillNames(lang)[2],
      desc: tr('Бір ғана жалғау мағынаны қалай өзгертетінін байқайсыз ба?', 'Замечаете ли, как одно окончание меняет смысл?', 'Do you notice how one ending changes the meaning?'),
    },
  ];

  return (
    <div className="space-y-8 pb-16">

      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 sm:p-12 shadow-sm">
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-emerald-50/60 dark:bg-emerald-950/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-5">
            <Clock className="w-3.5 h-3.5" />
            <span>{tr('Тегін • шамамен 10 минут', 'Бесплатно • около 10 минут', 'Free • about 10 minutes')}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 leading-tight">
            {firstName
              ? tr(`Сәлем, ${firstName}!`, `Привет, ${firstName}!`, `Hi, ${firstName}!`)
              : tr('Қазақша қаншалықты жақсы оқисыз?', 'Насколько хорошо вы читаете по-казахски?', 'How well do you read Kazakh?')}
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            {tr(
              'Қысқа сөйлемдерді оқып, қарапайым сұрақтарға жауап беріңіз. Соңында нәтижеңізді және жеке кеңестерді аласыз.',
              'Прочитайте короткие предложения и ответьте на простые вопросы. В конце вы получите свой результат и советы.',
              'Read short sentences and answer simple questions. At the end you get your score and personal tips.'
            )}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              id="hero-start-experiment-btn"
              onClick={() => setActiveTab('experiment')}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{myTrials.length > 0 ? tr('Тестті қайта тапсыру', 'Пройти тест снова', 'Take the test again') : tr('Тестті бастау', 'Начать тест', 'Start the test')}</span>
            </button>

            {myTrials.length > 0 && (
              <button
                onClick={() => setActiveTab('results')}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm transition-all cursor-pointer"
              >
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>{tr('Менің нәтижелерім', 'Мои результаты', 'My results')}</span>
              </button>
            )}
          </div>

          {/* Last result teaser for returning visitors */}
          {myScore !== null && (
            <p className="mt-5 text-sm text-slate-600 dark:text-slate-300">
              {tr(
                `Соңғы нәтижеңіз: ${myTrials.length} сөйлемнің ${myScore}%-ы дұрыс.`,
                `Ваш результат: ${myScore}% верных ответов из ${myTrials.length} предложений.`,
                `Your result so far: ${myScore}% correct across ${myTrials.length} sentences.`
              )}
            </p>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          {tr('Бұл қалай жұмыс істейді', 'Как это работает', 'How it works')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {steps.map((s, i) => (
            <div key={i} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                  {s.icon}
                </span>
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500">{i + 1}</span>
              </div>
              <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-slate-100">{s.title}</h3>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What the test checks */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          {tr('Тест нені тексереді', 'Что проверяет тест', 'What the test checks')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {skills.map((s, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="mt-0.5 shrink-0">{s.icon}</span>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{s.title}</h3>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => setActiveTab('experiment')}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
        >
          <span>{tr('Өзіңізді тексеріңіз', 'Проверьте себя', 'Try it yourself')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>

    </div>
  );
};
