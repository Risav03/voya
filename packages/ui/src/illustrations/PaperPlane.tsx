import Svg, { Circle, Path } from 'react-native-svg';

import { Colors } from '../colors';

export function PaperPlane({ size = 80, color = Colors.coral }: { size?: number; color?: string }) {
  const h = size * 0.7;
  return (
    <Svg width={size} height={h} viewBox="0 0 80 56" fill="none">
      <Path d="M2 28L78 4L54 52L40 34L2 28z" fill={color} opacity={0.9} />
      <Path d="M40 34L78 4L54 52z" fill={color} opacity={0.4} />
      <Path d="M2 28L40 34L34 46z" fill="white" opacity={0.3} />
      {[0, 1, 2, 3].map((i) => (
        <Circle key={i} cx={8 + i * 10} cy={38 + i * 4} r={2.5 - i * 0.4} fill={color} opacity={0.5 - i * 0.1} />
      ))}
    </Svg>
  );
}
