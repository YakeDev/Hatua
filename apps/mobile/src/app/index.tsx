import { useRouter } from 'expo-router'
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { ActionButton, colors } from '@/components/ui'
import { useCvStore } from '@/state/CvStore'

export default function HomeScreen() {
  const router = useRouter()
  const { documents, storageError, addDocument, duplicateDocument, deleteDocument } = useCvStore()

  const create = () => {
    const id = addDocument()
    router.push({ pathname: '/cv/[id]', params: { id } })
  }

  const confirmDelete = (id: string, title: string) => {
    Alert.alert('Supprimer ce CV ?', `« ${title} » sera effacé de cet appareil.`, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: () => deleteDocument(id) },
    ])
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.brand}>hatua<Text style={styles.dot}>.</Text></Text>
          <Text style={styles.offline}>CV sur cet appareil</Text>
        </View>

        <View style={styles.hero}>
          <Text style={styles.eyebrow}>VOTRE CANDIDATURE COMMENCE ICI</Text>
          <Text style={styles.heroTitle}>Un CV clair, prêt à partager.</Text>
          <Text style={styles.heroBody}>Présentez votre parcours, modifiez-le à votre rythme et partagez-le en PDF.</Text>
        </View>

        {storageError && <Text accessibilityRole="alert" style={styles.error}>{storageError}</Text>}

        <View style={styles.sectionHeading}>
          <View>
            <Text style={styles.sectionTitle}>Mes CV</Text>
            <Text style={styles.subTitle}>{documents.length} document{documents.length > 1 ? 's' : ''} enregistré{documents.length > 1 ? 's' : ''}</Text>
          </View>
        </View>
        <ActionButton label="+ Créer un CV" onPress={create} />

        {documents.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Commençons par votre parcours</Text>
            <Text style={styles.emptyBody}>Ajoutez vos coordonnées, expériences et formations. Vos modifications sont sauvegardées sur ce téléphone.</Text>
          </View>
        )}

        {documents.map((cv) => (
          <View key={cv.id} style={styles.card}>
            <Text style={styles.cardEyebrow}>CURRICULUM VITAE</Text>
            <Text style={styles.cardTitle}>{cv.title.trim() || 'Mon CV'}</Text>
            <Text style={styles.cardSub}>{cv.contact.fullName.trim() || 'Nom à ajouter'} · Modifié le {new Date(cv.updatedAt).toLocaleDateString('fr-FR')}</Text>
            <View style={styles.cardActions}>
              <Pressable accessibilityRole="button" onPress={() => router.push({ pathname: '/cv/[id]', params: { id: cv.id } })}><Text style={styles.actionPrimary}>Modifier →</Text></Pressable>
              <Pressable accessibilityRole="button" onPress={() => duplicateDocument(cv.id)}><Text style={styles.action}>Dupliquer</Text></Pressable>
              <Pressable accessibilityRole="button" onPress={() => confirmDelete(cv.id, cv.title)}><Text style={styles.actionDanger}>Supprimer</Text></Pressable>
            </View>
          </View>
        ))}
        <Text style={styles.footer}>Sans compte pour le moment · Les CV ne sont pas synchronisés entre appareils.</Text>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 52 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 23 },
  brand: { color: colors.navy, fontWeight: '800', fontSize: 28, letterSpacing: -1.5 },
  dot: { color: '#eb845b' },
  offline: { color: colors.muted, fontSize: 12 },
  hero: { backgroundColor: colors.navy, borderRadius: 22, padding: 27, marginBottom: 29 },
  eyebrow: { color: '#a9c3ff', fontSize: 10, fontWeight: '800', letterSpacing: 1.5, marginBottom: 13 },
  heroTitle: { color: colors.white, fontWeight: '800', fontSize: 31, lineHeight: 35, letterSpacing: -1, marginBottom: 13 },
  heroBody: { color: '#dbe5fb', fontSize: 15, lineHeight: 23 },
  sectionHeading: { marginBottom: 17 },
  sectionTitle: { fontSize: 23, fontWeight: '800', color: colors.navy },
  subTitle: { color: colors.muted, fontSize: 13, marginTop: 3 },
  error: { color: colors.danger, backgroundColor: '#fff0ef', borderRadius: 9, padding: 12, marginBottom: 16 },
  empty: { backgroundColor: colors.white, borderRadius: 16, padding: 25, marginTop: 16, borderWidth: 1, borderColor: colors.border },
  emptyTitle: { color: colors.navy, fontSize: 18, fontWeight: '700', marginBottom: 8 },
  emptyBody: { color: colors.muted, fontSize: 14, lineHeight: 22 },
  card: { backgroundColor: colors.white, padding: 22, borderRadius: 16, borderWidth: 1, borderColor: colors.border, marginTop: 14 },
  cardEyebrow: { color: colors.blue, fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
  cardTitle: { color: colors.navy, fontSize: 19, fontWeight: '700', marginTop: 6 },
  cardSub: { color: colors.muted, fontSize: 12, marginTop: 7 },
  cardActions: { flexDirection: 'row', gap: 20, flexWrap: 'wrap', borderTopWidth: 1, borderTopColor: colors.border, marginTop: 18, paddingTop: 17 },
  actionPrimary: { color: colors.blue, fontSize: 13, fontWeight: '700' },
  action: { color: colors.navy, fontSize: 13, fontWeight: '600' },
  actionDanger: { color: colors.danger, fontSize: 13, fontWeight: '600' },
  footer: { color: colors.muted, fontSize: 12, textAlign: 'center', marginTop: 30, lineHeight: 19 },
})
