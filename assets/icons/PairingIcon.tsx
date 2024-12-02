import Svg, { Path, SvgProps } from 'react-native-svg'

// The PairingIcon component will now accept a `selected` prop to adjust the color
export const PairingIcon = ({ selected, ...props }: SvgProps & { selected?: boolean }) => {
  // Set the icon color based on whether it is selected
  const iconColor = selected ? '#7048E8' : '#7B838A' // Purple when selected, grey when not selected

  return (
    <Svg width={24} height={24} fill="none" {...props}>
      <Path
        fill={iconColor} // Apply dynamic color here
        d="m1.964.465.708.707A3.987 3.987 0 0 0 1.5 4c0 1.105.448 2.105 1.171 2.829l-.706.706A4.98 4.98 0 0 1 .5 4c0-1.38.56-2.63 1.464-3.535Zm8.072 0A4.984 4.984 0 0 1 11.5 4c0 1.38-.56 2.631-1.464 3.536l-.707-.707A3.987 3.987 0 0 0 10.5 4a3.988 3.988 0 0 0-1.171-2.828l.706-.707ZM6.5.5v3H8l-2.5 4v-3H4l2.5-4ZM3.378 1.88l.708.707A1.992 1.992 0 0 0 3.5 4c0 .553.224 1.053.586 1.414l-.708.708A2.993 2.993 0 0 1 2.5 4c0-.828.336-1.578.878-2.121Zm5.244 0C9.165 2.422 9.5 3.172 9.5 4c0 .829-.336 1.579-.879 2.122l-.707-.708C8.276 5.053 8.5 4.553 8.5 4c0-.552-.223-1.052-.585-1.413l.707-.708Z"
      />
    </Svg>
  )
}
