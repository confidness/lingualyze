import React, { useState, useEffect } from 'react';
import {
  Check,
  ArrowRight,
  Phone,
  User,
  Calendar,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';
import { LanguageCode, LanguageDominanceGroup, ParticipantProfile } from '../types';
import { translations } from '../data/translations';
import { sampleParticipantProfiles } from '../data/mockCohorts';

interface ParticipantOnboardingProps {
  currentParticipant: ParticipantProfile;
  setCurrentParticipant: (p: ParticipantProfile) => void;
  lang: LanguageCode;
  isResearcher?: boolean;
  onProceedToExperiment: () => void;
  onOpenPrivacy?: () => void;
}

const inputCls = (hasError?: string) =>
  `w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-all focus:outline-hidden ${
    hasError
      ? 'border-rose-300 dark:border-rose-700 bg-rose-50/40 dark:bg-rose-950/20 text-slate-900 dark:text-slate-100 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
      : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-emerald-500/20'
  }`;

const FieldError: React.FC<{ msg?: string }> = ({ msg }) =>
  msg ? (
    <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1">
      <AlertCircle className="w-3.5 h-3.5" />
      <span>{msg}</span>
    </p>
  ) : null;

export const ParticipantOnboarding: React.FC<ParticipantOnboardingProps> = ({
  currentParticipant,
  setCurrentParticipant,
  lang,
  isResearcher = false,
  onProceedToExperiment,
  onOpenPrivacy
}) => {
  const t = translations[lang];
  const tr = (kk: string, ru: string, en: string) => (lang === 'kk' ? kk : lang === 'ru' ? ru : en);

  const [profile, setProfile] = useState<ParticipantProfile>({
    ...currentParticipant,
    studentName: currentParticipant.studentName || currentParticipant.name || '',
    phoneNumber: currentParticipant.phoneNumber || '',
    age: currentParticipant.age || 16,
  });

  useEffect(() => {
    setProfile({
      ...currentParticipant,
      studentName: currentParticipant.studentName || currentParticipant.name || '',
      phoneNumber: currentParticipant.phoneNumber || '',
      age: currentParticipant.age || 16,
    });
  }, [currentParticipant]);

  const [errors, setErrors] = useState<{
    studentName?: string;
    phoneNumber?: string;
    age?: string;
  }>({});

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Keep digits and leading +
    setProfile(prev => ({ ...prev, phoneNumber: e.target.value.replace(/[^\d+]/g, '') }));
    if (errors.phoneNumber) {
      setErrors(prev => ({ ...prev, phoneNumber: undefined }));
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setProfile(prev => ({ ...prev, studentName: val, name: val }));
    if (errors.studentName) {
      setErrors(prev => ({ ...prev, studentName: undefined }));
    }
  };

  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setProfile(prev => ({ ...prev, age: isNaN(val) ? ('' as any) : val }));
    if (errors.age) {
      setErrors(prev => ({ ...prev, age: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { studentName?: string; phoneNumber?: string; age?: string } = {};

    if (!profile.studentName || profile.studentName.trim().length < 2) {
      newErrors.studentName = t.nameError || 'Please enter your name';
    }

    // Phone number must have at least 10 digits
    const digitsOnly = (profile.phoneNumber || '').replace(/\D/g, '');
    if (!profile.phoneNumber || digitsOnly.length < 10) {
      newErrors.phoneNumber = t.phoneError || 'Please enter a valid phone number (at least 10 digits)';
    }

    const ageNum = Number(profile.age);
    if (!profile.age || isNaN(ageNum) || ageNum < 6 || ageNum > 99) {
      newErrors.age = t.ageError || 'Age must be between 6 and 99';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const finalProfile: ParticipantProfile = {
      ...profile,
      name: profile.studentName?.trim() || profile.name || '',
      studentName: profile.studentName?.trim() || '',
      phoneNumber: profile.phoneNumber?.trim() || '',
      age: Number(profile.age) || 16,
    };

    setCurrentParticipant(finalProfile);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onProceedToExperiment();
    }, 600);
  };

  const loadPreset = (preset: typeof sampleParticipantProfiles[0]) => {
    setProfile({
      ...profile,
      id: preset.id,
      name: preset.name,
      studentName: preset.studentName,
      phoneNumber: preset.phoneNumber,
      age: preset.age,
      dominanceGroup: preset.dominanceGroup,
      educationLevel: preset.educationLevel,
      dailyKazakhUsagePercent: preset.dailyKazakhUsagePercent,
      selfRatedReadingProficiency: preset.selfRatedReadingProficiency,
      primaryHomeLanguage: preset.primaryHomeLanguage,
    });
    setErrors({});
  };

  const languageOptions = [
    {
      id: 'kazakh_dominant', domId: 'cohort-option-kazakh', tag: 'L1 Native', full: t.groupKazakhDominant,
      plain: tr('Негізінен қазақша сөйлеймін', 'В основном говорю по-казахски', 'I mostly speak Kazakh'),
      on: 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20', ink: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      id: 'bilingual_balanced', domId: 'cohort-option-bilingual', tag: 'Bilingual', full: t.groupBilingual,
      plain: tr('Қазақша және орысша бірдей', 'Одинаково по-казахски и по-русски', 'Kazakh and Russian equally'),
      on: 'bg-teal-50/70 dark:bg-teal-950/40 border-teal-500 ring-2 ring-teal-500/20', ink: 'text-teal-600 dark:text-teal-400'
    },
    {
      id: 'kazakh_l2', domId: 'cohort-option-l2', tag: 'L2 Learner', full: t.groupL2,
      plain: tr('Қазақ тілін үйреніп жүрмін', 'Я изучаю казахский язык', "I'm learning Kazakh"),
      on: 'bg-amber-50/70 dark:bg-amber-950/40 border-amber-500 ring-2 ring-amber-500/20', ink: 'text-amber-600 dark:text-amber-400'
    },
  ] as const;

  return (
    <div className="max-w-xl mx-auto pb-16">
      <form
        onSubmit={handleSave}
        className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {t.studentLoginTitle}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {tr('Бұл бір минут алады. Нәтижеңіз осы атпен сақталады.', 'Это займёт минуту. Результат сохранится под этим именем.', 'This takes a minute. Your results are saved under this name.')}
            </p>
          </div>
          {isResearcher && (
            <span className="shrink-0 text-[11px] font-mono px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold">
              ID: {profile.id}
            </span>
          )}
        </div>

        {/* Demo presets (researchers only: these are fake participants) */}
        {isResearcher && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mr-1">{t.studentPresetLabel}</span>
            {sampleParticipantProfiles.map(p => (
              <button
                key={p.id}
                type="button"
                id={`preset-btn-${p.id}`}
                onClick={() => loadPreset(p)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold border transition-all cursor-pointer ${
                  profile.studentName === p.studentName
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {p.studentName.split(' ')[0]}
              </button>
            ))}
          </div>
        )}

        {/* Name */}
        <div>
          <label htmlFor="student-name-input" className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
            {t.labelStudentName}
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              id="student-name-input"
              type="text"
              autoComplete="name"
              value={profile.studentName || ''}
              onChange={handleNameChange}
              placeholder={t.placeholderStudentName}
              aria-invalid={!!errors.studentName}
              className={inputCls(errors.studentName)}
              required
            />
          </div>
          <FieldError msg={errors.studentName} />
        </div>

        {/* Phone + age */}
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_8rem] gap-4">
          <div>
            <label htmlFor="student-phone-input" className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
              {t.labelPhoneNumber}
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                id="student-phone-input"
                type="tel"
                autoComplete="tel"
                maxLength={20}
                value={profile.phoneNumber || ''}
                onChange={handlePhoneChange}
                placeholder={t.placeholderPhoneNumber}
                aria-invalid={!!errors.phoneNumber}
                className={`${inputCls(errors.phoneNumber)} font-mono`}
                required
              />
            </div>
            <FieldError msg={errors.phoneNumber} />
          </div>

          <div>
            <label htmlFor="student-age-input" className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
              {t.labelAge}
            </label>
            <div className="relative">
              <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                id="student-age-input"
                type="number"
                inputMode="numeric"
                min={6}
                max={99}
                value={profile.age || ''}
                onChange={handleAgeChange}
                placeholder={t.placeholderAge}
                aria-invalid={!!errors.age}
                className={inputCls(errors.age)}
                required
              />
            </div>
            <FieldError msg={errors.age} />
          </div>
        </div>

        {/* Language use */}
        <fieldset>
          <legend className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
            {isResearcher
              ? t.languageGroup
              : tr('Қазақ тілін қаншалықты жиі қолданасыз?', 'Как часто вы говорите по-казахски?', 'How much do you use Kazakh?')}
          </legend>
          <div className="grid grid-cols-1 gap-2">
            {languageOptions.map(opt => {
              const selected = profile.dominanceGroup === opt.id;
              return (
                <button
                  type="button"
                  key={opt.id}
                  id={opt.domId}
                  aria-pressed={selected}
                  onClick={() => setProfile({ ...profile, dominanceGroup: opt.id as LanguageDominanceGroup })}
                  className={`px-4 py-3 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between gap-3 ${
                    selected
                      ? opt.on
                      : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50/50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>
                    <span className="block text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {isResearcher ? opt.full : opt.plain}
                    </span>
                    {isResearcher && (
                      <span className={`block text-[11px] font-mono font-bold uppercase ${opt.ink}`}>{opt.tag}</span>
                    )}
                  </span>
                  <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selected ? `border-current ${opt.ink}` : 'border-slate-300 dark:border-slate-600'}`}>
                    {selected && <Check className="w-3 h-3 stroke-[3]" />}
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* Submit */}
        <div className="space-y-3 pt-1">
          <button
            type="submit"
            id="start-assessment-btn"
            className="w-full inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-base shadow-[0_4px_12px_rgba(12,122,156,0.25)] transition-all active:scale-[0.99] cursor-pointer"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>{t.studentCredentialsSaved}</span>
              </>
            ) : (
              <>
                <span>{t.startAssessmentBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {onOpenPrivacy && (
            <button
              type="button"
              onClick={onOpenPrivacy}
              className="w-full inline-flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{tr('Деректеріңіз қалай қолданылады?', 'Как используются ваши данные?', 'How we use your data')}</span>
            </button>
          )}
        </div>

      </form>
    </div>
  );
};
