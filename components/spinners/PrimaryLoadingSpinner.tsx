import { palette } from '@/constants/palette'
import React from 'react'
import { ActivityIndicator, SafeAreaView, StyleSheet, View } from 'react-native'

interface SpinnerContainerProps {
  isVisible: boolean
}

export const SpinnerContainer = ({ isVisible }: SpinnerContainerProps) => {
  if (!isVisible) return null

  return (
    <SafeAreaView style={[styles.container]}>
      <View style={styles.spinnerContainer}>
        <ActivityIndicator size="large" color={palette.colors.purple.light} />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0
  },
  spinnerContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center'
  }
})
