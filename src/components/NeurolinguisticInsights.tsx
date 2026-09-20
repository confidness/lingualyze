import React, { useState } from 'react';
import { 
  Brain, 
  Layers, 
  GitBranch, 
  Newspaper, 
  Tv, 
  Cpu, 
  Sparkles, 
  ArrowRight, 
  Zap,
  BookOpen,
  CheckCircle2,
  Activity
} from 'lucide-react';
import { LanguageCode } from '../types';
import { translations } from '../data/translations';

interface NeurolinguisticInsightsProps {
  lang: LanguageCode;
}

export const NeurolinguisticInsights: React.FC<NeurolinguisticInsightsProps> = ({ lang }) => {
  const t = translations[lang];
  const [selectedTopic, setSelectedTopic] = useState<'parser' | 'case' | 'erp' | 'bilingual' | 'nlp_media'>('parser');

  const topicTabs = [
    {
      id: 'parser' as const,
      label: lang === 'kk' ? '1. Жұмыс жады парсері' : lang === 'ru' ? '1. Парсер рабочей памяти' : '1. Working Memory Parser',
      icon: <Layers className="w-3.5 h-3.5" />
    },
    {
      id: 'case' as const,
      label: lang === 'kk' ? '2. Агглютинативті септік' : lang === 'ru' ? '2. Агглютинативные падежи' : '2. Agglutinative Case',
      icon: <GitBranch className="w-3.5 h-3.5" />
    },
    {
      id: 'erp' as const,
      label: lang === 'kk' ? '3. ЭЭГ/ERP толқындары' : lang === 'ru' ? '3. ЭЭГ/ERP волны' : '3. ERP (P600/N400)',
      icon: <Activity className="w-3.5 h-3.5" />
    },
    {
      id: 'bilingual' as const,
      label: lang === 'kk' ? '4. Билингвтер миы' : lang === 'ru' ? '4. Билингвальный мозг' : '4. The Bilingual Brain',
      icon: <Brain className="w-3.5 h-3.5" />
    },
    {
      id: 'nlp_media' as const,
      label: lang === 'kk' ? '5. Медиа және NLP' : lang === 'ru' ? '5. Медиа и NLP' : '5. Media, Copy & NLP',
      icon: <Cpu className="w-3.5 h-3.5" />
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      
      {/* Header */}
      <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
            <Brain className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{t.navNeurolinguistics}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            {t.neuroModuleTitle}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
            {t.neuroSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-mono shadow-xs">
          <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded border border-emerald-200 dark:border-emerald-800 font-bold">
            Cognitive Science
          </span>
          <span className="px-2.5 py-1 text-slate-600 dark:text-slate-300 font-medium">
            Applied NLP
          </span>
        </div>
      </div>

      {/* Interactive Topic Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {topicTabs.map(item => (
          <button
            key={item.id}
            onClick={() => setSelectedTopic(item.id)}
            className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer ${
              selectedTopic === item.id
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm font-bold'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-750'
            }`}
          >
            {item.icon}
            <span className="truncate">{item.label}</span>
          </button>
        ))}
      </div>

      {/* TOPIC 1: Head-Final SOV & Working Memory Buffering */}
      {selectedTopic === 'parser' && (
        <section className="space-y-6">
          <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>{t.sovVsOsvTitle}</span>
            </h2>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {t.sovExplanation}
            </p>

            {/* Syntactic Tree Comparison Diagram */}
            <div className="mt-6 p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-4">
              <span className="text-xs font-mono text-emerald-800 dark:text-emerald-300 font-bold uppercase tracking-wider block">
                {lang === 'kk'
                  ? 'Синтаксистік құрылым парсері: SOV (Канондық) және OSV (Ығысқан)'
                  : lang === 'ru'
                  ? 'Синтаксический парсер структуры: SOV (Канонический) против OSV (Топикализированный)'
                  : 'Syntactic Structural Parser: SOV (Canonical) vs OSV (Topicalized)'}
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 font-mono text-xs">
                
                {/* Canonical SOV */}
                <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                  <div className="flex justify-between items-center text-emerald-800 dark:text-emerald-400 font-bold">
                    <span>{lang === 'kk' ? 'КАНОНДЫҚ: SOV' : 'CANONICAL: SOV'}</span>
                    <span className="text-[11px] bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                      {lang === 'kk' ? 'Қайта талдаусыз (0ms)' : 'Zero Reanalysis'}
                    </span>
                  </div>
                  <div className="text-slate-800 dark:text-slate-200 pl-3 border-l-2 border-emerald-500 space-y-1 text-[13px]">
                    <div>[TP</div>
                    <div className="pl-4">[NP-Subj: Мұғалім (Nom)]</div>
                    <div className="pl-4">[vP</div>
                    <div className="pl-8">[NP-Obj: кітапты (Acc)]</div>
                    <div className="pl-8">[V: оқыды (Verb)]</div>
                    <div className="pl-4">]</div>
                    <div>]</div>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-sans leading-relaxed pt-1 border-t border-slate-100 dark:border-slate-800">
                    {lang === 'kk'
                      ? 'Етістік өзінің жанындағы табыс септікті толықтауыш пен бастауышты бірден байланыстырады. Тікелей сызықтық семантикалық рөл бөлу.'
                      : lang === 'ru'
                      ? 'Глагол мгновенно связывает смежное прямое дополнение и подлежащее. Прямое линейное присвоение тематических ролей.'
                      : 'The verb immediately integrates its adjacent accusative object and higher subject. Direct linear theta-role assignment.'}
                  </p>
                </div>

                {/* Topicalized OSV */}
                <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                  <div className="flex justify-between items-center text-teal-800 dark:text-teal-400 font-bold">
                    <span>{lang === 'kk' ? 'ЫҒЫСҚАН: OSV (Топика)' : 'SCRAMBLED: OSV (Topic-Fronted)'}</span>
                    <span className="text-[11px] bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 px-2 py-0.5 rounded border border-teal-200 dark:border-teal-800">
                      +360ms {lang === 'kk' ? 'кідіріс' : 'Latency'}
                    </span>
                  </div>
                  <div className="text-slate-800 dark:text-slate-200 pl-3 border-l-2 border-teal-500 space-y-1 text-[13px]">
                    <div>[TopP</div>
                    <div className="pl-4">[NP-Obj: Кітапты (Acc) <span className="text-teal-600 dark:text-teal-400 font-bold">← Алға шыққан</span>]</div>
                    <div className="pl-4">[TP</div>
                    <div className="pl-8">[NP-Subj: мұғалім (Nom)]</div>
                    <div className="pl-8">[vP [t_Obj] [V: оқыды]]</div>
                    <div className="pl-4">]</div>
                    <div>]</div>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-sans leading-relaxed pt-1 border-t border-slate-100 dark:border-slate-800">
                    {lang === 'kk'
                      ? 'Толықтауыш жұмыс жадында ұсталып, сөйлем соңындағы етістікке дейін буферленеді. Бұл миға қосымша когнитивтік жүктеме түсіреді.'
                      : lang === 'ru'
                      ? 'Объект удерживается в оперативной памяти до достижения глагола для разрешения следа (trace). Вызывает устойчивую когнитивную нагрузку.'
                      : 'The object must be held in working memory until the base trace is resolved at the verb. Triggers sustained cognitive buffer load.'}
                  </p>
                </div>

              </div>
            </div>
          </div>
        </section>
      )}

      {/* TOPIC 2: Agglutinative Case Marking */}
      {selectedTopic === 'case' && (
        <section className="space-y-6">
          <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>{t.caseMarkingTitle}</span>
            </h2>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {t.caseMarkingDesc}
            </p>

            {/* Case Suffix Table */}
            <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/90 font-semibold">
                    <th className="p-3.5">{lang === 'kk' ? 'Септік' : 'Case (Падеж)'}</th>
                    <th className="p-3.5 font-mono">{lang === 'kk' ? 'Жалғаулар' : 'Kazakh Affixes'}</th>
                    <th className="p-3.5">{lang === 'kk' ? 'Тета-рөл (Семантика)' : 'Theta Role'}</th>
                    <th className="p-3.5">{lang === 'kk' ? 'Ығысу кезіндегі парсер рөлі' : 'Parser Role during Scrambling'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900">
                  <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50">
                    <td className="p-3.5 font-bold text-slate-900 dark:text-slate-100">
                      {lang === 'kk' ? 'Табыс септік (Accusative)' : 'Табыс (Accusative)'}
                    </td>
                    <td className="p-3.5 font-mono text-emerald-700 dark:text-emerald-400 font-bold">-ны/-ні, -ды/-ді, -ты/-ті</td>
                    <td className="p-3.5 text-teal-700 dark:text-teal-400 font-medium">Patient / Theme</td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-400">
                      {lang === 'kk'
                        ? 'Сөйлем басында тұрса да бастауышпен шатастырмайды, бірден объект ретінде таниды.'
                        : 'Мгновенно снимает неоднозначность подлежащего при выдвижении в начало предложения (OSV).'}
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50">
                    <td className="p-3.5 font-bold text-slate-900 dark:text-slate-100">
                      {lang === 'kk' ? 'Барыс септік (Dative)' : 'Барыс (Dative)'}
                    </td>
                    <td className="p-3.5 font-mono text-emerald-700 dark:text-emerald-400 font-bold">-ға/-ге, -қа/-ке</td>
                    <td className="p-3.5 text-teal-700 dark:text-teal-400 font-medium">Recipient / Goal</td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-400">
                      {lang === 'kk'
                        ? 'Үш валентті предикатты алдын ала болжайды (беру, айту, жіберу, көрсету).'
                        : 'Активирует ожидание трехвалентного предиката передачи или коммуникации.'}
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50">
                    <td className="p-3.5 font-bold text-slate-900 dark:text-slate-100">
                      {lang === 'kk' ? 'Ілік септік (Genitive)' : 'Ілік (Genitive)'}
                    </td>
                    <td className="p-3.5 font-mono text-emerald-700 dark:text-emerald-400 font-bold">-ның/-нің, -дың/-дің, -тың/-тің</td>
                    <td className="p-3.5 text-teal-700 dark:text-teal-400 font-medium">Possessor</td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-400">
                      {lang === 'kk'
                        ? 'Келесі сөзде міндетті түрде тәуелдік жалғаудың (+сы/+сі) болуын күтеді.'
                        : 'Создает строгое проспективное ожидание определяемого имени с притяжательным аффиксом.'}
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/50">
                    <td className="p-3.5 font-bold text-slate-900 dark:text-slate-100">
                      {lang === 'kk' ? 'Шығыс септік (Ablative)' : 'Шығыс (Ablative)'}
                    </td>
                    <td className="p-3.5 font-mono text-emerald-700 dark:text-emerald-400 font-bold">-нан/-нен, -дан/-ден, -тан/-тен</td>
                    <td className="p-3.5 text-teal-700 dark:text-teal-400 font-medium">Source / Origin</td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-400">
                      {lang === 'kk'
                        ? 'Шығу көзін немесе себепті білдіріп, синтаксистік еркін позицияға ие.'
                        : 'Обозначает источник или исходную точку аргумента с высокой степенью синтаксической мобильности.'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* TOPIC 3: ERP Electrophysiology */}
      {selectedTopic === 'erp' && (
        <section className="space-y-6">
          <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>
                {lang === 'kk' 
                  ? 'Қазақ нейролингвистикасындағы шақырылған потенциалдар (ERP)' 
                  : 'Event-Related Potentials (ERPs) in Kazakh Neurolinguistics'}
              </span>
            </h2>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {lang === 'kk'
                ? 'Қазақ тіліндегі сөйлемдерді оқу кезінде адам бас сүйегінен тіркелетін миллисекундтық электрлік толқындар екі негізгі компонентті көрсетеді:'
                : 'When scalp electrodes measure millisecond-by-millisecond brain voltage changes during Kazakh reading, two primary waveforms emerge:'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="p-5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-800 dark:text-amber-300">
                    N400 (~400ms {lang === 'kk' ? 'теріс толқын' : 'Negative Deflection'})
                  </span>
                  <span className="text-[11px] bg-amber-100 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 px-2.5 py-0.5 rounded border border-amber-300 dark:border-amber-700 font-semibold">
                    {lang === 'kk' ? 'Семантикалық қолжетімділік' : 'Semantic Access'}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {lang === 'kk' ? 'Семантикалық интеграция және болжам сәйкессіздігі' : 'Semantic Integration & Cloze Expectancy'}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {lang === 'kk'
                    ? 'Сөздің менталды лексиконнан алыну қиындығын білдіреді. Байланыс нәтижесіндегі SVO тәртібінде етістіктен кейінгі толықтауышпен кездесу бас сүйектің артқы бөлігінде күшті теріс толқын тудырады.'
                    : 'Reflects the difficulty of accessing a word from mental lexicon. In contact-induced SVO orders, encountering a post-verbal complement triggers a sharp negative deflection due to the premature violation of head-final expectations.'}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-teal-50/60 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-800/60 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-teal-800 dark:text-teal-300">
                    P600 (~600ms {lang === 'kk' ? 'оң толқын' : 'Positive Deflection'})
                  </span>
                  <span className="text-[11px] bg-teal-100 dark:bg-teal-900/60 text-teal-900 dark:text-teal-200 px-2.5 py-0.5 rounded border border-teal-300 dark:border-teal-700 font-semibold">
                    {lang === 'kk' ? 'Синтаксистік түзету' : 'Syntactic Repair'}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {lang === 'kk' ? 'Синтаксистік қайта талдау және құрылымды реттеу' : 'Syntactic Reanalysis & Structural Re-indexing'}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {lang === 'kk'
                    ? 'Құрылымды қайта талдау қиындығын білдіреді. Ығысқан OSV немесе канондық емес OVS сөйлемі етістікке жеткенде, ми септік пен субъект байланысын қайта тексеру үшін айқын оң амплитуда береді.'
                    : 'Reflects structural re-parsing. When a scrambled OSV or non-canonical OVS sentence arrives at the verb, a robust P600 peak appears as the parser checks agreement, links case-marked fronted arguments, and re-orders syntactic hierarchies.'}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TOPIC 4: The Multilingual Brain */}
      {selectedTopic === 'bilingual' && (
        <section className="space-y-6">
          <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Brain className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>
                {lang === 'kk' 
                  ? 'Әлеуметтік лингвистика: Қазақ-орыс қос тілді миы' 
                  : 'Sociolinguistic Dynamics: The Bilingual Kazakh-Russian Mind'}
              </span>
            </h2>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {lang === 'kk'
                ? 'Қазақстан қос тілділік нейролингвистикасы үшін ерекше зерттеу алаңы болып табылады. Орыс тілі негізінен еркін сөз тәртібі бар SVO болса, қазақ тілі қатаң SOV құрылымын талап етеді.'
                : 'Kazakhstan presents a unique natural laboratory for bilingual neurolinguistics. Russian is a predominantly SVO language with free scrambling, whereas Kazakh is strictly SOV.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
                <span className="text-xs font-mono text-emerald-700 dark:text-emerald-400 font-bold uppercase block">
                  {lang === 'kk' ? 'Қазақтілді (L1)' : 'L1 Kazakh Native'}
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {lang === 'kk'
                    ? 'Терең қалыптасқан SOV канондық моделімен жұмыс істейді. Етістіктен кейінгі толықтауышты бірден қабылдамайды, SVO құрылымында ең жоғары P600 толқынын көрсетеді.'
                    : 'Operates with deeply ingrained SOV canonical template. Strongest rejection of post-verbal objects; highest P600 on SVO structures.'}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
                <span className="text-xs font-mono text-teal-700 dark:text-teal-400 font-bold uppercase block">
                  {lang === 'kk' ? 'Теңгерімді билингв' : 'Balanced Bilingual'}
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {lang === 'kk'
                    ? 'Синтаксистік праймингті көрсетеді: орыс тіліндегі SVO тәжірибесі қазақ тіліндегі SVO сөйлемдерін жылдамырақ оқуға мүмкіндік береді (-330ms тезірек).'
                    : 'Demonstrates structural priming: Russian SVO exposure facilitates faster processing of Kazakh SVO sentences (-330ms faster than L1s), showing shared syntactic representations.'}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
                <span className="text-xs font-mono text-amber-700 dark:text-amber-400 font-bold uppercase block">
                  {lang === 'kk' ? 'L2 үйренуші' : 'L2 Kazakh Learner'}
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {lang === 'kk'
                    ? 'Агглютинативті септік жалғауларын автоматты түрде тану әлі қалыптаспаған. OSV және күрделі есімшелерде түсіну деңгейі төмендейді, саналы морфологиялық талдауды қажет етеді.'
                    : 'Lacks automatic agglutinative case decoding. Suffers steep comprehension degradation on OSV and complex participles, requiring conscious morphological decomposition.'}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TOPIC 5: Media, Advertising & NLP Applications */}
      {selectedTopic === 'nlp_media' && (
        <section className="space-y-6">
          <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>{t.applicationsTitle}</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {lang === 'kk' 
                  ? 'Психолингвистикалық эксперимент нәтижелерін медиа, жарнама және жасанды интеллект салаларына енгізу.'
                  : 'Translating psycholinguistic experimental findings into industrial and journalistic practice.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Media & Advertising */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase">
                  <Newspaper className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>
                    {lang === 'kk' ? 'Медиа тақырыптары мен жарнама мәтіндері' : 'Media Headlines & Advertising Copy'}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {lang === 'kk' ? 'Қазақ мәтіндерін когнитивтік оңтайландыру' : 'Cognitive Optimization of Kazakh Text'}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {t.appMediaText}
                </p>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 space-y-1.5 font-mono">
                  <div className="text-emerald-800 dark:text-emerald-400 font-semibold">
                    ✓ {lang === 'kk' ? 'Жылдам жаңалықтар: [Бастауыш] [Толықтауыш] [Етістік] (280мс тезірек оқылады)' : 'Fast News: [Subj] [Obj] [Verb] (280ms faster reading)'}
                  </div>
                  <div className="text-teal-800 dark:text-teal-400 font-semibold">
                    ✓ {lang === 'kk' ? 'Жоғары әсерлі жарнама: [Бренд-ТАБЫС] [Бастауыш] [Етістік] (+18% еске сақтау)' : 'High-Impact Ad: [Brand-ACC] [Subj] [Verb] (+18% recall)'}
                  </div>
                </div>
              </div>

              {/* NLP & AI Dependency Parsing */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400 text-xs font-bold uppercase">
                  <Cpu className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                  <span>
                    {lang === 'kk' ? 'NLP синтаксистік парсерлер және LLM салмақтары' : 'NLP Dependency Parsers & LLM Weights'}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {lang === 'kk' ? 'Адамның реакция уақыты алгоритмдік прайор ретінде' : 'Human Reaction Time as Parsing Prior'}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {t.appNlpText}
                </p>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 space-y-1.5 font-mono">
                  <div className="text-emerald-800 dark:text-emerald-400 font-semibold">
                    ✓ Universal Dependencies (UD_Kazakh-KTB) fine-tuning
                  </div>
                  <div className="text-teal-800 dark:text-teal-400 font-semibold">
                    ✓ Dependency Length Minimization (DLM) validation
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      )}

    </div>
  );
};
