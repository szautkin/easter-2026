import { Component, type ReactNode } from 'react'
import { useGameStore } from '@/store/gameStore'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

class ErrorBoundaryInner extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center gap-6 py-12 px-4 text-center">
          <div className="text-6xl">🐣</div>
          <h2 className="text-2xl font-bold text-blue-primary">Oops! Something went wrong</h2>
          <p className="text-text-secondary max-w-sm">
            Don't worry — your progress is saved. Try going back to the hub.
          </p>
          <div className="flex gap-3">
            <ReturnToHubButton onReset={() => this.setState({ hasError: false, error: null })} />
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-6 py-2 rounded-xl font-bold text-sm bg-gray-200 text-text-primary hover:bg-gray-300 transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

function ReturnToHubButton({ onReset }: { onReset: () => void }) {
  const returnToHub = useGameStore((s) => s.returnToHub)
  return (
    <button
      onClick={() => { returnToHub(); onReset() }}
      className="px-6 py-2 rounded-xl font-bold text-sm bg-blue-primary text-white hover:bg-blue-primary/90 shadow-card transition-all"
    >
      Return to Hub
    </button>
  )
}

export const ErrorBoundary = ErrorBoundaryInner
