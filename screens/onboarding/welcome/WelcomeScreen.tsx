import { useState } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent, SafeAreaView, StyleSheet } from 'react-native'

import { AuthenticationWrapper } from '@/components/wrappers/AuthenticationWrapper'
import { palette } from '@/constants/palette'
import { typography } from '@/constants/typography'
import { slides } from '@/data/welcome/slides'
import { useNavigation } from '@/hooks/useNavigation'
import { getWindowWidth } from '@/utils/getWindowWidth'
import { useQueryClient } from '@tanstack/react-query'
import { PaginationDots } from './components/PaginationDots'
import { WelcomeSlider } from './components/WelcomeSlider'
interface ScrollEvent {
  (event: NativeSyntheticEvent<NativeScrollEvent>): void
}

export const WelcomeScreen = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const { navigateToAuthentication } = useNavigation()
  const queryClient = useQueryClient()
  const handleScroll: ScrollEvent = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x
    const index = Math.floor(contentOffsetX / getWindowWidth())
    setActiveIndex(index)
  }

  const buttonData = [{ text: typography.onboarding.getStarted, onPress: navigateToAuthentication, filled: true }]

  return (
    <SafeAreaView style={styles.container}>
      <AuthenticationWrapper screenName={typography.onboarding.fugoFlash} buttonData={buttonData} rightIcon="info">
        <WelcomeSlider slides={slides} onScroll={handleScroll} />
        <PaginationDots slides={slides} activeIndex={activeIndex} />
      </AuthenticationWrapper>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: palette.colors.white
  }
})
