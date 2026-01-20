# MOBILE APP STRATEGY - CAPACITOR DEPLOYMENT

**Created:** 2025-12-31  
**Purpose:** Mobile-first development + app store deployment strategy  
**Status:** Critical reference for all development

---

## 🎯 CORE PRINCIPLES

### Mobile-First Development

**Priority Order:**
1. **Mobile (375px - 428px)** — Design for iPhone SE to iPhone Pro Max
2. **Tablet (768px - 1024px)** — iPad, Android tablets
3. **Desktop (1024px+)** — Laptops, monitors

**Why Mobile-First:**
- **80%+ of users** will access from phones (post-incarceration users often don't have computers)
- Phone is most accessible device
- App store presence increases credibility
- Push notifications for engagement

---

## 📱 DEPLOYMENT STRATEGY

### Multi-Platform Approach

**1. Progressive Web App (PWA) - Desktop/Web**
- Accessible via browser at `felonentrepreneur.com`
- Installable on desktop (Add to Home Screen)
- Service worker for offline capability
- Optimized for laptop/tablet use

**2. Native Mobile Apps (iOS + Android) via Capacitor**
- Submitted to Apple App Store + Google Play Store
- Downloaded as true native apps
- Access to native device features (camera, notifications, biometrics)
- Feels like a native app (no browser chrome)

**3. Downloadable APK (Android) - Pre-Approval**
- Direct download from website while waiting for Play Store approval
- Sideload installation
- Same functionality as Play Store version

---

## 🛠️ CAPACITOR IMPLEMENTATION

### What is Capacitor?

**Capacitor** (by Ionic) wraps your Next.js web app into native iOS/Android apps.

**How it works:**
1. Build Next.js app (`npm run build && npm run export`)
2. Copy build to Capacitor (`npx cap sync`)
3. Capacitor wraps in native shell
4. Opens native project in Xcode (iOS) or Android Studio
5. Build native app for app stores

**Benefits:**
- ✅ One codebase → Web + iOS + Android
- ✅ Access native APIs (camera, push notifications, Face ID)
- ✅ No React Native rewrite needed
- ✅ App store compliant
- ✅ Offline support

---

## 🏗️ TECHNICAL REQUIREMENTS

### Next.js Configuration

**Must use Static Export** for Capacitor compatibility:

```javascript
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // CRITICAL for Capacitor
  images: {
    unoptimized: true, // Required for static export
  },
  trailingSlash: true, // Helps with routing
};

export default nextConfig;
```

**Implications:**
- No Server Components (use Client Components)
- API routes must move to external server or use Supabase Edge Functions
- Image optimization handled by Capacitor/native

**Solution:**
- Keep Supabase for backend (works with static export)
- Use Supabase Edge Functions for server-side logic
- Client-side authentication (Supabase Auth works great)

---

### Mobile-First UI/UX Rules

**1. Touch Targets**
- Minimum 44x44px (Apple's guideline)
- Prefer 48x48px or larger
- Adequate spacing between tappable elements (min 8px)

**2. Safe Areas**
- Respect device notches (iPhone X+)
- Use `env(safe-area-inset-*)` CSS variables
- Bottom nav must avoid home indicator area

**3. Responsive Breakpoints**
```css
/* Mobile-first approach */
.component {
  /* Base styles: Mobile (default) */
  padding: 1rem;
  
  /* Tablet */
  @media (min-width: 768px) {
    padding: 2rem;
  }
  
  /* Desktop */
  @media (min-width: 1024px) {
    padding: 3rem;
  }
}
```

**4. Navigation**
- Mobile: Bottom nav (thumb-friendly)
- Desktop/Tablet: Top nav or sidebar
- Use `@capacitor/status-bar` to control status bar color

**5. Forms**
- Large input fields (min 44px height)
- Clear labels above inputs
- Native keyboard types (`type="email"`, `type="tel"`, etc.)
- Use `<select>` for dropdowns (native pickers on mobile)

**6. Performance**
- Lazy load images
- Code splitting (Next.js automatic)
- Minimize bundle size
- Optimize for 3G/4G networks

---

## 📦 CAPACITOR PLUGINS NEEDED

### Essential Plugins

**1. @capacitor/app**
- App lifecycle events
- Deep linking
- Background state

**2. @capacitor/status-bar**
- Control status bar color/style
- Hide/show status bar

**3. @capacitor/splash-screen**
- Native splash screen
- Loading indicator

**4. @capacitor/keyboard**
- Keyboard events
- Show/hide keyboard
- Keyboard height detection

**5. @capacitor/haptics**
- Vibration feedback
- Touch feedback

**6. @capacitor/push-notifications**
- Push notifications (future)
- Essential for engagement

**7. @capacitor/share**
- Native share sheet
- Share resources, success stories

**8. @capacitor/camera** (future)
- Profile photos
- Story uploads

**9. @capacitor/browser**
- Open external links in in-app browser
- Keeps user in app when visiting resources

---

## 🚀 DEPLOYMENT WORKFLOW

### Development

```bash
# 1. Develop as normal Next.js app
npm run dev

# 2. Test mobile UI at various breakpoints
# Use Chrome DevTools device emulation

# 3. Build for production
npm run build
npm run export  # Generates static site in /out

# 4. Initialize Capacitor (one-time)
npm install @capacitor/core @capacitor/cli
npx cap init

# 5. Add platforms
npx cap add ios
npx cap add android

# 6. Sync web build to native
npx cap sync

# 7. Open native project
npx cap open ios      # Opens Xcode
npx cap open android  # Opens Android Studio

# 8. Build native apps
# iOS: Xcode → Product → Archive → Submit to App Store
# Android: Android Studio → Build → Generate Signed Bundle

# 9. Submit to app stores
# Follow Apple/Google submission guidelines
```

---

### Pre-Approval: Direct Download (Android)

**While waiting for Play Store approval:**

1. Build signed APK in Android Studio
2. Host on website: `felonentrepreneur.com/download/app-release.apk`
3. Add download page with instructions:
   - Enable "Install from Unknown Sources"
   - Download APK
   - Install
   - Open app

**Warning banner:**
```
⚠️ This is a pre-release version while we await 
Google Play approval. Official app coming soon!
```

---

## 🎨 MOBILE UI/UX PATTERNS

### Bottom Navigation (Mobile)

```jsx
// components/nav/mobile-bottom-nav.tsx
import { Home, Briefcase, Users, User } from 'lucide-react';

export function MobileBottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom md:hidden">
      {/* safe-area-bottom respects iPhone home indicator */}
      <div className="flex justify-around items-center h-16">
        <NavItem icon={<Home />} label="Home" href="/app/home" />
        <NavItem icon={<Briefcase />} label="Jobs" href="/app/jobs" />
        <NavItem icon={<Users />} label="Community" href="/app/community" />
        <NavItem icon={<User />} label="Profile" href="/app/profile" />
      </div>
    </nav>
  );
}
```

**Safe area CSS:**
```css
.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}

.safe-area-top {
  padding-top: env(safe-area-inset-top);
}
```

---

### Pull-to-Refresh (Mobile)

```jsx
// Use @capacitor/pull-to-refresh plugin
import { useEffect } from 'react';
import { PullToRefresh } from '@capacitor/pull-to-refresh';

export function JobsList() {
  useEffect(() => {
    PullToRefresh.addListener('refresh', async () => {
      // Refresh data
      await fetchJobs();
      PullToRefresh.complete();
    });
  }, []);
  
  return <div>...</div>;
}
```

---

### Native-Style Cards (Mobile)

```jsx
// Mobile-optimized card with tap feedback
<div className="
  bg-white 
  rounded-lg 
  shadow-sm 
  p-4 
  active:bg-gray-50 
  transition-colors
  min-h-[44px]
  cursor-pointer
">
  <h3 className="text-lg font-semibold">Job Title</h3>
  <p className="text-sm text-gray-600">Company Name</p>
</div>
```

---

## 📱 APP STORE REQUIREMENTS

### Apple App Store

**Requirements:**
- Privacy Policy (required)
- Terms of Service
- Support URL
- App icon (multiple sizes: 1024x1024, 180x180, etc.)
- Screenshots (5.5" and 6.5" displays)
- App description (4000 char limit)
- Keywords
- Age rating (17+ due to re-entry focus)

**Review Considerations:**
- No pornography/gambling
- Must function as described
- No crashes or bugs
- Respect user privacy
- Clear value proposition

**Felon Entrepreneur specifics:**
- Emphasize rehabilitation, job search, education
- Highlight community support, resource directory
- De-emphasize "felon" in app store listing (use "second chance," "re-entry," "rebuilding")

---

### Google Play Store

**Requirements:**
- Privacy Policy
- Content rating questionnaire
- App icon (512x512)
- Feature graphic (1024x500)
- Screenshots (phone, tablet)
- Short description (80 char)
- Full description (4000 char)
- Categorization (Business or Lifestyle)

**Review Considerations:**
- Similar to Apple
- Faster approval (usually 1-3 days vs Apple's 1-2 weeks)
- Can update more frequently

---

## 🔐 SECURITY FOR MOBILE

### Secure Storage

Use **@capacitor/preferences** for secure local storage:

```typescript
import { Preferences } from '@capacitor/preferences';

// Store auth token securely
await Preferences.set({
  key: 'auth_token',
  value: token,
});

// Retrieve
const { value } = await Preferences.get({ key: 'auth_token' });
```

**Never store:**
- Passwords
- Credit card numbers
- Sensitive personal data

**Use Supabase for:**
- All user data
- Auth tokens (refresh tokens server-side)

---

### Biometric Authentication (Future)

```typescript
import { BiometricAuth } from '@capacitor-community/biometric-auth';

// Check if available
const { isAvailable } = await BiometricAuth.checkBiometry();

// Authenticate
if (isAvailable) {
  const result = await BiometricAuth.authenticate({
    reason: 'Log in to Felon Entrepreneur',
    title: 'Biometric Authentication',
  });
  
  if (result.success) {
    // Proceed with login
  }
}
```

---

## ✅ DEVELOPMENT CHECKLIST

### Before Building Features

- [ ] Install Capacitor: `npm install @capacitor/core @capacitor/cli`
- [ ] Initialize: `npx cap init "Felon Entrepreneur" "com.felonentrepreneur.app"`
- [ ] Configure Next.js for static export (`output: 'export'`)
- [ ] Set up safe area CSS variables
- [ ] Create mobile-first component library

### Every Feature

- [ ] Mobile UI designed first (375px)
- [ ] Touch targets minimum 44px
- [ ] Works on iPhone SE (smallest common phone)
- [ ] Works on iPhone 14 Pro Max (largest common phone)
- [ ] Tablet layout (768px+)
- [ ] Desktop layout (1024px+)
- [ ] No horizontal scrolling on mobile
- [ ] Forms use native input types
- [ ] Loading states visible
- [ ] Error states user-friendly

### Before Launch

- [ ] Test on real iOS device
- [ ] Test on real Android device
- [ ] Performance optimized (< 3s load time on 4G)
- [ ] Offline mode functional (at least cached content)
- [ ] Push notification infrastructure ready
- [ ] Privacy policy published
- [ ] Terms of service published
- [ ] App icons created (all sizes)
- [ ] Screenshots taken (all required sizes)
- [ ] App store descriptions written

---

## 🎯 MOBILE-FIRST COMPONENT EXAMPLES

### Card (Tappable)

```jsx
<div className="
  bg-white 
  rounded-xl 
  p-4 
  shadow-sm 
  active:shadow-md 
  active:scale-[0.98]
  transition-all
  cursor-pointer
  min-h-[88px]
">
  {/* Content */}
</div>
```

### Button (Large, Thumb-Friendly)

```jsx
<button className="
  w-full 
  h-12 
  bg-blue-600 
  text-white 
  rounded-lg 
  font-semibold
  active:bg-blue-700
  disabled:bg-gray-300
  transition-colors
">
  Continue
</button>
```

### Input (Large, Clear)

```jsx
<input 
  type="email"
  className="
    w-full 
    h-12 
    px-4 
    border 
    border-gray-300 
    rounded-lg
    text-base
    focus:ring-2 
    focus:ring-blue-500
  "
  placeholder="Enter your email"
/>
```

---

## 🚀 RECOMMENDED TECH STACK

**Current (Perfect for Capacitor):**
- ✅ Next.js 14 (with static export)
- ✅ React
- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ Supabase (Auth + Database)

**Add for Mobile:**
- Capacitor core + plugins
- `@capacitor/ios`
- `@capacitor/android`
- `@capacitor/status-bar`
- `@capacitor/splash-screen`
- `@capacitor/keyboard`
- `@capacitor/haptics`

**Future:**
- `@capacitor/push-notifications` (engagement)
- `@capacitor/camera` (profile photos, stories)
- `@capacitor/share` (share resources, stories)

---

## 📊 SUCCESS METRICS

**Mobile Performance:**
- Load time < 3 seconds on 4G
- Lighthouse mobile score > 90
- No layout shift (CLS < 0.1)
- Touch targets all > 44px

**App Store:**
- Approval within 2 weeks (Apple)
- Approval within 3 days (Google)
- 4.5+ star rating
- < 1% crash rate

---

**Bottom Line:** You build once (Next.js), deploy everywhere (Web, iOS, Android). Capacitor makes this seamless. Mobile-first design ensures the best experience for your primary user base (phone users). App store presence builds credibility and discoverability.

**Ready to build!** 🚀
