# 🚀 Notes Sathi — Accounts Go-Live Guide ("set up the rest")

Everything you need to switch on student accounts, approvals, ✅ read-ticks
and ❤️ reactions — from console to launch day. The app already contains all
the code (v3.x); it stays **invisible until you activate it**.

**Companion docs:** `firebase-setup-guide.md` (console basics) ·
`firestore.rules` (paste into console) · this file (the rest).

---

## Part A — What you're switching on (recap)

| Feature | Needs Firebase? | Needs card? |
|---|---|---|
| 🔐 Sign up / sign in (email + password) | ✅ Auth | ❌ |
| 📱 Phone number stored (required field, no OTP) | ✅ Firestore | ❌ |
| ⏳ Your manual approval (pending → approved) | ✅ Firestore | ❌ |
| ✅ Auto read-ticks + ❤️ reactions + "who read" | ✅ Firestore | ❌ |
| 📤 Student note files | ❌ **Plan A:** WhatsApp → you publish with `Unit-1.Priya Sharma.pdf` → golden ✍️ By badge | ❌ |

**Total cost: ₹0/month. No credit card anywhere.**

---

## Part B — Console setup (~10 minutes, one time)

*(Same as firebase-setup-guide.md — shortened here.)*

1. **console.firebase.google.com** → Create project `notes-sathi`
   → **disable Google Analytics**.
2. **Build → Authentication → Get started → Email/Password → Enable.**
   ⚠️ **Then: Authentication → Settings (gear) → Authorized domains →
   Add domain → `vinaysoni-in.github.io`** — without this, sign-in on the
   live site fails with "auth/unauthorized-domain". (localhost and the
   firebase.app domain are already allowed; add the Pages domain manually.)
3. **Build → Firestore Database → Create database**
   → region **asia-south1 (Mumbai)** → **production mode**.
4. **Firestore → Rules tab** → delete all → paste the full contents of
   `firestore.rules` → **Publish**.
   *(You'll re-paste once more in Part D after you know your ADMIN_UID.)*
5. ❌ **SKIP Storage entirely** — it now requires a credit card. We don't
   use it (Plan A above).
6. **Project settings (⚙️) → Your apps → `</>` web** → register
   "Notes Sathi Web" → copy the `firebaseConfig { ... }` block shown.

## Part C — Activate it in the app

1. Send me the `firebaseConfig` block (it's public-safe — the rules are the
   real lock), or edit `notes-sathi/index.html` yourself: find

   ```js
   var FB_CONFIG = null;   // <-- paste the Firebase config object here
   ```

   and replace `null` with the config object:

   ```js
   var FB_CONFIG = {
     apiKey: "AIzaSy...",
     authDomain: "notes-sathi.firebaseapp.com",
     projectId: "notes-sathi",
     messagingSenderId: "1234567890",
     appId: "1:1234:web:abcd..."
   };
   ```

   *(No `storageBucket` needed — we don't use Storage.)*
2. That single change switches on: the 👤 account button, sign-up/sign-in
   sheets, reaction rows, read ticks, "who read" sheets.
3. **Readers who don't sign in lose nothing** — reading stays 100% free
   and login-free.

## Part D — Make yourself the admin

1. Open the app (after C) → 👤 → **Create account** — use YOUR email,
   password, phone.
2. Firebase Console → **Authentication → Users** → find your row →
   copy the long **UID** (e.g. `kX8sL2...`).
3. Open **Firestore → Rules** → replace the one `"ADMIN_UID"` in the
   rules with your real UID (keep the quotes) → **Publish**.
4. In **Firestore → users → [your uid]**: edit `status` from `pending`
   to `approved` **and add a field** `role` = `admin` (type: string) → Save.
   You're now the admin with full reaction access — and your profile shows
   the **⏳ Pending approvals** button (approve students from your phone!).

## Part E — Test before announcing (10 minutes)

Do this quietly with a friend's or a second email account:

- [ ] Sign-up with missing phone → blocked with a toast
- [ ] Password under 8 characters → blocked
- [ ] Valid sign-up → "⏳ Account sent for approval" toast; reading works
- [ ] Pending account taps ✅ Read / ❤️ → "pending approval" toast (blocked)
- [ ] You approve the test account in console (users → status → approved)
- [ ] Test account re-opens app → ✅ Read works, ❤️ toggles, card lights up
- [ ] Open a PDF → auto-ticks as read, stays ticked after closing
- [ ] "who…" link → names + two-letter DPs list appears
- [ ] Sign out → guest mode → reactions prompt sign-in
- [ ] Back button closes the account/who sheets properly

## Part F — Your daily admin routine (≈30 seconds)

| Task | Where | How |
|---|---|---|
| **Approve a student** | **In the app (easiest)** | 👤 → **⏳ Pending approvals** → every student's **name, phone & e-mail** is listed → **✅ Approve** (or ❌ reject — tap twice) |
| Approve (console) | Console → Firestore → `users` | click a doc to see name/phone → `status`: `pending` → `approved` (tip: the **Table** tab lets you add name/phone/status as columns) |
| Reject / remove | same place | set `rejected`, or delete the doc |
| Rename an offensive name | `users` doc | edit `name` (their two-letter DP updates everywhere) |
| Password reset | Authentication → Users → ⋮ | **Reset password** → Firebase emails them automatically |
| See activity | Firestore → `reactions` | every read/love record with name + time |

**Suggested rhythm:** check `users` once a day (or announce that approvals
happen every evening). Pending students can still read — nothing is blocked
for them except reacting.

## Part G — Student notes (Plan A — already live in v3.1)

No console work needed. The flow:

1. Student sends you the PDF on WhatsApp
   (**+91 89890 31351** — the Need-help card already links there).
2. You upload it via the **Upload Dashboard** as usual, naming the file
   `Unit-1.Priya Sharma.pdf` (Hindi pair: `Unit-1.Priya Sharma.hi.pdf`).
3. The post automatically shows the golden **✍️ By Priya Sharma** badge —
   on the card, in search, and in the PDF viewer.

## Part H — Legal (must ship in the SAME release as activation)

The current legal pack says "no accounts, no data collection" — activation
changes that, so these update together:

- [ ] `legal/02-PRIVACY-POLICY.txt` → v2: we now store name, email, phone,
      reactions; purpose; deletion on request via
      **vinay.sanjaysoni@gmail.com**; Firebase/Google as processor.
- [ ] `legal/01-TERMS-AND-CONDITIONS.txt` → account clauses (accuracy of
      name/phone, no impersonation, admin may remove).
- [ ] First-open acknowledgment text → mention accounts (re-accept bump:
      `ns_ack_v2` → `ns_ack_v3`).
- ✅ **All three are drafted and included in v3.2** (Privacy v2.0,
  Terms v1.3 with Clause 4A, first-open disclosure + re-acceptance
  `ns_ack_v3`) — review them, then say "push it".

## Part I — Limits, costs & rollback

| Thing | Number |
|---|---|
| Firestore free reads | 50,000/day (≈ a small city of students) |
| Firestore free writes | 20,000/day (one write per read-tick/love, ever) |
| Firestore storage | 1 GB (text — years of reactions) |
| Auth users | unlimited, free |
| If quota ever exceeded | reactions pause for the day; **reading notes never affected** |

**Switch it all off anytime:** set `FB_CONFIG` back to `null` → the app
returns to today's exact guest-only behaviour. Data stays safely in
Firestore (exportable) until you delete the project.

---

*Print this file or keep it on your phone — it's the whole manual.*
