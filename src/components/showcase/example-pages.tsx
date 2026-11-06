import {
  lazy,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { Bell, CalendarDays, LayoutDashboard, Users } from "lucide-react"
import { TextMorph } from "torph/react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { BottomNavigation } from "@/components/ui/bottom-navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChangeHighlight } from "@/components/ui/change-highlight"
import { ConfettiBurst } from "@/components/ui/confetti-burst"
import {
  EventsCalendar,
  type EventCalendarEvent,
} from "@/components/ui/events-calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MetricCard } from "@/components/ui/metric-card"
import { Progress } from "@/components/ui/progress"
import {
  SuccessCheck,
  type SuccessCheckState,
} from "@/components/ui/success-check"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/toast"
import "./example-pages.css"

const ActivityChart = lazy(() => import("./chart-specimen"))

type ExampleView = "overview" | "events" | "profile"

function addDays(date: Date, days: number) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate() + days,
    12
  )
}

function makeEvents(): EventCalendarEvent[] {
  const today = new Date()
  const daysInMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0
  ).getDate()
  const offset = Math.min(2, Math.max(0, daysInMonth - today.getDate()))

  return [
    {
      id: "planning",
      title: "Team planning",
      start: new Date(addDays(today, offset).setHours(10, 0, 0, 0)),
      end: new Date(addDays(today, offset).setHours(11, 0, 0, 0)),
      category: "Team",
      location: "Meeting room",
      tone: "accent",
    },
    {
      id: "check-in",
      title: "Member check-in",
      start: new Date(addDays(today, offset + 2).setHours(13, 30, 0, 0)),
      end: new Date(addDays(today, offset + 2).setHours(14, 0, 0, 0)),
      category: "People",
      tone: "positive",
    },
    {
      id: "review",
      title: "Project review",
      start: new Date(addDays(today, offset + 4).setHours(15, 0, 0, 0)),
      end: new Date(addDays(today, offset + 4).setHours(16, 0, 0, 0)),
      category: "Projects",
      tone: "warning",
    },
    {
      id: "workshop",
      title: "Workshop prep",
      start: new Date(addDays(today, offset + 6).setHours(9, 30, 0, 0)),
      end: new Date(addDays(today, offset + 6).setHours(10, 30, 0, 0)),
      category: "Team",
      tone: "neutral",
    },
  ]
}

const views: { id: ExampleView; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "events", label: "Events" },
  { id: "profile", label: "Profile" },
]

