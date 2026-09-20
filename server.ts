import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

// Centralized in-memory store for research records with benchmark seeds
interface StoredTestRecord {
  test_id: string;
  participant_id: string;
  student_name?: string;
  phone_number?: string;
  age?: number;
  cohort: string;
  timestamp: string;
  word_order: string;
  reading_time_ms: number;
  reaction_time_ms: number;
  accuracy_score: number;
  detailed_responses: any[];
  cefr_level?: string;
  notes?: string;
}

const INITIAL_BENCHMARK_RECORDS: StoredTestRecord[] = [
  {
    test_id: "550e8400-e29b-41d4-a716-446655440001",
    participant_id: "P-KZ-104",
    student_name: "Әлихан Нұрланұлы",
    phone_number: "+7 (701) 234-56-78",
    age: 19,
    cohort: "kazakh_dominant",
    timestamp: "2026-03-05T09:30:00.000Z",
    word_order: "SOV",
    reading_time_ms: 1540,
    reaction_time_ms: 1420,
    accuracy_score: 100,
    cefr_level: "B1",
    detailed_responses: [
      {
        stimulus_id: "stim-b1-01",
        sentence_kazakh: "Студенттер жаңа кітапханадан сирек қолжазбаларды мұқият оқыды.",
        word_order: "SOV",
        cefr_level: "B1",
        reading_time_ms: 1540,
        reaction_time_ms: 1420,
        part1_correct: true,
        part2_correct: true,
        part3_correct: true,
        is_overall_correct: true,
        selected_choice: "opt-a"
      }
    ],
    notes: "Canonical SOV - High fluency and baseline cognitive integration"
  },
  {
    test_id: "550e8400-e29b-41d4-a716-446655440002",
    participant_id: "P-KZ-104",
    student_name: "Әлихан Нұрланұлы",
    phone_number: "+7 (701) 234-56-78",
    age: 19,
    cohort: "kazakh_dominant",
    timestamp: "2026-03-05T09:32:15.000Z",
    word_order: "OSV",
    reading_time_ms: 1880,
    reaction_time_ms: 1720,
    accuracy_score: 100,
    cefr_level: "B1",
    detailed_responses: [
      {
        stimulus_id: "stim-b1-02",
        sentence_kazakh: "Сирек қолжазбаларды студенттер жаңа кітапханадан мұқият оқыды.",
        word_order: "OSV",
        cefr_level: "B1",
        reading_time_ms: 1880,
        reaction_time_ms: 1720,
        part1_correct: true,
        part2_correct: true,
        part3_correct: true,
        is_overall_correct: true,
        selected_choice: "opt-a"
      }
    ],
    notes: "Topicalized OSV - working memory buffering observed"
  },
  {
    test_id: "550e8400-e29b-41d4-a716-446655440003",
    participant_id: "P-BI-219",
    student_name: "Аружан Серікқызы",
    phone_number: "+7 (777) 987-65-43",
    age: 21,
    cohort: "bilingual_balanced",
    timestamp: "2026-03-05T11:15:20.000Z",
    word_order: "SVO",
    reading_time_ms: 2210,
    reaction_time_ms: 1980,
    accuracy_score: 100,
    cefr_level: "A2",
    detailed_responses: [
      {
        stimulus_id: "stim-a2-01",
        sentence_kazakh: "Мұғалім түсіндірді қиын ережені оқушыларға.",
        word_order: "SVO",
        cefr_level: "A2",
        reading_time_ms: 2210,
        reaction_time_ms: 1980,
        part1_correct: true,
        part2_correct: true,
        part3_correct: true,
        is_overall_correct: true,
        selected_choice: "opt-a"
      }
    ],
    notes: "Bilingual balanced - Russian contact order facilitation"
  },
  {
    test_id: "550e8400-e29b-41d4-a716-446655440004",
    participant_id: "P-L2-302",
    student_name: "Дмитрий Иванов",
    phone_number: "+7 (705) 555-43-21",
    age: 24,
    cohort: "kazakh_l2",
    timestamp: "2026-03-05T14:40:10.000Z",
    word_order: "OVS",
    reading_time_ms: 2680,
    reaction_time_ms: 2450,
    accuracy_score: 66.7,
    cefr_level: "B2",
    detailed_responses: [
      {
        stimulus_id: "stim-b2-02",
        sentence_kazakh: "Қорытынды баяндаманы тыңдады министр кеңесте.",
        word_order: "OVS",
        cefr_level: "B2",
        reading_time_ms: 2680,
        reaction_time_ms: 2450,
        part1_correct: false,
        part2_correct: true,
        part3_correct: false,
        is_overall_correct: false,
        selected_choice: "opt-b",
        error_type: "Syntactic inversion misparsing"
      }
    ],
    notes: "L2 participant - Delayed agent recovery in focalized OVS"
  }
];

