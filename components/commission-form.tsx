'use client'

import { useState, type FormEvent, type InputHTMLAttributes } from 'react'
import { projectTypes, type ProjectType } from '@/lib/content'
import type { Dict } from '@/lib/dict'
import { mailto } from '@/lib/site'

const MAX_BYTES = 4 * 1024 * 1024 // Vercel functions accept ~4.5 MB per request
const MAX_FILES = 10

type T = Dict['form']
type Status = 'idle' | 'sending' | 'sent' | 'failed'

const Field = ({ label, ...input }: { label: string } & InputHTMLAttributes<HTMLInputElement>) => (
  <label className="field">
    <span>{label}</span>
    <input {...input} />
  </label>
)

const Choice = ({ label, name, options }: { label: string; name: string; options: Record<string, string> | string[] }) => (
  <label className="field">
    <span>{label}</span>
    <select name={name} defaultValue="">
      <option value="" />
      {Object.entries(options).map(([k, v]) => (
        <option key={k} value={Array.isArray(options) ? v : k}>
          {v}
        </option>
      ))}
    </select>
  </label>
)

const Specific = ({ type, t }: { type: ProjectType | ''; t: T }) => {
  switch (type) {
    case 'restaurant':
      return (
        <>
          <Field label={t.venue} name="venue" />
          <Field label={t.city} name="city" />
          <fieldset className="checks">
            <legend>{t.pieces}</legend>
            {Object.entries(t.piecesList).map(([k, v]) => (
              <label key={k}>
                <input type="checkbox" name="pieces" value={k} /> {v}
              </label>
            ))}
          </fieldset>
          <Field label={t.quantity} name="quantity" type="number" min={1} />
        </>
      )
    case 'art':
      return (
        <>
          <Choice label={t.kind} name="kind" options={t.kinds} />
          <Field label={t.size} name="size" />
          <Field label={t.placement} name="placement" />
        </>
      )
    case 'tiles':
      return (
        <>
          <Choice label={t.role} name="role" options={t.roles} />
          <Choice label={t.application} name="application" options={t.applications} />
          <Field label={t.area} name="area" type="number" min={0} step="any" />
          <Field label={t.city} name="city" />
        </>
      )
    case 'custom':
      return (
        <>
          <Field label={t.item} name="item" />
          <Field label={t.quantity} name="quantity" type="number" min={1} />
        </>
      )
    default:
      return null
  }
}

const files = (data: FormData) => data.getAll('files').filter((f): f is File => f instanceof File && f.size > 0)
const tooBig = (list: File[]) => list.length > MAX_FILES || list.reduce((n, f) => n + f.size, 0) > MAX_BYTES

/** Text version of the brief, for the email fallback. */
const brief = (data: FormData) =>
  [...data.entries()]
    .filter(([k, v]) => typeof v === 'string' && v.trim() && k !== 'company')
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n')

type Props = { t: T; type?: ProjectType; reference?: string }

export const CommissionForm = ({ t, type: initial, reference }: Props) => {
  const [type, setType] = useState<ProjectType | ''>(initial ?? '')
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')
  const [fallback, setFallback] = useState('')

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const problem =
      !data.get('email') && !data.get('phone') ? t.contactHint : tooBig(files(data)) ? t.tooBig : ''
    setError(problem)
    if (problem) return
    setStatus('sending')
    const res = await fetch('/api/commission', { method: 'POST', body: data }).catch(() => null)
    if (res?.ok) return setStatus('sent')
    setFallback(mailto(t.types[data.get('type') as ProjectType] ?? t.title, brief(data)))
    setStatus('failed')
  }

  if (status === 'sent') return <p className="notice">{t.sent}</p>

  return (
    <form className="form" onSubmit={onSubmit}>
      <fieldset className="types">
        <legend>{t.type}</legend>
        {projectTypes.map((k) => (
          <label key={k}>
            <input type="radio" name="type" value={k} checked={type === k} onChange={() => setType(k)} required />
            <span>{t.types[k]}</span>
          </label>
        ))}
      </fieldset>

      {reference && (
        <p className="ref">
          {t.ref}: <b>{reference}</b>
          <input type="hidden" name="ref" value={reference} />
        </p>
      )}

      <div className="grid2">
        <Specific type={type} t={t} />
      </div>

      <label className="field">
        <span>{t.brief}</span>
        <textarea name="brief" rows={5} maxLength={4000} required />
      </label>

      <div className="grid2">
        <Choice label={t.budget} name="budget" options={t.budgets} />
        <Field label={t.deadline} name="deadline" type="date" />
      </div>

      <label className="field">
        <span>{t.files}</span>
        <input
          type="file"
          name="files"
          multiple
          accept="image/*,.pdf"
          onChange={(e) => setError(tooBig([...(e.target.files ?? [])]) ? t.tooBig : '')}
        />
        <small>{t.filesHint}</small>
      </label>

      <fieldset>
        <legend>{t.you}</legend>
        <div className="grid2">
          <Field label={t.name} name="name" autoComplete="name" maxLength={80} required />
          <Field label={t.email} name="email" type="email" autoComplete="email" />
          <Field label={t.phone} name="phone" type="tel" autoComplete="tel" />
          <Choice label={t.channel} name="channel" options={t.channels} />
        </div>
        <small>{t.contactHint}</small>
      </fieldset>

      {/* honeypot */}
      <input className="hp" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      {status === 'failed' && (
        <p className="error" role="alert">
          {t.failed} <a href={fallback}>{t.mail}</a>
        </p>
      )}

      <button className="btn ink" type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? t.sending : t.send} <span aria-hidden="true">→</span>
      </button>
    </form>
  )
}