export function ExamplePagesPage({
  headingRef,
}: {
  headingRef: RefObject<HTMLHeadingElement | null>
}) {
  const events = useMemo(() => makeEvents(), [])
  const [view, setView] = useState<ExampleView>("overview")
  const reduceMotion = useReducedMotion() ?? false
  const [selectedDate, setSelectedDate] = useState<Date>(
    () => events[0]?.start ?? new Date()
  )
  const [name, setName] = useState("Maya Lee")
  const [email, setEmail] = useState("maya.lee@example.org")
  const [emailUpdates, setEmailUpdates] = useState(true)

  const saveProfile = () => toast.success("Profile saved")

  return (
    <div className="example-pages">
      <header className="example-pages__heading">
        <div>
          <h1 ref={headingRef} tabIndex={-1}>
            Examples
          </h1>
          <p>Complete screens, in context.</p>
        </div>
      </header>

      <section aria-label="Example workspace" className="example-pages__frame">
        <header className="example-pages__topbar">
          <div className="example-pages__workspace-name">
            <span>Studio workspace</span>
            <span aria-hidden="true">/</span>
            <span>{views.find((item) => item.id === view)?.label}</span>
          </div>
          <div className="example-pages__topbar-actions">
            <Button
              aria-label="Notifications"
              onClick={() => toast.info("You’re all caught up")}
              size="icon"
              variant="ghost"
            >
              <Bell aria-hidden="true" />
            </Button>
            <Avatar aria-label="Maya Lee" className="size-8">
              <AvatarFallback>ML</AvatarFallback>
            </Avatar>
          </div>
        </header>

        <p aria-atomic="true" aria-live="polite" className="sr-only">
          {views.find((item) => item.id === view)?.label} view
        </p>

        <div className="example-pages__body">
          <main className="example-pages__content">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="example-pages__screen"
                exit={reduceMotion ? undefined : { opacity: 0, y: -3 }}
                initial={reduceMotion ? false : { opacity: 0, y: 4 }}
                key={view}
                layout
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { duration: 0.18, ease: [0.22, 1, 0.36, 1] }
                }
              >
                {view === "overview" ? (
                  <OverviewScreen
                    events={events}
                    onOpenEvents={() => setView("events")}
                  />
                ) : view === "events" ? (
                  <EventsScreen
                    events={events}
                    selectedDate={selectedDate}
                    onDateChange={setSelectedDate}
                  />
                ) : (
                  <ProfileScreen
                    email={email}
                    emailUpdates={emailUpdates}
                    name={name}
                    onEmailChange={setEmail}
                    onEmailUpdatesChange={setEmailUpdates}
                    onNameChange={setName}
                    onSave={saveProfile}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </main>

          <nav
            aria-label="Workspace pages"
            className="example-pages__nav example-pages__nav--desktop"
          >
            {views.map(({ id, label }) => {
              const Icon =
                id === "overview"
                  ? LayoutDashboard
                  : id === "events"
                    ? CalendarDays
                    : Users
              return (
                <button
                  aria-current={view === id ? "page" : undefined}
                  className={
                    view === id
                      ? "example-pages__nav-item is-active"
                      : "example-pages__nav-item"
                  }
                  key={id}
                  onClick={() => setView(id)}
                  type="button"
                >
                  <Icon aria-hidden="true" size={16} />
                  <span>{label}</span>
                </button>
              )
            })}
          </nav>

          <BottomNavigation
            className="example-pages__mobile-nav"
            items={views.map(({ id, label }) => ({ value: id, label }))}
            label="Workspace pages"
            onValueChange={(nextView) => setView(nextView as ExampleView)}
            value={view}
          />
        </div>
      </section>
    </div>
  )
}

function OverviewScreen({
  events,
  onOpenEvents,
}: {
  events: EventCalendarEvent[]
  onOpenEvents: () => void
}) {
  const [completedMilestones, setCompletedMilestones] = useState(24)
  const [completionState, setCompletionState] =
    useState<Extract<SuccessCheckState, "loading" | "success">>("success")
  const [completionRevision, setCompletionRevision] = useState(0)
  const completionTimeoutRef = useRef<number | null>(null)
  const isPlanComplete = completedMilestones === 25
  const progressValue = Math.round((completedMilestones / 25) * 100)
  const completionCopy =
    completionState === "loading"
      ? {
          label: "Completing onboarding",
          title: "Saving final review",
          description: "Updating the project plan.",
        }
      : isPlanComplete
        ? {
            label: "Onboarding complete",
            title: "Onboarding complete",
            description: "All 25 milestones are done.",
          }
        : {
            label: "Progress saved",
            title: "Final review is ready",
            description: "Complete it to finish onboarding.",
          }

  useEffect(() => {
    return () => {
      if (completionTimeoutRef.current !== null) {
        window.clearTimeout(completionTimeoutRef.current)
      }
    }
  }, [])

  const completeFinalMilestone = () => {
    if (
      completionTimeoutRef.current !== null ||
      isPlanComplete ||
      completionState === "loading"
    ) {
      return
    }

    setCompletionState("loading")
    completionTimeoutRef.current = window.setTimeout(() => {
      completionTimeoutRef.current = null
      setCompletedMilestones(25)
      setCompletionState("success")
      setCompletionRevision((revision) => revision + 1)
    }, 520)
  }

  const todayLabel = new Intl.DateTimeFormat(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date())

  return (
    <div className="example-pages__overview">
      <div className="example-pages__screen-heading">
        <div>
          <h2>Team overview</h2>
          <p>{todayLabel}</p>
        </div>
        <Button onClick={onOpenEvents}>
          <CalendarDays aria-hidden="true" />
          View calendar
        </Button>
      </div>

      <div className="example-pages__overview-grid">
        <Card className="example-pages__project-card">
          <CardHeader className="example-pages__project-header">
            <div>
              <CardTitle>Member onboarding</CardTitle>
              <p>Quarterly plan</p>
            </div>
            <strong>{progressValue}%</strong>
          </CardHeader>
          <CardContent className="example-pages__project-content">
            <Progress
              aria-label="Member onboarding progress"
              value={progressValue}
            />
            <ChangeHighlight
              className="example-pages__project-summary"
              triggerKey={completionRevision}
            >
              <span>{completedMilestones} of 25 milestones</span>
              <span>{25 - completedMilestones} left</span>
            </ChangeHighlight>
            <div className="example-pages__milestones">
              <div>
                <span>Planning</span>
                <strong>Complete</strong>
              </div>
              <div>
                <span>Research</span>
                <strong>Complete</strong>
              </div>
              <div>
                <span>Final review</span>
                <strong>{isPlanComplete ? "Complete" : "Next"}</strong>
              </div>
            </div>
            <div className="example-pages__project-completion">
              <div className="relative grid size-10 shrink-0 place-items-center">
                <SuccessCheck
                  label={completionCopy.label}
                  size="md"
                  state={completionState}
                />
                <ConfettiBurst
                  particleCount={20}
                  triggerKey={completionRevision}
                />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-code-ink">
                  <TextMorph
                    as="span"
                    duration={220}
                    key={completionCopy.title}
                    respectReducedMotion
                  >
                    {completionCopy.title}
                  </TextMorph>
                </p>
                <p className="mt-0.5 text-[11px] leading-4 text-code-muted">
                  {completionCopy.description}
                </p>
              </div>
              <Button
                className="example-pages__complete-button"
                disabled={isPlanComplete || completionState === "loading"}
                onClick={completeFinalMilestone}
                size="sm"
                variant={isPlanComplete ? "secondary" : "outline"}
              >
                {isPlanComplete
                  ? "Plan complete"
                  : completionState === "loading"
                    ? "Saving…"
                    : "Complete final milestone"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <aside className="example-pages__overview-aside">
          <MetricCard
            change="+2"
            className="example-pages__members-card"
            comparison="this month"
            label="Team members"
            tone="positive"
            value="24"
            visual={<MemberAvatars />}
          />

          <section
            aria-labelledby="example-upcoming-title"
            className="example-pages__upcoming"
          >
            <div className="example-pages__section-heading">
              <h3 id="example-upcoming-title">Coming up</h3>
              <Button onClick={onOpenEvents} size="sm" variant="ghost">
                All events
              </Button>
            </div>
            <div className="example-pages__event-list">
              {events.slice(0, 3).map((event) => (
                <button
                  className="example-pages__event-row"
                  key={event.id}
                  onClick={onOpenEvents}
                  type="button"
                >
                  <time
                    className="example-pages__event-date"
                    dateTime={event.start.toISOString()}
                  >
                    {event.start.toLocaleDateString(undefined, {
                      day: "2-digit",
                      month: "short",
                    })}
                  </time>
                  <span className="example-pages__event-copy">
                    <strong>{event.title}</strong>
                    <span>
                      {event.start.toLocaleTimeString(undefined, {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </section>
        </aside>
      </div>

      <section aria-label="Team activity" className="example-pages__activity">
        <Suspense fallback={null}>
          <ActivityChart
            className="example-pages__activity-chart"
            title="Team activity"
          />
        </Suspense>
      </section>
    </div>
  )
}

function MemberAvatars() {
  return (
    <div aria-hidden="true" className="example-pages__member-avatars">
      <Avatar>
        <AvatarFallback>JL</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>AS</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>MC</AvatarFallback>
      </Avatar>
      <span>+21</span>
    </div>
  )
}

function EventsScreen({
  events,
  selectedDate,
  onDateChange,
}: {
  events: EventCalendarEvent[]
  selectedDate: Date
  onDateChange: (date: Date) => void
}) {
  return (
    <div className="example-pages__screen-content">
      <div className="example-pages__screen-heading">
        <div>
          <h2>Team calendar</h2>
          <p>Plan the week together</p>
        </div>
      </div>
      <EventsCalendar
        defaultMonth={selectedDate}
        events={events}
        onDateChange={onDateChange}
        selectedDate={selectedDate}
      />
    </div>
  )
}

function ProfileScreen({
  email,
  emailUpdates,
  name,
  onEmailChange,
  onEmailUpdatesChange,
  onNameChange,
  onSave,
}: {
  email: string
  emailUpdates: boolean
  name: string
  onEmailChange: (value: string) => void
  onEmailUpdatesChange: (value: boolean) => void
  onNameChange: (value: string) => void
  onSave: () => void
}) {
  return (
    <div className="example-pages__screen-content">
      <div className="example-pages__screen-heading">
        <div>
          <h2>Profile</h2>
          <p>Personal details</p>
        </div>
      </div>

      <Card className="example-pages__profile-card">
        <CardHeader className="example-pages__profile-header">
          <Avatar className="size-12">
            <AvatarFallback>ML</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{name || "Your profile"}</CardTitle>
            <p>{email}</p>
          </div>
        </CardHeader>
        <CardContent className="example-pages__profile-content">
          <div className="example-pages__profile-fields">
            <div>
              <Label htmlFor="example-profile-name">Full name</Label>
              <Input
                id="example-profile-name"
                onChange={(event) => onNameChange(event.target.value)}
                value={name}
              />
            </div>
            <div>
              <Label htmlFor="example-profile-email">Email address</Label>
              <Input
                id="example-profile-email"
                onChange={(event) => onEmailChange(event.target.value)}
                type="email"
                value={email}
              />
            </div>
          </div>
          <div className="example-pages__profile-setting">
            <div>
              <Label htmlFor="example-profile-updates">Email updates</Label>
              <p>Get updates about your workspace</p>
            </div>
            <Switch
              checked={emailUpdates}
              id="example-profile-updates"
              onCheckedChange={onEmailUpdatesChange}
            />
          </div>
          <div className="example-pages__profile-actions">
            <Button onClick={onSave}>Save changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
