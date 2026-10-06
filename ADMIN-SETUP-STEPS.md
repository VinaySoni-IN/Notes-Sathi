# 🛠️ Notes Sathi — One-Time Admin Setup (click-by-click)

Console: **console.firebase.google.com** → project **notes-sathi-ae2e5**
Use a PC browser if possible. Total time: ~6 minutes. Do the steps IN ORDER.

---

## Step 1 — Paste the rules (~1 min)

1. Left menu → **Build → Firestore Database**
2. Top tabs → **Rules**
3. Delete all the old text in the editor
4. Open `https://vinaysoni-in.github.io/Notes-Sathi/firestore.rules` in a
   new tab → copy the ENTIRE file
5. Paste it into the editor → **Publish**
   ✅ Correct for now if it still contains `"ADMIN_UID"` — fixed in Step 5.

## Step 2 — Authorize the website (~30 sec)

1. Left menu → **Build → Authentication**
2. Top tabs → **Settings** (⚙️)
3. Scroll to **Authorized domains** → **Add domain**
4. Type exactly: `vinaysoni-in.github.io` → **Add**

⚠️ Without this, sign-in on the live site fails with
"auth/unauthorized-domain".

## Step 3 — Create YOUR account (~1 min)

1. Open the app: `https://vinaysoni-in.github.io/Notes-Sathi/`
2. Tap the **Login** pill (top) → **Create account** tab
3. Your name, email, phone, password (8+) → tick consent → submit
4. You'll see **⏳ Pending approval** — correct, keep going.

## Step 4 — Copy your UID (~30 sec)

1. Console → **Authentication → Users** tab
2. Your email row → copy the long **UID** (like `kX8sL2pQr9xYz...`)
   — click it to copy, don't type it.

## Step 5 — Make yourself admin (~2 min)

1. **Firestore Database → Rules** tab
2. Find (near the bottom):
   `return request.auth != null && request.auth.uid == "ADMIN_UID";`
3. Replace only `ADMIN_UID` with your UID (KEEP the quotes):
   `return request.auth != null && request.auth.uid == "kX8sL2...";`
4. **Publish**
5. **Firestore Database → Data** tab → **users** → click your document:
   - `status` → change `pending` → `approved` → Save
   - **Add field**: name `role` · type **string** · value `admin` → Save

## Step 6 — Verify ✅

Close the app fully → reopen → **Login** → your profile shows:
- ✅ **Approved** chip
- **⏳ Pending approvals** button → every student's **name, ☎ phone, ✉ email**
  → tap ✅ Approve (❌ needs two taps)

---

## Optional — Enable "Continue with Google" (~1 min)

Students can also sign in with their Google account (works alongside
email + password; free on the Spark plan):

1. Console → **Build → Authentication** → **Sign-in method** tab
2. Click **Google** → toggle **Enable** → pick your e-mail as the
   support e-mail → **Save**

That's it — the app already contains the button. First-time Google
users are asked for their name + phone ("Finish your account") before
they appear in your pending list.

## If something looks different

- No **Build** menu? → You may be in a different project — check the
  project name top-left.
- **Publish** disabled/grey? → Rules have a syntax error — re-copy the
  whole file from the link in Step 1.
- Sign-in says *unauthorized-domain*? → Step 2 wasn't saved — recheck the
  domain spelling.
- No ⏳ button after Step 5? → Hard-close and reopen the app (swipe away),
  and confirm `role` = `admin` (string, exactly lowercase) on your doc.

Stuck? Screenshot the console and send it — I'll tell you exactly what to
click next.
