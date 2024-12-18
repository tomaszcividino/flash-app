import React, { useCallback, useState } from 'react'
import { Animated, Easing, PanResponder, StyleSheet, View, ViewStyle } from 'react-native'

interface SwiperProps {
  children: React.ReactNode
  leftButtons?: React.ReactNode[]
  rightButtons?: React.ReactNode[]
  leftContent?: React.ReactNode
  rightContent?: React.ReactNode
  leftButtonWidth?: number
  rightButtonWidth?: number
  onSwipeStart?: () => void
  onSwipeMove?: () => void
  onSwipeEnd?: () => void
  swipeReleaseAnimationConfig?: object
  style?: ViewStyle
  contentContainerStyle?: ViewStyle
  leftContainerStyle?: ViewStyle
  rightContainerStyle?: ViewStyle
}

export const Swiper: React.FC<SwiperProps> = ({
  children,
  leftButtons = [],
  rightButtons = [],
  leftContent,
  rightContent,
  leftButtonWidth = 75,
  rightButtonWidth = 75,
  onSwipeStart = () => {},
  onSwipeMove = () => {},
  onSwipeEnd = () => {},
  swipeReleaseAnimationConfig = {
    toValue: { x: 0, y: 0 },
    duration: 250,
    easing: Easing.elastic(0.5),
    useNativeDriver: false
  },
  style,
  contentContainerStyle,
  leftContainerStyle,
  rightContainerStyle
}) => {
  const [pan] = useState(new Animated.ValueXY())
  const [width, setWidth] = useState(0)
  const [lastOffset, setLastOffset] = useState({ x: 0, y: 0 })

  const handleLayout = useCallback(
    ({
      nativeEvent: {
        layout: { width: layoutWidth }
      }
    }) => setWidth(layoutWidth),
    []
  )

  const handleMoveShouldSetPanResponder = (event: any, gestureState: any) => Math.abs(gestureState.dx) > 15

  const handlePanResponderMove = (event: any, gestureState: any) => {
    const { dx } = gestureState
    pan.setValue({ x: dx, y: 0 })
    onSwipeMove(event, gestureState)
  }

  const handlePanResponderRelease = (event: any, gestureState: any) => {
    onSwipeEnd(event, gestureState)
    Animated.timing(pan, {
      toValue: { x: 0, y: 0 },
      duration: swipeReleaseAnimationConfig.duration,
      easing: swipeReleaseAnimationConfig.easing,
      useNativeDriver: swipeReleaseAnimationConfig.useNativeDriver
    }).start(() => {
      setLastOffset({ x: 0, y: 0 })
      pan.flattenOffset()
    })
  }

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: handleMoveShouldSetPanResponder,
    onPanResponderGrant: (event, gestureState) => {
      pan.setOffset(lastOffset)
      onSwipeStart(event, gestureState)
    },
    onPanResponderMove: handlePanResponderMove,
    onPanResponderRelease: handlePanResponderRelease,
    onPanResponderTerminate: handlePanResponderRelease
  })

  const renderButtons = (buttons: React.ReactNode[], isLeft: boolean) => {
    return buttons.map((button, index) => {
      const transform = [
        {
          translateX: pan.x.interpolate({
            inputRange: [0, width],
            outputRange: isLeft ? [0, -width] : [0, width],
            extrapolate: 'clamp'
          })
        }
      ]
      return (
        <Animated.View
          key={index}
          style={[styles.button, isLeft ? leftContainerStyle : rightContainerStyle, { transform }]}
        >
          {button}
        </Animated.View>
      )
    })
  }

  return (
    <View onLayout={handleLayout} style={[styles.container, style]} {...panResponder.panHandlers}>
      {leftButtons.length > 0 && (
        <Animated.View style={[{ width }, leftContainerStyle]}>
          {leftContent || renderButtons(leftButtons, true)}
        </Animated.View>
      )}
      <Animated.View style={[styles.content, contentContainerStyle]}>{children}</Animated.View>
      {rightButtons.length > 0 && (
        <Animated.View style={[{ width }, rightContainerStyle]}>
          {rightContent || renderButtons(rightButtons, false)}
        </Animated.View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row'
  },
  content: {
    flex: 1
  },
  button: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default Swiper
