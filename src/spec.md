# Specification

## Summary
**Goal:** Add announcements display and issue reporting functionality to the Resident Dashboard.

**Planned changes:**
- Display comprehensive announcements list with title, description, creation date, and creator in card layout with Turkish header 'Duyurular'
- Create issue reporting form (IssueReportForm) allowing residents to report building issues with title, description, and apartment selection
- Implement backend arizaBildir function to create new Ariza records with validation for SAKIN role
- Create useReportIssue React Query mutation hook to call arizaBildir and invalidate issues cache
- Integrate IssueReportForm into ResidentDashboard with 'Arıza Bildir' section header
- Organize ResidentDashboard with clear two-column or stacked layout matching OwnerDashboard patterns

**User-visible outcome:** Residents can view all building announcements and report issues/faults through their dashboard with proper form validation and feedback in Turkish.
