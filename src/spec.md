# Specification

## Summary
**Goal:** Fix infinite render loop and React Query refetch issues causing performance problems and UI instability.

**Planned changes:**
- Disable aggressive background refetching in all React Query hooks by setting refetchOnWindowFocus to false, refetchOnReconnect to false, and adding staleTime configuration
- Fix onboarding flow state management race condition by delaying clearOnboardingFlow() call until mode state is used for rendering
- Add loading state guards in App.tsx to prevent routing decisions until profile and building queries complete
- Add defensive null/undefined checks in ProtectedRoute to prevent rendering with incomplete profile data
- Add fallback in Home page to retrieve onboarding flow from session storage if local mode state is null

**User-visible outcome:** The application will load smoothly without blank screens or flickering, onboarding flows will work correctly, and the interface will feel more responsive with reduced unnecessary data fetching.
