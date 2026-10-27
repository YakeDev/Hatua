import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { CvStoreProvider } from '@/state/CvStore'

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <CvStoreProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }} />
      </CvStoreProvider>
    </SafeAreaProvider>
  )
}
