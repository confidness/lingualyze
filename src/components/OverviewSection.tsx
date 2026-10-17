import React, { lazy, Suspense } from 'react';
import {
  Play,
  ArrowRight,
  UserPlus,
  BookOpenText,
  Trophy,
  MessageSquareText,
  ListOrdered,
  SpellCheck,
  Clock,
  FlaskConical,
  ArrowDown,
  Shuffle,
  Timer,
  Users
} from 'lucide-react';
import { ActiveTab, LanguageCode, ParticipantProfile, TrialResult } from '../types';
import { skillNames } from './MyResults';
import { LivingSentence } from './LivingSentence';

// Three.js loads in its own chunk so it doesn't delay the first paint
const LogoBlocks3D = lazy(() => import('./LogoBlocks3D'));

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

  // Plain-language versions of H1/H2 from the Methodology tab
  const hypotheses = [
    {
      id: 'H1',
      title: tr('Сөз тәртібі өзгерсе, оқу баяулайды', 'Изменённый порядок слов замедляет чтение', 'Changing word order slows reading'),
      text: tr(
        'Қазақ тілінде әдеттегі тәртіп: Бастауыш → Толықтауыш → Баяндауыш (SOV). Сөздердің орны ауысса (мысалы, толықтауыш алдымен тұрса, OSV), адамдар сөйлемді 20–30% баяу оқиды, бірақ мағынасын бәрібір түсінеді деп болжаймыз.',
        'Обычный порядок в казахском: Подлежащее → Дополнение → Сказуемое (SOV). Мы предполагаем, что при перестановке слов (например, дополнение в начале, OSV) люди читают на 20–30% медленнее, но смысл всё равно понимают.',
        'Kazakh normally goes Subject → Object → Verb (SOV). We predict that when words are moved (for example, the object first, OSV), people read 20–30% slower but still understand the meaning.'
      ),
      examples: [
        { order: 'SOV', text: 'Бала алманы жеді.' },
        { order: 'OSV', text: 'Алманы бала жеді.' },
      ],
      note: tr('Екі сөйлемнің мағынасы бірдей.', 'Оба предложения значат «Мальчик съел яблоко».', 'Both mean “The boy ate the apple.”'),
    },
    {
      id: 'H2',
      title: tr('Орыс тілін білу «орысша» тәртіпті жеңілдетеді', 'Знание русского облегчает «русский» порядок слов', 'Knowing Russian makes Russian-style order easier'),
      text: tr(
        'Қазақ және орыс тілдерінде бірдей сөйлейтіндер орыс тіліне тән SVO тәртібіндегі сөйлемдерді негізінен қазақша сөйлейтіндерге қарағанда жылдамырақ оқиды деп болжаймыз.',
        'Мы предполагаем, что люди, одинаково владеющие казахским и русским, читают предложения с «русским» порядком SVO быстрее, чем те, кто говорит в основном по-казахски.',
        'We predict that people who speak Kazakh and Russian equally read sentences in Russian-style SVO order faster than people who mostly speak Kazakh.'
      ),
      examples: [
        { order: 'SOV', text: 'Бала алманы жеді.' },
        { order: 'SVO', text: 'Бала жеді алманы.' },
      ],
      note: tr('SVO — орыс тіліндегідей тәртіп.', 'SVO повторяет русский порядок: «Мальчик съел яблоко».', 'SVO follows Russian order: «Мальчик съел яблоко».'),
    },
  ];

  const method = [
    {
      icon: <Shuffle className="w-4 h-4" />,
      text: tr(
        'Сөйлемдерді 4 түрлі сөз тәртібімен көрсетеміз: SOV, OSV, SVO, OVS.',
        'Показываем предложения в 4 вариантах порядка слов: SOV, OSV, SVO, OVS.',
        'We show sentences in 4 word orders: SOV, OSV, SVO, OVS.'
      ),
    },
    {
      icon: <Timer className="w-4 h-4" />,
      text: tr(
        'Әр сөйлемді оқу уақытын (миллисекундпен) және жауаптардың дұрыстығын өлшейміз.',
        'Измеряем время чтения каждого предложения (в миллисекундах) и правильность ответов.',
        'We measure how long each sentence takes to read (in milliseconds) and whether answers are correct.'
      ),
    },
    {
      icon: <Users className="w-4 h-4" />,
      text: tr(
        'Үш топты салыстырамыз: негізінен қазақша сөйлейтіндер, екі тілді адамдар және қазақ тілін үйренушілер.',
        'Сравниваем три группы: говорящих в основном по-казахски, двуязычных и изучающих казахский.',
        'We compare three groups: mostly-Kazakh speakers, bilinguals, and learners of Kazakh.'
      ),
    },
  ];

  return (
    <div className="space-y-8 pb-16">

      {/* Hero */}
      <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-10 shadow-sm grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-8 lg:gap-12 items-center">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
              <Clock className="w-3.5 h-3.5" />
              <span>{tr('Тегін, шамамен 10 минут', 'Бесплатно, около 10 минут', 'Free, about 10 minutes')}</span>
            </span>
            <a
              href="#hypothesis"
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span>{tr('Ғылыми зерттеу: гипотезаны оқу', 'Научное исследование: гипотеза', 'Research study: see the hypothesis')}</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </a>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-semibold text-slate-900 dark:text-slate-100 leading-[1.15]">
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

        <div className="space-y-2">
          <Suspense fallback={<div className="h-40 sm:h-52" />}>
            <LogoBlocks3D className="h-40 sm:h-52 w-full" />
          </Suspense>
          <LivingSentence lang={lang} />
        </div>
      </section>

      {/* Research hypothesis: what the app is built to test */}
      <section
        id="hypothesis"
        aria-labelledby="hypothesis-heading"
        className="scroll-mt-24 rounded-3xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50/60 dark:bg-emerald-950/20 p-6 sm:p-8 space-y-6"
      >
        <div>
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
            <FlaskConical className="w-4 h-4" />
            {tr('Біздің гипотеза', 'Наша гипотеза', 'Our hypothesis')}
          </span>
          <h2 id="hypothesis-heading" className="mt-2 font-display text-xl sm:text-2xl font-semibold leading-snug text-slate-900 dark:text-slate-100">
            {tr(
              'Сөздердің орны қазақша сөйлемді оқу мен түсінуге қалай әсер етеді?',
              'Как порядок слов влияет на чтение и понимание казахских предложений?',
              'How does word order affect reading and understanding Kazakh sentences?'
            )}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hypotheses.map(h => (
            <article key={h.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col">
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white text-xs font-bold font-mono">{h.id}</span>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{h.title}</h3>
              </div>
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{h.text}</p>
              <div className="mt-auto pt-4">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 space-y-1.5">
                  {h.examples.map(ex => (
                    <div key={ex.order} className="flex items-baseline gap-3 text-sm">
                      <span className="w-10 shrink-0 font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400">{ex.order}</span>
                      <span lang="kk" className="font-semibold text-slate-900 dark:text-slate-100">{ex.text}</span>
                    </div>
                  ))}
                  <p className="pt-1 text-xs text-slate-500 dark:text-slate-400">{h.note}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            {tr('Қалай тексереміз', 'Как мы это проверяем', 'How we test it')}
          </h3>
          <ul className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
            {method.map((m, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                <span className="mt-0.5 w-8 h-8 rounded-lg bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  {m.icon}
                </span>
                <span className="leading-relaxed">{m.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
          {tr(
            'Сіз тапсырған әрбір тест осы зерттеуге дерек қосады.',
            'Каждый пройденный тест добавляет данные в это исследование.',
            'Every test you take adds data to this study.'
          )}
        </p>
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
