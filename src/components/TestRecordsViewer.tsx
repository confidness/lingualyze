import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  Eye, 
  FileSpreadsheet, 
  FileCode2, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Users, 
  Activity, 
  RotateCcw,
  Sparkles,
  Layers,
  ChevronRight,
  X,
  AlertTriangle
} from 'lucide-react';
import { LanguageCode, StoredTestRecord, DetailedResponseItem, WordOrderCondition, LanguageDominanceGroup } from '../types';
import { translations } from '../data/translations';
import { storageEngine, DB_CHANGE_EVENT } from '../utils/storageEngine';

interface TestRecordsViewerProps {
  lang: LanguageCode;
}

export const TestRecordsViewer: React.FC<TestRecordsViewerProps> = ({ lang }) => {
  const [sessions, setSessions] = useState<StoredTestRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOrder, setFilterOrder] = useState<string>('all');
  const [filterCohort, setFilterCohort] = useState<string>('all');
  const [selectedRecord, setSelectedRecord] = useState<StoredTestRecord | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const t = translations[lang];

  const refreshData = () => {
    setSessions(storageEngine.getAllSessions());
  };

  useEffect(() => {
    refreshData();
    const handleDbChange = () => refreshData();
    window.addEventListener(DB_CHANGE_EVENT, handleDbChange);
    return () => window.removeEventListener(DB_CHANGE_EVENT, handleDbChange);
  }, []);

  const stats = storageEngine.getStats();

  // Filtered Sessions
  const filteredSessions = sessions.filter(item => {
    const matchesSearch = 
      item.participant_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.test_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.notes && item.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.detailed_responses && item.detailed_responses.some(d => d.sentence_kazakh.toLowerCase().includes(searchTerm.toLowerCase())));

    const matchesOrder = filterOrder === 'all' || item.wordOrder === filterOrder || item.word_order === filterOrder;
    const matchesCohort = filterCohort === 'all' || item.cohort === filterCohort;

    return matchesSearch && matchesOrder && matchesCohort;
  });

  const handleDelete = (testId: string) => {
    storageEngine.deleteSession(testId);
    setConfirmDeleteId(null);
    setFeedbackMessage(lang === 'kk' ? 'Сынақ жазбасы өшірілді' : 'Record deleted successfully');
    setTimeout(() => setFeedbackMessage(null), 2500);
  };

  const handleClearAll = () => {
    if (window.confirm(
      lang === 'kk'
        ? 'Барлық сынақ жазбаларын толықтай тазартқыңыз келе ме?'
        : 'Are you sure you want to delete all test records from the database?'
    )) {
      storageEngine.clearAllSessions();
      setFeedbackMessage(lang === 'kk' ? 'База толық тазартылды' : 'All records cleared');
      setTimeout(() => setFeedbackMessage(null), 2500);
    }
  };

  const handleResetSeeds = () => {
    storageEngine.resetToSeeds();
    setFeedbackMessage(lang === 'kk' ? 'Эталонды ғылыми сынақтар қалпына келтірілді' : 'Benchmark seeds restored');
    setTimeout(() => setFeedbackMessage(null), 2500);
  };

  const handleCleanupDuplicates = async () => {
    const result = await storageEngine.cleanupDuplicatesAndCorrupted();
    setFeedbackMessage(
      lang === 'kk'
        ? `База оңтайландырылды: ${result.duplicatesRemoved} қайталанған дубликат, ${result.corruptedRemoved} қате жазба тазартылды (${result.totalClean} таза жазба сақталды).`
        : `Database sanitized: ${result.duplicatesRemoved} duplicates, ${result.corruptedRemoved} corrupted entries removed (${result.totalClean} clean records remaining).`
    );
    setTimeout(() => setFeedbackMessage(null), 3500);
  };

  const formatCohortName = (c: LanguageDominanceGroup) => {
    if (c === 'kazakh_dominant') return lang === 'kk' ? 'Қазақ-доминантты (L1)' : 'Kazakh Dominant (L1)';
    if (c === 'bilingual_balanced') return lang === 'kk' ? 'Теңгерімді Билингв' : 'Balanced Bilingual';
    return lang === 'kk' ? 'Қазақ тілін үйренуші (L2)' : 'Kazakh L2 Learner';
  };

  return (
    <div className="space-y-6">
      
      {/* Centralized Cloud Status Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="font-bold text-slate-800 dark:text-slate-200">
            {lang === 'kk' ? 'Орталықтандырылған ғылыми деректер қоры (Central REST API)' : 'Centralized Research Cloud Database (REST API)'}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-mono text-[10px] font-bold">
            SYNCED
          </span>
        </div>
        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
          {lang === 'kk' ? 'Барлық құрылғылардан автоматты шоғырландыру' : 'Cross-device consolidation active'}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              {lang === 'kk' ? 'Жалпы жазбалар' : 'Total Sessions'}
            </span>
            <Database className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 dark:text-slate-100">
            {stats.totalRecords}
          </div>
          <span className="text-[10px] text-slate-400 dark:text-slate-500">
            {(stats.storageSizeBytes / 1024).toFixed(1)} KB {lang === 'kk' ? 'көлем' : 'storage'}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              {lang === 'kk' ? 'Респонденттер' : 'Participants'}
            </span>
            <Users className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 dark:text-slate-100">
            {stats.totalParticipants}
          </div>
          <span className="text-[10px] text-slate-400 dark:text-slate-500">
            {lang === 'kk' ? 'бірегей ID-лер' : 'unique cohort IDs'}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              {lang === 'kk' ? 'Орташа оқу латенттігі' : 'Mean Reading'}
            </span>
            <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 dark:text-slate-100">
            {stats.avgReadingTimeMs} <span className="text-xs font-normal text-slate-400">мс</span>
          </div>
          <span className="text-[10px] text-slate-400 dark:text-slate-500">
            RT: {stats.avgReactionTimeMs} мс
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              {lang === 'kk' ? 'Орташа дәлдік' : 'Mean Accuracy'}
            </span>
            <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
            {stats.avgAccuracy}%
          </div>
          <span className="text-[10px] text-slate-400 dark:text-slate-500">
            {lang === 'kk' ? '3 бөлімді тест бойынша' : 'across 3-part test'}
          </span>
        </div>
      </div>

      {feedbackMessage && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Control Bar: Search, Filters & Export */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder={lang === 'kk' ? 'Қатысушы ID, UUID немесе мәтін бойынша іздеу...' : 'Search participant, UUID, or sentence...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Order filter */}
          <select
            value={filterOrder}
            onChange={(e) => setFilterOrder(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">{lang === 'kk' ? 'Барлық сөз тәртібі' : 'All Word Orders'}</option>
            <option value="SOV">SOV (Қалыпты)</option>
            <option value="OSV">OSV (Топикалды)</option>
            <option value="SVO">SVO (Түйісу)</option>
            <option value="OVS">OVS (Фокусталған)</option>
          </select>

          {/* Cohort filter */}
          <select
            value={filterCohort}
            onChange={(e) => setFilterCohort(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">{lang === 'kk' ? 'Барлық когорталар' : 'All Cohorts'}</option>
            <option value="kazakh_dominant">{lang === 'kk' ? 'Қазақ-доминантты (L1)' : 'Kazakh Dominant'}</option>
            <option value="bilingual_balanced">{lang === 'kk' ? 'Билингвтер' : 'Bilingual'}</option>
            <option value="kazakh_l2">{lang === 'kk' ? 'Қазақ тілі L2' : 'Kazakh L2'}</option>
          </select>

          {/* Actions: CSV, JSON, Reset, Clear */}
          <div className="flex items-center gap-1.5 ml-auto">
            <button
              onClick={() => storageEngine.exportCsv()}
              title={lang === 'kk' ? 'CSV экспорттау' : 'Export CSV'}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>CSV</span>
            </button>
            <button
              onClick={() => storageEngine.exportJson()}
              title={lang === 'kk' ? 'JSON экспорттау' : 'Export JSON'}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors"
            >
              <FileCode2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>JSON</span>
            </button>
            <button
              onClick={handleCleanupDuplicates}
              title={lang === 'kk' ? 'Дубликаттар мен қате жазбаларды тазарту' : 'Clean Duplicates & Corrupted Records'}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-xs font-bold border border-amber-200/80 dark:border-amber-800/80 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>{lang === 'kk' ? 'Тазарту' : 'Deduplicate'}</span>
            </button>
            <button
              onClick={handleResetSeeds}
              title={lang === 'kk' ? 'Үлгі деректерді қалпына келтіру' : 'Reset Benchmark Seeds'}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleClearAll}
              title={lang === 'kk' ? 'Базаны тазалау' : 'Clear All Sessions'}
              className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

      {/* Records Table */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">{lang === 'kk' ? 'Сынақ ID' : 'Test UUID'}</th>
                <th className="py-3.5 px-4">{lang === 'kk' ? 'Қатысушы' : 'Participant'}</th>
                <th className="py-3.5 px-4">{lang === 'kk' ? 'Тілдік топ' : 'Cohort'}</th>
                <th className="py-3.5 px-4">{lang === 'kk' ? 'Уақыты' : 'Timestamp'}</th>
                <th className="py-3.5 px-4">{lang === 'kk' ? 'Тәртіп' : 'Order'}</th>
                <th className="py-3.5 px-4 text-right">{lang === 'kk' ? 'Оқу уақыты' : 'Reading'}</th>
                <th className="py-3.5 px-4 text-right">{lang === 'kk' ? 'Реакция' : 'Reaction'}</th>
                <th className="py-3.5 px-4 text-center">{lang === 'kk' ? 'Дәлдік' : 'Accuracy'}</th>
                <th className="py-3.5 px-4 text-right">{lang === 'kk' ? 'Әрекет' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredSessions.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400 dark:text-slate-500">
                    <Database className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p className="font-medium">
                      {lang === 'kk' ? 'Сынақ жазбалары табылмады' : 'No recorded sessions match the criteria'}
                    </p>
                    <p className="text-[11px] mt-1">
                      {lang === 'kk' ? 'Жаңа сынақ өткізіңіз немесе эталонды деректерді қалпына келтіріңіз' : 'Run an experiment test or click reset to reload benchmark records.'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredSessions.map((session) => {
                  const order = session.word_order || session.wordOrder || 'SOV';
                  const isSov = order === 'SOV';
                  return (
                    <tr 
                      key={session.test_id}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* UUID */}
                      <td className="py-3.5 px-4 font-mono text-slate-500 dark:text-slate-400">
                        <span className="font-semibold text-slate-900 dark:text-slate-200">
                          {session.test_id.slice(0, 8)}...
                        </span>
                      </td>

                      {/* Participant */}
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-700 dark:text-emerald-400">
                        {session.participant_id}
                      </td>

                      {/* Cohort */}
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                          session.cohort === 'kazakh_dominant' 
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                            : session.cohort === 'bilingual_balanced'
                            ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                            : 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                        }`}>
                          {formatCohortName(session.cohort)}
                        </span>
                      </td>

                      {/* Timestamp */}
                      <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                        {new Date(session.timestamp).toLocaleDateString()} {new Date(session.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>

                      {/* Word Order */}
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-md font-mono font-bold text-[10px] ${
                          isSov 
                            ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/60 dark:text-emerald-200' 
                            : 'bg-amber-100 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200'
                        }`}>
                          {order}
                        </span>
                      </td>

                      {/* Reading time */}
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-800 dark:text-slate-200">
                        {session.reading_time_ms} мс
                      </td>

                      {/* Reaction time */}
                      <td className="py-3.5 px-4 text-right font-mono text-slate-600 dark:text-slate-400">
                        {session.reaction_time_ms} мс
                      </td>

                      {/* Accuracy Score */}
                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded-full font-bold text-[11px] ${
                          session.accuracy_score >= 80
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : session.accuracy_score >= 50
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        }`}>
                          {session.accuracy_score}%
                        </span>
                      </td>

                      {/* Action buttons */}
                      <td className="py-3.5 px-4 text-right space-x-1.5">
                        <button
                          onClick={() => setSelectedRecord(session)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                          title="Деректерді қарау / Inspect Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(session.test_id)}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 transition-colors"
                          title="Жазбаны өшіру / Delete Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Inspection Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div 
            className="w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <Database className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {lang === 'kk' ? 'Сынақ жазбасының толық сипаттамасы' : 'Detailed Session Response Log'}
                  </h3>
                  <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
                    ID: {selectedRecord.test_id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Session Info Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">{lang === 'kk' ? 'Респондент' : 'Participant'}</span>
                <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{selectedRecord.participant_id}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">{lang === 'kk' ? 'Тілдік топ' : 'Cohort'}</span>
                <span className="font-medium text-slate-900 dark:text-slate-100">{formatCohortName(selectedRecord.cohort)}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">{lang === 'kk' ? 'Сөз тәртібі' : 'Word Order'}</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{selectedRecord.word_order || selectedRecord.wordOrder}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <span className="text-[10px] text-slate-400 block font-bold uppercase">{lang === 'kk' ? 'Дәлдік' : 'Accuracy'}</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{selectedRecord.accuracy_score}%</span>
              </div>
            </div>

            {/* Detailed Responses Breakdown */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                {lang === 'kk' ? 'Стимулдар және Қателер мониторингі (Detailed Responses)' : 'Detailed Stimulus Responses'}
              </h4>

              {selectedRecord.detailed_responses && selectedRecord.detailed_responses.length > 0 ? (
                <div className="space-y-3">
                  {selectedRecord.detailed_responses.map((detail, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                          {detail.stimulus_id}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-mono font-bold text-[10px]">
                            {detail.word_order}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            detail.is_overall_correct 
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200' 
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200'
                          }`}>
                            {detail.is_overall_correct ? 'CORRECT' : 'ERROR'}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100 italic bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                        "{detail.sentence_kazakh}"
                      </p>

                      {/* 3-Part Test Breakdown */}
                      <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                        <div className={`p-2 rounded-xl border ${detail.part1_correct ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300' : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300'}`}>
                          <span className="block font-bold text-[10px]">{lang === 'kk' ? '1-бөлім: Тізбек' : 'Part 1: Chain'}</span>
                          <span>{detail.part1_correct ? '✓ Дұрыс' : '✗ Қате'}</span>
                        </div>
                        <div className={`p-2 rounded-xl border ${detail.part2_correct ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300' : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300'}`}>
                          <span className="block font-bold text-[10px]">{lang === 'kk' ? '2-бөлім: Эмодзи' : 'Part 2: Emoji'}</span>
                          <span>{detail.part2_correct ? '✓ Дұрыс' : '✗ Қате'}</span>
                        </div>
                        <div className={`p-2 rounded-xl border ${detail.part3_correct ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300' : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300'}`}>
                          <span className="block font-bold text-[10px]">{lang === 'kk' ? '3-бөлім: Септік' : 'Part 3: Suffix'}</span>
                          <span>{detail.part3_correct ? '✓ Дұрыс' : '✗ Қате'}</span>
                        </div>
                      </div>

                      {detail.error_type && (
                        <div className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">
                          {lang === 'kk' ? 'Қате сипаты: ' : 'Error Type: '}{detail.error_type}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-center text-xs text-slate-400">
                  {lang === 'kk' ? 'Толық жауаптар тізімі бос' : 'No detailed response items logged'}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors"
              >
                {lang === 'kk' ? 'Жабу' : 'Close'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
