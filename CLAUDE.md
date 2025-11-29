# CLAUDE.md - AI Assistant Guide for BUBBLE-CLOCK

## Project Overview

BUBBLE-CLOCK is a simple, static web application that displays a real-time analog clock with a neon "bubbly" aesthetic. The clock updates every second and features animated hour, minute, and second hands.

## Tech Stack

- **HTML5** - Semantic markup structure
- **CSS3** - Styling with radial gradients, box shadows, and transforms
- **Vanilla JavaScript** - No frameworks or libraries
- **No build tools** - Static files served directly

## Project Structure

```
BUBBLE-CLOCK/
├── index.html      # Main HTML entry point with clock DOM structure
├── main.js         # Clock update logic (time calculation and hand rotation)
├── style.css       # Visual styling with neon/cyberpunk theme
├── README.md       # Project description
└── CLAUDE.md       # This file - AI assistant guidelines
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

## Notes for AI Assistants

- This is a beginner-friendly project with minimal complexity
- No package.json, node_modules, or dependencies to manage
- All logic is in a single 18-line JavaScript file
- When suggesting changes, keep the vanilla JS approach - don't introduce frameworks
- The "bubbly" aesthetic is intentional - preserve the neon glow theme
- Time is displayed in local timezone (uses browser's `Date()` object)
