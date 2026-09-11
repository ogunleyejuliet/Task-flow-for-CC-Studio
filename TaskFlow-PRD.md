# TaskFlow — Product Requirements Document

**Status:** Version 1 (MVP) — Implementation-Ready Draft
**Client:** Catalyst Creative Studio

---

## 1. Product Summary

**Product name:** TaskFlow

**One-sentence description:** TaskFlow helps a small creative agency team see exactly what they and their teammates need to do, are doing, and have finished, by replacing scattered WhatsApp messages and spreadsheets with one shared task list.

**Product purpose:** Give Catalyst Creative Studio's team a single, reliable place to create, assign, track, and complete work, so tasks stop getting lost in chat threads and deadlines stop passing silently.

**Target market:** CONFIRMED — a single internal team (Catalyst Creative Studio). This is not a multi-tenant or public SaaS product; it is built for one agency's use.

**Primary users:** CONFIRMED — Amaka (project manager) as primary user; designers, developers, and content creators as secondary users; Manager-flagged staff as administrators of staff accounts and clients.

**Core value proposition:** CONFIRMED — one shared, structured task list replaces WhatsApp/spreadsheets/notebooks as the single source of truth for "what needs to be done, who's doing it, and what's overdue," with zero manual effort to see status (no scrolling chat history, no stale spreadsheets).

**How it works at a high level:** CONFIRMED — Any staff member logs in with an email and password (self-managed, including a self-service "forgot password" reset), creates tasks and assigns them to anyone on the team (optionally tagging a client), and everyone sees a personal dashboard split into Today, In Progress, Completed, and Overdue. Task visibility is shared across the whole team; editing and deleting a task is restricted to its creator, its assignee, or a Manager-flagged user. Managers separately manage the staff list and the client list.

---

## 2. Problem

**The problem:** CONFIRMED — Tasks arrive through WhatsApp voice notes, client emails, and meetings. They get buried, forgotten, or left with unclear ownership. Deadlines pass silently because no one is tracking them in a structured way, and managers have no reliable way to know task status without manually asking each person.

