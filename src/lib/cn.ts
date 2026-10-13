import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

// Teach tailwind-merge about project-specific utilities so they are not mistaken for colours
// (e.g. `bg-grid` must not cancel out `bg-canvas`).
const twMerge = extendTailwindMerge<'text-gradient'>({
  extend: {
    classGroups: {
      'font-family': [{ font: ['display'] }],
      'bg-image': [{ bg: ['grid', 'dots', 'noise'] }],
      'text-gradient': ['text-gradient-gold'],
      shadow: [{ shadow: ['card', 'card-hover', 'float'] }],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
