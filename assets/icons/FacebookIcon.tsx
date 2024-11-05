import Svg, { ClipPath, Defs, G, Path, Rect, SvgProps } from 'react-native-svg'

export const FacebookIcon = (props: SvgProps) => (
  <Svg width={40} height={40} fill="none" {...props}>
    <Rect width={38} height={38} x={1} y={1} stroke="#7048E8" strokeWidth={2} rx={19} />
    <G clipPath="url(#a)">
      <G clipPath="url(#b)">
        <Path
          fill="#5028C6"
          d="M21.333 24.667h3.334v-9.334h-9.334v9.334H20v-3.334h-1.333V20H20v-1.103c0-.891.093-1.214.267-1.54.17-.323.434-.587.757-.757.255-.137.571-.219 1.125-.254.219-.014.503.003.852.053v1.267h-.334c-.612 0-.864.029-1.015.11a.485.485 0 0 0-.21.209c-.08.15-.109.3-.109.912V20H23l-.333 1.333h-1.334v3.334ZM14.667 14h10.666a.666.666 0 0 1 .667.667v10.666a.666.666 0 0 1-.667.667H14.667a.666.666 0 0 1-.667-.667V14.667a.666.666 0 0 1 .667-.667Z"
        />
      </G>
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M12 12h16v16H12z" />
      </ClipPath>
      <ClipPath id="b">
        <Path fill="#fff" d="M12 12h16v16H12z" />
      </ClipPath>
    </Defs>
  </Svg>
)
