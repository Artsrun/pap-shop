'use client'

import Image from 'next/image'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { fill, type CfgT } from '@/lib/cfg-dict'
import type { Locale } from '@/lib/i18n'
import { defaults, glazes, pieces, sizeKeys, type Glaze, type SizeKey } from '@/lib/pieces'
import { links, mailto } from '@/lib/site'

// "Make it yours": piece / size / glaze picker + 3D preview + ready-to-send message.
// The WebGL part (viewer3d.js + three.js) loads only when the stage comes near the screen.

type Size = [number, number]
type Viewer = {
  setPiece: (id: string, model: unknown, seed: number, size: Size) => void
  setSize: (size: Size) => void
  setGlaze: (g: Glaze, fx: { flow: number; tex: number; luster: number }) => void
  setLabels: (l: { h: string; w: string; mug: string }) => void
  setDims: (on: boolean) => void
  setMug: (on: boolean) => void
  reset: () => void
  setActive: (on: boolean) => void
  dispose: () => void
}
type Status = 'idle' | 'loading' | 'ready' | 'failed'
type Props = { lang: Locale; t: CfgT; names: Record<string, string> }

const byId = <T extends { id: string }>(list: T[], id: string | null) => list.find((x) => x.id === id)
const pct = (v: string | null, fallback: number) => {
  const n = Number(v)
  return v !== null && v !== '' && n >= 0 && n <= 100 ? Math.round(n) : fallback
}
const isSize = (v: string | null): v is SizeKey => sizeKeys.includes(v as SizeKey)
const img = (name: string) => `/img/${name}.jpg`

const Icon = ({ d }: { d: string }) => (
  <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
    <path d={d} />
  </svg>
)
const ICON = {
  box: 'M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16ZM3.3 7 12 12l8.7-5M12 22V12',
  ruler: 'M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0ZM14.5 12.5l2-2M11.5 9.5l2-2M8.5 6.5l2-2M17.5 15.5l2-2',
  mug: 'M10 2v2M14 2v2M6 2v2M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1',
  reset: 'M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8M3 3v5h5',
  full: 'M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7',
  copy: 'M8 8h14v14H8zM4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2',
  link: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71',
}

