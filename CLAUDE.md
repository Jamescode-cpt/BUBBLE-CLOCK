# CLAUDE.md - AI Assistant Guide for BUBBLE-CLOCK

## Project Overview

BUBBLE-CLOCK is a lightweight, static web application that displays a real-time analog clock with a neon "bubbly" cyberpunk aesthetic. The clock updates every second and features animated hour, minute, and second hands with glowing visual effects.

**Live Behavior**: Displays the user's local system time (not GMT as README suggests - the code uses `new Date()` which returns local time).

## Tech Stack

| Technology | Purpose |
|------------|---------|
| HTML5 | Semantic markup structure |
| CSS3 | Styling with radial gradients, box shadows, transforms |
| Vanilla JavaScript | Time logic and DOM manipulation |
| No build tools | Static files served directly |

## Project Structure

```
BUBBLE-CLOCK/
├── index.html      # Main HTML entry point with clock DOM structure
├── main.js         # Clock update logic (time calculation and hand rotation)
├── style.css       # Visual styling with neon/cyberpunk theme
├── README.md       # Project description
└── CLAUDE.md       # This file - AI assistant guidelines
```

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                               │
├─────────────────────────────────────────────────────────────┤
│  index.html                                                  │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  #clock (container)                                  │    │
│  │  ├── .hand.hour   #hourHand   → rotate(hourDeg)     │    │
│  │  ├── .hand.minute #minuteHand → rotate(minuteDeg)   │    │
│  │  ├── .hand.second #secondHand → rotate(secondDeg)   │    │
│  │  └── .center-dot                                     │    │
│  └─────────────────────────────────────────────────────┘    │
│                              ▲                               │
│                              │ DOM manipulation              │
│  ┌───────────────────────────┴─────────────────────────┐    │
│  │  main.js                                             │    │
│  │  updateClock() ← setInterval(1000ms)                 │    │
│  │  └── new Date() → calculate degrees → apply styles  │    │
│  └─────────────────────────────────────────────────────┘    │
│                              ▲                               │
│                              │ styling                       │
│  ┌───────────────────────────┴─────────────────────────┐    │
│  │  style.css                                           │    │
│  │  └── Neon theme, transforms, glow effects           │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

## File Responsibilities

### index.html
- Entry point of the application
- Contains the clock face structure with three hand elements (hour, minute, second)
- Center dot element for visual polish
- Links to external CSS and JS files

### main.js
- `updateClock()` function - Core logic that:
  - Gets current time using `Date()`
  - Calculates rotation degrees for each hand
  - Applies CSS transform rotations to hand elements
- Updates every 1000ms via `setInterval`
- Runs immediately on page load

