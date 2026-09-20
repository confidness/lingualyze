import { CohortAggregates, LanguageDominanceGroup, WordOrderCondition } from '../types';

export const cohortBenchmarks: Record<LanguageDominanceGroup, CohortAggregates> = {
  kazakh_dominant: {
    dominanceGroup: 'kazakh_dominant',
    sampleSize: 45,
    conditionMetrics: {
      SOV: {
        meanReadingTimeMs: 1620,
        stdErrorMs: 42,
        accuracyPercent: 96.8,
        cognitiveLoadScore: 23.4,
        reactionTimeMs: 1390,
        medianReadingTimeMs: 1590,
        q1ReadingTimeMs: 1460,
        q3ReadingTimeMs: 1740,
        minReadingTimeMs: 1220,
        maxReadingTimeMs: 2080
      },
      OSV: {
        meanReadingTimeMs: 1980,
        stdErrorMs: 56,
        accuracyPercent: 93.5,
        cognitiveLoadScore: 36.8,
        reactionTimeMs: 1680,
        medianReadingTimeMs: 1950,
        q1ReadingTimeMs: 1780,
        q3ReadingTimeMs: 2160,
        minReadingTimeMs: 1480,
        maxReadingTimeMs: 2540
      },
      SVO: {
        meanReadingTimeMs: 2280,
        stdErrorMs: 64,
        accuracyPercent: 88.4,
        cognitiveLoadScore: 51.2,
        reactionTimeMs: 1940,
        medianReadingTimeMs: 2240,
        q1ReadingTimeMs: 2050,
        q3ReadingTimeMs: 2490,
        minReadingTimeMs: 1680,
        maxReadingTimeMs: 2950
      },
      OVS: {
        meanReadingTimeMs: 2460,
        stdErrorMs: 78,
        accuracyPercent: 84.2,
        cognitiveLoadScore: 58.6,
        reactionTimeMs: 2150,
        medianReadingTimeMs: 2410,
        q1ReadingTimeMs: 2180,
        q3ReadingTimeMs: 2710,
        minReadingTimeMs: 1760,
        maxReadingTimeMs: 3220
      }
    }
  },
  bilingual_balanced: {
    dominanceGroup: 'bilingual_balanced',
    sampleSize: 48,
    conditionMetrics: {
      SOV: {
        meanReadingTimeMs: 1840,
        stdErrorMs: 48,
        accuracyPercent: 94.2,
        cognitiveLoadScore: 31.8,
        reactionTimeMs: 1540,
        medianReadingTimeMs: 1810,
        q1ReadingTimeMs: 1640,
        q3ReadingTimeMs: 2010,
        minReadingTimeMs: 1340,
        maxReadingTimeMs: 2380
      },
      OSV: {
        meanReadingTimeMs: 2310,
        stdErrorMs: 62,
        accuracyPercent: 89.6,
        cognitiveLoadScore: 46.5,
        reactionTimeMs: 1880,
        medianReadingTimeMs: 2280,
        q1ReadingTimeMs: 2080,
        q3ReadingTimeMs: 2520,
        minReadingTimeMs: 1720,
        maxReadingTimeMs: 2980
      },
      SVO: {
        // Bilinguals exhibit structural cross-linguistic priming from Russian SVO
        meanReadingTimeMs: 1950,
        stdErrorMs: 52,
        accuracyPercent: 91.8,
        cognitiveLoadScore: 39.4,
        reactionTimeMs: 1660,
        medianReadingTimeMs: 1920,
        q1ReadingTimeMs: 1760,
        q3ReadingTimeMs: 2120,
        minReadingTimeMs: 1460,
        maxReadingTimeMs: 2490
      },
      OVS: {
        meanReadingTimeMs: 2540,
        stdErrorMs: 82,
        accuracyPercent: 82.5,
        cognitiveLoadScore: 57.0,
        reactionTimeMs: 2280,
        medianReadingTimeMs: 2490,
        q1ReadingTimeMs: 2240,
        q3ReadingTimeMs: 2810,
        minReadingTimeMs: 1820,
        maxReadingTimeMs: 3340
      }
    }
  },
  kazakh_l2: {
    dominanceGroup: 'kazakh_l2',
    sampleSize: 32,
    conditionMetrics: {
      SOV: {
        meanReadingTimeMs: 2650,
        stdErrorMs: 88,
        accuracyPercent: 81.5,
        cognitiveLoadScore: 57.4,
        reactionTimeMs: 2140,
        medianReadingTimeMs: 2590,
        q1ReadingTimeMs: 2320,
        q3ReadingTimeMs: 2940,
        minReadingTimeMs: 1880,
        maxReadingTimeMs: 3580
      },
      OSV: {
        meanReadingTimeMs: 3280,
        stdErrorMs: 112,
        accuracyPercent: 71.0,
        cognitiveLoadScore: 72.8,
        reactionTimeMs: 2680,
        medianReadingTimeMs: 3210,
        q1ReadingTimeMs: 2890,
        q3ReadingTimeMs: 3620,
        minReadingTimeMs: 2340,
        maxReadingTimeMs: 4420
      },
      SVO: {
        meanReadingTimeMs: 2890,
        stdErrorMs: 96,
        accuracyPercent: 77.2,
        cognitiveLoadScore: 63.5,
        reactionTimeMs: 2320,
        medianReadingTimeMs: 2840,
        q1ReadingTimeMs: 2560,
        q3ReadingTimeMs: 3190,
        minReadingTimeMs: 2050,
        maxReadingTimeMs: 3910
      },
      OVS: {
        meanReadingTimeMs: 3640,
        stdErrorMs: 130,
        accuracyPercent: 63.8,
        cognitiveLoadScore: 81.2,
        reactionTimeMs: 3050,
        medianReadingTimeMs: 3560,
        q1ReadingTimeMs: 3180,
        q3ReadingTimeMs: 4050,
        minReadingTimeMs: 2550,
        maxReadingTimeMs: 4890
      }
    }
  }
};

