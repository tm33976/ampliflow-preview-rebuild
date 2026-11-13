import { Plus } from 'lucide-react'
import { useState } from 'react'
import { SectionHeading } from '../../components/SectionHeading'
import { faqs, type Faq as FaqItemData } from '../../data/site'
import { cx } from '../../lib/cx'

const panelId = (faq: FaqItemData) => `faq-${faq.id}`

function FaqItem({ faq, open, onToggle }: { faq: FaqItemData; open: boolean; onToggle: () => void }) {
  const buttonId = `${panelId(faq)}-question`
  return (
    <li>
      <h3>
        <button
          id={buttonId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId(faq)}
          onClick={onToggle}
          className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-surface-2/60"
        >
          <span className="hidden w-24 shrink-0 text-xs font-medium text-muted sm:block">{faq.topic}</span>
          <span className="flex-1 font-medium">{faq.question}</span>
          <span
            aria-hidden="true"
            className={cx(
              'grid size-7 shrink-0 place-items-center rounded-full border border-line text-muted transition-transform duration-300',
              open && 'rotate-45 border-brand-ink/40 text-brand-ink',
            )}
          >
            <Plus className="size-4" />
          </span>
        </button>
      </h3>
      <div
        id={panelId(faq)}
        role="region"
        aria-labelledby={buttonId}
        inert={!open}
        className={cx(
          'grid transition-[grid-template-rows,opacity] duration-300 ease-out',
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        )}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-5 text-sm leading-relaxed text-muted sm:pl-[8.25rem]">{faq.answer}</p>
        </div>
      </div>
    </li>
  )
}

export function Faq() {
  const [open, setOpen] = useState<ReadonlySet<string>>(() => {
    const fromHash = faqs.find((faq) => `#${panelId(faq)}` === window.location.hash)
    return new Set([fromHash?.id ?? faqs[0].id])
  })

  const toggle = (id: string) =>
    setOpen((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  return (
    <section id="faq" aria-labelledby="faq-heading" className="defer-render px-4 py-20 sm:px-6 sm:py-28">
      <SectionHeading id="faq-heading" eyebrow="FAQ" title="Straight answers before you start">
        Safety, pricing, setup and billing, with every answer matching the pricing page.
      </SectionHeading>
      <ul className="scroll-reveal mx-auto mt-12 max-w-3xl divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
        {faqs.map((faq) => (
          <FaqItem key={faq.id} faq={faq} open={open.has(faq.id)} onToggle={() => toggle(faq.id)} />
        ))}
      </ul>
    </section>
  )
}
