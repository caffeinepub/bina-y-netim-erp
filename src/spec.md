# Specification

## Summary
**Goal:** Add a visual apartment layout grid component to the Owner Dashboard that displays all apartments with occupancy status indicators.

**Planned changes:**
- Create DaireGorunumu.tsx component that renders apartments in a responsive grid layout with cards showing apartment names
- Integrate the component into OwnerDashboard.tsx as a new "Daire Görünümü" section after the apartment management section
- Add occupancy status badges to apartment cards (Boş/Dolu) by cross-referencing with building user data
- Implement hover interactions that display additional apartment information (creation date) in tooltips

**User-visible outcome:** Building owners can view all apartments in an interactive visual grid layout with clear occupancy status indicators and hover details, providing an at-a-glance overview of their building's apartment allocation.
