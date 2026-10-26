export const CV_SCHEMA_VERSION = 1 as const

export interface Contact {
  fullName: string
  headline: string
  email: string
  phone: string
}

export interface Experience {
  id: string
  role: string
  company: string
  location: string
  startDate: string // YYYY-MM
  endDate: string // YYYY-MM, empty if current
  current: boolean
  description: string
}

export interface Education {
  id: string
  program: string
  institution: string
  endDate: string // YYYY-MM
}

export interface CvDocument {
  schemaVersion: typeof CV_SCHEMA_VERSION
  id: string
  title: string
  createdAt: string
  updatedAt: string
  contact: Contact
  summary: string
  experiences: Experience[]
  educations: Education[]
  skills: string[]
  languages: string[]
}

export function createId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

export function createCvDocument(): CvDocument {
  const now = new Date().toISOString()
  return {
    schemaVersion: CV_SCHEMA_VERSION,
    id: createId(),
    title: 'Mon CV',
    createdAt: now,
    updatedAt: now,
    contact: { fullName: '', headline: '', email: '', phone: '' },
    summary: '',
    experiences: [],
    educations: [],
    skills: [],
    languages: [],
  }
}

export function createExperience(): Experience {
  return { id: createId(), role: '', company: '', location: '', startDate: '', endDate: '', current: false, description: '' }
}

export function createEducation(): Education {
  return { id: createId(), program: '', institution: '', endDate: '' }
}

export function duplicateCvDocument(cv: CvDocument): CvDocument {
  const now = new Date().toISOString()
  return {
    ...cv,
    id: createId(),
    title: `${cv.title} (copie)`,
    createdAt: now,
    updatedAt: now,
    contact: { ...cv.contact },
    experiences: cv.experiences.map((entry) => ({ ...entry, id: createId() })),
    educations: cv.educations.map((entry) => ({ ...entry, id: createId() })),
    skills: [...cv.skills],
    languages: [...cv.languages],
  }
}

export function validateContact(contact: Pick<Contact, 'fullName' | 'email' | 'phone'>): string | null {
  if (!contact.fullName.trim() || (!contact.email.trim() && !contact.phone.trim())) {
    return 'Ajoutez votre nom et au moins un moyen de contact avant de télécharger le CV.'
  }
  if (contact.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim())) {
    return 'Vérifiez votre adresse e-mail avant de télécharger le CV.'
  }
  return null
}

const validMonth = (value: string) => !value || /^\d{4}-(0[1-9]|1[0-2])$/.test(value)

export function validateCvForExport(cv: CvDocument): string | null {
  const contactError = validateContact(cv.contact)
  if (contactError) return contactError
  for (const entry of cv.experiences) {
    if (!validMonth(entry.startDate) || !validMonth(entry.endDate)) return 'Écrivez les dates au format AAAA-MM.'
    if (!entry.current && entry.startDate && entry.endDate && entry.startDate > entry.endDate) {
      return 'Corrigez les dates de vos expériences avant de télécharger le CV.'
    }
  }
  if (cv.educations.some((entry) => !validMonth(entry.endDate))) return 'Écrivez les dates au format AAAA-MM.'
  return null
}

function isCvDocument(value: unknown): value is CvDocument {
  if (!value || typeof value !== 'object') return false
  const cv = value as Partial<CvDocument>
  return cv.schemaVersion === CV_SCHEMA_VERSION
    && typeof cv.id === 'string'
    && typeof cv.title === 'string'
    && typeof cv.createdAt === 'string'
    && typeof cv.updatedAt === 'string'
    && !!cv.contact && typeof cv.contact.fullName === 'string'
    && typeof cv.contact.headline === 'string'
    && typeof cv.contact.email === 'string'
    && typeof cv.contact.phone === 'string'
    && typeof cv.summary === 'string'
    && Array.isArray(cv.experiences) && cv.experiences.every((entry) => typeof entry.id === 'string' && typeof entry.role === 'string' && typeof entry.company === 'string' && typeof entry.location === 'string' && typeof entry.startDate === 'string' && typeof entry.endDate === 'string' && typeof entry.current === 'boolean' && typeof entry.description === 'string')
    && Array.isArray(cv.educations) && cv.educations.every((entry) => typeof entry.id === 'string' && typeof entry.program === 'string' && typeof entry.institution === 'string' && typeof entry.endDate === 'string')
    && Array.isArray(cv.skills) && cv.skills.every((item) => typeof item === 'string')
    && Array.isArray(cv.languages) && cv.languages.every((item) => typeof item === 'string')
}

export function parseCvCollection(raw: string | null): CvDocument[] {
  if (raw === null) return []
  const data: unknown = JSON.parse(raw)
  if (!data || typeof data !== 'object') throw new Error('Contenu de CV illisible')
  const collection = data as { schemaVersion?: number; documents?: unknown }
  if (collection.schemaVersion !== CV_SCHEMA_VERSION || !Array.isArray(collection.documents) || !collection.documents.every(isCvDocument)) {
    throw new Error('Version des CV inconnue ou données incomplètes')
  }
  return collection.documents
}

export function serializeCvCollection(documents: CvDocument[]): string {
  return JSON.stringify({ schemaVersion: CV_SCHEMA_VERSION, documents })
}
