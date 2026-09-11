import type { ReactElement, SVGProps } from 'react'

/**
 * Central TaskFlow icon registry.
 *
 * All icons are rendered as inline SVGs using `currentColor` so they inherit
 * text color, and either `stroke="currentColor"` (outline style) or a fill.
 * A single component keeps the icon set consistent, typed, and dependency-free.
 */

export type IconName =
  | 'search'
  | 'plus'
  | 'calendar'
  | 'dashboard'
  | 'tasks'
  | 'projects'
  | 'members'
  | 'settings'
  | 'help'
  | 'chevron-down'
  | 'chevron-right'
  | 'chevron-left'
  | 'close'
  | 'check'
  | 'check-circle'
  | 'alert-circle'
  | 'alert-triangle'
  | 'info'
  | 'menu'
  | 'more-horizontal'
  | 'user'
  | 'clock'
  | 'flag'
  | 'arrow-right'
  | 'logout'
  | 'filter'
  | 'trash'
  | 'edit'
  | 'external-link'
  | 'star'
  | 'bell'
  | 'sort'
  | 'plus-circle'
  | 'eye'
  | 'list'
  | 'grid'
  | 'x-circle'
  | 'mail'
  | 'lock'

interface IconDefinition {
  /** Outline icons: single path inside the stroke group. */
  outline?: ReactElement<SVGPathElement>
  /** Filled icons render with fill="currentColor". */
  filled?: ReactElement<SVGPathElement>
}

const s = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