export const Configurator = ({ lang, t, names }: Props) => {
  const params = useSearchParams()
  const path = usePathname()
  const shared = byId(pieces, params.get('p'))
  const sharedGlaze = byId(glazes, params.get('g'))

  const [pieceId, setPieceId] = useState(shared?.id ?? pieces[0].id)
  const [size, setSize] = useState<SizeKey>(() => {
    const s = params.get('s')
    return isSize(s) ? s : defaults.size
  })
  const [glazeId, setGlazeId] = useState(sharedGlaze?.id ?? (shared ?? pieces[0]).glaze)
  const [glazePicked, setGlazePicked] = useState(Boolean(sharedGlaze))
  const [fx, setFx] = useState({
    flow: pct(params.get('f'), defaults.flow),
    tex: pct(params.get('t'), defaults.tex),
    luster: pct(params.get('l'), defaults.luster),
  })
  const [qty, setQty] = useState(1)
  const [name, setName] = useState('')
  const [note, setNote] = useState('')
  const [dims, setDims] = useState(true)
  const [mug, setMug] = useState(false)
  const [view, setView] = useState(-1) // -1 = 3D, 0… = photo index
  const [status, setStatus] = useState<Status>('idle')
  const [toast, setToast] = useState('')
  const [ready, setReady] = useState(false)

  const stage = useRef<HTMLDivElement>(null)
  const host = useRef<HTMLDivElement>(null)
  const viewer = useRef<Viewer | null>(null)
  const shown = useRef('')
  const lastPointer = useRef(-1e9)

  const piece = byId(pieces, pieceId) ?? pieces[0]
  const glaze = byId(glazes, glazeId) ?? glazes[0]
  const pieceName = names[piece.id]
  const nf = new Intl.NumberFormat(lang)
  const sizeName = (s: SizeKey) => t[`size.${s}`]
  const glazeName = (id: string) => t[`g.${id}` as keyof CfgT]
  const dimsText = (s: SizeKey) => {
    const [h, w] = piece.sizes[s]
    return `${t.h} ${nf.format(h)} × ${piece.flat ? t.w : 'Ø'} ${nf.format(w)} ${t.cm}`
  }
  const is3d = view < 0 && status !== 'failed'

  // load three.js when the stage gets close
  useEffect(() => {
    const el = stage.current
    if (!el) return
    let disposed = false
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return
        io.disconnect()
        setStatus('loading')
        import('./viewer3d.js')
          .then((m) => {
            if (disposed || !host.current) return
            viewer.current = m.createViewer(host.current, { onReady: () => setStatus('ready') }) as Viewer
            shown.current = ''
            setReady(true)
          })
          .catch((err: unknown) => {
            console.warn('3D preview unavailable:', err)
            setStatus('failed')
            setView((v) => Math.max(0, v))
          })
      },
      { rootMargin: '700px 0px' },
    )
    io.observe(el)
    return () => {
      disposed = true
      io.disconnect()
      viewer.current?.dispose()
      viewer.current = null
    }
  }, [])

  // piece + size + labels
  useEffect(() => {
    const v = viewer.current
    if (!ready || !v) return
    const p = byId(pieces, pieceId) ?? pieces[0]
    const [h, w] = p.sizes[size]
    const n = new Intl.NumberFormat(lang)
    if (shown.current !== p.id) {
      v.setPiece(p.id, p.model, pieces.indexOf(p) * 7.31, p.sizes[size])
      shown.current = p.id
    } else v.setSize(p.sizes[size])
    v.setLabels({ h: `${n.format(h)} ${t.cm}`, w: `${p.flat ? t.w : 'Ø'} ${n.format(w)} ${t.cm}`, mug: t.mugLabel })
  }, [ready, pieceId, size, lang, t])

  useEffect(() => {
    if (ready) viewer.current?.setGlaze(glaze, { flow: fx.flow / 100, tex: fx.tex / 100, luster: fx.luster / 100 })
  }, [ready, glaze, fx])
  useEffect(() => {
    if (ready) viewer.current?.setDims(dims)
  }, [ready, dims])
  useEffect(() => {
    if (ready) viewer.current?.setMug(mug)
  }, [ready, mug])

  // render only while on screen, tab visible and 3D shown
  useEffect(() => {
    const v = viewer.current
    const el = host.current
    if (!ready || !v || !el) return
    let onScreen = false
    const sync = () => v.setActive(onScreen && !document.hidden && view < 0)
    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting
      sync()
    })
    io.observe(el)
    document.addEventListener('visibilitychange', sync)
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', sync)
      v.setActive(false)
    }
  }, [ready, view])

  // after a tap on an option, bring the 3D view back on screen (phones)
  const reveal = (at: number) => {
    if (status !== 'failed') setView(-1)
    if (at - lastPointer.current > 1500) return
    requestAnimationFrame(() => {
      const r = host.current?.getBoundingClientRect()
      const top = document.querySelector('.site-header')?.getBoundingClientRect().bottom ?? 0
      if (!r || (r.top >= top - 1 && r.bottom <= innerHeight + 1)) return
      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
      scrollBy({ top: r.top - top - 12, behavior: reduce ? 'auto' : 'smooth' })
    })
  }

  const pickPiece = (id: string, at: number) => {
    const p = byId(pieces, id)
    if (!p) return
    setPieceId(id)
    if (!glazePicked) setGlazeId(p.glaze)
    reveal(at)
  }

  /* message */
  const shareUrl = () => {
    const q = new URLSearchParams({ p: pieceId, s: size, g: glazeId, f: String(fx.flow), t: String(fx.tex), l: String(fx.luster) })
    return `${typeof window === 'undefined' ? '' : location.origin}${path}?${q}`
  }
  const lines = [
    t['m.intro'],
    '',
    `• ${fill(t['m.piece'], { piece: pieceName, n: piece.id })}`,
    `• ${fill(t['m.size'], { size: sizeName(size), dims: dimsText(size) })}`,
    `• ${fill(t['m.glaze'], { glaze: glazeName(glazeId), ...fx })}`,
    `• ${fill(t['m.qty'], { qty })}`,
    ...(note.trim() || name.trim() ? [''] : []),
    ...(note.trim() ? [fill(t['m.note'], { note: note.trim() })] : []),
    ...(name.trim() ? [fill(t['m.name'], { name: name.trim() })] : []),
    '',
    t['m.ask'],
    fill(t['m.link'], { link: shareUrl() }),
  ]
  const text = lines.join('\n')
  const subject = fill(t['m.subject'], { piece: pieceName, size: sizeName(size) })

  // WhatsApp and email take the text; Telegram / Instagram can't be prefilled, so it goes to the clipboard
  const channels: { name: string; href: string; copy: boolean }[] = [
    ...(links.whatsapp ? [{ name: 'WhatsApp', href: `${links.whatsapp}?text=${encodeURIComponent(text)}`, copy: false }] : []),
    ...(links.telegram ? [{ name: 'Telegram', href: links.telegram, copy: true }] : []),
    ...(links.instagram ? [{ name: 'Instagram', href: links.instagram, copy: true }] : []),
    { name: t.email, href: mailto(subject, text), copy: false },
  ]

  const flash = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2600)
  }
  const copy = (value: string, ok: string) =>
    navigator.clipboard?.writeText(value).then(
      () => flash(ok),
      () => flash(t.copyFail),
    ) ?? flash(t.copyFail)

  const tool = (k: 'dims' | 'mug' | 'reset' | 'full') => {
    if (k === 'dims') setDims((d) => !d)
    else if (k === 'mug') setMug((m) => !m)
    else if (k === 'reset') viewer.current?.reset()
    else if (document.fullscreenElement) void document.exitFullscreen()
    else void host.current?.parentElement?.requestFullscreen().catch(() => undefined)
  }

  return (
    <div className="cfg">
      <div className="cfg-rail" role="group" aria-label={t.views}>
        {status !== 'failed' && (
          <button type="button" aria-pressed={is3d} aria-label={t.view3d} onClick={() => setView(-1)}>
            <Icon d={ICON.box} />
            <span>3D</span>
          </button>
        )}
        {piece.photos.map((ph, i) => (
          <button key={ph} type="button" aria-pressed={!is3d && Math.max(0, view) === i} aria-label={fill(t.photo, { n: i + 1 })} onClick={() => setView(i)}>
            <Image src={img(ph)} alt="" fill sizes="72px" />
          </button>
        ))}
      </div>

      <div className="cfg-stage" ref={stage}>
        <div className="cfg-view" data-mode={is3d ? '3d' : 'photo'} data-status={status}>
          <div
            className="cfg-host"
            ref={host}
            tabIndex={0}
            role="group"
            aria-label={fill(t.canvas, { piece: pieceName, size: sizeName(size), glaze: glazeName(glazeId) })}
          >
            <svg className="cfg-dims" aria-hidden="true" />
          </div>
          {!is3d && <Image className="cfg-photo" src={img(piece.photos[Math.max(0, view)])} alt={pieceName} fill sizes="(max-width: 960px) 100vw, 50vw" />}
          <div className="cfg-tools">
            <button className="cfg-tool" type="button" aria-pressed={dims} aria-label={t.dims} title={t.dims} onClick={() => tool('dims')}>
              <Icon d={ICON.ruler} />
            </button>
            <button className="cfg-tool" type="button" aria-pressed={mug} aria-label={t.mug} title={t.mug} onClick={() => tool('mug')}>
              <Icon d={ICON.mug} />
            </button>
            <button className="cfg-tool" type="button" aria-label={t.reset} title={t.reset} onClick={() => tool('reset')}>
              <Icon d={ICON.reset} />
            </button>
            <button className="cfg-tool cfg-full" type="button" aria-label={t.full} title={t.full} onClick={() => tool('full')}>
              <Icon d={ICON.full} />
            </button>
          </div>
          <p className="cfg-status">{status === 'failed' ? t.noWebgl : t.loading}</p>
          <p className="cfg-hint">
            <span className="hint-fine">{t.hint}</span>
            <span className="hint-touch">{t.hintTouch}</span>
          </p>
        </div>
        <p className="cfg-note">{t.approx}</p>
      </div>

      <form
        className="cfg-panel"
        onSubmit={(e) => e.preventDefault()}
        onPointerDown={(e) => {
          lastPointer.current = e.timeStamp
        }}
      >
        <h2 className="cfg-name">{pieceName}</h2>
        <p className="cfg-meta">
          <span>{fill(t.no, { n: piece.id })}</span>
          <span>{t.price}</span>
        </p>
        <p className="cfg-unique">{t.unique}</p>

        <fieldset className="cfg-field">
          <legend>
            <span className="label">{t.piece}</span>
            <b>{pieceName}</b>
          </legend>
          <div className="cfg-pieces">
            {pieces.map((p) => (
              <label key={p.id} className="cfg-thumb" title={names[p.id]}>
                <input className="sr-only" type="radio" name="piece" value={p.id} checked={p.id === pieceId} onChange={(e) => pickPiece(p.id, e.timeStamp)} />
                <Image src={img(p.photos[0])} alt={names[p.id]} width={120} height={150} sizes="72px" />
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="cfg-field">
          <legend>
            <span className="label">{t.size}</span>
            <b>
              {sizeName(size)} · {dimsText(size)}
            </b>
          </legend>
          <div className="cfg-sizes">
            {sizeKeys.map((s) => (
              <label key={s} className="cfg-size">
                <input
                  className="sr-only"
                  type="radio"
                  name="size"
                  value={s}
                  checked={s === size}
                  onChange={(e) => {
                    setSize(s)
                    reveal(e.timeStamp)
                  }}
                />
                <b>{s.toUpperCase()}</b>
                <span>{sizeName(s)}</span>
                <small>{dimsText(s)}</small>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="cfg-field">
          <legend>
            <span className="label">{t.glaze}</span>
            <b>{glazeName(glazeId)}</b>
          </legend>
          <div className="cfg-glazes">
            {glazes.map((g) => (
              <label key={g.id} className="cfg-swatch" title={glazeName(g.id)}>
                <input
                  className="sr-only"
                  type="radio"
                  name="glaze"
                  value={g.id}
                  checked={g.id === glazeId}
                  onChange={() => {
                    setGlazeId(g.id)
                    setGlazePicked(true)
                  }}
                />
                <span style={{ background: `radial-gradient(circle at 32% 28%, ${g.c}, ${g.b} 38%, ${g.a} 78%)` }} />
                <span className="sr-only">{glazeName(g.id)}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="cfg-field">
          <legend>
            <span className="label">{t.surface}</span>
          </legend>
          <div className="cfg-ranges">
            {(['flow', 'tex', 'luster'] as const).map((k) => (
              <label key={k} className="cfg-range">
                <span>{t[k]}</span>
                <input type="range" min={0} max={100} value={fx[k]} onChange={(e) => setFx((f) => ({ ...f, [k]: Number(e.target.value) }))} />
                <output>{fx[k]}%</output>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="cfg-field cfg-order">
          <div className="cfg-qty-row">
            <span className="cfg-lbl">{t.qty}</span>
            <div className="cfg-qty">
              <button type="button" aria-label={t.qtyDec} onClick={() => setQty((q) => Math.max(1, q - 1))}>
                −
              </button>
              <input
                type="number"
                min={1}
                max={20}
                value={qty}
                inputMode="numeric"
                aria-label={t.qty}
                onChange={(e) => setQty(Math.min(20, Math.max(1, parseInt(e.target.value, 10) || 1)))}
              />
              <button type="button" aria-label={t.qtyInc} onClick={() => setQty((q) => Math.min(20, q + 1))}>
                +
              </button>
            </div>
          </div>
          <label className="cfg-lbl">
            <span>
              {t.name} <small>{t.optional}</small>
            </span>
            <input className="cfg-input" type="text" maxLength={60} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label className="cfg-lbl">
            <span>
              {t.note} <small>{t.optional}</small>
            </span>
            <textarea className="cfg-input" rows={2} maxLength={400} placeholder={t.notePh} value={note} onChange={(e) => setNote(e.target.value)} />
          </label>
        </div>

        <div className="cfg-field cfg-compose">
          <span className="cfg-lbl">{t.msg}</span>
          <pre className="cfg-bubble">{text}</pre>
          <span className="cfg-lbl">{t.send}</span>
          <div className="cfg-send">
            {channels.map((c) => (
              <a
                key={c.name}
                className="btn alt"
                href={c.href}
                {...(/^https?:/.test(c.href) && { target: '_blank', rel: 'noopener noreferrer' })}
                onClick={() => c.copy && copy(text, t.pasteHint)}
              >
                {c.name}
              </a>
            ))}
          </div>
          <div className="cfg-copy">
            <button className="cfg-textbtn" type="button" onClick={() => copy(text, t.copied)}>
              <Icon d={ICON.copy} />
              {t.copy}
            </button>
            <button className="cfg-textbtn" type="button" onClick={() => copy(shareUrl(), t.linkCopied)}>
              <Icon d={ICON.link} />
              {t.copyLink}
            </button>
          </div>
          <p className="cfg-toast" role="status" aria-live="polite">
            {toast}
          </p>
        </div>
      </form>
    </div>
  )
}
