import { useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { cn } from '@/lib/utils'

const ITEM_TYPE = 'DRAG_ITEM'

interface DragPayload {
  index: number
  value: string
}

interface DraggableItemProps {
  value: string
  index: number
  onSwap: (from: number, to: number) => void
  sparkle: boolean
  width?: number
  height?: number
  className?: string
}

export function DraggableItem({
  value,
  index,
  onSwap,
  sparkle,
  width = 64,
  height = 80,
  className,
}: DraggableItemProps) {
  const ref = useRef<HTMLDivElement>(null)

  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: { index, value },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  })

  const [{ isOver }, drop] = useDrop<DragPayload, void, { isOver: boolean }>({
    accept: ITEM_TYPE,
    drop: (item) => {
      if (item.index !== index) {
        onSwap(item.index, index)
      }
    },
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  })

  drag(drop(ref))

  return (
    <div
      ref={ref}
      className={cn(
        'flex items-center justify-center text-3xl font-bold rounded-xl border-2 cursor-grab active:cursor-grabbing select-none transition-all',
        sparkle
          ? 'bg-yellow-accent border-yellow-accent text-blue-primary shadow-lg scale-110'
          : 'bg-white border-blue-primary text-blue-primary shadow-card hover:shadow-card-hover',
        isDragging && 'opacity-40 scale-95',
        isOver && !isDragging && 'ring-4 ring-yellow-accent/50 scale-105',
        className,
      )}
      style={{ width, height }}
    >
      {value}
    </div>
  )
}

export { ITEM_TYPE }
