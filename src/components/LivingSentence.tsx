import React, { useEffect, useState } from 'react';
import { motion, MotionConfig } from 'motion/react';
import { LanguageCode, WordOrderCondition } from '../types';

// The hypothesis in one picture: the same sentence in four word orders, verb tile in gold.
const ORDERS: Record<WordOrderCondition, ('S' | 'O' | 'V')[]> = {
  SOV: ['S', 'O', 'V'],
  OSV: ['O', 'S', 'V'],
  SVO: ['S', 'V', 'O'],
  OVS: ['O', 'V', 'S'],
};
const WORDS = { S: 'бала', O: 'алманы', V: 'жеді' };

export const LivingSentence: React.FC<{ lang: LanguageCode }> = ({ lang }) => {
  const tr = (kk: string, ru: string, en: string) => (lang === 'kk' ? kk : lang === 'ru' ? ru : en);
  const roles = {
    S: tr('бастауыш', 'подлежащее', 'subject'),
    O: tr('толықтауыш', 'дополнение', 'object'),
    V: tr('баяндауыш', 'сказуемое', 'verb'),
  };
  const orderIds = Object.keys(ORDERS) as WordOrderCondition[];

  const [order, setOrder] = useState<WordOrderCondition>('SOV');
  const [autoplay, setAutoplay] = useState(
    () => typeof window === 'undefined' || !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    if (!autoplay) return;
    const id = window.setInterval(() => {
      setOrder(o => orderIds[(orderIds.indexOf(o) + 1) % orderIds.length]);
    }, 2600);
    return () => window.clearInterval(id);
  }, [autoplay]);

  return (
    <MotionConfig reducedMotion="user">
      <figure className="rounded-3xl bg-emerald-600 text-white p-4 sm:p-8">
        <ol className="flex flex-wrap items-start gap-2 sm:gap-3" aria-live="polite" aria-label={`${order}: ${ORDERS[order].map(r => WORDS[r]).join(' ')}`}>
          {ORDERS[order].map(role => (
            <motion.li
              key={role}
              layout
              transition={{ type: 'spring', stiffness: 420, damping: 32 }}
              className="flex flex-col items-start gap-1.5"
            >
              <span
                lang="kk"
                className={`font-display text-sm sm:text-lg xl:text-xl font-semibold px-2.5 sm:px-3.5 py-2 rounded-xl ${
                  role === 'V' ? 'bg-gold text-slate-900' : 'bg-white text-emerald-800'
                }`}
              >
                {WORDS[role]}
              </span>
              <span className="text-xs text-emerald-100 pl-1">{roles[role]}</span>
            </motion.li>
          ))}
        </ol>

        <figcaption className="mt-6 space-y-3">
          <p className="text-sm text-emerald-50 leading-relaxed min-h-[2.75rem]">
            {order === 'SOV'
              ? tr('Әдеттегі тәртіп. Мағынасы: бала алманы жеді.', 'Обычный порядок. Смысл: мальчик съел яблоко.', 'The usual order. Meaning: the boy ate the apple.')
              : tr('Сөздердің орны ауысты, мағынасы өзгерген жоқ. Оқу баяулай ма?', 'Слова переставлены, смысл тот же. Замедлится ли чтение?', 'Same meaning, words moved. Does reading slow down?')}
          </p>
          <div className="flex flex-wrap gap-1.5" role="group" aria-label={tr('Сөз тәртібін таңдау', 'Выбрать порядок слов', 'Choose a word order')}>
            {orderIds.map(id => (
              <button
                key={id}
                type="button"
                aria-pressed={order === id}
                onClick={() => { setAutoplay(false); setOrder(id); }}
                className={`px-3 py-1 rounded-lg font-mono text-xs font-bold transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                  order === id ? 'bg-white text-emerald-800' : 'bg-emerald-700/60 text-emerald-50 hover:bg-emerald-700'
                }`}
              >
                {id}
              </button>
            ))}
          </div>
        </figcaption>
      </figure>
    </MotionConfig>
  );
};
