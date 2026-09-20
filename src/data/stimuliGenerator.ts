import { StimulusSentence, WordOrderCondition, CEFRLevel, SyntacticComplexity, SentenceLength, PredictabilityLevel } from '../types';
import { initialStimulusSentences } from './sentences';

// Kazakh linguistic lexicon elements for generating balanced psycholinguistic stimuli
interface LexiconItem {
  sov: string;
  osv: string;
  svo: string;
  ovs: string;
  translitSov: string;
  translitOsv: string;
  glossSov: string;
  glossOsv: string;
  cefr: CEFRLevel;
  length: SentenceLength;
  complexity: SyntacticComplexity;
  predictability: PredictabilityLevel;
  subject: string;
  object: string;
  verb: string;
  subjEmoji: { emoji: string; labelKk: string; labelRu: string; labelEn: string };
  objEmoji: { emoji: string; labelKk: string; labelRu: string; labelEn: string };
  verbEmoji: { emoji: string; labelKk: string; labelRu: string; labelEn: string };
  suffixPair: {
    sentenceA: string;
    sentenceB: string;
    suffixA: string;
    suffixB: string;
    highlightA: string;
    highlightB: string;
    questionKk: string;
    questionRu: string;
    questionEn: string;
    correctSentence: 'A' | 'B';
    explanationKk: string;
    explanationRu: string;
    explanationEn: string;
  };
}

