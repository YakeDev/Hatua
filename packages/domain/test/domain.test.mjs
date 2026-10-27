import test from 'node:test'
import assert from 'node:assert/strict'

import { createCvDocument, createExperience, duplicateCvDocument, parseCvCollection, serializeCvCollection, validateCvForExport } from '../src/index.ts'
import { renderCvHtml } from '../../../apps/mobile/src/lib/renderCvHtml.ts'

test('un CV enregistré est relu sans perte et un format inconnu est refusé', () => {
  const cv = createCvDocument()
  cv.contact.fullName = 'Aline Kasongo'
  cv.experiences.push({ ...createExperience(), role: 'Technicienne', description: 'Maintenance sur site' })
  const restored = parseCvCollection(serializeCvCollection([cv]))
  assert.deepEqual(restored, [cv])
  assert.throws(() => parseCvCollection('{invalid'))
  assert.throws(() => parseCvCollection(JSON.stringify({ schemaVersion: 2, documents: [cv] })))
})

test('une copie conserve le parcours sans partager les mêmes entrées', () => {
  const cv = createCvDocument()
  cv.experiences.push({ ...createExperience(), role: 'Graphiste' })
  const copy = duplicateCvDocument(cv)
  assert.notEqual(copy.id, cv.id)
  assert.notEqual(copy.experiences[0].id, cv.experiences[0].id)
  copy.experiences[0].role = 'Webmaster'
  assert.equal(cv.experiences[0].role, 'Graphiste')
})

test('l’export exige un contact cohérent et des périodes valides', () => {
  const cv = createCvDocument()
  assert.match(validateCvForExport(cv), /nom/)
  cv.contact.fullName = 'Aline Kasongo'
  cv.contact.email = 'mail incomplet'
  assert.match(validateCvForExport(cv), /e-mail/)
  cv.contact.email = 'aline@example.com'
  cv.experiences.push({ ...createExperience(), startDate: '2025-05', endDate: '2024-11' })
  assert.match(validateCvForExport(cv), /dates/)
  cv.experiences[0].endDate = '2025-08'
  assert.equal(validateCvForExport(cv), null)
})

test('le document PDF échappe le texte saisi et ignore les rubriques vides', () => {
  const cv = createCvDocument()
  cv.contact.fullName = '<script>alert(1)</script>'
  cv.contact.phone = '+243'
  cv.summary = 'Travail <fiable> & précis'
  const html = renderCvHtml(cv)
  assert.ok(html.includes('&lt;script&gt;alert(1)&lt;/script&gt;'))
  assert.ok(html.includes('Travail &lt;fiable&gt; &amp; précis'))
  assert.ok(!html.includes('<script>'))
  assert.ok(!html.includes('<h2>Expériences</h2>'))
})
