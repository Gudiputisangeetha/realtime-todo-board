# 🔍 Custom Logic Explanation

## 1. 🧠 Smart Assign Logic

When a task is created without an assigned user, we provide a "Smart Assign" feature. This logic checks:

- All users and their count of **incomplete tasks** (`status !== 'Done'`)
- Assigns the task to the user with the **fewest active tasks**

### ✅ Trigger:
- Called from frontend by clicking **Smart Assign** button

---

## 2. ⚠️ Conflict Detection

- When a user updates a task, the backend compares:
  - Client's `updatedAt` timestamp
  - Server's latest `updatedAt` timestamp
- If mismatch → **409 Conflict** is returned with both versions of the task

---

## 3. 🔁 Real-time Task Sync (Socket.IO)

- On task create/update/delete → emit events
- Frontend listens to these events and updates the board immediately
- Channel: `tasks_updated`

---

## 4. ✅ Validation

- **Title must be unique**
- Titles cannot be:
  - `"Todo"`, `"In Progress"`, or `"Done"`

---

## ✅ Endpoints Reference

- `POST /api/tasks`
- `PUT /api/tasks/:id` (with conflict check)
- `GET /api/logs` (Activity)
- `PUT /api/tasks/:id/smart-assign` (Smart Assign)
