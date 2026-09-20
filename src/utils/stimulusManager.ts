import { StimulusSentence, WordOrderCondition, CEFRLevel, LanguageCode } from '../types';
import { generateExpandedStimuliBattery } from '../data/stimuliGenerator';

// Cached singleton pool of the complete 120-stimulus scientific battery
let cachedStimuliPool: StimulusSentence[] | null = null;

export function getAllStimuli(): StimulusSentence[] {
  if (!cachedStimuliPool || cachedStimuliPool.length < 120) {
    cachedStimuliPool = generateExpandedStimuliBattery();
  }
  return [...cachedStimuliPool];
}

/**
 * Robust Fisher-Yates shuffle algorithm returning a new shuffled array
 */
export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Filter stimuli by CEFR level and/or Word Order with automatic deduplication
 */
export function getFilteredStimuli(options: {
  cefrLevel?: string;
  wordOrder?: WordOrderCondition;
  stimuliPool?: StimulusSentence[];
}): StimulusSentence[] {
  const pool = options.stimuliPool && options.stimuliPool.length > 0 
    ? options.stimuliPool 
    : getAllStimuli();

  let filtered = pool;

  if (options.cefrLevel && options.cefrLevel !== 'ALL') {
    filtered = filtered.filter(s => s.cefrLevel === options.cefrLevel);
  }

  if (options.wordOrder) {
    filtered = filtered.filter(s => s.wordOrder === options.wordOrder);
  }

  // Deduplicate by sentenceKazakh text so identical strings never appear
  const seenSentences = new Set<string>();
  const deduplicated: StimulusSentence[] = [];

  for (const s of filtered) {
    const normalized = s.sentenceKazakh.trim().toLowerCase();
    if (!seenSentences.has(normalized)) {
      seenSentences.add(normalized);
      deduplicated.push(s);
    }
  }

  return deduplicated.length > 0 ? deduplicated : pool;
}

/**
 * Dynamically picks a random stimulus matching the given word order (and optional CEFR),
 * guaranteeing it is different from the currently displayed stimulus (excludeId / excludeSentence).
 */
export function getRandomStimulusByWordOrder(
  order: WordOrderCondition,
  excludeSentenceOrId?: string,
  cefrLevel?: string
): StimulusSentence {
  const pool = getAllStimuli();
  let matching = pool.filter(s => s.wordOrder === order);

  if (cefrLevel && cefrLevel !== 'ALL') {
    const cefrMatching = matching.filter(s => s.cefrLevel === cefrLevel);
    if (cefrMatching.length > 0) {
      matching = cefrMatching;
    }
  }

  // Filter out the current item if alternatives exist
  if (excludeSentenceOrId && matching.length > 1) {
    const filtered = matching.filter(
      s => s.id !== excludeSentenceOrId && s.sentenceKazakh !== excludeSentenceOrId
    );
    if (filtered.length > 0) {
      matching = filtered;
    }
  }

  const randomIndex = Math.floor(Math.random() * matching.length);
  return matching[randomIndex] || matching[0] || pool[0];
}

/**
 * Generates a randomized, strictly non-repeating stimulus queue for a test session
 */
export function generateNonRepeatingSessionQueue(options: {
  cefrLevel?: string;
  targetCount?: number;
  stimuliPool?: StimulusSentence[];
}): StimulusSentence[] {
  const pool = options.stimuliPool && options.stimuliPool.length > 0
    ? options.stimuliPool
    : getAllStimuli();

  // 1. Filter by CEFR if chosen
  let candidates: StimulusSentence[] = [];
  if (options.cefrLevel && options.cefrLevel !== 'ALL') {
    candidates = pool.filter(s => s.cefrLevel === options.cefrLevel);
  }

  if (candidates.length === 0) {
    candidates = [...pool];
  }

  // 2. Deduplicate strictly by sentence text to eliminate any duplicates
  const seenSentences = new Set<string>();
  const uniquePool: StimulusSentence[] = [];
  for (const item of candidates) {
    const key = item.sentenceKazakh.trim().toLowerCase();
    if (!seenSentences.has(key)) {
      seenSentences.add(key);
      uniquePool.push(item);
    }
  }

  // 3. Shuffle thoroughly using Fisher-Yates
  const shuffled = shuffleArray(uniquePool);

  // 4. Return slice or all
  if (options.targetCount && options.targetCount > 0 && options.targetCount < shuffled.length) {
    return shuffled.slice(0, options.targetCount);
  }

  return shuffled;
}

