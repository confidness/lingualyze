import React, { useState, useEffect } from 'react';
import { 
  ActiveTab, 
  LanguageCode, 
  ParticipantProfile, 
  StimulusSentence, 
  TrialResult,
  ThemeMode,
  UserRole
} from './types';
import { initialStimulusSentences } from './data/sentences';
import { generateExpandedStimuliBattery } from './data/stimuliGenerator';
import { sampleParticipantProfiles } from './data/mockCohorts';
import { Navbar } from './components/Navbar';
import { OverviewSection } from './components/OverviewSection';
import { ParticipantOnboarding } from './components/ParticipantOnboarding';
import { ExperimentRunner } from './components/ExperimentRunner';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { SentenceDatabase } from './components/SentenceDatabase';
import { NeurolinguisticInsights } from './components/NeurolinguisticInsights';
import { MethodologyHypotheses } from './components/MethodologyHypotheses';
import { PrivacyPolicyTab } from './components/PrivacyPolicyTab';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { translations } from './data/translations';
import { CheckCircle2, LogOut } from 'lucide-react';

export default function App() {
  // Navigation & Language
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [lang, setLang] = useState<LanguageCode>('kk');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);

  const t = translations[lang];

  // Theme Mode (Light / Dark) with persistence
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('lingualyze_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return 'light';
  });

  useEffect(() => {
    localStorage.setItem('lingualyze_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // RBAC User Role (Participant / Researcher) with persistence
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem('lingualyze_user_role');
    if (saved === 'researcher' || saved === 'participant') return saved;
    return 'participant';
  });

  useEffect(() => {
    localStorage.setItem('lingualyze_user_role', currentRole);
  }, [currentRole]);

  // Auth & Role Switcher Modal
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Active Participant Profile
  const [currentParticipant, setCurrentParticipant] = useState<ParticipantProfile>(() => {
    return sampleParticipantProfiles[0] as unknown as ParticipantProfile;
  });

  // Experimental Stimuli Battery (120 stimuli across CEFR levels and conditions)
  const [stimuli, setStimuli] = useState<StimulusSentence[]>(() => {
    return generateExpandedStimuliBattery();
  });

  // Recorded Experimental Trials (Live user trials + sample benchmark trials)
  const [allTrials, setAllTrials] = useState<TrialResult[]>(() => {
    // Generate initial realistic sample trials for rich analytics right on launch
    const preseeded: TrialResult[] = [
      {
        trialId: 'TRIAL-PRE-101',
        stimulusId: 'stim-a1-01',
        participantId: 'P-KZ-104',
        cefrLevel: 'A1',
        part1Correct: true,
        part1RtMs: 1540,
        part2Correct: true,
        part2RtMs: 2100,
        part3Correct: true,
        part3RtMs: 1650,
        wordOrder: 'SOV',
        complexity: 'simple',
        length: 'short',
        predictability: 'high',
        readingTimeMs: 1580,
        readingSpeedWpm: 190,
        questionResponseTimeMs: 1650,
        isCorrect: true,
        selectedOptionId: 'opt-a',
        cognitiveLoadScore: 22.4,
        timestamp: '2026-03-01T10:14:00Z',
        presentationMode: 'whole_sentence'
      },
      {
        trialId: 'TRIAL-PRE-102',
        stimulusId: 'stim-a1-02',
        participantId: 'P-KZ-104',
        cefrLevel: 'A1',
        part1Correct: true,
        part1RtMs: 1720,
        part2Correct: true,
        part2RtMs: 2400,
        part3Correct: true,
        part3RtMs: 1820,
        wordOrder: 'OSV',
        complexity: 'simple',
        length: 'short',
        predictability: 'high',
        readingTimeMs: 1920,
        readingSpeedWpm: 156,
        questionResponseTimeMs: 1820,
        isCorrect: true,
        selectedOptionId: 'opt-a',
        cognitiveLoadScore: 35.8,
        timestamp: '2026-03-01T10:15:20Z',
        presentationMode: 'whole_sentence'
      },
      {
        trialId: 'TRIAL-PRE-103',
        stimulusId: 'stim-a2-01',
        participantId: 'P-KZ-104',
        cefrLevel: 'A2',
        part1Correct: true,
        part1RtMs: 1600,
        part2Correct: true,
        part2RtMs: 2250,
        part3Correct: true,
        part3RtMs: 1720,
        wordOrder: 'SOV',
        complexity: 'simple',
        length: 'medium',
        predictability: 'high',
        readingTimeMs: 1680,
        readingSpeedWpm: 285,
        questionResponseTimeMs: 1720,
        isCorrect: true,
        selectedOptionId: 'opt-a',
        cognitiveLoadScore: 24.1,
        timestamp: '2026-03-01T10:16:45Z',
        presentationMode: 'whole_sentence'
      },
      {
        trialId: 'TRIAL-PRE-104',
        stimulusId: 'stim-b1-02',
        participantId: 'P-KZ-104',
        cefrLevel: 'B1',
        part1Correct: true,
        part1RtMs: 2100,
        part2Correct: true,
        part2RtMs: 2800,
        part3Correct: true,
        part3RtMs: 2410,
        wordOrder: 'SVO',
        complexity: 'simple',
        length: 'medium',
        predictability: 'low',
        readingTimeMs: 2340,
        readingSpeedWpm: 179,
        questionResponseTimeMs: 2410,
        isCorrect: true,
        selectedOptionId: 'opt-a',
        cognitiveLoadScore: 53.2,
        timestamp: '2026-03-01T10:18:00Z',
        presentationMode: 'whole_sentence'
      },
      {
        trialId: 'TRIAL-PRE-105',
        stimulusId: 'stim-b2-02',
        participantId: 'P-KZ-104',
        cefrLevel: 'B2',
        part1Correct: false,
        part1RtMs: 2400,
        part2Correct: true,
        part2RtMs: 3100,
        part3Correct: false,
        part3RtMs: 2600,
        wordOrder: 'OVS',
        complexity: 'simple',
        length: 'medium',
        predictability: 'low',
        readingTimeMs: 2510,
        readingSpeedWpm: 191,
        questionResponseTimeMs: 2600,
        isCorrect: false,
        selectedOptionId: 'opt-b',
        cognitiveLoadScore: 61.5,
        timestamp: '2026-03-01T10:19:30Z',
        presentationMode: 'whole_sentence'
      }
    ];
    return preseeded;
  });

  const handleTrialComplete = (trial: TrialResult) => {
    setAllTrials(prev => [trial, ...prev]);
  };

  const handleSessionComplete = (sessionTrials: TrialResult[]) => {
    // Already appended individually via onTrialComplete
  };

  const handleLogout = () => {
    const confirmMessage = t.logoutConfirm || 'Are you sure you want to log out?';
    if (!window.confirm(confirmMessage)) {
      return;
    }

    const guestProfile: ParticipantProfile = {
      id: 'P-KZ-' + Math.floor(100 + Math.random() * 900),
      name: '',
      studentName: '',
      phoneNumber: '',
      age: '' as any,
      dominanceGroup: 'kazakh_dominant',
      cefrLevel: 'A1',
      educationLevel: 'high_school',
      dailyKazakhUsagePercent: 80,
      selfRatedReadingProficiency: 4,
      primaryHomeLanguage: 'Kazakh',
      createdAt: new Date().toISOString()
    };

    setCurrentParticipant(guestProfile);
    try {
      localStorage.removeItem('lingualyze_current_student');
    } catch (e) {
      // ignore
    }

    setActiveTab('participant');
    setNotificationToast(t.loggedOutToast || 'Logged out successfully');
    setTimeout(() => {
      setNotificationToast(null);
    }, 4500);
  };

  return (
    <div className={`min-h-screen overflow-x-hidden ${theme === 'dark' ? 'dark bg-[#0F172A] text-slate-100' : 'bg-[#F8FAFC] text-slate-900'} flex flex-col selection:bg-emerald-500/20 selection:text-emerald-800 dark:selection:text-emerald-300 transition-colors duration-200`}>
      
      {/* Global Notification Banner */}
      {notificationToast && (
        <div className="bg-emerald-600 text-white px-4 py-2.5 text-xs font-semibold flex items-center justify-between shadow-md transition-all">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{notificationToast}</span>
          </div>
          <button 
            onClick={() => setNotificationToast(null)}
            className="text-white/80 hover:text-white text-xs px-2 py-0.5 rounded cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Primary Academic Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        setLang={setLang}
        currentParticipant={currentParticipant}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        completedTrialsCount={allTrials.filter(t => t.participantId === currentParticipant.id).length}
        theme={theme}
        setTheme={setTheme}
        currentRole={currentRole}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main View Router */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        {activeTab === 'overview' && (
          <OverviewSection
            setActiveTab={setActiveTab}
            lang={lang}
          />
        )}

        {activeTab === 'participant' && (
          <ParticipantOnboarding
            currentParticipant={currentParticipant}
            setCurrentParticipant={setCurrentParticipant}
            lang={lang}
            onProceedToExperiment={() => setActiveTab('experiment')}
          />
        )}

        {activeTab === 'experiment' && (
          <ExperimentRunner
            stimuli={stimuli}
            currentParticipant={currentParticipant}
            lang={lang}
            soundEnabled={soundEnabled}
            onTrialComplete={handleTrialComplete}
            onSessionComplete={handleSessionComplete}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard
            allTrials={allTrials}
            lang={lang}
          />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard
            lang={lang}
            currentRole={currentRole}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
          />
        )}

        {activeTab === 'database' && (
          <SentenceDatabase
            stimuli={stimuli}
            setStimuli={setStimuli}
            lang={lang}
            currentRole={currentRole}
            setCurrentRole={setCurrentRole}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
          />
        )}

        {activeTab === 'neurolinguistics' && (
          <NeurolinguisticInsights
            lang={lang}
          />
        )}

        {activeTab === 'methodology' && (
          <MethodologyHypotheses
            lang={lang}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'privacy' && (
          <PrivacyPolicyTab
            lang={lang}
            currentRole={currentRole}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
          />
        )}
      </main>

      {/* Authentication & Role Selection Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        setCurrentRole={setCurrentRole}
        lang={lang}
      />

      {/* Footer - Academic Precision with Theme Integration */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8 text-xs text-slate-500 dark:text-slate-400 shadow-xs transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-slate-100">Lingualyze</span>
            <span>•</span>
            <span>
              {lang === 'kk' 
                ? 'Қазақ тілінің психолингвистикалық және нейролингвистикалық ғылыми зерттеу платформасы'
                : lang === 'ru'
                ? 'Научно-исследовательская психолингвистическая платформа казахского языка'
                : 'Kazakh Psycholinguistic & Neurolinguistic Research Platform'}
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-400 dark:text-slate-500 font-mono">
            <button 
              onClick={() => setActiveTab('privacy')}
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              {lang === 'kk' ? 'Этика & Құпиялылық' : lang === 'ru' ? 'Этика & Приватность' : 'Ethics & Privacy'}
            </button>
            <span>•</span>
            <span>SOV Head-Final</span>
            <span>•</span>
            <span className="uppercase">{lang}</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
