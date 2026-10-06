import { notFound } from 'next/navigation'

// Unknown paths render [lang]/not-found.tsx inside the localized layout.
const CatchAll = () => notFound()

export default CatchAll
