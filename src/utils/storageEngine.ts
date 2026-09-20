import { StoredTestRecord, DetailedResponseItem, LanguageDominanceGroup, WordOrderCondition, CEFRLevel } from '../types';

const STORAGE_KEY = 'lingualyze_test_database_v1';
const DB_CHANGE_EVENT = 'lingualyze_db_updated';

// Helper to generate UUID v4
export const generateUUID = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// Initial Seed Dataset for research benchmarks
const INITIAL_SEED_RECORDS: StoredTestRecord[] = [
  {
    test_id: '550e8400-e29b-41d4-a716-446655440001',
    participant_id: 'P-KZ-104',
    student_name: 'Әлихан Нұрланұлы',
    phone_number: '+7 (701) 234-56-78',
    age: 19,
    cohort: 'kazakh_dominant',
    timestamp: '2026-03-05T09:30:00.000Z',
    word_order: 'SOV',
    reading_time_ms: 1540,
    reaction_time_ms: 1420,
    accuracy_score: 100,
    cefr_level: 'B1',
    detailed_responses: [
      {
        stimulus_id: 'stim-b1-01',
        sentence_kazakh: 'Студенттер жаңа кітапханадан сирек қолжазбаларды мұқият оқыды.',
        word_order: 'SOV',
        cefr_level: 'B1',
        reading_time_ms: 1540,
        reaction_time_ms: 1420,
        part1_correct: true,
        part2_correct: true,
        part3_correct: true,
        is_overall_correct: true,
        selected_choice: 'opt-a'
      }
    ],
    notes: 'Canonical SOV - High fluency and immediate parsing'
  },
  {
    test_id: '550e8400-e29b-41d4-a716-446655440002',
    participant_id: 'P-KZ-104',
    student_name: 'Әлихан Нұрланұлы',
    phone_number: '+7 (701) 234-56-78',
    age: 19,
    cohort: 'kazakh_dominant',
    timestamp: '2026-03-05T09:32:15.000Z',
    word_order: 'OSV',
    reading_time_ms: 1880,
    reaction_time_ms: 1720,
    accuracy_score: 100,
    cefr_level: 'B1',
    detailed_responses: [
      {
        stimulus_id: 'stim-b1-02',
        sentence_kazakh: 'Сирек қолжазбаларды студенттер жаңа кітапханадан мұқият оқыды.',
        word_order: 'OSV',
        cefr_level: 'B1',
        reading_time_ms: 1880,
        reaction_time_ms: 1720,
        part1_correct: true,
        part2_correct: true,
        part3_correct: true,
        is_overall_correct: true,
        selected_choice: 'opt-a'
      }
    ],
    notes: 'Scrambled topicalization - working memory buffering observed'
  },
  {
    test_id: '550e8400-e29b-41d4-a716-446655440003',
    participant_id: 'P-BI-219',
    student_name: 'Аружан Серікқызы',
    phone_number: '+7 (777) 987-65-43',
    age: 21,
    cohort: 'bilingual_balanced',
    timestamp: '2026-03-05T11:15:20.000Z',
    word_order: 'SVO',
    reading_time_ms: 2210,
    reaction_time_ms: 1980,
    accuracy_score: 100,
    cefr_level: 'A2',
    detailed_responses: [
      {
        stimulus_id: 'stim-a2-01',
        sentence_kazakh: 'Мұғалім түсіндірді қиын ережені оқушыларға.',
        word_order: 'SVO',
        cefr_level: 'A2',
        reading_time_ms: 2210,
        reaction_time_ms: 1980,
        part1_correct: true,
        part2_correct: true,
        part3_correct: true,
        is_overall_correct: true,
        selected_choice: 'opt-a'
      }
    ],
    notes: 'Bilingual balanced - Russian contact order facilitatory effect'
  },
  {
    test_id: '550e8400-e29b-41d4-a716-446655440004',
    participant_id: 'P-L2-302',
    student_name: 'Дмитрий Иванов',
    phone_number: '+7 (705) 555-43-21',
    age: 24,
    cohort: 'kazakh_l2',
    timestamp: '2026-03-05T14:40:10.000Z',
    word_order: 'OVS',
    reading_time_ms: 2680,
    reaction_time_ms: 2450,
    accuracy_score: 66.7,
    cefr_level: 'B2',
    detailed_responses: [
      {
        stimulus_id: 'stim-b2-02',
        sentence_kazakh: 'Қорытынды баяндаманы тыңдады министр кеңесте.',
        word_order: 'OVS',
        cefr_level: 'B2',
        reading_time_ms: 2680,
        reaction_time_ms: 2450,
        part1_correct: false,
        part2_correct: true,
        part3_correct: false,
        is_overall_correct: false,
        selected_choice: 'opt-b',
        error_type: 'Syntactic inversion misparsing'
      }
    ],
    notes: 'L2 participant - Delayed agent recovery in focalized OVS'
  }
];

