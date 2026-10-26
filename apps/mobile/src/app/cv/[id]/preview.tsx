import { validateCvForExport, type CvDocument } from '@hatua/domain'
import * as Print from 'expo-print'
import { useLocalSearchParams, useRouter } from 'expo-router'
import * as Sharing from 'expo-sharing'
import { useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { ActionButton, colors } from '@/components/ui'
import { formatMonth, renderCvHtml } from '@/lib/renderCvHtml'
import { useCvStore } from '@/state/CvStore'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <View style={styles.section}><Text style={styles.sectionTitle}>{title}</Text>{children}</View>
}

function DocumentPreview({ cv }: { cv: CvDocument }) {
  const experiences = cv.experiences.filter((entry) => entry.role.trim() || entry.company.trim() || entry.description.trim())
  const educations = cv.educations.filter((entry) => entry.program.trim() || entry.institution.trim())
  return (
    <View style={styles.paper}>
      <View style={styles.paperHeader}>
        <Text style={styles.paperName} selectable>{cv.contact.fullName.trim() || 'Votre nom'}</Text>
        {Boolean(cv.contact.headline.trim()) && <Text style={styles.paperHeadline} selectable>{cv.contact.headline}</Text>}
        <Text style={styles.paperContact} selectable>{[cv.contact.email, cv.contact.phone].filter(Boolean).join(' · ')}</Text>
      </View>
      {Boolean(cv.summary.trim()) && <Section title="Profil"><Text style={styles.body} selectable>{cv.summary}</Text></Section>}
      {experiences.length > 0 && <Section title="Expériences">{experiences.map((entry) => <View key={entry.id} style={styles.entry}>
        <Text style={styles.entryTitle} selectable>{entry.role}</Text>
        <Text style={styles.details} selectable>{[entry.company, entry.location].filter(Boolean).join(' · ')}</Text>
        <Text style={styles.details} selectable>{[formatMonth(entry.startDate), entry.current ? 'Aujourd’hui' : formatMonth(entry.endDate)].filter(Boolean).join(' – ')}</Text>
        {Boolean(entry.description.trim()) && <Text style={styles.body} selectable>{entry.description}</Text>}
      </View>)}</Section>}
      {educations.length > 0 && <Section title="Formations">{educations.map((entry) => <View key={entry.id} style={styles.entry}>
        <Text style={styles.entryTitle} selectable>{entry.program}</Text>
        <Text style={styles.details} selectable>{[entry.institution, formatMonth(entry.endDate)].filter(Boolean).join(' · ')}</Text>
      </View>)}</Section>}
      {cv.skills.length > 0 && <Section title="Compétences"><Text style={styles.body} selectable>{cv.skills.join(' · ')}</Text></Section>}
      {cv.languages.length > 0 && <Section title="Langues"><Text style={styles.body} selectable>{cv.languages.join(' · ')}</Text></Section>}
    </View>
  )
}

export default function PreviewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const { documents } = useCvStore()
  const cv = documents.find((item) => item.id === id)
  const [exportError, setExportError] = useState<string | null>(null)
  const [exporting, setExporting] = useState(false)

  if (!cv) return <SafeAreaView style={styles.screen}><View style={styles.content}><Text style={styles.title}>CV introuvable</Text><ActionButton label="Retour à mes CV" onPress={() => router.replace('/')} /></View></SafeAreaView>

  const sharePdf = async () => {
    const error = validateCvForExport(cv)
    if (error) { setExportError(error); return }
    setExportError(null)
    setExporting(true)
    try {
      const { uri } = await Print.printToFileAsync({ html: renderCvHtml(cv), width: 595, height: 842 })
      if (!await Sharing.isAvailableAsync()) throw new Error('Le partage de fichiers est indisponible sur cet appareil.')
      await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: 'Partager mon CV' })
    } catch (error) {
      console.warn('Impossible de partager le PDF :', error)
      setExportError('Le PDF n’a pas pu être partagé. Réessayez sur votre téléphone.')
    } finally {
      setExporting(false)
    }
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.topBar}>
        <Pressable accessibilityRole="button" onPress={() => router.back()}><Text style={styles.back}>‹ Modifier</Text></Pressable>
        <Text style={styles.topTitle}>Aperçu du CV</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.lead}>Relisez vos informations avant de partager le document.</Text>
        {exportError && <Text accessibilityRole="alert" style={styles.error}>{exportError}</Text>}
        <DocumentPreview cv={cv} />
        <View style={styles.shareButton}><ActionButton label={exporting ? 'Création du PDF…' : 'Créer et partager le PDF'} disabled={exporting} onPress={sharePdf} /></View>
        <Text style={styles.footer}>Votre CV reste sur cet appareil. Le PDF est partagé seulement lorsque vous choisissez une application.</Text>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  topBar: { backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.border, paddingHorizontal: 20, paddingVertical: 17, flexDirection: 'row', gap: 20, alignItems: 'center' },
  back: { color: colors.blue, fontWeight: '700', fontSize: 15 },
  topTitle: { color: colors.navy, fontSize: 16, fontWeight: '700' },
  content: { padding: 17, paddingBottom: 44 },
  title: { color: colors.navy, fontSize: 23, fontWeight: '800', marginBottom: 17 },
  lead: { color: colors.muted, fontSize: 13, marginBottom: 17, lineHeight: 20 },
  paper: { backgroundColor: colors.white, padding: 24, borderRadius: 3, borderWidth: 1, borderColor: colors.border, minHeight: 420 },
  paperHeader: { borderBottomWidth: 2, borderBottomColor: colors.blue, paddingBottom: 15, marginBottom: 18 },
  paperName: { color: colors.navy, fontSize: 23, fontWeight: '800', marginBottom: 5 },
  paperHeadline: { color: colors.blue, fontSize: 13, fontWeight: '600', marginBottom: 5 },
  paperContact: { color: colors.muted, fontSize: 10 },
  section: { marginBottom: 17 },
  sectionTitle: { color: colors.blue, fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1, borderBottomWidth: 1, borderBottomColor: colors.border, paddingBottom: 5, marginBottom: 8 },
  entry: { marginBottom: 12 },
  entryTitle: { color: colors.navy, fontSize: 12, fontWeight: '700' },
  details: { color: colors.muted, fontSize: 10, marginTop: 2 },
  body: { color: colors.navy, fontSize: 11, lineHeight: 17, marginTop: 3 },
  shareButton: { marginTop: 23 },
  error: { color: colors.danger, backgroundColor: '#fff0ef', borderRadius: 9, padding: 12, marginBottom: 16 },
  footer: { color: colors.muted, fontSize: 11, textAlign: 'center', lineHeight: 17, marginTop: 17 },
})
