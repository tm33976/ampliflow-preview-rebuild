import { CornerDownLeft, Search } from 'lucide-react'
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type MouseEvent } from 'react'
import { Kbd } from '../../components/ui'
import { cx } from '../../lib/cx'
import { filterCommands, type Command } from './types'

type Props = { open: boolean; onClose: () => void; commands: Command[] }

/**
 * Built on the native <dialog>: showModal() gives the focus trap, inert page,
 * Escape handling and focus return for free. The input follows the ARIA 1.2
 * combobox pattern with a grouped listbox.
 */
export default function CommandPalette({ open, onClose, commands }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const baseId = useId()
  const listId = `${baseId}-list`
  const optionId = (index: number) => `${baseId}-option-${index}`

  const results = useMemo(() => filterCommands(commands, query), [commands, query])
  const groups = useMemo(() => {
    const map = new Map<string, { command: Command; index: number }[]>()
    results.forEach((command, index) => map.set(command.group, [...(map.get(command.group) ?? []), { command, index }]))
    return [...map.entries()]
  }, [results])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      setQuery('')
      setActive(0)
      dialog.showModal()
      inputRef.current?.focus()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  useEffect(() => {
    if (open) document.getElementById(`${baseId}-option-${active}`)?.scrollIntoView({ block: 'nearest' })
  }, [active, open, baseId])

  const run = (command: Command) => {
    onClose()
    requestAnimationFrame(() => command.perform())
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (results.length === 0) return
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const step = event.key === 'ArrowDown' ? 1 : -1
      setActive((current) => (current + step + results.length) % results.length)
    } else if (event.key === 'Enter') {
      event.preventDefault()
      run(results[Math.min(active, results.length - 1)])
    }
  }

  const onDialogClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === dialogRef.current) onClose()
  }

  return (
    <dialog
      ref={dialogRef}
      aria-label="Command menu"
      onClose={onClose}
      onClick={onDialogClick}
      className="m-auto mt-[12vh] w-[min(36rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-line bg-surface p-0 text-ink shadow-frame backdrop:bg-[rgb(9_11_16/0.55)] backdrop:backdrop-blur-sm open:animate-enter"
    >
      <div className="flex items-center gap-3 border-b border-line px-4">
        <Search className="size-4 shrink-0 text-muted" aria-hidden="true" />
        <input
          ref={inputRef}
          role="combobox"
          aria-expanded="true"
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={results.length > 0 ? optionId(Math.min(active, results.length - 1)) : undefined}
          aria-label="Search commands"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setActive(0)
          }}
          onKeyDown={onKeyDown}
          placeholder="Type a command or search"
          autoComplete="off"
          spellCheck={false}
          className="h-14 min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted"
        />
        <Kbd>Esc</Kbd>
      </div>

      <div
        role="region"
        aria-label="Command results"
        tabIndex={0}
        className="max-h-[min(24rem,56vh)] overflow-y-auto p-2"
      >
        {results.length === 0 ? (
          <p className="px-3 py-10 text-center text-sm text-muted">No commands match “{query}”</p>
        ) : (
          <div id={listId} role="listbox" aria-label="Commands">
            {groups.map(([group, items]) => {
              const groupId = `${baseId}-${group.replace(/\W+/g, '-')}`
              return (
                <ul key={group} role="group" aria-labelledby={groupId}>
                  <li
                    role="presentation"
                    id={groupId}
                    className="px-3 pt-3 pb-1.5 text-[11px] font-semibold tracking-wider text-muted uppercase"
                  >
                    {group}
                  </li>
                  {items.map(({ command, index }) => {
                    const selected = index === Math.min(active, results.length - 1)
                    return (
                      <li
                        key={command.id}
                        id={optionId(index)}
                        role="option"
                        aria-selected={selected}
                        onClick={() => run(command)}
                        onMouseMove={() => setActive(index)}
                        className={cx(
                          'flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm',
                          selected ? 'bg-brand-soft text-ink' : 'text-ink-2',
                        )}
                      >
                        <command.icon
                          className={cx('size-4 shrink-0', selected ? 'text-brand-ink' : 'text-muted')}
                          aria-hidden="true"
                        />
                        <span className="flex-1 truncate">{command.label}</span>
                        {command.hint && <span className="text-xs text-muted">{command.hint}</span>}
                        {selected && <CornerDownLeft className="size-3.5 text-muted" aria-hidden="true" />}
                      </li>
                    )
                  })}
                </ul>
              )
            })}
          </div>
        )}
      </div>

      <div
        aria-hidden="true"
        className="flex items-center gap-4 border-t border-line px-4 py-2.5 text-[11px] text-muted"
      >
        <span className="flex items-center gap-1.5">
          <Kbd>↑</Kbd>
          <Kbd>↓</Kbd>
          to move
        </span>
        <span className="flex items-center gap-1.5">
          <Kbd>Enter</Kbd>
          to run
        </span>
        <span className="ml-auto">{results.length} commands</span>
      </div>
      <p className="sr-only" aria-live="polite">
        {open ? `${results.length} ${results.length === 1 ? 'command' : 'commands'} available` : ''}
      </p>
    </dialog>
  )
}
