import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  Sparkles, 
  Check, 
  ArrowRight, 
  RefreshCw, 
  Info,
  Phone,
  User,
  Calendar,
  Globe2,
  AlertCircle
} from 'lucide-react';
import { LanguageCode, LanguageDominanceGroup, ParticipantProfile } from '../types';
import { translations } from '../data/translations';
import { sampleParticipantProfiles } from '../data/mockCohorts';

interface ParticipantOnboardingProps {
  currentParticipant: ParticipantProfile;
  setCurrentParticipant: (p: ParticipantProfile) => void;
  lang: LanguageCode;
  onProceedToExperiment: () => void;
}

export const ParticipantOnboarding: React.FC<ParticipantOnboardingProps> = ({
  currentParticipant,
  setCurrentParticipant,
  lang,
  onProceedToExperiment
}) => {
  const t = translations[lang];
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

  // Phone number formatter & cleaner
  const formatPhoneNumber = (val: string) => {
    // Keep digits and leading +
    const cleaned = val.replace(/[^\d+]/g, '');
    return cleaned;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const formatted = formatPhoneNumber(rawVal);
    setProfile(prev => ({ ...prev, phoneNumber: formatted }));
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

    // Validate Student Name
    if (!profile.studentName || profile.studentName.trim().length < 2) {
      newErrors.studentName = t.nameError || 'Please enter student name';
    }

    // Validate Phone Number: must have at least 10 digits
    const digitsOnly = (profile.phoneNumber || '').replace(/\D/g, '');
    if (!profile.phoneNumber || digitsOnly.length < 10) {
      newErrors.phoneNumber = t.phoneError || 'Please enter a valid phone number (at least 10 digits)';
    }

    // Validate Age
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
    const updated: ParticipantProfile = {
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
    };
    setProfile(updated);
    setErrors({});
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const generateNewId = () => {
    const prefix = 
      profile.dominanceGroup === 'kazakh_dominant' ? 'KZ' : 
      profile.dominanceGroup === 'bilingual_balanced' ? 'BI' : 'L2';
    const randomDigits = Math.floor(100 + Math.random() * 900);
    const newId = `P-${prefix}-${randomDigits}`;
    setProfile(prev => ({ ...prev, id: newId }));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
            <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{t.participantProfile}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            {t.studentLoginTitle}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t.studentLoginSubtitle}
          </p>
        </div>

        {/* Quick Presets for Demo */}
        <div className="flex flex-col items-start sm:items-end gap-1.5 shrink-0">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            {t.studentPresetLabel}
          </span>
          <div className="flex gap-1.5">
            {sampleParticipantProfiles.map(p => (
              <button
                key={p.id}
                type="button"
                id={`preset-btn-${p.id}`}
                onClick={() => loadPreset(p)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold border transition-all cursor-pointer ${
                  profile.studentName === p.studentName 
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 font-bold shadow-xs' 
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
                title={`${p.studentName} (${p.age} жас, ${p.phoneNumber})`}
              >
                {p.studentName.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Student Registration Form */}
      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Section 1: Required Student Identification Credentials */}
        <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{lang === 'kk' ? 'Оқушының негізгі деректері' : lang === 'ru' ? 'Основные данные учащегося' : 'Student Information'}</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {lang === 'kk' ? 'Барлық сынақ нәтижелері осы деректермен сақталады' : lang === 'ru' ? 'Результаты тестов будут привязаны к этим данным' : 'All assessment telemetry will be recorded under these credentials'}
              </p>
            </div>
            <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold">
              ID: {profile.id}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            
            {/* Field 1: Student Name / Full Name */}
            <div className="sm:col-span-2">
              <label 
                htmlFor="student-name-input"
                className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5"
              >
                {t.labelStudentName} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  id="student-name-input"
                  type="text"
                  value={profile.studentName || ''}
                  onChange={handleNameChange}
                  placeholder={t.placeholderStudentName}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-all focus:outline-hidden ${
                    errors.studentName
                      ? 'border-rose-300 dark:border-rose-700 bg-rose-50/40 dark:bg-rose-950/20 text-slate-900 dark:text-slate-100 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-emerald-500/20'
                  }`}
                  required
                />
              </div>
              {errors.studentName && (
                <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.studentName}</span>
                </p>
              )}
            </div>

            {/* Field 2: Phone Number with Validation */}
            <div>
              <label 
                htmlFor="student-phone-input"
                className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5"
              >
                {t.labelPhoneNumber} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  id="student-phone-input"
                  type="tel"
                  value={profile.phoneNumber || ''}
                  onChange={handlePhoneChange}
                  placeholder={t.placeholderPhoneNumber}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-mono transition-all focus:outline-hidden ${
                    errors.phoneNumber
                      ? 'border-rose-300 dark:border-rose-700 bg-rose-50/40 dark:bg-rose-950/20 text-slate-900 dark:text-slate-100 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-emerald-500/20'
                  }`}
                  required
                />
              </div>
              {errors.phoneNumber ? (
                <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.phoneNumber}</span>
                </p>
              ) : (
                <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
                  {lang === 'kk' ? 'Формат: +7 (7XX) XXX-XX-XX немесе 10+ сан' : lang === 'ru' ? 'Формат: +7 (7XX) XXX-XX-XX или 10+ цифр' : 'Format: +7 (7XX) XXX-XX-XX or 10+ digits'}
                </p>
              )}
            </div>

            {/* Field 3: Age */}
            <div>
              <label 
                htmlFor="student-age-input"
                className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5"
              >
                {t.labelAge} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Calendar className="w-4 h-4" />
                </div>
                <input
                  id="student-age-input"
                  type="number"
                  min={6}
                  max={99}
                  value={profile.age || ''}
                  onChange={handleAgeChange}
                  placeholder={t.placeholderAge}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-all focus:outline-hidden ${
                    errors.age
                      ? 'border-rose-300 dark:border-rose-700 bg-rose-50/40 dark:bg-rose-950/20 text-slate-900 dark:text-slate-100 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-slate-100 focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-emerald-500/20'
                  }`}
                  required
                />
              </div>
              {errors.age && (
                <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.age}</span>
                </p>
              )}
            </div>

          </div>
        </div>

        {/* Section 2: Language Dominance Group Selection */}
        <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{t.languageGroup}</span>
            </label>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">Research Factor</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            
            {/* Option A: Kazakh Native */}
            <div
              id="cohort-option-kazakh"
              onClick={() => setProfile({ ...profile, dominanceGroup: 'kazakh_dominant' })}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                profile.dominanceGroup === 'kazakh_dominant'
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                  : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50/50 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 uppercase">L1 Native</span>
                {profile.dominanceGroup === 'kazakh_dominant' && (
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 stroke-[2.5]" />
                )}
              </div>
              <h4 className="mt-2 text-xs font-bold text-slate-900 dark:text-slate-100">{t.groupKazakhDominant}</h4>
            </div>

            {/* Option B: Balanced Bilingual */}
            <div
              id="cohort-option-bilingual"
              onClick={() => setProfile({ ...profile, dominanceGroup: 'bilingual_balanced' })}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                profile.dominanceGroup === 'bilingual_balanced'
                  ? 'bg-teal-50/70 dark:bg-teal-950/40 border-teal-500 ring-2 ring-teal-500/20 shadow-xs'
                  : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50/50 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-teal-700 dark:text-teal-400 uppercase">Bilingual</span>
                {profile.dominanceGroup === 'bilingual_balanced' && (
                  <Check className="w-4 h-4 text-teal-600 dark:text-teal-400 stroke-[2.5]" />
                )}
              </div>
              <h4 className="mt-2 text-xs font-bold text-slate-900 dark:text-slate-100">{t.groupBilingual}</h4>
            </div>

            {/* Option C: L2 Learner */}
            <div
              id="cohort-option-l2"
              onClick={() => setProfile({ ...profile, dominanceGroup: 'kazakh_l2' })}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                profile.dominanceGroup === 'kazakh_l2'
                  ? 'bg-amber-50/70 dark:bg-amber-950/40 border-amber-500 ring-2 ring-amber-500/20 shadow-xs'
                  : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50/50 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400 uppercase">L2 Learner</span>
                {profile.dominanceGroup === 'kazakh_l2' && (
                  <Check className="w-4 h-4 text-amber-600 dark:text-amber-400 stroke-[2.5]" />
                )}
              </div>
              <h4 className="mt-2 text-xs font-bold text-slate-900 dark:text-slate-100">{t.groupL2}</h4>
            </div>

          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>
              {lang === 'kk' 
                ? 'Оқушы деректері сақталып, әрбір сынақ нәтижесімен байланыстырылады.' 
                : lang === 'ru'
                ? 'Данные учащегося сохраняются в сессии и привязываются ко всем ответам.'
                : 'Student credentials are saved in session and linked to all test telemetry.'}
            </span>
          </div>

          <button
            type="submit"
            id="start-assessment-btn"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm shadow-[0_4px_12px_rgba(5,150,105,0.25)] transition-all active:scale-[0.99] cursor-pointer shrink-0"
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
        </div>

      </form>

    </div>
  );
};
