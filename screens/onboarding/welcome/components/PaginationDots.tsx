import palette from '@/constants/palette'
import { StyleSheet, View } from 'react-native'

interface Slide {
  titleUpper: string
  titleLower: string
}

interface PaginationDotsProps {
  slides: Slide[]
  activeIndex: number
}

export const PaginationDots: React.FC<PaginationDotsProps> = ({ slides, activeIndex }) => (
  <View style={styles.dotsContainer}>
    {Array.from({ length: slides.length }, (_, index) => (
      <View
        key={index}
        style={[styles.dot, index <= activeIndex || index === 0 ? styles.activeDot : styles.inactiveDot]}
      />
    ))}
  </View>
)

const styles = StyleSheet.create({
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8
  },
  dot: {
    width: 16,
    height: 8,
    borderRadius: 40,
    marginHorizontal: 4
  },
  activeDot: {
    backgroundColor: palette.colors.purple.light
  },
  inactiveDot: {
    backgroundColor: palette.colors.grey.light
  },
  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 20
  }
})
