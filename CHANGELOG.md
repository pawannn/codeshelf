# Change Log

All notable changes to the "CodeShelf" extension will be documented in this file.

This project follows semantic versioning.

---

## [0.0.4] - 2026-03-01

### Added
- Create custom sections to organize projects
- Add projects to root from current workspace
- Add folders directly from Explorer (right-click → Add to CodeShelf)
- Drag and drop projects between sections and root
- Rename and delete sections (with confirmation)
- Remove projects via context menu
- Automatic cleanup of missing project folders on load
- Manual refresh button to revalidate project paths
- Duplicate project prevention based on file system path
- Native VS Code themed icons for sections and projects
- Status notifications for add/remove actions

### Technical
- Persistent storage using VS Code `globalState`
- Implemented TreeDataProvider architecture
- Integrated VS Code Drag & Drop API
- Context-aware command handling with scoped menus

---

## [Unreleased]

### Planned
- Project search
- Section reordering
- Sorting options (A–Z / Manual)
- Import / Export configuration
- Sync support