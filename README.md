# 📚 Bookshelf

**Organize your projects. Own your workspace.**

Bookshelf is a lightweight VS Code extension that helps you organize, group, and manage your local projects with sections and drag-and-drop support, all inside the Activity Bar.

---

## ✨ Features

### 📂 Sections
- Create custom sections (Work, Personal, Clients, etc.)
- Rename sections
- Delete sections (removes all projects inside)

### 📌 Project Bookmarks
- Add current workspace to Bookshelf
- Add folders from Explorer (via context menu)
- Prevent duplicate projects (based on path)

### 🔁 Drag & Drop
- Drag projects into sections
- Move projects between sections
- Organize visually with ease

### 🗑 Remove Projects
- Right-click project → **Remove from Bookshelf**

### 🔄 Auto Cleanup
- Automatically removes projects whose folders no longer exist
- Manual **Refresh** button to revalidate all projects

### 🚀 Quick Access
- Click a project to open it in a new VS Code window

---

## 🖥 How to Use

### Add a Section
1. Open **Bookshelf** from Activity Bar
2. Click the ➕ icon
3. Enter section name

### Bookmark Current Workspace
Click the bookmark icon in the editor title bar.

### Remove a Project
Right-click on the project → **Remove from Bookshelf**

### Rename or Delete a Section
Right-click on the section → choose action

### Refresh Bookshelf
Click the refresh icon to:
- Remove deleted/missing project folders
- Revalidate project paths

---

## 🧠 How It Works

Bookshelf stores project paths locally using VS Code’s `globalState`.

Each project is uniquely identified by its file system path to prevent duplicates.

---

## Why Bookshelf?

If you:
- Work across many repositories
- Switch contexts often
- Want visual grouping of projects
- Need fast project launching

Bookshelf keeps your development life structured.

---

## 🔒 Data & Privacy

Bookshelf:
- Does not collect data
- Does not send data externally
- Stores everything locally

---

## Upcoming Features

Planned improvements:
- Drag to reorder sections
- Project search
- Import / export configuration
- Sync across devices
- Color tags
- Section collapse state persistence

---

## Development

To run locally:

```bash
npm install
npm run watch