/**
 * Dynamic psycholinguistic analysis generator for any given stimulus sentence
 */
export function getStimulusPsycholinguisticProfile(
  stimulus: StimulusSentence,
  lang: LanguageCode
) {
  const order = stimulus.wordOrder;
  const cefr = stimulus.cefrLevel;
  const words = stimulus.words || stimulus.sentenceKazakh.trim().split(/\s+/);
  const wordCount = words.length;

  // Reading latency estimation based on word count, CEFR, and word order penalty
  let baseRtMs = 1520;
  if (order === 'SOV') baseRtMs = 1620;
  else if (order === 'OSV') baseRtMs = 1980;
  else if (order === 'SVO') baseRtMs = 2280;
  else if (order === 'OVS') baseRtMs = 2460;

  // Scale with word count
  const adjustedRtMs = Math.round(baseRtMs + (wordCount - 4) * 110);

  // Localized explanations
  let explanation = '';
  let estimatedRt = `~${adjustedRtMs} ms`;
  let memoryLoad = '';
  let loadBadgeColor = '';
  let parsingPrediction = '';

  if (order === 'SOV') {
    explanation = lang === 'kk'
      ? `Канондық сөз тәртібі (SOV). Бастауыш пен толықтауыш табиғи ретпен орналасқан. Базалық оқу латенттілігімен (~${adjustedRtMs} мс) өңделеді, синтаксистік интеграция құны минималды.`
      : lang === 'ru'
      ? `Канонический порядок (SOV). Подлежащее и объект находятся в естественной позиции. Базовая латентность чтения (~${adjustedRtMs} мс), минимальная стоимость интеграции.`
      : `Canonical head-final order (SOV). Subject and object in natural baseline sequence. Baseline reading latency (~${adjustedRtMs} ms) with minimal syntactic integration cost.`;
    estimatedRt = `~${adjustedRtMs} ms (Базалық)`;
    memoryLoad = lang === 'kk' ? 'Минималды (Базалық)' : lang === 'ru' ? 'Минимальная' : 'Minimal (Baseline)';
    loadBadgeColor = 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800';
    parsingPrediction = lang === 'kk' 
      ? 'Канондық базалық парсинг / Минималды синтаксистік интеграция'
      : lang === 'ru'
      ? 'Базовый канонический парсинг / Минимальная стоимость интеграции'
      : 'Baseline canonical parsing / Minimal integration cost';
  } else if (order === 'OSV') {
    explanation = lang === 'kk'
      ? `Скремблинг (Топикализация, OSV). Толықтауыш сөйлемнің басына шығарылған. Табыс септігі синтаксистік рөлді нақтылағанымен, бастауыш келгенше объектіні жадта ұстап тұру оқу уақытын 20-25%-ға (+360 мс) ұзартады.`
      : lang === 'ru'
      ? `Скремблинг (топикализация, OSV). Объект вынесен в начало. Морфологический винительный падеж снимает неоднозначность, но буферизация объекта в памяти увеличивает латентность на 20-25% (+360 мс).`
      : `Topicalized object fronting (OSV). Morphological accusative marking resolves grammatical role, but working memory buffering increases reading latency by 20-25% (+360 ms).`;
    estimatedRt = `~${adjustedRtMs} ms (+360ms)`;
    memoryLoad = lang === 'kk' ? 'Орташа (Буферлеу)' : lang === 'ru' ? 'Умеренная' : 'Moderate (Buffering)';
    loadBadgeColor = 'text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 border-teal-200 dark:border-teal-800';
    parsingPrediction = lang === 'kk'
      ? 'Синтаксистік қайта талдау (P600) / Жұмыс жадының кідірісі'
      : lang === 'ru'
      ? 'Синтаксический пересчет (P600) / Буферизация объекта в памяти'
      : 'Syntactic reanalysis load (P600) / Working memory buffering latency';
  } else if (order === 'SVO') {
    explanation = lang === 'kk'
      ? `Контактілі сөз тәртібі (SVO). Баяндауыштан кейін толықтауыштың келуі L1 сөйлеушілерде күтпеген кідіріс туғызады (~+660 мс), ал теңгерімді билингвтерде орыс тілінің әсерінен кросс-лингвистикалық прайминг арқылы жеңіл өңделеді.`
      : lang === 'ru'
      ? `Контактный порядок (SVO). Пост-вербальный объект вызывает когнитивное удивление у носителей L1 (~+660 мс), но облегчается кросс-лингвистическим праймингом у билингвов.`
      : `Contact-induced post-verbal complement (SVO). Triggers syntactic surprise in Kazakh L1 speakers (~+660 ms), but facilitates via cross-linguistic priming in Russian-Kazakh bilinguals.`;
    estimatedRt = `~${adjustedRtMs} ms (+660ms)`;
    memoryLoad = lang === 'kk' ? 'Жоғарылатылған (Прайминг)' : lang === 'ru' ? 'Повышенная' : 'Elevated (Priming)';
    loadBadgeColor = 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800';
    parsingPrediction = lang === 'kk'
      ? 'Кросс-лингвистикалық прайминг эффектісі / Билингвалды дифференциация'
      : lang === 'ru'
      ? 'Эффект кросс-лингвистического прайминга / Билингвальная дифференциация'
      : 'Cross-linguistic priming effect / Bilingual facilitation';
  } else {
    explanation = lang === 'kk'
      ? `Фокусталған аударылған құрылым (OVS). Бастауыш сөйлемнің соңында келгендіктен, респонденттер бүкіл синтаксистік тармақты басынан қайта құруға мәжбүр болады (ең жоғары латенттілік ~+840 мс).`
      : lang === 'ru'
      ? `Фокусированный инверсивный порядок (OVS). Позднее распознавание агента требует полного ретроактивного пересчета синтаксического дерева (пиковая задержка ~+840 мс).`
      : `Focalized inverted order (OVS). Delayed agent identification forces retroactive re-parsing, eliciting peak behavioral latencies (~+840 ms).`;
    estimatedRt = `~${adjustedRtMs} ms (+840ms)`;
    memoryLoad = lang === 'kk' ? 'Жоғары (Ретроактивті)' : lang === 'ru' ? 'Высокая' : 'High (Retroactive)';
    loadBadgeColor = 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800';
    parsingPrediction = lang === 'kk'
      ? 'Ретроактивті қайта құру (Retroactive Re-parsing) / Максималды кідіріс'
      : lang === 'ru'
      ? 'Ретроактивный пересчет структуры / Максимальная латентность'
      : 'Retroactive structure re-parsing / Maximum behavioral delay';
  }

  // Morphological gloss
  const gloss = stimulus.morphologicalGloss || words.map((w, idx) => {
    if (idx === 0) return `${w}-SUBJ`;
    if (idx === words.length - 1) return `${w}-VERB.PST`;
    return `${w}-MOD`;
  }).join(' + ');

  return {
    sentence: stimulus.sentenceKazakh,
    translit: stimulus.transliterationLatin,
    gloss,
    explanation,
    estimatedRt,
    memoryLoad,
    loadBadgeColor,
    parsingPrediction,
    cefr: stimulus.cefrLevel,
    id: stimulus.id,
    wordOrder: stimulus.wordOrder
  };
}
