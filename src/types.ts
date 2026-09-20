export type LanguageCode = 'kk' | 'ru' | 'en';

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type TestPartType = 'word_chain' | 'emoji_ordering' | 'suffix_contrast';

export type LanguageDominanceGroup = 
  | 'kazakh_dominant' 
  | 'bilingual_balanced' 
  | 'kazakh_l2';

export type WordOrderCondition = 'SOV' | 'OSV' | 'SVO' | 'OVS';

export type SentenceLength = 'short' | 'medium' | 'long';

export type SyntacticComplexity = 'simple' | 'complex';

export type PredictabilityLevel = 'high' | 'low';

export interface ParticipantProfile {
  id: string;
  name?: string;
  studentName?: string;
  phoneNumber?: string;
  age: number;
  gender?: 'female' | 'male' | 'other' | 'prefer_not_to_say';
  dominanceGroup: LanguageDominanceGroup;
  cefrLevel: CEFRLevel;
  primaryHomeLanguage?: string;
  educationLevel?: 'high_school' | 'bachelors' | 'masters' | 'phd';
  dailyKazakhUsagePercent?: number; // 0 - 100
  selfRatedReadingProficiency?: number; // 1 - 5
  notes?: string;
  createdAt: string;
}

export interface EmojiItem {
  id: string;
  emoji: string;
  labelKk: string;
  labelRu: string;
  labelEn: string;
}

export interface SuffixContrastPair {
  sentenceA: string;
  sentenceB: string;
  highlightWordA: string; // e.g. "итке"
  highlightWordB: string; // e.g. "иттен"
  suffixA: string; // e.g. "-ке (Барыс септік / Dative)"
  suffixB: string; // e.g. "-тен (Шығыс септік / Ablative)"
  targetQuestionText: {
    kk: string;
    ru: string;
    en: string;
  };
  correctSentence: 'A' | 'B';
  explanationKk: string;
  explanationRu: string;
  explanationEn: string;
}

export interface ComprehensionQuestion {
  questionText: {
    kk: string;
    ru: string;
    en: string;
  };
  options: {
    id: string;
    textKk: string;
    textRu: string;
    textEn: string;
  }[];
  correctOptionId: string;
  explanationKk?: string;
  explanationRu?: string;
  explanationEn?: string;
}

export interface StimulusSentence {
  id: string;
  cefrLevel: CEFRLevel;
  sentenceKazakh: string;
  transliterationLatin?: string;
  translationRu: string;
  translationEn: string;
  wordOrder: WordOrderCondition;
  length: SentenceLength;
  complexity: SyntacticComplexity;
  predictability: PredictabilityLevel;
  wordCount: number;
  words: string[];
  morphologicalGloss: string; // Leipzig glossing e.g. "student-NOM library-DAT new book-ACC take-PST.3SG"
  syntacticFocus: string;
  // Part 1: Word chain question
  question: ComprehensionQuestion;
  // Part 2: Emoji chain arrangement
  emojiChain: {
    items: EmojiItem[];
    correctOrderIds: string[]; // Order of IDs matching sentence word order
  };
  // Part 3: Suffix contrast minimal pair
  suffixContrast: SuffixContrastPair;
}

export interface TrialResult {
  trialId: string;
  stimulusId: string;
  participantId: string;
  dominanceGroup?: LanguageDominanceGroup;
  cefrLevel?: CEFRLevel;
  currentPart?: TestPartType;
  part1Correct?: boolean;
  part1RtMs?: number;
  part2Correct?: boolean;
  part2RtMs?: number;
  part3Correct?: boolean;
  part3RtMs?: number;
  wordOrder: WordOrderCondition;
  complexity: SyntacticComplexity;
  length: SentenceLength;
  predictability: PredictabilityLevel;
  readingTimeMs: number; // Sentence unmasking / reading time
  readingSpeedWpm: number; // Words per minute
  perWordRtMs?: number[]; // If self-paced reading mode
  questionResponseTimeMs: number; // Reaction time to answer
  isCorrect: boolean;
  selectedOptionId: string;
  cognitiveLoadScore: number; // 0 - 100 calculated index
  timestamp: string;
  presentationMode: 'whole_sentence' | 'self_paced';
}

export interface ExperimentSession {
  sessionId: string;
  participant: ParticipantProfile;
  trials: TrialResult[];
  startedAt: string;
  completedAt?: string;
  presentationMode: 'whole_sentence' | 'self_paced';
  aggregateMetrics: {
    totalTrials: number;
    accuracyPercent: number;
    meanReadingTimeMs: number;
    meanQuestionRtMs: number;
    meanCognitiveLoad: number;
    byCondition: Record<WordOrderCondition, {
      meanReadingTimeMs: number;
      meanQuestionRtMs: number;
      accuracyPercent: number;
      meanCognitiveLoad: number;
      trialCount: number;
    }>;
  };
}

export interface CohortConditionMetric {
  meanReadingTimeMs: number;
  stdErrorMs: number;
  accuracyPercent: number;
  cognitiveLoadScore: number;
  reactionTimeMs: number;
  medianReadingTimeMs?: number;
  q1ReadingTimeMs?: number;
  q3ReadingTimeMs?: number;
  minReadingTimeMs?: number;
  maxReadingTimeMs?: number;
}

export interface CohortAggregates {
  dominanceGroup: LanguageDominanceGroup;
  sampleSize: number;
  conditionMetrics: Record<WordOrderCondition, CohortConditionMetric>;
}

export type UserRole = 'participant' | 'researcher';

export type ThemeMode = 'light' | 'dark';

export interface DetailedResponseItem {
  stimulus_id: string;
  sentence_kazakh: string;
  word_order: WordOrderCondition;
  cefr_level: CEFRLevel;
  reading_time_ms: number;
  reaction_time_ms: number;
  part1_correct: boolean;
  part2_correct: boolean;
  part3_correct: boolean;
  is_overall_correct: boolean;
  selected_choice?: string;
  error_type?: string;
}

export interface StoredTestRecord {
  test_id: string; // UUID / unique identifier
  participant_id: string;
  student_name?: string;
  phone_number?: string;
  age?: number;
  cohort: LanguageDominanceGroup;
  timestamp: string; // ISO format
  word_order: WordOrderCondition;
  reading_time_ms: number;
  reaction_time_ms: number;
  accuracy_score: number; // percentage (0 - 100)
  detailed_responses: DetailedResponseItem[];
  cefr_level?: CEFRLevel;
  notes?: string;
}

export type ActiveTab = 
  | 'overview' 
  | 'methodology'
  | 'participant' 
  | 'experiment' 
  | 'analytics' 
  | 'database' 
  | 'neurolinguistics'
  | 'privacy'
  | 'admin';