let centralizedRecords: StoredTestRecord[] = [...INITIAL_BENCHMARK_RECORDS];

// Helper to sanitize and deduplicate records
function deduplicateAndSanitizeRecords(records: StoredTestRecord[]): {
  cleanRecords: StoredTestRecord[];
  duplicatesRemoved: number;
  corruptedRemoved: number;
} {
  const seenIds = new Set<string>();
  const cleanRecords: StoredTestRecord[] = [];
  let duplicatesRemoved = 0;
  let corruptedRemoved = 0;

  for (const record of records) {
    // Check corruption: must have test_id, participant_id, valid reading_time_ms
    if (
      !record.test_id ||
      !record.participant_id ||
      typeof record.reading_time_ms !== "number" ||
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

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // ================= API ROUTES =================

  // 1. Health check
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      service: "Lingualyze Centralized Backend",
      timestamp: new Date().toISOString(),
      recordsCount: centralizedRecords.length
    });
  });

  // 2. Authentication route
  app.post("/api/auth/login", (req, res) => {
    const { passcode } = req.body || {};
    const cleaned = (passcode || "").trim();

    if (cleaned === "23032011" || cleaned === "admin123") {
      res.json({
        success: true,
        role: "researcher",
        token: `lng_auth_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        message: "Authenticated as Scientist / Researcher"
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Invalid passcode. Access denied."
      });
    }
  });

  // 3. Centralized Test Records: GET all records
  app.get("/api/records", (_req, res) => {
    // Return sanitized & timestamp-sorted records
    const { cleanRecords } = deduplicateAndSanitizeRecords(centralizedRecords);
    centralizedRecords = cleanRecords;
    cleanRecords.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    res.json({
      success: true,
      total: cleanRecords.length,
      records: cleanRecords
    });
  });

  // 4. Centralized Test Records: POST save a session
  app.post("/api/records", (req, res) => {
    const newRecord: StoredTestRecord = req.body;

    if (!newRecord || !newRecord.participant_id) {
      return res.status(400).json({
        success: false,
        message: "Missing required participant_id or test record payload"
      });
    }

    // Ensure valid test_id and timestamp
    if (!newRecord.test_id) {
      newRecord.test_id = `rec-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    }
    if (!newRecord.timestamp) {
      newRecord.timestamp = new Date().toISOString();
    }

    // Deduplicate: replace existing record with same test_id or prepend
    const existingIndex = centralizedRecords.findIndex(r => r.test_id === newRecord.test_id);
    if (existingIndex >= 0) {
      centralizedRecords[existingIndex] = newRecord;
    } else {
      centralizedRecords.unshift(newRecord);
    }

    res.json({
      success: true,
      message: "Test session successfully recorded into centralized database",
      record: newRecord
    });
  });

  // 5. Centralized Test Records: DELETE a single record
  app.delete("/api/records/:id", (req, res) => {
    const { id } = req.params;
    const initialLen = centralizedRecords.length;
    centralizedRecords = centralizedRecords.filter(r => r.test_id !== id);

    if (centralizedRecords.length < initialLen) {
      res.json({
        success: true,
        message: `Record ${id} deleted successfully.`
      });
    } else {
      res.status(404).json({
        success: false,
        message: `Record ${id} not found.`
      });
    }
  });

  // 6. Centralized Test Records: POST cleanup duplicates and corrupted records
  app.post("/api/records/cleanup", (_req, res) => {
    const { cleanRecords, duplicatesRemoved, corruptedRemoved } =
      deduplicateAndSanitizeRecords(centralizedRecords);
    centralizedRecords = cleanRecords;

    res.json({
      success: true,
      message: "Database cleanup complete",
      duplicatesRemoved,
      corruptedRemoved,
      remainingCount: cleanRecords.length
    });
  });

  // 7. Centralized Test Records: POST reset to benchmark seed dataset
  app.post("/api/records/reset", (_req, res) => {
    centralizedRecords = [...INITIAL_BENCHMARK_RECORDS];
    res.json({
      success: true,
      message: "Database reset to benchmark scientific seeds",
      total: centralizedRecords.length
    });
  });

  // ================= VITE MIDDLEWARE / STATIC ASSETS =================

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Lingualyze server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to boot Lingualyze server:", err);
  process.exit(1);
});
