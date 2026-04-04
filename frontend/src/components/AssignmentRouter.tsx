import { useGameStore } from '@/store/gameStore'
import { A11_ShedReveal } from '@/components/assignments/A11_ShedReveal'
import { A12_GrandFinale } from '@/components/assignments/A12_GrandFinale'
import { ProgressiveDisclosureAssignment } from '@/components/assignments/ProgressiveDisclosureAssignment'
import { NumberLockAssembly } from '@/components/assignments/NumberLockAssembly'
import { useGameConfig } from '@/hooks/useGameConfig'

const ASSIGNMENT_MAP: Record<number, React.ComponentType> = {
  11: A11_ShedReveal,
  12: A12_GrandFinale,
}

export function AssignmentRouter() {
  const phase = useGameStore((s) => s.phase)
  const currentAssignment = useGameStore((s) => s.currentAssignment)
  const config = useGameConfig()

  if (phase === 'complete' || currentAssignment === null) {
    if (phase === 'complete') {
      return <A12_GrandFinale />
    }
    return null
  }

  // Hardcoded components
  const Component = ASSIGNMENT_MAP[currentAssignment]
  if (Component) {
    return <Component key={currentAssignment} />
  }

  // Config-based routing
  const assignmentConfig = config.assignments.find((a) => a.id === currentAssignment)

  if (assignmentConfig?.type === 'progressive_disclosure') {
    return <ProgressiveDisclosureAssignment key={currentAssignment} assignmentId={currentAssignment} />
  }
  if (assignmentConfig?.type === 'number_lock_assembly') {
    return <NumberLockAssembly key={currentAssignment} assignmentId={currentAssignment} />
  }

  return (
    <div className="text-center py-12 text-text-secondary">
      Assignment {currentAssignment} not found
    </div>
  )
}