**Who experiences it:** CONFIRMED — Amaka, the project manager, most acutely (she is accountable to clients for status she often doesn't actually have). Designers, developers, and content creators experience it as ambiguity about what they're supposed to be doing and by when.

**How they solve it today:** CONFIRMED — WhatsApp messages and voice notes, a shared spreadsheet, and paper notebooks, combined with recalling verbal commitments made in meetings.

**Why existing solutions are insufficient:** CONFIRMED — WhatsApp has no structured status field and buries messages under unrelated chat. Spreadsheets don't compute "overdue" automatically and require someone to remember to open and update them. Notebooks are private to whoever holds them and aren't visible to the rest of the team.

**What happens if it remains unsolved:** CONFIRMED — this happens roughly weekly: a client asks for changes in a meeting, the request gets logged informally, someone doesn't see it, the deadline passes, the client follows up annoyed, and Amaka has no record to explain what happened or reassure the client — damaging both client trust and her credibility.

---

## 3. Goals

**Primary product goal:** CONFIRMED — give every team member a single place to see what they need to do, are doing, and have completed, and give managers visibility into the whole team's work without having to ask.

**User goals:**
- CONFIRMED — Amaka: know, at a glance, what's overdue and what's due today across the whole team, and log new tasks immediately after a client call before she forgets them.
- CONFIRMED — Staff: know exactly what's assigned to them, and mark things done without having to report status verbally.

**Business goals:**
- CONFIRMED — Reduce missed deadlines and the resulting client-trust damage.
- CONFIRMED — Replace WhatsApp/spreadsheets/notebooks as the team's task-tracking method entirely (the team has confirmed willingness to abandon WhatsApp for this purpose).

**Version-one goals:**
- CONFIRMED — Ship the five core features and required admin functionality listed in Section 5, nothing more.

**What the product is explicitly NOT trying to achieve:**
- CONFIRMED — It is not a team chat replacement, not a file-sharing tool, not a client-facing portal, not an AI-powered planning tool, and not a billing or payments system. It is not trying to support multiple agencies/organizations (it is single-tenant).

---

## 4. Users and Personas

### Primary User: Project Manager (e.g. Amaka)
- **Role:** CONFIRMED — Manager-flagged user; typically holds the descriptive Role "Project Manager," though the Role label itself grants no permissions.
- **Context:** CONFIRMED — Manages 4–6 active client projects concurrently, coordinating a small cross-functional team (designers, a developer, a content creator).
- **Goals:** CONFIRMED — See what's overdue and due today; log tasks quickly right after client calls; monitor team progress without chasing people for updates.
- **Main problems:** CONFIRMED — Loses track of task status by midweek; has no record to give clients when asked for an update; deadlines pass without anyone flagging them.
- **Behavior:** CONFIRMED — Opens the tool every morning, right after client meetings, and a few times a day for progress checks.
- **Needs:** CONFIRMED — A fast way to create and assign tasks (optionally tied to a client), and a dashboard that shows the whole team's status, not just her own tasks.
- **Important constraints:** CONFIRMED — Also carries Manager-only responsibilities: adding staff accounts, creating clients, and being able to edit/delete any task regardless of who created or was assigned it.

### Secondary User: Staff (designer, developer, content creator)
- **Role:** CONFIRMED — Staff-flagged (non-manager) user; descriptive Role varies (Designer, Developer, Content Creator).
- **Context:** CONFIRMED — Receives tasks from Amaka or from teammates; may also create and assign tasks to others.
- **Goals:** CONFIRMED — See what's assigned to them; mark tasks done; occasionally raise/assign a task to a teammate.
- **Main problems:** CONFIRMED — Previously, requests arrived informally and were easy to miss or forget.
- **Behavior:** CONFIRMED — Opens the app once in the morning to check assignments, and again when finishing something to mark it complete.
- **Needs:** CONFIRMED — A clear, low-friction way to see "my tasks" without having to filter through everyone else's.
- **Important constraints:** CONFIRMED — Can create/assign any task to anyone, but can only edit or delete tasks they created or are assigned to (not other people's tasks, unless Manager-flagged). Activates their account via a manager-issued invite link and sets their own initial password (FR-7b); can change it afterward at any time via a self-service "forgot password" flow (FR-8), without manager involvement.

### Admin User: Manager (staff and client administration)
- **Role:** CONFIRMED — Any user with the Manager/Staff flag set to Manager. This may be the same individual as the Primary User persona above, but the responsibilities are distinct from day-to-day task use.
- **Context:** CONFIRMED — Responsible for onboarding new staff and maintaining the client list.
- **Goals:** CONFIRMED — Add a new staff member's details and get them a working login; keep the client list clean (no duplicates).
- **Main problems:** CONFIRMED — Without gating, client and staff data could become duplicated or inconsistent (e.g. "Acme" vs "Acme Inc").
- **Behavior:** CONFIRMED — Uses the Add Staff screen and Client management screen occasionally (not daily) — mainly during onboarding or when a new client engagement begins.
- **Needs:** CONFIRMED — A simple form to add a staff member (name, email, department, role, Manager/Staff flag) that sends an invite email via Supabase Auth; the staff member activates their own account and sets their own initial password from there. Any later password change is handled entirely by the staff member via a self-service "forgot password" flow (FR-8) — managers have no reset responsibility.
- **Important constraints:** CONFIRMED — No longer relays or handles staff passwords in any way post-activation; password recovery is fully self-service (see Section 12 for the security implications of this design vs. the earlier manager-relay concept).

There are no additional personas (e.g. client-facing users) — CONFIRMED clients have no login or portal in v1.

---

## 5. Scope

### Version One

CONFIRMED — exactly the following, no more:

1. Create and assign a task (any staff member, to any assignee, optionally tagged to a client)
2. Personal dashboard (Today / In Progress / Completed / Overdue, filtered per user; managers see all)
3. Update task status (mark in progress / complete)
4. Edit and delete a task (creator, assignee, or manager only)
5. Filter and search the task list (by status, by client, by text; usable at 100+ tasks)

Plus required admin/staff functionality:
- Login (email + password, no open public signup, no landing page)
- Add Staff screen (manager only): name, email, department, role, Manager/Staff flag; creates a Pending account and sends an invite email via Supabase Auth
- Resend Invite (manager only): available for Pending accounts only; invalidates the previous invite link; shows a confirmation on success
- Staff account activation (staff-initiated, invite-link only): the staff member sets their own initial password to activate the Pending account, moving it to Active — scoped exception, not open self-registration
- Disable / reactivate staff account (manager only): blocks or restores login for an account
- Forgot password (staff self-service): a staff member on an Active account can request a password-reset email themselves and set a new password, with no manager involvement (FR-8)
- Client management (create/view clients: name + optional color tag; manager only)

### Out of Scope

CONFIRMED — explicitly cut from version one, not to be built:
- Notifications (email/push) — planned for v1.1
- Recurring tasks
- Task comments / collaboration
- File attachments
- A separate Project/grouping entity (the lighter Client tag was deliberately chosen instead)
- Public landing page / marketing page
- Self-service account creation from scratch — staff can never create an account with no manager involvement at all: an account must first exist as Pending, created by a manager (FR-7), before a staff member can activate it (FR-7b) or later reset its password (FR-8). Staff can never set their own department, role, or Manager/Staff flag through either flow.
- Payments, subscriptions, or billing of any kind
- AI features of any kind
- Vector search / embeddings / RAG of any kind

### Future Considerations

**RECOMMENDATION:** Email notifications on task assignment, once usage data shows tasks are still being missed despite being in the app (already flagged in the source idea as a v1.1 candidate).

**RECOMMENDATION:** A manager-facing "workload view" showing task counts per staff member, if managers frequently need to know who is over- or under-loaded — this is a natural extension of the existing dashboard/filter data and would need no new core entities.

**RECOMMENDATION:** A per-client summary/reporting view (e.g. all open tasks for Client X with counts by status), if the client filter proves to be heavily used — this uses data already captured in v1 and doesn't require new data collection to justify building.

---

## 6. Functional Requirements

**Default application state (explicit):** On initial access, an unauthenticated user is shown the login screen. There is no public signup and no public landing page. A newly created staff account appears with status **Pending** until the invited staff member completes activation (FR-7b); it becomes **Active** at that point, and cannot log in before then.

**Account states (explicit):**
- **Pending** — a manager has created the account and an invite has been sent, but the staff member has not yet completed activation. Login is blocked.
- **Active** — the staff member has completed invite activation and set their own password. Login works normally.
- **Disabled** — a manager has deactivated the account (FR-10). Login is blocked regardless of prior state, until a manager reactivates it.

**Password reset policy (explicit):** There are two ways a password is ever set, and both are staff-initiated, not manager-triggered: (1) the staff member setting their own initial password via a manager-issued invite link (FR-7b, first activation only), and (2) the staff member requesting a "forgot password" reset themselves on an Active account at any later point (FR-8). Managers have no ability to trigger, view, or relay a staff member's password at any stage.

### FR-1: Create and assign a task
- **Requirement:** Any authenticated user can create a task and assign it to any user on the team.
- **User:** Any staff member (Manager or Staff flag).
- **Trigger:** User selects "Create Task" from the dashboard or task list.
- **User action:** Fills in title (required), description (optional), assignee (required, any team member), due date (required), priority (required, one of Low/Medium/High), client (optional, from existing client list).
- **System behavior:** Validates required fields; on submit, creates a Task record with status defaulted to "To Do," creator set to the current user, and timestamps the creation date; the task becomes immediately visible to all users and appears on the assignee's dashboard.
- **Expected result:** The new task appears in the shared task list and on the assignee's "Today" or "Upcoming" column depending on due date.
- **Data involved:** Task (title, description, assignee, due date, priority, client, creator, status, createdAt), User list, Client list.
- **Rules or restrictions:** Creation is open to ANY authenticated user — Manager or Staff — with no restriction on who they can assign to (not limited to self-assignment). This is a deliberate, confirmed decision, distinct from edit/delete permissions below.
- **Error or failure state:** If a required field is missing, block submission and show inline validation messages per field (do not silently drop the task). If the save request fails (network/server error), show an explicit error message and do not show a false "saved" confirmation; the form's entered data should remain populated so the user doesn't have to retype it.

### FR-2: Personal dashboard
- **Requirement:** On login, the user sees a dashboard split into four columns: Today, In Progress, Completed, Overdue.
- **User:** Any authenticated user.
- **Trigger:** User logs in or navigates to the dashboard.
- **User action:** None required — view is automatic; user may click into a task from any column.
- **System behavior:** Queries tasks where assignee = current user (Staff) or all tasks (Manager, with a toggle or default to "all"), computes "Overdue" as any task with status not Completed and due date before the current date, computes "Today" as due date equal to the current date, "In Progress" as tasks with that explicit status, "Completed" as tasks marked done.
- **Expected result:** Each task appears in exactly one column based on the rules above (a task cannot be simultaneously Overdue and Today — overdue takes precedence once the due date has passed and the task isn't complete).
- **Data involved:** Task (status, due date, assignee), current date, current user's Manager/Staff flag.
- **Rules or restrictions:** CONFIRMED — Staff always see only their own tasks. Managers can toggle between "my tasks" and "all tasks" views; they are not locked into a single default. The toggle state does not need to persist across sessions unless specified later — default to "all tasks" on login for Manager-flagged users. **ASSUMPTION:** defaulting Managers to "all tasks" on login is reasonable since full-team visibility is the primary reason a manager account exists, but this can be revisited if the team prefers a different default.
- **Error or failure state:** If the task query fails, show an explicit error state (not an empty dashboard that could be mistaken for "no tasks"). If there are zero tasks in a column, show an empty state with a relevant call to action (e.g. "No tasks due today").

### FR-3: Update task status
- **Requirement:** A permitted user can change a task's status, including marking it complete.
- **User:** The task's creator, its assignee, or any Manager-flagged user.
- **Trigger:** User opens a task or uses a quick-action control on the task list/dashboard.
- **User action:** Selects a new status (To Do / In Progress / Completed) or clicks a "Mark Complete" quick action.
- **System behavior:** Updates the task's status field and an "updatedAt" timestamp; if marked Completed, also records a "completedAt" timestamp; the task moves to the corresponding dashboard column immediately.
- **Expected result:** The task reflects its new status for all users viewing the shared list.
- **Data involved:** Task (status, updatedAt, completedAt).
- **Rules or restrictions:** Same permission set as FR-4 (creator, assignee, or manager) — CONFIRMED, since changing status is a form of editing the task.
- **Error or failure state:** If the update request fails, revert any optimistic UI change and show an explicit error message; do not leave the UI showing a status that wasn't actually saved.

### FR-4: Edit and delete a task
- **Requirement:** A permitted user can edit any field on a task or delete it entirely.
- **User:** The task's creator, its assignee, or any Manager-flagged user.
- **Trigger:** User opens a task's detail view and selects Edit or Delete.
- **User action:** Edit: modifies one or more fields and saves. Delete: confirms deletion via a confirmation dialog.
- **System behavior:** Edit: validates and persists changed fields, updates "updatedAt." Delete: permanently removes the task record after confirmation.
- **Expected result:** Edited tasks reflect new values immediately for all users; deleted tasks disappear from all views immediately.
- **Data involved:** Task (all fields).
- **Rules or restrictions:** CONFIRMED — restricted to creator, assignee, or Manager-flagged user. A user attempting to edit/delete a task they don't have rights to must be blocked at both the UI level (control not shown or disabled) and the API/server level (request rejected even if attempted directly).
- **Error or failure state:** Unauthorized attempt: reject with a clear permission-denied message, do not silently fail. Delete without confirmation: not permitted — the confirmation step is mandatory. Failed delete (network/server error): show an explicit error, keep the task visible (do not remove it from the UI until the server confirms deletion).

### FR-5: Filter and search the task list
- **Requirement:** The user can narrow the task list by status, by client, and by free-text search on task title.
- **User:** Any authenticated user.
- **Trigger:** User selects a filter option or types in a search field on the task list view.
- **User action:** Selects one or more filters (status: All/To Do/In Progress/Completed/Overdue; client: any existing client or "No client") and/or types a search term.
- **System behavior:** Applies filters and search term together (AND logic) against the currently visible task set (respecting the Staff/Manager visibility scope from FR-2) and returns matching results.
- **Expected result:** The task list updates to show only matching tasks; the interface remains responsive and usable with 100+ tasks (CONFIRMED requirement from source idea).
- **Data involved:** Task (status, client, title), Client list.
- **Rules or restrictions:** Filtering does not change what a user is allowed to see (Staff still cannot see filtered results outside their normal visibility scope — though note visibility is shared team-wide per the Sharing Model, so this mainly matters for the "my tasks vs all tasks" toggle, not for hidden data).
- **Error or failure state:** If a filter combination returns zero results, show an empty state indicating no matches (distinct from the "no tasks exist at all" empty state) rather than a blank screen.

### FR-6: Login
- **Requirement:** A user with valid credentials on an Active account can access the app; there is no open public account creation.
- **User:** Any staff member with a manager-added account.
- **Trigger:** User navigates to the app URL.
- **User action:** Enters email and password.
- **System behavior:** Validates credentials via Supabase Auth; checks the account's status; on success (valid credentials AND status = Active), establishes an authenticated session; on invalid credentials, does not indicate whether the email or the password was wrong (to avoid leaking which emails are valid accounts).
- **Expected result:** Successful login redirects to the dashboard (FR-2).
- **Data involved:** Supabase Auth (credential validation); User (status).
- **Rules or restrictions:** No open public signup screen exists. No landing page exists — the app's root URL is the login screen. Only Active accounts may log in.
- **Error or failure state:** Invalid credentials: show a generic "invalid email or password" message. No account exists: same generic message (do not confirm/deny account existence). Pending account attempts login: show a message directing them to check their email for the activation link, without confirming whether the email itself is valid. Disabled account attempts login: show a message indicating the account is inactive and to contact a manager, without further detail. Network failure during login: explicit error, do not silently hang.

### FR-7: Add staff (Manager only) — sends invite
- **Requirement:** A Manager-flagged user can add a new staff member, which creates an account with status Pending and sends that person an invite email.
- **User:** Manager-flagged user only.
- **Trigger:** Manager selects "Add Staff" from an admin screen.
- **User action:** Enters full name, email, department, descriptive role, and sets the Manager/Staff flag for the new account.
- **System behavior:** Validates the email is unique; calls Supabase Auth's admin API (`inviteUserByEmail` or equivalent) to create a pending auth account and trigger an invite email via Supabase's built-in email delivery (no separate email service required); creates a corresponding User record in the application database (name, email, department, role, Manager/Staff flag, status = Pending, linked to the Supabase auth user ID, with an `invitedAt` timestamp) — no password is generated or stored by the application at this step.
- **Expected result:** The staff member receives an invite email at the address the manager entered; they are not yet able to log in until they complete activation (FR-7b).
- **Data involved:** User (name, email, department, role, Manager/Staff flag, status, Supabase auth user ID, invitedAt); Supabase Auth (pending account, invite email delivery).
- **Rules or restrictions:** CONFIRMED — restricted to Manager-flagged users only, enforced at both UI and API/server level. Only an email a manager has explicitly added this way can ever receive a valid, working invite link — there is no way to request an invite from outside this flow.
- **Error or failure state:** Duplicate email: block with a clear validation message. Missing required field: block with inline validation. Supabase invite call succeeds but the application User record fails to save (or vice versa): treat as a failed operation overall, surface an explicit error — **RECOMMENDATION:** wrap this in a single server-side operation that revokes the pending Supabase invite if the database write fails, to avoid an orphaned invite the app doesn't know about.

### FR-7b: Staff account activation (staff-initiated, invite-link only)
- **Requirement:** A staff member with a valid, unexpired invite link can set their own initial password and activate their account, moving it from Pending to Active.
- **User:** A staff member whose email a manager has already added via FR-7.
- **Trigger:** Staff member clicks the link in their invite email.
- **User action:** Sets a password meeting the application's minimum password requirements (**OPEN QUESTION:** specific complexity rules — length, character requirements — are not specified in the source idea and default to Supabase Auth's standard minimums unless the client specifies otherwise).
- **System behavior:** Validates the invite token is valid and unexpired; sets the password on the Supabase Auth account; updates the User record's status from Pending to Active and sets `activatedAt`; the staff member is logged in or redirected to log in with their new credentials.
- **Expected result:** The staff member can now log in normally via FR-6.
- **Data involved:** Supabase Auth (account activation, password set by the staff member); User (status, activatedAt).
- **Rules or restrictions:** CONFIRMED — this is the one deliberate exception to "no self-service account creation": staff set their own initial password, but only for a pre-approved email a manager already added, and they cannot set or change their department, role, or Manager/Staff flag through this flow.
- **Error or failure state:** Expired or already-used invite link: show a clear message and direct the person to ask their manager to resend an invite (FR-7c). Password doesn't meet minimum requirements: inline validation, no silent rejection.

### FR-7c: Resend invite (Manager only)
- **Requirement:** A Manager-flagged user can resend an invite to any staff account still in Pending status.
- **User:** Manager-flagged user only.
- **Trigger:** Manager selects "Resend Invite" for a Pending account on the Staff list.
- **User action:** Confirms the resend action.
- **System behavior:** Calls Supabase Auth's admin API to issue a new invite link for that account, which invalidates the previous invite link (the old link no longer works if clicked); sends a new invite email to the same address; updates `invitedAt` to the resend time. The account remains in Pending status.
- **Expected result:** The staff member receives a new invite email; the manager sees an on-screen confirmation that the resend succeeded.
- **Data involved:** User (invitedAt); Supabase Auth (invite token regeneration, email delivery).
- **Rules or restrictions:** CONFIRMED — restricted to Manager-flagged users only, enforced at UI and API/server level. Only available for accounts currently in Pending status — not shown or permitted for Active or Disabled accounts.
- **Error or failure state:** Attempt to resend for a non-Pending account: reject with a clear message (e.g. "This account is already active" or "This account is disabled"). Supabase invite call fails: explicit error, no false confirmation shown; the previous invite link's validity in this failure case is an **ASSUMPTION** — treated as still invalidated once Supabase confirms the new invite was issued, but not invalidated if the resend call fails outright.

### FR-8: Forgot password (staff self-service, Active accounts only)
- **Requirement:** A staff member on an Active account can reset their own password at any time via a self-service "Forgot password" flow, with no manager involvement.
- **User:** Any staff member with an Active account (Manager-flagged or Staff-flagged — this applies equally to both).
- **Trigger:** Staff member selects "Forgot password?" on the login screen (FR-6).
- **User action:** Enters their account email; later, clicks the reset link sent to that address and sets a new password meeting the application's minimum password requirements.
- **System behavior:** Calls Supabase Auth's standard password-reset flow (`resetPasswordForEmail` or equivalent) to send a time-limited, single-use reset link to the account's email; on link click, validates the token and lets the user set a new password directly on the Supabase Auth account; does not reveal whether a given email has an account (same non-enumeration principle as FR-6 login errors). On success, invalidates any active session for that user so old sessions can't linger on another device.
- **Expected result:** The staff member sets a new password themselves and can log in immediately with it; no manager sees or relays the password at any point.
- **Data involved:** Supabase Auth (reset token issuance, credential update, hashed password) — no password field or reset token stored in the application database.
- **Rules or restrictions:** CONFIRMED — available only for Active accounts. Pending accounts use FR-7b instead (their first password is set via invite-link activation, not this flow); Disabled accounts must be reactivated via FR-10 before a reset is possible — a reset request for a Disabled or Pending account should not confirm the account's existence or status, consistent with the non-enumeration principle in FR-6.
- **Error or failure state:** Expired or already-used reset link: show a clear message directing the user to request a new one. Password doesn't meet minimum requirements: inline validation, no silent rejection. Reset requested for a non-existent, Pending, or Disabled account: show the same generic "check your email for a reset link" confirmation regardless, to avoid leaking account status. Supabase Auth reset call fails: explicit error, old password remains valid until a reset is confirmed successful (do not leave the account in a broken, unloginable state).

### FR-10: Disable / reactivate staff account (Manager only)
- **Requirement:** A Manager-flagged user can disable an Active account, blocking login, and can reactivate a Disabled account.
- **User:** Manager-flagged user only.
- **Trigger:** Manager selects "Disable" or "Reactivate" for a given staff member on the Staff list.
- **User action:** Confirms the action.
- **System behavior:** Updates the User record's status to Disabled (or back to Active on reactivation); on disable, invalidates any active Supabase Auth session for that user so login is blocked immediately, not just on next login attempt.
- **Expected result:** A Disabled account cannot log in (FR-6) until a manager reactivates it. Existing tasks created by or assigned to that user are unaffected — **ASSUMPTION:** disabling an account does not delete, reassign, or hide their existing tasks; those remain visible and editable by permitted users exactly as before, since the source idea doesn't specify otherwise. **OPEN QUESTION:** should disabling a user automatically unassign their open tasks or notify anyone? Not specified — currently assumed no.
- **Data involved:** User (status); Supabase Auth (session invalidation on disable).
- **Rules or restrictions:** CONFIRMED — restricted to Manager-flagged users only, enforced at UI and API/server level. A Manager-flagged user should not be able to disable their own account through this screen — **RECOMMENDATION:** block self-disable to avoid a manager accidentally locking themselves out, especially if they're the only manager on the team.
- **Error or failure state:** Attempt to disable the only remaining Manager-flagged account: **RECOMMENDATION:** block this with a clear message, to avoid the team ending up with zero active managers. Save failure: explicit error, account remains in its prior state until the change is confirmed.

### FR-11: Client management (Manager only)
- **Requirement:** A Manager-flagged user can create and view clients.
- **User:** Manager-flagged user only.
- **Trigger:** Manager selects "Add Client" from the admin screen or from the client dropdown during task creation.
- **User action:** Enters client name (required) and an optional color tag.
- **System behavior:** Validates the client name is non-empty; creates the Client record; the client becomes immediately available in the client dropdown for task creation (FR-1) and the client filter (FR-5).
- **Expected result:** New client appears in all relevant dropdowns/filters app-wide.
- **Data involved:** Client (name, color tag).
- **Rules or restrictions:** CONFIRMED — restricted to Manager-flagged users only, enforced at UI and API/server level. **RECOMMENDATION:** enforce case-insensitive uniqueness on client name at the database level to reduce (though not fully eliminate) the "Acme" vs "acme" duplication risk identified in Section 12 — this does not fully solve "Acme" vs "Acme Inc." style duplicates, which remain a manual-diligence risk.
- **Error or failure state:** Empty/duplicate name: inline validation error. Save failure: explicit error message.

---

## 7. AI and AI-Related Tools and Solutions

CONFIRMED — No AI is used anywhere in version one of TaskFlow. Every feature in this product (task creation, status tracking, filtering, search, dashboards, staff/client administration) is fully served by deterministic, rule-based software: standard database queries, form validation, and conditional UI logic. There is no natural-language understanding, no generation, no prediction, and no recommendation happening anywhere in this product. Adding an AI component (e.g. AI-suggested priorities, AI-drafted task descriptions) would introduce reliability risk, cost, and complexity without solving a problem this product actually has — the source idea explicitly rejects AI-generated tasks and AI-guessed deadlines/priorities. No AI section requirements (input/output, model choice, guardrails, etc.) apply to this product.

---

## 8. Technical Architecture

**CONFIRMED** — the full stack below is now approved by the client, including TypeScript, Supabase, and Vercel specifically:

- **Language:** CONFIRMED — TypeScript across the frontend and backend. This gives compile-time type safety over the Task/User/Client shapes defined in the Prisma schema below, which is genuinely useful here since assignee, client, and status fields all have specific valid values (enums) that TypeScript can enforce at build time rather than only at runtime.
- **Frontend:** Next.js (React) with TypeScript, deployed as a single web application, responsive for desktop/tablet/mobile (no native app, per the source idea's "responsive" requirement).
- **Backend:** Next.js API routes written in TypeScript — no separate microservices; a single application server is appropriate for this scale.
- **Database:** CONFIRMED — PostgreSQL via Supabase (hosted, free-tier to start) — a relational database fits this product well, since all data (Users, Clients, Tasks) is structured and relational, with no need for a document store or NoSQL flexibility.
- **ORM:** Prisma, as required by the PRD structure below.
- **Authentication:** CONFIRMED — Supabase Auth, used for credential storage, invite-based account activation, and login. Managers add staff via Supabase's admin invite API (`inviteUserByEmail` or equivalent), which emails the staff member a signup link tied to that specific address — only pre-approved emails can ever activate an account, and there is no open public signup form. The staff member sets their own initial password during activation (FR-7b); Supabase Auth stores it hashed, never in plaintext. Post-activation password resets are fully self-service, via Supabase Auth's standard email-based "forgot password" flow (FR-8) — no manager involvement or separate invite email required. Session handling uses Supabase's standard session/JWT mechanism.
- **API architecture:** A small set of REST-style endpoints (or Next.js server actions) for Tasks, Users, and Clients CRUD, gated by authentication middleware that checks the Manager/Staff flag per the Permissions Model for restricted actions (add staff, manage clients, edit/delete tasks outside the creator/assignee scope).
- **File storage:** Not applicable — file attachments are explicitly out of scope for v1.
- **AI services:** Not applicable — no AI is used (Section 7).
- **Third-party APIs:** None required for v1.
- **Payments:** Not applicable (Section 10).
- **Search:** Handled via simple database text queries (e.g. `ILIKE`/`contains` filtering) on the task title field — no dedicated search service or vector index is needed at this scale (see Section 9).
- **Background jobs:** None required for v1 — there are no notifications, scheduled emails, or async processes in scope.
- **Security:** CONFIRMED — passwords are handled entirely by Supabase Auth and stored hashed, never in plaintext, in either the application database or the UI at any point (see FR-7/FR-7b/FR-8). This is a change from an earlier design that stored plaintext passwords for manager relay; the self-service reset flow removes managers from the credential-handling loop entirely, so no plaintext or one-time-display password ever passes through a manager's screen. All authorization checks (who can edit/delete a task, who can manage clients/staff) must be enforced server-side on every request, not only in the client UI.
- **Analytics:** Basic application-level logging of the events listed in Section 9 (task creation counts, dashboard opens, time-to-completion) — CONFIRMED as needed per the source idea's "what must version one collect for version two," but no dedicated analytics platform is required at this scale; simple database-backed event logging is sufficient.
- **Deployment:** CONFIRMED — Vercel for the Next.js application, paired with Supabase for the database.

How the parts communicate: the Next.js frontend calls the API routes/server actions directly; the API layer talks to PostgreSQL via Prisma; authentication middleware runs on every protected request to check session validity and the Manager/Staff flag before permitting restricted actions. No queues, caches, or additional services are introduced, since v1's data volume and feature set don't justify that complexity.

**OPEN QUESTION:** The technology stack above was not specified by the client and needs explicit confirmation before development starts — including whether Catalyst Creative Studio has any existing hosting, database, or tooling preferences/constraints not captured in the source idea.

### Prisma Data Model

```prisma
// schema.prisma
// NOTE: Authorization checks (who can create a task, who can edit/delete it,
// who can manage clients/staff) are enforced in application-layer logic,
// not as database constraints. Prisma models below capture data shape and
// relationships only.

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum UserFlag {
  MANAGER
  STAFF
}

enum AccountStatus {
  PENDING
  ACTIVE
  DISABLED
}

enum TaskStatus {
  TODO
  IN_PROGRESS
  COMPLETED
}

enum TaskPriority {
  LOW
  MEDIUM
  HIGH
}

model User {
  id              String         @id @default(cuid())
  supabaseAuthId  String         @unique // links to Supabase Auth's auth.users.id — Supabase Auth owns credential storage; this app never stores a password
  fullName        String
  email           String         @unique
  department      String
  role            String         // descriptive only, e.g. "Designer", "Project Manager" — NOT used for access control
  flag            UserFlag       // MANAGER or STAFF — the actual access-control field
  status          AccountStatus  @default(PENDING) // Pending / Active / Disabled — see PRD Section 6
  invitedAt       DateTime       @default(now()) // set on creation (FR-7), updated on resend (FR-7c)
  activatedAt     DateTime?      // set when the staff member completes FR-7b; null until then
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt

  tasksCreated  Task[] @relation("TaskCreator")
  tasksAssigned Task[] @relation("TaskAssignee")

  @@index([email])
  @@index([status])
}

model Client {
  id        String   @id @default(cuid())
  name      String   @unique // RECOMMENDATION: case-insensitive uniqueness enforced at application layer
  colorTag  String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  tasks Task[]
}

model Task {
  id          String       @id @default(cuid())
  title       String
  description String?
  status      TaskStatus   @default(TODO)
  priority    TaskPriority
  dueDate     DateTime
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
  completedAt DateTime?

  creator     User    @relation("TaskCreator", fields: [creatorId], references: [id])
  creatorId   String

  assignee    User    @relation("TaskAssignee", fields: [assigneeId], references: [id])
  assigneeId  String

  client      Client? @relation(fields: [clientId], references: [id])
  clientId    String?

  @@index([assigneeId])
  @@index([status])
  @@index([dueDate])
  @@index([clientId])
}
```

---

## 9. Vector Database Architecture and Design

CONFIRMED — This product does not require vector search, embeddings, or RAG (retrieval-augmented generation). There is no semantic search use case (search in v1 is a simple text match on task titles) and no AI retrieval need, since no AI feature exists in this product (Section 7). A vector database should not be added for v1 — it would introduce infrastructure, cost, and complexity with no corresponding product requirement. If a future version introduces AI-assisted search or recommendations, this decision should be revisited at that time, not preemptively built now.

---

## 10. Business Model

CONFIRMED — There is no payment, subscription, purchase, or billing model of any kind in this product. TaskFlow is an internal tool built for one agency's own use, not a commercial product sold to external customers. No pricing, merchant account, or revenue model is defined or should be invented for this PRD.

---

## 11. Success Metrics

**Primary metric:** CONFIRMED — Percentage of the team's tasks that exist only in TaskFlow (not duplicated in WhatsApp/notebooks) after 30 days of use. **RECOMMENDATION:** operationalize this via a brief periodic manual check-in or survey with the team, since the app itself has no way to observe WhatsApp/notebook activity directly.

**Supporting metrics:** CONFIRMED, with logging detail added:
- Daily active users as % of total team members — log a "last active" timestamp per user, updated on each session.
- Average time a task stays "Overdue" before being addressed — computed from the gap between a task's due date and its completedAt timestamp, for tasks that were ever overdue.
- Number of tasks created per week — a simple count grouped by createdAt week, trend tracked over time.

**User-value metrics:** **RECOMMENDATION:** Time between task creation and completion (cycle time), and the proportion of tasks completed before vs. after their due date — both are derivable from existing Task fields (createdAt, dueDate, completedAt) without any new data collection.

**Business/operational metrics:** CONFIRMED — since there is no revenue model, "business" here means operational health: whether managers are the only ones creating clients/tasks or whether the whole team is engaging with task creation (per the source idea's "collect now" list), and total active client count over time.

**Failure signal:** CONFIRMED — Team members resume sending task-related messages in the WhatsApp group instead of creating tasks in the app.

---

## 12. Risks

**Risk 1: A task silently fails to save (e.g. mobile network failure).**
- **Severity:** Highest.
- **Impact:** A task the user believed was created never existed, recreating the exact "task forgotten" problem TaskFlow exists to solve — directly undermines the product's core value proposition.
- **Mitigation:** Explicit save confirmation and error states in the UI; no optimistic UI that shows success before the server confirms; retain form data on failure so the user isn't forced to retype it.
- **Detection:** Server-side error logging/monitoring on task create/update endpoints; alerting on elevated error rates.

**Risk 2: Unauthorized access to staff administration, invite links, and password resets.**
- **Severity:** High.
- **Impact:** Since there is no open public signup, this risk centers on (a) the Manager-only Add Staff/invite action (FR-7), (b) the invite link itself being intercepted or forwarded before the intended person uses it, and (c) the self-service "forgot password" flow (FR-8) being abused — e.g. to enumerate valid staff emails, or to lock a legitimate user out by racing a reset. A leak or abuse in any of these could let someone else activate, take over, or lock out a staff account.
- **Mitigation:** Enforce the Manager/Staff flag check at the API/server layer on every restricted request (not only hiding UI controls); rely on Supabase's invite links and reset links being single-use and time-limited by default; return the same generic confirmation from the forgot-password flow regardless of whether the email exists or the account's status, to prevent email enumeration; periodic manual review of the user list against the actual team roster.
- **Detection:** Server-side authorization-failure logging (attempts to access Manager-only endpoints by Staff-flagged accounts); Supabase Auth's own audit log for admin actions, invite/activation events, and password-reset events (including unusual reset-request volume against a single account, which could indicate lockout abuse).

**Risk 3: Client list duplication (e.g. "Acme" vs "Acme Inc").**
- **Severity:** Medium.
- **Impact:** Tasks get split across duplicate client entries, quietly undermining the "what's happening on Client X" filter that motivated the client feature, without producing an obvious error.
- **Mitigation:** Restrict client creation to Manager-flagged users only (confirmed); **RECOMMENDATION:** enforce case-insensitive uniqueness on client name at save time as a partial technical safeguard.
- **Detection:** Periodic manual review of the client list by a manager.

**Note on password storage (superseded):** The application no longer stores passwords in plaintext, and no longer routes password resets through a manager at all. Authentication and credential storage moved to Supabase Auth, and password handling switched from a persistent manager-visible list to a fully staff-initiated self-service flow (FR-7b for initial activation, FR-8 for later resets). Passwords are hashed by Supabase Auth and never touch the application's own database, and a manager never sees or relays a staff password at any point. The earlier database-compromise assumption is now largely moot for credentials specifically, since there's no plaintext password data in the application database to expose even in that scenario — though other application data (tasks, client names, staff names/emails) would still be exposed in a compromise, consistent with the client's instruction to treat database compromise as out of scope for this build.

**Additional risk identified (own addition): Open task creation used to clutter the task list.**
- **Severity:** Low.
- **Impact:** Because any staff member can create and assign tasks to anyone, a large volume of low-value or duplicate tasks could clutter dashboards and undermine the "clarity and simplicity" goal, though this is a behavioral risk, not a technical one.
- **Mitigation:** No technical restriction is recommended here (open creation is a confirmed, deliberate decision) — if this becomes a real problem, it is better solved by team norms than by adding approval gates the product currently rejects.
- **Detection:** Monitor tasks-created-per-week trend (already a supporting success metric) for unusual spikes.

---

## 13. Open Questions

**Product questions:**
- What password complexity requirements should apply when a staff member sets their initial password during activation (FR-7b) or a later self-service reset (FR-8)? Not specified in the source idea — currently defaults to Supabase Auth's standard minimums.
- Should a rate limit apply to forgot-password requests per account/email, to reduce reset-email spam or lockout abuse (FR-8)? Not specified — **RECOMMENDATION:** rely on Supabase Auth's built-in rate limiting unless the client specifies stricter requirements.
- Should disabling a staff account (FR-10) automatically unassign their open tasks or notify anyone? Not specified — currently assumed no.

**Business questions:**
- None — the source idea explicitly has no business model to clarify (Section 10).

**Technical questions:**
- None currently — the full stack (TypeScript, Next.js, Supabase for the database, Vercel for deployment) is now confirmed by the client.

**Data questions:**
- None beyond what's captured in the Prisma model — all data ownership and structure was specified clearly enough in the source idea to model directly.

**User questions:**
- None — user roles, permissions, and the dashboard toggle behavior are now fully specified.

**Security/compliance questions:**
- None currently — the client has instructed that database compromise be assumed out of scope for v1, so the plaintext-password trade-off is not treated as an open risk to resolve at this stage.
