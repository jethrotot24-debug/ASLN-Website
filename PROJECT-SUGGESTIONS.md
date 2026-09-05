# ASLN Project Roadmap & Suggestions

Your vision for ASLN is strong. Here are focused recommendations to grow from website → full app.

---

## What Makes ASLN Unique

1. **Identity-first dating** — NIN/National ID verification sets you apart from apps with fake profiles
2. **African-focused community** — Not a global clone; built for African values, cities, and culture
3. **Moments Gallery** — Share life beyond profile photos (like Instagram meets dating)
4. **Premium trust signals** — Verified badges, compatibility scores, spotlight features

---

## Phase 1 — Website (Current)

✅ Swipe Discover with animations  
✅ Moments Gallery  
✅ Secure Messaging UI  
✅ Multi-step signup with ID verification  
✅ Mobile bottom navigation  
✅ Responsive for phones, tablets, landscape  

**Next small steps:**
- Add your own photos to `images/` folder
- Test signup flow end-to-end
- Share the folder or zip with testers for feedback

---

## Phase 2 — Backend (Required for Real App)

The website currently uses **browser localStorage**. For a real product you need:

| Feature | Technology Suggestion |
|---------|----------------------|
| User accounts | Firebase Auth, Supabase, or Node.js + PostgreSQL |
| ID verification | Manual review panel OR API (Smile Identity, Onfido for Africa) |
| Real-time chat | Firebase Firestore, Socket.io, or Supabase Realtime |
| Image storage | AWS S3, Cloudinary, or Firebase Storage |
| Push notifications | Firebase Cloud Messaging (FCM) |

**Recommended stack for your app:**
- **Frontend:** React Native (iOS + Android from one codebase) OR Flutter
- **Backend:** Supabase (fastest to launch) or Node.js + Express + MongoDB
- **Hosting:** Vercel (web) + Railway/Render (API)

---

## Phase 3 — Mobile App

Your website structure maps directly to app screens:

| Website Page | App Screen |
|-------------|------------|
| index.html | Home / Feed |
| discover.html | Swipe Stack |
| gallery.html | Moments Tab |
| messages.html | Chat Inbox |
| profile.html | Profile Tab |
| signup.html | Onboarding Flow |

**App-specific features to add:**
- Push notifications for matches and messages
- Biometric login (fingerprint/face)
- Location-based discovery (with user permission)
- In-app video calls (Agora, Twilio)
- Offline mode for viewing cached profiles

---

## ID Verification — Important Notes

- **Never store raw ID numbers in plain text** — hash or encrypt them
- **Compliance:** Follow Uganda Data Protection Act, Kenya DPA 2019, Nigeria NDPA
- **Process:** User uploads ID → admin reviews → verified badge issued
- **Alternative:** Partner with Smile Identity (covers Uganda, Kenya, Nigeria, SA)

Supported ID formats currently validated:
- Uganda NIN: 2 letters + 12 digits
- Kenya: 7-8 digit national ID
- Nigeria: 11-digit NIN
- Others: generic alphanumeric 8-20 chars

---

## Monetization Ideas (Future)

1. **Premium membership** — See who liked you, unlimited swipes
2. **Boost profile** — Featured in Spotlight section
3. **Gift sending** — Virtual gifts in chat (already UI-ready)
4. **Verified fast-track** — Priority ID review

---

## Security Checklist Before Launch

- [ ] HTTPS on all pages
- [ ] Encrypt passwords (bcrypt, never plain text)
- [ ] Rate-limit login attempts
- [ ] Report/block user feature
- [ ] Content moderation for Moments gallery
- [ ] Age verification (18+ only)
- [ ] Privacy policy and terms of service

---

## Folder Structure

```
ASLN-Website/
├── index.html          Home
├── discover.html       Swipe discover (interactive)
├── discover-grid.html  Grid browse view
├── gallery.html        Moments gallery
├── messages.html       Secure messaging
├── signup.html         4-step signup + ID verification
├── profile.html        User profile
├── public-profile.html View other members
├── css/style.css       All styles
├── js/
│   ├── app.js          Core data & utilities
│   ├── discover.js     Swipe animations
│   ├── gallery.js      Moments gallery
│   ├── messages.js     Chat functionality
│   ├── signup.js       Multi-step signup
│   └── script.js       Legacy helpers
└── images/             Your profile photos
```

---

## How to Open

Double-click **index.html** or run a local server:

```
cd ASLN-Website
python -m http.server 8080
```

Then open `http://localhost:8080` in your browser.

---

© 2026 ASLN — Built with ambition for Africa.
