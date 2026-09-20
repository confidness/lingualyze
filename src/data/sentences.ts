import { StimulusSentence } from '../types';

export const initialStimulusSentences: StimulusSentence[] = [
  // ===================== A1 (Elementary) =====================
  {
    id: 'stim-a1-01',
    cefrLevel: 'A1',
    sentenceKazakh: 'Бала қызыл алманы тәбетпен жеді.',
    transliterationLatin: 'Bala qyzyl almany tábetpen jedi.',
    translationRu: 'Мальчик с аппетитом съел красное яблоко.',
    translationEn: 'The boy ate the red apple with appetite.',
    wordOrder: 'SOV',
    length: 'short',
    complexity: 'simple',
    predictability: 'high',
    wordCount: 5,
    words: ['Бала', 'қызыл', 'алманы', 'тәбетпен', 'жеді.'],
    morphologicalGloss: 'boy-NOM red apple-ACC appetite-INS eat-PST.3SG',
    syntacticFocus: 'Канондық SOV (Бастауыш - Анықтауыш - Толықтауыш - Баяндауыш).',
    question: {
      questionText: {
        kk: 'Осы сөйлемдегі сөздердің дұрыс тізбегі қандай?',
        ru: 'Какова правильная цепочка слов в этом предложении?',
        en: 'What is the correct word chain used in this sentence?'
      },
      options: [
        { id: 'opt-1', textKk: 'Бала → қызыл алманы → жеді', textRu: 'Бала → қызыл алманы → жеді', textEn: 'Boy → red apple → ate' },
        { id: 'opt-2', textKk: 'Алманы → жеді → бала', textRu: 'Алманы → жеді → бала', textEn: 'Apple → ate → boy' },
        { id: 'opt-3', textKk: 'Жеді → бала → қызыл алманы', textRu: 'Жеді → бала → қызыл алманы', textEn: 'Ate → boy → apple' }
      ],
      correctOptionId: 'opt-1',
      explanationKk: 'Сөйлемде алдымен бастауыш (Бала), кейін табыс септіктегі толықтауыш (алманы), соңында баяндауыш (жеді) орналасқан.',
      explanationRu: 'В предложении сначала идет подлежащее (Бала), затем прямое дополнение (алманы), в конце — сказуемое (жеді).',
      explanationEn: 'The sentence follows canonical Subject (Бала) → Object (алманы) → Verb (жеді).'
    },
    emojiChain: {
      items: [
        { id: 'e-boy', emoji: '👦', labelKk: 'Бала', labelRu: 'Мальчик', labelEn: 'Boy' },
        { id: 'e-apple', emoji: '🍎', labelKk: 'Қызыл алманы', labelRu: 'Красное яблоко', labelEn: 'Red apple' },
        { id: 'e-eat', emoji: '🍽️', labelKk: 'Жеді', labelRu: 'Съел', labelEn: 'Ate' }
      ],
      correctOrderIds: ['e-boy', 'e-apple', 'e-eat']
    },
    suffixContrast: {
      sentenceA: 'Бала алманы бақшаға апарды.',
      sentenceB: 'Бала алманы бақшадан әкелді.',
      highlightWordA: 'бақшаға',
      highlightWordB: 'бақшадан',
      suffixA: '-ға',
      suffixB: '-дан',
      targetQuestionText: {
        kk: 'Қай сөйлемде бала алманы бақшаның ішінен сыртқа алып шықты?',
        ru: 'В каком предложении мальчик вынес яблоко из сада?',
        en: 'In which sentence did the boy bring the apple out of the garden?'
      },
      correctSentence: 'B',
      explanationKk: '«Бақшадан» сөзі қозғалыстың бақшадан басталғанын/шыққанын білдіреді. Ал «бақшаға» бағытты білдіреді.',
      explanationRu: 'Слово «бақшадан» выражает исходную точку движения (из сада). «Бақшаға» обозначает направление (в сад).',
      explanationEn: 'The word "бақшадан" marks the origin point (out of garden), whereas "бақшаға" marks direction (to garden).'
    }
  },
  {
    id: 'stim-a1-02',
    cefrLevel: 'A1',
    sentenceKazakh: 'Тәтті сүтті мысық асықпай ішті.',
    transliterationLatin: 'Tátti sútti mysyq asyqpai ishti.',
    translationRu: 'Сладкое молоко кошка не спеша выпила.',
    translationEn: 'The sweet milk, the cat drank slowly.',
    wordOrder: 'OSV',
    length: 'short',
    complexity: 'simple',
    predictability: 'high',
    wordCount: 5,
    words: ['Тәтті', 'сүтті', 'мысық', 'асықпай', 'ішті.'],
    morphologicalGloss: 'sweet milk-ACC cat-NOM slowly drink-PST.3SG',
    syntacticFocus: 'Ауыспалы OSV (Толықтауыш бірінші орында).',
    question: {
      questionText: {
        kk: 'Осы сөйлемдегі сөздердің дұрыс тізбегі қандай?',
        ru: 'Какова правильная цепочка слов в этом предложении?',
        en: 'What is the correct word chain used in this sentence?'
      },
      options: [
        { id: 'opt-1', textKk: 'Тәтті сүтті → мысық → ішті', textRu: 'Тәтті сүтті → мысық → ішті', textEn: 'Sweet milk → cat → drank' },
        { id: 'opt-2', textKk: 'Мысық → тәтті сүтті → ішті', textRu: 'Мысық → тәтті сүтті → ішті', textEn: 'Cat → sweet milk → drank' },
        { id: 'opt-3', textKk: 'Ішті → мысық → сүтті', textRu: 'Ішті → мысық → сүтті', textEn: 'Drank → cat → milk' }
      ],
      correctOptionId: 'opt-1',
      explanationKk: 'Сөйлем толықтауыштан басталып (Тәтті сүтті), кейін бастауыш (мысық), соңында баяндауыш (ішті) келген.',
      explanationRu: 'Предложение начинается с дополнения (Тәтті сүтті), далее идет подлежащее (мысық) и сказуемое (ішті).',
      explanationEn: 'The sentence has fronted Object (Тәтті сүтті) → Subject (мысық) → Verb (ішті).'
    },
    emojiChain: {
      items: [
        { id: 'e-milk', emoji: '🥛', labelKk: 'Тәтті сүтті', labelRu: 'Сладкое молоко', labelEn: 'Sweet milk' },
        { id: 'e-cat', emoji: '🐈', labelKk: 'Мысық', labelRu: 'Кошка', labelEn: 'Cat' },
        { id: 'e-drink', emoji: '👅', labelKk: 'Ішті', labelRu: 'Выпила', labelEn: 'Drank' }
      ],
      correctOrderIds: ['e-milk', 'e-cat', 'e-drink']
    },
    suffixContrast: {
      sentenceA: 'Мысық сүтті тостағанға құйды.',
      sentenceB: 'Мысық сүтті тостағаннан ішті.',
      highlightWordA: 'тостағанға',
      highlightWordB: 'тостағаннан',
      suffixA: '-ға',
      suffixB: '-нан',
      targetQuestionText: {
        kk: 'Қай сөйлемде іс-әрекет ыдыстың ішінен сыртқа бағытталған?',
        ru: 'В каком предложении действие происходит из посуды?',
        en: 'In which sentence is milk consumed from the bowl?'
      },
      correctSentence: 'B',
      explanationKk: '«Тостағаннан» сөзі заттың қайдан алынғанын көрсетеді.',
      explanationRu: 'Слово «тостағаннан» показывает извлечение/питье из чаши.',
      explanationEn: 'The word "тостағаннан" indicates the source object from which milk was taken.'
    }
  },

  // ===================== A2 (Pre-Intermediate) =====================
  {
    id: 'stim-a2-01',
    cefrLevel: 'A2',
    sentenceKazakh: 'Әкесі балаға жаңа велосипед сатып алды.',
    transliterationLatin: 'Ákesi balaǵa jańa velosıped satyp aldy.',
    translationRu: 'Отец купил ребенку новый велосипед.',
    translationEn: 'The father bought a new bicycle for the child.',
    wordOrder: 'SOV',
    length: 'medium',
    complexity: 'simple',
    predictability: 'high',
    wordCount: 6,
    words: ['Әкесі', 'балаға', 'жаңа', 'велосипед', 'сатып', 'алды.'],
    morphologicalGloss: 'father-POSS.3SG child-DAT new bicycle buy-PST.3SG',
    syntacticFocus: 'Канондық SOV құрылымы және жанама толықтауыш (балаға - DAT).',
    question: {
      questionText: {
        kk: 'Осы сөйлемдегі сөздердің дұрыс тізбегі қандай?',
        ru: 'Какова правильная цепочка слов в этом предложении?',
        en: 'What is the correct word chain used in this sentence?'
      },
      options: [
        { id: 'opt-1', textKk: 'Әкесі → балаға → жаңа велосипед → сатып алды', textRu: 'Әкесі → балаға → жаңа велосипед → сатып алды', textEn: 'Father → for child → bicycle → bought' },
        { id: 'opt-2', textKk: 'Балаға → әкесі → сатып алды → велосипед', textRu: 'Балаға → әкесі → сатып алды → велосипед', textEn: 'For child → father → bought → bicycle' },
        { id: 'opt-3', textKk: 'Сатып алды → әкесі → балаға → велосипед', textRu: 'Сатып алды → әкесі → балаға → велосипед', textEn: 'Bought → father → for child → bicycle' }
      ],
      correctOptionId: 'opt-1',
      explanationKk: 'Дұрыс синтаксистік тізбек: Бастауыш (Әкесі) → Жанама толықтауыш (балаға) → Тікелей толықтауыш (жаңа велосипед) → Баяндауыш (сатып алды).',
      explanationRu: 'Правильный порядок: Подлежащее (Әкесі) → Косвенное дополнение (балаға) → Прямое дополнение (жаңа велосипед) → Сказуемое (сатып алды).',
      explanationEn: 'The order is Subject (Әкесі) → Indirect Object (балаға) → Direct Object (велосипед) → Predicate (сатып алды).'
    },
    emojiChain: {
      items: [
        { id: 'e-father', emoji: '👨', labelKk: 'Әкесі', labelRu: 'Отец', labelEn: 'Father' },
        { id: 'e-child', emoji: '👦', labelKk: 'Балаға', labelRu: 'Ребенку', labelEn: 'To child' },
        { id: 'e-bike', emoji: '🚲', labelKk: 'Велосипед алды', labelRu: 'Купил велосипед', labelEn: 'Bought bike' }
      ],
      correctOrderIds: ['e-father', 'e-child', 'e-bike']
    },
    suffixContrast: {
      sentenceA: 'Бала допты итке алды.',
      sentenceB: 'Бала допты иттен алды.',
      highlightWordA: 'итке',
      highlightWordB: 'иттен',
      suffixA: '-ке',
      suffixB: '-тен',
      targetQuestionText: {
        kk: 'Қай сөйлемде доп итке арналған немесе итке берілген?',
        ru: 'В каком предложении мяч предназначен для собаки?',
        en: 'In which sentence was the ball intended for the dog?'
      },
      correctSentence: 'A',
      explanationKk: '«Итке» сөзі іс-әрекеттің итке бағытталғанын және доптың итке арналғанын білдіреді. Ал «иттен» допты иттен алғанын білдіреді.',
      explanationRu: 'Слово «итке» означает, что мяч предназначен для собаки. Слово «иттен» означает, что мяч забрали у собаки.',
      explanationEn: 'The word "итке" marks the recipient (for the dog), whereas "иттен" marks the source (from the dog).'
    }
  },
  {
    id: 'stim-a2-02',
    cefrLevel: 'A2',
    sentenceKazakh: 'Қызықты ертегіні әжесі немересіне кешке оқып берді.',
    transliterationLatin: 'Qyzyqty ertegini ájesi nemeresine keshke oqyp berdi.',
    translationRu: 'Интересную сказку бабушка вечером прочитала внуку.',
    translationEn: 'The interesting fairy tale, the grandmother read to her grandson in the evening.',
    wordOrder: 'OSV',
    length: 'medium',
    complexity: 'simple',
    predictability: 'high',
    wordCount: 7,
    words: ['Қызықты', 'ертегіні', 'әжесі', 'немересіне', 'кешке', 'оқып', 'берді.'],
    morphologicalGloss: 'interesting fairy.tale-ACC grandmother-POSS.3SG grandson-POSS.3SG-DAT evening read give-PST.3SG',
    syntacticFocus: 'OSV: Нысан алға шыққан (Topic fronting).',
    question: {
      questionText: {
        kk: 'Осы сөйлемдегі сөздердің дұрыс тізбегі қандай?',
        ru: 'Какова правильная цепочка слов в этом предложении?',
        en: 'What is the correct word chain used in this sentence?'
      },
      options: [
        { id: 'opt-1', textKk: 'Қызықты ертегіні → әжесі → немересіне → оқып берді', textRu: 'Қызықты ертегіні → әжесі → немересіне → оқып берді', textEn: 'Interesting tale → grandmother → to grandson → read' },
        { id: 'opt-2', textKk: 'Әжесі → қызықты ертегіні → немересіне → оқып берді', textRu: 'Әжесі → қызықты ертегіні → немересіне → оқып берді', textEn: 'Grandmother → interesting tale → to grandson → read' },
        { id: 'opt-3', textKk: 'Немересіне → оқып берді → әжесі → ертегіні', textRu: 'Немересіне → оқып берді → әжесі → ертегіні', textEn: 'To grandson → read → grandmother → tale' }
      ],
      correctOptionId: 'opt-1',
      explanationKk: 'Сөйлемде «Қызықты ертегіні» бірінші келіп, соңынан «әжесі» бастауышы тұр.',
      explanationRu: 'Предложение начинается с «Қызықты ертегіні», за ним следует подлежащее «әжесі».',
      explanationEn: 'The object "Қызықты ертегіні" precedes subject "әжесі".'
    },
    emojiChain: {
      items: [
        { id: 'e-book', emoji: '📖', labelKk: 'Ертегіні', labelRu: 'Сказку', labelEn: 'Tale' },
        { id: 'e-grandma', emoji: '👵', labelKk: 'Әжесі', labelRu: 'Бабушка', labelEn: 'Grandmother' },
        { id: 'e-read', emoji: '👦', labelKk: 'Немересіне оқыды', labelRu: 'Прочитала внуку', labelEn: 'Read to grandson' }
      ],
      correctOrderIds: ['e-book', 'e-grandma', 'e-read']
    },
    suffixContrast: {
      sentenceA: 'Әжесі хатты қалаға жіберді.',
      sentenceB: 'Әжесі хатты қаладан алды.',
      highlightWordA: 'қалаға',
      highlightWordB: 'қаладан',
      suffixA: '-ға',
      suffixB: '-дан',
      targetQuestionText: {
        kk: 'Қай сөйлемде хат қаладан алынған немесе қаладан келген?',
        ru: 'В каком предложении письмо пришло из города?',
        en: 'In which sentence was the letter received from the city?'
      },
      correctSentence: 'B',
      explanationKk: '«Қаладан» сөзі хаттың қаладан жіберілгенін, яғни қаладан келгенін білдіреді.',
      explanationRu: 'Слово «қаладан» показывает получение письма из города.',
      explanationEn: 'The word "қаладан" confirms the letter originated from the city.'
    }
  },

  // ===================== B1 (Intermediate) =====================
  {
    id: 'stim-b1-01',
    cefrLevel: 'B1',
    sentenceKazakh: 'Мұғалім жаңа оқулықты кітапханадан алды.',
    transliterationLatin: 'Muǵalim jańa oqulyqty kitaphanadan aldy.',
    translationRu: 'Учитель взял новый учебник из библиотеки.',
    translationEn: 'The teacher took the new textbook from the library.',
    wordOrder: 'SOV',
    length: 'short',
    complexity: 'simple',
    predictability: 'high',
    wordCount: 5,
    words: ['Мұғалім', 'жаңа', 'оқулықты', 'кітапханадан', 'алды.'],
    morphologicalGloss: 'teacher-NOM new textbook-ACC library-ABL take-PST.3SG',
    syntacticFocus: 'Канондық SOV (Бастауыш - Толықтауыш - Пысықтауыш - Баяндауыш).',
    question: {
      questionText: {
        kk: 'Осы сөйлемдегі сөздердің дұрыс тізбегі қандай?',
        ru: 'Какова правильная цепочка слов в этом предложении?',
        en: 'What is the correct word chain used in this sentence?'
      },
      options: [
        { id: 'opt-1', textKk: 'Мұғалім → жаңа оқулықты → кітапханадан → алды', textRu: 'Мұғалім → жаңа оқулықты → кітапханадан → алды', textEn: 'Teacher → new textbook → from library → took' },
        { id: 'opt-2', textKk: 'Кітапханадан → мұғалім → жаңа оқулықты → алды', textRu: 'Кітапханадан → мұғалім → оқулықты → алды', textEn: 'From library → teacher → textbook → took' },
        { id: 'opt-3', textKk: 'Жаңа оқулықты → алды → мұғалім → кітапханадан', textRu: 'Жаңа оқулықты → алды → мұғалім → кітапханадан', textEn: 'New textbook → took → teacher → from library' }
      ],
      correctOptionId: 'opt-1',
      explanationKk: 'Сөйлемде бастауыш (Мұғалім), нысан (оқулықты), мекен пысықтауыш (кітапханадан) және баяндауыш (алды) бірізді орналасқан.',
      explanationRu: 'Порядок слов: Подлежащее (Мұғалім) → Дополнение (оқулықты) → Обстоятельство (кітапханадан) → Сказуемое (алды).',
      explanationEn: 'Canonical Subject → Object → Adverbial → Verb structure.'
    },
    emojiChain: {
      items: [
        { id: 'e-teacher', emoji: '👨‍🏫', labelKk: 'Мұғалім', labelRu: 'Учитель', labelEn: 'Teacher' },
        { id: 'e-book', emoji: '📚', labelKk: 'Жаңа оқулықты', labelRu: 'Новый учебник', labelEn: 'New textbook' },
        { id: 'e-lib', emoji: '🏛️', labelKk: 'Кітапханадан алды', labelRu: 'Взял из библиотеки', labelEn: 'Took from library' }
      ],
      correctOrderIds: ['e-teacher', 'e-book', 'e-lib']
    },
    suffixContrast: {
      sentenceA: 'Оқушы кітапты мұғалімге берді.',
      sentenceB: 'Оқушы кітапты мұғалімнен сұрады.',
      highlightWordA: 'мұғалімге',
      highlightWordB: 'мұғалімнен',
      suffixA: '-ге',
      suffixB: '-нен',
      targetQuestionText: {
        kk: 'Қай сөйлемде іс-әрекет мұғалімге қарай бағытталған?',
        ru: 'В каком предложении действие направлено к учителю?',
        en: 'In which sentence is the action directed towards the teacher?'
      },
      correctSentence: 'A',
      explanationKk: '«Мұғалімге» сөзі кітаптың мұғалімге тапсырылғанын көрсетеді.',
      explanationRu: 'Слово «мұғалімге» показывает передачу книги учителю.',
      explanationEn: 'The word "мұғалімге" shows the recipient of the book.'
    }
  },
  {
    id: 'stim-b1-02',
    cefrLevel: 'B1',
    sentenceKazakh: 'Жаңа оқулықты мұғалім кітапханадан алды.',
    transliterationLatin: 'Jańa oqulyqty muǵalim kitaphanadan aldy.',
    translationRu: 'Новый учебник учитель взял из библиотеки.',
    translationEn: 'The new textbook, the teacher took from the library.',
    wordOrder: 'OSV',
    length: 'short',
    complexity: 'simple',
    predictability: 'high',
    wordCount: 5,
    words: ['Жаңа', 'оқулықты', 'мұғалім', 'кітапханадан', 'алды.'],
    morphologicalGloss: 'new textbook-ACC teacher-NOM library-ABL take-PST.3SG',
    syntacticFocus: 'Ауыспалы OSV (Скремблинг).',
    question: {
      questionText: {
        kk: 'Осы сөйлемдегі сөздердің дұрыс тізбегі қандай?',
        ru: 'Какова правильная цепочка слов в этом предложении?',
        en: 'What is the correct word chain used in this sentence?'
      },
      options: [
        { id: 'opt-1', textKk: 'Жаңа оқулықты → мұғалім → кітапханадан → алды', textRu: 'Жаңа оқулықты → мұғалім → кітапханадан → алды', textEn: 'New textbook → teacher → from library → took' },
        { id: 'opt-2', textKk: 'Мұғалім → жаңа оқулықты → кітапханадан → алды', textRu: 'Мұғалім → оқулықты → кітапханадан → алды', textEn: 'Teacher → textbook → from library → took' },
        { id: 'opt-3', textKk: 'Алды → жаңа оқулықты → мұғалім → кітапханадан', textRu: 'Алды → оқулықты → мұғалім → кітапханадан', textEn: 'Took → textbook → teacher → from library' }
      ],
      correctOptionId: 'opt-1',
      explanationKk: 'Сөйлем толықтауыш тобынан (Жаңа оқулықты) басталады.',
      explanationRu: 'В этом стимуле на первом месте стоит объект (Жаңа оқулықты).',
      explanationEn: 'Fronted object structure (OSV).'
    },
    emojiChain: {
      items: [
        { id: 'e-book', emoji: '📚', labelKk: 'Жаңа оқулықты', labelRu: 'Новый учебник', labelEn: 'New textbook' },
        { id: 'e-teacher', emoji: '👨‍🏫', labelKk: 'Мұғалім', labelRu: 'Учитель', labelEn: 'Teacher' },
        { id: 'e-lib', emoji: '🏛️', labelKk: 'Кітапханадан алды', labelRu: 'Взял из библиотеки', labelEn: 'Took from library' }
      ],
      correctOrderIds: ['e-book', 'e-teacher', 'e-lib']
    },
    suffixContrast: {
      sentenceA: 'Дәрігер емханаға барды.',
      sentenceB: 'Дәрігер емханадан шықты.',
      highlightWordA: 'емханаға',
      highlightWordB: 'емханадан',
      suffixA: '-ға',
      suffixB: '-дан',
      targetQuestionText: {
        kk: 'Қай сөйлемде дәрігер емханадан сыртқа бет алды?',
        ru: 'В каком предложении врач вышел из поликлиники?',
        en: 'In which sentence did the doctor leave from the clinic?'
      },
      correctSentence: 'B',
      explanationKk: '«Емханадан шықты» тіркесі нысаннан сыртқа шыққандықты білдіреді.',
      explanationRu: 'Выражение «емханадан шықты» обозначает выход из помещения.',
      explanationEn: 'The phrasing indicates egress from the clinic.'
    }
  },

  // ===================== B2 (Upper-Intermediate) =====================
  {
    id: 'stim-b2-01',
    cefrLevel: 'B2',
    sentenceKazakh: 'Студенттер емтихан тапсырмаларын түні бойы мұқият орындады.',
    transliterationLatin: 'Studentter emtihan tapsyrmalaryn túni boiy muqııat oryndady.',
    translationRu: 'Студенты экзаменационные задания всю ночь внимательно выполняли.',
    translationEn: 'The students carefully completed the exam assignments all night.',
    wordOrder: 'SOV',
    length: 'medium',
    complexity: 'simple',
    predictability: 'high',
    wordCount: 7,
    words: ['Студенттер', 'емтихан', 'тапсырмаларын', 'түні', 'бойы', 'мұқият', 'орындады.'],
    morphologicalGloss: 'student-PL-NOM exam task-PL-POSS.3-ACC night along careful complete-PST.3PL',
    syntacticFocus: 'Канондық SOV мезгіл және сын-қимыл пысықтауыштарымен кеңейген.',
    question: {
      questionText: {
        kk: 'Осы сөйлемдегі сөздердің дұрыс тізбегі қандай?',
        ru: 'Какова правильная цепочка слов в этом предложении?',
        en: 'What is the correct word chain used in this sentence?'
      },
      options: [
        { id: 'opt-1', textKk: 'Студенттер → емтихан тапсырмаларын → түні бойы → орындады', textRu: 'Студенттер → емтихан тапсырмаларын → түні бойы → орындады', textEn: 'Students → exam assignments → all night → completed' },
        { id: 'opt-2', textKk: 'Емтихан тапсырмаларын → студенттер → орындады → түні бойы', textRu: 'Емтихан тапсырмаларын → студенттер → орындады', textEn: 'Exam tasks → students → completed' },
        { id: 'opt-3', textKk: 'Орындады → түні бойы → студенттер → тапсырмаларын', textRu: 'Орындады → түні бойы → студенттер', textEn: 'Completed → all night → students' }
      ],
      correctOptionId: 'opt-1',
      explanationKk: 'Бастауыш (Студенттер) алдында, соңында баяндауыш (орындады).',
      explanationRu: 'Подлежащее (Студенттер) в начале, сказуемое (орындады) в конце.',
      explanationEn: 'Subject precedes object and adverbial modifier.'
    },
    emojiChain: {
      items: [
        { id: 'e-students', emoji: '🧑‍🎓', labelKk: 'Студенттер', labelRu: 'Студенты', labelEn: 'Students' },
        { id: 'e-tasks', emoji: '📝', labelKk: 'Емтихан тапсырмаларын', labelRu: 'Задания экзамена', labelEn: 'Exam tasks' },
        { id: 'e-work', emoji: '🌙', labelKk: 'Түні бойы орындады', labelRu: 'Всю ночь выполняли', labelEn: 'Completed all night' }
      ],
      correctOrderIds: ['e-students', 'e-tasks', 'e-work']
    },
    suffixContrast: {
      sentenceA: 'Бастық тапсырманы хатшыға тапсырды.',
      sentenceB: 'Бастық тапсырманы хатшыдан талап етті.',
      highlightWordA: 'хатшыға',
      highlightWordB: 'хатшыдан',
      suffixA: '-ға',
      suffixB: '-дан',
      targetQuestionText: {
        kk: 'Қай сөйлемде әрекет хатшыдан жауап немесе нәтиже талап етуді білдіреді?',
        ru: 'В каком предложении результат требуется от секретаря?',
        en: 'In which sentence did the boss demand the task result from the secretary?'
      },
      correctSentence: 'B',
      explanationKk: '«Хатшыдан талап етті» хатшыдан нәтижені күтуді/сұрауды білдіреді.',
      explanationRu: 'Выражение «хатшыдан талап етті» означает требование отчета с исполнителя.',
      explanationEn: 'The phrasing marks the source from whom compliance is demanded.'
    }
  },
  {
    id: 'stim-b2-02',
    cefrLevel: 'B2',
    sentenceKazakh: 'Маңызды хабарламаны жіберді басшы қызметкерлерге шұғыл жиналыс алдында.',
    transliterationLatin: 'Mańyzdy habarlamany jiberdi basshy qyzmetkerlerge shuǵyl jınalys aldynda.',
    translationRu: 'Важное сообщение отправил руководитель сотрудникам перед срочным собранием.',
    translationEn: 'The important message was sent by the manager to employees before the urgent meeting.',
    wordOrder: 'OVS',
    length: 'medium',
    complexity: 'complex',
    predictability: 'low',
    wordCount: 8,
    words: ['Маңызды', 'хабарламаны', 'жіберді', 'басшы', 'қызметкерлерге', 'шұғыл', 'жиналыс', 'алдында.'],
    morphologicalGloss: 'important message-ACC send-PST.3SG manager-NOM employee-PL-DAT urgent meeting before',
    syntacticFocus: 'Фокусталған OVS тәртібі (Post-verbal subject).',
    question: {
      questionText: {
        kk: 'Осы сөйлемдегі сөздердің дұрыс тізбегі қандай?',
        ru: 'Какова правильная цепочка слов в этом предложении?',
        en: 'What is the correct word chain used in this sentence?'
      },
      options: [
        { id: 'opt-1', textKk: 'Маңызды хабарламаны → жіберді → басшы → қызметкерлерге', textRu: 'Маңызды хабарламаны → жіберді → басшы → қызметкерлерге', textEn: 'Important message → sent → manager → to employees' },
        { id: 'opt-2', textKk: 'Басшы → маңызды хабарламаны → қызметкерлерге → жіберді', textRu: 'Басшы → хабарламаны → қызметкерлерге → жіберді', textEn: 'Manager → message → to employees → sent' },
        { id: 'opt-3', textKk: 'Қызметкерлерге → басшы → жіберді → хабарламаны', textRu: 'Қызметкерлерге → басшы → жіберді', textEn: 'To employees → manager → sent' }
      ],
      correctOptionId: 'opt-1',
      explanationKk: 'OVS тәртібінде толықтауыштан (хабарламаны) кейін етістік (жіберді), сосын бастауыш (басшы) келеді.',
      explanationRu: 'В порядке OVS глагол (жіберді) предшествует подлежащему (басшы).',
      explanationEn: 'OVS orders Object followed by Verb and postposed Subject.'
    },
    emojiChain: {
      items: [
        { id: 'e-msg', emoji: '📨', labelKk: 'Маңызды хабарламаны', labelRu: 'Важное сообщение', labelEn: 'Message' },
        { id: 'e-send', emoji: '📤', labelKk: 'Жіберді', labelRu: 'Отправил', labelEn: 'Sent' },
        { id: 'e-boss', emoji: '👔', labelKk: 'Басшы қызметкерлерге', labelRu: 'Руководитель сотрудникам', labelEn: 'Boss to staff' }
      ],
      correctOrderIds: ['e-msg', 'e-send', 'e-boss']
    },
    suffixContrast: {
      sentenceA: 'Маман тәжірибені шетелге таратты.',
      sentenceB: 'Маман тәжірибені шетелден үйренді.',
      highlightWordA: 'шетелге',
      highlightWordB: 'шетелден',
      suffixA: '-ге',
      suffixB: '-ден',
      targetQuestionText: {
        kk: 'Қай сөйлемде білім көзі сыртқы елден алынған немесе келген?',
        ru: 'В каком предложении опыт был перенят из-за границы?',
        en: 'In which sentence was experience gained from abroad?'
      },
      correctSentence: 'B',
      explanationKk: '«Шетелден» сөзі білім мен тәжірибенің сырттан келгенін көрсетеді.',
      explanationRu: 'Слово «шетелден» указывает на заимствование опыта извне.',
      explanationEn: 'The word "шетелден" marks the foreign origin of the acquired knowledge.'
    }
  },

  // ===================== C1 (Advanced) =====================
  {
    id: 'stim-c1-01',
    cefrLevel: 'C1',
    sentenceKazakh: 'Халық жарыста жеңіске жеткен спортшыларды алаңда зор құрметпен қарсы алды.',
    transliterationLatin: 'Halyq jarysta jeńiske jetken sportshylardy alańda zor qurmetpen qarsy aldy.',
    translationRu: 'Народ спортсменов, победивших на соревнованиях, встретил на площади с большим уважением.',
    translationEn: 'The people welcomed the athletes who won the competition on the square with great honor.',
    wordOrder: 'SOV',
    length: 'long',
    complexity: 'complex',
    predictability: 'high',
    wordCount: 10,
    words: ['Халық', 'жарыста', 'жеңіске', 'жеткен', 'спортшыларды', 'алаңда', 'зор', 'құрметпен', 'қарсы', 'алды.'],
    morphologicalGloss: 'people-NOM contest-LOC win reach-PART athlete-PL-ACC square-LOC honor-INS welcome-PST.3SG',
    syntacticFocus: 'Күрделі есімшелі орамды (-ған/-ген) канондық SOV құрылымы.',
    question: {
      questionText: {
        kk: 'Осы сөйлемдегі сөздердің дұрыс тізбегі қандай?',
        ru: 'Какова правильная цепочка слов в этом предложении?',
        en: 'What is the correct word chain used in this sentence?'
      },
      options: [
        { id: 'opt-1', textKk: 'Халық → жеңіске жеткен спортшыларды → құрметпен қарсы алды', textRu: 'Халық → жеңіске жеткен спортшыларды → құрметпен қарсы алды', textEn: 'People → victorious athletes → welcomed with honor' },
        { id: 'opt-2', textKk: 'Спортшыларды → халық → алаңда → қарсы алды', textRu: 'Спортшыларды → халық → қарсы алды', textEn: 'Athletes → people → welcomed' },
        { id: 'opt-3', textKk: 'Қарсы алды → халық → спортшыларды → алаңда', textRu: 'Қарсы алды → халық → спортшыларды', textEn: 'Welcomed → people → athletes' }
      ],
      correctOptionId: 'opt-1',
      explanationKk: 'Бастауыш (Халық) анықтауыштық есімшелі топтан бұрын орналасқан.',
      explanationRu: 'Подлежащее (Халық) предшествует распространенному определительному обороту.',
      explanationEn: 'Canonical Subject precedes the complex relative participial clause.'
    },
    emojiChain: {
      items: [
        { id: 'e-people', emoji: '👥', labelKk: 'Халық', labelRu: 'Народ', labelEn: 'People' },
        { id: 'e-athletes', emoji: '🏆', labelKk: 'Жеңімпаз спортшыларды', labelRu: 'Победивших спортсменов', labelEn: 'Victorious athletes' },
        { id: 'e-welcome', emoji: '👏', labelKk: 'Құрметпен қарсы алды', labelRu: 'С уважением встретил', labelEn: 'Welcomed with honor' }
      ],
      correctOrderIds: ['e-people', 'e-athletes', 'e-welcome']
    },
    suffixContrast: {
      sentenceA: 'Әкімшілік көмекті халыққа таратты.',
      sentenceB: 'Әкімшілік көмекті халықтан жинады.',
      highlightWordA: 'халыққа',
      highlightWordB: 'халықтан',
      suffixA: '-қа',
      suffixB: '-тан',
      targetQuestionText: {
        kk: 'Қай сөйлемде көмек халықтың қолына берілді немесе үлестірілді?',
        ru: 'В каком предложении помощь была передана народу?',
        en: 'In which sentence was assistance distributed to the people?'
      },
      correctSentence: 'A',
      explanationKk: '«Халыққа таратты» көмектің халыққа берілгенін білдіреді.',
      explanationRu: 'Выражение «халыққа таратты» показывает передачу помощи адресату (народу).',
      explanationEn: 'The phrasing marks the populace as the beneficiaries.'
    }
  },
  {
    id: 'stim-c1-02',
    cefrLevel: 'C1',
    sentenceKazakh: 'Жарыста жеңіске жеткен спортшыларды халық алаңда зор құрметпен қарсы алды.',
    transliterationLatin: 'Jarysta jeńiske jetken sportshylardy halyq alańda zor qurmetpen qarsy aldy.',
    translationRu: 'Спортсменов, победивших на соревнованиях, народ встретил на площади с большим уважением.',
    translationEn: 'The athletes who won the competition, the people welcomed on the square with great honor.',
    wordOrder: 'OSV',
    length: 'long',
    complexity: 'complex',
    predictability: 'high',
    wordCount: 10,
    words: ['Жарыста', 'жеңіске', 'жеткен', 'спортшыларды', 'халық', 'алаңда', 'зор', 'құрметпен', 'қарсы', 'алды.'],
    morphologicalGloss: 'contest-LOC win reach-PART athlete-PL-ACC people-NOM square-LOC honor-INS welcome-PST.3SG',
    syntacticFocus: 'Ұзақ анықтауыштық орамы бар тақырыпталған OSV құрылымы.',
    question: {
      questionText: {
        kk: 'Осы сөйлемдегі сөздердің дұрыс тізбегі қандай?',
        ru: 'Какова правильная цепочка слов в этом предложении?',
        en: 'What is the correct word chain used in this sentence?'
      },
      options: [
        { id: 'opt-1', textKk: 'Жеңіске жеткен спортшыларды → халық → алаңда қарсы алды', textRu: 'Жеңіске жеткен спортшыларды → халық → алаңда қарсы алды', textEn: 'Victorious athletes → people → welcomed on square' },
        { id: 'opt-2', textKk: 'Халық → спортшыларды → қарсы алды', textRu: 'Халық → спортшыларды → қарсы алды', textEn: 'People → athletes → welcomed' },
        { id: 'opt-3', textKk: 'Қарсы алды → алаңда → халық → спортшыларды', textRu: 'Қарсы алды → алаңда → халық', textEn: 'Welcomed → on square → people' }
      ],
      correctOptionId: 'opt-1',
      explanationKk: 'Толықтауыш тобы сөйлем басында (Жарыста жеңіске жеткен спортшыларды).',
      explanationRu: 'Объектная группа выдвинута на первое место (OSV).',
      explanationEn: 'Heavy object constituent is fronted.'
    },
    emojiChain: {
      items: [
        { id: 'e-athletes', emoji: '🏆', labelKk: 'Жеңімпаз спортшыларды', labelRu: 'Победивших спортсменов', labelEn: 'Victorious athletes' },
        { id: 'e-people', emoji: '👥', labelKk: 'Халық', labelRu: 'Народ', labelEn: 'People' },
        { id: 'e-welcome', emoji: '👏', labelKk: 'Құрметпен қарсы алды', labelRu: 'С уважением встретил', labelEn: 'Welcomed with honor' }
      ],
      correctOrderIds: ['e-athletes', 'e-people', 'e-welcome']
    },
    suffixContrast: {
      sentenceA: 'Ғалым баяндаманы ғылыми кеңеске ұсынды.',
      sentenceB: 'Ғалым баяндаманы ғылыми кеңестен қайтарып алды.',
      highlightWordA: 'кеңеске',
      highlightWordB: 'кеңестен',
      suffixA: '-ке',
      suffixB: '-тен',
      targetQuestionText: {
        kk: 'Қай сөйлемде ғалым құжатты кері қайтарып өзіне алды?',
        ru: 'В каком предложении ученый забрал документ обратно?',
        en: 'In which sentence did the scholar withdraw the report from the council?'
      },
      correctSentence: 'B',
      explanationKk: '«Кеңестен қайтарып алды» құжаттың кеңестен шығарылып алынғанын білдіреді.',
      explanationRu: 'Выражение «кеңестен қайтарып алды» показывает изъятие и возврат документа из совета.',
      explanationEn: 'The phrasing indicates retraction and retrieval from the council.'
    }
  },

  // ===================== C2 (Proficiency / Mastery) =====================
  {
    id: 'stim-c2-01',
    cefrLevel: 'C2',
    sentenceKazakh: 'Тарихшылар ежелгі жазба жәдігерлердің түпнұсқасын орталық мұрағат қорынан үлкен ыждаһатпен тапты.',
    transliterationLatin: 'Tarıhshylar ejelgi jazba jádigerlerdiń túpnusqasyn ortalyq muraǵat qorynan úlken yjdahatpen tapty.',
    translationRu: 'Историки оригинал древних письменных памятников из фонда центрального архива с большим усердием нашли.',
    translationEn: 'The historians diligently discovered the original ancient written relic from the central archival fund.',
    wordOrder: 'SOV',
    length: 'long',
    complexity: 'complex',
    predictability: 'low',
    wordCount: 11,
    words: ['Тарихшылар', 'ежелгі', 'жазба', 'жәдігерлердің', 'түпнұсқасын', 'орталық', 'мұрағат', 'қорынан', 'үлкен', 'ыждаһатпен', 'тапты.'],
    morphologicalGloss: 'historian-PL-NOM ancient written relic-PL-GEN original-POSS.3-ACC central archive fund-POSS.3-ABL great diligence-INS find-PST.3SG',
    syntacticFocus: 'Көп сатылы изафеттік және септік байланысты күрделі академиялық SOV.',
    question: {
      questionText: {
        kk: 'Осы сөйлемдегі сөздердің дұрыс тізбегі қандай?',
        ru: 'Какова правильная цепочка слов в этом предложении?',
        en: 'What is the correct word chain used in this sentence?'
      },
      options: [
        { id: 'opt-1', textKk: 'Тарихшылар → жазба жәдігерлердің түпнұсқасын → мұрағат қорынан → тапты', textRu: 'Тарихшылар → жазба жәдігерлердің түпнұсқасын → мұрағат қорынан → тапты', textEn: 'Historians → original relic → from archive fund → found' },
        { id: 'opt-2', textKk: 'Мұрағат қорынан → тарихшылар → тапты → жәдігерлерді', textRu: 'Мұрағат қорынан → тарихшылар → тапты', textEn: 'From archive → historians → found' },
        { id: 'opt-3', textKk: 'Тапты → тарихшылар → жәдігерлердің түпнұсқасын', textRu: 'Тапты → тарихшылар → түпнұсқасын', textEn: 'Found → historians → original' }
      ],
      correctOptionId: 'opt-1',
      explanationKk: 'Күрделі бастауыш (Тарихшылар), анықтауышты толықтауыш тобы, мекен пысықтауышы және баяндауыш (тапты).',
      explanationRu: 'Каноническая цепочка высокой сложности: Субъект → Генитивно-аккузативный комплекс → Аблатив → Предикат.',
      explanationEn: 'Complex high-register canonical SOV constituent sequence.'
    },
    emojiChain: {
      items: [
        { id: 'e-historians', emoji: '📜', labelKk: 'Тарихшылар', labelRu: 'Историки', labelEn: 'Historians' },
        { id: 'e-relic', emoji: '🔍', labelKk: 'Ежелгі жәдігер түпнұсқасын', labelRu: 'Оригинал древней рукописи', labelEn: 'Ancient original relic' },
        { id: 'e-archive', emoji: '🏛️', labelKk: 'Мұрағаттан тапты', labelRu: 'Нашли в архиве', labelEn: 'Found in archive' }
      ],
      correctOrderIds: ['e-historians', 'e-relic', 'e-archive']
    },
    suffixContrast: {
      sentenceA: 'Академик сирек қолжазбаны мемлекеттік музейге сыйға тартты.',
      sentenceB: 'Академик сирек қолжазбаны мемлекеттік музейден уақытша алды.',
      highlightWordA: 'музейге',
      highlightWordB: 'музейден',
      suffixA: '-ге',
      suffixB: '-ден',
      targetQuestionText: {
        kk: 'Қай сөйлемде экспонат музейдің меншігіне өтті немесе музейге табысталды?',
        ru: 'В каком предложении экспонат был передан в собственность музея?',
        en: 'In which sentence was the manuscript donated to the museum?'
      },
      correctSentence: 'A',
      explanationKk: '«Музейге сыйға тартты» құнды жәдігердің музейге тапсырылғанын көрсетеді.',
      explanationRu: 'Выражение «музейге сыйға тартты» обозначает безвозмездную передачу в музей.',
      explanationEn: 'The phrasing marks transfer of ownership to the museum.'
    }
  },
  {
    id: 'stim-c2-02',
    cefrLevel: 'C2',
    sentenceKazakh: 'Аса маңызды мемлекеттік құжатты бекітті сарапшылар келелі кеңестен кейін.',
    transliterationLatin: 'Asa mańyzdy memlekettik qujatty bekitti sarapshylar keleli keńesten keıin.',
    translationRu: 'Особо важный государственный документ утвердили эксперты после обстоятельного совета.',
    translationEn: 'The highly important state document was approved by the experts after the extensive council.',
    wordOrder: 'OVS',
    length: 'medium',
    complexity: 'complex',
    predictability: 'low',
    wordCount: 8,
    words: ['Аса', 'маңызды', 'мемлекеттік', 'құжатты', 'бекітті', 'сарапшылар', 'келелі', 'кеңестен', 'кейін.'],
    morphologicalGloss: 'very important state document-ACC approve-PST.3SG expert-PL-NOM substantial council-ABL after',
    syntacticFocus: 'Стилистикалық инверсиялы күрделі OVS тәртібі.',
    question: {
      questionText: {
        kk: 'Осы сөйлемдегі сөздердің дұрыс тізбегі қандай?',
        ru: 'Какова правильная цепочка слов в этом предложении?',
        en: 'What is the correct word chain used in this sentence?'
      },
      options: [
        { id: 'opt-1', textKk: 'Мемлекеттік құжатты → бекітті → сарапшылар → кеңестен кейін', textRu: 'Мемлекеттік құжатты → бекітті → сарапшылар → кеңестен кейін', textEn: 'State document → approved → experts → after council' },
        { id: 'opt-2', textKk: 'Сарапшылар → мемлекеттік құжатты → бекітті', textRu: 'Сарапшылар → құжатты → бекітті', textEn: 'Experts → document → approved' },
        { id: 'opt-3', textKk: 'Бекітті → сарапшылар → мемлекеттік құжатты', textRu: 'Бекітті → сарапшылар → құжатты', textEn: 'Approved → experts → document' }
      ],
      correctOptionId: 'opt-1',
      explanationKk: 'Стилистикалық мақсатта нысан алға шығып (құжатты), баяндауыш (бекітті) бастауыштан (сарапшылар) бұрын қойылған.',
      explanationRu: 'Стилистическая инверсия OVS: дополнение (құжатты) → предикат (бекітті) → подлежащее (сарапшылар).',
      explanationEn: 'Inverted OVS placing semantic focus on the state document.'
    },
    emojiChain: {
      items: [
        { id: 'e-doc', emoji: '📑', labelKk: 'Мемлекеттік құжатты', labelRu: 'Государственный документ', labelEn: 'State document' },
        { id: 'e-seal', emoji: '✍️', labelKk: 'Бекітті', labelRu: 'Утвердили', labelEn: 'Approved' },
        { id: 'e-experts', emoji: '👔', labelKk: 'Сарапшылар', labelRu: 'Эксперты', labelEn: 'Experts' }
      ],
      correctOrderIds: ['e-doc', 'e-seal', 'e-experts']
    },
    suffixContrast: {
      sentenceA: 'Президент жаңа өкілеттікті министрге жүктеді.',
      sentenceB: 'Президент жаңа өкілеттікті министрден қайтарып алды.',
      highlightWordA: 'министрге',
      highlightWordB: 'министрден',
      suffixA: '-ге',
      suffixB: '-ден',
      targetQuestionText: {
        kk: 'Қай сөйлемде өкілеттік министрдің құзырынан алынды?',
        ru: 'В каком предложении полномочия были отозваны у министра?',
        en: 'In which sentence were powers revoked from the minister?'
      },
      correctSentence: 'B',
      explanationKk: '«Министрден қайтарып алды» өкілеттіктің кері қайтарылып алынғанын білдіреді.',
      explanationRu: 'Выражение «министрден қайтарып алды» означает отзыв полномочий у должностного лица.',
      explanationEn: 'The phrasing signifies revocation of authority from the official.'
    }
  }
];
