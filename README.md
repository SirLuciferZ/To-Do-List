# To-Do List

A feature-rich, interactive to-do list application that helps you organize your tasks efficiently. This project includes task creation, editing, deletion, categorization, search, and progress tracking, wrapped in a clean, responsive, and accessible UI.

---

## Table of contents

- [Features](#features)
- [Technologies used](#technologies-used)
- [Getting started](#getting-started)
  - [Installation](#installation)
  - [Usage](#usage)
- [File structure](#file-structure)
- [How it works](#how-it-works)
  - [Dark mode](#dark-mode)
  - [Task management](#task-management)
  - [Lists and tags](#lists-and-tags)
  - [Progress tracking](#progress-tracking)
- [Data persistence](#data-persistence)
- [Accessibility](#accessibility)
- [Keyboard shortcuts](#keyboard-shortcuts)
- [Performance](#performance)
- [Future enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Dark mode:** Toggle between light and dark themes; the choice is saved and restored automatically.
- **Task management:** Add, edit, delete, complete, prioritize, and set due dates for tasks.
- **Lists and tags:** Group tasks into custom lists and add tags for flexible categorization.
- **Progress tracking:** See today’s progress with a dynamic progress bar and task counters.
- **Search:** Instantly filter tasks by title, description, list, or tag via the search bar.
- **Responsive design:** Works smoothly on mobile, tablet, and desktop screens.
- **Local persistence:** Tasks, lists, tags, and preferences are stored in LocalStorage.
- **Keyboard shortcuts:** Quick actions for power users (e.g., add task, toggle theme).

---

## Technologies used

- **HTML5:** Semantic structure and accessible markup.
- **CSS3:** Modern layout with Flexbox/Grid, custom properties, and responsive design.
- **JavaScript ES6:** Modular, event-driven logic for dynamic UI updates.
- **LocalStorage:** Client-side persistence without a backend.

---

## Getting started

### Installation

1. **Clone:**

   ```bash
   git clone https://github.com/your-username/To-Do-List.git
   cd To-Do-List
   ```

2. **Open locally:**
   - **Option A:** Open `index.html` directly in your browser.
   - **Option B (recommended):** Use a local server (e.g., VS Code Live Server) for better routing and caching behavior.
3. **No build step:**
   - **Reason:** Pure HTML/CSS/JS app; no dependencies or bundlers required.

### Usage

1. **Launch:** Open `index.html` in your browser.
2. **Create a list:** Click “New List”, name it, and save.
3. **Add a task:** Click “New Task”, enter title, optional description, due date, priority, list, and tags, then save.
4. **Manage tasks:** Use checkboxes to complete, click a task to edit, and the trash icon to delete.
5. **Filter and search:** Use the search bar and list/tag filters to narrow results.
6. **Toggle theme:** Click the theme switch to toggle dark/light; your choice is remembered.

> Tip: Add the app to your home screen on mobile to launch it like a native app.

---

## File structure

```bash
To-Do-List/
├─ index.html
├─ css/
│  ├─ styles.css
│  └─ themes.css
├─ js/
│  ├─ app.js
│  ├─ storage.js
│  ├─ ui.js
│  └─ utils.js
├─ assets/
│  ├─ icons/
│  └─ screenshots/
└─ README.md
```

- **index.html:** App container, layout structure, and root elements.
- **css/styles.css:** Base styles, layout, components, and responsive rules.
- **css/themes.css:** Theme variables and dark/light mode rules.
- **js/app.js:** App entry point, state management, and event wiring.
- **js/storage.js:** LocalStorage read/write, schema versioning, and migrations.
- **js/ui.js:** Rendering functions and UI update helpers.
- **js/utils.js:** Helpers (formatting, validation, date utilities).

---

## How it works

### Dark mode

- **Theme variables:** Uses CSS custom properties to define colors and spacing.
- **Persistence:** Saves the selected theme in LocalStorage and applies on load.
- **System preference:** Optionally detects `prefers-color-scheme` as a sensible default.

### Task management

- **Task model:**

  ```json
  {
    "id": "uuid",
    "title": "Buy milk",
    "description": "2% organic",
    "dueDate": "2025-09-01",
    "priority": "low | medium | high",
    "completed": false,
    "listId": "groceries",
    "tags": ["errands", "quick"],
    "createdAt": 1693526400000,
    "updatedAt": 1693527400000
  }
  ```

- **Interactions:** Add, edit in-place, complete via checkboxes, delete with confirmation.
- **Validation:** Prevents empty titles, trims whitespace, and normalizes tags.
- **Sorting:** Optional by due date, priority, or creation time.

### Lists and tags

- **Lists:** User-defined groups (e.g., Work, Personal) referenced by `listId`.
- **Tags:** Freeform labels for cross-cutting categorization (e.g., “urgent”, “home”).
- **Filtering:** Combine list and tag filters with search to narrow tasks quickly.

### Progress tracking

- **Today scope:** Counts tasks due today and completed today.
- **Computation:** Progress = completed / total in the current scope.
- **UI feedback:** Dynamic progress bar, counts, and optional streak indicator.

---

## Data persistence

- **Storage keys:**
  - `todo.tasks` → Array of task objects
  - `todo.lists` → Array of list objects `{ id, name, color }`
  - `todo.prefs` → Settings `{ theme, sortBy, lastActiveList }`
- **Versioning:** A `todo.version` key enables schema upgrades without data loss.
- **Backups:** Export/import JSON to move data between browsers or machines.

---

## Accessibility

- **Semantics:** Proper landmarks, labels, and roles for assistive technologies.
- **Keyboard:** Full navigation and actions via Tab, Enter, Space, and shortcuts.
- **Contrast:** Meets WCAG contrast guidelines in both light and dark themes.
- **Focus management:** Visible focus rings and logical focus order during updates.

---

## Keyboard shortcuts

- **Add task:** Press `A`
- **Toggle theme:** Press `T`
- **Search focus:** Press `/`
- **Complete selected:** Press `C`
- **Delete selected:** Press `Del` or `Backspace`

---

## Performance

- **Rendering:** Minimal DOM reflows with batched UI updates.
- **Lists:** Virtualized rendering optional for very large task sets.
- **Storage:** Debounced writes to LocalStorage to avoid excessive I/O.

---

## Future enhancements

- **Reminders:** Optional notifications for upcoming due dates.
- **Recurring tasks:** Daily, weekly, monthly repeat rules.
- **Subtasks:** Nested checklists within a parent task.
- **Attachments:** Link files or URLs to tasks.
- **Sync:** Optional cloud sync and multi-device support.
- **Share:** Collaborate on shared lists with permission controls.
- **i18n:** Multi-language support with locale-aware dates.

---

## Contributing

1. **Fork:** Click “Fork” on GitHub to create your copy.
2. **Clone:**

   ```bash
   git clone https://github.com/your-username/To-Do-List.git
   cd To-Do-List
   ```

3. **Branch:**

   ```bash
   git checkout -b feat/short-descriptive-name
   ```

4. **Commit:**

   ```bash
   git commit -m "feat: add X (short, imperative)"
   ```

5. **Test:** Ensure no regressions and validate accessibility and responsiveness.
6. **Push:**

   ```bash
   git push origin feat/short-descriptive-name
   ```

7. **Pull request:** Open a PR with a clear description, screenshots, and rationale.

> Guidelines: Keep code modular, follow semantic HTML, use accessible components, and prefer small, focused PRs.

---

## License

- **Type:** MIT License
- **Permissions:** Commercial use, modification, distribution, private use
- **Conditions:** Include copyright and license notice
- **Limitation:** Provided “as is” without warranty

```bash
MIT License

Copyright (c) 2025 Your Name

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
