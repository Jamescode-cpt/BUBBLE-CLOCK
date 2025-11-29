/* ============================================
   HOLOGRAPHIC DASHBOARD - Main JavaScript
   Features: Clock, Weather, Calendar, Reminders,
   Notes, Stopwatch, World Clocks, Theming
   ============================================ */

// ============================================
// CONFIGURATION & STATE
// ============================================

const CONFIG = {
  weatherApiKey: '', // Users should add their own OpenWeatherMap API key
  weatherApiUrl: 'https://api.openweathermap.org/data/2.5',
  updateInterval: 1000,
  reminderCheckInterval: 30000,
};

const STATE = {
  selectedTimezone: 'local',
  currentMonth: new Date().getMonth(),
  currentYear: new Date().getFullYear(),
  reminders: [],
  stopwatch: {
    running: false,
    startTime: 0,
    elapsed: 0,
    laps: [],
    interval: null,
  },
  settings: {
    background: 'gradient1',
    themeColor: '#00ffe5',
  },
};

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  initClock();
  initHourMarkers();
  initCalendar();
  initReminders();
  initNotes();
  initStopwatch();
  initWorldClocks();
  initWeather();
  initSettingsPanel();
  initBackgroundSelector();
  initColorSelector();

  // Start update loops
  setInterval(updateClock, CONFIG.updateInterval);
  setInterval(updateWorldClocks, CONFIG.updateInterval);
  setInterval(checkReminders, CONFIG.reminderCheckInterval);
});

// ============================================
// STORAGE HELPERS
// ============================================

function saveSettings() {
  localStorage.setItem('holoDashboard', JSON.stringify({
    settings: STATE.settings,
    reminders: STATE.reminders,
    notes: document.getElementById('quick-notes')?.value || '',
    weatherCity: document.getElementById('city-input')?.value || '',
  }));
}

function loadSettings() {
  const saved = localStorage.getItem('holoDashboard');
  if (saved) {
    const data = JSON.parse(saved);
    STATE.settings = data.settings || STATE.settings;
    STATE.reminders = data.reminders || [];

    // Apply saved theme color
    applyThemeColor(STATE.settings.themeColor);

    // Apply saved background
    applyBackground(STATE.settings.background);

    // Load notes
    setTimeout(() => {
      const notesEl = document.getElementById('quick-notes');
      if (notesEl && data.notes) notesEl.value = data.notes;

      const cityEl = document.getElementById('city-input');
      if (cityEl && data.weatherCity) {
        cityEl.value = data.weatherCity;
        if (data.weatherCity) fetchWeather(data.weatherCity);
      }
    }, 100);
  }
}

// ============================================
// CLOCK FUNCTIONALITY
// ============================================

function initClock() {
  updateClock();

  // Timezone selector
  const tzSelect = document.getElementById('timezone');
  if (tzSelect) {
    tzSelect.addEventListener('change', (e) => {
      STATE.selectedTimezone = e.target.value;
      updateClock();
    });
  }
}

function initHourMarkers() {
  const container = document.querySelector('.hour-markers');
  if (!container) return;

  for (let i = 0; i < 12; i++) {
    const marker = document.createElement('div');
    marker.className = `hour-marker ${i % 3 === 0 ? 'major' : ''}`;
    marker.style.transform = `translateX(-50%) rotate(${i * 30}deg)`;
    container.appendChild(marker);
  }
}

function getTimeForTimezone(timezone) {
  const now = new Date();
  if (timezone === 'local') {
    return now;
  }
  const options = { timeZone: timezone, hour12: false };
  const formatter = new Intl.DateTimeFormat('en-US', {
    ...options,
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });
  const parts = formatter.formatToParts(now);
  const time = {};
  parts.forEach(p => { if (p.type !== 'literal') time[p.type] = parseInt(p.value); });
  return {
    getHours: () => time.hour || 0,
    getMinutes: () => time.minute || 0,
    getSeconds: () => time.second || 0,
    getFullYear: () => now.getFullYear(),
    getMonth: () => now.getMonth(),
    getDate: () => now.getDate(),
    getDay: () => now.getDay(),
  };
}

