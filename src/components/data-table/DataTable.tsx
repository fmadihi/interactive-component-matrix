
import { useMemo, useState } from 'react'
import {
  DndContext, closestCenter,
  KeyboardSensor, PointerSensor, useSensor, useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext, verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'
import { people as initialPeople, type Person } from '../../lib/data'
import { useDebounce } from '../../hooks/useDebounce'
import { SortableRow } from './SortableRow'

const columns: (keyof Person)[] = ['name', 'role', 'email']

export function DataTable() {
  const [rows, setRows] = useState<Person[]>(initialPeople)
  const [filter, setFilter] = useState('')
  const debouncedFilter = useDebounce(filter, 300)

  const filtered = useMemo(() => {
    const q = debouncedFilter.trim().toLowerCase()
    if (!q) return rows
    return rows.filter(r =>
      columns.some(c => r[c].toLowerCase().includes(q)),
    )
  }, [rows, debouncedFilter])

  // سنسور کیبورد: جابه‌جایی ردیف‌ها حتی بدون موس (نکته A11y مهم!)
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    setRows(items => {
      const from = items.findIndex(i => i.id === active.id)
      const to = items.findIndex(i => i.id === over.id)
      const next = [...items]
      next.splice(to, 0, next.splice(from, 1)[0])
      return next
    })
  }

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800">
      <div className="p-3">
        <input
          value={filter}
          onChange={e => setFilter(e.target.value)}
          placeholder="Filter table…"
          aria-label="Filter table"
          className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-zinc-900 dark:border-zinc-700"
        />
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <table className="w-full text-left">
          <thead>
            <tr className="text-xs uppercase text-zinc-500">
              <th className="w-10 px-3 py-2" aria-label="Reorder handle" />
              {columns.map(c => (
                <th key={c} scope="col" className="px-3 py-2">{c}</th>
              ))}
            </tr>
          </thead>
          <SortableContext items={filtered.map(r => r.id)} strategy={verticalListSortingStrategy}>
            <tbody>
              {filtered.map(person => (
                <SortableRow key={person.id} person={person} query={debouncedFilter} columns={columns} />
              ))}
            </tbody>
          </SortableContext>
        </table>
      </DndContext>
    </div>
  )
}