import type { CvDocument } from '@hatua/domain'

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character] ?? character)
}

export function formatMonth(value: string): string {
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(value)) return value
  return new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${value}-01T00:00:00Z`))
}

const entry = (text: string) => `<span>${escapeHtml(text)}</span>`

export function renderCvHtml(cv: CvDocument): string {
  const contact = [cv.contact.email.trim(), cv.contact.phone.trim()].filter(Boolean).map(entry).join(' · ')
  const experiences = cv.experiences.filter((item) => item.role.trim() || item.company.trim() || item.description.trim())
  const educations = cv.educations.filter((item) => item.program.trim() || item.institution.trim())
  const section = (title: string, body: string) => body ? `<section><h2>${title}</h2>${body}</section>` : ''
  const experienceHtml = experiences.map((item) => {
    const dates = [formatMonth(item.startDate), item.current ? 'Aujourd’hui' : formatMonth(item.endDate)].filter(Boolean).join(' – ')
    return `<article><div class="row"><strong>${escapeHtml(item.role)}</strong><span>${escapeHtml(dates)}</span></div><p>${[item.company, item.location].filter(Boolean).map(escapeHtml).join(' · ')}</p>${item.description.trim() ? `<p class="description">${escapeHtml(item.description)}</p>` : ''}</article>`
  }).join('')
  const educationHtml = educations.map((item) => `<article><div class="row"><strong>${escapeHtml(item.program)}</strong><span>${escapeHtml(formatMonth(item.endDate))}</span></div><p>${escapeHtml(item.institution)}</p></article>`).join('')
  const tagList = (items: string[]) => items.filter((item) => item.trim()).map((item) => `<span class="tag">${escapeHtml(item)}</span>`).join('')

  return `<!DOCTYPE html>
<html lang="fr"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" />
<style>
  @page { size: A4; margin: 17mm; }
  * { box-sizing: border-box; }
  body { color: #142341; font-family: Arial, Helvetica, sans-serif; font-size: 10.5pt; line-height: 1.48; margin: 0; }
  header { border-bottom: 3px solid #2753bf; padding-bottom: 15px; margin-bottom: 20px; }
  h1 { margin: 0 0 5px; font-size: 24pt; letter-spacing: -.5px; }
  .headline { font-size: 12pt; color: #2753bf; margin: 0 0 9px; }
  .contact { color: #475569; font-size: 9.5pt; }
  section { margin: 0 0 20px; }
  h2 { font-size: 11pt; text-transform: uppercase; color: #2753bf; letter-spacing: 1px; border-bottom: 1px solid #dce5f6; padding-bottom: 5px; margin: 0 0 10px; }
  article { margin-bottom: 13px; break-inside: avoid; page-break-inside: avoid; }
  .row { display: flex; justify-content: space-between; gap: 14px; }
  .row > span { font-size: 9pt; color: #64748b; text-align: right; white-space: nowrap; }
  p { margin: 4px 0; }
  .description, .summary { white-space: pre-line; }
  .tag { display: inline-block; padding: 4px 8px; background: #edf2ff; margin: 0 6px 7px 0; border-radius: 4px; }
</style></head><body>
  <header><h1>${escapeHtml(cv.contact.fullName)}</h1>${cv.contact.headline.trim() ? `<p class="headline">${escapeHtml(cv.contact.headline)}</p>` : ''}<div class="contact">${contact}</div></header>
  ${section('Profil', cv.summary.trim() ? `<p class="summary">${escapeHtml(cv.summary)}</p>` : '')}
  ${section('Expériences', experienceHtml)}
  ${section('Formations', educationHtml)}
  ${section('Compétences', tagList(cv.skills))}
  ${section('Langues', tagList(cv.languages))}
</body></html>`
}
