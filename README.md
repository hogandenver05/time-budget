
# Time Budget – Plan Your Week Like a Budget

Time Budget is a visual weekly planning tool that helps you treat time like money. Each day has 24 hours, and you intentionally allocate those hours to activities with different levels of importance. The app’s core goal is to help you see how your week is balanced between what you **need** to do and what you **want** to do, revealing space you didn’t know you had.

---

## 🌗 Concept Overview

Time Budget turns your week into seven 24‑hour pie charts.  
Each pie represents a day, and each slice represents a planned activity such as:

- Sleep  
- Work or School  
- Meals  
- Exercise  
- Community  
- Hobbies (for example Guitar)  
- Relationships  
- Custom categories  

You assign each activity a **priority**:

- **Need** – non‑negotiable time you intend to protect  
- **Want** – flexible time you want to make space for  

Everything else automatically appears as **Free Time**.

You build your ideal week through a simple guided flow:

1. **What**  
   Pick a category or create your own. Optionally add a label like “Guitar”.
2. **Importance**  
   Choose: Is this a Need or a Want?
3. **When**  
   Select days of the week using S M T W T F S chips.
4. **How Long**  
   Specify time per day (duration or start/end times).

The result is a visual distribution of your week that highlights:
- How much time is going to needs versus wants  
- Where your unallocated pockets of time are  
- Whether your week aligns with your values and priorities  

---

## 🏗️ Tech Stack

- **Vite + Rolldown** (React + TypeScript)  
- **Firebase Authentication**  
- **Firestore (Spark Plan)**  
- **Tailwind CSS**  
- **Recharts** (for the pie charts)  

---

## 📁 Project Structure (planned)

```
/src
  /components
    PieChartDay.tsx
    AddEntryWizard/
  /pages
    WeeklyView.tsx
    Auth.tsx
  /firebase
    config.ts
    firestore.ts
  /types
    plan.ts
    category.ts
  /utils
    time.ts
    aggregation.ts

public/
vite.config.ts
tailwind.config.js
README.md
```

---

## 🔒 Firestore Data Model

**Users**  
`users/{userId}`  
- displayName  
- email  
- createdAt  

**Categories**  
`users/{userId}/categories/{categoryId}`  
- name  
- color  
- builtIn  
- archived  

**Plan Entries**  
`users/{userId}/activities/{entryId}`  
- categoryId  
- label  
- priority ("need" | "want")  
- daysOfWeek: number[]  
- minutesPerDay  
- startTimeLocal (optional)  
- endTimeLocal (optional)  
- createdAt  

---

## 🚀 Features (Two‑Week MVP)

### Week 1
- Authentication  
- Seeding default categories  
- Displaying seven daily pie charts  
- Aggregating plan entries into daily pies  

### Week 2
- Multi‑step “Add Activity” wizard  
- Create custom categories  
- Edit/delete plan entries  
- Simple weekly summary  

---

## 📦 Installation

```sh
npm install
npm run dev
```

Make sure you create a Firebase project and add your web config inside `/src/firebase/config.ts`.

---

## 🧪 Development Notes

- Use the “Add Activity” button on the Weekly View to start creating your plan.
- All pies update live as entries are added, edited, or removed.
- Schedule‑style daily timelines will be added later but rely on the same data.
