# Voya — Frontend Redesign Build Instructions
> Feed this to Cursor to implement the redesigned UI in the Expo React Native app.

---

## 1. Design System

### Fonts
Install via `expo-font` or `@expo-google-fonts`:
```bash
npx expo install @expo-google-fonts/nunito @expo-google-fonts/fredoka-one expo-font
```

```ts
// fonts used
'Fredoka One'  → headings, screen titles, numbers
'Nunito'       → all body text, labels, buttons (weights: 600, 700, 800)
```

### Color Palette
```ts
export const Colors = {
  coral:    '#FF6B6B',   // primary CTA, active states
  coralDark:'#FF8E53',   // gradient pair for coral
  teal:     '#4ECDC4',   // secondary, teal cards
  tealDark: '#45B7AA',
  sun:      '#FFD93D',   // sunny yellow
  sunDark:  '#FFB830',
  mint:     '#6BCB77',   // success, active badge
  sky:      '#74C0FC',   // sky blue
  lavender: '#C77DFF',   // purple accent
  bg:       '#FFFBF7',   // main background (warm white)
  surface:  '#FFFFFF',   // cards, sheets
  text:     '#1A1A2E',   // primary text
  muted:    '#9BA5B7',   // secondary text, placeholders
  border:   '#F0EDE8',   // dividers, card borders
};
```

### Spacing & Radii
```ts
export const Radii = {
  sm:  12,
  md:  18,
  lg:  22,
  xl:  24,
  pill: 999,
};

export const Spacing = {
  xs:  6,
  sm:  10,
  md:  16,
  lg:  22,
  xl:  32,
};
```

### Shadows (React Native)
```ts
export const Shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  coral: {
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
  },
};
```

---

## 2. Navigation Structure

Uses **Expo Router** (already in the project). Restructure tabs:

```
app/
  (auth)/
    index.tsx       ← onboarding splash + carousel
    login.tsx
  (tabs)/
    _layout.tsx     ← custom tab bar (see §5)
    index.tsx       ← Home Feed
    collections.tsx ← Collections / Saved boards
    trips.tsx       ← Trips (active + trophy grid)
    globe.tsx       ← Globe / Travel map
  modal/
    reel-save.tsx   ← Reel ingestion modal (bottom sheet)
  trip/
    [id]/
      itinerary.tsx
      live.tsx
    create.tsx
```

### Tab bar config (`app/(tabs)/_layout.tsx`)
```tsx
// Remove default tab bar — use a custom floating tab bar component
// See §5: CustomTabBar
<Tabs tabBar={(props) => <CustomTabBar {...props} />}>
  <Tabs.Screen name="index"       options={{ title: 'Home',        tabBarIcon: () => '🏠' }} />
  <Tabs.Screen name="collections" options={{ title: 'Saved',       tabBarIcon: () => '📌' }} />
  <Tabs.Screen name="reel"        options={{ title: '',            tabBarIcon: () => '➕' }} />
  <Tabs.Screen name="trips"       options={{ title: 'Trips',       tabBarIcon: () => '✈️' }} />
  <Tabs.Screen name="globe"       options={{ title: 'Globe',       tabBarIcon: () => '🌍' }} />
</Tabs>
```

---

## 3. Screen-by-Screen Breakdown

---

### Screen 1: Onboarding (`app/(auth)/index.tsx`)

**Layout:** Full screen, light gradient background. Centered column.

**Background:**
```
LinearGradient: ['#E8F8FF', '#FFF8F0', '#F0FFF4'], top → bottom
```

**Decorative elements (Animated):**
- 2× cloud SVGs (top-left, top-right) — drift left/right with `Animated.loop` + `Animated.sequence`
- Hot air balloon (top-right) — float + rotate animation
- Palm trees (bottom-left, bottom-right) — static SVGs, opacity 0.7
- Sun radial glow (top-right corner) — slow spin

**Center content (top to bottom):**
1. Globe illustration (animated float, 200×200) — see §4 Globe3D
2. `"voya ✈️"` — Fredoka One, 56px, `Colors.coral`
3. `"Reels → Real Adventures"` — Nunito 700, 13px, `Colors.teal`, uppercase, letter-spacing 2
4. Body copy — Nunito 500, 15px, `Colors.muted`, centered, max-width 260
5. `"Let's go! 🚀"` button — coral gradient pill, 16px Nunito 800, white
6. `"Sign in"` text button — Nunito 600, 13px, muted

**Animations:** All elements slide-up + fade-in with staggered delays (0ms, 200ms, 350ms, 500ms, 650ms, 800ms) using `Animated.timing`.

---

### Screen 2: Home Feed (`app/(tabs)/index.tsx`)

**Background:** `#FFFBF7`. Top section has `LinearGradient ['#E8F8FF', '#FFFBF7']`.