/**
 * Storage Engine Class providing local persistence, validation, and analytics export
 */
class StorageEngine {
  private cache: StoredTestRecord[] | null = null;
  private isSyncing = false;

  constructor() {
    this.initialize();
    if (typeof window !== 'undefined') {
      this.syncWithCentralBackend();
      window.addEventListener('focus', () => this.syncWithCentralBackend());
    }
  }

  private initialize(): void {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        // Initialize with default research seeds
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEED_RECORDS));
        this.cache = [...INITIAL_SEED_RECORDS];
      } else {
        const parsed = JSON.parse(stored);
        const { cleanRecords } = this.deduplicateAndSanitize(parsed);
        this.cache = cleanRecords;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanRecords));
      }
    } catch (err) {
      console.warn('LocalStorage unavailable, using in-memory storage fallback:', err);
      this.cache = [...INITIAL_SEED_RECORDS];
    }
  }

  /**
   * Deduplicates and cleanses corrupted records
   */
  public deduplicateAndSanitize(records: StoredTestRecord[]): {
    cleanRecords: StoredTestRecord[];
    duplicatesRemoved: number;
    corruptedRemoved: number;
  } {
    const seenIds = new Set<string>();
    const cleanRecords: StoredTestRecord[] = [];
    let duplicatesRemoved = 0;
    let corruptedRemoved = 0;

    for (const record of records) {
      // Corrupted if no test_id or participant_id or invalid reading time
      if (
        !record.test_id ||
        !record.participant_id ||
        typeof record.reading_time_ms !== 'number' ||
        isNaN(record.reading_time_ms) ||
        record.reading_time_ms <= 0
      ) {
        corruptedRemoved++;
        continue;
      }

      if (seenIds.has(record.test_id)) {
        duplicatesRemoved++;
        continue;
      }

      seenIds.add(record.test_id);
      cleanRecords.push(record);
    }

    return { cleanRecords, duplicatesRemoved, corruptedRemoved };
  }

  /**
   * Sync with centralized Express API backend
   */
  public async syncWithCentralBackend(): Promise<void> {
    if (typeof window === 'undefined' || this.isSyncing) return;
    this.isSyncing = true;
    try {
      const res = await fetch('/api/records');
      if (res.ok) {
        const data = await res.json();
        if (data.records && Array.isArray(data.records)) {
          const { cleanRecords } = this.deduplicateAndSanitize(data.records);
          this.cache = cleanRecords;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanRecords));
          this.notifyUpdate();
        }
      }
    } catch (err) {
      // Backend may be offline or in development start phase
    } finally {
      this.isSyncing = false;
    }
  }

  private notifyUpdate(): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(DB_CHANGE_EVENT));
    }
  }

  /**
   * Retrieve all test sessions
   */
  public getAllSessions(): StoredTestRecord[] {
    if (!this.cache) {
      this.initialize();
    }
    return this.cache ? [...this.cache] : [];
  }

  /**
   * Save a completed test session to the persistent engine and central API
   */
  public saveSession(record: StoredTestRecord): boolean {
    try {
      const sessions = this.getAllSessions();
      const finalRecord: StoredTestRecord = {
        ...record,
        test_id: record.test_id || generateUUID(),
        timestamp: record.timestamp || new Date().toISOString()
      };

      const updated = [finalRecord, ...sessions];
      const { cleanRecords } = this.deduplicateAndSanitize(updated);
      this.cache = cleanRecords;

      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanRecords));
      }
      this.notifyUpdate();

      // Asynchronously push to centralized backend
      fetch('/api/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalRecord)
      }).catch(err => {
        console.warn('Centralized API push failed, cached locally:', err);
      });

      return true;
    } catch (err) {
      console.error('Failed to persist test session:', err);
      return false;
    }
  }

  /**
   * Delete a session by test_id (Admin only)
   */
  public deleteSession(testId: string): boolean {
    try {
      const sessions = this.getAllSessions();
      const filtered = sessions.filter(s => s.test_id !== testId);
      this.cache = filtered;

      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      }
      this.notifyUpdate();

      // Asynchronously delete on central backend
      fetch(`/api/records/${testId}`, { method: 'DELETE' }).catch(err => {
        console.warn('Centralized API delete failed:', err);
      });

      return true;
    } catch (err) {
      console.error('Failed to delete test session:', err);
      return false;
    }
  }

  /**
   * Clean up duplicates and corrupted records (Admin utility)
   */
  public async cleanupDuplicatesAndCorrupted(): Promise<{
    duplicatesRemoved: number;
    corruptedRemoved: number;
    totalClean: number;
  }> {
    const sessions = this.getAllSessions();
    const { cleanRecords, duplicatesRemoved, corruptedRemoved } = this.deduplicateAndSanitize(sessions);
    this.cache = cleanRecords;
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanRecords));
    }
    this.notifyUpdate();

    try {
      await fetch('/api/records/cleanup', { method: 'POST' });
    } catch {
      // offline fallback
    }

    return {
      duplicatesRemoved,
      corruptedRemoved,
      totalClean: cleanRecords.length
    };
  }

  /**
   * Reset / Clear all stored sessions (Admin only)
   */
  public clearAllSessions(): boolean {
    try {
      this.cache = [];
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      }
      this.notifyUpdate();
      return true;
    } catch (err) {
      console.error('Failed to clear sessions:', err);
      return false;
    }
  }

  /**
   * Restore initial benchmark dataset (Admin helper)
   */
  public resetToSeeds(): boolean {
    try {
      this.cache = [...INITIAL_SEED_RECORDS];
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEED_RECORDS));
      }
      this.notifyUpdate();

      fetch('/api/records/reset', { method: 'POST' }).catch(() => {});
      return true;
    } catch (err) {
      console.error('Failed to reset seeds:', err);
      return false;
    }
  }

  /**
   * Aggregate statistics of the database
   */
  public getStats() {
    const sessions = this.getAllSessions();
    const totalRecords = sessions.length;
    const participants = new Set(sessions.map(s => s.participant_id));
    const avgAccuracy = totalRecords > 0
      ? Math.round(sessions.reduce((sum, s) => sum + s.accuracy_score, 0) / totalRecords)
      : 0;
    const avgReadingTimeMs = totalRecords > 0
      ? Math.round(sessions.reduce((sum, s) => sum + s.reading_time_ms, 0) / totalRecords)
      : 0;
    const avgReactionTimeMs = totalRecords > 0
      ? Math.round(sessions.reduce((sum, s) => sum + s.reaction_time_ms, 0) / totalRecords)
      : 0;

    let storageSizeBytes = 0;
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem(STORAGE_KEY) || '';
      storageSizeBytes = new Blob([raw]).size;
    }

    return {
      totalRecords,
      totalParticipants: participants.size,
      avgAccuracy,
      avgReadingTimeMs,
      avgReactionTimeMs,
      storageSizeBytes
    };
  }

  /**
   * Export all records as standard Research CSV
   */
  public exportCsv(filename = `lingualyze_database_${Date.now()}.csv`): void {
    const sessions = this.getAllSessions();
    const headers = [
      'test_id',
      'participant_id',
      'student_name',
      'phone_number',
      'age',
      'cohort',
      'timestamp',
      'word_order',
      'reading_time_ms',
      'reaction_time_ms',
      'accuracy_score',
      'cefr_level',
      'stimulus_id',
      'part1_correct',
      'part2_correct',
      'part3_correct',
      'is_overall_correct',
      'notes'
    ];

    const rows: string[][] = [];
    sessions.forEach(s => {
      const studentName = `"${(s.student_name || 'N/A').replace(/"/g, '""')}"`;
      const phoneNum = `"${(s.phone_number || 'N/A').replace(/"/g, '""')}"`;
      const ageStr = s.age !== undefined ? s.age.toString() : 'N/A';

      if (s.detailed_responses && s.detailed_responses.length > 0) {
        s.detailed_responses.forEach(detail => {
          rows.push([
            s.test_id,
            s.participant_id,
            studentName,
            phoneNum,
            ageStr,
            s.cohort,
            s.timestamp,
            s.word_order,
            s.reading_time_ms.toString(),
            s.reaction_time_ms.toString(),
            s.accuracy_score.toString(),
            s.cefr_level || detail.cefr_level || 'A1',
            detail.stimulus_id,
            detail.part1_correct ? '1' : '0',
            detail.part2_correct ? '1' : '0',
            detail.part3_correct ? '1' : '0',
            detail.is_overall_correct ? '1' : '0',
            `"${(s.notes || '').replace(/"/g, '""')}"`
          ]);
        });
      } else {
        rows.push([
          s.test_id,
          s.participant_id,
          studentName,
          phoneNum,
          ageStr,
          s.cohort,
          s.timestamp,
          s.word_order,
          s.reading_time_ms.toString(),
          s.reaction_time_ms.toString(),
          s.accuracy_score.toString(),
          s.cefr_level || 'A1',
          'N/A',
          'N/A',
          'N/A',
          'N/A',
          '1',
          `"${(s.notes || '').replace(/"/g, '""')}"`
        ]);
      }
    });

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Export all records as structured JSON
   */
  public exportJson(filename = `lingualyze_database_${Date.now()}.json`): void {
    const sessions = this.getAllSessions();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(sessions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', filename);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }
}

export const storageEngine = new StorageEngine();
export { DB_CHANGE_EVENT };
