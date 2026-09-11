/**
 * TaskFlow Design System — public API
 *
 * Consume components from here (or from `src/components/<Name>`). Types are
 * re-exported alongside their components.
 */

/* Foundations */
export { cssTokens } from './tokens'
export type { TaskStatus, TaskPriority, TaskData } from './types/task'

/* Icons + brand */
export { Icon } from './components/Icon'
export type { IconProps, IconName } from './components/Icon'
export { TaskflowLogo } from './components/TaskflowLogo'
export type { TaskflowLogoProps } from './components/TaskflowLogo'

/* Primitives */
export { Button } from './components/Button'
export type { ButtonProps, ButtonVariant, ButtonSize } from './components/Button'
export { Input } from './components/Input'
export type { InputProps } from './components/Input'
export { Select } from './components/Select'
export type { SelectProps } from './components/Select'
export { Checkbox } from './components/Checkbox'
export type { CheckboxProps } from './components/Checkbox'
export { Badge } from './components/Badge'
export type { BadgeProps, BadgeVariant, BadgeSize } from './components/Badge'
export { Avatar } from './components/Avatar'
export type { AvatarProps, AvatarSize, AvatarStatus } from './components/Avatar'
export { Card } from './components/Card'
export type { CardProps, CardVariant } from './components/Card'
export { Tabs } from './components/Tabs'
export type { TabsProps, TabItem } from './components/Tabs'
export { Tooltip } from './components/Tooltip'
export type { TooltipProps, TooltipPosition } from './components/Tooltip'
export { Spinner } from './components/Spinner'
export type { SpinnerProps } from './components/Spinner'

/* Navigation */
export { Sidebar } from './components/Sidebar'
export type {
  SidebarProps,
  SidebarItem,
  SidebarSection,
  SidebarUser,
} from './components/Sidebar'
export { Topbar } from './components/Topbar'
export type { TopbarProps } from './components/Topbar'
export { Breadcrumbs } from './components/Breadcrumbs'
export type { BreadcrumbsProps, BreadcrumbItem } from './components/Breadcrumbs'

/* Feedback + overlays */
export { Modal } from './components/Modal'
export type { ModalProps, ModalSize } from './components/Modal'
export { Drawer } from './components/Drawer'
export type { DrawerProps, DrawerSide } from './components/Drawer'
export { ToastProvider, useToast } from './components/Toast'
export type { ToastInput, ToastVariant, ToastOptions } from './components/Toast'
export { Skeleton } from './components/Skeleton'
export type { SkeletonProps } from './components/Skeleton'
export { EmptyState } from './components/EmptyState'
export type { EmptyStateProps } from './components/EmptyState'
export { ErrorState } from './components/ErrorState'
export type { ErrorStateProps } from './components/ErrorState'

/* Product components */
export { StatusBadge } from './components/StatusBadge'
export type { StatusBadgeProps } from './components/StatusBadge'
export { PriorityBadge } from './components/PriorityBadge'
export type { PriorityBadgeProps } from './components/PriorityBadge'
export { TaskCard } from './components/TaskCard'
export type { TaskCardProps } from './components/TaskCard'
export { TaskList } from './components/TaskList'
export type { TaskListProps } from './components/TaskList'
export { ProjectProgress } from './components/ProjectProgress'
export type { ProjectProgressProps, ProgressTone } from './components/ProjectProgress'
export { TeamMember } from './components/TeamMember'
export type { TeamMemberProps } from './components/TeamMember'

/* Utilities */
export { cx } from './utils/cx'
export type { ClassValue } from './utils/cx'