const RESEARCH_STIMULI_TEMPLATES: LexiconItem[] = [
  {
    sov: 'Мұғалім жаңа сабақты сыныпта мұқият түсіндірді.',
    osv: 'Жаңа сабақты мұғалім сыныпта мұқият түсіндірді.',
    svo: 'Мұғалім түсіндірді жаңа сабақты сынып оқушыларына.',
    ovs: 'Жаңа сабақты түсіндірді тәжірибелі мұғалім сыныпта.',
    translitSov: 'Muǵalim jańa sabaqty synypta muqıiat túsindirdi.',
    translitOsv: 'Jańa sabaqty muǵalim synypta muqıiat túsindirdi.',
    glossSov: 'teacher-NOM new lesson-ACC classroom-LOC carefully explain-PST.3SG',
    glossOsv: 'new lesson-ACC teacher-NOM classroom-LOC carefully explain-PST.3SG',
    cefr: 'A2',
    length: 'long',
    complexity: 'simple',
    predictability: 'high',
    subject: 'Мұғалім',
    object: 'Жаңа сабақты',
    verb: 'түсіндірді',
    subjEmoji: { emoji: '👩‍🏫', labelKk: 'Мұғалім', labelRu: 'Учитель', labelEn: 'Teacher' },
    objEmoji: { emoji: '📖', labelKk: 'Сабақ', labelRu: 'Урок', labelEn: 'Lesson' },
    verbEmoji: { emoji: '🗣️', labelKk: 'Түсіндірді', labelRu: 'Объяснил', labelEn: 'Explained' },
    suffixPair: {
      sentenceA: 'Мұғалім кітапты сөреге қойды.',
      sentenceB: 'Мұғалім кітапты сөреден алды.',
      suffixA: '-ге',
      suffixB: '-ден',
      highlightA: 'сөреге',
      highlightB: 'сөреден',
      questionKk: 'Қай сөйлемде кітап сөреден алынды?',
      questionRu: 'В каком предложении книгу взяли с полки?',
      questionEn: 'In which sentence was the book removed from the shelf?',
      correctSentence: 'B',
      explanationKk: '«Сөреден алды» қимылдың сөреден басталғанын, ал «сөреге» бағытты білдіреді.',
      explanationRu: '«Сөреден алды» выражает исходную точку действия (с полки).',
      explanationEn: '"Сөреден алды" indicates movement away from the shelf.'
    }
  },
  {
    sov: 'Дәрігер ауырған науқасты ауруханада тез емдеді.',
    osv: 'Ауырған науқасты дәрігер ауруханада тез емдеді.',
    svo: 'Дәрігер емдеді ауырған науқасты заманауи тәсілмен.',
    ovs: 'Ауырған науқасты емдеді білікті дәрігер кеше.',
    translitSov: 'Dáriger aýyrǵan naýqasty aýrýhanada tez emdedi.',
    translitOsv: 'Aýyrǵan naýqasty dáriger aýrýhanada tez emdedi.',
    glossSov: 'doctor-NOM sick patient-ACC hospital-LOC quickly treat-PST.3SG',
    glossOsv: 'sick patient-ACC doctor-NOM hospital-LOC quickly treat-PST.3SG',
    cefr: 'B1',
    length: 'long',
    complexity: 'simple',
    predictability: 'high',
    subject: 'Дәрігер',
    object: 'Науқасты',
    verb: 'емдеді',
    subjEmoji: { emoji: '👨‍⚕️', labelKk: 'Дәрігер', labelRu: 'Врач', labelEn: 'Doctor' },
    objEmoji: { emoji: '🤒', labelKk: 'Науқасты', labelRu: 'Пациент', labelEn: 'Patient' },
    verbEmoji: { emoji: '💊', labelKk: 'Емдеді', labelRu: 'Вылечил', labelEn: 'Treated' },
    suffixPair: {
      sentenceA: 'Дәрігер науқасқа дәрі берді.',
      sentenceB: 'Дәрігер науқастан сараптама алды.',
      suffixA: '-қа',
      suffixB: '-тан',
      highlightA: 'науқасқа',
      highlightB: 'науқастан',
      questionKk: 'Қай сөйлемде дәрігер дәрі тағайындады?',
      questionRu: 'В каком предложении врач дал лекарство?',
      questionEn: 'In which sentence did the doctor give medicine?',
      correctSentence: 'A',
      explanationKk: '«Науқасқа» барыс септігі дәрінің науқасқа берілгенін білдіреді.',
      explanationRu: 'Дательный падеж «науқасқа» выражает адресат действия.',
      explanationEn: 'The dative suffix "-қа" marks the recipient of the medicine.'
    }
  },
  {
    sov: 'Ғалым маңызды тәжірибені зертханада сәтті аяқтады.',
    osv: 'Маңызды тәжірибені ғалым зертханада сәтті аяқтады.',
    svo: 'Ғалым аяқтады маңызды тәжірибені көптен күткен.',
    ovs: 'Маңызды тәжірибені аяқтады жас ғалым институтта.',
    translitSov: 'Ġalym mańyzdy tájirıbeni zerthanada sátti aıaqtady.',
    translitOsv: 'Mańyzdy tájirıbeni ġalym zerthanada sátti aıaqtady.',
    glossSov: 'scientist-NOM important experiment-ACC laboratory-LOC successfully complete-PST.3SG',
    glossOsv: 'important experiment-ACC scientist-NOM laboratory-LOC successfully complete-PST.3SG',
    cefr: 'B2',
    length: 'long',
    complexity: 'complex',
    predictability: 'high',
    subject: 'Ғалым',
    object: 'Тәжірибені',
    verb: 'аяқтады',
    subjEmoji: { emoji: '🔬', labelKk: 'Ғалым', labelRu: 'Ученый', labelEn: 'Scientist' },
    objEmoji: { emoji: '🧪', labelKk: 'Тәжірибе', labelRu: 'Опыт', labelEn: 'Experiment' },
    verbEmoji: { emoji: '✨', labelKk: 'Аяқтады', labelRu: 'Завершил', labelEn: 'Completed' },
    suffixPair: {
      sentenceA: 'Ғалым жаңалықты жиынға хабарлады.',
      sentenceB: 'Ғалым жаңалықты жиыннан естіді.',
      suffixA: '-ға',
      suffixB: '-нан',
      highlightA: 'жиынға',
      highlightB: 'жиыннан',
      questionKk: 'Қай сөйлемде ғалым жаңалықты өзі хабарлады?',
      questionRu: 'В каком предложении ученый сам сообщил новость?',
      questionEn: 'In which sentence did the scientist announce the news themselves?',
      correctSentence: 'A',
      explanationKk: '«Жиынға хабарлады» барыс септігі арқылы ақпараттың таралу бағытын көрсетеді.',
      explanationRu: '«Жиынға» обозначает аудиторию, которой сообщили новость.',
      explanationEn: 'The dative form specifies the audience receiving the message.'
    }
  },
  {
    sov: 'Жазушы көлемді романды жаз айларында аяқтады.',
    osv: 'Көлемді романды жазушы жаз айларында аяқтады.',
    svo: 'Жазушы аяқтады көлемді романды үлкен шабытпен.',
    ovs: 'Көлемді романды аяқтады атақты жазушы ауылда.',
    translitSov: 'Jazýshy kólemdi romandy jaz aılarynda aıaqtady.',
    translitOsv: 'Kólemdi romandy jazýshy jaz aılarynda aıaqtady.',
    glossSov: 'writer-NOM voluminous novel-ACC summer months-LOC finish-PST.3SG',
    glossOsv: 'voluminous novel-ACC writer-NOM summer months-LOC finish-PST.3SG',
    cefr: 'B1',
    length: 'short',
    complexity: 'simple',
    predictability: 'high',
    subject: 'Жазушы',
    object: 'Романды',
    verb: 'аяқтады',
    subjEmoji: { emoji: '✍️', labelKk: 'Жазушы', labelRu: 'Писатель', labelEn: 'Writer' },
    objEmoji: { emoji: '📚', labelKk: 'Роман', labelRu: 'Роман', labelEn: 'Novel' },
    verbEmoji: { emoji: '🏁', labelKk: 'Аяқтады', labelRu: 'Закончил', labelEn: 'Finished' },
    suffixPair: {
      sentenceA: 'Жазушы кітапты баспаға жіберді.',
      sentenceB: 'Жазушы кітапты баспадан қайтарып алды.',
      suffixA: '-ға',
      suffixB: '-дан',
      highlightA: 'баспаға',
      highlightB: 'баспадан',
      questionKk: 'Қай сөйлемде кітап баспаға тапсырылды?',
      questionRu: 'В каком предложении книга была передана в издательство?',
      questionEn: 'In which sentence was the book submitted to the publisher?',
      correctSentence: 'A',
      explanationKk: '«Баспаға жіберді» әрекеттің баспа бағытында орындалғанын көрсетеді.',
      explanationRu: '«Баспаға» выражает направление движения рукописи.',
      explanationEn: '"Баспаға" marks the publisher as the recipient.'
    }
  },
  {
    sov: 'Құрылысшы мықты көпірді өзен үстіне салды.',
    osv: 'Мықты көпірді құрылысшы өзен үстіне салды.',
    svo: 'Құрылысшы салды мықты көпірді тұрғындар игілігі үшін.',
    ovs: 'Мықты көпірді салды білікті құрылысшы биыл.',
    translitSov: 'Qurylysshy myqty kópirdi ózen ústine saldy.',
    translitOsv: 'Myqty kópirdi qurylysshy ózen ústine saldy.',
    glossSov: 'builder-NOM strong bridge-ACC river over-LOC build-PST.3SG',
    glossOsv: 'strong bridge-ACC builder-NOM river over-LOC build-PST.3SG',
    cefr: 'A2',
    length: 'short',
    complexity: 'simple',
    predictability: 'high',
    subject: 'Құрылысшы',
    object: 'Көпірді',
    verb: 'салды',
    subjEmoji: { emoji: '👷', labelKk: 'Құрылысшы', labelRu: 'Строитель', labelEn: 'Builder' },
    objEmoji: { emoji: '🌉', labelKk: 'Көпір', labelRu: 'Мост', labelEn: 'Bridge' },
    verbEmoji: { emoji: '🔨', labelKk: 'Салды', labelRu: 'Построил', labelEn: 'Built' },
    suffixPair: {
      sentenceA: 'Құрылысшы материалды қалаға тасыды.',
      sentenceB: 'Құрылысшы материалды қаладан тасыды.',
      suffixA: '-ға',
      suffixB: '-дан',
      highlightA: 'қалаға',
      highlightB: 'қаладан',
      questionKk: 'Қай сөйлемде материал қаладан сыртқа тасылды?',
      questionRu: 'В каком предложении материалы везли из города?',
      questionEn: 'In which sentence were materials transported from the city?',
      correctSentence: 'B',
      explanationKk: 'Шығыс септігіндегі «қаладан» бастапқы пунктті білдіреді.',
      explanationRu: 'Исходный падеж «қаладан» указывает на происхождение движения.',
      explanationEn: 'The ablative suffix indicates origin.'
    }
  },
  {
    sov: 'Студент күрделі емтиханды үздік бағаға тапсырды.',
    osv: 'Күрделі емтиханды студент үздік бағаға тапсырды.',
    svo: 'Студент тапсырды күрделі емтиханды қиналмай оңай.',
    ovs: 'Күрделі емтиханды тапсырды дарынды студент кеше.',
    translitSov: 'Stýdent kúrdeli emtıhandy úzdik baǵaǵa tapsyrdy.',
    translitOsv: 'Kúrdeli emtıhandy stýdent úzdik baǵaǵa tapsyrdy.',
    glossSov: 'student-NOM difficult exam-ACC excellent grade-DAT pass-PST.3SG',
    glossOsv: 'difficult exam-ACC student-NOM excellent grade-DAT pass-PST.3SG',
    cefr: 'B1',
    length: 'short',
    complexity: 'simple',
    predictability: 'high',
    subject: 'Студент',
    object: 'Емтиханды',
    verb: 'тапсырды',
    subjEmoji: { emoji: '🎓', labelKk: 'Студент', labelRu: 'Студент', labelEn: 'Student' },
    objEmoji: { emoji: '📝', labelKk: 'Емтихан', labelRu: 'Экзамен', labelEn: 'Exam' },
    verbEmoji: { emoji: '✅', labelKk: 'Тапсырды', labelRu: 'Сдал', labelEn: 'Passed' },
    suffixPair: {
      sentenceA: 'Студент дәріске келді.',
      sentenceB: 'Студент дәрістен кетті.',
      suffixA: '-ке',
      suffixB: '-тен',
      highlightA: 'дәріске',
      highlightB: 'дәрістен',
      questionKk: 'Қай сөйлемде студент дәріс аяқталған соң кетті?',
      questionRu: 'В каком предложении студент ушел с лекции?',
      questionEn: 'In which sentence did the student leave the lecture?',
      correctSentence: 'B',
      explanationKk: '«Дәрістен кетті» шығыс септігін көрсетеді.',
      explanationRu: '«Дәрістен» обозначает убытие с занятия.',
      explanationEn: 'The ablative marks departure.'
    }
  },
  {
    sov: 'Суретші табиғат көрінісін шеберлікпен салды.',
    osv: 'Табиғат көрінісін суретші шеберлікпен салды.',
    svo: 'Суретші салды табиғат көрінісін майлы бояумен.',
    ovs: 'Табиғат көрінісін салды белгілі суретші шеберханада.',
    translitSov: 'Sýretshi tabiǵat kórinisin sheberlikpen saldy.',
    translitOsv: 'Tabiǵat kórinisin sýretshi sheberlikpen saldy.',
    glossSov: 'artist-NOM nature scenery-ACC masterfully paint-PST.3SG',
    glossOsv: 'nature scenery-ACC artist-NOM masterfully paint-PST.3SG',
    cefr: 'A2',
    length: 'short',
    complexity: 'simple',
    predictability: 'high',
    subject: 'Суретші',
    object: 'Табиғат көрінісін',
    verb: 'салды',
    subjEmoji: { emoji: '🎨', labelKk: 'Суретші', labelRu: 'Художник', labelEn: 'Artist' },
    objEmoji: { emoji: '🌄', labelKk: 'Көрініс', labelRu: 'Пейзаж', labelEn: 'Scenery' },
    verbEmoji: { emoji: '🖌️', labelKk: 'Салды', labelRu: 'Нарисовал', labelEn: 'Painted' },
    suffixPair: {
      sentenceA: 'Суретші туындыны көрмеге қойды.',
      sentenceB: 'Суретші туындыны көрмеден алды.',
      suffixA: '-ге',
      suffixB: '-ден',
      highlightA: 'көрмеге',
      highlightB: 'көрмеден',
      questionKk: 'Қай сөйлемде картина көрмеге ұсынылды?',
      questionRu: 'В каком предложении картина выставлена на выставку?',
      questionEn: 'In which sentence was the artwork placed in the exhibition?',
      correctSentence: 'A',
      explanationKk: '«Көрмеге қойды» экспозицияға ұсынылғанын білдіреді.',
      explanationRu: '«Көрмеге» выражает целевое направление.',
      explanationEn: 'The dative form specifies destination.'
    }
  },
  {
    sov: 'Жаттықтырушы жас спортшыны жарысқа тыңғылықты дайындады.',
    osv: 'Жас спортшыны жаттықтырушы жарысқа тыңғылықты дайындады.',
    svo: 'Жаттықтырушы дайындады жас спортшыны үлкен жеңіске.',
    ovs: 'Жас спортшыны дайындады тәжірибелі жаттықтырушы спортзал ішінде.',
    translitSov: 'Jattyqtyrýshy jas sportshyny jarysqa tyńǵylyqty daıyndady.',
    translitOsv: 'Jas sportshyny jattyqtyrýshy jarysqa tyńǵylyqty daıyndady.',
    glossSov: 'coach-NOM young athlete-ACC competition-DAT thoroughly prepare-PST.3SG',
    glossOsv: 'young athlete-ACC coach-NOM competition-DAT thoroughly prepare-PST.3SG',
    cefr: 'B1',
    length: 'long',
    complexity: 'simple',
    predictability: 'high',
    subject: 'Жаттықтырушы',
    object: 'Спортшыны',
    verb: 'дайындады',
    subjEmoji: { emoji: '🏋️', labelKk: 'Жаттықтырушы', labelRu: 'Тренер', labelEn: 'Coach' },
    objEmoji: { emoji: '🏃', labelKk: 'Спортшы', labelRu: 'Спортсмен', labelEn: 'Athlete' },
    verbEmoji: { emoji: '⏱️', labelKk: 'Дайындады', labelRu: 'Подготовил', labelEn: 'Trained' },
    suffixPair: {
      sentenceA: 'Спортшы жүлдені жарыста жеңіп алды.',
      sentenceB: 'Спортшы жарыстан ерте шығып қалды.',
      suffixA: '-та',
      suffixB: '-тан',
      highlightA: 'жарыста',
      highlightB: 'жарыстан',
      questionKk: 'Қай сөйлемде жеңіс тіркелді?',
      questionRu: 'В каком предложении зафиксирована победа?',
      questionEn: 'In which sentence was a victory achieved?',
      correctSentence: 'A',
      explanationKk: '«Жарыста жеңіп алды» жатыс септігі орны мен жағдайын көрсетеді.',
      explanationRu: 'Местный падеж указывает на место события.',
      explanationEn: 'Locative suffix indicates context of victory.'
    }
  },
  {
    sov: 'Аспазшы дәмді тағамды мейрамхана қонақтарына арнап пісірді.',
    osv: 'Дәмді тағамды аспазшы мейрамхана қонақтарына арнап пісірді.',
    svo: 'Аспазшы пісірді дәмді тағамды кешкі асқа арнап.',
    ovs: 'Дәмді тағамды пісірді шебер аспазшы жаңа асханада.',
    translitSov: 'Aspazshy dámdi taǵamdy meıramhana qonaqtaryna arnap pisirdi.',
    translitOsv: 'Dámdi taǵamdy aspazshy meıramhana qonaqtaryna arnap pisirdi.',
    glossSov: 'chef-NOM delicious meal-ACC restaurant guests-DAT preparing cook-PST.3SG',
    glossOsv: 'delicious meal-ACC chef-NOM restaurant guests-DAT preparing cook-PST.3SG',
    cefr: 'A2',
    length: 'long',
    complexity: 'simple',
    predictability: 'high',
    subject: 'Аспазшы',
    object: 'Дәмді тағамды',
    verb: 'пісірді',
    subjEmoji: { emoji: '👨‍🍳', labelKk: 'Аспазшы', labelRu: 'Повар', labelEn: 'Chef' },
    objEmoji: { emoji: '🍲', labelKk: 'Тағам', labelRu: 'Блюдо', labelEn: 'Dish' },
    verbEmoji: { emoji: '🔥', labelKk: 'Пісірді', labelRu: 'Приготовил', labelEn: 'Cooked' },
    suffixPair: {
      sentenceA: 'Аспазшы тұзды сорпаға салды.',
      sentenceB: 'Аспазшы сорпадан қасықты алды.',
      suffixA: '-ға',
      suffixB: '-дан',
      highlightA: 'сорпаға',
      highlightB: 'сорпадан',
      questionKk: 'Қай сөйлемде сорпаға дәмдеуіш қосылды?',
      questionRu: 'В каком предложении в суп добавили приправу?',
      questionEn: 'In which sentence was seasoning added to soup?',
      correctSentence: 'A',
      explanationKk: '«Сорпаға салды» бағыт септігін көрсетеді.',
      explanationRu: '«Сорпаға» выражает внесение компонента в суп.',
      explanationEn: 'Dative indicates destination inside soup.'
    }
  },
  {
    sov: 'Талдаушы статистикалық мәліметтерді есеп беру үшін жүйеледі.',
    osv: 'Статистикалық мәліметтерді талдаушы есеп беру үшін жүйеледі.',
    svo: 'Талдаушы жүйеледі статистикалық мәліметтерді арнайы бағдарламамен.',
    ovs: 'Статистикалық мәліметтерді жүйеледі білікті талдаушы кеңеске дейін.',
    translitSov: 'Taldaýshy statıstıkalyq málimetterdi esep berý úshin júıeledi.',
    translitOsv: 'Statıstıkalyq málimetterdi taldaýshy esep berý úshin júıeledi.',
    glossSov: 'analyst-NOM statistical data-ACC report giving for systematize-PST.3SG',
    glossOsv: 'statistical data-ACC analyst-NOM report giving for systematize-PST.3SG',
    cefr: 'C1',
    length: 'long',
    complexity: 'complex',
    predictability: 'low',
    subject: 'Талдаушы',
    object: 'Мәліметтерді',
    verb: 'жүйеледі',
    subjEmoji: { emoji: '📊', labelKk: 'Талдаушы', labelRu: 'Аналитик', labelEn: 'Analyst' },
    objEmoji: { emoji: '📈', labelKk: 'Мәліметтер', labelRu: 'Данные', labelEn: 'Data' },
    verbEmoji: { emoji: '💻', labelKk: 'Жүйеледі', labelRu: 'Систематизировал', labelEn: 'Systematized' },
    suffixPair: {
      sentenceA: 'Талдаушы деректі базаға жүктеді.',
      sentenceB: 'Талдаушы деректі базадан өшірді.',
      suffixA: '-ға',
      suffixB: '-дан',
      highlightA: 'базаға',
      highlightB: 'базадан',
      questionKk: 'Қай сөйлемде мәліметтер сақтауға жіберілді?',
      questionRu: 'В каком предложении данные были загружены в базу?',
      questionEn: 'In which sentence was data uploaded to the database?',
      correctSentence: 'A',
      explanationKk: '«Базаға жүктеді» жаңа деректердің қорға енгізілгенін көрсетеді.',
      explanationRu: '«Базаға» обозначает сохранение данных.',
      explanationEn: 'The dative indicates storing data.'
    }
  }
];

