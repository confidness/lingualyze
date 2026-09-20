import React from 'react';
import { 
  Play, 
  BarChart2, 
  Database, 
  Brain, 
  Layers, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  Zap,
  Users,
  GitBranch,
  BookOpen,
  HelpCircle,
  Target,
  GraduationCap,
  TrendingUp
} from 'lucide-react';
import { ActiveTab, LanguageCode, ParticipantProfile, TrialResult } from '../types';
import { translations } from '../data/translations';
import { InteractiveSimulator } from './InteractiveSimulator';

interface OverviewSectionProps {
  setActiveTab: (tab: ActiveTab) => void;
  lang: LanguageCode;
  allTrials?: TrialResult[];
  currentParticipant?: ParticipantProfile;
  totalStimuliCount?: number;
}

export const OverviewSection: React.FC<OverviewSectionProps> = ({ 
  setActiveTab, 
  lang,
  allTrials = [],
  currentParticipant,
  totalStimuliCount = 8
}) => {
  const t = translations[lang];

  // Dynamic state calculations
  const participantTrials = currentParticipant 
    ? allTrials.filter(tr => tr.participantId === currentParticipant.id)
    : allTrials;
  
  const latestTrial = participantTrials.length > 0 
    ? participantTrials[participantTrials.length - 1] 
    : (allTrials.length > 0 ? allTrials[allTrials.length - 1] : null);

  const completedTrialsCount = participantTrials.length;
  const correctTrialsCount = participantTrials.filter(tr => tr.isCorrect).length;
  const liveAccuracy = completedTrialsCount > 0 
    ? Math.round((correctTrialsCount / completedTrialsCount) * 100) 
    : null;

  // Localized cohort label
  const getCohortName = (dominanceGroup?: string) => {
    if (dominanceGroup === 'kazakh_dominant') return t.groupKazakhDominant;
    if (dominanceGroup === 'bilingual_balanced') return t.groupBilingual;
    if (dominanceGroup === 'kazakh_l2') return t.groupL2;
    return t.groupKazakhDominant;
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Hero Section: Clean Academic Light / Dark Theme */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 sm:p-12 shadow-sm">
        {/* Subtle academic background decoration */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-emerald-50/60 dark:bg-emerald-950/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 rounded-full bg-teal-50/50 dark:bg-teal-950/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl">
          {/* Scientific Academic Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-emerald-700 dark:text-emerald-400 text-xs font-semibold mb-5 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{t.heroTagline}</span>
          </div>

          {/* Prominent Scientific Objective Banner */}
          <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 shadow-xs">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-emerald-600 text-white shrink-0 mt-0.5 shadow-xs">
                <Target className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 font-mono">
                    {lang === 'kk' ? 'Ғылыми мақсат & Зерттеу гипотезасы' : lang === 'ru' ? 'Научная цель & Исследовательская гипотеза' : 'Scientific Objective & Research Hypothesis'}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-300 font-mono">
                    Behavioral Psycholinguistics
                  </span>
                </div>
                <p className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-100 leading-snug">
                  {t.scientificObjectiveBanner}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {lang === 'kk'
                    ? 'Академиялық нақтылық: Lingualyze инвазивті нейробейнелеуді (ЭЭГ/фМРТ) емес, нақты мінез-құлықтық психолингвистикалық көрсеткіштерді (өзіндік оқу латенттілігі, шешім қабылдау кідірісі, тапсырма дәлдігі) өлшейді.'
                    : lang === 'ru'
                    ? 'Академическая строгость: Lingualyze замеряет объективные поведенческие психолингвистические метрики (латентность чтения, задержка реакции, точность ответа), а НЕ прямую нейровизуализацию (ЭЭГ/фМРТ).'
                    : 'Academic Rigor: Lingualyze measures objective behavioral psycholinguistic speech processing metrics (reading latencies, response delay, task accuracy), NOT direct neuroimaging (EEG/fMRI).'}
                </p>
              </div>
            </div>
          </div>

          {/* Main Title strictly in selected language */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 leading-tight">
            {t.heroTitle}
          </h1>

          {/* Subtitle description strictly in selected language */}
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            {t.heroDescription}
          </p>

          {/* Action Button Group */}
          <div className="mt-8 flex flex-wrap items-center gap-3.5">
            <button
              id="hero-start-experiment-btn"
              onClick={() => setActiveTab('participant')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{t.startExperiment}</span>
            </button>

            <button
              id="hero-methodology-btn"
              onClick={() => setActiveTab('methodology')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 font-bold text-sm shadow-xs transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
              <span>{lang === 'kk' ? 'Әдіснама және гипотезалар' : lang === 'ru' ? 'Методология и гипотезы' : 'Methodology & Hypotheses'}</span>
            </button>

            <button
              id="hero-student-login-btn"
              onClick={() => setActiveTab('participant')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 font-bold text-sm shadow-xs transition-all cursor-pointer"
            >
              <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{t.navParticipant}</span>
            </button>

            <button
              id="hero-view-analytics-btn"
              onClick={() => setActiveTab('analytics')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-sm shadow-xs transition-all cursor-pointer"
            >
              <BarChart2 className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span>{t.analyticsDashboard}</span>
            </button>

            <button
              id="hero-admin-btn"
              onClick={() => setActiveTab('admin')}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium text-xs shadow-xs transition-all cursor-pointer"
            >
              <span>{t.navAdmin}</span>
            </button>
          </div>
        </div>

        {/* Linear Narrative Flow: [Research Problem: Word Order Flexibility (SOV vs OSV)] -> [Experimental Protocol] -> [Measured Behavioral Metrics] -> [Scientific Output] */}
        <div className="mt-10 pt-8 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-300 font-mono flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{lang === 'kk' ? 'Ғылыми зерттеудің бірізді архитектурасы' : lang === 'ru' ? 'Линейная структура научного исследования' : 'Linear Research Narrative Flow'}</span>
            </h3>
            <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-semibold">4-Stage Pipeline</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Step 1: Research Problem */}
            <div className="p-4 rounded-2xl bg-slate-50/90 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 flex flex-col justify-between hover:border-emerald-300 dark:hover:border-emerald-700 transition-all">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono text-[10px] font-bold">
                    01 • {t.narrativeStep1Title}
                  </span>
                  <GitBranch className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {t.narrativeStep1Subtitle}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                  {t.narrativeStep1Desc}
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 font-mono">
                <span>SOV vs OSV</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Step 2: Experimental Protocol */}
            <div className="p-4 rounded-2xl bg-slate-50/90 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 flex flex-col justify-between hover:border-teal-300 dark:hover:border-teal-700 transition-all">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded-md bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-mono text-[10px] font-bold">
                    02 • {t.narrativeStep2Title}
                  </span>
                  <Layers className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {t.narrativeStep2Subtitle}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                  {t.narrativeStep2Desc}
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between text-[11px] font-semibold text-teal-700 dark:text-teal-400 font-mono">
                <span>SPR + 3-Stage Tasks</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Step 3: Measured Behavioral Metrics */}
            <div className="p-4 rounded-2xl bg-slate-50/90 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 flex flex-col justify-between hover:border-indigo-300 dark:hover:border-indigo-700 transition-all">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 font-mono text-[10px] font-bold">
                    03 • {t.narrativeStep3Title}
                  </span>
                  <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {t.narrativeStep3Subtitle}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                  {t.narrativeStep3Desc}
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between text-[11px] font-semibold text-indigo-700 dark:text-indigo-400 font-mono">
                <span>Latency ms & Acc %</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Step 4: Scientific Output */}
            <div className="p-4 rounded-2xl bg-slate-50/90 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 flex flex-col justify-between hover:border-amber-300 dark:hover:border-amber-700 transition-all">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-mono text-[10px] font-bold">
                    04 • {t.narrativeStep4Title}
                  </span>
                  <TrendingUp className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {t.narrativeStep4Subtitle}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                  {t.narrativeStep4Desc}
                </p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between text-[11px] font-semibold text-amber-700 dark:text-amber-400 font-mono">
                <span>L1 / Bilingual / L2</span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic React State Metric Cards (Replaces static hardcoded data) */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Live Metric 1: Reaction Time Engine */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 transition-all hover:border-emerald-300 dark:hover:border-emerald-700">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <span>{t.metricLatestRt}</span>
              <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-mono">
              {latestTrial ? `${latestTrial.readingTimeMs} ms` : '—'}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {latestTrial 
                ? `${t.wordOrder}: ${latestTrial.wordOrder} • ${latestTrial.readingSpeedWpm} WPM` 
                : t.runTestToMeasure}
            </p>
          </div>

          {/* Live Metric 2: Active Participant Cohort */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 transition-all hover:border-teal-300 dark:hover:border-teal-700">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <span>{t.metricActiveCohort}</span>
              <Users className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            </div>
            <div className="mt-2 text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 truncate">
              {currentParticipant ? currentParticipant.id : 'P-KZ-101'}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">
              {currentParticipant 
                ? getCohortName(currentParticipant.dominanceGroup) 
                : t.groupKazakhDominant}
            </p>
          </div>

          {/* Live Metric 3: Completed Trials */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 transition-all hover:border-emerald-300 dark:hover:border-emerald-700">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <span>{t.metricCompletedTrials}</span>
              <GitBranch className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-mono">
              {completedTrialsCount} <span className="text-sm font-normal text-slate-500 dark:text-slate-400">/ {totalStimuliCount}</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {completedTrialsCount > 0 
                ? `${Math.round((completedTrialsCount / totalStimuliCount) * 100)}% ${lang === 'kk' ? 'аяқталды' : lang === 'ru' ? 'пройдено' : 'completed'}` 
                : t.noTrialsYet}
            </p>
          </div>

          {/* Live Metric 4: Comprehension Accuracy */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 transition-all hover:border-teal-300 dark:hover:border-teal-700">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <span>{t.metricLiveAccuracy}</span>
              <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-mono">
              {liveAccuracy !== null ? `${liveAccuracy}%` : '—'}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {liveAccuracy !== null 
                ? `${correctTrialsCount} / ${completedTrialsCount} ${lang === 'kk' ? 'дұрыс жауап' : lang === 'ru' ? 'верных ответов' : 'correct responses'}` 
                : t.metricLiveAccuracyDesc}
            </p>
          </div>

        </div>
      </section>

      {/* Interactive Word Order Parser Demo Section: Dynamic Database Rotation */}
      <InteractiveSimulator setActiveTab={setActiveTab} lang={lang} />

    </div>
  );
};
