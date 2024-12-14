import React from 'react'
import { View } from 'react-native'
import Svg, { ClipPath, Defs, G, Path, SvgProps } from 'react-native-svg'

export const OrientationIcon = (props: SvgProps) => (
  <View
    style={{
      width: 24, // Container width
      height: 24, // Container height
      borderRadius: 6, // Optional, to make the container rounded
      justifyContent: 'center', // Centers vertically
      alignItems: 'flex-start' // Centers horizontally,
    }}
  >
    <Svg width={16} height={16} viewBox="0 0 12 12" fill="none" {...props}>
      <G clipPath="url(#a)">
        <Path
          fill="#495057"
          d="M1 2c0-.276.228-.5.496-.5h9.008c.274 0 .496.222.496.5v7c0 .276-.227.5-.496.5H1.496A.497.497 0 0 1 1 9V2Zm1 .5v6h8v-6H2Zm.5 7.5h7v1h-7v-1Z"
        />
      </G>
      <Defs>
        <ClipPath id="a">
          <Path fill="#fff" d="M0 0h12v12H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  </View>
)
