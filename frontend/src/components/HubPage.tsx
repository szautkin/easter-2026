import { useGameStore } from '@/store/gameStore'
import { useGameConfig } from '@/hooks/useGameConfig'
import { Lock, Unlock, Key, Type, Hash } from 'lucide-react'
import { cn } from '@/lib/utils'

const FLOATING_ITEMS = [
  { emoji: '🥚', style: 'top-[5%] left-[8%] text-2xl animate-float', delay: '0s' },
  { emoji: '🐰', style: 'top-[3%] right-[10%] text-3xl animate-float', delay: '0.5s' },
  { emoji: '🥚', style: 'top-[18%] left-[3%] text-xl animate-float', delay: '1.2s' },
  { emoji: '🐣', style: 'top-[12%] right-[5%] text-xl animate-float', delay: '0.8s' },
  { emoji: '🌸', style: 'bottom-[15%] left-[6%] text-2xl animate-float', delay: '1.5s' },
  { emoji: '🥚', style: 'bottom-[20%] right-[8%] text-xl animate-float', delay: '0.3s' },
  { emoji: '🐇', style: 'bottom-[8%] left-[12%] text-2xl animate-float', delay: '1s' },
  { emoji: '🌷', style: 'top-[30%] right-[3%] text-xl animate-float', delay: '1.8s' },
  { emoji: '🥚', style: 'bottom-[35%] left-[2%] text-lg animate-float', delay: '0.6s' },
  { emoji: '🐰', style: 'bottom-[5%] right-[15%] text-xl animate-float', delay: '1.3s' },
]

