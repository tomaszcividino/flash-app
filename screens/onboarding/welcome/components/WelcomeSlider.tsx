import { getWindowWidth } from '@/utils/getWindowWidth'
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, View } from 'react-native'
import { WelcomeSliderItem } from './WelcomeSliderItem'

interface Slide {
  titleUpper: string
  titleLower: string
}

interface WelcomeSliderProps {
  slides: Slide[]
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void
}

export const WelcomeSlider = ({ slides, onScroll }: WelcomeSliderProps) => (
  <View style={styles.sliderContainer}>
    <ScrollView
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      onScroll={onScroll}
      scrollEventThrottle={16}
      style={styles.scrollView}
    >
      {slides.map((slide, index) => (
        <WelcomeSliderItem key={index} titleUpper={slide.titleUpper} titleLower={slide.titleLower} />
      ))}
    </ScrollView>
  </View>
)

const styles = StyleSheet.create({
  sliderContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 24
  },
  scrollView: {
    width: getWindowWidth()
  }
})
