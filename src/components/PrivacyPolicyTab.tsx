import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Clock, 
  Database, 
  Trash2, 
  Download, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Eye, 
  Cpu, 
  Layers, 
  Users,
  HardDrive,
  Info
} from 'lucide-react';
import { LanguageCode, UserRole } from '../types';
import { translations } from '../data/translations';
import { storageEngine } from '../utils/storageEngine';

interface PrivacyPolicyTabProps {
  lang: LanguageCode;
  currentRole: UserRole;
  onOpenAuthModal?: () => void;
}

export const PrivacyPolicyTab: React.FC<PrivacyPolicyTabProps> = ({ 
  lang, 
  currentRole,
  onOpenAuthModal 
}) => {
  const [clearedMessage, setClearedMessage] = useState(false);
  const t = translations[lang];
  const dbStats = storageEngine.getStats();

  const handleClearMyData = () => {
    if (window.confirm(
      lang === 'kk'
        ? 'Браузерде сақталған барлық сынақ нәтижелерін тазалағыңыз келе ме?'
        : lang === 'ru'
        ? 'Вы уверены, что хотите удалить все сохраненные данные тестов?'
        : 'Are you sure you want to clear all locally saved test sessions?'
    )) {
      storageEngine.clearAllSessions();
      setClearedMessage(true);
      setTimeout(() => setClearedMessage(false), 2500);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{lang === 'kk' ? 'Ғылыми этика және ашықтық' : lang === 'ru' ? 'Научная этика и прозрачность' : 'Research Ethics & Data Transparency'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            {lang === 'kk' ? 'Құпиялылық саясаты және Деректерді басқару' : lang === 'ru' ? 'Политика конфиденциальности и Управление данными' : 'Privacy Policy & Data Transparency'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            {lang === 'kk'
              ? 'Lingualyze зерттеу платформасы қатысушылардың жеке құпиялылығын қорғауға және ғылыми этика принциптерін мүлтіксіз сақтауға міндеттенеді.'
              : lang === 'ru'
              ? 'Платформа Lingualyze строго следует принципам исследовательской этики и гарантирует полную защиту конфиденциальности участников.'
              : 'Lingualyze is committed to complete research transparency, participant anonymity, and zero commercial data exploitation.'}
          </p>
        </div>

        {/* Local Storage Indicator Badge */}
        <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-right shrink-0">
          <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-800 dark:text-emerald-300 block">
            {lang === 'kk' ? 'Жергілікті жазбалар' : lang === 'ru' ? 'Локальные записи' : 'Stored Sessions'}
          </span>
          <span className="text-xl font-mono font-black text-emerald-900 dark:text-emerald-200">
            {dbStats.totalRecords} {lang === 'kk' ? 'сынақ' : 'records'}
          </span>
          <span className="text-[10px] text-emerald-700/80 dark:text-emerald-400 block font-mono">
            {(dbStats.storageSizeBytes / 1024).toFixed(1)} KB (LocalStorage)
          </span>
        </div>
      </div>

      {clearedMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{lang === 'kk' ? 'Жергілікті деректер базасы сәтті тазартылды!' : 'Local database cleared successfully!'}</span>
        </div>
      )}

      {/* 4 Pillars of Data Transparency */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Pillar 1: High-precision latencies */}
        <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 text-teal-600 dark:text-teal-400 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            {lang === 'kk' ? '1. Миллисекундтық реакция уақыты (Browser Timing API)' : '1. Millisecond Reaction Latencies'}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {lang === 'kk'
              ? 'Браузердің стандартты performance.now() жоғары дәлдіктегі уақыт өлшеу механизмі арқылы сөйлемді оқу жылдамдығы (reading latency) және сұраққа жауап беру уақыты тіркеледі. Бұл мәліметтер тек қана қазақ тілінің синтаксистік өңделуін ғылыми талдау үшін қолданылады.'
              : 'Measured using the browser high-resolution Performance Timing API (performance.now()). Captures raw reading duration and question choice latency to calculate syntactic cognitive load without tracking personal browsing habits.'}
          </p>
        </div>

        {/* Pillar 2: Syntactic accuracy & error patterns */}
        <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            {lang === 'kk' ? '2. Құрылымдық қателер мен дәлдік үлгілері' : '2. Syntactic Errors & Accuracy Patterns'}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {lang === 'kk'
              ? 'Қатысушының SOV (қалыпты), OSV (топикализация), SVO (түйісу) және OVS сөйлемдеріндегі сөздер тізбегін (Part 1), эмодзи қатарын (Part 2) және септік жалғауларын (Part 3) тану дәлдігі мен қателік динамикасы сақталады.'
              : 'Tracks accuracy and response breakdown across the 3-part sequence (word chains, event emoji sequencing, and case suffix discrimination) to model linguistic comprehension.'}
          </p>
        </div>

        {/* Pillar 3: Demographic cohort classification */}
        <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            {lang === 'kk' ? '3. Тілдік когорталар және Демография' : '3. Demographic Cohort Classification'}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {lang === 'kk'
              ? 'Қатысушының өзі көрсеткен ана тілі, жас санаты, күнделікті қазақ тілін қолдану пайызы (0–100%) және CEFR деңгейі (A1–C2) жалпыланған статистикалық топтастыру үшін ғана жиналады.'
              : 'Collects language dominance group (Kazakh-dominant, Bilingual, L2 Learner), age range, and estimated daily usage to establish comparative cohort benchmarks.'}
          </p>
        </div>

        {/* Pillar 4: Zero PII and Client-Side Storage */}
        <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            {lang === 'kk' ? '4. Жеке мәліметтер жоқтығы (Zero PII Guarantee)' : '4. Zero PII & Local Storage Guarantee'}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {lang === 'kk'
              ? 'Ешқандай аты-жөні, ЖСН, телефон нөмірі немесе тұрғылықты жері талап етілмейді. Барлық респонденттер тек бүркеншік ID арқылы (мысалы: P-KZ-104) белгіленеді. Мәліметтер тек браузердің өзінде сақталады және үшінші тарапқа берілмейді.'
              : 'No personally identifiable information (PII) is ever asked or recorded. Participants are strictly pseudonymized via ID tokens. No tracking cookies or commercial telemetry exist.'}
          </p>
        </div>

      </div>

      {/* Participant Rights & Control Actions */}
      <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {lang === 'kk' ? 'Қатысушының дербес құқықтары' : lang === 'ru' ? 'Права участника исследования' : 'Participant Data Control & Rights'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {lang === 'kk' 
                ? 'Кез келген уақытта өз деректеріңізді көшіріп алуға немесе толықтай өшіруге құқылысыз.' 
                : 'You have full sovereignty over your test records stored in this browser session.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Action 1: Export CSV */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
              {lang === 'kk' ? 'Деректерді жүктеп алу' : lang === 'ru' ? 'Экспорт данных' : 'Export My Records'}
            </span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {lang === 'kk' 
                ? 'Сынақ нәтижелерін ғылыми CSV форматында компьютеріңізге сақтаңыз.' 
                : lang === 'ru'
                ? 'Сохраните результаты тестов в формате CSV.'
                : 'Download your psycholinguistic reaction logs in CSV format.'}
            </p>
            <button
              onClick={() => storageEngine.exportCsv()}
              className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-xs transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{lang === 'kk' ? 'CSV жүктеу' : lang === 'ru' ? 'Скачать CSV' : 'Download CSV'}</span>
            </button>
          </div>

          {/* Action 2: Export JSON */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block">
              {lang === 'kk' ? 'JSON сызбасы' : lang === 'ru' ? 'Структурированный JSON' : 'Structured JSON'}
            </span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {lang === 'kk' 
                ? 'Барлық сынақтардың толық құрылымдалған деректері.' 
                : lang === 'ru'
                ? 'Полные структурированные данные всех испытаний.'
                : 'Export hierarchical JSON with per-stimulus response breakdowns.'}
            </p>
            <button
              onClick={() => storageEngine.exportJson()}
              className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 shadow-xs transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>{lang === 'kk' ? 'JSON жүктеу' : lang === 'ru' ? 'Скачать JSON' : 'Download JSON'}</span>
            </button>
          </div>

          {/* Action 3: Clear Database */}
          <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 space-y-2">
            <span className="text-xs font-bold text-rose-900 dark:text-rose-200 block">
              {lang === 'kk' ? 'Деректерді өшіру' : lang === 'ru' ? 'Удалить данные' : 'Erase My Data'}
            </span>
            <p className="text-[11px] text-rose-700/80 dark:text-rose-400">
              {lang === 'kk' 
                ? 'Браузерде сақталған барлық сынақ жазбаларын бірден тазалау.' 
                : lang === 'ru'
                ? 'Удалить все сохраненные результаты из памяти браузера.'
                : 'Purge all sessions from browser storage permanently.'}
            </p>
            <button
              onClick={handleClearMyData}
              className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{lang === 'kk' ? 'Тазалау' : lang === 'ru' ? 'Очистить' : 'Clear All'}</span>
            </button>
          </div>

        </div>
      </div>

      {/* Institutional Ethics Statement Card */}
      <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-600 dark:text-slate-400 leading-relaxed space-y-2">
        <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100">
          <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>{lang === 'kk' ? 'Хельсинки декларациясы және ғылыми этика стандарттары' : 'Declaration of Helsinki & Ethical Psycholinguistic Standards'}</span>
        </div>
        <p>
          {lang === 'kk'
            ? 'Lingualyze жобасы адам қатысушыларымен жүргізілетін психолингвистикалық және когнитивтік сынақтардың халықаралық этикалық стандарттарына сәйкес келеді. Барлық зерттеу нәтижелері тек ғылыми мақалалар мен қазақ тілінің NLP модельдерін жақсарту мақсатында ғана қорытындыланады.'
            : 'Lingualyze adheres to ethical guidelines for cognitive and psycholinguistic participant observation. Data aggregation is strictly reserved for academic publication, cross-linguistic syntax modeling, and Kazakh NLP corpus calibration.'}
        </p>
      </div>

    </div>
  );
};
