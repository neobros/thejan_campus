import type { Block } from '@/api/types'

export type BlockOf<T extends Block['type']> = Extract<Block, { type: T }>
export type ModuleBlock = BlockOf<'module'>

export interface BlockProps<T extends Block['type']> {
  block: BlockOf<T>
  /** Spacing overrides computed by the renderer (e.g. remove top padding between same-colour sections). */
  className?: string
}

/** Props every dynamic module receives. Modules render their own <ModuleSection>. */
export interface ModuleComponentProps {
  block: ModuleBlock
  className?: string
}

/** Read a typed prop from a module block with a fallback. */
export function moduleProp<T>(block: ModuleBlock, key: string, fallback: T): T {
  const value = block.props?.[key]
  return value === undefined || value === null ? fallback : (value as T)
}