export function HubPage() {
  const config = useGameConfig()
  const wordPathComplete = useGameStore((s) => s.wordPathComplete)
  const numberPathComplete = useGameStore((s) => s.numberPathComplete)
  const eggKeyFound = useGameStore((s) => s.eggKeyFound)
  const enterWordPath = useGameStore((s) => s.enterWordPath)
  const enterNumberPath = useGameStore((s) => s.enterNumberPath)
  const markEggKeyFound = useGameStore((s) => s.markEggKeyFound)
  const startFinale = useGameStore((s) => s.startFinale)

  const bothComplete = wordPathComplete && numberPathComplete

  const wordCode = config.codes.wordLock.value
  const numberValues = config.codes.numberLock.values
  const numberCode = numberValues.join('-')

  const handleOpenTreasure = () => {
    startFinale()
  }

  return (
    <div className="relative flex flex-col items-center gap-6 py-6 px-4 max-w-lg mx-auto min-h-[70vh]">
      {/* Floating background decorations */}
      {FLOATING_ITEMS.map((item, i) => (
        <span
          key={i}
          className={cn('absolute pointer-events-none opacity-20', item.style)}
          style={{ animationDelay: item.delay }}
        >
          {item.emoji}
        </span>
      ))}

      {/* Bunny header */}
      <div className="text-center space-y-2 relative z-10">
        <div className="text-5xl animate-float">🐰</div>
        <h1 className="text-3xl font-bold text-blue-primary">You have three locks!</h1>
        <p className="text-text-secondary">Open the Yellow Chest with my Treasure</p>
        <div className="flex justify-center gap-2 text-lg">
          <span>🥚</span><span>🌸</span><span>🐣</span><span>🌷</span><span>🥚</span>
        </div>
      </div>

      {/* Three Lock Status Cards */}
      <div className="flex items-stretch gap-3 w-full relative z-10">
        {/* Egg Key Lock */}
        <button
          onClick={() => !eggKeyFound && markEggKeyFound()}
          className={cn(
            'flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all',
            eggKeyFound
              ? 'bg-success/10 border-success/30'
              : 'bg-white border-blue-light/30 shadow-card hover:border-blue-primary',
          )}
        >
          <Key className={cn('w-8 h-8', eggKeyFound ? 'text-success' : 'text-blue-primary')} />
          <span className="text-xs font-bold text-text-secondary">Egg Key</span>
          {eggKeyFound ? (
            <Unlock className="w-5 h-5 text-success" />
          ) : (
            <Lock className="w-5 h-5 text-blue-light" />
          )}
        </button>

        {/* Word Lock Status */}
        <div className={cn(
          'flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl border-2',
          wordPathComplete
            ? 'bg-success/10 border-success/30'
            : 'bg-white border-blue-light/30',
        )}>
          <Type className={cn('w-8 h-8', wordPathComplete ? 'text-success' : 'text-blue-primary')} />
          <span className="text-xs font-bold text-text-secondary">Word Lock</span>
          {wordPathComplete ? (
            <div className="flex gap-0.5">
              {wordCode.split('').map((l, i) => (
                <span key={i} className="w-5 h-6 flex items-center justify-center text-[10px] font-bold bg-yellow-accent text-blue-primary rounded">
                  {l}
                </span>
              ))}
            </div>
          ) : (
            <div className="flex gap-0.5">
              {[0,1,2,3].map((i) => (
                <span key={i} className="w-5 h-6 flex items-center justify-center text-[10px] text-blue-light border border-dashed border-blue-light rounded">
                  ?
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Number Lock Status */}
        <div className={cn(
          'flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl border-2',
          numberPathComplete
            ? 'bg-success/10 border-success/30'
            : 'bg-white border-blue-light/30',
        )}>
          <Hash className={cn('w-8 h-8', numberPathComplete ? 'text-success' : 'text-blue-primary')} />
          <span className="text-xs font-bold text-text-secondary">Number Lock</span>
          {numberPathComplete ? (
            <span className="text-[10px] font-bold font-mono text-blue-primary">{numberCode}</span>
          ) : (
            <span className="text-[10px] font-mono text-blue-light">??-??-??</span>
          )}
        </div>
      </div>

      {/* Path Tiles */}
      <div className="flex flex-col gap-4 w-full relative z-10">
        {/* Word Lock Tile */}
        <button
          onClick={wordPathComplete ? undefined : enterWordPath}
          disabled={wordPathComplete}
          className={cn(
            'w-full p-6 rounded-2xl border-2 text-left transition-all',
            wordPathComplete
              ? 'bg-success/10 border-success/30'
              : 'bg-white border-blue-light/30 shadow-card hover:shadow-card-hover hover:border-blue-primary active:scale-[0.98]',
          )}
        >
          <div className="flex items-center gap-4">
            <div className={cn(
              'w-14 h-14 rounded-xl flex items-center justify-center text-2xl',
              wordPathComplete ? 'bg-success/20' : 'bg-blue-tint',
            )}>
              {wordPathComplete ? '🔓' : '🔤'}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-blue-primary">
                {wordPathComplete ? 'Word Lock — UNLOCKED!' : 'Word Lock'}
              </h3>
              <p className="text-sm text-text-secondary">
                {wordPathComplete
                  ? `The code is ${wordCode}`
                  : 'Discover 4 letters and spell the secret word'}
              </p>
            </div>
            {wordPathComplete && (
              <div className="flex gap-1">
                {wordCode.split('').map((l, i) => (
                  <span key={i} className="w-8 h-10 flex items-center justify-center text-sm font-bold bg-yellow-accent text-blue-primary rounded-lg border border-blue-primary">
                    {l}
                  </span>
                ))}
              </div>
            )}
          </div>
        </button>

        {/* Number Lock Tile */}
        <button
          onClick={numberPathComplete ? undefined : enterNumberPath}
          disabled={numberPathComplete}
          className={cn(
            'w-full p-6 rounded-2xl border-2 text-left transition-all',
            numberPathComplete
              ? 'bg-success/10 border-success/30'
              : 'bg-white border-blue-light/30 shadow-card hover:shadow-card-hover hover:border-blue-primary active:scale-[0.98]',
          )}
        >
          <div className="flex items-center gap-4">
            <div className={cn(
              'w-14 h-14 rounded-xl flex items-center justify-center text-2xl',
              numberPathComplete ? 'bg-success/20' : 'bg-blue-tint',
            )}>
              {numberPathComplete ? '🔓' : '🔢'}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-blue-primary">
                {numberPathComplete ? 'Number Lock — UNLOCKED!' : 'Number Lock'}
              </h3>
              <p className="text-sm text-text-secondary">
                {numberPathComplete
                  ? `The code is ${numberCode}`
                  : 'Discover 6 digits and crack the combination'}
              </p>
            </div>
            {numberPathComplete && (
              <span className="font-bold font-mono text-blue-primary">{numberCode}</span>
            )}
          </div>
        </button>
      </div>

      {/* Treasure Button — only when both done */}
      {bothComplete && (
        <div className="relative z-10 w-full text-center space-y-3">
          <div className="flex justify-center gap-2 text-3xl">
            <span className="animate-float" style={{ animationDelay: '0s' }}>🐰</span>
            <span className="animate-float" style={{ animationDelay: '0.3s' }}>🎁</span>
            <span className="animate-float" style={{ animationDelay: '0.6s' }}>🐰</span>
          </div>
          <button
            onClick={handleOpenTreasure}
            className="w-full py-5 rounded-2xl font-bold text-2xl bg-yellow-accent text-blue-primary border-[3px] border-blue-primary shadow-lg hover:scale-105 active:scale-95 transition-all animate-pop"
          >
            🐰 OPEN THE YELLOW CHEST! 🐰
          </button>
        </div>
      )}

      {!bothComplete && (
        <div className="relative z-10 text-center space-y-1">
          <p className="text-sm text-text-secondary italic">
            Pick a lock to start solving!
          </p>
          <div className="flex justify-center gap-1 text-xs opacity-50">
            <span>🥚</span><span>🐰</span><span>🥚</span><span>🐇</span><span>🥚</span>
          </div>
        </div>
      )}
    </div>
  )
}
