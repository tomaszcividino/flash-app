import { useState } from 'react'
import { Image, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native'

import { ForwardIcon } from '@/assets/icons/ForwardIcon'
import { palette } from '@/constants/palette'

interface ScreenButtonProps {
  text: string
  filled: boolean
  onPress: () => void
  imageSource: any
}

export const ScreenButton = ({ text, filled, onPress, imageSource }: ScreenButtonProps) => {
  const { width } = useWindowDimensions()
  const buttonWidth = width - 40
  const [isPressed, setIsPressed] = useState(false)

  const handlePressIn = () => {
    setIsPressed(true)
  }

  const handlePressOut = () => {
    setIsPressed(false)
  }

  return (
    <Pressable
      style={[
        styles.button,
        filled ? styles.filled : styles.outlined,
        isPressed && { backgroundColor: palette.colors.blue.dark },
        { width: buttonWidth }
      ]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <View style={styles.buttonContent}>
        <Image source={imageSource} style={styles.buttonImage} />
        <Text style={styles.buttonText}>{text}</Text>
      </View>

      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <ForwardIcon />
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 67,
    borderRadius: 12,
    paddingHorizontal: 6,
    marginVertical: 4
  },
  filled: {
    borderWidth: 0,
    backgroundColor: palette.colors.purple.medium
  },
  outlined: {
    borderWidth: 2,
    backgroundColor: palette.colors.white
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%'
  },
  buttonImage: {
    height: '100%',
    resizeMode: 'cover',
    marginRight: 10
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    color: palette.colors.white
  },
  filledText: {
    color: palette.colors.white
  }
})