function updateClock() {
  const time = getTimeForTimezone(STATE.selectedTimezone);
  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours();

  // Calculate degrees
  const secondDeg = seconds * 6;
  const minuteDeg = minutes * 6 + seconds * 0.1;
  const hourDeg = (hours % 12) * 30 + minutes * 0.5;

  // Update analog clock hands
  const secondHand = document.getElementById('secondHand');
  const minuteHand = document.getElementById('minuteHand');
  const hourHand = document.getElementById('hourHand');

  if (secondHand) secondHand.style.transform = `rotate(${secondDeg}deg)`;
  if (minuteHand) minuteHand.style.transform = `rotate(${minuteDeg}deg)`;
  if (hourHand) hourHand.style.transform = `rotate(${hourDeg}deg)`;

  // Update digital time
  const timeDisplay = document.getElementById('time-display');
  if (timeDisplay) {
    const h = String(hours).padStart(2, '0');
    const m = String(minutes).padStart(2, '0');
    const s = String(seconds).padStart(2, '0');
    timeDisplay.textContent = `${h}:${m}:${s}`;
  }

  // Update date display
  const dateDisplay = document.getElementById('date-display');
  if (dateDisplay) {
    const now = new Date();
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    if (STATE.selectedTimezone !== 'local') {
      options.timeZone = STATE.selectedTimezone;
    }
    dateDisplay.textContent = now.toLocaleDateString('en-US', options);
  }
}

// ============================================
// CALENDAR FUNCTIONALITY
// ============================================

function initCalendar() {
  renderCalendar();

  document.getElementById('prev-month')?.addEventListener('click', () => {
    STATE.currentMonth--;
    if (STATE.currentMonth < 0) {
      STATE.currentMonth = 11;
      STATE.currentYear--;
    }
    renderCalendar();
  });

  document.getElementById('next-month')?.addEventListener('click', () => {
    STATE.currentMonth++;
    if (STATE.currentMonth > 11) {
      STATE.currentMonth = 0;
      STATE.currentYear++;
    }
    renderCalendar();
  });
}

function renderCalendar() {
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const monthLabel = document.getElementById('calendar-month');
  if (monthLabel) {
    monthLabel.textContent = `${monthNames[STATE.currentMonth]} ${STATE.currentYear}`;
  }

  const daysContainer = document.getElementById('calendar-days');
  if (!daysContainer) return;

  daysContainer.innerHTML = '';

  const firstDay = new Date(STATE.currentYear, STATE.currentMonth, 1).getDay();
  const daysInMonth = new Date(STATE.currentYear, STATE.currentMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(STATE.currentYear, STATE.currentMonth, 0).getDate();

  const today = new Date();
  const isCurrentMonth = today.getMonth() === STATE.currentMonth &&
    today.getFullYear() === STATE.currentYear;

  // Get reminder dates for this month
  const reminderDates = new Set();
  STATE.reminders.forEach(r => {
    const d = new Date(r.datetime);
    if (d.getMonth() === STATE.currentMonth && d.getFullYear() === STATE.currentYear) {
      reminderDates.add(d.getDate());
    }
  });

  // Previous month days
  for (let i = firstDay - 1; i >= 0; i--) {
    const day = document.createElement('div');
    day.className = 'calendar-day other-month';
    day.textContent = daysInPrevMonth - i;
    daysContainer.appendChild(day);
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const day = document.createElement('div');
    day.className = 'calendar-day';
    day.textContent = i;

    if (isCurrentMonth && i === today.getDate()) {
      day.classList.add('today');
    }

    if (reminderDates.has(i)) {
      day.classList.add('has-reminder');
    }

    day.addEventListener('click', () => selectCalendarDay(i));
    daysContainer.appendChild(day);
  }

  // Next month days
  const totalCells = firstDay + daysInMonth;
  const remainingCells = totalCells > 35 ? 42 - totalCells : 35 - totalCells;
  for (let i = 1; i <= remainingCells; i++) {
    const day = document.createElement('div');
    day.className = 'calendar-day other-month';
    day.textContent = i;
    daysContainer.appendChild(day);
  }
}

function selectCalendarDay(day) {
  // Remove previous selection
  document.querySelectorAll('.calendar-day.selected').forEach(el => {
    el.classList.remove('selected');
  });

  // Find and select the clicked day
  const days = document.querySelectorAll('.calendar-day:not(.other-month)');
  days.forEach(el => {
    if (parseInt(el.textContent) === day) {
      el.classList.add('selected');
    }
  });

  // Pre-fill reminder datetime
  const datetime = document.getElementById('reminder-datetime');
  if (datetime) {
    const date = new Date(STATE.currentYear, STATE.currentMonth, day, 9, 0);
    datetime.value = date.toISOString().slice(0, 16);
  }
}

// ============================================
// REMINDERS FUNCTIONALITY
// ============================================

function initReminders() {
  renderReminders();

  document.getElementById('add-reminder-btn')?.addEventListener('click', () => {
    document.getElementById('reminder-form')?.classList.toggle('hidden');
  });

  document.getElementById('cancel-reminder')?.addEventListener('click', () => {
    document.getElementById('reminder-form')?.classList.add('hidden');
    clearReminderForm();
  });

  document.getElementById('save-reminder')?.addEventListener('click', saveReminder);

  // Allow Enter key to save
  document.getElementById('reminder-text')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') saveReminder();
  });
}

