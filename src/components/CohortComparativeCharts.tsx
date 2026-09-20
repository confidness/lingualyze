import React, { useState } from 'react';
import { 
  BarChart3, 
  Box, 
  HelpCircle, 
  Info, 
  TrendingUp, 
  Activity, 
  Zap, 
  CheckCircle2, 
  Layers,
  ArrowUpRight,
  Clock,
  Brain,
  Sparkles
} from 'lucide-react';
import { LanguageCode, LanguageDominanceGroup, WordOrderCondition } from '../types';
import { cohortBenchmarks } from '../data/mockCohorts';
import { SCIENTIFIC_STATISTICAL_BENCHMARKS } from '../utils/statistics';

interface CohortComparativeChartsProps {
  lang: LanguageCode;
  totalTrialCount?: number;
}

type ChartType = 'bar' | 'boxplot';
type MetricView = 'reading_speed' | 'reaction_accuracy' | 'cognitive_load';

export const CohortComparativeCharts: React.FC<CohortComparativeChartsProps> = ({ 
  lang,
  totalTrialCount = 0
}) => {
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [metricView, setMetricView] = useState<MetricView>('reading_speed');
  const [hoveredData, setHoveredData] = useState<{
    cohort: string;
    condition: string;
    value: string;
    sampleSize: number;
    errorMargin?: string;
    details?: string;
    x: number;
    y: number;
  } | null>(null);

  // Cohort metadata
  const cohorts: { id: LanguageDominanceGroup; labelKk: string; labelRu: string; labelEn: string; sampleSize: number; color: string; bgLight: string; border: string }[] = [
    {
      id: 'kazakh_dominant',
      labelKk: 'L1 Қазақ (Ана тілі)',
      labelRu: 'L1 Казахский (Родной)',
      labelEn: 'L1 Kazakh Natives',
      sampleSize: cohortBenchmarks.kazakh_dominant.sampleSize,
      color: '#059669', // emerald-600
      bgLight: 'rgba(5, 150, 105, 0.12)',
      border: 'rgb(5, 150, 105)'
    },
    {
      id: 'bilingual_balanced',
      labelKk: 'Теңгерімді билингвтер',
      labelRu: 'Сбалансированные билингвы',
      labelEn: 'Kazakh-Russian Bilinguals',
      sampleSize: cohortBenchmarks.bilingual_balanced.sampleSize,
      color: '#0284C7', // sky-600
      bgLight: 'rgba(2, 132, 199, 0.12)',
      border: 'rgb(2, 132, 199)'
    },
    {
      id: 'kazakh_l2',
      labelKk: 'L2 Үйренушілер',
      labelRu: 'L2 Изучающие язык',
      labelEn: 'L2 Kazakh Learners',
      sampleSize: cohortBenchmarks.kazakh_l2.sampleSize,
      color: '#D97706', // amber-600
      bgLight: 'rgba(217, 119, 6, 0.12)',
      border: 'rgb(217, 119, 6)'
    }
  ];

  const totalN = cohorts.reduce((sum, c) => sum + c.sampleSize, 0);

  const wordOrders: WordOrderCondition[] = ['SOV', 'OSV', 'SVO', 'OVS'];

  // Dimensions for custom SVG chart
  const svgWidth = 800;
  const svgHeight = 360;
  const padding = { top: 30, right: 30, bottom: 60, left: 70 };
  const chartWidth = svgWidth - padding.left - padding.right;
  const chartHeight = svgHeight - padding.top - padding.bottom;

  // Max value calculation based on metricView
  const getMaxScale = () => {
    switch (metricView) {
      case 'reading_speed':
        return 4200; // ms
      case 'reaction_accuracy':
        return 3400; // ms (or 100 for accuracy)
      case 'cognitive_load':
        return 100; // score 0-100
    }
  };

  const maxVal = getMaxScale();

  const getMetricTitle = () => {
    switch (metricView) {
      case 'reading_speed':
        return lang === 'kk' 
          ? 'Сөз тәртібі бойынша оқу уақыты (Reading Latency, ms)' 
          : lang === 'ru' 
          ? 'Время чтения в зависимости от порядка слов (мс)' 
          : 'Reading Latency by Word Order (ms)';
      case 'reaction_accuracy':
        return lang === 'kk'
          ? 'Жауап беру кідірісі (ms) және Түсіну дәлдігі (%)'
          : lang === 'ru'
          ? 'Задержка ответа (мс) и точность понимания (%)'
          : 'Response Latency (ms) & Comprehension Accuracy (%)';
      case 'cognitive_load':
        return lang === 'kk'
          ? 'Когнитивтік жүктеме индексі (0 - 100)'
          : lang === 'ru'
          ? 'Индекс когнитивной нагрузки (0 - 100)'
          : 'Cognitive Load Index (0 - 100)';
    }
  };

  const getCohortLabel = (c: typeof cohorts[0]) => {
    if (lang === 'kk') return c.labelKk;
    if (lang === 'ru') return c.labelRu;
    return c.labelEn;
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5" />
            <span>
              {lang === 'kk' ? 'Когорталық салыстырмалы талдау' : lang === 'ru' ? 'Сравнительный когортный анализ' : 'Cross-Cohort Comparative Analytics'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            {getMetricTitle()}
          </h2>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
              <span>{lang === 'kk' ? 'Жалпы таңдама:' : lang === 'ru' ? 'Выборка:' : 'Total Sample:'}</span>
              <strong className="text-emerald-700 dark:text-emerald-400">N = {totalN}</strong>
              <span className="text-slate-400 dark:text-slate-500">
                (L1: n=45, Bilingual: n=48, L2: n=32)
              </span>
            </span>
            {totalTrialCount > 0 && (
              <span className="text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-1 rounded-md border border-emerald-200 dark:border-emerald-800">
                +{totalTrialCount} {lang === 'kk' ? 'тікелей сынақ' : 'live trials'}
              </span>
            )}
          </div>
        </div>

        {/* Action Controls: Metric Selector & Chart Type Toggle */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Metric Selector Buttons */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <button
              onClick={() => setMetricView('reading_speed')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                metricView === 'reading_speed'
                  ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {lang === 'kk' ? '1. Оқу жылдамдығы' : lang === 'ru' ? '1. Время чтения' : '1. Reading Speed'}
            </button>
            <button
              onClick={() => setMetricView('reaction_accuracy')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                metricView === 'reaction_accuracy'
                  ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {lang === 'kk' ? '2. Реакция және Дәлдік' : lang === 'ru' ? '2. Задержка и Точность' : '2. Latency & Accuracy'}
            </button>
            <button
              onClick={() => setMetricView('cognitive_load')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                metricView === 'cognitive_load'
                  ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {lang === 'kk' ? '3. Когнитивтік жүктеме' : lang === 'ru' ? '3. Когнитивная нагрузка' : '3. Cognitive Load'}
            </button>
          </div>

          {/* Chart Type Toggle (Bar vs Boxplot) */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <button
              onClick={() => setChartType('bar')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                chartType === 'bar'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title="Grouped Bar Chart with Standard Error (SE) error bars"
            >
              <BarChart3 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{lang === 'kk' ? 'Бағаналар (±SE)' : lang === 'ru' ? 'Столбцы (±SE)' : 'Bars (±SE)'}</span>
            </button>
            <button
              onClick={() => setChartType('boxplot')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                chartType === 'boxplot'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title="Box & Whisker Plot showing Min, Q1, Median, Q3, Max, and IQR"
            >
              <Box className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span>{lang === 'kk' ? 'Бокс-плот (IQR)' : lang === 'ru' ? 'Бокс-плот (IQR)' : 'Box Plot (IQR)'}</span>
            </button>
          </div>

        </div>
      </div>

      {/* Cohort Legend Pills */}
      <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
        {cohorts.map(c => (
          <div key={c.id} className="flex items-center gap-2">
            <span 
              className="w-3.5 h-3.5 rounded-sm shadow-xs border"
              style={{ backgroundColor: c.color, borderColor: c.border }}
            />
            <span className="text-slate-800 dark:text-slate-200">
              {getCohortLabel(c)}
            </span>
            <span className="text-slate-400 font-mono text-[11px]">
              (n = {c.sampleSize})
            </span>
          </div>
        ))}
        <div className="ml-auto text-xs font-mono text-slate-400 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5" />
          <span>
            {chartType === 'bar' 
              ? 'Whiskers = ±1 Standard Error (SE)' 
              : 'Box = Q1–Q3 (IQR), Line = Median, Whiskers = Range'}
          </span>
        </div>
      </div>

      {/* Main Interactive SVG Canvas */}
      <div className="relative w-full bg-slate-50/60 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800 p-2 sm:p-4 overflow-x-auto">
        <svg 
          viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
          className="w-full h-auto min-w-[650px] select-none"
        >
          {/* Grid lines and Y-axis labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
            const y = padding.top + chartHeight - ratio * chartHeight;
            const valueLabel = metricView === 'cognitive_load' 
              ? Math.round(ratio * maxVal)
              : Math.round(ratio * maxVal);
            return (
              <g key={idx}>
                <line 
                  x1={padding.left} 
                  y1={y} 
                  x2={padding.left + chartWidth} 
                  y2={y} 
                  stroke="currentColor" 
                  className="text-slate-200 dark:text-slate-700/80" 
                  strokeDasharray="4 4" 
                  strokeWidth="1"
                />
                <text 
                  x={padding.left - 12} 
                  y={y + 4} 
                  textAnchor="end" 
                  className="text-[11px] font-mono fill-slate-400 dark:fill-slate-500"
                >
                  {valueLabel}{metricView === 'cognitive_load' ? '' : ' ms'}
                </text>
              </g>
            );
          })}

          {/* X Axis Baseline */}
          <line 
            x1={padding.left} 
            y1={padding.top + chartHeight} 
            x2={padding.left + chartWidth} 
            y2={padding.top + chartHeight} 
            stroke="currentColor" 
            className="text-slate-300 dark:text-slate-600" 
            strokeWidth="1.5"
          />

          {/* Grouped Conditions */}
          {wordOrders.map((condition, condIdx) => {
            const groupWidth = chartWidth / wordOrders.length;
            const groupStartX = padding.left + condIdx * groupWidth;
            const groupCenterX = groupStartX + groupWidth / 2;

            // Bar or boxplot geometry inside each group
            const barWidth = 36;
            const gap = 12;
            const totalBarsWidth = cohorts.length * barWidth + (cohorts.length - 1) * gap;
            const barsStartX = groupCenterX - totalBarsWidth / 2;

            return (
              <g key={condition}>
                {/* Condition X-axis label */}
                <text 
                  x={groupCenterX} 
                  y={padding.top + chartHeight + 24} 
                  textAnchor="middle" 
                  className="text-xs font-black font-mono fill-slate-800 dark:fill-slate-200"
                >
                  {condition}
                </text>
                <text 
                  x={groupCenterX} 
                  y={padding.top + chartHeight + 40} 
                  textAnchor="middle" 
                  className="text-[10px] font-semibold fill-slate-500 dark:fill-slate-400"
                >
                  {condition === 'SOV' 
                    ? (lang === 'kk' ? 'Канондық (S-O-V)' : 'Canonical') 
                    : condition === 'OSV' 
                    ? (lang === 'kk' ? 'Скремблинг (O-S-V)' : 'Scrambled Focus') 
                    : condition === 'SVO' 
                    ? (lang === 'kk' ? 'Түйісулік (S-V-O)' : 'Contact Order') 
                    : (lang === 'kk' ? 'Инверсия (O-V-S)' : 'Inversion')}
                </text>

                {/* Vertical subtle divider between conditions */}
                {condIdx < wordOrders.length - 1 && (
                  <line 
                    x1={groupStartX + groupWidth} 
                    y1={padding.top} 
                    x2={groupStartX + groupWidth} 
                    y2={padding.top + chartHeight} 
                    stroke="currentColor" 
                    className="text-slate-200 dark:text-slate-800" 
                    strokeDasharray="2 2"
                  />
                )}

                {/* Render Cohorts for this Condition */}
                {cohorts.map((cohort, cohortIdx) => {
                  const m = cohortBenchmarks[cohort.id].conditionMetrics[condition];
                  const barX = barsStartX + cohortIdx * (barWidth + gap);

                  // Decide values based on metricView
                  let primaryVal = m.meanReadingTimeMs;
                  let seVal = m.stdErrorMs;
                  let secondaryVal = `${m.accuracyPercent}%`;
                  let valLabel = `${m.meanReadingTimeMs} ms`;

                  if (metricView === 'reaction_accuracy') {
                    primaryVal = m.reactionTimeMs;
                    seVal = Math.round(m.stdErrorMs * 0.85);
                    valLabel = `${m.reactionTimeMs} ms (${m.accuracyPercent}%)`;
                  } else if (metricView === 'cognitive_load') {
                    primaryVal = m.cognitiveLoadScore;
                    seVal = 3.5;
                    valLabel = `${m.cognitiveLoadScore} / 100`;
                  }

                  const primaryHeight = (primaryVal / maxVal) * chartHeight;
                  const barY = padding.top + chartHeight - primaryHeight;

                  // Error bar coordinates (for Bar Chart)
                  const seHeight = (seVal / maxVal) * chartHeight;
                  const errTopY = Math.max(padding.top, barY - seHeight);
                  const errBottomY = Math.min(padding.top + chartHeight, barY + seHeight);
                  const errCenterX = barX + barWidth / 2;

                  // Box plot coordinates (for Boxplot Mode)
                  const medianVal = m.medianReadingTimeMs || m.meanReadingTimeMs;
                  const q1Val = m.q1ReadingTimeMs || (m.meanReadingTimeMs - m.stdErrorMs * 2);
                  const q3Val = m.q3ReadingTimeMs || (m.meanReadingTimeMs + m.stdErrorMs * 2);
                  const minVal = m.minReadingTimeMs || (m.meanReadingTimeMs - m.stdErrorMs * 4);
                  const maxPlotVal = m.maxReadingTimeMs || (m.meanReadingTimeMs + m.stdErrorMs * 4);

                  const medianY = padding.top + chartHeight - (medianVal / maxVal) * chartHeight;
                  const q1Y = padding.top + chartHeight - (q1Val / maxVal) * chartHeight;
                  const q3Y = padding.top + chartHeight - (q3Val / maxVal) * chartHeight;
                  const minY = padding.top + chartHeight - (minVal / maxVal) * chartHeight;
                  const maxY = padding.top + chartHeight - (maxPlotVal / maxVal) * chartHeight;

                  if (chartType === 'bar') {
                    return (
                      <g 
                        key={cohort.id} 
                        className="cursor-pointer group"
                        onMouseEnter={() => {
                          setHoveredData({
                            cohort: getCohortLabel(cohort),
                            condition: `${condition} (${condition === 'SOV' ? 'Канондық' : 'Скремблинг'})`,
                            value: valLabel,
                            sampleSize: cohort.sampleSize,
                            errorMargin: `±${seVal}${metricView === 'cognitive_load' ? ' pts' : ' ms'} (SE)`,
                            details: metricView === 'reading_speed' 
                              ? (condition === 'OSV' ? `+${cohort.id === 'kazakh_dominant' ? '22.2%' : cohort.id === 'kazakh_l2' ? '23.8%' : '25.5%'} vs SOV` : 'Базалық калибрлеу')
                              : `Дәлдік: ${m.accuracyPercent}%`,
                            x: barX + barWidth / 2,
                            y: barY
                          });
                        }}
                        onMouseLeave={() => setHoveredData(null)}
                      >
                        {/* Bar Body */}
                        <rect
                          x={barX}
                          y={barY}
                          width={barWidth}
                          height={primaryHeight}
                          rx={6}
                          fill={cohort.color}
                          fillOpacity={0.88}
                          className="transition-all group-hover:fill-opacity-100 group-hover:brightness-105"
                        />

                        {/* Top Accent Stripe */}
                        <rect
                          x={barX}
                          y={barY}
                          width={barWidth}
                          height={3}
                          rx={1.5}
                          fill="#FFFFFF"
                          fillOpacity={0.6}
                        />

                        {/* Value Text on Bar */}
                        {primaryHeight > 45 && (
                          <text
                            x={barX + barWidth / 2}
                            y={barY + 18}
                            textAnchor="middle"
                            className="text-[10px] font-mono font-bold fill-white pointer-events-none drop-shadow-xs"
                          >
                            {metricView === 'cognitive_load' ? primaryVal : Math.round(primaryVal)}
                          </text>
                        )}

                        {/* Standard Error (SE) Whisker Line */}
                        <line
                          x1={errCenterX}
                          y1={errTopY}
                          x2={errCenterX}
                          y2={errBottomY}
                          stroke="#0F172A"
                          className="dark:stroke-slate-100"
                          strokeWidth="1.5"
                        />
                        {/* Top crossbar of SE */}
                        <line
                          x1={errCenterX - 6}
                          y1={errTopY}
                          x2={errCenterX + 6}
                          y2={errTopY}
                          stroke="#0F172A"
                          className="dark:stroke-slate-100"
                          strokeWidth="1.5"
                        />
                        {/* Bottom crossbar of SE */}
                        <line
                          x1={errCenterX - 6}
                          y1={errBottomY}
                          x2={errCenterX + 6}
                          y2={errBottomY}
                          stroke="#0F172A"
                          className="dark:stroke-slate-100"
                          strokeWidth="1.5"
                        />
                      </g>
                    );
                  } else {
                    // Box Plot View
                    const boxTop = q3Y;
                    const boxBottom = q1Y;
                    const boxH = Math.max(4, boxBottom - boxTop);

                    return (
                      <g 
                        key={cohort.id} 
                        className="cursor-pointer group"
                        onMouseEnter={() => {
                          setHoveredData({
                            cohort: getCohortLabel(cohort),
                            condition: `${condition}`,
                            value: `Медиана: ${medianVal} ms (IQR: ${q1Val}–${q3Val} ms)`,
                            sampleSize: cohort.sampleSize,
                            errorMargin: `Диапазон: [${minVal} - ${maxPlotVal} ms]`,
                            details: `Дәлдік: ${m.accuracyPercent}%, Жүктеме: ${m.cognitiveLoadScore}/100`,
                            x: barX + barWidth / 2,
                            y: boxTop
                          });
                        }}
                        onMouseLeave={() => setHoveredData(null)}
                      >
                        {/* Upper Whisker (Q3 to Max) */}
                        <line
                          x1={errCenterX}
                          y1={boxTop}
                          x2={errCenterX}
                          y2={maxY}
                          stroke={cohort.color}
                          strokeWidth="1.5"
                          strokeDasharray="2 2"
                        />
                        <line
                          x1={errCenterX - 6}
                          y1={maxY}
                          x2={errCenterX + 6}
                          y2={maxY}
                          stroke={cohort.color}
                          strokeWidth="2"
                        />

                        {/* Lower Whisker (Min to Q1) */}
                        <line
                          x1={errCenterX}
                          y1={boxBottom}
                          x2={errCenterX}
                          y2={minY}
                          stroke={cohort.color}
                          strokeWidth="1.5"
                          strokeDasharray="2 2"
                        />
                        <line
                          x1={errCenterX - 6}
                          y1={minY}
                          x2={errCenterX + 6}
                          y2={minY}
                          stroke={cohort.color}
                          strokeWidth="2"
                        />

                        {/* IQR Box (Q1 to Q3) */}
                        <rect
                          x={barX}
                          y={boxTop}
                          width={barWidth}
                          height={boxH}
                          rx={3}
                          fill={cohort.color}
                          fillOpacity={0.25}
                          stroke={cohort.color}
                          strokeWidth="2"
                          className="transition-all group-hover:fill-opacity-40"
                        />

                        {/* Median Line */}
                        <line
                          x1={barX}
                          y1={medianY}
                          x2={barX + barWidth}
                          y2={medianY}
                          stroke={cohort.color}
                          strokeWidth="3.5"
                        />

                        {/* Mean dot indicator */}
                        <circle
                          cx={errCenterX}
                          cy={barY}
                          r={3.5}
                          fill="#FFFFFF"
                          stroke={cohort.color}
                          strokeWidth="2"
                        />
                      </g>
                    );
                  }
                })}
              </g>
            );
          })}
        </svg>

        {/* Floating Tooltip */}
        {hoveredData && (
          <div 
            className="absolute z-20 pointer-events-none p-3 rounded-xl bg-slate-900/95 dark:bg-slate-950 text-white shadow-xl text-xs space-y-1 font-mono border border-slate-700/80 animate-in fade-in zoom-in-95 duration-150"
            style={{ 
              left: `${Math.min(75, Math.max(10, (hoveredData.x / svgWidth) * 100))}%`,
              top: '15px'
            }}
          >
            <div className="flex items-center justify-between gap-4">
              <span className="font-bold text-emerald-400">{hoveredData.cohort}</span>
              <span className="text-slate-400">n={hoveredData.sampleSize}</span>
            </div>
            <div className="font-bold text-slate-100 text-sm">
              {hoveredData.condition}: {hoveredData.value}
            </div>
            {hoveredData.errorMargin && (
              <div className="text-[11px] text-slate-300">
                Дисперсия: {hoveredData.errorMargin}
              </div>
            )}
            {hoveredData.details && (
              <div className="text-[10px] text-teal-300 font-sans border-t border-slate-800 pt-1 mt-1">
                {hoveredData.details}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3 Core Statistical Differential Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        
        {/* Differential 1: OSV vs SOV (L1 Native Cost) */}
        <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
              {lang === 'kk' ? '1. Скремблинг кідірісі (L1)' : lang === 'ru' ? '1. Задержка скремблинга (L1)' : '1. OSV Scrambling Cost'}
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-600 text-white">
              {SCIENTIFIC_STATISTICAL_BENCHMARKS.osvVsSovL1PValue}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-emerald-900 dark:text-emerald-200">
              +{SCIENTIFIC_STATISTICAL_BENCHMARKS.osvVsSovL1Percent}%
            </span>
            <span className="text-xs text-slate-600 dark:text-slate-400">
              (+360 ms латенттілік)
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {lang === 'kk'
              ? 'L1 ана тілі тобында нысанның алға шығуы (OSV) канондық SOV-қа қарағанда өңдеу уақытын +22.2%-ға ұзартады. Баяндауыш сөйлем соңында келгенше буферде сақтау қажет.'
              : lang === 'ru'
              ? 'В группе L1 вынос дополнения вперед (OSV) увеличивает время чтения на +22.2% по сравнению с SOV из-за удержания актанта в рабочей памяти.'
              : 'In L1 speakers, fronting the object (OSV) imposes a +22.2% latency cost due to working memory buffering before encountering the verb.'}
          </p>
        </div>

        {/* Differential 2: Russian Contact Priming in Bilinguals */}
        <div className="p-4 rounded-2xl bg-sky-50/50 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-800 dark:text-sky-300 uppercase tracking-wider">
              {lang === 'kk' ? '2. Билингвтер түйісуі (SVO)' : lang === 'ru' ? '2. Прайминг билингвов (SVO)' : '2. Bilingual SVO Priming'}
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-sky-600 text-white">
              {SCIENTIFIC_STATISTICAL_BENCHMARKS.svoVsOsvBilingualPValue}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-sky-900 dark:text-sky-200">
              {SCIENTIFIC_STATISTICAL_BENCHMARKS.svoVsOsvBilingualPercent}%
            </span>
            <span className="text-xs text-slate-600 dark:text-slate-400">
              (-360 ms OSV-мен салыстырғанда)
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {lang === 'kk'
              ? 'Теңгерімді билингвтерде SVO байланысы OSV скремблингіне қарағанда 15.6%-ға тезірек оқылады (1950 ms vs 2310 ms). Бұл орыс тіліндегі канондық SVO синтаксисінің көлденең әсерін дәлелдейді.'
              : lang === 'ru'
              ? 'У билингвов порядок SVO обрабатывается на 15.6% быстрее, чем OSV (1950 против 2310 мс), что подтверждает синтаксический трансфер из русского языка.'
              : 'Balanced bilinguals process SVO 15.6% faster than OSV (1950 ms vs 2310 ms), confirming cross-linguistic syntactic transfer from Russian.'}
          </p>
        </div>

        {/* Differential 3: L2 Learner Scrambling Penalty */}
        <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
              {lang === 'kk' ? '3. L2 Үйренушілер шығыны' : lang === 'ru' ? '3. Нагрузка L2 (OSV)' : '3. L2 Scrambling Penalty'}
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-600 text-white">
              {SCIENTIFIC_STATISTICAL_BENCHMARKS.osvVsSovL2PValue}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-amber-900 dark:text-amber-200">
              +{SCIENTIFIC_STATISTICAL_BENCHMARKS.osvVsSovL2Percent}%
            </span>
            <span className="text-xs text-slate-600 dark:text-slate-400">
              (Дәлдік: -12.9% төмендейді)
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {lang === 'kk'
              ? 'L2 тобында сөйлем құрылымы өзгергенде оқу уақыты 3280 ms-ге дейін артып, дұрыс жауап беру үлесі 81.5%-дан 71.0%-ға құлдырайды. Агглютинативті септік жалғауларын тану қиындығы бар.'
              : lang === 'ru'
              ? 'У изучающих казахский (L2) скремблинг замедляет чтение до 3280 мс, а точность падает на 12.9% из-за перегрузки при распознавании падежей.'
              : 'In L2 learners, OSV increases reading latency to 3280 ms and reduces accuracy by 12.9% due to morphological case disambiguation load.'}
          </p>
        </div>

      </div>

    </div>
  );
};
