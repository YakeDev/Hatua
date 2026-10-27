import { createEducation, createExperience, type CvDocument, type Education, type Experience } from '@hatua/domain'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { ActionButton, colors, Field } from '@/components/ui'
import { useCvStore } from '@/state/CvStore'

const steps = ['Coordonnées', 'Présentation', 'Expériences', 'Formations', 'Compétences'] as const

function TagEditor({ label, items, onAdd, onRemove }: { label: string; items: string[]; onAdd: (text: string) => void; onRemove: (text: string) => void }) {
  const [input, setInput] = useState('')
  const add = () => {
    if (!input.trim()) return
    onAdd(input.trim())
    setInput('')
  }
  return (
    <View style={styles.tagSection}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.tagInputRow}>
        <TextInput accessibilityLabel={`Ajouter ${label.toLowerCase()}`} placeholder={`Ajouter ${label.toLowerCase()}`} placeholderTextColor="#8490a5" value={input} onChangeText={setInput} onSubmitEditing={add} returnKeyType="done" style={styles.tagInput} />
        <Pressable accessibilityRole="button" onPress={add} style={styles.addTag}><Text style={styles.addTagText}>Ajouter</Text></Pressable>
      </View>
      <View style={styles.tags}>
        {items.map((item) => <Pressable key={item} accessibilityRole="button" accessibilityLabel={`Retirer ${item}`} onPress={() => onRemove(item)} style={styles.tag}><Text style={styles.tagText}>{item}  ×</Text></Pressable>)}
      </View>
    </View>
  )
}