**Sections (ScrollView):**

#### Header (padding top: 72)
- Left: greeting "Good morning ☀️" (Nunito 700, 13px, muted) + "Risav!" (Fredoka One, 28px, text)
- Right: avatar circle — coral→sun gradient, initial letter

#### Stats Row (3 cards, flex row, gap 10)
Each card: white background, `borderRadius: 18`, `border: 2px solid {color}22`, center-aligned
- 📍 **24** Places — coral
- 🎬 **8** Reels — teal  
- ✈️ **3** Trips — lavender

Number in Fredoka One 24px (colored), label Nunito 700 10px muted, emoji above.

#### Save Reel CTA (full width button)
```
LinearGradient: [Colors.coral, '#FF8E53']
borderRadius: 22, padding: 18×20
```
- Left icon: 48×48 white-20% rounded square, 🎬 emoji (24px)
- Text: "Save a travel reel!" (Nunito 800, 16px, white) + subtitle
- Right arrow: →
- Shimmer overlay animation using `Animated.loop` on `translateX`

#### Saved Places (horizontal ScrollView)
Place cards: 130×165, `borderRadius: 22`
Each has a **gradient background** (4 different color pairs), wavy SVG at bottom, 📍 emoji top-left, destination name + country bottom-left in white.

Gradients:
- Kyoto: `['#FFD93D', '#FF9F45']`
- Santorini: `['#74C0FC', '#4ECDC4']`
- Bali: `['#C77DFF', '#FF6B6B']`
- Marrakech: `['#6BCB77', '#4ECDC4']`

#### AI Picks Section
Two suggestion cards (white, rounded 22, colored border):
- 🌸 Cherry blossoms card — teal border, "Plan it!" teal button
- 🏄 Bali surf card — sun border, "Plan it!" yellow button

---

### Screen 3: Save a Reel (`app/modal/reel-save.tsx`)

**Present as:** Bottom sheet modal (use `@gorhom/bottom-sheet` or `expo-modal`)

**States:** `idle` → `processing` → `done`

#### Idle state
- Platform chips row: Instagram 📸, TikTok 🎵, YouTube ▶️, Twitter 🐦
- URL input: white card, coral border + glow ring when focused (`borderColor`, `shadowColor`)
- CTA button: coral gradient when URL present, gray disabled state
  - Copy: `"Find that place! 🔍"` (active) / `"Paste a link first 👆"` (empty)

#### Processing state
- Robot emoji 🤖 with float animation
- 3 bouncing dots (coral, teal, sun) — `Animated.loop` staggered
- Copy: `"AI is working its magic..."` (Nunito 800, 16px)

#### Done state  
- Result card: mint border, mint-tinted background
- 📍 + place name + confidence % + "✓ Saved!" badge
- Two buttons: "📌 Add to board" (gray) + "✈️ Create trip!" (coral gradient)

---

### Screen 4: Collections (`app/(tabs)/collections.tsx`)

**Background:** `#FFFBF7`. Top gradient: `['#F0FFF4', '#FFFBF7']`.

**New collection:** Dashed coral border button, full width.

**Collection cards (vertical list, gap 14):**
Each card: white, `borderRadius: 22`, shadow.

Structure per card:
- **Top 100px:** `LinearGradient` header with large centered emoji (52px), "N places" badge top-right
- **Bottom:** white, title (Nunito 800, 15px) + "Open →" colored pill button

Color pairs per collection:
```
Japan:   [coral,   '#FF8E53']
Bali:    [teal,    '#45B7AA']  
Europe:  [lavender,'#E85FFF']
Beach:   [sky,     '#45A8FF']
```

---

### Screen 5: Trips (`app/(tabs)/trips.tsx`)

**Two sections:**

#### Active Trip (full width, top)
Section label: "🟢 Active Now" — Fredoka One, 18px

Card structure:
- **Hero (150px):** coral gradient, large emoji (72px) floating, paper plane deco, wavy SVG bottom
- **Live pulse:** animated pulsing ring (scale 1→2.2, opacity 1→0, loop) + "LIVE" badge
- **Info panel (white):**
  - Trip title — Fredoka One, 22px
  - Dates + stops — Nunito 600, 12px, muted
  - **Progress bar:** height 8, coral gradient fill, `borderRadius: 999`, percentage label
  - Action buttons: "Continue trip →" (coral gradient) + 🗺️ icon button

**Progress bar animation:** `Animated.timing` on width from 0% to actual % on mount.

#### Trophy Case (2-column grid)
Section label: "🏆 Trophy Case" — Fredoka One, 18px

Grid: `flexDirection: 'row', flexWrap: 'wrap', gap: 14`  
Each cell: `width: (screenWidth - 44 - 14) / 2`

