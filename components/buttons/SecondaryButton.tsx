import { useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import { palette } from '@/constants/palette'
import { Ionicons } from '@expo/vector-icons'

interface IconButtonProps {
  text: string
  filled: boolean
  onPress: () => void
}

export const SecondaryButton = ({ text, filled, onPress }: IconButtonProps) => {
  const [pressed, setPressed] = useState(false)

  const handlePressIn = () => {
    setPressed(true)
  }

  const handlePressOut = () => {
    setPressed(false)
  }

  return (
    <Pressable
      style={[
        styles.button,
        filled ? styles.filled : styles.outlined,
        {
          backgroundColor: pressed
            ? palette.colors.blue.dark
            : filled
              ? palette.colors.purple.light
              : palette.colors.white
        }
      ]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        <Text
          style={[
            styles.buttonText,
            {
              color: pressed || filled ? palette.colors.white : palette.colors.purple.light
            }
          ]}
        >
          {text}
        </Text>
        <Ionicons
          name="add"
          style={styles.icon}
          size={16}
          color={pressed || filled ? palette.colors.white : palette.colors.purple.light}
        />
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 32,
    minWidth: 64,
    borderRadius: 30,
    paddingHorizontal: 12
  },
  filled: {
    backgroundColor: palette.colors.purple.light
  },
  outlined: {
    borderWidth: 2,
    backgroundColor: palette.colors.white,
    borderColor: palette.colors.purple.light
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 12,
    marginRight: 8
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    marginTop: 0
  }
})