function saveReminder() {
  const textInput = document.getElementById('reminder-text');
  const datetimeInput = document.getElementById('reminder-datetime');

  if (!textInput?.value || !datetimeInput?.value) {
    showToast('Please fill in all fields');
    return;
  }

  const reminder = {
    id: Date.now(),
    text: textInput.value,
    datetime: datetimeInput.value,
    notified: false,
  };

  STATE.reminders.push(reminder);
  STATE.reminders.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));

  saveSettings();
  renderReminders();
  renderCalendar();
  clearReminderForm();
  document.getElementById('reminder-form')?.classList.add('hidden');
  showToast('Reminder added');
}

function deleteReminder(id) {
  STATE.reminders = STATE.reminders.filter(r => r.id !== id);
  saveSettings();
  renderReminders();
  renderCalendar();
}

function clearReminderForm() {
  const textInput = document.getElementById('reminder-text');
  const datetimeInput = document.getElementById('reminder-datetime');
  if (textInput) textInput.value = '';
  if (datetimeInput) datetimeInput.value = '';
}

function renderReminders() {
  const container = document.getElementById('reminders-list');
  if (!container) return;

  container.innerHTML = '';
  const now = new Date();

  STATE.reminders.forEach(reminder => {
    const reminderDate = new Date(reminder.datetime);
    const isExpired = reminderDate < now;

    const item = document.createElement('div');
    item.className = `reminder-item ${isExpired ? 'expired' : ''}`;
    item.innerHTML = `
      <div class="reminder-content">
        <div class="reminder-text">${escapeHtml(reminder.text)}</div>
        <div class="reminder-time">${formatReminderDate(reminderDate)}</div>
      </div>
      <button class="delete-reminder" title="Delete">
        <i class="fas fa-trash"></i>
      </button>
    `;

    item.querySelector('.delete-reminder')?.addEventListener('click', () => {
      deleteReminder(reminder.id);
    });

    container.appendChild(item);
  });

  if (STATE.reminders.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: var(--text-dim); padding: 20px;">No reminders yet</p>';
  }
}

function formatReminderDate(date) {
  const options = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  return date.toLocaleDateString('en-US', options);
}

function checkReminders() {
  const now = new Date();

  STATE.reminders.forEach(reminder => {
    if (reminder.notified) return;

    const reminderDate = new Date(reminder.datetime);
    const diff = reminderDate - now;

    // Notify if within 1 minute of reminder time
    if (diff <= 60000 && diff > -60000) {
      reminder.notified = true;
      showNotification(reminder.text);
      playReminderSound();
      saveSettings();
    }
  });
}

function showNotification(text) {
  // Browser notification
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('Reminder', { body: text, icon: '🔔' });
  } else if ('Notification' in window && Notification.permission !== 'denied') {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        new Notification('Reminder', { body: text, icon: '🔔' });
      }
    });
  }

  // Toast notification
  showToast(`🔔 ${text}`);
}

function playReminderSound() {
  const audio = document.getElementById('reminder-sound');
  if (audio) {
    audio.currentTime = 0;
    audio.play().catch(() => { });
  }
}

// ============================================
// NOTES FUNCTIONALITY
// ============================================

function initNotes() {
  const notes = document.getElementById('quick-notes');
  if (notes) {
    notes.addEventListener('input', debounce(() => {
      saveSettings();
    }, 500));
  }
}

// ============================================
// STOPWATCH FUNCTIONALITY
// ============================================

function initStopwatch() {
  document.getElementById('sw-start')?.addEventListener('click', startStopwatch);
  document.getElementById('sw-stop')?.addEventListener('click', stopStopwatch);
  document.getElementById('sw-reset')?.addEventListener('click', resetStopwatch);
  document.getElementById('sw-lap')?.addEventListener('click', addLap);
}

function startStopwatch() {
  if (STATE.stopwatch.running) return;

  STATE.stopwatch.running = true;
  STATE.stopwatch.startTime = Date.now() - STATE.stopwatch.elapsed;
  STATE.stopwatch.interval = setInterval(updateStopwatchDisplay, 10);
}

function stopStopwatch() {
  if (!STATE.stopwatch.running) return;

  STATE.stopwatch.running = false;
  STATE.stopwatch.elapsed = Date.now() - STATE.stopwatch.startTime;
  clearInterval(STATE.stopwatch.interval);
}

