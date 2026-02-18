# Specification

## Summary
**Goal:** Restructure authentication flow to separate login from authorization by moving invite code registration from the Login page to the Home page.

**Planned changes:**
- Remove invite code registration option completely from Login page, leaving only Internet Identity authentication
- Update Home page to conditionally render based on user's building association
- Display onboarding section with 'Bina Oluştur' (Create Building) button and 'Davet Kodu Gir' (Enter Invite Code) input for users without a building
- Display normal role-based panel content for users with a building
- Move InviteCodeRegistration component functionality to Home page onboarding section
- Ensure Home page automatically updates to show role-based panel after successful building creation or invite code usage

**User-visible outcome:** Users authenticate with Internet Identity on the Login page, then see an onboarding section on the Home page if they don't have a building assignment. They can either create a new building or enter an invite code to join an existing one. Once assigned to a building, they see the normal role-based dashboard.
