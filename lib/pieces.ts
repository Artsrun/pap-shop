// 3D configurator data, carried over from ruben-pap (assets/js/pieces.js).
// sizes: [height, diameter] in cm (width for `flat` pieces). ⚠ Approximate placeholders: replace with real measurements.
// model: procedural shape for viewer3d.js (profile = [radius, height] from foot to rim; ruffle, holes, fold…).

export const sizeKeys = ['s', 'm', 'l'] as const
export type SizeKey = (typeof sizeKeys)[number]

type Model = Record<string, unknown>
export type Piece = {
  id: string
  work: string // Art & Decor slug (title + link)
  photos: string[]
  glaze: string
  flat?: boolean
  sizes: Record<SizeKey, [number, number]>
  model: Model
}
export type Glaze = { id: string; a: string; b: string; c: string; clay: string; speck: string; metal: number; rough: [number, number]; coat: number }

export const defaults = { size: 'm' as SizeKey, flow: 50, tex: 40, luster: 60 }

export const pieces: Piece[] = [
  {
    id: '01', work: 'ruffled-vase', photos: ['work-01'], glaze: 'graphite',
    sizes: { s: [19, 7], m: [26, 10], l: [34, 13] },
    model: {
      profile: [[0, 0], [3.1, 0], [3.4, 0.4], [3.9, 3], [4.15, 7], [3.9, 12], [3.35, 16], [3.05, 18.5], [3.3, 21], [4.1, 23.8], [5.1, 26]],
      thick: 0.45, ruffle: { start: 0.86, amp: 0.35, ampY: 0.3, k: 15, seed: 1.3, sharp: 0.25, irregular: 0.4 },
    },
  },
  {
    id: '02', work: 'pierced-bowl', photos: ['work-02', 'work-08', 'detail-1', 'hero'], glaze: 'graphite',
    sizes: { s: [7, 17], m: [10, 24], l: [13, 31] },
    model: {
      profile: [[0, 0], [3.4, 0], [3.7, 0.5], [4.3, 0.9], [6.5, 2.2], [8.8, 4.2], [10.4, 6.4], [11.4, 8.5], [11.9, 10]],
      thick: 0.5, ruffle: { start: 0.55, amp: 1.0, ampY: 0.55, k: 16, seed: 2.1, sharp: 0.2, irregular: 0.5 },
      holes: [[0.4, 0.42, 0.2, 0.13], [1.95, 0.36, 0.16, 0.11], [3.35, 0.46, 0.22, 0.14], [4.95, 0.4, 0.18, 0.12]],
    },
  },
  {
    id: '03', work: 'tulip-pot', photos: ['work-03', 'work-07'], glaze: 'bronze',
    sizes: { s: [9, 10], m: [12, 14], l: [16, 18] },
    model: {
      profile: [[0, 0], [4.2, 0], [4.6, 0.5], [6.0, 1.8], [6.8, 3.6], [7.0, 5.5], [6.9, 7.5], [6.6, 9.2], [6.5, 10.6], [6.8, 12]],
      thick: 0.5, ruffle: { start: 0.8, amp: 0.35, ampY: 0.45, k: 14, seed: 0.7, sharp: 0.3, irregular: 0.55 },
    },
  },
  {
    id: '04', work: 'folded-vase', photos: ['work-04', 'detail-2', 'step-4'], glaze: 'bronze', flat: true,
    sizes: { s: [22, 10], m: [30, 14], l: [40, 18] },
    model: {
      height: 30, thick: 0.45, rings: 0.15,
      fold: {
        col: [3.6, 1.7], foot: [1.4, 3.2], end: [2.2, 3.0],
        rb: 1.8, length: 7, curl: 2.2, fillet: 0.6, topWave: 0.25, n: 5, nFoot: 3.5, yaw: 0.5,
        crease: [3.2, 1.1, 0.9, 0.35],
      },
    },
  },
  {
    id: '05', work: 'wide-bowl', photos: ['work-05', 'detail-3'], glaze: 'graphite',
    sizes: { s: [7.5, 21], m: [10, 28], l: [12.5, 35] },
    model: {
      profile: [[0, 0], [3.6, 0], [4.0, 0.5], [5.2, 1.0], [8, 2.6], [10.8, 4.8], [12.8, 7.2], [14, 10]],
      thick: 0.55, ruffle: { start: 0.45, amp: 1.3, ampY: 0.8, k: 14, seed: 3.3, sharp: 0.15, irregular: 0.5 },
    },
  },
  {
    id: '06', work: 'bronze-vessel', photos: ['work-06'], glaze: 'bronze',
    sizes: { s: [19, 12], m: [26, 17], l: [34, 22] },
    model: {
      profile: [[0, 0], [5.3, 0], [5.7, 0.5], [6.6, 3.5], [7.7, 8.5], [8.4, 13.5], [8.5, 17], [8.2, 20], [7.5, 22.8], [6.6, 24.8], [5.9, 25.7], [5.6, 26]],
      thick: 0.5,
    },
  },
]

/** a = base, b = variation, c = flow/drips, clay = bare edges, speck = iron spots; rough = [matte, glossy] */
export const glazes: Glaze[] = [
  { id: 'bronze', a: '#3a2a1e', b: '#5a4630', c: '#8a7355', clay: '#7b5236', speck: '#1c140d', metal: 0.85, rough: [0.55, 0.24], coat: 0 },
  { id: 'graphite', a: '#1c1916', b: '#3b322a', c: '#6b5540', clay: '#6f4a31', speck: '#0c0a08', metal: 0.6, rough: [0.7, 0.28], coat: 0 },
  { id: 'turquoise', a: '#0a434b', b: '#17858b', c: '#63c6c2', clay: '#7b5236', speck: '#052428', metal: 0, rough: [0.4, 0.05], coat: 1 },
  { id: 'clay', a: '#6e4329', b: '#94643f', c: '#ad7f58', clay: '#86573a', speck: '#2f1c10', metal: 0, rough: [0.95, 0.62], coat: 0 },
  { id: 'ivory', a: '#ddd3c1', b: '#efe8dc', c: '#c9b89b', clay: '#94643f', speck: '#4c3a28', metal: 0, rough: [0.62, 0.15], coat: 0.6 },
]

export const pieceForWork = (slug?: string) => pieces.find((p) => p.work === slug)
