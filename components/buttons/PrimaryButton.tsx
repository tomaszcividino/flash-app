import { palette } from '@/constants/palette'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
interface PrimaryButtonProps {
  text: string
  filled: boolean
  onPress: any
  disabled?: boolean
  icon?: JSX.Element
  error: boolean
}

export const PrimaryButton = ({ text, filled, onPress, disabled, icon, error }: PrimaryButtonProps) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        filled ? styles.filled : styles.outlined,
        disabled && styles.disabledButton,
        error && (filled ? styles.errorFilled : styles.errorOutlined)
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        <Text
          style={[
            styles.buttonText,
            filled ? styles.filledText : styles.outlinedText,
            disabled && styles.disabledText,
            error && (filled ? styles.errorFilledText : styles.errorOutlinedText),
            icon && { marginLeft: 8 }
          ]}
        >
          {text}
        </Text>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
      </View>
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
    backgroundColor: palette.colors.purple.medium
  },
  outlined: {
    borderWidth: 2,
    backgroundColor: palette.colors.white,
    borderColor: palette.colors.purple.medium
  },
  disabledButton: {
    backgroundColor: palette.colors.grey.medium,
    borderColor: palette.colors.grey.medium
  },
  buttonText: {
    fontSize: 16
  },
  filledText: {
    color: palette.colors.white
  },
  outlinedText: {
    color: palette.colors.purple.medium
  },
  disabledText: {
    color: palette.colors.black
  },
  iconContainer: {
    marginLeft: 10,
    marginTop: 4
  },
  errorFilled: {
    backgroundColor: palette.colors.red
  },
  errorOutlined: {
    borderColor: palette.colors.red,
    backgroundColor: palette.colors.white
  },
  errorFilledText: {
    color: palette.colors.white
  },
  errorOutlinedText: {
    color: palette.colors.red
  }
})