**Trophy card:**
- White background, `borderRadius: 22`, colored border (faint)
- Subtle circle bg decoration (top-right)
- **Trophy SVG** (see §4 Trophy3D) — float animation, unique per card
- Title — Fredoka One, 14px, centered
- Year + days — Nunito 700, 11px, muted
- "Completed ✓" pill — colored tinted badge

Past trips data:
```ts
{ title: 'Bali Retreat',     emoji: '🌴', year: '2024', days: 10, c1: '#4ECDC4', c2: '#45EDE4' }
{ title: 'Morocco Magic',    emoji: '🏜️', year: '2024', days: 9,  c1: '#FFD93D', c2: '#FFB830' }
{ title: 'Rome Holiday',     emoji: '🏛️', year: '2023', days: 7,  c1: '#C77DFF', c2: '#E85FFF' }
{ title: 'Paris Escape',     emoji: '🗼', year: '2023', days: 5,  c1: '#74C0FC', c2: '#45A8FF' }
{ title: 'Tokyo Nights',     emoji: '🗾', year: '2022', days: 14, c1: '#FF6B6B', c2: '#FF8E53' }
{ title: 'Thai Adventure',   emoji: '🐘', year: '2022', days: 12, c1: '#6BCB77', c2: '#45B855' }
```

---

### Screen 6: Globe (`app/(tabs)/globe.tsx`)

**Background:** `LinearGradient ['#E8F8FF', '#FFFBF7']`

**Center globe:** 240×240, float animation — see §4 FunGlobe

**Stats row (3 cards):** same style as home stats
- 🗺️ 8 Countries — coral
- 📍 24 Places — teal
- 🌐 3 Continents — lavender

**Visited tags (flex wrap):**
Pill chips: white background, colored border (cycle through palette), country flag emoji + name.
```
Tokyo 🇯🇵 · Bali 🇮🇩 · Kyoto 🇯🇵 · Santorini 🇬🇷 · Rome 🇮🇹 · Paris 🇫🇷 · London 🇬🇧 · Marrakech 🇲🇦
```

---

## 4. Illustration Components

Use **react-native-svg** for all illustrations.

```bash
npx expo install react-native-svg
```

### Globe3D
A colorful cartoonish globe:
- **Base:** `RadialGradient` from `#BAE8FF` → `#74C0FC` → `#4ECDC4`
- **Land masses:** 4 green `Ellipse` blobs (`#6BCB77`, opacity 0.8–0.85) clipped to circle
- **Grid lines:** latitude ellipses + longitude ellipses, white, opacity 0.25, strokeWidth 0.7
- **Route arcs:** `Path` with `strokeDasharray` + animated `strokeDashoffset` (0→full length), white stroke
- **Destination dots:** colored circles (coral, sun, mint, teal, lavender) with pulse animation + white inner highlight
- **Specular:** white `RadialGradient` overlay, top-left quadrant, opacity 0.35
- **Drop shadow:** `feDropShadow` filter, `#4ECDC4`, stdDeviation 12, opacity 0.35

### Trophy3D
A 3D-looking trophy cup per past trip:
- **Cup body:** `Path` trapezoid shape with `LinearGradient` (color1 → color2 → color1, horizontal)
- **Inner shadow:** darker path overlay, opacity 0.08
- **Specular highlight:** white gradient on left third of cup, opacity 0.7
- **Handles:** `Path` arcs left + right, same gradient stroke, strokeWidth 10; white highlight stroke on each
- **Stem:** `Rect` with gradient
- **Base plate:** `Rect` with gradient + white top highlight
- **Emoji:** `Text` element centered in cup, fontSize 34
- **Stars:** 4 small colored circles at corners
- **Shadow ellipse:** bottom, opacity 0.18
- **Drop shadow filter:** color1, stdDeviation 8, dy 6, opacity 0.4

### PaperPlane
Simple geometric plane shape — triangle body + folded wing + dot trail. Used as decoration.

### Balloon (Hot Air)
Onboarding decoration — ellipse body with 3 color bands (coral/sun/teal), grid lines, basket + ropes.

### Palm
Onboarding corner decoration — curved trunk path + frond paths + coconut circles.

### Cloud
Onboarding/background decoration — 3 overlapping ellipses.

---

## 5. Custom Tab Bar

```tsx
// components/CustomTabBar.tsx
// White background, 2px top border (#F0EDE8)
// Height: 78, borderRadius bottom corners: 48px (matches IOSDevice)
// 5 tabs: Home 🏠, Saved 📌, [+] center, Trips ✈️, Globe 🌍
// Center + button:
//   - 50×50 circle, marginTop: -22 (floats above bar)
//   - LinearGradient coral→'#FF8E53'
//   - shadowColor: coral, shadowOpacity: 0.5, shadowRadius: 14
//   - animated glow pulse (shadowRadius 14→28→14, loop)
// Active tab: emoji in coral-tinted 36×36 rounded square (borderRadius 12)
// Active label: Nunito 800, Colors.coral
// Inactive label: Nunito 600, Colors.muted
```

