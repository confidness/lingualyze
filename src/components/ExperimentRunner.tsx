import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Activity, 
  Layers, 
  Zap, 
  HelpCircle, 
  ArrowRight, 
  Sliders, 
  Volume2, 
  Sparkles,
  BarChart2,
  Check,
  Undo2,
  Sparkle,
  Shuffle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  ActiveTab, 
  LanguageCode, 
  ParticipantProfile, 
  StimulusSentence, 
  TrialResult, 
  WordOrderCondition,
  CEFRLevel,
  EmojiItem,
  StoredTestRecord,
  DetailedResponseItem
} from '../types';
import { translations } from '../data/translations';
import { calculateCognitiveLoad, calculateWpm } from '../utils/statistics';
import { playExperimentCue } from '../utils/audio';
import { storageEngine, generateUUID } from '../utils/storageEngine';
import { 
  generateNonRepeatingSessionQueue, 
  getAllStimuli, 
  shuffleArray 
} from '../utils/stimulusManager';

interface ExperimentRunnerProps {
  stimuli: StimulusSentence[];
  currentParticipant: ParticipantProfile;
  lang: LanguageCode;
  soundEnabled: boolean;
  onTrialComplete: (trial: TrialResult) => void;
  onSessionComplete: (trials: TrialResult[]) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

type ExperimentPhase = 
  | 'idle' 
  | 'fixation' 
  | 'reading' 
  | 'part1_word_chain'
  | 'part2_emoji_order'
  | 'part3_suffix_contrast'
  | 'feedback' 
  | 'finished';

export const ExperimentRunner: React.FC<ExperimentRunnerProps> = ({
  stimuli,
  currentParticipant,
  lang,
  soundEnabled,
  onTrialComplete,
  onSessionComplete,
  setActiveTab,
}) => {
  const t = translations[lang];

  // CEFR Level Filter
  const [selectedCefr, setSelectedCefr] = useState<string>('ALL');

  // Presentation Paradigm Configuration
  const [presentationMode, setPresentationMode] = useState<'whole_sentence' | 'self_paced'>('whole_sentence');
  const [showImmediateFeedback, setShowImmediateFeedback] = useState(true);

  // Experiment State
  const [phase, setPhase] = useState<ExperimentPhase>('idle');
  const [currentStimulusIndex, setCurrentStimulusIndex] = useState(0);
  const [sessionTrials, setSessionTrials] = useState<TrialResult[]>([]);

  // Session Length (number of non-repeating stimuli in this test run: 6, 12, 24, or 'ALL')
  const [sessionLength, setSessionLength] = useState<number | 'ALL'>(12);

  // Dynamic Randomized Non-Repeating Stimulus Queue
  const [sessionQueue, setSessionQueue] = useState<StimulusSentence[]>(() => {
    return generateNonRepeatingSessionQueue({
      cefrLevel: 'ALL',
      targetCount: 12,
      stimuliPool: stimuli && stimuli.length > 0 ? stimuli : getAllStimuli()
    });
  });

  // Track queue shuffle state for UI animation
  const [isQueueShuffled, setIsQueueShuffled] = useState(false);

  // Helper to re-shuffle queue with zero repetitions guaranteed
  const handleReshuffleQueue = useCallback((lvl = selectedCefr, len = sessionLength) => {
    setIsQueueShuffled(true);
    const queue = generateNonRepeatingSessionQueue({
      cefrLevel: lvl,
      targetCount: len === 'ALL' ? undefined : len,
      stimuliPool: stimuli && stimuli.length > 0 ? stimuli : getAllStimuli()
    });
    setSessionQueue(queue);
    setTimeout(() => setIsQueueShuffled(false), 350);
    return queue;
  }, [selectedCefr, sessionLength, stimuli]);

  // Sync queue when CEFR level or sessionLength changes while idle
  useEffect(() => {
    if (phase === 'idle') {
      handleReshuffleQueue(selectedCefr, sessionLength);
    }
  }, [selectedCefr, sessionLength, phase, handleReshuffleQueue]);

  // Self-Paced Word-by-Word State
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [wordTimestamps, setWordTimestamps] = useState<number[]>([]);
  const [perWordRt, setPerWordRt] = useState<number[]>([]);

  // Timing References
  const sentenceStartTimeRef = useRef<number>(0);
  const part1StartTimeRef = useRef<number>(0);
  const part2StartTimeRef = useRef<number>(0);
  const part3StartTimeRef = useRef<number>(0);
  const wordStartTimeRef = useRef<number>(0);
  const timerIntervalRef = useRef<number | null>(null);
  const [liveTimerMs, setLiveTimerMs] = useState(0);

  // Temporary Results for the 3 Parts of current trial
  const [currentReadingTimeMs, setCurrentReadingTimeMs] = useState(0);
  const [part1Result, setPart1Result] = useState<{ isCorrect: boolean; rtMs: number; selectedOptionId: string } | null>(null);
  const [part2Result, setPart2Result] = useState<{ isCorrect: boolean; rtMs: number; userOrder: string[] } | null>(null);
  const [part3Result, setPart3Result] = useState<{ isCorrect: boolean; rtMs: number; chosenSentence: 'A' | 'B' } | null>(null);

  // Part 2: Interactive Emoji Order State
  const [arrangedEmojiIds, setArrangedEmojiIds] = useState<string[]>([]);
  const [part2Error, setPart2Error] = useState(false);

  // Last completed Trial Result
  const [lastTrial, setLastTrial] = useState<TrialResult | null>(null);

  const currentStimulus = sessionQueue[currentStimulusIndex] || sessionQueue[0] || (stimuli && stimuli[0]) || getAllStimuli()[0];
  const totalTrials = sessionQueue.length;

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  // Keyboard shortcut listener for reading phase (Spacebar)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        if (phase === 'reading') {
          if (presentationMode === 'whole_sentence') {
            handleSentenceReadComplete();
          } else {
            handleNextWordSelfPaced();
          }
        }
      } else if (e.code === 'Enter') {
        if (phase === 'feedback') {
          handleProceedToNextTrial();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, presentationMode, currentStimulusIndex, currentWordIndex]);

  // 1. Fixation Phase (+ 850ms gaze lock)
  const runFixationPhase = useCallback(() => {
    setPhase('fixation');
    setLiveTimerMs(0);
    setPart1Result(null);
    setPart2Result(null);
    setPart3Result(null);
    setArrangedEmojiIds([]);
    setPart2Error(false);
    playExperimentCue('beep', soundEnabled);

    setTimeout(() => {
      startReadingPhase();
    }, 850);
  }, [soundEnabled]);

  // Start Experiment (fresh non-repeating queue generated on every test run)
  const startExperiment = useCallback(() => {
    const freshQueue = handleReshuffleQueue(selectedCefr, sessionLength);
    setCurrentStimulusIndex(0);
    setSessionTrials([]);
    setLastTrial(null);
    runFixationPhase();
  }, [handleReshuffleQueue, selectedCefr, sessionLength, runFixationPhase]);

  // 2. Reading Phase
  const startReadingPhase = () => {
    setPhase('reading');
    const now = performance.now();
    sentenceStartTimeRef.current = now;

    if (presentationMode === 'self_paced') {
      setCurrentWordIndex(0);
      wordStartTimeRef.current = now;
      setWordTimestamps([now]);
      setPerWordRt([]);
    }

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };

  // Self-paced reading: reveal next word
  const handleNextWordSelfPaced = () => {
    const now = performance.now();
    const wordRt = Math.round(now - wordStartTimeRef.current);
    const newPerWordRt = [...perWordRt, wordRt];
    setPerWordRt(newPerWordRt);

    playExperimentCue('click', soundEnabled);

    if (currentWordIndex + 1 < currentStimulus.words.length) {
      setCurrentWordIndex(prev => prev + 1);
      wordStartTimeRef.current = now;
      setWordTimestamps(prev => [...prev, now]);
    } else {
      handleSentenceReadComplete(newPerWordRt);
    }
  };

  // Reading complete -> Move to Part 1: Word Chain
  const handleSentenceReadComplete = (collectedWordRts?: number[]) => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    const readingDurationMs = Math.round(performance.now() - sentenceStartTimeRef.current);
    setCurrentReadingTimeMs(readingDurationMs);
    setLiveTimerMs(readingDurationMs);

    // Transition to Part 1 (Word Chain)
    setPhase('part1_word_chain');
    part1StartTimeRef.current = performance.now();
    playExperimentCue('click', soundEnabled);
  };

  // ================= PART 1: Word Chain =================
  const handleSelectPart1Option = (selectedOptionId: string) => {
    const rtMs = Math.round(performance.now() - part1StartTimeRef.current);
    const isCorrect = selectedOptionId === currentStimulus.question.correctOptionId;
    
    if (isCorrect) {
      playExperimentCue('correct', soundEnabled);
    } else {
      playExperimentCue('incorrect', soundEnabled);
    }

    setPart1Result({
      isCorrect,
      rtMs,
      selectedOptionId
    });

    // Advance to Part 2: Emoji Ordering
    setPhase('part2_emoji_order');
    setArrangedEmojiIds([]);
    setPart2Error(false);
    part2StartTimeRef.current = performance.now();
  };

  // ================= PART 2: Emoji Ordering =================
  const handleToggleEmojiSlot = (emojiId: string) => {
    setPart2Error(false);
    playExperimentCue('click', soundEnabled);
    setArrangedEmojiIds(prev => {
      if (prev.includes(emojiId)) {
        return prev.filter(id => id !== emojiId);
      } else {
        return [...prev, emojiId];
      }
    });
  };

  const handleResetEmojiSlots = () => {
    setArrangedEmojiIds([]);
    setPart2Error(false);
    playExperimentCue('click', soundEnabled);
  };

  const handleCheckEmojiOrder = () => {
    const rtMs = Math.round(performance.now() - part2StartTimeRef.current);
    const correctOrder = currentStimulus.emojiChain.correctOrderIds;
    const isCorrect = 
      arrangedEmojiIds.length === correctOrder.length &&
      arrangedEmojiIds.every((id, idx) => id === correctOrder[idx]);

    if (isCorrect) {
      playExperimentCue('correct', soundEnabled);
      setPart2Result({
        isCorrect: true,
        rtMs,
        userOrder: arrangedEmojiIds
      });

      // Move to Part 3: Suffix Contrast
      setPhase('part3_suffix_contrast');
      part3StartTimeRef.current = performance.now();
    } else {
      playExperimentCue('incorrect', soundEnabled);
      setPart2Error(true);
      // Give feedback but allow continuing or retry
      setTimeout(() => {
        setPart2Result({
          isCorrect: false,
          rtMs,
          userOrder: arrangedEmojiIds
        });
        setPhase('part3_suffix_contrast');
        part3StartTimeRef.current = performance.now();
      }, 900);
    }
  };

  // ================= PART 3: Suffix Contrast =================
  const handleSelectSuffixSentence = (choice: 'A' | 'B') => {
    const rtMs = Math.round(performance.now() - part3StartTimeRef.current);
    const isCorrect = choice === currentStimulus.suffixContrast.correctSentence;

    if (isCorrect) {
      playExperimentCue('correct', soundEnabled);
    } else {
      playExperimentCue('incorrect', soundEnabled);
    }

    const p3 = {
      isCorrect,
      rtMs,
      chosenSentence: choice
    };
    setPart3Result(p3);

    // Compute composite trial metrics
    finalizeTrial(part1Result, part2Result, p3);
  };

  // Finalize trial metrics and save
  const finalizeTrial = (
    p1: { isCorrect: boolean; rtMs: number; selectedOptionId: string } | null,
    p2: { isCorrect: boolean; rtMs: number; userOrder: string[] } | null,
    p3: { isCorrect: boolean; rtMs: number; chosenSentence: 'A' | 'B' }
  ) => {
    const p1Corr = p1 ? p1.isCorrect : false;
    const p2Corr = p2 ? p2.isCorrect : false;
    const p3Corr = p3.isCorrect;

    // Overall accuracy: true if at least 2 of 3 parts are correct
    const correctPartsCount = (p1Corr ? 1 : 0) + (p2Corr ? 1 : 0) + (p3Corr ? 1 : 0);
    const isOverallCorrect = correctPartsCount >= 2;

    const totalQuestionRt = (p1?.rtMs || 0) + (p2?.rtMs || 0) + p3.rtMs;
    const wpm = calculateWpm(currentStimulus.wordCount, currentReadingTimeMs);
    const cognitiveLoad = calculateCognitiveLoad(
      currentReadingTimeMs,
      currentStimulus.wordCount,
      p1?.rtMs || 1000,
      isOverallCorrect
    );

    const trialResult: TrialResult = {
      trialId: `trial-${Date.now()}-${currentStimulusIndex}`,
      stimulusId: currentStimulus.id,
      participantId: currentParticipant.id,
      cefrLevel: currentStimulus.cefrLevel,
      currentPart: 'suffix_contrast',
      part1Correct: p1Corr,
      part1RtMs: p1?.rtMs,
      part2Correct: p2Corr,
      part2RtMs: p2?.rtMs,
      part3Correct: p3Corr,
      part3RtMs: p3.rtMs,
      wordOrder: currentStimulus.wordOrder,
      complexity: currentStimulus.complexity,
      length: currentStimulus.length,
      predictability: currentStimulus.predictability,
      readingTimeMs: currentReadingTimeMs,
      readingSpeedWpm: wpm,
      perWordRtMs: perWordRt.length > 0 ? perWordRt : undefined,
      questionResponseTimeMs: totalQuestionRt,
      isCorrect: isOverallCorrect,
      selectedOptionId: p1?.selectedOptionId || 'opt-1',
      cognitiveLoadScore: cognitiveLoad,
      timestamp: new Date().toISOString(),
      presentationMode
    };

    // Automatically persist to research Storage Engine
    try {
      const detailedItem: DetailedResponseItem = {
        stimulus_id: currentStimulus.id,
        sentence_kazakh: currentStimulus.sentenceKazakh,
        word_order: currentStimulus.wordOrder,
        cefr_level: currentStimulus.cefrLevel,
        reading_time_ms: currentReadingTimeMs,
        reaction_time_ms: totalQuestionRt,
        part1_correct: p1Corr,
        part2_correct: p2Corr,
        part3_correct: p3Corr,
        is_overall_correct: isOverallCorrect,
        selected_choice: p1?.selectedOptionId,
        error_type: !isOverallCorrect ? (!p1Corr ? 'Word Chain Error' : !p2Corr ? 'Emoji Sequence Error' : 'Suffix Discrimination Error') : undefined
      };

      const record: StoredTestRecord = {
        test_id: generateUUID(),
        participant_id: currentParticipant.id,
        student_name: currentParticipant.studentName || currentParticipant.name || '',
        phone_number: currentParticipant.phoneNumber || '',
        age: currentParticipant.age,
        cohort: currentParticipant.dominanceGroup,
        timestamp: new Date().toISOString(),
        word_order: currentStimulus.wordOrder,
        reading_time_ms: currentReadingTimeMs,
        reaction_time_ms: totalQuestionRt,
        accuracy_score: Math.round((correctPartsCount / 3) * 100),
        detailed_responses: [detailedItem],
        cefr_level: currentStimulus.cefrLevel,
        notes: `CEFR ${currentStimulus.cefrLevel} • 3-Part Accuracy: ${Math.round((correctPartsCount / 3) * 100)}%`
      };

      storageEngine.saveSession(record);
    } catch (err) {
      console.warn('Failed to save to storageEngine:', err);
    }

    const updatedTrials = [...sessionTrials, trialResult];
    setSessionTrials(updatedTrials);
    setLastTrial(trialResult);
    onTrialComplete(trialResult);

    if (showImmediateFeedback) {
      setPhase('feedback');
    } else {
      advanceOrFinish(updatedTrials);
    }
  };

  // Proceed to next trial after feedback
  const handleProceedToNextTrial = () => {
    advanceOrFinish(sessionTrials);
  };

  const advanceOrFinish = (trials: TrialResult[]) => {
    if (currentStimulusIndex + 1 < totalTrials) {
      setCurrentStimulusIndex(prev => prev + 1);
      runFixationPhase();
    } else {
      setPhase('finished');
      playExperimentCue('complete', soundEnabled);
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Safe fallback
      }
      onSessionComplete(trials);
    }
  };

  const cefrLevels: { id: string; label: string; tag: string }[] = [
    { id: 'ALL', label: t.levelAll || 'Барлық деңгейлер', tag: 'A1-C2' },
    { id: 'A1', label: t.levelA1 || 'A1 Бастапқы', tag: 'A1' },
    { id: 'A2', label: t.levelA2 || 'A2 Негізгі', tag: 'A2' },
    { id: 'B1', label: t.levelB1 || 'B1 Орта', tag: 'B1' },
    { id: 'B2', label: t.levelB2 || 'B2 Жоғары орта', tag: 'B2' },
    { id: 'C1', label: t.levelC1 || 'C1 Күрделі', tag: 'C1' },
    { id: 'C2', label: t.levelC2 || 'C2 Кәсіби', tag: 'C2' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      
      {/* Header Controls Bar */}
      <div className="p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{t.experimentTitle}</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            {lang === 'kk' 
              ? 'Қазақ тілін 3 бөлімді тестілеу платформасы'
              : lang === 'ru'
              ? '3-уровневое тестирование казахского языка'
              : '3-Part Kazakh Psycholinguistic Battery'}
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t.participantId}: <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">{currentParticipant.id}</span>
            </p>
            <button
              onClick={() => setActiveTab('participant')}
              className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
            >
              ({t.changeProfile})
            </button>
          </div>
        </div>

        {/* Presentation Paradigm & Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {phase === 'idle' && (
            <div className="flex bg-slate-100/90 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs shadow-inner">
              <button
                type="button"
                onClick={() => setPresentationMode('whole_sentence')}
                className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                  presentationMode === 'whole_sentence'
                    ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-xs border border-slate-200/60 dark:border-slate-600'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                {lang === 'kk' ? 'Толық сөйлем' : lang === 'ru' ? 'Целиком' : 'Whole Sentence'}
              </button>
              <button
                type="button"
                onClick={() => setPresentationMode('self_paced')}
                className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
                  presentationMode === 'self_paced'
                    ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-xs border border-slate-200/60 dark:border-slate-600'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                {lang === 'kk' ? 'Сөзбе-сөз (SPR)' : lang === 'ru' ? 'Пословно (SPR)' : 'Self-Paced (SPR)'}
              </button>
            </div>
          )}

          {phase !== 'idle' && phase !== 'finished' && (
            <button
              onClick={() => setPhase('idle')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold shadow-xs active:translate-y-0.5 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.restartExperiment}</span>
            </button>
          )}
        </div>
      </div>

      {/* CEFR Level Selector & Randomized Queue Configuration Filter (When Idle) */}
      {phase === 'idle' && (
        <div className="p-6 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{t.selectLevelPrompt || 'Қазақ тілін меңгеру деңгейін таңдаңыз:'}</span>
            </label>
            
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800">
                {sessionQueue.length} {lang === 'kk' ? 'қайталанбайтын сөйлем' : lang === 'ru' ? 'неповторяющихся стимулов' : 'unique stimuli in queue'}
              </span>
              <button
                id="reshuffle-experiment-queue-btn"
                onClick={() => handleReshuffleQueue()}
                title={lang === 'kk' ? 'Кездейсоқ ретті жаңарту' : lang === 'ru' ? 'Перемешать очередь' : 'Reshuffle queue'}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-md border border-slate-200 dark:border-slate-700 transition-all cursor-pointer active:scale-95"
              >
                <Shuffle className={`w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 ${isQueueShuffled ? 'animate-spin' : ''}`} />
                <span>{lang === 'kk' ? 'Араластыру' : lang === 'ru' ? 'Перемешать' : 'Reshuffle'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 pt-1">
            {cefrLevels.map((lvl) => {
              const isSelected = selectedCefr === lvl.id;
              return (
                <button
                  key={lvl.id}
                  id={`cefr-filter-${lvl.id}`}
                  onClick={() => setSelectedCefr(lvl.id)}
                  className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50/90 dark:bg-emerald-950/70 border-emerald-500 shadow-[0_4px_0_#059669] text-emerald-900 dark:text-emerald-200 font-bold -translate-y-0.5'
                      : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border-slate-200/80 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600 shadow-xs'
                  }`}
                >
                  <span className="text-xs font-mono font-black text-emerald-700 dark:text-emerald-400">{lvl.tag}</span>
                  <span className="text-[11px] mt-0.5 text-slate-600 dark:text-slate-400 line-clamp-1">{lvl.label.split(' ')[1] || lvl.label}</span>
                </button>
              );
            })}
          </div>

          {/* Session Size Selector & Scientific Randomization Guarantee */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 dark:text-slate-400 font-medium">
                {lang === 'kk' ? 'Сессия ұзақтығы:' : lang === 'ru' ? 'Длина сессии:' : 'Session length:'}
              </span>
              <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 p-0.5">
                {([6, 12, 24, 'ALL'] as const).map((len) => (
                  <button
                    key={len}
                    onClick={() => setSessionLength(len)}
                    className={`px-2.5 py-1 rounded-md font-mono text-[11px] font-bold transition-all cursor-pointer ${
                      sessionLength === len
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {len === 'ALL' ? (lang === 'kk' ? 'Барлығы' : lang === 'ru' ? 'Все' : 'All') : `${len} ${lang === 'kk' ? 'сынақ' : lang === 'ru' ? 'проб' : 'trials'}`}
                  </button>
                ))}
              </div>
            </div>

            <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-300 bg-emerald-50/70 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800/60">
              ✓ {lang === 'kk' ? '0% қайталану: Fisher-Yates алгоритмі арқылы динамикалық іріктеу' : lang === 'ru' ? '0% повторов: динамическая выборка Fisher-Yates' : 'Zero-repetition: dynamic Fisher-Yates queue'}
            </span>
          </div>
        </div>
      )}

      {/* Progress & 3-Part Status Banner */}
      {phase !== 'idle' && phase !== 'finished' && (
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100">
              {t.trial} {currentStimulusIndex + 1} {t.of} {totalTrials}
            </span>
            <div className="w-24 sm:w-44 bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
              <div 
                className="bg-emerald-600 h-full transition-all duration-300"
                style={{ width: `${((currentStimulusIndex + 1) / totalTrials) * 100}%` }}
              />
            </div>
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-mono font-black">
              {currentStimulus.cefrLevel}
            </span>
          </div>

          {/* Sequential 3-Step Pill Bar */}
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className={`px-2.5 py-1 rounded-xl border text-[11px] font-bold transition-all ${
              phase === 'reading' 
                ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700 shadow-xs' 
                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
            }`}>
              📖 {lang === 'kk' ? 'Оқу' : lang === 'ru' ? 'Чтение' : 'Reading'}
            </span>
            <span className="text-slate-300 dark:text-slate-600">›</span>
            <span className={`px-2.5 py-1 rounded-xl border text-[11px] font-bold transition-all ${
              phase === 'part1_word_chain'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-400 dark:border-emerald-700 shadow-xs'
                : part1Result ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700'
            }`}>
              1. {lang === 'kk' ? 'Сөз тізбегі' : lang === 'ru' ? 'Цепочка слов' : 'Word Chain'}
            </span>
            <span className="text-slate-300 dark:text-slate-600">›</span>
            <span className={`px-2.5 py-1 rounded-xl border text-[11px] font-bold transition-all ${
              phase === 'part2_emoji_order'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-400 dark:border-emerald-700 shadow-xs'
                : part2Result ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700'
            }`}>
              2. {lang === 'kk' ? 'Эмодзи реті' : lang === 'ru' ? 'Эмодзи' : 'Emoji Order'}
            </span>
            <span className="text-slate-300 dark:text-slate-600">›</span>
            <span className={`px-2.5 py-1 rounded-xl border text-[11px] font-bold transition-all ${
              phase === 'part3_suffix_contrast'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-400 dark:border-emerald-700 shadow-xs'
                : part3Result ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700'
            }`}>
              3. {lang === 'kk' ? 'Сөйлем таңдау' : lang === 'ru' ? 'Выбор варианта' : 'Sentence Choice'}
            </span>
          </div>
        </div>
      )}

      {/* EXPERIMENTAL STAGE CANVAS - Neutral Soft White with 3D Accents */}
      <div className="relative min-h-[440px] rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-10 flex flex-col items-center justify-center text-center shadow-[0_10px_30px_-5px_rgba(0,0,0,0.03)] overflow-hidden">
        
        {/* ================= 1. IDLE SCREEN ================= */}
        {phase === 'idle' && (
          <div className="relative z-10 max-w-lg space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-[0_4px_12px_rgba(16,185,129,0.12)]">
              <Play className="w-8 h-8 fill-emerald-600 dark:fill-emerald-400 pl-1" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {lang === 'kk' 
                  ? '3 кезеңді сынақты бастауға дайынсыз ба?' 
                  : lang === 'ru' 
                  ? 'Готовы к началу теста из 3-х частей?' 
                  : 'Ready to Begin 3-Part Assessment?'}
              </h3>
              
              <div className="mt-4 text-left p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 space-y-2.5">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-center shrink-0 text-[11px]">1</span>
                  <p><strong>{t.part1Badge}</strong>: {t.part1Desc}</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-center shrink-0 text-[11px]">2</span>
                  <p><strong>{t.part2Badge}</strong>: {t.part2Desc}</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-center shrink-0 text-[11px]">3</span>
                  <p><strong>{t.part3Badge}</strong>: {t.part3Desc}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                id="start-experiment-runner-btn"
                onClick={startExperiment}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-[0_4px_0_#047857] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{t.startExperiment} ({totalTrials} {lang === 'kk' ? 'стимул' : lang === 'ru' ? 'стимулов' : 'stimuli'})</span>
              </button>
            </div>

            <p className="text-xs text-slate-400 dark:text-slate-500 font-mono">
              {lang === 'kk'
                ? 'Space = Оқуды аяқтау • Тінтуір = Эмодзи мен нұсқаларды таңдау'
                : lang === 'ru'
                ? 'Space = Завершить чтение • Мышь = Выбор эмодзи и вариантов'
                : 'Spacebar = Complete reading • Click = Interact with emojis & options'}
            </p>
          </div>
        )}

        {/* ================= 2. FIXATION CROSS ================= */}
        {phase === 'fixation' && (
          <div className="relative z-10 flex flex-col items-center justify-center">
            <div className="text-6xl font-light text-emerald-600 dark:text-emerald-400 font-mono select-none">
              +
            </div>
            <p className="mt-4 text-xs font-mono text-slate-500 dark:text-slate-400 tracking-wider">
              {t.fixationCross}
            </p>
          </div>
        )}

        {/* ================= 3. READING PHASE ================= */}
        {phase === 'reading' && (
          <div className="relative z-10 w-full max-w-3xl space-y-8">
            
            {/* Clean Progress Indicator (Replaces live ticking timer to eliminate participant anxiety and ensure behavioral validity) */}
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono">
                {lang === 'kk' ? '1 / 3 қадам' : lang === 'ru' ? '1 / 3 шаг' : 'Step 1 of 3'}
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                {lang === 'kk' ? 'Сөйлемді оқу' : lang === 'ru' ? 'Чтение предложения' : 'Sentence Reading'}
              </span>
              <div className="w-16 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden ml-1">
                <div className="w-1/3 h-full bg-emerald-500 rounded-full" />
              </div>
            </div>

            {/* Whole Sentence Mode */}
            {presentationMode === 'whole_sentence' && (
              <div className="space-y-6">
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-100 tracking-normal leading-[1.6] select-none text-center">
                  «{currentStimulus.sentenceKazakh}»
                </p>
              </div>
            )}

            {/* Self-Paced Word-by-Word Mode */}
            {presentationMode === 'self_paced' && (
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {currentStimulus.words.map((word, idx) => {
                    const isRevealed = idx === currentWordIndex;
                    return (
                      <span
                        key={idx}
                        className={`transition-all duration-150 px-3 py-1.5 rounded-xl text-2xl sm:text-3xl lg:text-4xl font-bold leading-[1.6] ${
                          isRevealed
                            ? 'text-slate-900 dark:text-slate-100 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 shadow-xs'
                            : 'text-slate-300 dark:text-slate-600 select-none'
                        }`}
                      >
                        {isRevealed ? word : '—'.repeat(Math.max(3, word.length - 1))}
                      </span>
                    );
                  })}
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  {lang === 'kk' 
                    ? `${currentWordIndex + 1} / ${currentStimulus.words.length} сөз` 
                    : lang === 'ru'
                    ? `Слово ${currentWordIndex + 1} из ${currentStimulus.words.length}`
                    : `Word ${currentWordIndex + 1} of ${currentStimulus.words.length}`}
                </p>
              </div>
            )}

            {/* Next / Done Interaction Button */}
            <div className="pt-4">
              <button
                id="reading-done-btn"
                onClick={() => {
                  if (presentationMode === 'whole_sentence') {
                    handleSentenceReadComplete();
                  } else {
                    handleNextWordSelfPaced();
                  }
                }}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-[0_4px_0_#047857] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
              >
                <span>
                  {presentationMode === 'whole_sentence' 
                    ? (lang === 'kk' ? 'Оқып болдым (1-бөлімге өту)' : lang === 'ru' ? 'Прочитано (К части 1)' : 'Done Reading (To Part 1)')
                    : currentWordIndex + 1 === currentStimulus.words.length 
                      ? (lang === 'kk' ? 'Соңғы сөз (1-бөлімге өту)' : lang === 'ru' ? 'Последнее слово (К части 1)' : 'Final Word (To Part 1)')
                      : (lang === 'kk' ? 'Келесі сөз (Space)' : lang === 'ru' ? 'Следующее слово (Space)' : 'Next Word (Space)')}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 font-mono">
                {presentationMode === 'whole_sentence' ? t.pressSpaceWhenDone : t.pressSpaceNextWord}
              </div>
            </div>

          </div>
        )}

        {/* ================= 4. PART 1: WORD CHAIN ================= */}
        {phase === 'part1_word_chain' && (
          <div className="relative z-10 w-full max-w-2xl space-y-6 text-left">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span>{t.part1Badge}</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                  {lang === 'kk' ? '1 / 3 қадам' : lang === 'ru' ? '1 / 3 шаг' : 'Step 1 of 3'}
                </span>
                <div className="w-12 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div className="w-1/3 h-full bg-emerald-500 rounded-full" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 leading-snug">
                {t.wordChainPrompt}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {t.part1Desc}
              </p>
            </div>

            {/* Word Chain Options as 3D Tactile Cards */}
            <div className="space-y-3 pt-2">
              {currentStimulus.question.options.map((option, idx) => (
                <button
                  key={option.id}
                  id={`part1-option-${option.id}`}
                  onClick={() => handleSelectPart1Option(option.id)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 hover:border-emerald-300 dark:hover:border-emerald-600 text-left transition-all shadow-[0_3px_0_#E2E8F0] dark:shadow-[0_3px_0_#1E293B] active:translate-y-0.5 active:shadow-xs group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-700 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/60 group-hover:text-emerald-800 dark:group-hover:text-emerald-300 font-mono font-bold text-xs flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0">
                      {idx + 1}
                    </span>
                    <p className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 group-hover:text-emerald-900 dark:group-hover:text-emerald-200">
                      {lang === 'kk' ? option.textKk : lang === 'ru' ? option.textRu : option.textEn}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 shrink-0 transition-transform group-hover:translate-x-1" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ================= 5. PART 2: EMOJI ORDERING ================= */}
        {phase === 'part2_emoji_order' && (
          <div className="relative z-10 w-full max-w-2xl space-y-6 text-left">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-xs font-bold shadow-xs">
                <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
                <span>{t.part2Badge}</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                  {lang === 'kk' ? '2 / 3 қадам' : lang === 'ru' ? '2 / 3 шаг' : 'Step 2 of 3'}
                </span>
                <div className="w-12 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div className="w-2/3 h-full bg-teal-500 rounded-full" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 leading-snug">
                {t.part2Name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {t.selectSlotPrompt}
              </p>
            </div>

            {/* Arranged Slots Drop Area */}
            <div className="p-5 rounded-2xl bg-slate-50/90 dark:bg-slate-800/60 border-2 border-dashed border-slate-300 dark:border-slate-700 min-h-[90px] flex flex-wrap items-center gap-3">
              {arrangedEmojiIds.length === 0 ? (
                <div className="text-xs font-mono text-slate-400 dark:text-slate-500 italic mx-auto">
                  {lang === 'kk' 
                    ? 'Төмендегі эмодзилерді сөйлем ретімен таңдаңыз...' 
                    : lang === 'ru'
                    ? 'Нажимайте на эмодзи ниже для сборки последовательности...'
                    : 'Click emojis below in sentence order...'}
                </div>
              ) : (
                arrangedEmojiIds.map((id, index) => {
                  const item = currentStimulus.emojiChain.items.find(e => e.id === id);
                  if (!item) return null;
                  return (
                    <button
                      key={id}
                      onClick={() => handleToggleEmojiSlot(id)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-700 text-slate-900 dark:text-slate-100 font-bold shadow-[0_3px_0_#10B981] active:translate-y-0.5 transition-all group cursor-pointer"
                      title={lang === 'kk' ? 'Алып тастау үшін басыңыз' : 'Нажмите для удаления'}
                    >
                      <span className="text-xl">{item.emoji}</span>
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
                        {lang === 'kk' ? item.labelKk : lang === 'ru' ? item.labelRu : item.labelEn}
                      </span>
                      <span className="text-[10px] text-slate-400 group-hover:text-rose-500 ml-1">✕</span>
                    </button>
                  );
                })
              )}
            </div>

            {/* Error Message if wrong */}
            {part2Error && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-2">
                <XCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{t.incorrectOrderAlert}</span>
              </div>
            )}

            {/* Available Emojis Pool - 3D Tactile Buttons */}
            <div>
              <p className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                {t.availableEmojisLabel}
              </p>
              <div className="flex flex-wrap gap-2.5">
                {currentStimulus.emojiChain.items.map((item) => {
                  const isSelected = arrangedEmojiIds.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      id={`emoji-pool-btn-${item.id}`}
                      disabled={isSelected}
                      onClick={() => handleToggleEmojiSlot(item.id)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-2xl border text-sm font-semibold transition-all ${
                        isSelected
                          ? 'opacity-40 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                          : 'bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-600 text-slate-900 dark:text-slate-100 shadow-[0_4px_0_#E2E8F0] dark:shadow-[0_4px_0_#1E293B] active:translate-y-1 active:shadow-none cursor-pointer'
                      }`}
                    >
                      <span className="text-2xl">{item.emoji}</span>
                      <span>
                        {lang === 'kk' ? item.labelKk : lang === 'ru' ? item.labelRu : item.labelEn}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Actions: Reset and Check */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleResetEmojiSlots}
                disabled={arrangedEmojiIds.length === 0}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold disabled:opacity-40 cursor-pointer"
              >
                <Undo2 className="w-3.5 h-3.5" />
                <span>{t.btnClearSlots}</span>
              </button>

              <button
                id="check-emoji-order-btn"
                type="button"
                disabled={arrangedEmojiIds.length !== currentStimulus.emojiChain.items.length}
                onClick={handleCheckEmojiOrder}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-[0_3px_0_#047857] active:translate-y-0.5 active:shadow-none disabled:opacity-40 transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>{t.btnCheckOrder} (3-бөлімге өту)</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= 6. PART 3: SUFFIX CONTRAST ================= */}
        {phase === 'part3_suffix_contrast' && (
          <div className="relative z-10 w-full max-w-2xl space-y-6 text-left">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-300 text-xs font-bold shadow-xs">
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                <span>{t.part3Badge}</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                  {lang === 'kk' ? '3 / 3 қадам' : lang === 'ru' ? '3 / 3 шаг' : 'Step 3 of 3'}
                </span>
                <div className="w-12 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div className="w-full h-full bg-indigo-500 rounded-full" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 leading-snug">
                {currentStimulus.suffixContrast.targetQuestionText[lang] || currentStimulus.suffixContrast.targetQuestionText.kk}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {t.part3Desc}
              </p>
            </div>

            {/* 2 Contrasting Sentences as Pure Text Choice Cards (No Grammatical Clues) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              
              {/* Option 1 (Sentence A) */}
              <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-[0_4px_12px_rgba(0,0,0,0.03)] space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-mono font-bold">
                      {lang === 'kk' ? '1-нұсқа' : lang === 'ru' ? 'Вариант 1' : 'Option 1'}
                    </span>
                  </div>
                  <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-relaxed">
                    «{currentStimulus.suffixContrast.sentenceA}»
                  </p>
                </div>

                <button
                  id="choose-sentence-A-btn"
                  onClick={() => handleSelectSuffixSentence('A')}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-50 dark:bg-slate-700/70 hover:bg-emerald-600 dark:hover:bg-emerald-600 hover:text-white border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 font-bold text-xs shadow-[0_3px_0_#CBD5E1] dark:shadow-[0_3px_0_#334155] hover:shadow-[0_3px_0_#047857] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer group"
                >
                  <span>{t.chooseSentenceA}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Option 2 (Sentence B) */}
              <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-[0_4px_12px_rgba(0,0,0,0.03)] space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-mono font-bold">
                      {lang === 'kk' ? '2-нұсқа' : lang === 'ru' ? 'Вариант 2' : 'Option 2'}
                    </span>
                  </div>
                  <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-relaxed">
                    «{currentStimulus.suffixContrast.sentenceB}»
                  </p>
                </div>

                <button
                  id="choose-sentence-B-btn"
                  onClick={() => handleSelectSuffixSentence('B')}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-50 dark:bg-slate-700/70 hover:bg-emerald-600 dark:hover:bg-emerald-600 hover:text-white border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 font-bold text-xs shadow-[0_3px_0_#CBD5E1] dark:shadow-[0_3px_0_#334155] hover:shadow-[0_3px_0_#047857] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer group"
                >
                  <span>{t.chooseSentenceB}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ================= 7. TRIAL FEEDBACK PHASE ================= */}
        {phase === 'feedback' && lastTrial && (
          <div className="relative z-10 max-w-xl space-y-6 text-left">
            <div className="flex items-center gap-3">
              {lastTrial.isCorrect ? (
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs shrink-0">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 flex items-center justify-center shadow-xs shrink-0">
                  <XCircle className="w-7 h-7" />
                </div>
              )}
              <div>
                <h3 className={`text-xl font-bold ${lastTrial.isCorrect ? 'text-emerald-800 dark:text-emerald-300' : 'text-rose-800 dark:text-rose-300'}`}>
                  {lastTrial.isCorrect ? t.correct : t.incorrect}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t.wordOrder}: <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">{lastTrial.wordOrder}</span> • {t.cefrLevel}: <span className="font-bold">{lastTrial.cefrLevel}</span>
                </p>
              </div>
            </div>

            {/* 3-Part Results Checklist */}
            <div className="grid grid-cols-3 gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-xs">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block uppercase font-bold">1. {lang === 'kk' ? 'Сөз тізбегі' : 'Word Chain'}</span>
                <span className={`text-sm font-bold flex items-center gap-1 mt-0.5 ${lastTrial.part1Correct ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {lastTrial.part1Correct ? '✓ Дұрыс' : '✕ Қате'}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">{lastTrial.part1RtMs} ms</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-xs">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block uppercase font-bold">2. {lang === 'kk' ? 'Эмодзи' : 'Emoji Order'}</span>
                <span className={`text-sm font-bold flex items-center gap-1 mt-0.5 ${lastTrial.part2Correct ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {lastTrial.part2Correct ? '✓ Дұрыс' : '✕ Қате'}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">{lastTrial.part2RtMs} ms</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-xs">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block uppercase font-bold">3. {lang === 'kk' ? 'Жалғаулар' : 'Suffixes'}</span>
                <span className={`text-sm font-bold flex items-center gap-1 mt-0.5 ${lastTrial.part3Correct ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  {lastTrial.part3Correct ? '✓ Дұрыс' : '✕ Қате'}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">{lastTrial.part3RtMs} ms</span>
              </div>
            </div>

            {/* Suffix Linguistic Explanation */}
            <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-slate-700 dark:text-slate-300 space-y-1">
              <span className="font-bold text-emerald-800 dark:text-emerald-300 block">
                {t.caseExplanationLabel}
              </span>
              <p className="leading-relaxed">
                {lang === 'kk' 
                  ? currentStimulus.suffixContrast.explanationKk 
                  : lang === 'ru' 
                  ? currentStimulus.suffixContrast.explanationRu 
                  : currentStimulus.suffixContrast.explanationEn}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                {t.readingSpeedMs}: <strong className="text-slate-900 dark:text-slate-100">{lastTrial.readingTimeMs} ms</strong> ({lastTrial.readingSpeedWpm} WPM)
              </span>

              <button
                id="next-trial-btn"
                onClick={handleProceedToNextTrial}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-[0_3px_0_#047857] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
              >
                <span>{t.nextTrial} (Enter)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= 8. SESSION FINISHED SCREEN ================= */}
        {phase === 'finished' && (
          <div className="relative z-10 max-w-lg space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-[0_4px_12px_rgba(16,185,129,0.12)]">
              <Sparkles className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                {t.sessionFinished}
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {t.sessionFinishedDesc}
              </p>
            </div>

            {/* Quick Session Summary */}
            <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-left font-mono">
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase">{t.trial}</span>
                <span className="text-lg font-bold text-slate-900 dark:text-slate-100">{sessionTrials.length}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase">{t.accuracy}</span>
                <span className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
                  {Math.round((sessionTrials.filter(tr => tr.isCorrect).length / Math.max(1, sessionTrials.length)) * 100)}%
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase">{t.avgReadingSpeed}</span>
                <span className="text-lg font-bold text-teal-700 dark:text-teal-400">
                  {Math.round(sessionTrials.reduce((a, b) => a + b.readingTimeMs, 0) / Math.max(1, sessionTrials.length))} ms
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                id="view-analytics-from-session-btn"
                onClick={() => setActiveTab('analytics')}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-[0_3px_0_#047857] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
              >
                <BarChart2 className="w-4 h-4" />
                <span>{t.viewResults}</span>
              </button>

              <button
                id="run-another-session-btn"
                onClick={startExperiment}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 font-semibold text-sm shadow-xs transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{t.tryAnotherSession}</span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Helper Footer Settings */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-600 dark:text-slate-300 shadow-xs">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer hover:text-slate-900 dark:hover:text-slate-100">
            <input
              type="checkbox"
              checked={showImmediateFeedback}
              onChange={(e) => setShowImmediateFeedback(e.target.checked)}
              className="accent-emerald-600 rounded"
            />
            <span>{lang === 'kk' ? 'Әр сынақ соңында жедел нәтижені көрсету' : lang === 'ru' ? 'Показывать обратную связь после каждой пробы' : 'Show immediate trial feedback'}</span>
          </label>
        </div>

        <span className="font-mono text-slate-500 dark:text-slate-400">
          {lang === 'kk' ? 'Режим' : lang === 'ru' ? 'Режим' : 'Paradigm'}: {presentationMode === 'whole_sentence' ? 'Rapid Visual (RVP)' : 'Moving Window (SPR)'}
        </span>
      </div>

    </div>
  );
};
