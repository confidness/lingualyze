import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Unlock, 
  KeyRound, 
  X, 
  AlertCircle, 
  CheckCircle2, 
  User, 
  Sparkles,
  Eye,
  EyeOff
} from 'lucide-react';
import { LanguageCode, UserRole } from '../types';
import { translations } from '../data/translations';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: UserRole;
  setCurrentRole?: (role: UserRole) => void;
  onRoleChange?: (role: UserRole) => void;
  lang: LanguageCode;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentRole,
  setCurrentRole,
  onRoleChange,
  lang
}) => {
  const [passcode, setPasscode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const t = translations[lang];

  const changeRole = (role: UserRole) => {
    if (onRoleChange) onRoleChange(role);
    if (setCurrentRole) setCurrentRole(role);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Scientist passcode: 23032011 (also supports admin123)
    const cleanedPasscode = passcode.trim();
    if (cleanedPasscode === '23032011' || cleanedPasscode === 'admin123') {
      changeRole('researcher');
      setSuccessMessage(
        lang === 'kk'
          ? 'Ғалым / Зерттеуші ретінде сәтті кірдіңіз!'
          : lang === 'ru'
          ? 'Успешный вход в роли Ученого / Исследователя!'
          : 'Successfully authenticated as Scientist / Researcher!'
      );
      setPasscode('');
      setTimeout(() => {
        setSuccessMessage('');
        onClose();
      }, 700);
    } else {
      setErrorMessage(
        lang === 'kk'
          ? 'Құпиякод қате. Қайталап көріңіз.'
          : lang === 'ru'
          ? 'Неверный пароль. Попробуйте снова.'
          : 'Invalid passcode. Please try again.'
      );
    }
  };

  const handleLogout = () => {
    changeRole('participant');
    setSuccessMessage(
      lang === 'kk' 
        ? 'Қатысушы режиміне ауыстырылды' 
        : lang === 'ru' 
        ? 'Переключено в режим Участника' 
        : 'Switched to Participant mode'
    );
    setTimeout(() => {
      setSuccessMessage('');
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Жабу / Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {lang === 'kk' ? 'Жүйеге кіру және Рөлді басқару' : lang === 'ru' ? 'Аутентификация и Роли' : 'Authentication & Access Control'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {lang === 'kk' ? 'Зерттеуші құқықтарын қосу немесе тексеру' : lang === 'ru' ? 'Управление правами доступа исследователя' : 'Role-Based Access Control (RBAC)'}
            </p>
          </div>
        </div>

        {/* Active Role Status Card */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-3 h-3 rounded-full ${currentRole === 'researcher' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                {lang === 'kk' ? 'Ағымдағы рөл' : lang === 'ru' ? 'Текущая роль' : 'Active Role'}
              </span>
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {currentRole === 'researcher'
                  ? (lang === 'kk' ? 'Зерттеуші / Ғалым (Admin)' : lang === 'ru' ? 'Исследователь (Admin)' : 'Researcher / Admin')
                  : (lang === 'kk' ? 'Қатысушы / Респондент' : lang === 'ru' ? 'Участник / Респондент' : 'Participant / User')}
              </span>
            </div>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold border ${
            currentRole === 'researcher'
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
              : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-600'
          }`}>
            {currentRole === 'researcher' ? 'UNLOCKED' : 'LOCKED'}
          </span>
        </div>

        {/* Success or Error feedback */}
        {successMessage && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Role switching options */}
        {currentRole === 'researcher' ? (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/60 text-xs text-emerald-900 dark:text-emerald-300 leading-relaxed">
              {lang === 'kk' 
                ? '✓ Сізде толық ғылыми базаға, жазбаларды жоюға және деректерді CSV/JSON форматында экспорттауға толық рұқсат бар.'
                : lang === 'ru'
                ? '✓ У вас есть полный доступ к базе данных, удалению записей и экспорту сырых данных CSV/JSON.'
                : '✓ Full administrator permissions are active: raw database inspection, record deletion, and multi-format exports.'}
            </div>

            <button
              onClick={handleLogout}
              className="w-full py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center gap-2"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{lang === 'kk' ? 'Қатысушы режиміне шығу' : lang === 'ru' ? 'Выйти в режим Участника' : 'Log Out to Participant Mode'}</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                {lang === 'kk' ? 'Зерттеуші құпиякоды (Passcode)' : lang === 'ru' ? 'Пароль исследователя' : 'Researcher Passcode'}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder={lang === 'kk' ? 'Құпиякодты енгізіңіз' : lang === 'ru' ? 'Введите пароль' : 'Enter passcode'}
                  className="w-full px-4 py-2.5 pr-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs shadow-md shadow-emerald-600/20 active:translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              <span>{lang === 'kk' ? 'Зерттеуші ретінде кіру' : lang === 'ru' ? 'Войти как Исследователь' : 'Unlock Researcher Access'}</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
