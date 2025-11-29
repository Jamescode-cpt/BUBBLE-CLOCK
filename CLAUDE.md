# CLAUDE.md - AI Assistant Guide for Holographic Dashboard

## Project Overview

**Holographic Dashboard** is a feature-rich, glassmorphic web application that transforms a simple clock into a full productivity dashboard. It features a cyberpunk/holographic aesthetic with animated effects, multiple widgets, and extensive customization options.

### Key Features
- Analog & digital clock with timezone support
- Interactive calendar with reminder integration
- Reminders system with browser notifications
- Weather widget (requires API key)
- Quick notes (auto-saved)
- Stopwatch with lap times
- World clocks (4 cities)
- Background image/gradient selector
- Theme color customization
- All settings persisted in localStorage

## Tech Stack

| Technology | Purpose |
|------------|---------|
| HTML5 | Semantic structure with multiple widget containers |
| CSS3 | Glassmorphic design, animations, CSS variables |
| Vanilla JavaScript | All functionality without frameworks |
| Font Awesome 6 | Icon library (CDN) |
| localStorage | Persistent storage for settings, reminders, notes |
| OpenWeatherMap API | Weather data (optional) |

## Project Structure

```
BUBBLE-CLOCK/
├── index.html      # Dashboard layout with 7 widget containers
├── main.js         # All JavaScript functionality (~890 lines)
├── style.css       # Glassmorphic styling (~975 lines)
├── README.md       # Project description
└── CLAUDE.md       # This file - AI assistant guidelines
```

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        HOLOGRAPHIC DASHBOARD                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │   CLOCK     │  │   WEATHER   │  │  CALENDAR   │  │  REMINDERS  │ │
│  │ • Analog    │  │ • Temp/Desc │  │ • Month View│  │ • Add/Delete│ │
│  │ • Digital   │  │ • Details   │  │ • Navigation│  │ • Notify    │ │
│  │ • Timezone  │  │ • Location  │  │ • Selection │  │ • Sound     │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘ │
│                                                                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                   │
│  │   NOTES     │  │  STOPWATCH  │  │WORLD CLOCKS │                   │
│  │ • Auto-save │  │ • Start/Stop│  │ • 4 Cities  │                   │
│  │ • Textarea  │  │ • Lap Times │  │ • Live Time │                   │
│  └─────────────┘  └─────────────┘  └─────────────┘                   │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │                    SETTINGS PANEL (Gear Icon)                   │ │
│  │  • Background: 5 gradients, 3 images, custom upload             │ │
│  │  • Theme Color: 6 preset colors                                 │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │                         STATE MANAGEMENT                         │ │
│  │  CONFIG → STATE → localStorage → UI                             │ │
│  └─────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

## Widget Documentation

### 1. Clock Widget
- **Analog clock**: Hour markers, smooth hand transitions, glowing effects
- **Digital time**: Large LED-style display
- **Date display**: Day, month, date, year
- **Timezone selector**: 9 timezone options including UTC

### 2. Weather Widget
- **Temperature**: Celsius display
- **Description**: Weather condition text
- **Details**: Wind speed, humidity, visibility
- **Search**: City name input
- **Geolocation**: Use browser location
- **Note**: Requires OpenWeatherMap API key in `CONFIG.weatherApiKey`

### 3. Calendar Widget
- **Month navigation**: Previous/next buttons
- **Day grid**: Full month view with weekday headers
- **Today highlight**: Current day highlighted
- **Reminder dots**: Days with reminders marked
- **Day selection**: Click to pre-fill reminder form

### 4. Reminders Widget
- **Add reminder**: Text + datetime picker
- **List view**: Sorted by date, expired items grayed
- **Delete**: Individual deletion
- **Notifications**: Browser notifications + toast + sound
- **Persistence**: Saved to localStorage

### 5. Notes Widget
- **Auto-save**: Debounced save on input
- **Persistence**: Saved to localStorage
- **Full-height textarea**: Flexible sizing

### 6. Stopwatch Widget
- **Controls**: Start, Pause, Reset, Lap
- **Display**: HH:MM:SS.mmm format
- **Lap times**: Newest first list

### 7. World Clocks Widget
- **Cities**: New York, London, Tokyo, Sydney
- **Live update**: Every second
- **24-hour format**: HH:MM display

## Development Workflow

### Running Locally
```bash
# Any static server works
python -m http.server 8000
# or
npx serve .
# or open index.html directly
```

### Adding Weather API Key
Edit `main.js` line 12:
```javascript
const CONFIG = {
  weatherApiKey: 'YOUR_OPENWEATHERMAP_API_KEY', // Get free key at openweathermap.org
  ...
};
```

### Testing Changes
1. Open browser DevTools (F12)
2. Check Console for errors
3. Test localStorage: `localStorage.getItem('holoDashboard')`
4. Test responsiveness at different viewport sizes

## Code Architecture

### State Management
```javascript
const STATE = {
  selectedTimezone: 'local',
  currentMonth: number,
  currentYear: number,
  reminders: Array<{id, text, datetime, notified}>,
  stopwatch: {running, startTime, elapsed, laps, interval},
  settings: {background, themeColor}
};
```

### Key Functions by Module

