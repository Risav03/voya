import { useId } from 'react';
import Svg, { Circle, Defs, Ellipse, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

function useSuffix() {
  return useId().replace(/:/g, '');
}

export type Trophy3DProps = {
  color1: string;
  color2: string;
  size?: number;
};

export function Trophy3D({ color1, color2, size = 130 }: Trophy3DProps) {
  const s = useSuffix();
  const tgId = `tg-${s}`;
  const tsId = `ts-${s}`;
  const tbId = `tb-${s}`;
  const w = size;
  const scale = size / 130;

  return (
    <Svg width={w} height={size * 1.1 * 1.15} viewBox="0 0 130 150" fill="none">
      <Defs>
        <LinearGradient id={tgId} x1="0" y1="0" x2={130} y2="0">
          <Stop offset="0%" stopColor={color1} />
          <Stop offset="45%" stopColor={color2} />
          <Stop offset="100%" stopColor={color1} />
        </LinearGradient>
        <LinearGradient id={tsId} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="rgba(255,255,255,0.55)" />
          <Stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </LinearGradient>
        <LinearGradient id={tbId} x1="0" y1="0" x2={130} y2="0">
          <Stop offset="0%" stopColor={color1} stopOpacity={0.7} />
          <Stop offset="50%" stopColor={color2} />
          <Stop offset="100%" stopColor={color1} stopOpacity={0.7} />
        </LinearGradient>
      </Defs>

      <Ellipse cx="65" cy="148" rx={36 * scale} ry={5} fill={color1} opacity={0.18} />

      <Rect x={34 * scale} y={126} width={62 * scale} height={10} rx={5} fill={`url(#${tbId})`} />
      <Rect x={36 * scale} y={126} width={58 * scale} height={3} rx={2} fill="rgba(255,255,255,0.4)" />

      <Rect x={57 * scale} y={108} width={16 * scale} height={20} rx={3} fill={`url(#${tgId})`} />
      <Rect x={59 * scale} y={108} width={5 * scale} height={20} rx={2} fill="rgba(255,255,255,0.3)" />

      <Path
        d="M22 14 Q18 62 42 90 Q54 100 65 100 Q76 100 88 90 Q112 62 108 14 Z"
        fill={`url(#${tgId})`}
      />

      <Path d="M32 18 Q30 58 50 84 Q58 93 65 94 Q72 93 80 84 Q100 58 98 18 Z" fill="rgba(0,0,0,0.08)" />

      <Path d="M32 18 Q30 52 46 76 Q52 84 60 88 L58 18 Z" fill={`url(#${tsId})`} opacity={0.7} />

      <Path
        d="M22 30 Q4 30 4 52 Q4 72 22 70"
        stroke={`url(#${tgId})`}
        strokeWidth={10}
        fill="none"
        strokeLinecap="round"
      />
      <Path
        d="M108 30 Q126 30 126 52 Q126 72 108 70"
        stroke={`url(#${tgId})`}
        strokeWidth={10}
        fill="none"
        strokeLinecap="round"
      />
      <Path d="M22 33 Q8 34 7 52" stroke="rgba(255,255,255,0.35)" strokeWidth={3} fill="none" strokeLinecap="round" />
      <Path d="M108 33 Q122 34 123 52" stroke="rgba(255,255,255,0.35)" strokeWidth={3} fill="none" strokeLinecap="round" />

      <Circle cx={14 * scale} cy={10} r={4} fill={color2} opacity={0.7} />
      <Circle cx={116 * scale} cy={8} r={3} fill={color2} opacity={0.7} />
      <Circle cx={8 * scale} cy={88} r={3} fill={color2} opacity={0.7} />
      <Circle cx={122 * scale} cy={82} r={4} fill={color2} opacity={0.7} />
    </Svg>
  );
}
