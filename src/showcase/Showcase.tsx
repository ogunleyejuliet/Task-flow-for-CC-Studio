import { useState, type ReactNode } from 'react'
import {
  Avatar,
  Badge,
  Breadcrumbs,
  Button,
  Card,
  Checkbox,
  Drawer,
  EmptyState,
  ErrorState,
  Input,
  Modal,
  ProjectProgress,
  Select,
  Skeleton,
  StatusBadge,
  PriorityBadge,
  Sidebar,
  Tabs,
  TaskCard,
  TaskList,
  TeamMember,
  Tooltip,
  Topbar,
  TaskflowLogo,
  useToast,
  type ModalSize,
} from '../index'
import type { TaskData, TaskPriority, TaskStatus } from '../index'
import styles from './Showcase.module.css'

/* ------------------------------------------------------------------------- */
/* Sample data                                                               */
/* ------------------------------------------------------------------------- */

const tasks: TaskData[] = [
  {
    id: 't1',
    name: 'Design mobile onboarding',
    project: 'Catalyst Website',
    assignee: { name: 'Leye Juliet', avatarUrl: null },
    status: 'in-progress',
    priority: 'high',
    dueDate: '2026-09-14',
  },
  {
    id: 't2',
    name: 'Website homepage hero',
    project: 'Catalyst Website',
    assignee: { name: 'Ada Obi', avatarUrl: null },
    status: 'to-do',
    priority: 'medium',
    dueDate: '2026-09-16',
  },
  {
    id: 't3',
    name: 'Brand asset export kit',
    project: 'Brand Refresh',
    assignee: { name: 'Leye Juliet', avatarUrl: null },
    status: 'completed',
    priority: 'low',
    dueDate: '2026-09-10',
  },
  {
    id: 't4',
    name: 'Approve invoice #2041',
    project: 'Operations',
    status: 'blocked',
    priority: 'urgent',
    dueDate: '2026-09-09',
  },
]

/* ------------------------------------------------------------------------- */
/* Small demo helpers                                                        */
/* ------------------------------------------------------------------------- */

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <Card padded>{children}</Card>
    </section>
  )
}

function Row({ children }: { children: ReactNode }) {
  return <div className={styles.row}>{children}</div>
}

function Stack({ children }: { children: ReactNode }) {
  return <div className={styles.stack}>{children}</div>
}

function ColorSwatch({ name, value }: { name: string; value: string }) {
  return (
    <div className={styles.swatch}>
      <span className={styles.swatchColor} style={{ backgroundColor: value }} />
      <span className={styles.swatchName}>{name}</span>
      <span className={styles.swatchValue}>{value}</span>
    </div>
  )
}

const statuses: TaskStatus[] = ['to-do', 'in-progress', 'completed', 'blocked']
const priorities: TaskPriority[] = ['low', 'medium', 'high', 'urgent']

/* ------------------------------------------------------------------------- */
/* Interactive demos                                                         */
/* ------------------------------------------------------------------------- */

function ModalDemo() {
  const toast = useToast()
  const [open, setOpen] = useState(false)
  const [size, setSize] = useState<ModalSize>('md')
  const [form, setForm] = useState({ title: '', assignee: 'self', priority: 'medium' })

  return (
    <>
      <Row>
        {(['sm', 'md', 'lg'] as const).map((s) => (
          <Button
            key={s}
            variant="secondary"
            onClick={() => {
              setSize(s)
              setOpen(true)
            }}
          >
            Open {s} modal
          </Button>
        ))}
      </Row>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Create task"
        description="Give your task a name and pick who owns it."
        size={size}
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setOpen(false)
                toast.success('Task created', `“${form.title || 'Untitled'}” was added to your tasks.`)
              }}
            >
              Create task
            </Button>
          </>
        }
      >
        <Stack>
          <Input
            label="Task name"
            placeholder="e.g. Design mobile onboarding"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <Row>
            <div style={{ flex: 1, minWidth: 0 }}>
              <Select
                label="Assignee"
                value={form.assignee}
                onChange={(e) => setForm({ ...form, assignee: e.target.value })}
              >
                <option value="self">Assign to me</option>
                <option value="leye">Leye Juliet</option>
                <option value="ada">Ada Obi</option>
              </Select>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <Select
                label="Priority"
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </Select>
            </div>
          </Row>
          <Checkbox label="Notify the assignee" />
        </Stack>
      </Modal>
    </>
  )
}

