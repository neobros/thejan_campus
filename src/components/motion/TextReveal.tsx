import { motion } from 'motion/react'
import { Fragment } from 'react'
import { cn } from '@/lib/cn'
import { EASE_OUT_EXPO } from '@/lib/motion'

interface TextRevealProps {
  text: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  className?: string
  /** Classes for words wrapped in *asterisks* (e.g. italic accent). */
  emphasisClassName?: string
  delay?: number
  stagger?: number
  id?: string
}

/**
 * Headline that rises in word by word. Words wrapped in *asterisks* get the emphasis style.
 * Text stays real, selectable text for screen readers and search engines.
 */
export function TextReveal({
  text,
  as: Tag = 'h1',
  className,
  emphasisClassName = 'italic text-gradient-gold animate-gradient',
  delay = 0,
  stagger = 0.06,
  id,
}: TextRevealProps) {
  const tokens: { word: string; emphasis: boolean }[] = []
  let emphasis = false
  for (const raw of text.split(/\s+/).filter(Boolean)) {
    let word = raw
    const starts = word.startsWith('*')
    const ends = word.endsWith('*') && word.length > 1
    if (starts) {
      emphasis = true
      word = word.slice(1)
    }
    if (ends) word = word.slice(0, -1)
    tokens.push({ word, emphasis })
    if (ends) emphasis = false
  }

  return (
    <Tag id={id} className={className}>
      {tokens.map((token, index) => (
        <Fragment key={index}>
          <span className="inline-block overflow-hidden pb-[0.14em] -mb-[0.14em] align-bottom">
            <motion.span
              className={cn('inline-block will-change-transform', token.emphasis && emphasisClassName)}
              initial={{ y: '105%', rotate: 3, opacity: 0 }}
              animate={{ y: '0%', rotate: 0, opacity: 1 }}
              transition={{ duration: 0.9, ease: EASE_OUT_EXPO, delay: delay + index * stagger }}
            >
              {token.word}
            </motion.span>
          </span>{' '}
        </Fragment>
      ))}
    </Tag>
  )
}