// Word-by-word reading time spillover curve (ms per position)
// Standard 6-word sentence: [W1: Subj/Obj] [W2: Mod] [W3: Arg2] [W4: Adv] [W5: Verb/Focus] [W6: End]
export const spilloverReadingCurves = [
  { position: 1, labelKk: 'W1 (Бастама)', labelEn: 'W1 (Onset)', sov: 310, osv: 390, svo: 320, ovs: 410 },
  { position: 2, labelKk: 'W2 (Анықтауыш)', labelEn: 'W2 (Modifier)', sov: 295, osv: 330, svo: 310, ovs: 360 },
  { position: 3, labelKk: 'W3 (Аргумент 2)', labelEn: 'W3 (Argument 2)', sov: 320, osv: 420, svo: 480, ovs: 510 },
  { position: 4, labelKk: 'W4 (Пысықтауыш)', labelEn: 'W4 (Adverbial)', sov: 330, osv: 380, svo: 410, ovs: 490 },
  { position: 5, labelKk: 'W5 (Баяндауыш/Түйін)', labelEn: 'W5 (Critical Verb)', sov: 380, osv: 490, svo: 540, ovs: 620 },
  { position: 6, labelKk: 'W6 (Сөйлем соңы)', labelEn: 'W6 (Wrap-up)', sov: 420, osv: 460, svo: 510, ovs: 580 }
];

// Simulated Event-Related Potential (ERP) Microvoltage Amplitude over Time (-100ms to 800ms)
// Demonstrates N400 negativity (semantic surprise) & P600 positivity (syntactic reanalysis)
export const erpWaveformData = [
  { timeMs: -100, sov: 0.2, osv: 0.1, svo: -0.1 },
  { timeMs: 0, sov: 0.0, osv: 0.0, svo: 0.0 },
  { timeMs: 100, sov: 1.2, osv: 1.4, svo: 1.1 }, // P100 sensory
  { timeMs: 180, sov: -1.0, osv: -1.3, svo: -1.2 }, // N100
  { timeMs: 250, sov: 0.4, osv: 0.6, svo: 0.2 },
  { timeMs: 350, sov: 0.1, osv: -0.8, svo: -3.6 }, // SVO N400 negative trough (semantic violation/mismatch)
  { timeMs: 420, sov: 0.3, osv: -0.5, svo: -3.8 },
  { timeMs: 500, sov: 0.8, osv: 2.1, svo: 0.2 },
  { timeMs: 600, sov: 1.1, osv: 3.9, svo: 4.8 }, // P600 peak (syntactic re-analysis for scrambled/contact orders!)
  { timeMs: 700, sov: 0.7, osv: 3.2, svo: 3.6 },
  { timeMs: 800, sov: 0.3, osv: 1.5, svo: 1.8 }
];

export const sampleParticipantProfiles = [
  {
    id: 'P-KZ-104',
    studentName: 'Айсұлтан Мұратұлы',
    name: 'Айсұлтан Мұратұлы',
    phoneNumber: '+7 (701) 456-78-90',
    age: 17,
    gender: 'male' as const,
    dominanceGroup: 'kazakh_dominant' as const,
    cefrLevel: 'C1' as const,
    primaryHomeLanguage: 'Қазақ тілі',
    educationLevel: 'high_school' as const,
    dailyKazakhUsagePercent: 90,
    selfRatedReadingProficiency: 5,
    createdAt: '2026-03-01'
  },
  {
    id: 'P-BI-219',
    studentName: 'Динара Сапарова',
    name: 'Динара Сапарова',
    phoneNumber: '+7 (777) 321-65-40',
    age: 16,
    gender: 'female' as const,
    dominanceGroup: 'bilingual_balanced' as const,
    cefrLevel: 'B2' as const,
    primaryHomeLanguage: 'Қазақша / Орысша',
    educationLevel: 'high_school' as const,
    dailyKazakhUsagePercent: 55,
    selfRatedReadingProficiency: 4,
    createdAt: '2026-03-02'
  },
  {
    id: 'P-L2-308',
    studentName: 'Алексей Васильев',
    name: 'Алексей Васильев',
    phoneNumber: '+7 (705) 890-12-34',
    age: 18,
    gender: 'male' as const,
    dominanceGroup: 'kazakh_l2' as const,
    cefrLevel: 'A2' as const,
    primaryHomeLanguage: 'Орыс тілі',
    educationLevel: 'high_school' as const,
    dailyKazakhUsagePercent: 20,
    selfRatedReadingProficiency: 3,
    createdAt: '2026-03-04'
  }
];
