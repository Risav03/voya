import Svg, { Ellipse } from 'react-native-svg';

export function Cloud({ width = 90, opacity = 1, color = 'white' }: { width?: number; opacity?: number; color?: string }) {
  const h = width * 0.55;
  return (
    <Svg width={width} height={h} viewBox="0 0 90 50" fill="none">
      <Ellipse cx="45" cy="35" rx="38" ry="20" fill={color} opacity={opacity} />
      <Ellipse cx="30" cy="30" rx="22" ry="18" fill={color} opacity={opacity} />
      <Ellipse cx="62" cy="32" rx="20" ry="16" fill={color} opacity={opacity} />
    </Svg>
  );
}