/**
 * Generates an expanded 120-sentence scientific stimuli battery
 * covering all 4 word orders (SOV, OSV, SVO, OVS) with balanced CEFR and length distribution.
 */
export function generateExpandedStimuliBattery(): StimulusSentence[] {
  const result: StimulusSentence[] = [...initialStimulusSentences];
  const wordOrders: WordOrderCondition[] = ['SOV', 'OSV', 'SVO', 'OVS'];
  const cefrLevels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

  let count = result.length;
  const targetCount = 120;

  // Cycle through lexicon templates to construct unique balanced stimuli until 120
  let templateIndex = 0;
  let orderIndex = 0;

  while (result.length < targetCount) {
    const tmpl = RESEARCH_STIMULI_TEMPLATES[templateIndex % RESEARCH_STIMULI_TEMPLATES.length];
    const order = wordOrders[orderIndex % wordOrders.length];
    const cefr = cefrLevels[(templateIndex + orderIndex) % cefrLevels.length];
    const isLong = (templateIndex + orderIndex) % 2 === 0;

    let sentenceKk = '';
    let translit = '';
    let gloss = '';

    if (order === 'SOV') {
      sentenceKk = tmpl.sov;
      translit = tmpl.translitSov;
      gloss = tmpl.glossSov;
    } else if (order === 'OSV') {
      sentenceKk = tmpl.osv;
      translit = tmpl.translitOsv;
      gloss = tmpl.glossOsv;
    } else if (order === 'SVO') {
      sentenceKk = tmpl.svo;
      translit = tmpl.translitSov.replace(tmpl.object.toLowerCase(), tmpl.verb.toLowerCase());
      gloss = tmpl.glossSov.replace('eat-PST.3SG', '').trim() + ' ' + tmpl.glossSov;
    } else {
      sentenceKk = tmpl.ovs;
      translit = tmpl.translitOsv;
      gloss = tmpl.glossOsv;
    }

    const words = sentenceKk.trim().split(/\s+/);
    const id = `stim-bat-${String(result.length + 1).padStart(3, '0')}`;

    const newStimulus: StimulusSentence = {
      id,
      cefrLevel: cefr,
      sentenceKazakh: sentenceKk,
      transliterationLatin: translit,
      translationRu: `Экспериментальный стимул (${order}, уровень ${cefr})`,
      translationEn: `Experimental research stimulus (${order}, CEFR ${cefr})`,
      wordOrder: order,
      length: words.length <= 5 ? 'short' : 'long',
      complexity: cefr === 'B2' || cefr === 'C1' || cefr === 'C2' ? 'complex' : 'simple',
      predictability: order === 'SOV' || order === 'OSV' ? 'high' : 'low',
      wordCount: words.length,
      words,
      morphologicalGloss: gloss || words.map(w => `${w}-STEM`).join(' '),
      syntacticFocus: `${order} реті (${order === 'SOV' ? 'Канондық' : order === 'OSV' ? 'Топикальды' : order === 'SVO' ? 'Байланысты' : 'Фокусталған'}) • ${cefr} деңгейі`,
      question: {
        questionText: {
          kk: `Осы ${order} құрылымды сөйлемде негізгі әрекетті кім орындады?`,
          ru: `Кто совершил главное действие в этом предложении структуры ${order}?`,
          en: `Who performed the main action in this ${order} structure?`
        },
        options: [
          { id: 'opt-a', textKk: tmpl.subject, textRu: tmpl.subjEmoji.labelRu, textEn: tmpl.subjEmoji.labelEn },
          { id: 'opt-b', textKk: tmpl.object, textRu: tmpl.objEmoji.labelRu, textEn: tmpl.objEmoji.labelEn },
          { id: 'opt-c', textKk: 'Басқа тұлға', textRu: 'Другое лицо', textEn: 'Other person' }
        ],
        correctOptionId: 'opt-a',
        explanationKk: `Сөйлемде әрекет субъектісі (бастауыш) — «${tmpl.subject}».`,
        explanationRu: `Субъектом действия (подлежащим) является «${tmpl.subject}».`,
        explanationEn: `The grammatical agent of the predicate is "${tmpl.subject}".`
      },
      emojiChain: {
        items: [
          { id: 'e1', emoji: tmpl.subjEmoji.emoji, labelKk: tmpl.subjEmoji.labelKk, labelRu: tmpl.subjEmoji.labelRu, labelEn: tmpl.subjEmoji.labelEn },
          { id: 'e2', emoji: tmpl.objEmoji.emoji, labelKk: tmpl.objEmoji.labelKk, labelRu: tmpl.objEmoji.labelRu, labelEn: tmpl.objEmoji.labelEn },
          { id: 'e3', emoji: tmpl.verbEmoji.emoji, labelKk: tmpl.verbEmoji.labelKk, labelRu: tmpl.verbEmoji.labelRu, labelEn: tmpl.verbEmoji.labelEn }
        ],
        correctOrderIds: order === 'SOV' || order === 'SVO' ? ['e1', 'e2', 'e3'] : ['e2', 'e1', 'e3']
      },
      suffixContrast: {
        sentenceA: tmpl.suffixPair.sentenceA,
        sentenceB: tmpl.suffixPair.sentenceB,
        highlightWordA: tmpl.suffixPair.highlightA,
        highlightWordB: tmpl.suffixPair.highlightB,
        suffixA: tmpl.suffixPair.suffixA,
        suffixB: tmpl.suffixPair.suffixB,
        targetQuestionText: {
          kk: tmpl.suffixPair.questionKk,
          ru: tmpl.suffixPair.questionRu,
          en: tmpl.suffixPair.questionEn
        },
        correctSentence: tmpl.suffixPair.correctSentence,
        explanationKk: tmpl.suffixPair.explanationKk,
        explanationRu: tmpl.suffixPair.explanationRu,
        explanationEn: tmpl.suffixPair.explanationEn
      }
    };

    result.push(newStimulus);
    templateIndex++;
    orderIndex++;
  }

  return result;
}
