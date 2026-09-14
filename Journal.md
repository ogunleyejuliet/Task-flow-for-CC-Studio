What i did for Task FLow by CC Studio

TaskFlow is an internal task management product for CC Studio, designed to help the team organize and track work across different roles.

The main users include:

Designer, Developer, Product Manager, CEO.

The product allows the team to:

Create tasks
Assign tasks to team members
Track task status
See who is responsible for each task
Manage work across the creative agency

Phase 1: Product Planning

1. Defined the Product Idea

I defined TaskFlow as a task management system for a creative agency.

The main problem it solves is keeping track of:

What needs to be done
Who is responsible
The current status of each task
Work assigned to different team members

The product is specifically designed around how a creative agency works rather than being a generic task management app.

2. Created the PRD

I completed the Product Requirements Document for TaskFlow.

The PRD helped define:

The product purpose
Users and roles
Core functionality
User flows
Features
Database requirements
Authentication
Authorization
Technical requirements

The PRD became the main reference for building the product.

Phase 2: Database Planning

3. Planned the Database Structure

I worked through the database structure before building the application.

I identified the main entities and relationships needed for the product.

For example:

Users

Team members using TaskFlow
Each user has an ID

Tasks

Tasks created within the agency
Tasks are assigned to users

The relationship between users and tasks is one-to-many.

One user can have many tasks assigned to them.

4. Worked Through Authentication

I decided that TaskFlow needs authentication so users can securely access their accounts.

Authentication is responsible for answering:

"Who is this user?"

The application will therefore need users to log in before accessing their TaskFlow workspace.

5. Worked Through Authorization

I also separated authentication from authorization.

Authorization answers:

"What is this user allowed to do?"

I defined permissions around different user roles.

For example, I decided that only managers should be allowed to delete tasks.

This means the application should not simply check whether someone is logged in. It should also check whether they have permission to perform certain actions.

Phase 3: Design System

6. Created the Design Direction

I worked on the design system for TaskFlow before continuing with the application build.

The goal was to avoid designing every screen independently and instead create a reusable visual system.

7. Created design-system.md

I created a design-system.md file containing the design system rules for the product.

This gives the coding agent a source of truth for the visual system instead of relying only on individual screens.

The design system covers things such as:

Typography
Colors
Spacing
Components
UI patterns
Design tokens
Visual rules

8. Translated the Design System Into React

After defining the design system, I moved from design into implementation.

I translated the design system into reusable React components.

Instead of creating one-off UI elements for every screen, the goal was to have reusable components that could be used throughout TaskFlow.

This creates consistency between the design and the actual coded product.

9. Established the Design System as the Source of Truth

I decided that the existing design system and reusable components should be treated as the source of truth during development.

The coding agent should:

Read design-system.md
Inspect the existing architecture
Reuse existing components
Only create new components when necessary
Avoid recreating components that already exist
Phase 4: Project Architecture

10. Planned the Application Architecture

I worked through how the different parts of TaskFlow would connect.

The project is being built as a real application rather than just a static frontend.

The architecture includes:

React frontend
TypeScript
Tailwind CSS
Database
Authentication
Authorization
Reusable UI components
Backend/API logic

Phase 5: Supabase

12. Set Up the Supabase Project

I created the Supabase project for TaskFlow.

Supabase is being used for the application's backend services, particularly the database and authentication.

13. Worked With the Supabase Project URL

I identified where to get the public Supabase project URL from the Supabase project settings.

I also learned that environment variables should be used for project configuration rather than hardcoding sensitive configuration into the application.

14. Checked .env.local

I learned that .env.local should not be committed to GitHub.

The project should keep environment variables locally and use a .gitignore rule to prevent .env.local from being tracked.

Phase 6: Git and GitHub

15. Created the GitHub Repository

I created a GitHub repository for TaskFlow:

Task-flow-for-CC-Studio

16. Learned the Correct New Project Git Workflow

I clarified the basic Git workflow for a new project:

Create project
↓
git init
↓
Check .gitignore
↓
git add .
↓
git commit
↓
Create/connect GitHub remote
↓
git push