function DrawerDemo() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Open task details
      </Button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title="Design mobile onboarding"
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>Save changes</Button>
          </>
        }
      >
        <Stack>
          <Input label="Due date" defaultValue="2026-09-14" type="date" />
          <Select label="Status" defaultValue="in-progress">
            <option value="to-do">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="blocked">Blocked</option>
          </Select>
          <Row>
            <StatusBadge status="in-progress" />
            <PriorityBadge priority="high" />
          </Row>
        </Stack>
      </Drawer>
    </>
  )
}

function ToastDemo() {
  const toast = useToast()
  return (
    <Row>
      <Button
        variant="secondary"
        onClick={() => toast.success('Task created', 'Your task has been added successfully.')}
      >
        Success
      </Button>
      <Button
        variant="secondary"
        onClick={() => toast.error("Couldn't create task", 'Something went wrong. Try again.')}
      >
        Error
      </Button>
      <Button
        variant="secondary"
        onClick={() => toast.warning('Deadline approaching', 'This task is due tomorrow.')}
      >
        Warning
      </Button>
      <Button
        variant="secondary"
        onClick={() => toast.info('Sync complete', 'Your calendar is up to date.')}
      >
        Info
      </Button>
    </Row>
  )
}

/* ------------------------------------------------------------------------- */
/* Main showcase                                                             */
/* ------------------------------------------------------------------------- */

const navSections = [
  {
    label: undefined,
    items: [{ id: 'dashboard', label: 'Dashboard', icon: 'dashboard' as const }],
  },
  {
    label: 'Work',
    items: [
      { id: 'my-tasks', label: 'My Tasks', icon: 'tasks' as const },
      { id: 'projects', label: 'Projects', icon: 'projects' as const },
      { id: 'calendar', label: 'Calendar', icon: 'calendar' as const },
    ],
  },
  {
    label: 'Team',
    items: [{ id: 'members', label: 'Members', icon: 'members' as const }],
  },
  {
    label: undefined,
    items: [
      { id: 'settings', label: 'Settings', icon: 'settings' as const },
      { id: 'help', label: 'Help', icon: 'help' as const },
    ],
  },
]