export default function EditCvScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const { documents, storageError, updateDocument } = useCvStore()
  const cv = documents.find((item) => item.id === id)
  const [step, setStep] = useState(0)

  if (!cv) {
    return <SafeAreaView style={styles.screen}><View style={styles.content}><Text style={styles.title}>CV introuvable</Text><ActionButton label="Retour à mes CV" onPress={() => router.replace('/')} /></View></SafeAreaView>
  }

  const update = (change: (current: CvDocument) => CvDocument) => updateDocument(cv.id, change)
  const contact = (field: keyof CvDocument['contact'], value: string) => update((current) => ({ ...current, contact: { ...current.contact, [field]: value } }))
  const experience = (entryId: string, change: Partial<Experience>) => update((current) => ({ ...current, experiences: current.experiences.map((entry) => entry.id === entryId ? { ...entry, ...change } : entry) }))
  const education = (entryId: string, change: Partial<Education>) => update((current) => ({ ...current, educations: current.educations.map((entry) => entry.id === entryId ? { ...entry, ...change } : entry) }))
  const addTag = (field: 'skills' | 'languages', value: string) => update((current) => current[field].some((item) => item.toLowerCase() === value.toLowerCase()) ? current : ({ ...current, [field]: [...current[field], value] }))
  const removeTag = (field: 'skills' | 'languages', value: string) => update((current) => ({ ...current, [field]: current[field].filter((item) => item !== value) }))

  const next = () => {
    if (step < steps.length - 1) setStep(step + 1)
    else router.push({ pathname: '/cv/[id]/preview', params: { id: cv.id } })
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.topBar}>
        <Pressable accessibilityRole="button" onPress={() => router.replace('/')}><Text style={styles.back}>‹ Mes CV</Text></Pressable>
        <Text style={styles.saved}>{storageError ? 'Sauvegarde indisponible' : 'Enregistré sur ce téléphone'}</Text>
      </View>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
        {storageError && <Text accessibilityRole="alert" style={styles.error}>{storageError}</Text>}
        <Text style={styles.stepLabel}>ÉTAPE {step + 1} SUR {steps.length}</Text>
        <Text style={styles.title}>{steps[step]}</Text>
        <View style={styles.progress}><View style={[styles.progressFill, { width: `${((step + 1) / steps.length) * 100}%` }]} /></View>

        {step === 0 && <View>
          <Text style={styles.lead}>Comment souhaitez-vous apparaître sur votre CV ?</Text>
          <Field label="Nom du CV" value={cv.title} onChangeText={(text) => update((current) => ({ ...current, title: text }))} placeholder="Ex. CV Développeur web" />
          <Field label="Nom complet" value={cv.contact.fullName} onChangeText={(text) => contact('fullName', text)} placeholder="Votre nom" />
          <Field label="Métier ou poste visé" value={cv.contact.headline} onChangeText={(text) => contact('headline', text)} placeholder="Ex. Technicienne informatique" />
          <Field label="Adresse e-mail" value={cv.contact.email} onChangeText={(text) => contact('email', text)} placeholder="nom@exemple.com" keyboardType="email-address" autoCapitalize="none" />
          <Field label="Téléphone" value={cv.contact.phone} onChangeText={(text) => contact('phone', text)} placeholder="+243 ..." keyboardType="phone-pad" hint="Ajoutez le code du pays pour être facilement contacté." />
        </View>}

        {step === 1 && <View>
          <Text style={styles.lead}>Présentez votre parcours en quelques phrases. Décrivez uniquement ce que vous avez réellement fait.</Text>
          <Field label="Profil professionnel (facultatif)" value={cv.summary} onChangeText={(text) => update((current) => ({ ...current, summary: text }))} placeholder="Ex. Gestionnaire de commandes avec trois ans d’expérience…" multiline />
        </View>}

        {step === 2 && <View>
          <Text style={styles.lead}>Ajoutez vos postes, stages ou missions. Une expérience peut rester sans date si vous ne la connaissez pas.</Text>
          {cv.experiences.map((entry, index) => <View style={styles.entry} key={entry.id}>
            <View style={styles.entryHeader}><Text style={styles.entryTitle}>Expérience {index + 1}</Text><Pressable accessibilityRole="button" onPress={() => update((current) => ({ ...current, experiences: current.experiences.filter((item) => item.id !== entry.id) }))}><Text style={styles.remove}>Retirer</Text></Pressable></View>
            <Field label="Poste ou mission" value={entry.role} onChangeText={(text) => experience(entry.id, { role: text })} placeholder="Ex. Agent commercial" />
            <Field label="Entreprise ou organisation" value={entry.company} onChangeText={(text) => experience(entry.id, { company: text })} placeholder="Nom de l’organisation" />
            <Field label="Ville ou lieu" value={entry.location} onChangeText={(text) => experience(entry.id, { location: text })} placeholder="Ex. Lubumbashi" />
            <Field label="Début" value={entry.startDate} onChangeText={(text) => experience(entry.id, { startDate: text })} placeholder="AAAA-MM" hint="Ex. 2024-06" />
            <View style={styles.switchRow}><Text style={styles.label}>Poste actuel</Text><Switch value={entry.current} onValueChange={(value) => experience(entry.id, { current: value, endDate: value ? '' : entry.endDate })} trackColor={{ true: colors.blue }} /></View>
            {!entry.current && <Field label="Fin" value={entry.endDate} onChangeText={(text) => experience(entry.id, { endDate: text })} placeholder="AAAA-MM" />}
            <Field label="Missions et réalisations" value={entry.description} onChangeText={(text) => experience(entry.id, { description: text })} placeholder="Décrivez une ou deux réalisations concrètes." multiline />
          </View>)}
          <ActionButton label="+ Ajouter une expérience" variant="secondary" onPress={() => update((current) => ({ ...current, experiences: [...current.experiences, createExperience()] }))} />
        </View>}

        {step === 3 && <View>
          <Text style={styles.lead}>Indiquez vos diplômes et formations utiles pour cette candidature.</Text>
          {cv.educations.map((entry, index) => <View style={styles.entry} key={entry.id}>
            <View style={styles.entryHeader}><Text style={styles.entryTitle}>Formation {index + 1}</Text><Pressable accessibilityRole="button" onPress={() => update((current) => ({ ...current, educations: current.educations.filter((item) => item.id !== entry.id) }))}><Text style={styles.remove}>Retirer</Text></Pressable></View>
            <Field label="Diplôme ou formation" value={entry.program} onChangeText={(text) => education(entry.id, { program: text })} placeholder="Ex. Licence en design" />
            <Field label="Établissement" value={entry.institution} onChangeText={(text) => education(entry.id, { institution: text })} placeholder="Ex. Université de Lubumbashi" />
            <Field label="Date de fin (facultatif)" value={entry.endDate} onChangeText={(text) => education(entry.id, { endDate: text })} placeholder="AAAA-MM" />
          </View>)}
          <ActionButton label="+ Ajouter une formation" variant="secondary" onPress={() => update((current) => ({ ...current, educations: [...current.educations, createEducation()] }))} />
        </View>}

        {step === 4 && <View>
          <Text style={styles.lead}>Ajoutez les compétences et langues que vous maîtrisez réellement. Touchez une étiquette pour la retirer.</Text>
          <TagEditor label="Compétences" items={cv.skills} onAdd={(value) => addTag('skills', value)} onRemove={(value) => removeTag('skills', value)} />
          <TagEditor label="Langues" items={cv.languages} onAdd={(value) => addTag('languages', value)} onRemove={(value) => removeTag('languages', value)} />
        </View>}

        <View style={styles.navigation}>
          {step > 0 && <View style={styles.navButton}><ActionButton label="Précédent" variant="secondary" onPress={() => setStep(step - 1)} /></View>}
          <View style={styles.navButton}><ActionButton label={step === steps.length - 1 ? 'Voir mon CV' : 'Continuer'} onPress={next} /></View>
        </View>
        <Text style={styles.footer}>Vous pouvez quitter et reprendre votre CV sur cet appareil, même sans connexion.</Text>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  topBar: { paddingHorizontal: 20, paddingVertical: 17, backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.border, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  back: { color: colors.blue, fontWeight: '700', fontSize: 15 },
  saved: { color: colors.muted, fontSize: 10, maxWidth: 150, textAlign: 'right' },
  content: { padding: 20, paddingBottom: 50 },
  stepLabel: { color: colors.blue, fontWeight: '800', fontSize: 11, letterSpacing: 1.4 },
  title: { color: colors.navy, fontSize: 27, fontWeight: '800', marginTop: 8, marginBottom: 15 },
  progress: { height: 5, backgroundColor: '#dfe7f6', borderRadius: 6, marginBottom: 25 },
  progressFill: { height: 5, backgroundColor: colors.blue, borderRadius: 6 },
  lead: { color: colors.muted, fontSize: 14, lineHeight: 22, marginBottom: 25 },
  entry: { backgroundColor: colors.white, padding: 17, borderRadius: 14, borderWidth: 1, borderColor: colors.border, marginBottom: 15 },
  entryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 17 },
  entryTitle: { color: colors.navy, fontSize: 17, fontWeight: '700' },
  remove: { color: colors.danger, fontWeight: '600', fontSize: 13 },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 },
  label: { color: colors.navy, fontSize: 14, fontWeight: '700' },
  navigation: { flexDirection: 'row', gap: 10, marginTop: 35 },
  navButton: { flex: 1 },
  footer: { color: colors.muted, fontSize: 12, textAlign: 'center', marginTop: 21, lineHeight: 18 },
  error: { color: colors.danger, backgroundColor: '#fff0ef', borderRadius: 9, padding: 12, marginBottom: 16 },
  tagSection: { marginBottom: 23 },
  tagInputRow: { flexDirection: 'row', gap: 9, marginTop: 9 },
  tagInput: { flex: 1, borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, color: colors.navy, backgroundColor: colors.white },
  addTag: { justifyContent: 'center', paddingHorizontal: 13, borderRadius: 10, backgroundColor: colors.blue },
  addTagText: { color: colors.white, fontWeight: '700', fontSize: 13 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 13 },
  tag: { paddingVertical: 8, paddingHorizontal: 11, borderRadius: 40, backgroundColor: colors.blueLight },
  tagText: { color: colors.blue, fontSize: 13, fontWeight: '600' },
})
