import React from 'react';
import {
  Brain,
  Database,
  BarChart3,
  PlayCircle,
  UserCheck,
  BookOpen,
  Home,
  Trophy,
  ClipboardList,
  GraduationCap,
  Volume2, 
  VolumeX, 
  Sun, 
  Moon, 
  Lock, 
  ShieldCheck, 
  Shield, 
  LogOut 
} from 'lucide-react';
import { ActiveTab, LanguageCode, ParticipantProfile, ThemeMode, UserRole } from '../types';
import { translations } from '../data/translations';
import { Logo } from './Logo';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  lang: LanguageCode;
  setLang: (lang: LanguageCode) => void;
  currentParticipant: ParticipantProfile;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  completedTrialsCount?: number;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  currentRole: UserRole;
  onOpenAuthModal: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  lang,
  setLang,
  currentParticipant,
  soundEnabled,
  setSoundEnabled,
  theme,
  setTheme,
  currentRole,
  onOpenAuthModal,
  onLogout
}) => {
  const t = translations[lang];

  const isResearcher = currentRole === 'researcher';

  // Client-facing pages: what every visitor sees
  const clientItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'overview',
      label: lang === 'kk' ? 'Басты бет' : lang === 'ru' ? 'Главная' : 'Home',
      icon: <Home className="w-3.5 h-3.5" />
    },
    {
      id: 'experiment',
      label: lang === 'kk' ? 'Тест тапсыру' : lang === 'ru' ? 'Пройти тест' : 'Take the test',
      icon: <PlayCircle className="w-3.5 h-3.5" />,
      badge: 'live'
    },
    {
      id: 'results',
      label: lang === 'kk' ? 'Менің нәтижелерім' : lang === 'ru' ? 'Мои результаты' : 'My results',
      icon: <Trophy className="w-3.5 h-3.5" />
    },
    {
      id: 'privacy',
      label: lang === 'kk' ? 'Құпиялылық' : lang === 'ru' ? 'Конфиденциальность' : 'Privacy',
      icon: <Shield className="w-3.5 h-3.5" />
    },
  ];

  // Researcher-only pages, shown after sign-in as a separate group
  const researchItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }[] = isResearcher ? [
    {
      id: 'answers',
      label: lang === 'kk' ? 'Жауаптар' : lang === 'ru' ? 'Ответы' : 'Answers',
      icon: <ClipboardList className="w-3.5 h-3.5" />
    },
    {
      id: 'analytics',
      label: t.navAnalytics,
      icon: <BarChart3 className="w-3.5 h-3.5" />
    },
    {
      id: 'admin',
      label: t.navAdmin,
      icon: <ShieldCheck className="w-3.5 h-3.5" />
    },
    {
      id: 'database',
      label: t.navDatabase,
      icon: <Database className="w-3.5 h-3.5" />
    },
    {
      id: 'neurolinguistics',
      label: t.navNeurolinguistics,
      icon: <Brain className="w-3.5 h-3.5" />
    },
    {
      id: 'methodology',
      label: lang === 'kk' ? 'Әдістеме' : lang === 'ru' ? 'Методология' : 'Methodology',
      icon: <BookOpen className="w-3.5 h-3.5" />
    },
  ] : [];

  const navItems = [...clientItems, ...researchItems];

  const getGroupBadgeColor = () => {
    switch (currentParticipant.dominanceGroup) {
      case 'kazakh_dominant':
        return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'bilingual_balanced':
        return 'bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800';
      case 'kazakh_l2':
        return 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      default:
        return 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  const getGroupNameShort = () => {
    switch (currentParticipant.dominanceGroup) {
      case 'kazakh_dominant':
        return 'L1';
      case 'bilingual_balanced':
        return 'Bil';
      case 'kazakh_l2':
        return 'L2';
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-xs transition-colors">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-13 sm:h-14 gap-2 sm:gap-4">
          
          {/* Brand: logo links home */}
          <button
            type="button"
            id="nav-logo"
            onClick={() => setActiveTab('overview')}
            className="flex items-center gap-1.5 cursor-pointer group shrink-0 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
          >
            <Logo />
            <span className="sr-only">{lang === 'kk' ? 'Басты бет' : lang === 'ru' ? 'Главная' : 'Home'}</span>
            {isResearcher && (
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800">
                Lab
              </span>
            )}
          </button>

          {/* Navigation Categories - Compact and Clean */}
          <nav className="hidden md:flex items-center p-0.5 sm:p-1 rounded-xl bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700 gap-0.5 overflow-x-auto no-scrollbar shrink min-w-0">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <React.Fragment key={item.id}>
                {item.id === researchItems[0]?.id && (
                  <span className="w-px h-4 bg-slate-300 dark:bg-slate-600 mx-1 shrink-0" aria-hidden />
                )}
                <button
                  id={`nav-btn-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1 px-2 lg:px-2.5 py-1 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 border border-slate-200 dark:border-slate-600 shadow-xs font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-750'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  )}
                </button>
                </React.Fragment>
              );
            })}
          </nav>

          {/* Right Controls: Participant Pill, Role Badge, Theme/Sound/Logout, Language */}
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            
            {/* Active Participant Pill (Click to manage account / profile) */}
            <button
              id="nav-participant-pill"
              onClick={() => setActiveTab('participant')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-all shadow-xs shrink-0 cursor-pointer ${getGroupBadgeColor()}`}
              title={t.manageAccountFull || t.changeProfile}
            >
              <UserCheck className="w-3.5 h-3.5 shrink-0" />
              <span className="font-bold max-w-[90px] sm:max-w-[120px] truncate">
                {currentParticipant.studentName
                  ? currentParticipant.studentName.split(' ')[0]
                  : (lang === 'kk' ? 'Кіру' : lang === 'ru' ? 'Войти' : 'Sign in')}
              </span>
              {isResearcher && (
                <span className="hidden xl:inline text-[10px] opacity-75 font-mono">({getGroupNameShort()})</span>
              )}
            </button>

            {/* Scientist / teacher sign-in (or the signed-in badge, which opens sign-out) */}
            <button
              id="nav-auth-btn"
              onClick={onOpenAuthModal}
              aria-label={isResearcher
                ? (lang === 'kk' ? 'Ғалым режимі: шығу' : lang === 'ru' ? 'Режим учёного: выйти' : 'Scientist mode: sign out')
                : (lang === 'kk' ? 'Ғалым немесе мұғалім ретінде кіру' : lang === 'ru' ? 'Войти как учёный или учитель' : 'Sign in as scientist or teacher')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all shadow-xs shrink-0 cursor-pointer ${
                isResearcher
                  ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300'
              }`}
            >
              {isResearcher ? <ShieldCheck className="w-3.5 h-3.5" /> : <GraduationCap className="w-3.5 h-3.5" />}
              <span className="hidden lg:inline">
                {isResearcher
                  ? (lang === 'kk' ? 'Ғалым' : lang === 'ru' ? 'Учёный' : 'Scientist')
                  : (lang === 'kk' ? 'Ғалым / мұғалім' : lang === 'ru' ? 'Учёный / учитель' : 'Scientist / teacher')}
              </span>
            </button>

            {/* Compact Utility Cluster: Theme + Audio + Logout */}
            <div className="flex items-center gap-0.5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 p-0.5 rounded-lg shrink-0">
              {/* Dark / Light Theme Toggle */}
              <button
                id="nav-theme-toggle"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                title={theme === 'dark' ? ((t as any).themeLight || 'Light Mode') : ((t as any).themeDark || 'Dark Mode')}
                className="p-1 rounded-md text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                {theme === 'dark' ? (
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <Moon className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
                )}
              </button>

              {/* Audio Feedback Toggle */}
              <button
                id="nav-audio-toggle"
                onClick={() => setSoundEnabled(!soundEnabled)}
                title={soundEnabled ? t.soundOn : t.soundOff}
                className="p-1 rounded-md text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                {soundEnabled ? (
                  <Volume2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                )}
              </button>

              {/* Log Out Button */}
              <button
                id="nav-logout-btn"
                onClick={onLogout}
                title={t.logout || 'Log Out'}
                className="p-1 rounded-md text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/60 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Language Switcher */}
            <div 
              id="nav-lang-pill-toggle"
              className="flex items-center p-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0"
            >
              {(['kk', 'ru', 'en'] as LanguageCode[]).map((l) => (
                <button
                  key={l}
                  id={`lang-btn-${l}`}
                  onClick={() => setLang(l)}
                  className={`px-1.5 sm:px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded-full transition-all cursor-pointer ${
                    lang === l
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

          </div>

        </div>

        {/* Mobile Navigation Row (visible on mobile < 768px only) */}
        <div className="md:hidden flex items-center gap-1 overflow-x-auto py-1.5 border-t border-slate-100 dark:border-slate-800 no-scrollbar">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};

