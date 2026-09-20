import React, { useState } from 'react';
import { 
  Database, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  FileSpreadsheet, 
  FileCode2, 
  Check, 
  HelpCircle, 
  Layers, 
  Sparkles, 
  Trash2, 
  Eye, 
  BookOpen,
  ArrowRight,
  X,
  Lock,
  Unlock,
  ShieldCheck,
  ClipboardList,
  Pencil,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { 
  LanguageCode, 
  PredictabilityLevel, 
  SentenceLength, 
  StimulusSentence, 
  SyntacticComplexity, 
  WordOrderCondition,
  CEFRLevel,
  UserRole
} from '../types';
import { translations } from '../data/translations';
import { TestRecordsViewer } from './TestRecordsViewer';
import { generateExpandedStimuliBattery } from '../data/stimuliGenerator';

interface SentenceDatabaseProps {
  stimuli: StimulusSentence[];
  setStimuli: React.Dispatch<React.SetStateAction<StimulusSentence[]>>;
  lang: LanguageCode;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  onOpenAuthModal?: () => void;
}

export const SentenceDatabase: React.FC<SentenceDatabaseProps> = ({ 
  stimuli, 
  setStimuli, 
  lang,
  currentRole,
  setCurrentRole,
  onOpenAuthModal
}) => {
  const t = translations[lang];

  // Database Sub-Tabs: 'test_records' (default for research inspection) or 'stimuli'
  const [activeSubTab, setActiveSubTab] = useState<'test_records' | 'stimuli'>('stimuli');

  // Inline Admin Unlock form state
  const [adminPasscode, setAdminPasscode] = useState('');
  const [passcodeError, setPasscodeError] = useState('');

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [filterWordOrder, setFilterWordOrder] = useState<string>('all');
  const [filterComplexity, setFilterComplexity] = useState<string>('all');
  const [filterLength, setFilterLength] = useState<string>('all');
  const [filterPredictability, setFilterPredictability] = useState<string>('all');

  // Modal State for New Sentence Builder and Detail Inspector
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [selectedStimulusForDetail, setSelectedStimulusForDetail] = useState<StimulusSentence | null>(null);
  const [editingStimulus, setEditingStimulus] = useState<StimulusSentence | null>(null);

  // Toast feedback
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // New Stimulus Form State
  const [newKazakhText, setNewKazakhText] = useState('');
  const [newLatinText, setNewLatinText] = useState('');
  const [newCefr, setNewCefr] = useState<CEFRLevel>('B1');
  const [newWordOrder, setNewWordOrder] = useState<WordOrderCondition>('SOV');
  const [newComplexity, setNewComplexity] = useState<SyntacticComplexity>('simple');
  const [newLength, setNewLength] = useState<SentenceLength>('short');
  const [newPredictability, setNewPredictability] = useState<PredictabilityLevel>('high');
  const [newGloss, setNewGloss] = useState('');
  const [newSyntacticFocus, setNewSyntacticFocus] = useState('');
  const [newQuestionTextKk, setNewQuestionTextKk] = useState('');
  const [newOptionCorrect, setNewOptionCorrect] = useState('');
  const [newOptionDistractor, setNewOptionDistractor] = useState('');
  const [builderSuccess, setBuilderSuccess] = useState(false);

  // Computed Sentence Counts for Researcher Overview
  const totalStimuli = stimuli.length;
  const sovCount = stimuli.filter(s => s.wordOrder === 'SOV').length;
  const osvCount = stimuli.filter(s => s.wordOrder === 'OSV').length;
  const svoCount = stimuli.filter(s => s.wordOrder === 'SVO').length;
  const ovsCount = stimuli.filter(s => s.wordOrder === 'OVS').length;
  const shortCount = stimuli.filter(s => s.length === 'short' || s.wordCount <= 5).length;
  const longCount = stimuli.filter(s => s.length === 'long' || s.wordCount > 5).length;
  const simpleCount = stimuli.filter(s => s.complexity === 'simple').length;
  const complexCount = stimuli.filter(s => s.complexity === 'complex').length;
  const highPredCount = stimuli.filter(s => s.predictability === 'high').length;
  const lowPredCount = stimuli.filter(s => s.predictability === 'low').length;

  // Filtered List based on 4 criteria + search
  const filteredStimuli = stimuli.filter(item => {
    const matchesSearch = 
      item.sentenceKazakh.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.morphologicalGloss.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.syntacticFocus && item.syntacticFocus.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.transliterationLatin && item.transliterationLatin.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesOrder = filterWordOrder === 'all' || item.wordOrder === filterWordOrder;
    const matchesComplexity = filterComplexity === 'all' || item.complexity === filterComplexity;
    const matchesLength = filterLength === 'all' || 
      (filterLength === 'short' ? (item.length === 'short' || item.wordCount <= 5) : (item.length === 'long' || item.wordCount > 5));
    const matchesPredictability = filterPredictability === 'all' || item.predictability === filterPredictability;

    return matchesSearch && matchesOrder && matchesComplexity && matchesLength && matchesPredictability;
  });

  // Handle Adding New Stimulus
  const handleCreateStimulus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKazakhText || !newQuestionTextKk || !newOptionCorrect || !newOptionDistractor) return;

    const words = newKazakhText.trim().split(/\s+/);
    const newId = `stim-custom-${Date.now().toString().slice(-4)}`;

    const newStimulus: StimulusSentence = {
      id: newId,
      cefrLevel: newCefr,
      sentenceKazakh: newKazakhText.trim(),
      transliterationLatin: newLatinText.trim() || undefined,
      translationRu: 'Пользовательский экспериментальный стимул',
      translationEn: 'Custom experimental stimulus sentence',
      wordOrder: newWordOrder,
      length: words.length <= 5 ? 'short' : 'long',
      complexity: newComplexity,
      predictability: newPredictability,
      wordCount: words.length,
      words,
      morphologicalGloss: newGloss.trim() || words.map(w => `${w}-ROOT`).join(' '),
      syntacticFocus: newSyntacticFocus.trim() || `${newWordOrder} реті, ${newComplexity} күрделілік`,
      question: {
        questionText: {
          kk: newQuestionTextKk.trim(),
          ru: newQuestionTextKk.trim(),
          en: newQuestionTextKk.trim()
        },
        options: [
          { id: 'opt-a', textKk: newOptionCorrect.trim(), textRu: newOptionCorrect.trim(), textEn: newOptionCorrect.trim() },
          { id: 'opt-b', textKk: newOptionDistractor.trim(), textRu: newOptionDistractor.trim(), textEn: newOptionDistractor.trim() }
        ],
        correctOptionId: 'opt-a',
        explanationKk: 'Дұрыс жауап мәтінге сәйкес келеді.',
        explanationRu: 'Правильный ответ соответствует стимулу.',
        explanationEn: 'Correct answer matches stimulus context.'
      },
      emojiChain: {
        items: [
          { id: 'e1', emoji: '🧑', labelKk: words[0] || 'Бастауыш', labelRu: words[0] || 'Субъект', labelEn: words[0] || 'Subject' },
          { id: 'e2', emoji: '📦', labelKk: words[1] || 'Нысан', labelRu: words[1] || 'Объект', labelEn: words[1] || 'Object' },
          { id: 'e3', emoji: '⚡', labelKk: words[words.length - 1] || 'Әрекет', labelRu: words[words.length - 1] || 'Действие', labelEn: words[words.length - 1] || 'Action' }
        ],
        correctOrderIds: ['e1', 'e2', 'e3']
      },
      suffixContrast: {
        sentenceA: newKazakhText.trim(),
        sentenceB: newKazakhText.trim() + ' да',
        highlightWordA: words[words.length - 1] || '',
        highlightWordB: (words[words.length - 1] || '') + ' да',
        suffixA: 'Түпнұсқа',
        suffixB: 'Шылаулы нұсқа',
        targetQuestionText: {
          kk: 'Қай сөйлемде әрекет дәл орындалды?',
          ru: 'В каком предложении действие завершено?',
          en: 'Which sentence accurately conveys the action?'
        },
        correctSentence: 'A',
        explanationKk: 'Бірінші нұсқа дәл сәйкес келеді.',
        explanationRu: 'Первый вариант точен.',
        explanationEn: 'Sentence A is the direct form.'
      }
    };

    setStimuli(prev => [newStimulus, ...prev]);
    setBuilderSuccess(true);
    setTimeout(() => {
      setBuilderSuccess(false);
      setIsBuilderOpen(false);
      setNewKazakhText('');
      setNewLatinText('');
      setNewGloss('');
      setNewSyntacticFocus('');
      setNewQuestionTextKk('');
      setNewOptionCorrect('');
      setNewOptionDistractor('');
      showFeedback(lang === 'kk' ? `Жаңа стимул қосылды: ${newId}` : `New stimulus created: ${newId}`);
    }, 500);
  };

  // Handle Stimulus Update
  const handleSaveEditedStimulus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStimulus) return;

    const words = editingStimulus.sentenceKazakh.trim().split(/\s+/);
    const updated: StimulusSentence = {
      ...editingStimulus,
      wordCount: words.length,
      words,
      length: words.length <= 5 ? 'short' : 'long'
    };

    setStimuli(prev => prev.map(s => s.id === updated.id ? updated : s));
    setEditingStimulus(null);
    showFeedback(
      lang === 'kk'
        ? `Стимул «${updated.id}» сәтті жаңартылды!`
        : `Stimulus "${updated.id}" successfully updated!`
    );
  };

  // Delete Stimulus
  const handleDeleteStimulus = (id: string) => {
    if (window.confirm(lang === 'kk' ? `Стимулды (${id}) өшіруді растайсыз ба?` : `Confirm deleting stimulus (${id})?`)) {
      setStimuli(prev => prev.filter(s => s.id !== id));
      showFeedback(lang === 'kk' ? `Стимул өшірілді: ${id}` : `Stimulus removed: ${id}`);
    }
  };

  // Reset to Full 120-sentence Battery
  const handleReloadBattery120 = () => {
    const battery = generateExpandedStimuliBattery();
    setStimuli(battery);
    showFeedback(
      lang === 'kk'
        ? `120 ғылыми стимул жиынтығы толықтай жаңартылды!`
        : `120-stimuli scientific battery fully restored!`
    );
  };

  const showFeedback = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  // Export Stimuli Dataset as CSV
  const exportStimuliCsv = () => {
    const headers = ['ID', 'SentenceKazakh', 'WordOrder', 'Complexity', 'Length', 'Predictability', 'WordCount', 'Gloss', 'QuestionKk', 'CorrectAnswer'];
    const rows = stimuli.map(s => [
      s.id,
      `"${s.sentenceKazakh.replace(/"/g, '""')}"`,
      s.wordOrder,
      s.complexity,
      s.length,
      s.predictability,
      s.wordCount,
      `"${s.morphologicalGloss.replace(/"/g, '""')}"`,
      `"${s.question.questionText.kk.replace(/"/g, '""')}"`,
      `"${(s.question.options.find(o => o.id === s.question.correctOptionId)?.textKk || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `lingualyze_stimuli_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export Stimuli Dataset as JSON
  const exportStimuliJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(stimuli, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `lingualyze_stimuli_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleAdminUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPasscode.trim() === 'linguo2026' || adminPasscode.trim() === 'admin') {
      setCurrentRole('researcher');
      setAdminPasscode('');
      setPasscodeError('');
    } else {
      setPasscodeError(lang === 'kk' ? 'Құпиясөз қате (linguo2026)' : 'Invalid passcode (try linguo2026)');
    }
  };

  // If user is currently 'participant', show the Researcher Gate
  if (currentRole !== 'researcher') {
    return (
      <div className="max-w-xl mx-auto p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm text-center space-y-6 my-12">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-center mx-auto text-amber-600 dark:text-amber-400">
          <Lock className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {lang === 'kk' ? 'Зерттеуші және ғалымдар басқару тақтасы' : lang === 'ru' ? 'Панель исследователя и ученого' : 'Researcher & Scientist Panel'}
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            {lang === 'kk' 
              ? 'Бұл бөлім тек психолингвист-зерттеушілерге арналған. Эксперимент нәтижелерін экспорттау, стимулдарды қосу/өңдеу және глоссаларды тексеру үшін құпия кілтті енгізіңіз немесе рөлді ауыстырыңыз.'
              : 'This section contains sensitive stimuli manipulation and experiment records. Please enter the passcode to switch to Researcher role.'}
          </p>
        </div>

        <form onSubmit={handleAdminUnlock} className="space-y-3 max-w-sm mx-auto text-left">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              {lang === 'kk' ? 'Зерттеуші коды (linguo2026)' : 'Researcher Code (linguo2026)'}
            </label>
            <input
              type="password"
              value={adminPasscode}
              onChange={(e) => setAdminPasscode(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-emerald-600"
            />
            {passcodeError && (
              <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium mt-1">{passcodeError}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Unlock className="w-4 h-4" />
            <span>{lang === 'kk' ? 'Ғалым ретінде ашу' : lang === 'ru' ? 'Войти как Ученый' : 'Unlock Scientist View'}</span>
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      
      {/* Feedback Toast */}
      {feedbackToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-emerald-600 text-white shadow-xl text-xs font-bold animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-4 h-4" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Sub-Tabs Switcher for Researcher Database */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
          <button
            onClick={() => setActiveSubTab('stimuli')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'stimuli'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{lang === 'kk' ? 'Стимулдар базасы (CRUD)' : 'Stimulus Database (CRUD)'}</span>
          </button>

          <button
            onClick={() => setActiveSubTab('test_records')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'test_records'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <ClipboardList className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>{lang === 'kk' ? 'Сынақ жазбаларының базасы' : 'Test Sessions Database'}</span>
          </button>
        </div>

        {/* Role Badge and Sign out */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 self-end sm:self-auto">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
            {lang === 'kk' ? 'Зерттеуші режимі қосулы' : 'Researcher Admin Active'}
          </span>
          <button
            onClick={() => setCurrentRole('participant')}
            className="text-[10px] underline font-medium text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 ml-1 cursor-pointer"
          >
            {lang === 'kk' ? 'Шығу' : 'Sign out'}
          </button>
        </div>
      </div>

      {/* RENDER ACTIVE SUBTAB */}
      {activeSubTab === 'test_records' ? (
        <TestRecordsViewer lang={lang} />
      ) : (
        <div className="space-y-6">
          
          {/* Header & CRUD Action Bar */}
          <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                <Database className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{t.stimuliDatabase}</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                {lang === 'kk' 
                  ? 'Қазақ тілінің эксперименттік стимулдар базасы'
                  : 'Kazakh Experimental Stimuli Database'}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {lang === 'kk'
                  ? `Жалпы стимулдар: ${totalStimuli} сөйлем (Канондық SOV, ығысқан OSV, байланысты SVO және OVS құрылымдарымен)`
                  : `Total Stimuli: ${totalStimuli} sentences (Covering canonical SOV, scrambled OSV, SVO, and OVS structures)`}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setIsBuilderOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>{lang === 'kk' ? 'Стимул қосу' : 'Add Stimulus'}</span>
              </button>

              <button
                onClick={handleReloadBattery120}
                title={lang === 'kk' ? '120 ғылыми стимул жиынтығын қалпына келтіру' : 'Reset 120 Stimuli Battery'}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl transition-all cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>{lang === 'kk' ? '120 стимул' : '120 Battery'}</span>
              </button>

              <button
                onClick={exportStimuliCsv}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                title="Export stimuli as CSV"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>CSV</span>
              </button>

              <button
                onClick={exportStimuliJson}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                title="Export stimuli as JSON"
              >
                <FileCode2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                <span>JSON</span>
              </button>
            </div>
          </div>

          {/* Sentence Counts Statistics Banner (Clear counts required by Part 2) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                {lang === 'kk' ? 'Жалпы стимул' : 'Total Stimuli'}
              </span>
              <p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                {totalStimuli} <span className="text-xs font-normal text-slate-400">{lang === 'kk' ? 'сөйлем' : 'sent.'}</span>
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 shadow-xs">
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
                SOV (Канондық)
              </span>
              <p className="text-xl font-bold text-emerald-800 dark:text-emerald-300 mt-0.5">
                {sovCount}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-teal-50/60 dark:bg-teal-950/20 border border-teal-200/60 dark:border-teal-800/40 shadow-xs">
              <span className="text-[10px] font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider block">
                OSV (Ығысқан)
              </span>
              <p className="text-xl font-bold text-teal-800 dark:text-teal-300 mt-0.5">
                {osvCount}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 shadow-xs">
              <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider block">
                SVO / OVS
              </span>
              <p className="text-xl font-bold text-amber-800 dark:text-amber-300 mt-0.5">
                {svoCount + ovsCount}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                {lang === 'kk' ? 'Қысқа / Ұзын' : 'Short / Long'}
              </span>
              <p className="text-base font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                {shortCount} <span className="text-xs font-normal text-slate-400">/ {longCount}</span>
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                {lang === 'kk' ? 'Қарапайым / Күрделі' : 'Simple / Complex'}
              </span>
              <p className="text-base font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                {simpleCount} <span className="text-xs font-normal text-slate-400">/ {complexCount}</span>
              </p>
            </div>
          </div>

          {/* Full Filter & Search System (4 Filter criteria required by Part 2) */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
              <Filter className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{lang === 'kk' ? 'Сүзгілер мен іздеу жүйесі' : 'Filter & Tag System'}</span>
              <span className="text-[11px] font-normal text-slate-400">({filteredStimuli.length} / {totalStimuli})</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {/* Search */}
              <div className="relative lg:col-span-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={lang === 'kk' ? 'Сөз, глосса, ID...' : 'Search word, gloss...'}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-emerald-600"
                />
              </div>

              {/* 1. Word Order Filter */}
              <div>
                <select
                  value={filterWordOrder}
                  onChange={(e) => setFilterWordOrder(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-emerald-600"
                >
                  <option value="all">{lang === 'kk' ? 'Барлық тәртіптер (All)' : 'All Word Orders'}</option>
                  <option value="SOV">SOV ({lang === 'kk' ? 'Канондық' : 'Canonical'})</option>
                  <option value="OSV">OSV ({lang === 'kk' ? 'Ығысқан/Топикальды' : 'Scrambled'})</option>
                  <option value="SVO">SVO ({lang === 'kk' ? 'Тілдік байланыс' : 'Contact-induced'})</option>
                  <option value="OVS">OVS ({lang === 'kk' ? 'Фокализация' : 'Focalized'})</option>
                </select>
              </div>

              {/* 2. Sentence Length Filter */}
              <div>
                <select
                  value={filterLength}
                  onChange={(e) => setFilterLength(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-emerald-600"
                >
                  <option value="all">{lang === 'kk' ? 'Барлық ұзындықтар' : 'All Lengths'}</option>
                  <option value="short">{lang === 'kk' ? 'Қысқа (3–5 сөз)' : 'Short (3–5 words)'}</option>
                  <option value="long">{lang === 'kk' ? 'Ұзын (6–9 сөз)' : 'Long (6–9 words)'}</option>
                </select>
              </div>

              {/* 3. Syntactic Complexity Filter */}
              <div>
                <select
                  value={filterComplexity}
                  onChange={(e) => setFilterComplexity(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-emerald-600"
                >
                  <option value="all">{lang === 'kk' ? 'Барлық күрделілік' : 'All Complexities'}</option>
                  <option value="simple">{lang === 'kk' ? 'Қарапайым (Simple)' : 'Simple'}</option>
                  <option value="complex">{lang === 'kk' ? 'Күрделі (Complex)' : 'Complex'}</option>
                </select>
              </div>

              {/* 4. Predictability Filter */}
              <div>
                <select
                  value={filterPredictability}
                  onChange={(e) => setFilterPredictability(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-emerald-600"
                >
                  <option value="all">{lang === 'kk' ? 'Барлық болжамдылық' : 'All Predictability'}</option>
                  <option value="high">{lang === 'kk' ? 'Болжамды (High)' : 'High (Expected)'}</option>
                  <option value="low">{lang === 'kk' ? 'Күтпеген (Low)' : 'Low (Unexpected)'}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Stimuli Grid Cards (CRUD Read, Update, Delete) */}
          <div className="space-y-3">
            {filteredStimuli.length === 0 ? (
              <div className="p-12 text-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400">
                <Database className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="font-medium text-xs">
                  {lang === 'kk' ? 'Сүзгі талаптарына сәйкес стимулдар табылмады' : 'No stimuli match the selected filters'}
                </p>
              </div>
            ) : (
              filteredStimuli.map((stimulus) => (
                <div
                  key={stimulus.id}
                  className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-3 shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="font-mono text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                        {stimulus.id}
                      </span>

                      {/* Word Order Tag */}
                      <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold border ${
                        stimulus.wordOrder === 'SOV'
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                          : stimulus.wordOrder === 'OSV'
                          ? 'bg-teal-50 dark:bg-teal-950/50 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800'
                          : stimulus.wordOrder === 'SVO'
                          ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                          : 'bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                      }`}>
                        {stimulus.wordOrder}
                      </span>

                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium">
                        {stimulus.complexity === 'simple' ? (lang === 'kk' ? 'Қарапайым' : 'Simple') : (lang === 'kk' ? 'Күрделі' : 'Complex')}
                      </span>

                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium">
                        {stimulus.length === 'short' || stimulus.wordCount <= 5 ? (lang === 'kk' ? 'Қысқа' : 'Short') : (lang === 'kk' ? 'Ұзын' : 'Long')} ({stimulus.wordCount} {lang === 'kk' ? 'сөз' : 'w'})
                      </span>

                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium">
                        {stimulus.predictability === 'high' ? (lang === 'kk' ? 'Болжамды' : 'High') : (lang === 'kk' ? 'Күтпеген' : 'Low')}
                      </span>

                      {stimulus.cefrLevel && (
                        <span className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold font-mono">
                          {stimulus.cefrLevel}
                        </span>
                      )}
                    </div>

                    {/* CRUD Actions: Inspect, Update (Edit), Delete */}
                    <div className="flex items-center gap-1.5 ml-auto sm:ml-0">
                      <button
                        onClick={() => setSelectedStimulusForDetail(stimulus)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs flex items-center gap-1 transition-colors font-medium cursor-pointer"
                        title="Inspect full details"
                      >
                        <Eye className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>{lang === 'kk' ? 'Глосса' : 'Inspect'}</span>
                      </button>

                      <button
                        onClick={() => setEditingStimulus(stimulus)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-1 transition-colors font-medium border border-emerald-200 dark:border-emerald-800 cursor-pointer"
                        title="Edit stimulus"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>{lang === 'kk' ? 'Өңдеу' : 'Edit'}</span>
                      </button>

                      <button
                        onClick={() => handleDeleteStimulus(stimulus.id)}
                        className="p-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/50 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                        title="Remove stimulus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Kazakh Sentence Text */}
                  <div className="space-y-0.5">
                    <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-relaxed">
                      «{stimulus.sentenceKazakh}»
                    </p>
                    {stimulus.transliterationLatin && (
                      <p className="text-xs font-serif text-slate-500 dark:text-slate-400 italic">
                        {stimulus.transliterationLatin}
                      </p>
                    )}
                  </div>

                  {/* Interlinear Leipzig Glossing */}
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 font-mono text-xs text-emerald-800 dark:text-emerald-300 overflow-x-auto whitespace-nowrap">
                    {stimulus.morphologicalGloss}
                  </div>

                  {/* Probe Question Preview */}
                  <div className="text-xs text-slate-500 dark:text-slate-400 pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800">
                    <div>
                      <span className="font-semibold text-slate-600 dark:text-slate-300">
                        {lang === 'kk' ? 'Сынақ сұрағы: ' : 'Probe Question: '}
                      </span>
                      <span className="text-slate-900 dark:text-slate-100 font-medium">{stimulus.question.questionText.kk}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                        ✓ {stimulus.question.options.find(o => o.id === stimulus.question.correctOptionId)?.textKk}
                      </span>
                      <span className="text-slate-300 dark:text-slate-600">|</span>
                      <span className="text-slate-500 dark:text-slate-400">
                        ✗ {stimulus.question.options.find(o => o.id !== stimulus.question.correctOptionId)?.textKk}
                      </span>
                    </div>
                  </div>

                </div>
              ))
            )}
          </div>

          {/* DETAIL MODAL: Leipzig Gloss & Linguistic Commentary */}
          {selectedStimulusForDetail && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
              <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      {lang === 'kk' ? 'Лингвистикалық сипаттама және синтаксистік талдау' : 'Linguistic Specification & Syntactic Parse'}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedStimulusForDetail(null)}
                    className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-mono block">
                      {lang === 'kk' ? 'Қазақша стимул:' : 'Kazakh Stimulus:'}
                    </span>
                    <p className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1 leading-relaxed">
                      «{selectedStimulusForDetail.sentenceKazakh}»
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-2">
                      En: {selectedStimulusForDetail.translationEn}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      Ru: {selectedStimulusForDetail.translationRu}
                    </p>
                  </div>

                  <div>
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase font-semibold">
                      {lang === 'kk' ? 'Лейпцигтік морфологиялық глоссалау:' : 'Leipzig Interlinear Glossing:'}
                    </span>
                    <div className="mt-1.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs text-emerald-800 dark:text-emerald-300">
                      {selectedStimulusForDetail.morphologicalGloss}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400 uppercase font-semibold">
                      {lang === 'kk' ? 'Синтаксистік назар және ескертпелер:' : 'Syntactic Focus & Psycholinguistic Notes:'}
                    </span>
                    <p className="mt-1 text-slate-700 dark:text-slate-300 leading-relaxed text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      {selectedStimulusForDetail.syntacticFocus}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setSelectedStimulusForDetail(null)}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    {lang === 'kk' ? 'Жабу' : 'Close'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* EDIT STIMULUS MODAL (CRUD Update) */}
          {editingStimulus && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
              <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl my-8">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Pencil className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      {lang === 'kk' ? `Стимулды өңдеу (${editingStimulus.id})` : `Edit Stimulus (${editingStimulus.id})`}
                    </h3>
                  </div>
                  <button
                    onClick={() => setEditingStimulus(null)}
                    className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveEditedStimulus} className="space-y-4">
                  {/* Kazakh Sentence Text */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {lang === 'kk' ? 'Сөйлем мәтіні (Қазақша)' : 'Sentence Text (Kazakh)'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingStimulus.sentenceKazakh}
                      onChange={(e) => setEditingStimulus({ ...editingStimulus, sentenceKazakh: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-emerald-600"
                    />
                  </div>

                  {/* Latin Transliteration */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {lang === 'kk' ? 'Латын транслитерациясы' : 'Latin Script Transliteration'}
                    </label>
                    <input
                      type="text"
                      value={editingStimulus.transliterationLatin || ''}
                      onChange={(e) => setEditingStimulus({ ...editingStimulus, transliterationLatin: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-emerald-600"
                    />
                  </div>

                  {/* 4 Tags Grid: Word Order, Complexity, Length, Predictability */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        {t.wordOrder}
                      </label>
                      <select
                        value={editingStimulus.wordOrder}
                        onChange={(e) => setEditingStimulus({ ...editingStimulus, wordOrder: e.target.value as WordOrderCondition })}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-emerald-600"
                      >
                        <option value="SOV">SOV</option>
                        <option value="OSV">OSV</option>
                        <option value="SVO">SVO</option>
                        <option value="OVS">OVS</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        {t.complexity}
                      </label>
                      <select
                        value={editingStimulus.complexity}
                        onChange={(e) => setEditingStimulus({ ...editingStimulus, complexity: e.target.value as SyntacticComplexity })}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-emerald-600"
                      >
                        <option value="simple">Simple</option>
                        <option value="complex">Complex</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        {t.length}
                      </label>
                      <select
                        value={editingStimulus.length}
                        onChange={(e) => setEditingStimulus({ ...editingStimulus, length: e.target.value as SentenceLength })}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-emerald-600"
                      >
                        <option value="short">Short</option>
                        <option value="long">Long</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        {lang === 'kk' ? 'Болжамдылық' : 'Predictability'}
                      </label>
                      <select
                        value={editingStimulus.predictability}
                        onChange={(e) => setEditingStimulus({ ...editingStimulus, predictability: e.target.value as PredictabilityLevel })}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-emerald-600"
                      >
                        <option value="high">High</option>
                        <option value="low">Low</option>
                      </select>
                    </div>
                  </div>

                  {/* Leipzig Gloss */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {t.morphologicalGloss}
                    </label>
                    <input
                      type="text"
                      value={editingStimulus.morphologicalGloss}
                      onChange={(e) => setEditingStimulus({ ...editingStimulus, morphologicalGloss: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-emerald-800 dark:text-emerald-300 focus:outline-hidden focus:border-emerald-600"
                    />
                  </div>

                  {/* Question & Options */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
                    <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 block uppercase">
                      {lang === 'kk' ? 'Сұрақ пен жауап кілті' : 'Probe Question & Answer Keys'}
                    </span>

                    <div>
                      <label className="block text-xs text-slate-600 dark:text-slate-300 mb-1">
                        {lang === 'kk' ? 'Сұрақ мәтіні' : 'Question Text'}
                      </label>
                      <input
                        type="text"
                        value={editingStimulus.question.questionText.kk}
                        onChange={(e) => setEditingStimulus({
                          ...editingStimulus,
                          question: {
                            ...editingStimulus.question,
                            questionText: {
                              ...editingStimulus.question.questionText,
                              kk: e.target.value
                            }
                          }
                        })}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-emerald-600"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-emerald-700 dark:text-emerald-400 font-semibold mb-1">
                          {lang === 'kk' ? 'Дұрыс жауап' : 'Correct Answer'}
                        </label>
                        <input
                          type="text"
                          value={editingStimulus.question.options.find(o => o.id === editingStimulus.question.correctOptionId)?.textKk || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setEditingStimulus({
                              ...editingStimulus,
                              question: {
                                ...editingStimulus.question,
                                options: editingStimulus.question.options.map(o => 
                                  o.id === editingStimulus.question.correctOptionId ? { ...o, textKk: val } : o
                                )
                              }
                            });
                          }}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-emerald-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-rose-700 dark:text-rose-400 font-semibold mb-1">
                          {lang === 'kk' ? 'Қате дистрактор' : 'Distractor Answer'}
                        </label>
                        <input
                          type="text"
                          value={editingStimulus.question.options.find(o => o.id !== editingStimulus.question.correctOptionId)?.textKk || ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            setEditingStimulus({
                              ...editingStimulus,
                              question: {
                                ...editingStimulus.question,
                                options: editingStimulus.question.options.map(o => 
                                  o.id !== editingStimulus.question.correctOptionId ? { ...o, textKk: val } : o
                                )
                              }
                            });
                          }}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-emerald-600"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit / Cancel */}
                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingStimulus(null)}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      {lang === 'kk' ? 'Бас тарту' : 'Cancel'}
                    </button>

                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>{lang === 'kk' ? 'Жаңартуды сақтау' : 'Save Changes'}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* CREATE STIMULUS MODAL (CRUD Create) */}
          {isBuilderOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
              <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl my-8">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{t.addNewSentence}</h3>
                  </div>
                  <button
                    onClick={() => setIsBuilderOpen(false)}
                    className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleCreateStimulus} className="space-y-4">
                  {/* Kazakh Sentence Text */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {t.sentenceText} *
                    </label>
                    <input
                      type="text"
                      required
                      value={newKazakhText}
                      onChange={(e) => setNewKazakhText(e.target.value)}
                      placeholder="e.g. Ғалым зертханада маңызды сынақты аяқтады."
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-emerald-600"
                    />
                  </div>

                  {/* Latin Transliteration */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {lang === 'kk' ? 'Латын транслитерациясы (Қосымша)' : 'Latin Script Transliteration (Optional)'}
                    </label>
                    <input
                      type="text"
                      value={newLatinText}
                      onChange={(e) => setNewLatinText(e.target.value)}
                      placeholder="e.g. Ġalym zerthanada mańyzdy synaqty aıaqtady."
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-emerald-600"
                    />
                  </div>

                  {/* Tags: Word Order, Complexity, Predictability */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        {t.wordOrder} *
                      </label>
                      <select
                        value={newWordOrder}
                        onChange={(e) => setNewWordOrder(e.target.value as any)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-emerald-600"
                      >
                        <option value="SOV">SOV ({lang === 'kk' ? 'Канондық' : 'Canonical'})</option>
                        <option value="OSV">OSV ({lang === 'kk' ? 'Ығысқан' : 'Scrambled'})</option>
                        <option value="SVO">SVO ({lang === 'kk' ? 'Тілдік байланыс' : 'Contact'})</option>
                        <option value="OVS">OVS ({lang === 'kk' ? 'Фокализация' : 'Focalized'})</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        {t.complexity}
                      </label>
                      <select
                        value={newComplexity}
                        onChange={(e) => setNewComplexity(e.target.value as any)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-emerald-600"
                      >
                        <option value="simple">{t.simple}</option>
                        <option value="complex">{t.complex}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        {lang === 'kk' ? 'Болжамдылық' : 'Predictability'}
                      </label>
                      <select
                        value={newPredictability}
                        onChange={(e) => setNewPredictability(e.target.value as any)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-emerald-600"
                      >
                        <option value="high">{lang === 'kk' ? 'Болжамды' : 'High'}</option>
                        <option value="low">{lang === 'kk' ? 'Күтпеген' : 'Low'}</option>
                      </select>
                    </div>
                  </div>

                  {/* Leipzig Morphological Gloss */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {t.morphologicalGloss}
                    </label>
                    <input
                      type="text"
                      value={newGloss}
                      onChange={(e) => setNewGloss(e.target.value)}
                      placeholder="e.g. scientist-NOM lab-LOC important experiment-ACC finish-PST.3SG"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-emerald-800 dark:text-emerald-300 focus:outline-hidden focus:border-emerald-600"
                    />
                  </div>

                  {/* Syntactic Commentary */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {t.syntacticFocus}
                    </label>
                    <input
                      type="text"
                      value={newSyntacticFocus}
                      onChange={(e) => setNewSyntacticFocus(e.target.value)}
                      placeholder="e.g. Канондық SOV, барыс септікті жанама толықтауышпен."
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-emerald-600"
                    />
                  </div>

                  {/* Comprehension Question Builder */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
                    <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 block uppercase">
                      {lang === 'kk' ? 'Сұрақ пен дұрыс/қате жауаптар' : 'Comprehension Question (Binary Probe)'}
                    </span>

                    <div>
                      <label className="block text-xs text-slate-600 dark:text-slate-300 mb-1">
                        {lang === 'kk' ? 'Сұрақ мәтіні (Қазақша) *' : 'Question Text (Kazakh) *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={newQuestionTextKk}
                        onChange={(e) => setNewQuestionTextKk(e.target.value)}
                        placeholder="e.g. Ғалым зертханада нені аяқтады?"
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-emerald-600"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-emerald-700 dark:text-emerald-400 font-semibold mb-1">
                          {t.correctAnswer} (A) *
                        </label>
                        <input
                          type="text"
                          required
                          value={newOptionCorrect}
                          onChange={(e) => setNewOptionCorrect(e.target.value)}
                          placeholder="e.g. Маңызды сынақты"
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-emerald-600"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-rose-700 dark:text-rose-400 font-semibold mb-1">
                          {t.distractor} (B) *
                        </label>
                        <input
                          type="text"
                          required
                          value={newOptionDistractor}
                          onChange={(e) => setNewOptionDistractor(e.target.value)}
                          placeholder="e.g. Қарапайым жаттығуды"
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-emerald-600"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsBuilderOpen(false)}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      {lang === 'kk' ? 'Бас тарту' : 'Cancel'}
                    </button>

                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
                    >
                      {builderSuccess ? (
                        <>
                          <Check className="w-4 h-4 stroke-[3]" />
                          <span>{t.sentenceSaved}</span>
                        </>
                      ) : (
                        <>
                          <span>{t.saveSentence}</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>

                </form>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
