import { useState } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent, SafeAreaView, StyleSheet } from 'react-native'

import { getWindowWidth } from '@/utils/getWindowWidth'
import { InformationHeader } from './components/InformationHeader'
import { PaginationDots } from './components/PaginationDots'
import { WelcomeButtons } from './components/WelcomeButtons'
import { WelcomeSlider } from './components/WelcomeSlider'

import palette from '@/constants/palette'

interface Slide {
  titleUpper: string
  titleLower: string
}

interface ScrollEvent {
  (event: NativeSyntheticEvent<NativeScrollEvent>): void
}

const slides: Slide[] = [
  { titleUpper: 'All in one', titleLower: 'signage solution' },
  { titleUpper: 'Up and running in', titleLower: '30 seconds' },
  { titleUpper: 'For 1 to 1000 screens.', titleLower: 'Whatever the size.' }
]

export const WelcomeScreen = () => {
  const [activeIndex, setActiveIndex] = useState(0)

  const handleScroll: ScrollEvent = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x
    const index = Math.floor(contentOffsetX / getWindowWidth())
    setActiveIndex(index)
  }

  return (
    <SafeAreaView style={styles.container}>
      <InformationHeader />
      <WelcomeSlider slides={slides} onScroll={handleScroll} />
      <PaginationDots slides={slides} activeIndex={activeIndex} />
      <WelcomeButtons />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: palette.colors.white
  }
})
