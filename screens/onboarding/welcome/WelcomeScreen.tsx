import { router } from 'expo-router'
import { useState } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent, SafeAreaView, StyleSheet } from 'react-native'

import { AuthenticationWrapper } from '@/components/wrappers/AuthenticationWrapper'
import { typography } from '@/constants/typography'
import { slides } from '@/data/welcome/slides'
import { getWindowWidth } from '@/utils/getWindowWidth'
import { PaginationDots } from './components/PaginationDots'
import { WelcomeSlider } from './components/WelcomeSlider'

import { palette } from '@/constants/palette'
import AsyncStorage from '@react-native-async-storage/async-storage'
interface ScrollEvent {
  (event: NativeSyntheticEvent<NativeScrollEvent>): void
}

export const WelcomeScreen = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const handleScroll: ScrollEvent = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x
    const index = Math.floor(contentOffsetX / getWindowWidth())
    setActiveIndex(index)
  }

  const handleGetStarted = async () => {
    await AsyncStorage.setItem('welcomeScreenVisited', 'true')
    router.push('/auth')
  }

  const buttonData = [
    { text: typography.onboarding.getStarted, onPress: handleGetStarted, filled: true, disabled: false }
  ]

  return (
    <SafeAreaView style={styles.container}>
      <AuthenticationWrapper screenName={typography.onboarding.fugoFlash} buttonData={buttonData}>
        <WelcomeSlider slides={slides} onScroll={handleScroll} />
        <PaginationDots slides={slides} activeIndex={activeIndex} />
      </AuthenticationWrapper>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.colors.white
  },
  safeArea: {
    backgroundColor: palette.colors.white
  }
})
