import {
  type ReactNode,
  type KeyboardEvent,
  useState,
  useRef,
  useId,
  createContext,
  useContext,
  useCallback,
  useMemo,
} from 'react'
import { cx } from '../../utils/cx'
import styles from './Tabs.module.css'

export type TabItem = {
  id: string
  label: ReactNode
  icon?: ReactNode
  content: ReactNode
  disabled?: boolean
}

export interface TabsProps {
  tabs: TabItem[]
  /** Initially selected tab id. Defaults to the first tab. */
  defaultValue?: string
  className?: string
}

interface TabsContextValue {
  activeId: string
  setActiveId: (id: string) => void
  registerTab: (id: string, el: HTMLButtonElement | null) => void
}

const TabsContext = createContext<TabsContextValue | null>(null)

function useTabsContext(): TabsContextValue {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error('Tabs compound components must be used inside <Tabs>')
  return ctx
}

export function Tabs({ tabs, defaultValue, className }: TabsProps) {
  const firstEnabled = tabs.find((t) => !t.disabled)
  const [activeId, setActiveId] = useState(defaultValue ?? firstEnabled?.id ?? '')
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map())
  const panelId = useId()

  const registerTab = useCallback(
    (id: string, el: HTMLButtonElement | null) => {
      if (el) tabRefs.current.set(id, el)
      else tabRefs.current.delete(id)
    },
    [],
  )

  const ctx = useMemo<TabsContextValue>(
    () => ({ activeId, setActiveId, registerTab }),
    [activeId, registerTab],
  )

  const activePanel = tabs.find((t) => t.id === activeId)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const enabled = tabs.filter((t) => !t.disabled)
      const idx = enabled.findIndex((t) => t.id === activeId)
      if (idx < 0) return
      let next = idx
      if (e.key === 'ArrowRight') next = (idx + 1) % enabled.length
      else if (e.key === 'ArrowLeft') next = (idx - 1 + enabled.length) % enabled.length
      else if (e.key === 'Home') next = 0
      else if (e.key === 'End') next = enabled.length - 1
      else return
      e.preventDefault()
      const nextTab = enabled[next]
      setActiveId(nextTab.id)
      tabRefs.current.get(nextTab.id)?.focus()
    },
    [activeId, tabs, setActiveId],
  )

  return (
    <TabsContext.Provider value={ctx}>
      <div className={cx(styles.tabs, className)}>
        <div
          role="tablist"
          className={styles.tabList}
          onKeyDown={handleKeyDown}
        >
          {tabs.map((tab) => (
            <TabItem key={tab.id} tab={tab} panelId={panelId} />
          ))}
        </div>
        <div
          role="tabpanel"
          className={styles.panel}
          id={`${panelId}-${activeId}`}
          aria-labelledby={`tab-${activeId}`}
          tabIndex={0}
        >
          {activePanel?.content}
        </div>
      </div>
    </TabsContext.Provider>
  )
}

function TabItem({
  tab,
  panelId,
}: {
  tab: TabItem
  panelId: string
}) {
  const { activeId, setActiveId, registerTab } = useTabsContext()
  const isActive = activeId === tab.id

  const setRef = useCallback(
    (el: HTMLButtonElement | null) => {
      registerTab(tab.id, el)
    },
    [tab.id, registerTab],
  )

  return (
    <button
      ref={setRef}
      id={`tab-${tab.id}`}
      role="tab"
      type="button"
      aria-selected={isActive}
      aria-controls={`${panelId}-${tab.id}`}
      tabIndex={isActive ? 0 : -1}
      disabled={tab.disabled}
      className={cx(styles.tab, isActive && styles.active)}
      onClick={() => setActiveId(tab.id)}
    >
      {tab.icon && <span className={styles.tabIcon}>{tab.icon}</span>}
      {tab.label}
    </button>
  )
}