import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  FileSpreadsheet, 
  FileCode2, 
  Eye, 
  Trash2, 
  RefreshCw, 
  Clock, 
  Activity, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  X, 
  Calendar, 
  Phone, 
  User, 
  Sparkles, 
  Layers, 
  GraduationCap,
  ChevronDown,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { 
  LanguageCode, 
  StoredTestRecord, 
  DetailedResponseItem, 
  UserRole,
  LanguageDominanceGroup,
  WordOrderCondition
} from '../types';
import { translations } from '../data/translations';
import { storageEngine, DB_CHANGE_EVENT } from '../utils/storageEngine';

interface AdminDashboardProps {
  lang: LanguageCode;
  currentRole: UserRole;
  onOpenAuthModal?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  lang,
  currentRole,
  onOpenAuthModal
}) => {
  const t = translations[lang];
  const [sessions, setSessions] = useState<StoredTestRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAge, setFilterAge] = useState<string>('all');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [selectedRecord, setSelectedRecord] = useState<StoredTestRecord | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

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

  // Filter sessions based on search term, age bracket, and level
  const filteredSessions = sessions.filter(item => {
    const studentName = item.student_name || item.participant_id || '';
    const phone = item.phone_number || '';
    const id = item.participant_id || '';
    const testId = item.test_id || '';

    const matchesSearch = 
      studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.notes && item.notes.toLowerCase().includes(searchTerm.toLowerCase()));

    // Filter by Age Bracket
    let matchesAge = true;
    const age = item.age || 0;
    if (filterAge === 'under15') {
      matchesAge = age < 15;
    } else if (filterAge === '15to18') {
      matchesAge = age >= 15 && age <= 18;
    } else if (filterAge === '19to25') {
      matchesAge = age >= 19 && age <= 25;
    } else if (filterAge === '25plus') {
      matchesAge = age > 25;
    }

    // Filter by CEFR Level
    let matchesLevel = true;
    if (filterLevel !== 'all') {
      matchesLevel = (item.cefr_level || 'B1') === filterLevel;
    }

    return matchesSearch && matchesAge && matchesLevel;
  });

  const handleDelete = (testId: string) => {
    storageEngine.deleteSession(testId);
    setConfirmDeleteId(null);
    setFeedbackMessage(lang === 'kk' ? 'Сынақ жазбасы өшірілді' : lang === 'ru' ? 'Запись удалена' : 'Record deleted successfully');
    setTimeout(() => setFeedbackMessage(null), 2500);
  };

  const handleResetSeeds = () => {
    storageEngine.resetToSeeds();
    setFeedbackMessage(lang === 'kk' ? 'Бастапқы эталонды жазбалар қалпына келтірілді' : lang === 'ru' ? 'Тестовые записи восстановлены' : 'Benchmark records restored');
    setTimeout(() => setFeedbackMessage(null), 2500);
  };

  const getAccuracyBadgeColor = (accuracy: number) => {
    if (accuracy >= 80) return 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
    if (accuracy >= 50) return 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
    return 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800';
  };

  const getLevelBadgeColor = (level?: string) => {
    switch (level) {
      case 'A1':
      case 'A2':
        return 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'B1':
      case 'B2':
        return 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800';
      case 'C1':
      case 'C2':
        return 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      default:
        return 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{t.adminDashboardTitle}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            {t.adminDashboardTitle}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t.adminDashboardSubtitle}
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            id="admin-export-csv-btn"
            onClick={() => storageEngine.exportCsv()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium text-xs shadow-xs transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{t.exportCsvBtn}</span>
          </button>

          <button
            id="admin-export-json-btn"
            onClick={() => storageEngine.exportJson()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium text-xs shadow-xs transition-colors cursor-pointer"
          >
            <FileCode2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>{t.exportJsonBtn}</span>
          </button>

          <button
            id="admin-reset-seeds-btn"
            onClick={handleResetSeeds}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium text-xs shadow-xs transition-colors cursor-pointer"
            title={lang === 'kk' ? 'Үлгі жазбаларды қайта жүктеу' : 'Reload sample data'}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{lang === 'kk' ? 'Үлгілер' : 'Presets'}</span>
          </button>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedbackMessage && (
        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Quick Aggregates Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              {lang === 'kk' ? 'Барлық жазбалар' : lang === 'ru' ? 'Всего записей' : 'Total Records'}
            </span>
            <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 dark:text-slate-100">
            {stats.totalRecords}
          </div>
          <span className="text-[10px] text-slate-400 dark:text-slate-500">
            {stats.totalParticipants} {lang === 'kk' ? 'оқушы' : lang === 'ru' ? 'учащихся' : 'students'}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              {lang === 'kk' ? 'Орташа дәлдік' : lang === 'ru' ? 'Средняя точность' : 'Mean Accuracy'}
            </span>
            <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          </div>
          <div className="text-2xl font-black font-mono text-teal-700 dark:text-teal-400">
            {stats.avgAccuracy}%
          </div>
          <span className="text-[10px] text-slate-400 dark:text-slate-500">
            {lang === 'kk' ? '3 бөлім бойынша' : lang === 'ru' ? 'по 3 частям' : 'across 3 parts'}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              {lang === 'kk' ? 'Реакция латенттігі' : lang === 'ru' ? 'Время реакции' : 'Reaction Time'}
            </span>
            <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 dark:text-slate-100">
            {stats.avgReactionTimeMs} <span className="text-xs font-normal text-slate-400">мс</span>
          </div>
          <span className="text-[10px] text-slate-400 dark:text-slate-500">
            {lang === 'kk' ? 'шешім қабылдау уақыты' : lang === 'ru' ? 'время ответа' : 'decision latency'}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">
              {lang === 'kk' ? 'Оқу уақыты' : lang === 'ru' ? 'Время чтения' : 'Reading Latency'}
            </span>
            <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 dark:text-slate-100">
            {stats.avgReadingTimeMs} <span className="text-xs font-normal text-slate-400">мс</span>
          </div>
          <span className="text-[10px] text-slate-400 dark:text-slate-500">
            {lang === 'kk' ? 'сөйлемді өңдеу уақыты' : lang === 'ru' ? 'обработка предложения' : 'sentence parsing'}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          
          {/* Search Box */}
          <div className="relative md:col-span-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="admin-search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={lang === 'kk' ? 'Аты-жөні, телефон немесе ID бойынша іздеу...' : lang === 'ru' ? 'Поиск по ФИО, телефону или ID...' : 'Search by student name, phone or ID...'}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-emerald-600 focus:bg-white dark:focus:bg-slate-800"
            />
          </div>

          {/* Filter by Age */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              id="admin-age-filter"
              value={filterAge}
              onChange={(e) => setFilterAge(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-emerald-600"
            >
              <option value="all">{t.filterAgeAll}</option>
              <option value="under15">{t.filterAgeUnder15}</option>
              <option value="15to18">{t.filterAge15to18}</option>
              <option value="19to25">{t.filterAge19to25}</option>
              <option value="25plus">{t.filterAge25Plus}</option>
            </select>
          </div>

          {/* Filter by Level */}
          <div className="flex items-center gap-2">
            <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              id="admin-level-filter"
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-emerald-600"
            >
              <option value="all">{t.filterLevelAll}</option>
              <option value="A1">A1 (Elementary)</option>
              <option value="A2">A2 (Pre-Intermediate)</option>
              <option value="B1">B1 (Intermediate)</option>
              <option value="B2">B2 (Upper-Intermediate)</option>
              <option value="C1">C1 (Advanced)</option>
              <option value="C2">C2 (Mastery)</option>
            </select>
          </div>

        </div>
      </div>

      {/* Primary Table of Student Records */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-3.5 px-4 font-bold">{t.colStudentName}</th>
                <th className="py-3.5 px-4 font-bold">{t.colPhoneNumber}</th>
                <th className="py-3.5 px-3 font-bold">{t.colAge}</th>
                <th className="py-3.5 px-3 font-bold">{t.colAssessedLevel}</th>
                <th className="py-3.5 px-3 font-bold">{t.colAccuracy}</th>
                <th className="py-3.5 px-3 font-bold">{t.colAvgResponseTime}</th>
                <th className="py-3.5 px-3 font-bold">{t.colReadingLatency}</th>
                <th className="py-3.5 px-4 font-bold text-center">{t.colTaskBreakdown}</th>
                <th className="py-3.5 px-3 font-bold text-right">{lang === 'kk' ? 'Әрекет' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredSessions.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <p className="text-sm font-medium">{lang === 'kk' ? 'Сәйкес келетін жазба табылмады' : 'No matching student records found'}</p>
                    <p className="text-xs mt-1">{lang === 'kk' ? 'Сүзгі параметрлерін өзгертіп көріңіз' : 'Try adjusting the search or filters'}</p>
                  </td>
                </tr>
              ) : (
                filteredSessions.map((rec) => {
                  const studentDisplayName = rec.student_name || rec.participant_id;
                  const phoneDisplay = rec.phone_number || '—';
                  const ageDisplay = rec.age ? `${rec.age}` : '—';
                  const levelDisplay = rec.cefr_level || 'B1';
                  const accuracyVal = Math.round(rec.accuracy_score);

                  return (
                    <tr 
                      key={rec.test_id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      {/* Name & ID */}
                      <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-slate-100">
                        <div className="flex flex-col">
                          <span className="font-bold text-sm">{studentDisplayName}</span>
                          <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                            {rec.participant_id}
                          </span>
                        </div>
                      </td>

                      {/* Phone Number */}
                      <td className="py-3.5 px-4 font-mono text-slate-700 dark:text-slate-300">
                        {phoneDisplay}
                      </td>

                      {/* Age */}
                      <td className="py-3.5 px-3 font-mono font-semibold text-slate-800 dark:text-slate-200">
                        {ageDisplay}
                      </td>

                      {/* Assessed Level */}
                      <td className="py-3.5 px-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold border ${getLevelBadgeColor(levelDisplay)}`}>
                          {levelDisplay}
                        </span>
                      </td>

                      {/* Accuracy Score */}
                      <td className="py-3.5 px-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-mono font-bold border ${getAccuracyBadgeColor(accuracyVal)}`}>
                          {accuracyVal}%
                        </span>
                      </td>

                      {/* Latency */}
                      <td className="py-3.5 px-3 font-mono text-slate-700 dark:text-slate-300">
                        {Math.round(rec.reaction_time_ms)} мс
                      </td>

                      {/* Reading */}
                      <td className="py-3.5 px-3 font-mono text-slate-700 dark:text-slate-300">
                        {Math.round(rec.reading_time_ms)} мс
                      </td>

                      {/* Task Breakdown Button */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          id={`view-breakdown-btn-${rec.test_id}`}
                          onClick={() => setSelectedRecord(rec)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold transition-all shadow-2xs cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{t.viewTaskBreakdown}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-3 text-right">
                        {confirmDeleteId === rec.test_id ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleDelete(rec.test_id)}
                              className="px-2 py-1 bg-rose-600 text-white rounded-lg text-[11px] font-bold hover:bg-rose-700 cursor-pointer"
                            >
                              {lang === 'kk' ? 'Иә' : 'Yes'}
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="px-2 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-[11px] hover:bg-slate-300 cursor-pointer"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <button
                            id={`delete-rec-btn-${rec.test_id}`}
                            onClick={() => setConfirmDeleteId(rec.test_id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                            title={lang === 'kk' ? 'Жазбаны өшіру' : 'Delete record'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Task Breakdown Details Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                  <GraduationCap className="w-4 h-4" />
                  <span>{t.taskBreakdownTitle}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                  {selectedRecord.student_name || selectedRecord.participant_id}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {selectedRecord.phone_number ? `Тел: ${selectedRecord.phone_number}` : ''} • {selectedRecord.age ? `${selectedRecord.age} жас` : ''} • ID: {selectedRecord.participant_id}
                </p>
              </div>
              <button
                id="close-breakdown-modal-btn"
                onClick={() => setSelectedRecord(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6">
              
              {/* Overall Trial Stats Card */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
                <div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase block mb-1">
                    {t.colAccuracy}
                  </span>
                  <span className="text-xl font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {Math.round(selectedRecord.accuracy_score)}%
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase block mb-1">
                    {t.colReadingLatency}
                  </span>
                  <span className="text-xl font-mono font-bold text-slate-900 dark:text-slate-100">
                    {Math.round(selectedRecord.reading_time_ms)} мс
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase block mb-1">
                    {t.colAvgResponseTime}
                  </span>
                  <span className="text-xl font-mono font-bold text-slate-900 dark:text-slate-100">
                    {Math.round(selectedRecord.reaction_time_ms)} мс
                  </span>
                </div>
              </div>

              {/* Detailed Breakdown for the stimulus sentence */}
              {selectedRecord.detailed_responses && selectedRecord.detailed_responses.length > 0 && (
                <div className="space-y-4">
                  {selectedRecord.detailed_responses.map((item, idx) => (
                    <div key={idx} className="space-y-4">
                      
                      {/* Stimulus sentence */}
                      <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                          {lang === 'kk' ? 'Стимул сөйлем' : 'Stimulus Sentence'} ({item.word_order})
                        </span>
                        <p className="text-base font-bold text-slate-900 dark:text-slate-100">
                          «{item.sentence_kazakh}»
                        </p>
                      </div>

                      {/* 3 Tasks Cards */}
                      <div className="space-y-2.5">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                          {lang === 'kk' ? '3 кезеңді тапсырмалардың орындалуы:' : '3-Part Task Completion Details:'}
                        </span>

                        {/* Part 1: Word Chain */}
                        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            {item.part1_correct ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            ) : (
                              <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                            )}
                            <div>
                              <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                                1. {lang === 'kk' ? 'Сөз тізбегі' : lang === 'ru' ? 'Цепочка слов' : 'Word Chain'}
                              </p>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                {item.part1_correct ? (lang === 'kk' ? 'Дұрыс тапты' : 'Correct') : (lang === 'kk' ? 'Қате' : 'Incorrect')}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300">
                            {item.part1_rt_ms} мс
                          </span>
                        </div>

                        {/* Part 2: Emoji Order */}
                        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            {item.part2_correct ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            ) : (
                              <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                            )}
                            <div>
                              <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                                2. {lang === 'kk' ? 'Эмодзи реті' : lang === 'ru' ? 'Порядок эмодзи' : 'Emoji Order'}
                              </p>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                {item.part2_correct ? (lang === 'kk' ? 'Дұрыс жинады' : 'Correct') : (lang === 'kk' ? 'Қате' : 'Incorrect')}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300">
                            {item.part2_rt_ms} мс
                          </span>
                        </div>

                        {/* Part 3: Sentence Choice */}
                        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            {item.part3_correct ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            ) : (
                              <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                            )}
                            <div>
                              <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                                3. {lang === 'kk' ? 'Сөйлем таңдау' : lang === 'ru' ? 'Выбор предложения' : 'Sentence Choice'}
                              </p>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                {item.part3_correct ? (lang === 'kk' ? 'Дұрыс нұсқаны таңдады' : 'Correct') : (lang === 'kk' ? 'Қате' : 'Incorrect')}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300">
                            {item.part3_rt_ms} мс
                          </span>
                        </div>

                      </div>

                    </div>
                  ))}
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs hover:opacity-90 transition-opacity cursor-pointer"
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
