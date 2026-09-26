import { useEffect, useRef, useState } from 'react'
import { promptIds, type PromptId } from '../ids.ts'
import type { ServicesText } from '../i18n/types.ts'
import { promptAnchors, sectionAnchors } from '../routes.ts'
import { useSite } from './siteContext.ts'
import './FreePrompts.css'

type SectionText = ServicesText['prompts']
type CopyState = 'idle' | 'copied' | 'manual'

function selectContents(element: HTMLElement) {
  const selection = window.getSelection()
  if (!selection) return
  const range = document.createRange()
  range.selectNodeContents(element)
  selection.removeAllRanges()
  selection.addRange(range)
}

function PromptEntry({ id, text, index }: { id: PromptId; text: SectionText; index: number }) {
  const { locale } = useSite().text
  const prompt = text.items[id]
  const anchor = promptAnchors[id][locale]
  const [state, setState] = useState<CopyState>('idle')
  const detailsRef = useRef<HTMLDetailsElement>(null)
  const textRef = useRef<HTMLPreElement>(null)

  // La confirmación desaparece sola; las instrucciones de copia manual se quedan hasta el siguiente intento.
  useEffect(() => {
    if (state !== 'copied') return
    const timer = window.setTimeout(() => setState('idle'), 3000)
    return () => window.clearTimeout(timer)
  }, [state])

  async function copy() {
    try {
      await navigator.clipboard.writeText(prompt.text)
      setState('copied')
    } catch {
      // Sin permiso, en un contexto no seguro (http) o sin la API: se abre el texto, se selecciona y se explica cómo copiarlo.
      const details = detailsRef.current
      const pre = textRef.current
      if (details && pre) {
        details.open = true
        pre.focus()
        selectContents(pre)
      }
      setState('manual')
    }
  }

  return (
    <li id={anchor} className="prompt" data-reveal="">
      <div className="prompt-head">
        <p className="prompt-number" aria-hidden="true">
          {String(index + 1).padStart(2, '0')}
        </p>
        <h3 id={`${anchor}-title`} className="prompt-title">
          {prompt.title}
        </h3>
        <p className="prompt-summary">{prompt.summary}</p>
        <ul className="prompt-covers" role="list" aria-label={text.coversLabel}>
          {prompt.covers.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="prompt-body">
        <div className="prompt-copy">
          <button type="button" className="button prompt-copy-button" data-state={state} onClick={copy}>
            {state === 'copied' ? text.copied : text.copy}
            <span className="visually-hidden">: {prompt.title}</span>
          </button>
          <p className="prompt-status" role="status">
            {state === 'copied' && text.copiedStatus}
            {state === 'manual' && text.manualStatus}
          </p>
        </div>

        <details ref={detailsRef} className="prompt-details disclosure">
          <summary>
            {text.showText}
            <span className="visually-hidden">: {prompt.title}</span>
          </summary>
          <pre ref={textRef} className="prompt-text" tabIndex={-1}>
            {prompt.text}
          </pre>
        </details>
      </div>
    </li>
  )
}

function FreePrompts({ text }: { text: SectionText }) {
  const { locale } = useSite().text

  return (
    <section id={sectionAnchors.prompts[locale]} className="prompts theme-wash" aria-labelledby="prompts-title">
      <div className="container">
        <header className="section-header" data-reveal="">
          <p className="section-index" aria-hidden="true">
            <span className="section-index-number">02</span> {text.index}
          </p>
          <h2 id="prompts-title" className="section-title">
            {text.title}
          </h2>
          <p className="section-intro">{text.intro}</p>
        </header>

        <ol className="prompt-list" role="list">
          {promptIds.map((id, index) => (
            <PromptEntry key={id} id={id} text={text} index={index} />
          ))}
        </ol>
      </div>
    </section>
  )
}

export default FreePrompts