function resetStopwatch() {
  STATE.stopwatch.running = false;
  STATE.stopwatch.elapsed = 0;
  STATE.stopwatch.laps = [];
  clearInterval(STATE.stopwatch.interval);
  updateStopwatchDisplay();
  renderLaps();
}

function addLap() {
  if (!STATE.stopwatch.running) return;

  const elapsed = Date.now() - STATE.stopwatch.startTime;
  STATE.stopwatch.laps.push(elapsed);
  renderLaps();
}

function updateStopwatchDisplay() {
  const display = document.getElementById('stopwatch-display');
  if (!display) return;

  const elapsed = STATE.stopwatch.running
    ? Date.now() - STATE.stopwatch.startTime
    : STATE.stopwatch.elapsed;

  display.textContent = formatStopwatchTime(elapsed);
}

function formatStopwatchTime(ms) {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const milliseconds = ms % 1000;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(3, '0')}`;
}

function renderLaps() {
  const container = document.getElementById('lap-times');
  if (!container) return;

  container.innerHTML = '';

  STATE.stopwatch.laps.forEach((time, index) => {
    const lap = document.createElement('div');
    lap.className = 'lap-time';
    lap.innerHTML = `
      <span class="lap-number">Lap ${index + 1}</span>
      <span>${formatStopwatchTime(time)}</span>
    `;
    container.insertBefore(lap, container.firstChild);
  });
}

// ============================================
// WORLD CLOCKS FUNCTIONALITY
// ============================================

function initWorldClocks() {
  updateWorldClocks();
}

function updateWorldClocks() {
  const items = document.querySelectorAll('.world-clock-item');
  items.forEach(item => {
    const tz = item.dataset.tz;
    const timeEl = item.querySelector('.wc-time');
    if (!timeEl || !tz) return;

    try {
      const time = new Date().toLocaleTimeString('en-US', {
        timeZone: tz,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      timeEl.textContent = time;
    } catch (e) {
      timeEl.textContent = '--:--';
    }
  });
}

// ============================================
// WEATHER FUNCTIONALITY
// ============================================

function initWeather() {
  document.getElementById('get-weather')?.addEventListener('click', () => {
    const city = document.getElementById('city-input')?.value;
    if (city) {
      fetchWeather(city);
      saveSettings();
    }
  });

  document.getElementById('city-input')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const city = e.target.value;
      if (city) {
        fetchWeather(city);
        saveSettings();
      }
    }
  });

  document.getElementById('get-location')?.addEventListener('click', () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
        },
        () => {
          showToast('Unable to get location');
        }
      );
    }
  });
}

async function fetchWeather(city) {
  if (!CONFIG.weatherApiKey) {
    // Demo mode without API key
    updateWeatherDisplay({
      temp: Math.round(15 + Math.random() * 15),
      description: 'Demo Mode - Add API Key',
      humidity: Math.round(40 + Math.random() * 40),
      wind: Math.round(5 + Math.random() * 20),
      visibility: Math.round(5 + Math.random() * 10),
      icon: 'cloud-sun',
    });
    showToast('Demo mode: Add OpenWeatherMap API key for real data');
    return;
  }

  try {
    const response = await fetch(
      `${CONFIG.weatherApiUrl}/weather?q=${encodeURIComponent(city)}&units=metric&appid=${CONFIG.weatherApiKey}`
    );
    const data = await response.json();

    if (data.cod === 200) {
      updateWeatherDisplay({
        temp: Math.round(data.main.temp),
        description: data.weather[0].description,
        humidity: data.main.humidity,
        wind: Math.round(data.wind.speed * 3.6),
        visibility: Math.round((data.visibility || 10000) / 1000),
        icon: getWeatherIcon(data.weather[0].icon),
      });
    } else {
      showToast('City not found');
    }
  } catch (error) {
    showToast('Error fetching weather');
  }
}

async function fetchWeatherByCoords(lat, lon) {
  if (!CONFIG.weatherApiKey) {
    showToast('Add OpenWeatherMap API key for location weather');
    return;
  }

  try {
    const response = await fetch(
      `${CONFIG.weatherApiUrl}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${CONFIG.weatherApiKey}`
    );
    const data = await response.json();

    if (data.cod === 200) {
      document.getElementById('city-input').value = data.name;
      updateWeatherDisplay({
        temp: Math.round(data.main.temp),
        description: data.weather[0].description,
        humidity: data.main.humidity,
        wind: Math.round(data.wind.speed * 3.6),
        visibility: Math.round((data.visibility || 10000) / 1000),
        icon: getWeatherIcon(data.weather[0].icon),
      });
      saveSettings();
    }
  } catch (error) {
    showToast('Error fetching weather');
  }
}

function updateWeatherDisplay(data) {
  document.getElementById('weather-temp').textContent = `${data.temp}°C`;
  document.getElementById('weather-desc').textContent = data.description;
  document.getElementById('humidity').textContent = data.humidity;
  document.getElementById('wind').textContent = data.wind;
  document.getElementById('visibility').textContent = data.visibility;

  const iconEl = document.querySelector('.weather-icon');
  if (iconEl) {
    iconEl.className = `fas fa-${data.icon} weather-icon`;
  }
}

function getWeatherIcon(code) {
  const icons = {
    '01d': 'sun',
    '01n': 'moon',
    '02d': 'cloud-sun',
    '02n': 'cloud-moon',
    '03d': 'cloud',
    '03n': 'cloud',
    '04d': 'clouds',
    '04n': 'clouds',
    '09d': 'cloud-showers-heavy',
    '09n': 'cloud-showers-heavy',
    '10d': 'cloud-sun-rain',
    '10n': 'cloud-moon-rain',
    '11d': 'bolt',
    '11n': 'bolt',
    '13d': 'snowflake',
    '13n': 'snowflake',
    '50d': 'smog',
    '50n': 'smog',
  };
  return icons[code] || 'cloud-sun';
}

// ============================================
// SETTINGS PANEL
// ============================================

function initSettingsPanel() {
  const toggle = document.getElementById('settings-toggle');
  const panel = document.getElementById('settings-panel');

  toggle?.addEventListener('click', () => {
    panel?.classList.toggle('hidden');
  });

  // Close panel when clicking outside
  document.addEventListener('click', (e) => {
    if (!panel?.contains(e.target) && !toggle?.contains(e.target)) {
      panel?.classList.add('hidden');
    }
  });
}

// ============================================
// BACKGROUND SELECTOR
// ============================================

function initBackgroundSelector() {
  const options = document.querySelectorAll('.bg-option');

  options.forEach(option => {
    option.addEventListener('click', () => {
      const bg = option.dataset.bg;
      STATE.settings.background = bg;
      applyBackground(bg);
      saveSettings();

      // Update active state
      options.forEach(o => o.classList.remove('active'));
      option.classList.add('active');
    });

    // Mark active on load
    if (option.dataset.bg === STATE.settings.background) {
      option.classList.add('active');
    }
  });

  // Custom upload
  document.getElementById('custom-bg')?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        STATE.settings.background = `custom:${event.target.result}`;
        applyBackground(STATE.settings.background);
        saveSettings();
      };
      reader.readAsDataURL(file);
    }
  });
}

function applyBackground(bg) {
  const bgLayer = document.getElementById('bg-layer');
  if (!bgLayer) return;

  if (bg.startsWith('custom:')) {
    bgLayer.style.background = `url('${bg.slice(7)}') center/cover no-repeat`;
  } else if (bg.startsWith('gradient')) {
    const gradients = {
      gradient1: 'radial-gradient(ellipse at center, #0a0a1a, #1a0a2e)',
      gradient2: 'radial-gradient(ellipse at center, #0d1b2a, #1b263b)',
      gradient3: 'radial-gradient(ellipse at center, #240046, #3c096c)',
      gradient4: 'radial-gradient(ellipse at center, #03071e, #370617)',
      gradient5: 'radial-gradient(ellipse at center, #001219, #005f73)',
    };
    bgLayer.style.background = gradients[bg] || gradients.gradient1;
  } else if (bg.startsWith('image')) {
    const images = {
      image1: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=1920',
      image2: 'https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=1920',
      image3: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920',
    };
    bgLayer.style.background = `url('${images[bg]}') center/cover no-repeat`;
  }
}

// ============================================
// COLOR SELECTOR
// ============================================

function initColorSelector() {
  const options = document.querySelectorAll('.color-option');

  options.forEach(option => {
    option.addEventListener('click', () => {
      const color = option.dataset.color;
      STATE.settings.themeColor = color;
      applyThemeColor(color);
      saveSettings();

      // Update active state
      options.forEach(o => o.classList.remove('active'));
      option.classList.add('active');
    });

    // Mark active on load
    if (option.dataset.color === STATE.settings.themeColor) {
      option.classList.add('active');
    }
  });
}

function applyThemeColor(color) {
  const root = document.documentElement;
  root.style.setProperty('--primary', color);

  // Convert hex to RGB
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  root.style.setProperty('--primary-rgb', `${r}, ${g}, ${b}`);
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.remove('hidden');

  setTimeout(() => {
    toast.classList.add('hidden');
  }, 3000);
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
