import palette from '@/constants/palette'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'

interface PrimaryButtonProps {
  text: string
  filled: boolean
}

export const PrimaryButton = ({ text, filled }: PrimaryButtonProps) => {
  return (
    <TouchableOpacity style={[styles.button, filled ? styles.filled : styles.outlined]}>
      <Text style={[styles.buttonText, filled ? styles.filledText : styles.outlinedText]}>{text}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    width: '100%',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginVertical: 4
  },
  filled: {
    borderWidth: 0,
    backgroundColor: palette.colors.purple.light
  },
  outlined: {
    borderWidth: 2,
    backgroundColor: palette.colors.white,
    borderColor: palette.colors.purple.light
  },
  buttonText: {
    fontSize: 16
  },
  filledText: {
    color: palette.colors.white
  },
  outlinedText: {
    color: palette.colors.purple.light
  }
})