const icons: Record<IconName, IconDefinition> = {
  search: {
    outline: (
      <g {...s}>
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </g>
    ),
  },
  plus: {
    outline: (
      <g {...s}>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </g>
    ),
  },
  calendar: {
    outline: (
      <g {...s}>
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4" />
        <path d="M8 2v4" />
        <path d="M3 10h18" />
      </g>
    ),
  },
  dashboard: {
    outline: (
      <g {...s}>
        <rect x="3" y="3" width="7" height="9" rx="1.5" />
        <rect x="14" y="3" width="7" height="5" rx="1.5" />
        <rect x="14" y="12" width="7" height="9" rx="1.5" />
        <rect x="3" y="16" width="7" height="5" rx="1.5" />
      </g>
    ),
  },
  tasks: {
    outline: (
      <g {...s}>
        <path d="M9 11 12 14 22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </g>
    ),
  },
  projects: {
    outline: (
      <g {...s}>
        <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-3.9a2 2 0 0 1-1.69-.9l-.81-1.2a2 2 0 0 0-1.67-.9H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2Z" />
        <path d="M2 6h4" />
        <path d="M2 10h4" />
        <path d="M2 14h4" />
        <path d="M2 18h4" />
      </g>
    ),
  },
  members: {
    outline: (
      <g {...s}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </g>
    ),
  },
  settings: {
    outline: (
      <g {...s}>
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2Z" />
        <circle cx="12" cy="12" r="3" />
      </g>
    ),
  },
  help: {
    outline: (
      <g {...s}>
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <path d="M12 17h.01" />
      </g>
    ),
  },
  'chevron-down': {
    outline: (
      <g {...s}>
        <path d="m6 9 6 6 6-6" />
      </g>
    ),
  },
  'chevron-right': {
    outline: (
      <g {...s}>
        <path d="m9 18 6-6-6-6" />
      </g>
    ),
  },
  'chevron-left': {
    outline: (
      <g {...s}>
        <path d="m15 18-6-6 6-6" />
      </g>
    ),
  },
  close: {
    outline: (
      <g {...s}>
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
      </g>
    ),
  },
  check: {
    outline: (
      <g {...s}>
        <path d="M20 6 9 17l-5-5" />
      </g>
    ),
  },
  'check-circle': {
    outline: (
      <g {...s}>
        <circle cx="12" cy="12" r="10" />
        <path d="m9 12 2 2 4-4" />
      </g>
    ),
  },
  'alert-circle': {
    outline: (
      <g {...s}>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8v4" />
        <path d="M12 16h.01" />
      </g>
    ),
  },
  'alert-triangle': {
    outline: (
      <g {...s}>
        <path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
      </g>
    ),
  },
  info: {
    outline: (
      <g {...s}>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </g>
    ),
  },
  menu: {
    outline: (
      <g {...s}>
        <path d="M4 6h16" />
        <path d="M4 12h16" />
        <path d="M4 18h16" />
      </g>
    ),
  },
  'more-horizontal': {
    outline: (
      <g {...s}>
        <circle cx="12" cy="12" r="1" fill="currentColor" />
        <circle cx="19" cy="12" r="1" fill="currentColor" />
        <circle cx="5" cy="12" r="1" fill="currentColor" />
      </g>
    ),
  },
  user: {
    outline: (
      <g {...s}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </g>
    ),
  },
  clock: {
    outline: (
      <g {...s}>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </g>
    ),
  },
  flag: {
    outline: (
      <g {...s}>
        <path d="M4 22V4a2 2 0 0 1 2-2h12l-3 4 3 4H6v12" />
      </g>
    ),
  },
  'arrow-right': {
    outline: (
      <g {...s}>
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </g>
    ),
  },
  logout: {
    outline: (
      <g {...s}>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <path d="m16 17 5-5-5-5" />
        <path d="M21 12H9" />
      </g>
    ),
  },
  filter: {
    outline: (
      <g {...s}>
        <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3Z" />
      </g>
    ),
  },
  trash: {
    outline: (
      <g {...s}>
        <path d="M3 6h18" />
        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        <path d="M10 11v6" />
        <path d="M14 11v6" />
      </g>
    ),
  },
  edit: {
    outline: (
      <g {...s}>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
      </g>
    ),
  },
  'external-link': {
    outline: (
      <g {...s}>
        <path d="M15 3h6v6" />
        <path d="M10 14 21 3" />
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      </g>
    ),
  },
  star: {
    filled: (
      <path
        d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
        fill="currentColor"
      />
    ),
  },
  bell: {
    outline: (
      <g {...s}>
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
      </g>
    ),
  },
  sort: {
    outline: (
      <g {...s}>
        <path d="M11 5h10" />
        <path d="M11 9h7" />
        <path d="M11 13h4" />
        <path d="m3 17 3 3 3-3" />
        <path d="M6 18V4" />
      </g>
    ),
  },
  'plus-circle': {
    outline: (
      <g {...s}>
        <circle cx="12" cy="12" r="10" />
        <path d="M8 12h8" />
        <path d="M12 8v8" />
      </g>
    ),
  },
  eye: {
    outline: (
      <g {...s}>
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </g>
    ),
  },
  list: {
    outline: (
      <g {...s}>
        <path d="M3 6h.01" />
        <path d="M3 12h.01" />
        <path d="M3 18h.01" />
        <path d="M8 6h13" />
        <path d="M8 12h13" />
        <path d="M8 18h13" />
      </g>
    ),
  },
  grid: {
    outline: (
      <g {...s}>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
      </g>
    ),
  },
  'x-circle': {
    outline: (
      <g {...s}>
        <circle cx="12" cy="12" r="10" />
        <path d="m15 9-6 6" />
        <path d="m9 9 6 6" />
      </g>
    ),
  },
  mail: {
    outline: (
      <g {...s}>
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-10 7L2 7" />
      </g>
    ),
  },
  lock: {
    outline: (
      <g {...s}>
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </g>
    ),
  },
}


export interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName
  /** Rendered size in px. Defaults to 20. */
  size?: number | string
  /**
   * Accessible label. When omitted the icon is treated as decorative and is
   * hidden from assistive technology.
   */
  label?: string
}

export function Icon({ name, size = 20, label, ...rest }: IconProps) {
  const definition = icons[name]
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? 'img' : undefined}
      focusable="false"
      {...rest}
    >
      {definition.filled ?? definition.outline}
    </svg>
  )
}