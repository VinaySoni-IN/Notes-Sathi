# 🔥 Notes Sathi — Firebase Setup Guide (100% Free)

**What this enables:** student accounts (name + email + password + phone),
your manual approval, ✅ auto read-ticks, ❤️ reactions, "who read" lists —
and later the student notes community.

**Cost: ₹0** — the Firebase **Spark plan** is free forever, no credit card.
Free limits (way beyond a college): unlimited auth users, 50K reads/day,
20K writes/day, 1 GB Firestore, 5 GB file storage.

**Time needed: ~10 minutes, one time.**

> 📘 **New:** once the console part is done, follow
> **`ACCOUNTS-GO-LIVE-GUIDE.md`** — it covers activation, your admin
> UID, testing, the daily approval routine, legal updates and rollback.

---

## Step 1 — Create the Firebase project

1. Go to **https://console.firebase.google.com** and sign in with your
   Google account (vinay.sanjaysoni@gmail.com).
2. Click **Create a project** (or "Add project").
3. Name it **`notes-sathi`**.
4. Google Analytics: **Disable it** (we collect nothing — keeps our privacy
   promise honest). Click **Continue** → **Create project**.

## Step 2 — Enable Email/Password login

1. Left menu → **Build → Authentication** → **Get started**.
2. In **Sign-in method**, click **Email/Password** → toggle **Enable** → **Save**.
   (Do NOT enable anything else.)

## Step 3 — Create the database

1. Left menu → **Build → Firestore Database** → **Create database**.
2. Location: choose **asia-south1 (Mumbai)** — closest to your students.
3. Start in **production mode** → **Enable**.
4. Tab **Rules** → delete everything → paste the full contents of
   **`firestore.rules`** from this folder → **Publish**.
   ⚠️ **Before publishing:** in the rules, replace `ADMIN_UID` with your UID —
   you get it from **Authentication → Users** after you create your own
   account first (see Step 6). So: publish once now, and update the UID
   again after Step 6.

## Step 4 — Storage: ❌ SKIP IT

Firebase Storage has required the **Blaze (credit-card) plan since
30 Oct 2024** — the free Spark plan can no longer create buckets.

**We don't need it.** Student notes run on **Plan A**: students submit
via WhatsApp, you publish via the Upload Dashboard naming the file
`Unit-1.Priya Sharma.pdf`, and the post automatically gets the golden
**✍️ By Priya Sharma** badge. Zero infrastructure, zero cost.

## Step 5 — Register the web app & copy the config

1. Firebase Console → **Project settings** (gear icon) → scroll to
   **Your apps** → click the **</>** (web) icon.
2. Nickname: **Notes Sathi Web** → **Register app** (no hosting checkbox).
3. It shows a config block like:

```js
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "notes-sathi.firebaseapp.com",
  projectId: "notes-sathi",
  storageBucket: "notes-sathi.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef..."
};
```

4. **Send me that whole block** (it is public-safe — the security rules are
   the real lock). I will paste it into `FB_CONFIG` in `index.html`, and the
   login system switches on for everyone in the next update.

## Step 6 — Create YOUR admin account

1. Open the app after I enable the config → **👤 icon → Create account**
   with your email + password + phone.
2. In Firebase Console → **Authentication → Users**: your account appears —
   copy the long **UID** next to it.
3. Put that UID into `ADMIN_UID` in **firestore.rules** → **Publish** again.
4. Now only you can approve students.

## Step 7 — Approving students (your daily 30-second job)

1. Firebase Console → **Firestore Database → users** — every signup appears
   as a document: `{ name, email, phone, status: "pending" }`.
2. To approve: open the student's document → edit `status` →
   change `pending` → `approved` → Save. Done — their reactions unlock
   instantly on their next open.
3. To reject/abuse: change status to `rejected` (or delete the document).

---

## How the pieces connect (for your understanding)

| Thing | Where it lives | Who can see it |
|---|---|---|
| Password | Firebase Auth (scrypt-hashed + salted by Google) | Nobody — not even you |
| Name, email, phone, status | Firestore `users/{uid}` | The student + you (admin) |
| Read ticks & hearts | Firestore `reactions/{uid}_{note}` | Signed-in students (public list) |
| Student note files (Phase 5) | Storage `student-notes/{uid}/…` | Everyone once approved |

**Approvals are enforced by the security rules server-side** — a pending
student physically cannot write a reaction, even if they tamper with the app
code. That's stronger than any client-side check.

## If something ever goes wrong

| Problem | Fix |
|---|---|
| Student forgot password | Authentication → Users → ⋮ → Reset password → email sent automatically |
| Fake/offensive name | Firestore → users → edit their `name` |
| Quota exhausted (very unlikely) | Reactions pause for the day; reading notes is unaffected |
| Want to switch it all off | I set `FB_CONFIG` back to `null` → app returns to guest-only mode |

---

*Legal note: when we activate accounts, the Privacy Policy v2 update ships in
the same release (email + phone + reactions collection, DPDP consent,
deletion on request via vinay.sanjaysoni@gmail.com).*
