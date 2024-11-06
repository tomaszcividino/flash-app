import Svg, { ClipPath, Defs, G, Path, Rect, SvgProps } from 'react-native-svg'

export const GoogleIcon = (props: SvgProps) => (
  <Svg width={40} height={40} fill="none" {...props}>
    <Rect width={38} height={38} x={1} y={1} stroke="#7048E8" strokeWidth={2} rx={19} />
    <G clipPath="url(#a)">
      <G clipPath="url(#b)">
        <Path
          fill="#5028C6"
          d="M20 19.333h5.689c.029.257.044.52.044.79 0 1.822-.653 3.357-1.785 4.4-.99.914-2.345 1.45-3.961 1.45a5.985 5.985 0 0 1-4.234-10.22A5.983 5.983 0 0 1 19.987 14c1.613 0 2.968.593 4.005 1.56l-.975.973a4.281 4.281 0 0 0-3.017-1.2 4.666 4.666 0 1 0 0 9.334c2.35 0 4.096-1.739 4.385-4H20v-1.334Z"
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
