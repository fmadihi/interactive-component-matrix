

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Person } from '../../lib/data'
import { Highlight } from '../command-palette/Highlight'

export function SortableRow({
  person, query, columns,
}: {
  person: Person
  query: string
  columns: (keyof Person)[]
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: person.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <tr ref={setNodeRef} style={style} className="border-b border-zinc-200 dark:border-zinc-800">
      <td className="px-3 py-2">
        <button
          {...attributes} {...listeners}
          aria-label={`Drag to reorder ${person.name}`}
          className="cursor-grab touch-none text-zinc-400 hover:text-zinc-600"
        >
          ⠿
        </button>
      </td>
      {columns.map(col => (
        <td key={col} className="px-3 py-2 text-sm">
          <Highlight text={person[col]} query={query} />
        </td>
      ))}
    </tr>
  )
}
