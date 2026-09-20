import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  RotateCw, 
  Clock, 
  Layers, 
  Brain, 
  ArrowRight, 
  Sparkles, 
  Shuffle,
  BookOpen,
  CheckCircle2,
  Tag
} from 'lucide-react';
import { ActiveTab, LanguageCode, WordOrderCondition, StimulusSentence } from '../types';
import { translations } from '../data/translations';
import { 
  getRandomStimulusByWordOrder, 
  getStimulusPsycholinguisticProfile, 
  getAllStimuli 
} from '../utils/stimulusManager';

interface InteractiveSimulatorProps {
  setActiveTab: (tab: ActiveTab) => void;
  lang: LanguageCode;
}

export const InteractiveSimulator: React.FC<InteractiveSimulatorProps> = ({
  setActiveTab,
  lang
}) => {
  const t = translations[lang];

  // Current active word order condition
  const [activeOrder, setActiveOrder] = useState<WordOrderCondition>('SOV');

  // Currently selected dynamic stimulus sentence from the database
  const [currentStimulus, setCurrentStimulus] = useState<StimulusSentence>(() => {
    return getRandomStimulusByWordOrder('SOV');
  });

  // Animation flag when shuffling
  const [isRotating, setIsRotating] = useState(false);

  // Counter of explored stimuli in simulator
  const [rotationCount, setRotationCount] = useState(1);

  // Count available stimuli for each order
  const allStimuli = getAllStimuli();
  const orderCount = allStimuli.filter(s => s.wordOrder === activeOrder).length;

  // Handle switching word order condition
  const handleSelectOrder = (order: WordOrderCondition) => {
    setActiveOrder(order);
    setIsRotating(true);
    const newStim = getRandomStimulusByWordOrder(order, currentStimulus.id);
    setCurrentStimulus(newStim);
    setRotationCount(prev => prev + 1);
    setTimeout(() => setIsRotating(false), 260);
  };

  // Handle clicking "Жаңа стимул / Randomize Sentence"
  const handleRandomizeCurrentOrder = () => {
    setIsRotating(true);
    const newStim = getRandomStimulusByWordOrder(activeOrder, currentStimulus.id);
    setCurrentStimulus(newStim);
    setRotationCount(prev => prev + 1);
    setTimeout(() => setIsRotating(false), 300);
  };

  // Get dynamic psycholinguistic and ERP analysis
  const profile = getStimulusPsycholinguisticProfile(currentStimulus, lang);

  return (
    <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
      
      {/* Header bar: Title, Order selector & Randomize button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{t.simTitle || 'Интерактивті синтаксистік симулятор'}</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            {t.simSubtitle || 'Сөз тәртібінің когнитивтік парсингке әсерін зерттеу'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {lang === 'kk'
              ? '120 элементтен тұратын орталықтандырылған стимулдар базасынан динамикалық сөйлемдерді таңдаңыз'
              : lang === 'ru'
              ? 'Динамическая выборка реальных стимулов из централизованной базы (120 предложений)'
              : 'Dynamically sampling live sentences from the 120-item psycholinguistic stimulus pool'}
          </p>
        </div>

        {/* Word Order Toggles & Randomize action */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Order condition tabs */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700">
            {(['SOV', 'OSV', 'SVO', 'OVS'] as WordOrderCondition[]).map((order) => (
              <button
                key={order}
                id={`demo-order-btn-${order}`}
                onClick={() => handleSelectOrder(order)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  activeOrder === order
                    ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-xs border border-slate-200/80 dark:border-slate-600'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {order}
              </button>
            ))}
          </div>

          {/* Randomize / New Stimulus button */}
          <button
            id="simulator-randomize-btn"
            onClick={handleRandomizeCurrentOrder}
            title={lang === 'kk' ? 'Жаңа стимулды кездейсоқ таңдау' : 'Pick another randomized stimulus'}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold transition-all shadow-xs active:translate-y-0.5 cursor-pointer"
          >
            <Shuffle className={`w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 ${isRotating ? 'animate-spin' : ''}`} />
            <span>
              {lang === 'kk' ? 'Жаңа стимул' : lang === 'ru' ? 'Новый стимул' : 'Randomize'}
            </span>
          </button>

        </div>
      </div>

      {/* Live Parser Visualizer */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          
          {/* Stimulus Sentence Box */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 relative overflow-hidden">
            
            {/* Meta badges: Order, CEFR, ID, Count */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-mono text-xs font-extrabold tracking-wide">
                  {activeOrder}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-mono text-xs font-bold">
                  CEFR: {currentStimulus.cefrLevel}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-mono text-[10px]">
                  ID: {currentStimulus.id}
                </span>
              </div>

              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <span>
                  {lang === 'kk' 
                    ? `Қолжетімді: ${orderCount} сөйлем` 
                    : lang === 'ru' 
                    ? `Доступно: ${orderCount} предложений` 
                    : `Pool: ${orderCount} stimuli`}
                </span>
                <span className="text-emerald-600 dark:text-emerald-400">•</span>
                <span>#{rotationCount}</span>
              </div>
            </div>

            {/* Stimulus Text */}
            <p className={`text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100 leading-relaxed transition-opacity duration-200 ${isRotating ? 'opacity-40' : 'opacity-100'}`}>
              «{currentStimulus.sentenceKazakh}»
            </p>

            {/* Transliteration */}
            {currentStimulus.transliterationLatin && (
              <p className="mt-2 text-xs font-mono text-slate-500 dark:text-slate-400 italic">
                {currentStimulus.transliterationLatin}
              </p>
            )}

            {/* Morphological Gloss Box */}
            <div className="mt-4 font-mono text-xs text-emerald-900 dark:text-emerald-200 bg-emerald-50/90 dark:bg-emerald-950/60 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <span className="font-bold text-[10px] uppercase text-emerald-700 dark:text-emerald-400 block mb-1">
                {lang === 'kk' ? 'Морфологиялық талдау (Leipzig Gloss):' : 'Morphological Gloss:'}
              </span>
              {profile.gloss}
            </div>

            {/* Translation preview if available */}
            {(lang === 'ru' ? currentStimulus.translationRu : currentStimulus.translationEn) && (
              <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-semibold">{lang === 'ru' ? 'Перевод: ' : 'Translation: '}</span>
                {lang === 'ru' ? currentStimulus.translationRu : currentStimulus.translationEn}
              </div>
            )}

          </div>

          {/* Psycholinguistic Explanation Box */}
          <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <span className="font-bold text-slate-900 dark:text-slate-100">
              {t.psycholinguisticAnalysisLabel || 'Психолингвистикалық талдау'}:{' '}
            </span>
            {profile.explanation}
          </div>

        </div>

        {/* Cognitive & ERP Metrics */}
        <div className="space-y-3">
          
          {/* Metric 1: Mean Reading Latency */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {t.meanReadingLatency || 'Орташа оқу уақыты'}
              </span>
              <div className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-0.5">
                {profile.estimatedRt}
              </div>
            </div>
            <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>

          {/* Metric 2: Working Memory Load */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {t.workingMemoryLoad || 'Жұмыс жадына жүктеме'}
              </span>
              <div className="mt-1">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${profile.loadBadgeColor}`}>
                  {profile.memoryLoad}
                </span>
              </div>
            </div>
            <Layers className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          </div>

          {/* Metric 3: Cognitive Parsing Prediction */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {lang === 'kk' 
                  ? 'Психолингвистикалық болжам / Парсинг құны' 
                  : lang === 'ru' 
                  ? 'Психолингвистический прогноз / Цена парсинга' 
                  : 'Cognitive Parsing Prediction'}
              </span>
              <Brain className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 font-mono mt-2 leading-relaxed">
              {profile.parsingPrediction}
            </p>
          </div>

          {/* Start Experiment Button */}
          <button
            id="simulator-start-experiment-btn"
            onClick={() => setActiveTab('participant')}
            className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:translate-y-0.5"
          >
            <span>{t.startExperiment}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

        </div>
      </div>
    </section>
  );
};
