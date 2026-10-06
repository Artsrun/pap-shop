import { isProjectType } from '@/lib/content'
import { site } from '@/lib/site'

// Commission inquiries -> email to the studio via Resend (https://resend.com), no SDK.
// Env: RESEND_API_KEY (required), COMMISSION_TO, COMMISSION_FROM (verified sender).
// Without a key it answers 503 and the form offers a prefilled email instead.

const MAX_BYTES = 4 * 1024 * 1024
const MAX_FILES = 10
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const fail = (error: string, status: number) => Response.json({ error }, { status })

export const POST = async (req: Request) => {
  const form = await req.formData().catch(() => null)
  if (!form) return fail('bad-request', 400)
  if (form.get('company')) return Response.json({ ok: true }) // honeypot: bots get a fake success

  const get = (k: string) => String(form.get(k) ?? '').trim()
  const [type, name, email, phone, brief] = ['type', 'name', 'email', 'phone', 'brief'].map(get)
  if (!isProjectType(type) || !name || !brief || !(email || phone) || (email && !EMAIL.test(email)))
    return fail('invalid', 400)

  const files = form.getAll('files').filter((f): f is File => f instanceof File && f.size > 0)
  if (files.length > MAX_FILES || files.reduce((n, f) => n + f.size, 0) > MAX_BYTES) return fail('too-large', 413)
  if (files.some((f) => !f.type.startsWith('image/') && f.type !== 'application/pdf')) return fail('file-type', 415)

  const key = process.env.RESEND_API_KEY
  if (!key) return fail('not-configured', 503)

  const text = [...form.entries()]
    .filter(([k, v]) => typeof v === 'string' && v.trim() && k !== 'company')
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n')

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.COMMISSION_FROM ?? 'Ruben Pap website <onboarding@resend.dev>',
      to: [process.env.COMMISSION_TO ?? site.email],
      reply_to: email || undefined,
      subject: `New ${type} inquiry — ${name.slice(0, 80)}`,
      text,
      attachments: await Promise.all(
        files.map(async (f) => ({ filename: f.name, content: Buffer.from(await f.arrayBuffer()).toString('base64') })),
      ),
    }),
  }).catch(() => null)

  return res?.ok ? Response.json({ ok: true }) : fail('send-failed', 502)
}