### style.css
- Dark radial gradient background (#0a0a1a to black)
- Neon cyan (#00ffe5) as primary accent color
- Clock face with glowing border and shadow effects
- Hand styles:
  - Hour hand: Pink (#ff00cc), 30% width, 6px height
  - Minute hand: Cyan, 45% width, 4px height
  - Second hand: Red (#ff0000), 50% width, 2px height
- All hands rotate from left-center transform origin

## Development Workflow

### Running the Project
This is a static site - no build step required. Open `index.html` directly in a browser, or use any local server:

```bash
# Python 3
python -m http.server 8000

# Node.js (if npx available)
npx serve .

# Or simply open index.html in browser
```

### Making Changes
1. Edit files directly - no compilation needed
2. Refresh browser to see changes
3. For JS changes, open browser console (F12) to check for errors

## Code Conventions

### JavaScript
- Use `const` for variables that don't change
- Use template literals for string interpolation
- Direct DOM manipulation via `document.getElementById()`
- Degrees calculated as: seconds × 6, minutes × 6 + (seconds × 0.1), hours × 30 + (minutes × 0.5)

### CSS
- Clock dimensions: 240px × 240px
- Use `transform: rotate(Xdeg)` for hand positioning
- Hands use `transform-origin: left center` (hands extend right from center)
- Glow effects via `box-shadow` with semi-transparent colors

### HTML
- Semantic structure with single clock container
- IDs used for JS targeting: `hourHand`, `minuteHand`, `secondHand`
- Classes for styling: `hand`, `hour`, `minute`, `second`, `center-dot`

## Common Tasks

### Changing clock size
Modify `#clock` width/height in `style.css`. Hand widths are percentages, so they scale automatically.

### Changing colors
- Primary cyan: `#00ffe5`
- Hour hand pink: `#ff00cc`
- Second hand red: `#ff0000`
- Background: `#0a0a1a` to `#000`

### Adjusting update frequency
Change the interval in `main.js`: `setInterval(updateClock, 1000)` (1000ms = 1 second)

## Testing

No automated tests exist. Manual testing:
1. Verify clock displays current time
2. Confirm second hand moves every second
3. Check that hands point to correct positions
4. Test in multiple browsers for compatibility

## Known Limitations & Potential Improvements

### Current Limitations
- No timezone selection (shows local time only)
- No hour markers or numbers on clock face
- No AM/PM indicator
- Clock hands start from incorrect position before JS loads
- No accessibility features (screen reader support)
- No mobile-optimized touch interactions

### Suggested Enhancements (if requested)
1. Add hour markers (12 dots or numbers around the edge)
2. Add smooth CSS transitions for hand movement
3. Implement timezone selector dropdown
4. Add digital time display below clock
5. Make clock responsive to different screen sizes
6. Add dark/light theme toggle
7. Implement requestAnimationFrame for smoother updates

## Browser Compatibility

- Modern browsers: Full support (Chrome, Firefox, Safari, Edge)
- IE11: Limited support (no CSS custom properties if added)
- Mobile: Works on touch devices, no special handling needed

## Performance Notes

- Minimal CPU usage: Single setInterval updating 3 DOM elements
- No memory leaks: Simple DOM manipulation, no event listener accumulation
- No external requests: Fully offline-capable once loaded

## Quick Reference

### Time Calculation Formulas
```javascript
secondDeg = seconds * 6              // 360° / 60 = 6° per second
minuteDeg = minutes * 6 + seconds * 0.1  // Smooth minute hand
hourDeg   = (hours % 12) * 30 + minutes * 0.5  // 360° / 12 = 30° per hour
```

### Color Palette
| Element | Hex Code | Usage |
|---------|----------|-------|
| Cyan | `#00ffe5` | Primary accent, minute hand, borders |
| Pink | `#ff00cc` | Hour hand |
| Red | `#ff0000` | Second hand |
| Dark | `#0a0a1a` | Background gradient start |
| Black | `#000` | Background gradient end, clock face |

### Key Dimensions
- Clock diameter: 240px (plus 8px border)
- Hour hand: 30% width, 6px height
- Minute hand: 45% width, 4px height
- Second hand: 50% width, 2px height
- Center dot: 12px diameter

## Notes for AI Assistants

### Do's
- Keep the vanilla JS approach - don't introduce frameworks
- Preserve the neon "bubbly" cyberpunk aesthetic
- Maintain the simple, single-file-per-concern architecture
- Test changes by opening index.html in a browser
- Consider accessibility when adding features

### Don'ts
- Don't add package.json or build tools unless specifically requested
- Don't over-engineer - this is intentionally simple
- Don't change the color scheme without explicit request
- Don't add dependencies for simple features that can be done in vanilla JS

### Common Requests & Approaches
| Request | Approach |
|---------|----------|
| Add hour markers | Create 12 positioned divs in HTML or use CSS pseudo-elements |
| Smooth hand movement | Add CSS `transition: transform 0.1s` to `.hand` class |
| Show digital time | Add a `<div>` below clock, update in `updateClock()` |
| GMT/UTC time | Use `getUTCHours()`, `getUTCMinutes()`, `getUTCSeconds()` |
| Different timezone | Use `toLocaleTimeString()` with timezone option |

## Debugging Tips

1. **Hands not moving**: Check browser console for JS errors
2. **Wrong time**: Verify system clock is correct
3. **Styling issues**: Use browser DevTools to inspect computed styles
4. **Hands in wrong position**: Verify transform-origin is `left center`
