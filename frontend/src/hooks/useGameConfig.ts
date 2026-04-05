import { useMemo } from 'react'
import type { GameConfig, Assignment } from '@/types'
import configData from '@/config/easter-2026-config.json'

const config = configData as unknown as GameConfig

export function useGameConfig(): GameConfig {
  return config
}

export function useAssignment(id: number): Assignment | undefined {
  return useMemo(
    () => config.assignments.find((a) => a.id === id),
    [id],
  )
}
