# TaskFlow





TaskFlow is an internal task management app for a small creative agency. It was designed to replace scattered task tracking across WhatsApp, spreadsheets, and notebooks.



\*The Problem\*



The team manages multiple client projects at the same time, making it easy for tasks to get lost, deadlines to be missed, or responsibilities to become unclear.



The goal was to create one simple place where the team could see what needs to be done, who is responsible, and what is overdue.



\*Who It's For\*



TaskFlow is built for small creative teams with project managers, designers, developers, and content teams working across multiple client projects.



\*Product Decisions\*



1\. Build for one team, not everyone



I chose to make TaskFlow an internal, invite-only product instead of a multi-company platform. This kept the first version focused on solving one team's workflow rather than building features for every possible type of user.



2\. Keep tasks simple



A task only needs the information necessary to manage it: title, assignee, due date, priority, status, and client. I deliberately avoided comments, file uploads, subtasks, and other features that could add complexity without solving the core problem.



3\. Make the dashboard action-oriented



Instead of showing lots of project data, the dashboard focuses on Today, In Progress, Completed, and Overdue. The decision was based on what a project manager needs to know when starting the workday.



4\. Use a simple workflow



Tasks move through To Do → In Progress → Complete. A small team does not need a complicated workflow to understand the state of its work.



5\. Separate manager and staff permissions



Managers can manage users and tasks, while staff primarily manage their assigned work. This prevents unnecessary access while keeping the interface simple for each role.



6\. Keep clients out of the first version



Clients do not have accounts or access to the system. TaskFlow is focused on the agency's internal workflow first, rather than trying to solve client communication at the same time.



\*Outcome\*



TaskFlow turns a scattered task management process into one structured workspace.



The project was also an exercise in product thinking: starting with a specific business problem, making deliberate scope decisions, and building only what was necessary to solve the problem.



\*How It Was Built\*



TaskFlow was built as a real full-stack application rather than a static frontend.



The application uses:



React



TypeScript



Tailwind CSS



Supabase



Supabase Auth



PostgreSQL



Row Level Security (RLS)



\*What I Built\*



I implemented the core systems needed to make TaskFlow functional:



Authentication and password reset



Manager and staff access levels



User account status



Staff management



Client management



Task creation and assignment



Task editing and deletion



Task status and priority



Due dates



Role-based permissions



Database-level authorization with RLS



\*Design System\*



I created a reusable design system for TaskFlow before building the interface.



The design system is documented in design-system.md and acts as the visual source of truth for the application.



I also translated the design system into reusable React components so the interface could remain consistent as new features were added.



\*Development Approach\*



I used AI coding tools as part of the development process, but the product was built from a defined product structure rather than generated from a single prompt.



The process involved:



Defining the product problem



Creating the PRD



Planning the database



Defining the design system



Building reusable components



Implementing authentication and authorization



Building the core product features



Testing and refining the application



The goal was to use AI to help build the product while still making the product, design, architecture, and scope decisions myself.

