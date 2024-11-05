import { useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  SafeAreaView,
  StyleSheet,
  View,
  StatusBar,
} from 'react-native';

import { getWindowWidth } from '@/utils/getWindowWidth';
import { InformationHeader } from './components/InformationHeader';
import { PaginationDots } from './components/PaginationDots';
import { WelcomeButtons } from './components/WelcomeButtons';
import { WelcomeSlider } from './components/WelcomeSlider';

import palette from '@/constants/palette';

interface Slide {
  titleUpper: string;
  titleLower: string;
}

interface ScrollEvent {
  (event: NativeSyntheticEvent<NativeScrollEvent>): void;
}

const slides: Slide[] = [
  { titleUpper: 'All in one', titleLower: 'signage solution' },
  { titleUpper: 'Up and running in', titleLower: '30 seconds' },
  { titleUpper: 'For 1 to 1000 screens.', titleLower: 'Whatever the size.' },
];

export const WelcomeScreen = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll: ScrollEvent = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.floor(contentOffsetX / getWindowWidth());
    setActiveIndex(index);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <InformationHeader />
      </SafeAreaView>
      <WelcomeSlider slides={slides} onScroll={handleScroll} />
      <PaginationDots slides={slides} activeIndex={activeIndex} />
      <WelcomeButtons />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  safeArea: {
    backgroundColor: 'white',
  },
});
