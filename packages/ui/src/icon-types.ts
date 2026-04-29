import type { ComponentType } from 'react';

/** Props Lucide-compatible icon components accept; kept structural to avoid duplicate-package type clashes in monorepos. */
export type IconProps = {
  size?: number | string;
  color?: string;
  strokeWidth?: number | string;
  absoluteStrokeWidth?: boolean;
};

export type IconComponent = ComponentType<IconProps>;
