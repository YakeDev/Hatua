import { Pressable, StyleSheet, Text, TextInput, View, type KeyboardTypeOptions, type TextInputProps } from 'react-native'

export const colors = {
  navy: '#142341',
  blue: '#2753bf',
  blueLight: '#e9f0ff',
  background: '#f5f7fb',
  white: '#ffffff',
  muted: '#63718a',
  border: '#dfe5f0',
  danger: '#b33b3b',
} as const

export function ActionButton({ label, onPress, variant = 'primary', disabled = false }: {
  label: string
  onPress: () => void
  variant?: 'primary' | 'secondary' | 'danger'
  disabled?: boolean
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [styles.button, variant === 'secondary' && styles.secondaryButton, variant === 'danger' && styles.dangerButton, pressed && styles.pressed, disabled && styles.disabled]}
    >
      <Text style={[styles.buttonLabel, variant === 'secondary' && styles.secondaryLabel, variant === 'danger' && styles.dangerLabel]}>{label}</Text>
    </Pressable>
  )
}

export function Field({ label, value, onChangeText, placeholder, hint, multiline = false, keyboardType, autoCapitalize }: {
  label: string
  value: string
  onChangeText: (text: string) => void
  placeholder?: string
  hint?: string
  multiline?: boolean
  keyboardType?: KeyboardTypeOptions
  autoCapitalize?: TextInputProps['autoCapitalize']
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#8490a5"
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        style={[styles.input, multiline && styles.multiline]}
      />
      {hint && <Text style={styles.hint}>{hint}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  button: { minHeight: 48, paddingHorizontal: 18, paddingVertical: 12, backgroundColor: colors.blue, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  secondaryButton: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border },
  dangerButton: { backgroundColor: '#fff0ef', borderWidth: 1, borderColor: '#f3c9c8' },
  buttonLabel: { color: colors.white, fontSize: 15, fontWeight: '700' },
  secondaryLabel: { color: colors.navy },
  dangerLabel: { color: colors.danger },
  pressed: { opacity: .75 },
  disabled: { opacity: .5 },
  field: { marginBottom: 18 },
  fieldLabel: { color: colors.navy, fontWeight: '700', fontSize: 14, marginBottom: 8 },
  input: { minHeight: 48, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.white, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, fontSize: 16, color: colors.navy },
  multiline: { minHeight: 106 },
  hint: { color: colors.muted, fontSize: 12, marginTop: 6, lineHeight: 18 },
})
