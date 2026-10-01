-- Phase 4: Task Management — Supabase SQL Migration
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ============================================================

-- 1. Add soft-delete column to tasks table
ALTER TABLE public.tasks
  ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN NOT NULL DEFAULT FALSE;

-- 2. Index for fast active-task queries
CREATE INDEX IF NOT EXISTS idx_tasks_is_deleted ON public.tasks (is_deleted);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee_id ON public.tasks (assignee_id);
CREATE INDEX IF NOT EXISTS idx_tasks_creator_id ON public.tasks (creator_id);
CREATE INDEX IF NOT EXISTS idx_tasks_client_id ON public.tasks (client_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks (status);

-- 3. Drop existing task RLS policies if any (clean slate)
DROP POLICY IF EXISTS "tasks_select_manager"   ON public.tasks;
DROP POLICY IF EXISTS "tasks_select_staff"     ON public.tasks;
DROP POLICY IF EXISTS "tasks_insert"           ON public.tasks;
DROP POLICY IF EXISTS "tasks_update_manager"   ON public.tasks;
DROP POLICY IF EXISTS "tasks_update_staff"     ON public.tasks;
DROP POLICY IF EXISTS "tasks_delete_manager"   ON public.tasks;

-- 4. Enable RLS (idempotent)
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- 5. Helper function: is current user a manager?
CREATE OR REPLACE FUNCTION public.is_manager()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND access_level = 'manager'
      AND account_status = 'active'
  )
$$;

-- 6. RLS Policies ---------------------------------------------------

-- Managers: can SELECT all non-deleted tasks
CREATE POLICY "tasks_select_manager"
  ON public.tasks
  FOR SELECT
  TO authenticated
  USING (
    is_deleted = FALSE
    AND public.is_manager()
  );

-- Staff: can SELECT tasks they created or are assigned to
CREATE POLICY "tasks_select_staff"
  ON public.tasks
  FOR SELECT
  TO authenticated
  USING (
    is_deleted = FALSE
    AND NOT public.is_manager()
    AND (assignee_id = auth.uid() OR creator_id = auth.uid())
  );

-- Any authenticated active user can INSERT tasks
CREATE POLICY "tasks_insert"
  ON public.tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND account_status = 'active'
    )
  );

-- Managers: can UPDATE any task
CREATE POLICY "tasks_update_manager"
  ON public.tasks
  FOR UPDATE
  TO authenticated
  USING (public.is_manager())
  WITH CHECK (public.is_manager());

-- Staff: can UPDATE tasks they created or are assigned to
CREATE POLICY "tasks_update_staff"
  ON public.tasks
  FOR UPDATE
  TO authenticated
  USING (
    NOT public.is_manager()
    AND (assignee_id = auth.uid() OR creator_id = auth.uid())
  )
  WITH CHECK (
    NOT public.is_manager()
    AND (assignee_id = auth.uid() OR creator_id = auth.uid())
  );

-- Physical DELETE is not used (soft-delete via UPDATE is_deleted=true).
-- Only managers may physically delete (emergency/admin use only).
CREATE POLICY "tasks_delete_manager"
  ON public.tasks
  FOR DELETE
  TO authenticated
  USING (public.is_manager());
