# Specification

## Summary
**Goal:** Redesign the login screen to display three separate onboarding cards simultaneously for different user types (Building Owner, Authority, Resident).

**Planned changes:**
- Display three distinct onboarding cards side-by-side on the login screen, each targeting a specific user type (Building Owner, Authority, Resident/Staff)
- Each card includes a visual icon, Turkish title, description, and its own Internet Identity login button
- Implement responsive layout that arranges cards horizontally on desktop and vertically on mobile
- Store the selected onboarding flow type when a user clicks an Internet Identity button within a card
- Update post-login routing to direct users to the appropriate flow: Building Owner to building creation form, Authority to invite code entry for YETKILI role, Resident to invite code entry for SAKIN role
- Design each card with clear visual hierarchy using icons, role-specific styling, and consistent shadcn/ui patterns

**User-visible outcome:** Users see three onboarding options on the login screen and can choose their role before authenticating, leading to a tailored post-login experience based on their selection.