export function Showcase() {
  const [activeNav, setActiveNav] = useState('my-tasks')
  const [navOpen, setNavOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<'loading' | 'empty' | 'error' | 'list'>('list')

  return (
    <div className={styles.shell}>
      <Sidebar
        sections={navSections}
        activeId={activeNav}
        onNavigate={setActiveNav}
        logo={
          <a href="#" onClick={(e) => e.preventDefault()} aria-label="TaskFlow home">
            <TaskflowLogo width={148} />
          </a>
        }
        user={{ name: 'Aisha Bello', role: 'Design Lead', avatarUrl: null }}
        open={navOpen}
        onClose={() => setNavOpen(false)}
      />

      <div className={styles.mainCol}>
        <Topbar
          onMenuClick={() => setNavOpen(true)}
          brand={<TaskflowLogo width={120} />}
          user={{ name: 'Aisha Bello', avatarUrl: null }}
        />

        <main className={styles.content}>
          <Breadcrumbs
            items={[
              { label: 'TaskFlow', href: '#' },
              { label: 'Work' },
              { label: 'My Tasks' },
            ]}
          />

          <div className={styles.pageHeader}>
            <div>
              <h1 className={styles.pageTitle}>Design system showcase</h1>
              <p className={styles.pageSubtitle}>
                Reusable components built from the TaskFlow design tokens.
              </p>
            </div>
            <div className={styles.pageActions}>
              <ToastDemo />
            </div>
          </div>

          {/* Tokens — color */}
          <Section title="Color palette">
            <Row>
              <Stack>
                <span className={styles.groupLabel}>Brand</span>
                <Row>
                  <ColorSwatch name="TaskFlow Blue 100" value="#9EC8F8" />
                  <ColorSwatch name="TaskFlow Blue 200" value="#6DA8F0" />
                  <ColorSwatch name="TaskFlow Blue 700" value="#2F6DB5" />
                  <ColorSwatch name="TaskFlow Powder" value="#CFE8FF" />
                </Row>
              </Stack>
              <Stack>
                <span className={styles.groupLabel}>Neutral</span>
                <Row>
                  <ColorSwatch name="Page BG" value="#F8FAFC" />
                  <ColorSwatch name="Border" value="#E5E7EB" />
                  <ColorSwatch name="Border strong" value="#D1D5DB" />
                  <ColorSwatch name="Primary text" value="#111827" />
                  <ColorSwatch name="Secondary" value="#4B5563" />
                  <ColorSwatch name="Muted" value="#6B7280" />
                </Row>
              </Stack>
              <Stack>
                <span className={styles.groupLabel}>Semantic</span>
                <Row>
                  <ColorSwatch name="Success" value="#16A34A" />
                  <ColorSwatch name="Warning" value="#D97706" />
                  <ColorSwatch name="Error" value="#DC2626" />
                  <ColorSwatch name="Info" value="#2563EB" />
                </Row>
              </Stack>
            </Row>
          </Section>

          {/* Typography */}
          <Section title="Typography">
            <Stack>
              <p className={styles.typography} data-style="display">
                Display · 32 / 700
              </p>
              <p className={styles.typography} data-style="pageHeading">
                Page heading · 24 / 700
              </p>
              <p className={styles.typography} data-style="sectionHeading">
                Section heading · 18 / 600
              </p>
              <p className={styles.typography} data-style="body">
                Body · The quick brown fox jumps over the lazy dog.
              </p>
              <p className={styles.typography} data-style="bodySmall">
                Body small · The quick brown fox jumps over the lazy dog.
              </p>
              <p className={styles.typography} data-style="caption">
                Caption · The quick brown fox jumps over the lazy dog.
              </p>
            </Stack>
          </Section>

          {/* Buttons */}
          <Section title="Buttons">
            <Stack>
              <span className={styles.groupLabel}>Variants · default / hover / pressed / disabled / loading</span>
              <Row>
                <Button variant="primary" leadingIcon="plus">
                  Create task
                </Button>
                <Button variant="secondary">Cancel</Button>
                <Button variant="tertiary" trailingIcon="arrow-right">
                  View all
                </Button>
                <Button variant="destructive" leadingIcon="trash">
                  Delete
                </Button>
              </Row>
              <Row>
                <Button variant="primary" disabled>
                  Disabled
                </Button>
                <Button variant="secondary" disabled>
                  Disabled
                </Button>
                <Button variant="tertiary" disabled>
                  Disabled
                </Button>
                <Button variant="primary" loading>
                  Saving…
                </Button>
              </Row>
              <Row>
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
                <Button iconOnly leadingIcon="search" aria-label="Search" />
                <Button iconOnly variant="secondary" leadingIcon="bell" aria-label="Notifications" />
                <Button fullWidth>Full width</Button>
              </Row>
            </Stack>
          </Section>

          {/* Form controls */}
          <Section title="Form controls">
            <Stack>
              <Row>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Input
                    label="Task name"
                    placeholder="e.g. Refresh brand guidelines"
                    helperText="Keep it short and specific."
                    required
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Input
                    label="Email"
                    placeholder="you@catalyst.studio"
                    leadingIcon="search"
                    error="Enter a valid email address."
                    type="email"
                  />
                </div>
              </Row>
              <Row>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Input
                    label="Search with loading"
                    leadingIcon="search"
                    loading
                    aria-label="Search"
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Input label="Disabled" disabled defaultValue="Locked field" />
                </div>
              </Row>
              <Row>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Select label="Assignee" defaultValue="leye">
                    <option value="leye">Leye Juliet</option>
                    <option value="ada">Ada Obi</option>
                    <option value="chidi">Chidi Okeke</option>
                  </Select>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Select label="Project" defaultValue="" error="Please choose a project.">
                    <option value="">Select a project</option>
                    <option value="website">Catalyst Website</option>
                    <option value="brand">Brand Refresh</option>
                  </Select>
                </div>
              </Row>
              <Row>
                <Checkbox label="Assign to me" defaultChecked />
                <Checkbox label="Urgent" />
                <Checkbox label="Notify team" indeterminate defaultChecked />
                <Checkbox label="Disabled" disabled />
                <Checkbox label="Invalid choice" error="Please confirm to continue." />
              </Row>
            </Stack>
          </Section>

          {/* Badges */}
          <Section title="Badges">
            <Row>
              <Badge variant="neutral">Neutral</Badge>
              <Badge variant="brand">Brand</Badge>
              <Badge variant="success" dot>Success</Badge>
              <Badge variant="warning" dot>Warning</Badge>
              <Badge variant="error" dot>Error</Badge>
              <Badge variant="info" dot>Info</Badge>
            </Row>
          </Section>

          {/* Avatars */}
          <Section title="Avatars">
            <Row>
              <Stack>
                <span className={styles.groupLabel}>With initials fallback</span>
                <Row>
                  <Avatar name="Leye Juliet" size="xs" />
                  <Avatar name="Ada Obi" size="sm" />
                  <Avatar name="Chidi Okeke" size="md" />
                  <Avatar name="Ngozi Nwosu" size="lg" />
                </Row>
              </Stack>
              <Stack>
                <span className={styles.groupLabel}>Presence</span>
                <Row>
                  <Avatar name="Leye Juliet" status="online" />
                  <Avatar name="Ada Obi" status="away" />
                  <Avatar name="Chidi Okeke" status="busy" />
                  <Avatar name="Ngozi Nwosu" status="offline" />
                </Row>
              </Stack>
            </Row>
          </Section>

          {/* Cards + Tabs */}
          <Section title="Cards & tabs">
            <Row>
              <div style={{ flex: 1, minWidth: 0 }}>
                <Card padded>Default card</Card>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <Card padded variant="powder">Powder surface</Card>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <Card padded variant="elevated">Elevated</Card>
              </div>
            </Row>
            <Tabs
              tabs={[
                {
                  id: 'overview',
                  label: 'Overview',
                  content: (
                    <p className={styles.panelText}>
                      The overview shows everything happening across your work right
                      now.
                    </p>
                  ),
                },
                {
                  id: 'activity',
                  label: 'Activity',
                  content: (
                    <p className={styles.panelText}>
                      Recent changes to your tasks, comments and status updates live
                      here.
                    </p>
                  ),
                },
                {
                  id: 'disabled',
                  label: 'Disabled',
                  disabled: true,
                  content: <p>Nothing to see.</p>,
                },
              ]}
            />
          </Section>

          {/* Status + priority */}
          <Section title="Task status & priority">
            <Stack>
              <span className={styles.groupLabel}>Status</span>
              <Row>
                {statuses.map((s) => (
                  <StatusBadge key={s} status={s} />
                ))}
              </Row>
              <span className={styles.groupLabel}>Priority</span>
              <Row>
                {priorities.map((p) => (
                  <PriorityBadge key={p} priority={p} />
                ))}
              </Row>
            </Stack>
          </Section>

          {/* Task card + list */}
          <Section title="Task card & list">
            <div className={styles.taskColumns}>
              <Stack>
                <span className={styles.groupLabel}>Card</span>
                <TaskCard task={tasks[0]} />
                <TaskCard task={{ ...tasks[3], assignee: undefined }} />
              </Stack>
              <Stack>
                <span className={styles.groupLabel}>List</span>
                <TaskList
                  tasks={tasks}
                  loading={selectedStatus === 'loading'}
                  onTaskClick={(task) => console.log('Task selected', task)}
                />
              </Stack>
            </div>
            <Row>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedStatus('loading')}
              >
                Show loading skeletons
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedStatus('empty')}
              >
                Show empty state
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedStatus('list')}
              >
                Show list
              </Button>
            </Row>
          </Section>

          {/* Progress */}
          <Section title="Project progress">
            <Stack>
              <ProjectProgress value={72} label="Catalyst Website" />
              <ProjectProgress value={40} label="Brand Refresh" tone="success" showLabel />
              <ProjectProgress value={92} label="Operations" tone="warning" showLabel />
            </Stack>
          </Section>

          {/* Team */}
          <Section title="Team member">
            <Row>
              <Card padded>
                <TeamMember
                  name="Leye Juliet"
                  role="Product Designer"
                  status="online"
                />
              </Card>
              <Card padded>
                <TeamMember
                  name="Chidi Okeke"
                  role="Developer"
                  status="away"
                />
              </Card>
            </Row>
          </Section>

          {/* States */}
          <Section title="Empty, error & loading states">
            <Row>
              <Card padded style={{ flex: 1, minWidth: 0 }}>
                <EmptyState
                  title="No tasks yet"
                  description="Your tasks will appear here once they're assigned."
                  action={<Button size="sm" leadingIcon="plus">Create task</Button>}
                />
              </Card>
              <Card padded style={{ flex: 1, minWidth: 0 }}>
                <ErrorState
                  title="Something went wrong"
                  message="We couldn't load your tasks."
                  onRetry={() => console.log('retry')}
                />
              </Card>
            </Row>
            <Row>
              <div style={{ flex: 1, minWidth: 0 }}>
                <Skeleton width="100%" height={48} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <Skeleton width="100%" height={48} />
              </div>
              <Avatar name="Ngozi Nwosu" size="lg" status="online" /> 
            </Row>
          </Section>

          {/* Overlays */}
          <Section title="Overlays">
            <Row>
              <ModalDemo />
            </Row>
            <Row>
              <DrawerDemo />
            </Row>
            <Row>
              <Tooltip content="Create a new task" position="top">
                <Button leadingIcon="plus">Hover me</Button>
              </Tooltip>
            </Row>
          </Section>

          <footer className={styles.footer}>
            TaskFlow design system · Catalyst Creative Studio
          </footer>
        </main>
      </div>
    </div>
  )
}