---

## 6. Animation Recipes (React Native Animated API)

### Float (continuous up/down)
```ts
const floatAnim = useRef(new Animated.Value(0)).current;
useEffect(() => {
  Animated.loop(
    Animated.sequence([
      Animated.timing(floatAnim, { toValue: -10, duration: 2000, useNativeDriver: true }),
      Animated.timing(floatAnim, { toValue: 0,   duration: 2000, useNativeDriver: true }),
    ])
  ).start();
}, []);
// Apply: transform: [{ translateY: floatAnim }]
```

### Slide-up + fade-in on mount (staggered)
```ts
const anim = useRef(new Animated.Value(0)).current;
useEffect(() => {
  Animated.timing(anim, {
    toValue: 1, duration: 500, delay: 300, useNativeDriver: true,
  }).start();
}, []);
// Apply:
// opacity: anim
// transform: [{ translateY: anim.interpolate({ inputRange:[0,1], outputRange:[20,0] }) }]
```

### Bounce dot (loading)
```ts
// 3 dots, each with staggered delay: 0ms, 160ms, 320ms
const dot = useRef(new Animated.Value(0)).current;
Animated.loop(
  Animated.sequence([
    Animated.timing(dot, { toValue: -8, duration: 300, useNativeDriver: true }),
    Animated.timing(dot, { toValue: 0,  duration: 300, useNativeDriver: true }),
    Animated.delay(500),
  ])
).start();
```

### Shimmer (CTA button overlay)
```ts
// Use react-native-linear-gradient + Animated translateX
// Overlay: white gradient strip, animate from -width to +width, loop
```

### Live pulse ring (active trip)
```ts
const scale = useRef(new Animated.Value(1)).current;
const opacity = useRef(new Animated.Value(0.6)).current;
Animated.loop(
  Animated.parallel([
    Animated.timing(scale,   { toValue: 2.2, duration: 1500, useNativeDriver: true }),
    Animated.timing(opacity, { toValue: 0,   duration: 1500, useNativeDriver: true }),
  ])
).start();
// Position: absolute, same size/position as solid dot
// transform: [{ scale }], opacity
```

### Progress bar on mount
```ts
const progress = useRef(new Animated.Value(0)).current;
Animated.timing(progress, { toValue: 0.65, duration: 1000, delay: 300, useNativeDriver: false }).start();
// Apply to width: progress.interpolate({ inputRange:[0,1], outputRange:['0%','100%'] })
```

---

## 7. Key Packages to Install

```bash
npx expo install \
  react-native-svg \
  @expo-google-fonts/nunito \
  @expo-google-fonts/fredoka-one \
  expo-font \
  expo-linear-gradient \
  @gorhom/bottom-sheet \
  react-native-reanimated \
  react-native-gesture-handler
```

---

## 8. File/Component Checklist for Cursor

```
packages/ui/src/
  ├── colors.ts           ← full palette + gradients
  ├── fonts.ts            ← font names + weights
  ├── spacing.ts          ← spacing + radii + shadows
  ├── illustrations/
  │   ├── Globe3D.tsx
  │   ├── Trophy3D.tsx
  │   ├── PaperPlane.tsx
  │   ├── Balloon.tsx
  │   ├── Palm.tsx
  │   └── Cloud.tsx
  ├── CustomTabBar.tsx
  ├── PlaceCard.tsx
  ├── StatCard.tsx
  ├── TrophyCard.tsx      ← wraps Trophy3D + metadata
  ├── ActiveTripCard.tsx
  ├── AIPickCard.tsx
  └── CollectionCard.tsx

apps/mobile/app/
  ├── (auth)/index.tsx    ← OnboardingScreen
  ├── (tabs)/index.tsx    ← HomeScreen
  ├── (tabs)/collections.tsx
  ├── (tabs)/trips.tsx
  ├── (tabs)/globe.tsx
  └── modal/reel-save.tsx
```

---

## 9. Cursor Prompt Suggestion

> "Implement the Voya redesign using this spec. Use Expo + React Native + react-native-svg. Start with the design tokens (`colors.ts`, `spacing.ts`), then the illustration components (Globe3D, Trophy3D using react-native-svg Svg/Path/LinearGradient), then the CustomTabBar, then each screen in order. Use expo-linear-gradient for gradient backgrounds. Animate with React Native Animated API (not Reanimated) unless a component needs gesture-driven animation. Follow the exact color palette and font spec in §1."
