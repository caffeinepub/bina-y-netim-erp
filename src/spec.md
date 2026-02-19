# Specification

## Summary
**Goal:** Fix the blank screen issue after Internet Identity login by ensuring users are properly redirected to their role-specific dashboards with content displayed.

**Planned changes:**
- Debug and fix post-authentication routing in App.tsx to correctly redirect users to role-specific dashboards (OwnerDashboard, ManagerDashboard, or ResidentDashboard)
- Verify user profile query properly fetches role and building data immediately after authentication with error handling
- Add defensive checks in dashboard components to handle missing profile data with loading states and Turkish error messages
- Fix onboarding flow in Home.tsx to properly render onboarding UI for new users or dashboard content for existing users
- Verify React Query cache invalidation refreshes user profile after building creation, invite registration, and role assignments

**User-visible outcome:** After logging in with Internet Identity, users will be immediately redirected to their role-specific dashboard (Owner, Manager, or Resident) with content properly displayed instead of seeing a blank screen. New users without building assignments will see the onboarding flow, while existing users will see their dashboard content.
