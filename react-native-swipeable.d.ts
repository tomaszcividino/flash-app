declare module 'react-native-swipeable' {
  import { Component } from 'react'
  import { ViewStyle } from 'react-native'

  export interface SwipeableProps {
    children: React.ReactNode
    onSwipeableWillOpen?: () => void
    onSwipeableDidOpen?: () => void
    onSwipeableWillClose?: () => void
    onSwipeableDidClose?: () => void
    renderLeftActions?: (progress: any, dragX: any) => React.ReactNode
    renderRightActions?: (progress: any, dragX: any) => React.ReactNode
    leftThreshold?: number
    rightThreshold?: number
    overshootLeft?: boolean
    overshootRight?: boolean
    friction?: number
    style?: ViewStyle
  }

  export default class Swipeable extends Component<SwipeableProps> {}
}