| Module | Functions |
|--------|-----------|
| **Clock** | `initClock`, `initHourMarkers`, `getTimeForTimezone`, `updateClock` |
| **Calendar** | `initCalendar`, `renderCalendar`, `selectCalendarDay` |
| **Reminders** | `initReminders`, `saveReminder`, `deleteReminder`, `renderReminders`, `checkReminders` |
| **Weather** | `initWeather`, `fetchWeather`, `fetchWeatherByCoords`, `updateWeatherDisplay` |
| **Stopwatch** | `initStopwatch`, `startStopwatch`, `stopStopwatch`, `resetStopwatch`, `addLap` |
| **Settings** | `initSettingsPanel`, `initBackgroundSelector`, `initColorSelector` |
| **Storage** | `saveSettings`, `loadSettings` |
| **Utils** | `showToast`, `escapeHtml`, `debounce` |

### CSS Architecture
- **CSS Variables**: All colors defined in `:root`
- **Glassmorphism**: `backdrop-filter: blur()` + semi-transparent backgrounds
- **Animations**: `hologram-flicker`, `scanlines`, `glass-shine`
- **Grid Layout**: `grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))`

## Customization Guide

### Adding a New Widget
1. Add HTML structure in `index.html` inside `#dashboard`
2. Add styling in `style.css` with `.widget` base class
3. Add initialization function in `main.js`
4. Call init function in `DOMContentLoaded` handler

### Changing Theme Colors
Edit CSS variables in `:root`:
```css
:root {
  --primary: #00ffe5;
  --primary-rgb: 0, 255, 229;
  --secondary: #ff00cc;
  --accent: #ff0000;
}
```

### Adding Background Options
1. Add HTML option in `#bg-options` div
2. Add gradient/image URL in `applyBackground()` function

### Adding World Clock Cities
Add to HTML in `#world-clocks`:
```html
<div class="world-clock-item" data-tz="Europe/Paris">
  <span class="wc-city">Paris</span>
  <span class="wc-time">--:--</span>
</div>
```

## Data Storage

### localStorage Schema
```javascript
{
  settings: {
    background: 'gradient1' | 'image1' | 'custom:base64...',
    themeColor: '#00ffe5'
  },
  reminders: [{
    id: number,
    text: string,
    datetime: string,
    notified: boolean
  }],
  notes: string,
  weatherCity: string
}
```

### Clearing Data
```javascript
localStorage.removeItem('holoDashboard');
location.reload();
```

## Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Glassmorphism | Full | Full | Full | Full |
| Backdrop Filter | Full | Full | Full | Full |
| CSS Grid | Full | Full | Full | Full |
| Intl.DateTimeFormat | Full | Full | Full | Full |
| Geolocation | Full | Full | Full | Full |
| Notifications | Full | Full | Partial | Full |

## Performance Considerations

- **Update intervals**: Clock/world clocks at 1000ms, reminders at 30000ms
- **Debounced saves**: Notes save with 500ms debounce
- **No external dependencies**: Except Font Awesome CDN
- **Efficient DOM updates**: Targeted element updates, not full re-renders

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Weather not working | Add API key to `CONFIG.weatherApiKey` |
| Settings not saving | Check localStorage quota, clear old data |
| Notifications not appearing | Grant browser notification permission |
| Backdrop blur not working | Update browser; Firefox needs `layout.css.backdrop-filter.enabled` |
| Clock hands in wrong position | Verify CSS transform-origin is `bottom center` |

## Notes for AI Assistants

### Do's
- Maintain the glassmorphic aesthetic consistently
- Use CSS variables for colors (enables theme switching)
- Preserve localStorage compatibility when modifying state
- Test all widgets after making changes
- Keep the vanilla JS approach
- Ensure mobile responsiveness

### Don'ts
- Don't add heavy frameworks (React, Vue, etc.) without explicit request
- Don't hardcode colors - use CSS variables
- Don't break localStorage schema without migration logic
- Don't remove existing features without confirmation
- Don't add external API dependencies without user consent

### Extension Ideas (if requested)
1. **Pomodoro Timer**: Add to stopwatch widget
2. **Todo List**: Expand reminders into full todo
3. **Music Player**: Ambient sounds widget
4. **Quote of the Day**: Inspirational quotes API
5. **System Stats**: Battery, network status
6. **Keyboard Shortcuts**: Quick actions
7. **Export/Import**: Settings backup
8. **Multiple Themes**: Dark, light, custom presets

## Quick Reference

### Color Palette
| Color | Hex | Usage |
|-------|-----|-------|
| Cyan | `#00ffe5` | Primary accent (default) |
| Pink | `#ff00cc` | Secondary, hour hand |
| Red | `#ff0000` | Accent, second hand |
| Green | `#00ff88` | Alt theme option |
| Orange | `#ffaa00` | Alt theme option |
| Purple | `#aa88ff` | Alt theme option |

### Icon Reference (Font Awesome)
- Clock: `fa-clock`
- Weather: `fa-cloud-sun`, `fa-sun`, `fa-moon`, `fa-snowflake`
- Calendar: `fa-chevron-left`, `fa-chevron-right`
- Reminders: `fa-bell`, `fa-plus`, `fa-trash`
- Notes: `fa-sticky-note`
- Stopwatch: `fa-stopwatch`, `fa-play`, `fa-pause`, `fa-redo`, `fa-flag`
- World: `fa-globe`
- Settings: `fa-cog`, `fa-palette`, `fa-adjust`

### Time Calculation Formulas
```javascript
secondDeg = seconds * 6              // 360° / 60
minuteDeg = minutes * 6 + seconds * 0.1
hourDeg   = (hours % 12) * 30 + minutes * 0.5
```
