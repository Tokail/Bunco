@import url('https://fonts.googleapis.com/css2?family=Quicksand:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&display=swap');

@custom-variant dark (&:is(.dark *));

:root {
  --font-size: 16px;
  /* Typography scale variables */
  --text-xs: 0.75rem;
  --text-sm: 0.813rem;
  --text-base: 1.063rem;
  --text-lg: 1.5rem;
  --text-xl: 1.25rem;
  --text-2xl: 2.875rem;
  
  /* The default background color for the application. */
  --background: rgba(68, 9, 64, 1.00);
  /* The default color for elements or text that appears on top of the background. */
  --foreground: rgba(29, 40, 45, 1.00);
  /* The background color for cards, modals, and other containers. */
  --card: rgba(255, 255, 255, 1.00);
  /* The default color for text or elements that appear on top of cards, modals and other background containers. */
  --card-foreground: rgba(29, 40, 45, 1.00);
  /* The background color for dropdowns and tooltips. */
  --popover: rgba(0, 0, 0, 0);
  /* The default color for text or elements that appear on top of dropdowns and tooltips. */
  --popover-foreground: rgba(29, 40, 45, 1.00);
  /* The primary color used for buttons, links, and other interactive elements. */
  --primary: rgba(97, 13, 91, 1.00);
  /* The default color for text or elements that appear on top of primary colored elements. */
  --primary-foreground: rgba(255, 255, 255, 1.00);
  /* The secondary color used for secondary(but NOT-DESTRUCTIVE) buttons and interactive elements. */
  --secondary: rgba(0, 0, 0, 0);
  /* The default color for text or elements that appear on top of secondary colored elements. */
  --secondary-foreground: rgba(29, 40, 45, 1.00);
  /* The muted color used for less prominent elements, such as disabled buttons or disabled text. */
  --muted: rgba(94, 106, 114, 1.00);
  /* The default color for text or elements that appear on top of muted colored elements. */
  --muted-foreground: rgba(255, 255, 255, 1.00);
  /* The accent color used for highlights, links, and other interactive elements. */
  --accent: rgba(255, 206, 0, 1.00);
  /* The default color for text or elements that appear on top of accent colored elements. */
  --accent-foreground: rgba(68, 9, 64, 1.00);
  /* The color used for background in destructive actions, such as delete buttons or error messages. */
  --destructive: rgba(240, 18, 70, 1.00);
  /* The default color for text or elements that appear on top of destructive colored elements. */
  --destructive-foreground: rgba(255, 255, 255, 1.00);
  /* The default border color for elements such as inputs, buttons, and other containers. */
  --border: rgba(255, 206, 0, 1.00);
  /* The default background color for input fields once the text has been filled. Should be either transparent or match the input-background. */
  --input: rgba(255, 255, 255, 1.00);
  /* The default background color for input fields, text areas, and other input elements. */
  --input-background: rgba(255, 255, 255, 1.00);
  /* The default background color for switch elements. */
  --switch-background: rgba(94, 106, 114, 1.00);
  /* The default font weight for medium text. */
  --font-weight-medium: 500;
  /* The default font weight for normal text. */
  --font-weight-normal: 400;
  /* The color for focus rings, outlines, and other focus indicators. */
  --ring: rgba(255, 206, 0, 1.00);
  /* Shadow for small elevations, such as cards or modals. */
  --elevation-sm: 0px 4px 16px 10px rgba(0,0,0,0.31);
  /* The color for chart elements, such as a bar or line in a chart. */
  --chart-1: rgba(35, 101, 220, 1.00);
  /* The color for another chart element, such as a bar or line in a chart. */
  --chart-2: rgba(76, 209, 46, 1.00);
  /* The color for another chart element, such as a bar or line in a chart. */
  --chart-3: rgba(240, 18, 70, 1.00);
  /* The color for another chart element, such as a bar or line in a chart. */
  --chart-4: rgba(255, 206, 0, 1.00);
  /* The color for another chart element, such as a bar or line in a chart. */
  --chart-5: rgba(250, 91, 5, 1.00);
  /* The color for active player indicators and highlights. */
  --active-player: rgba(76, 209, 46, 1.00);
  /* The color for player names and scores. */
  --score-color: rgba(255, 206, 0, 1.00);
  /* The color for red team borders. */
  --red-team-color: rgba(240, 18, 70, 1.00);
  /* The color for blue team borders. */
  --blue-team-color: rgba(35, 101, 220, 1.00);
  /* The default border radius for elements such as buttons, tooltip, and other containers. */
  --radius: 4px;
  /* The border radius for card components. */
  --radius-card: 8px;
  /* The background color for sidebars, navigation menus, and other persistent elements. */
  --sidebar: rgba(68, 9, 64, 1.00);
  /* The default color for text or elements that appear on top of sidebars, navigation menus, and other persistent elements. */
  --sidebar-foreground: rgba(255, 255, 255, 1.00);
  /* The primary color used for buttons, links, and other interactive elements in sidebars and navigation menus. */
  --sidebar-primary: rgba(97, 13, 91, 1.00);
  /* The default color for text or elements that appear on top of primary colored elements in sidebars and navigation menus. */
  --sidebar-primary-foreground: rgba(255, 255, 255, 1.00);
  /* The accent color used for highlights, links, and other interactive elements in sidebars and navigation menus. */
  --sidebar-accent: rgba(255, 206, 0, 1.00);
  /* The default color for text or elements that appear on top of accent colored elements in sidebars and navigation menus. */
  --sidebar-accent-foreground: rgba(68, 9, 64, 1.00);
  /* The default border color for elements in sidebars and navigation menus. */
  --sidebar-border: rgba(97, 13, 91, 1.00);
  /* The default color for focus rings, outlines, and other focus indicators in sidebars and navigation menus. */
  --sidebar-ring: rgba(255, 206, 0, 1.00);
  /* Animation angle property for conic gradients */
  --angle: 0deg;
}

.dark {
  --background: rgba(29, 40, 45, 1.00);
  --foreground: rgba(255, 255, 255, 1.00);
  --card: rgba(97, 13, 91, 1.00);
  --card-foreground: rgba(255, 255, 255, 1.00);
  --popover: rgba(97, 13, 91, 1.00);
  --popover-foreground: rgba(255, 255, 255, 1.00);
  --primary: rgba(255, 206, 0, 1.00);
  --primary-foreground: rgba(68, 9, 64, 1.00);
  --secondary: rgba(94, 106, 114, 1.00);
  --secondary-foreground: rgba(255, 255, 255, 1.00);
  --muted: rgba(94, 106, 114, 1.00);
  --muted-foreground: rgba(255, 255, 255, 1.00);
  --accent: rgba(255, 206, 0, 1.00);
  --accent-foreground: rgba(68, 9, 64, 1.00);
  --destructive: rgba(240, 18, 70, 1.00);
  --destructive-foreground: rgba(255, 255, 255, 1.00);
  --border: rgba(255, 206, 0, 1.00);
  --input: rgba(94, 106, 114, 1.00);
  --input-background: rgba(94, 106, 114, 1.00);
  --switch-background: rgba(29, 40, 45, 1.00);
  --ring: rgba(255, 206, 0, 1.00);
  --font-weight-medium: 500;
  --font-weight-normal: 400;
  --chart-1: rgba(35, 101, 220, 1.00);
  --chart-2: rgba(76, 209, 46, 1.00);
  --chart-3: rgba(240, 18, 70, 1.00);
  --chart-4: rgba(255, 206, 0, 1.00);
  --chart-5: rgba(250, 91, 5, 1.00);
  --sidebar: rgba(29, 40, 45, 1.00);
  --sidebar-foreground: rgba(255, 255, 255, 1.00);
  --sidebar-primary: rgba(255, 206, 0, 1.00);
  --sidebar-primary-foreground: rgba(68, 9, 64, 1.00);
  --sidebar-accent: rgba(97, 13, 91, 1.00);
  --sidebar-accent-foreground: rgba(255, 255, 255, 1.00);
  --sidebar-border: rgba(97, 13, 91, 1.00);
  --sidebar-ring: rgba(255, 206, 0, 1.00);
  /* Active player color for indicators */
  --active-player: rgba(76, 209, 46, 1.00);
  /* The color for player names and scores. */
  --score-color: rgba(255, 206, 0, 1.00);
  /* The color for red team borders. */
  --red-team-color: rgba(240, 18, 70, 1.00);
  /* The color for blue team borders. */
  --blue-team-color: rgba(35, 101, 220, 1.00);
  /* Animation angle property for conic gradients */
  --angle: 0deg;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-input-background: var(--input-background);
  --color-switch-background: var(--switch-background);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --radius-sm: calc(var(--radius) - 2px);
  --radius-md: var(--radius);
  --radius-lg: var(--radius-card);
  --radius-xl: calc(var(--radius-card) + 4px);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
  --color-active-player: var(--active-player);
  --color-score-color: var(--score-color);
  --color-red-team-color: var(--red-team-color);
  --color-blue-team-color: var(--blue-team-color);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }

  body {
    @apply text-foreground;
    font-family: 'Quicksand', sans-serif;
  }
  
  /* Ensure div elements can be styled as italic */
  div {
    font-style: inherit;
  }
}

h1 {
  font-family: 'Quicksand', sans-serif;
  font-size: 46px;
  font-weight: var(--font-weight-normal);
  line-height: 1.5;
}

h2 {
  font-family: 'Quicksand', sans-serif;
  font-size: 34px;
  font-weight: var(--font-weight-normal);
  line-height: 1.5;
}

h3 {
  font-family: 'Quicksand', sans-serif;
  font-size: 24px;
  font-weight: var(--font-weight-normal);
  line-height: 1.5;
}

h4 {
  font-family: 'Quicksand', sans-serif;
  font-size: 20px;
  font-weight: var(--font-weight-normal);
  line-height: 1.5;
}

p {
  font-family: 'Quicksand', sans-serif;
  font-size: 17px;
  font-weight: var(--font-weight-normal);
  line-height: 1.5;
}

span {
  font-family: 'Quicksand', sans-serif;
  font-size: 17px;
  font-weight: var(--font-weight-normal);
  line-height: 1.5;
}

label {
  font-family: 'Quicksand', sans-serif;
  font-size: 13px;
  font-weight: var(--font-weight-normal);
  line-height: 1.5;
}

button {
  font-family: 'Quicksand', sans-serif;
  font-size: 17px;
  font-weight: var(--font-weight-normal);
  line-height: 1.5;
}

input {
  font-family: 'Quicksand', sans-serif;
  font-size: 17px;
  font-weight: var(--font-weight-normal);
  line-height: 1.5;
}

html {
  font-size: var(--font-size);
  font-family: 'Quicksand', sans-serif;
}

/* Main game background using pseudo-element to avoid overlaying content */
body {
  min-height: 100vh;
  overflow-x: hidden;
  position: relative;
}

body::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background: 
    /* Hypnotic pattern overlay */
    repeating-radial-gradient(
      circle at center,
      #6C1E67 0px, 
      #6C1E67 20px, 
      transparent 20px, 
      transparent 40px
    ),
    /* Main background gradient */
    repeating-radial-gradient(
      circle,
      #42073E 0%, 
      #5A1554 15%, 
      #6C1E67 35%, 
      #500B46 70%, 
      #42073E 100%
    );
  
  /* Fade mask effect with browser prefixes */
  -webkit-mask: radial-gradient(
    circle at center,
    black 0%, 
    black 50%, 
    rgba(0,0,0,0.8) 70%,
    rgba(0,0,0,0.3) 85%,
    transparent 100%
  );
  mask: radial-gradient(
    circle at center,
    black 0%, 
    black 50%, 
    rgba(0,0,0,0.8) 70%,
    rgba(0,0,0,0.3) 85%,
    transparent 100%
  );
}

/* Alternative simpler version if the above is too complex */
.simple-background {
  background: radial-gradient(
    circle at center,
    #42073E 0%,
    #5A1554 30%,
    #6C1E67 60%,
    #500B46 100%
  );
  min-height: 100vh;
}

/* Game container with backdrop */
.game-container {
  width: 100vw;
  height: 100vh;
  position: relative;
  background: inherit;
}

/* Central playing area */
.dice-area {
  width: 400px;
  height: 400px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  box-shadow: 
    inset 0 0 20px rgba(0, 0, 0, 0.3),
    0 0 40px rgba(108, 30, 103, 0.4);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* Game board styling */
.game-board {
    width: min(70vh, 70vw);
    height: min(70vh, 70vw);
    position: relative;
    z-index: 2;
    overflow: visible; /* Ensure cups are not clipped */
}

/* Game content overlay adjustments to prevent dice-button overlap */
.game-board .absolute.inset-0.flex.flex-col {
    /* Ensure proper vertical spacing distribution */
    justify-content: space-between;
    align-items: center;
    padding-top: clamp(1rem, 3vh, 2rem);
    padding-bottom: clamp(2rem, 5vh, 3rem);
}

.table-background {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: min(70vh, 85vw);
    height: min(70vh, 85vw);
    aspect-ratio: 1;
    border-radius: 50%;
    z-index: 2;
    box-shadow: 0px 4px 16px 10px rgba(0, 0, 0, 0.31);
}

/* Player positioning within game-board */
.player {
    position: absolute;
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: clamp(8px, 10px + 0.25vw, 12px);  /* Fluid spacing between avatar, name, and score */
    padding: clamp(0.5rem, 1rem + 0.25vw, 1.5rem);
    border-radius: var(--radius-card);
    background: transparent;
    border: none;
    min-width: clamp(5rem, 6rem + 1vw, 8rem);
    text-align: center;
    overflow: visible; /* Ensure cups are not clipped */
}

/* Ensure consistent 10px spacing between flex children */
.player > * {
    flex-shrink: 0;  /* Prevent elements from shrinking */
}

.player.top-left {
    top: clamp(-1rem, 2vw - 0.5rem, 1.5rem);
    left: clamp(-1rem, 2vw - 0.5rem, 1.5rem);
}

.player.top-right {
    top: clamp(-1rem, 2vw - 0.5rem, 1.5rem);
    right: clamp(-1rem, 2vw - 0.5rem, 1.5rem);
}

.player.bottom-left {
    bottom: clamp(-1rem, 2vw - 0.5rem, 1.5rem);
    left: clamp(-1rem, 2vw - 0.5rem, 1.5rem);
}

.player.bottom-right {
    bottom: clamp(-1rem, 2vw - 0.5rem, 1.5rem);
    right: clamp(-1rem, 2vw - 0.5rem, 1.5rem);
}

/* Team colors */
.player.red {
    background: transparent;
}

.player.blue {
    background: transparent;
}

/* Active player state */
.player.active {
    border-color: var(--accent);
}

/* Player Avatar with smooth scaling */
.avatar {
    width: clamp(6vh, 8vh + 0.5vw, 10vh);
    height: clamp(6vh, 8vh + 0.5vw, 10vh);
    border-radius: 4px;
    position: relative;
    outline: none;
}

/* Base Border Layer (Always Present) with fluid scaling */
.avatar::after {
    content: '';
    position: absolute;
    inset: clamp(-3px, -0.5vh - 0.1vw, -5px);
    border-radius: clamp(6px, 8px + 0.1vw, 10px);
    z-index: -1;
}

/* Shared background properties for both teams */
.red-team, .blue-team {
    background-size: 70%;
    background-position: center center;
    background-repeat: no-repeat;
    position: relative;
    z-index: 2;
}

.red-team {
    background-image: url("data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%2031%2038%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%3Cg%20id%3D%22player-red%201%22%20clip-path%3D%22url(%23clip0_5_374)%22%3E%0A%3Cpath%20id%3D%22Vector%22%20fill-rule%3D%22evenodd%22%20clip-rule%3D%22evenodd%22%20d%3D%22M15.301%2020C20.8239%2020%2025.301%2015.5228%2025.301%2010C25.301%204.47715%2020.8239%200%2015.301%200C9.77818%200%205.30103%204.47715%205.30103%2010C5.30103%2015.5228%209.77818%2020%2015.301%2020ZM18.6142%2022.5368C20.7391%2021.9277%2023.2394%2022.2808%2024.5115%2024.0886L29.8663%2031.698C31.7313%2034.3482%2029.8357%2038%2026.5951%2038H4.00698C0.766365%2038%20-1.1292%2034.3482%200.735759%2031.698L6.09058%2024.0886C7.3627%2022.2808%209.86297%2021.9277%2011.9879%2022.5368C13.0402%2022.8384%2014.1518%2023%2015.301%2023C16.4503%2023%2017.5619%2022.8384%2018.6142%2022.5368Z%22%20fill%3D%22%23720820%22%2F%3E%0A%3C%2Fg%3E%0A%3Cdefs%3E%0A%3CclipPath%20id%3D%22clip0_5_374%22%3E%0A%3Crect%20width%3D%2231%22%20height%3D%2238%22%20fill%3D%22white%22%2F%3E%0A%3C%2FclipPath%3E%0A%3C%2Fdefs%3E%0A%3C%2Fsvg%3E%0A");
    background-color: #480514;
}

/* Red Team Base Border with fluid scaling */
.red-team::after {
    border: clamp(3px, 4px + 0.1vw, 5px) solid var(--red-team-color);
}

/* Active state border color without transition */
.player.active .red-team::after {
    border-color: #FF1A5C;        /* Slightly brighter when active */
}

.blue-team {
    background-image: url("data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%2031%2038%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%3Cg%20id%3D%22player-blue%201%22%20clip-path%3D%22url(%23clip0_5_754)%22%3E%0A%3Cpath%20id%3D%22Vector%22%20fill-rule%3D%22evenodd%22%20clip-rule%3D%22evenodd%22%20d%3D%22M15.301%2020C20.8239%2020%2025.301%2015.5228%2025.301%2010C25.301%204.47715%2020.8239%200%2015.301%200C9.77818%200%205.30103%204.47715%205.30103%2010C5.30103%2015.5228%209.77818%2020%2015.301%2020ZM18.6142%2022.5368C20.7391%2021.9277%2023.2394%2022.2808%2024.5115%2024.0886L29.8663%2031.698C31.7313%2034.3482%2029.8357%2038%2026.5951%2038H4.00698C0.766365%2038%20-1.1292%2034.3482%200.735759%2031.698L6.09058%2024.0886C7.3627%2022.2808%209.86297%2021.9277%2011.9879%2022.5368C13.0402%2022.8384%2014.1518%2023%2015.301%2023C16.4503%2023%2017.5619%2022.8384%2018.6142%2022.5368Z%22%20fill%3D%22%230F2D62%22%2F%3E%0A%3C%2Fg%3E%0A%3Cdefs%3E%0A%3CclipPath%20id%3D%22clip0_5_754%22%3E%0A%3Crect%20width%3D%2231%22%20height%3D%2238%22%20fill%3D%22white%22%2F%3E%0A%3C%2FclipPath%3E%0A%3C%2Fdefs%3E%0A%3C%2Fsvg%3E%0A");
    background-color: #0A1E42;
}

/* Blue Team Base Border with fluid scaling */
.blue-team::after {
    border: clamp(3px, 4px + 0.1vw, 5px) solid var(--blue-team-color);
}

/* Active state border color without transition */
.player.active .blue-team::after {
    border-color: #3A75EC;        /* Slightly brighter when active */
}

/* Active avatar states with fluid scaling */
.player.active .avatar {
    outline: clamp(3px, 0.4vh + 0.1vw, 6px) solid var(--active-player);
    outline-offset: clamp(2px, 0.3vh + 0.05vw, 4px);
    border-radius: clamp(4px, 5px + 0.05vw, 6px);
}

.player.active .avatar::before {
    content: '';
    position: absolute;
    inset: 0;
    background: conic-gradient(
        rgba(76, 209, 46, 0.5) 0deg,
        transparent 0deg
    );
    animation: conic-effect 15s linear forwards;
    border-radius: 4px;
    z-index: 1;
    pointer-events: none;
    transform: scaleX(-1);
}

.player.active .red-team {
    background-color: #5A0B18;
}

.player.active .blue-team {
    background-color: #0F2A52;
}

/* Player Cup */
.player-cup {
    width: 2rem;
    height: 1.5rem;
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 0 0 var(--radius) var(--radius);
    position: relative;
}

.player-cup::before {
    content: '';
    position: absolute;
    top: -2px;
    left: 50%;
    transform: translateX(-50%);
    width: 1.8rem;
    height: 4px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: var(--radius) var(--radius) 0 0;
}

/* Roll Again Indicator */
.roll-again {
    width: 0.75rem;
    height: 0.75rem;
    border-radius: 50%;
    background: var(--accent);
    opacity: 0;
}

.player.active .roll-again {
    opacity: 1;
}







/* Conic gradient animation for active players */
@keyframes conic-effect {
    0% { 
        background: conic-gradient(
            rgba(76, 209, 46, 0.5) 0deg,
            transparent 0deg
        );
    }
    25% { 
        background: conic-gradient(
            rgba(76, 209, 46, 0.5) 90deg,
            transparent 90deg
        );
    }
    50% { 
        background: conic-gradient(
            rgba(76, 209, 46, 0.5) 180deg,
            transparent 180deg
        );
    }
    75% { 
        background: conic-gradient(
            rgba(76, 209, 46, 0.5) 270deg,
            transparent 270deg
        );
    }
    100% { 
        background: conic-gradient(
            rgba(76, 209, 46, 0.5) 360deg,
            transparent 360deg
        );
    }
}

/* Enhanced mobile border adjustments */
@media (max-width: 767px) {
    .avatar::after {
        inset: clamp(-2px, -0.4vh - 0.2vw, -4px);
        border-radius: clamp(5px, 6px + 0.2vw, 8px);
    }
    
    .red-team::after,
    .blue-team::after {
        border-width: clamp(2px, 3px + 0.2vw, 4px);
    }
    
    .player.active .avatar {
        outline-width: clamp(2px, 0.3vh + 0.15vw, 4px);
        outline-offset: clamp(1px, 0.2vh + 0.1vw, 3px);
        border-radius: clamp(3px, 4px + 0.1vw, 5px);
    }
}

/* Smooth tablet positioning */
@media (min-width: 768px) {
    .player.top-left {
        top: clamp(-1.5rem, 1vw - 0.5rem, 0.5rem);
        left: clamp(-1.5rem, 1vw - 0.5rem, 0.5rem);
    }
    
    .player.top-right {
        top: clamp(-1.5rem, 1vw - 0.5rem, 0.5rem);
        right: clamp(-1.5rem, 1vw - 0.5rem, 0.5rem);
    }
    
    .player.bottom-left {
        bottom: clamp(-1.5rem, 1vw - 0.5rem, 0.5rem);
        left: clamp(-1.5rem, 1vw - 0.5rem, 0.5rem);
    }
    
    .player.bottom-right {
        bottom: clamp(-1.5rem, 1vw - 0.5rem, 0.5rem);
        right: clamp(-1.5rem, 1vw - 0.5rem, 0.5rem);
    }
}

/* Desktop positioning with smooth scaling */
@media (min-width: 1024px) {
    .player.top-left {
        top: clamp(-2rem, -1vw, -0.5rem);
        left: clamp(-2rem, -1vw, -0.5rem);
    }
    
    .player.top-right {
        top: clamp(-2rem, -1vw, -0.5rem);
        right: clamp(-2rem, -1vw, -0.5rem);
    }
    
    .player.bottom-left {
        bottom: clamp(-2rem, -1vw, -0.5rem);
        left: clamp(-2rem, -1vw, -0.5rem);
    }
    
    .player.bottom-right {
        bottom: clamp(-2rem, -1vw, -0.5rem);
        right: clamp(-2rem, -1vw, -0.5rem);
    }
    
    /* Desktop-specific active outline adjustments */
    .player.active .avatar {
        outline-width: clamp(4px, 0.5vh + 0.1vw, 6px);
        outline-offset: clamp(3px, 0.4vh + 0.05vw, 5px);
    }
}

/* Mobile positioning with smooth scaling */
@media (max-width: 767px) {
    .player.top-left { 
        top: clamp(-20vh, -15vh + 2vw, -8vh) !important; 
        left: clamp(-4vh, -2vh + 0.5vw, 0vh) !important; 
    }
    .player.top-right { 
        top: clamp(-20vh, -15vh + 2vw, -8vh) !important; 
        right: clamp(-4vh, -2vh + 0.5vw, 0vh) !important; 
    }
    .player.bottom-left { 
        bottom: clamp(-20vh, -15vh + 2vw, -8vh) !important; 
        left: clamp(-5vh, -3vh + 0.5vw, -1vh) !important; 
    }
    .player.bottom-right { 
        bottom: clamp(-20vh, -15vh + 2vw, -8vh) !important; 
        right: clamp(-4vh, -2vh + 0.5vw, 0vh) !important; 
    }
    
    /* Smooth avatar sizing */
    .avatar {
        width: clamp(5vh, 6vh + 1vw, 7vh);
        height: clamp(5vh, 6vh + 1vw, 7vh);
    }
    
    /* Responsive spacing and text sizing */
    .player {
        gap: clamp(6px, 8px + 0.5vw, 10px);
    }
    
    .player-name {
        font-size: clamp(16px, 18px + 0.5vw, 20px) !important;
    }
    
    .player-score {
        font-size: clamp(20px, 22px + 0.5vw, 24px) !important;
    }
}

/* Fine-tuning for very small screens */
@media (max-width: 480px) {
    .player.top-left { 
        top: clamp(-22vh, -18vh + 1vw, -12vh) !important; 
        left: clamp(-3vh, -1vh, 1vh) !important; 
    }
    .player.top-right { 
        top: clamp(-22vh, -18vh + 1vw, -12vh) !important; 
        right: clamp(-3vh, -1vh, 1vh) !important; 
    }
    .player.bottom-left { 
        bottom: clamp(-22vh, -18vh + 1vw, -12vh) !important; 
        left: clamp(-4vh, -2vh, 0vh) !important; 
    }
    .player.bottom-right { 
        bottom: clamp(-22vh, -18vh + 1vw, -12vh) !important; 
        right: clamp(-3vh, -1vh, 1vh) !important; 
    }
}

/* Dice styling - both SVG assets and placeholder numbers */
.dice-container {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  overflow: visible;
  position: relative;
}

/* Default Dice Shadow */
.dice {
  filter: drop-shadow(5px 5px 4px rgba(0, 0, 0, 0.50));
}

/* When Dice Scores (Matching) */
.dice.matching {
  filter: drop-shadow(0 0 10px #4CD12E) drop-shadow(5px 5px 4px rgba(0, 0, 0, 0.50));
}

/* Ensure imported dice SVGs scale properly */
.dice-container [data-name*="dice"] {
  width: 100%;
  height: 100%;
  display: block;
}

.dice-container [data-name*="dice"] img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* Handle dice-1, dice-2, dice-3, dice-4, dice-5, dice-6, and roll assets */
.dice-container [data-name="dice-1 1"],
.dice-container [data-name="dice-2 1"],
.dice-container [data-name="dice-3 1"],
.dice-container [data-name="dice-4 1"],
.dice-container [data-name="dice-5 1"],
.dice-container [data-name="dice-6 1"],
.dice-container [data-name="roll-1 1"],
.dice-container [data-name="roll-2 1"] {
  width: 100%;
  height: 100%;
  display: block;
}

.dice-container [data-name="dice-1 1"] img,
.dice-container [data-name="dice-2 1"] img,
.dice-container [data-name="dice-3 1"] img,
.dice-container [data-name="dice-4 1"] img,
.dice-container [data-name="dice-5 1"] img,
.dice-container [data-name="dice-6 1"] img,
.dice-container [data-name="roll-1 1"] img,
.dice-container [data-name="roll-2 1"] img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* Dice placeholder styling for numbers 2-6 */
.dice-placeholder {
  width: 80px;
  height: 80px;
  background: #f0f0f0;
  border: 2px solid #333;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  margin: 0;
  box-shadow: none;
}

.dice-placeholder.matching {
  border-color: transparent;
  box-shadow: none;
}

/* Enhanced dice animations */
.dice-roll-animation {
  animation: diceRoll 0.6s ease-out;
}

@keyframes diceRoll {
  0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
  25% { transform: rotateX(90deg) rotateY(180deg) rotateZ(45deg); }
  50% { transform: rotateX(180deg) rotateY(360deg) rotateZ(90deg); }
  75% { transform: rotateX(270deg) rotateY(540deg) rotateZ(135deg); }
  100% { transform: rotateX(360deg) rotateY(720deg) rotateZ(180deg); }
}

/* Score indicator animations */
.score-indicator {
  animation: scorePopup 1s ease-out forwards;
}

@keyframes scorePopup {
  0% { 
    transform: scale(0) translateY(0px); 
    opacity: 0; 
  }
  50% { 
    transform: scale(1.2) translateY(-10px); 
    opacity: 1; 
  }
  100% { 
    transform: scale(1) translateY(-20px); 
    opacity: 0.8; 
  }
}

/* Old matching effects removed - now using drop-shadow filters above */

/* CSS Custom Properties for consistency */
:root {
  --bg-primary: #42073E;
  --bg-secondary: #5A1554;
  --bg-tertiary: #6C1E67;
  --bg-accent: #500B46;
  --overlay-light: rgba(255, 255, 255, 0.1);
  --overlay-border: rgba(255, 255, 255, 0.2);
}

/* Dice Trajectory Animation Styles */
.trajectory-dice-container {
  position: absolute;
  z-index: 15;
  pointer-events: none;
}

/* Ensure all trajectory elements don't block clicks */
.trajectory-dice-container,
.trajectory-dice-container * {
  pointer-events: none !important;
}

/* Hit area indicator styles */
/* .hit-area-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 2px dashed var(--accent);
  border-radius: 50%;
  opacity: 0.3;
  z-index: 5;
  pointer-events: none;
} */

/* Trajectory path visualization (for debugging) */
/* .trajectory-path {
  position: absolute;
  width: 2px;
  background: var(--accent);
  opacity: 0.3;
  z-index: 1;
  pointer-events: none;
} */

/* Impact effects */
.impact-ripple {
  position: absolute;
  border: 2px solid var(--accent);
  border-radius: 50%;
  pointer-events: none;
}

.dust-particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: var(--accent);
  border-radius: 50%;
  pointer-events: none;
}

/* Enhanced dice shadows during trajectory */
.dice-container.trajectory-active {
  filter: drop-shadow(8px 8px 6px rgba(0, 0, 0, 0.7)) drop-shadow(0 0 15px rgba(76, 209, 46, 0.3));
}

/* Landing zone highlight */
.landing-zone {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 240px;
  height: 240px;
  border: 3px solid var(--accent);
  border-radius: 50%;
  opacity: 0;
  z-index: 4;
  pointer-events: none;
  animation: pulseZone 2s ease-in-out infinite;
}

@keyframes pulseZone {
  0%, 100% { 
    opacity: 0; 
    transform: translate(-50%, -50%) scale(1);
  }
  50% { 
    opacity: 0.6; 
    transform: translate(-50%, -50%) scale(1.05);
  }
}

/* Trajectory motion blur effect */
.dice.in-flight {
  filter: blur(1px) drop-shadow(5px 5px 4px rgba(0, 0, 0, 0.50)) drop-shadow(0 0 8px rgba(255, 206, 0, 0.3));
}

/* Trajectory dice styling */
.trajectory-dice {
  position: absolute;
  width: 60px;
  height: 60px;
  background-size: contain;
  z-index: 100;
  pointer-events: none;
  transition: none;
}

.trajectory-dice.bouncing {
  animation: tableBounce 0.3s ease-out;
}

@keyframes tableBounce {
  0% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-20px) scale(1.1); }
  100% { transform: translateY(0) scale(1); }
}

/* 5-Phase Natural Dice Animation Styles */

/* Phase 1: Setup - Dice at player position with glow */
.trajectory-dice-container.phase-setup {
  filter: drop-shadow(0 0 20px rgba(255, 206, 0, 0.8)) 
          drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.5));
}

.dice-setup-glow {
  animation: setupGlow 0.2s ease-out;
}

@keyframes setupGlow {
  0% { 
    transform: scale(1);
    filter: brightness(1);
  }
  50% { 
    transform: scale(1.05);
    filter: brightness(1.2) drop-shadow(0 0 15px rgba(255, 206, 0, 0.6));
  }
  100% { 
    transform: scale(1.1);
    filter: brightness(1.1) drop-shadow(0 0 20px rgba(255, 206, 0, 0.8));
  }
}

/* Phase 2: Flight - Realistic arc trajectory */
.trajectory-dice-container.phase-flight {
  filter: drop-shadow(0 0 15px rgba(255, 206, 0, 0.6)) 
          drop-shadow(4px 4px 8px rgba(0, 0, 0, 0.6))
          blur(0.5px);
}

.dice.in-flight {
  animation: flightMotionBlur 1.2s ease-out;
}

@keyframes flightMotionBlur {
  0% { 
    filter: blur(0px);
    transform: scale(0.8);
  }
  50% { 
    filter: blur(1px);
    transform: scale(1);
  }
  100% { 
    filter: blur(0.5px);
    transform: scale(1.2);
  }
}

/* Phase 3: Bounce - Table impact with compression */
.trajectory-dice-container.phase-bounce {
  filter: drop-shadow(0 0 25px rgba(240, 18, 70, 0.8)) 
          drop-shadow(6px 6px 10px rgba(0, 0, 0, 0.7));
}

.dice-bouncing {
  animation: diceCompress 0.3s ease-out;
}

@keyframes diceCompress {
  0% { 
    transform: scaleY(1) scaleX(1);
  }
  30% { 
    transform: scaleY(0.85) scaleX(1.15); /* Compression effect */
  }
  60% { 
    transform: scaleY(1.1) scaleX(0.95); /* Rebound */
  }
  100% { 
    transform: scaleY(1) scaleX(1);
  }
}

/* Phase 4: Rolling - Rhythmic roll animation */
.trajectory-dice-container.phase-rolling {
  filter: drop-shadow(0 0 12px rgba(76, 209, 46, 0.6)) 
          drop-shadow(4px 4px 6px rgba(0, 0, 0, 0.5));
}

.rolling-dice {
  animation: rhythmicRoll 1s linear;
}

@keyframes rhythmicRoll {
  0% { 
    transform: rotate(0deg);
    filter: blur(0px);
  }
  25% { 
    transform: rotate(90deg);
    filter: blur(0.5px);
  }
  50% { 
    transform: rotate(180deg);
    filter: blur(1px);
  }
  75% { 
    transform: rotate(270deg);
    filter: blur(0.5px);
  }
  100% { 
    transform: rotate(360deg);
    filter: blur(0px);
  }
}

/* Rolling dice should have slight wiggle */
.trajectory-dice-container.phase-rolling .rolling-dice {
  animation: rollWiggle 0.1s ease-in-out infinite alternate;
}

@keyframes rollWiggle {
  0% { 
    transform: translateX(-1px) translateY(0px) rotate(0deg);
  }
  100% { 
    transform: translateX(1px) translateY(-0.5px) rotate(2deg);
  }
}

/* Phase 5: Reveal - Smooth transition to final values */
.trajectory-dice-container.phase-reveal {
  filter: drop-shadow(0 0 15px rgba(76, 209, 46, 0.8)) 
          drop-shadow(3px 3px 6px rgba(0, 0, 0, 0.5));
}

.final-dice {
  animation: diceReveal 0.5s ease-in-out;
}

@keyframes diceReveal {
  0% { 
    opacity: 0;
    transform: scale(0.9);
    filter: blur(2px);
  }
  60% { 
    opacity: 0.7;
    transform: scale(1.05);
    filter: blur(0px);
  }
  100% { 
    opacity: 1;
    transform: scale(1);
    filter: blur(0px);
  }
}

/* Enhanced setup dice glow */
.setup-dice {
  position: relative;
}

.setup-dice::before {
  content: '';
  position: absolute;
  inset: -5px;
  background: radial-gradient(circle, rgba(255, 206, 0, 0.3) 0%, transparent 70%);
  border-radius: 12px;
  z-index: -1;
  animation: glowPulse 0.2s ease-out;
}

@keyframes glowPulse {
  0% { 
    opacity: 0;
    transform: scale(0.8);
  }
  100% { 
    opacity: 1;
    transform: scale(1);
  }
}

/* Table shake effect during bounce phase */
.table-background.shake {
  animation: tableShake 0.3s ease-out;
}

@keyframes tableShake {
  0%, 100% { 
    transform: translate(-50%, -50%);
  }
  25% { 
    transform: translate(-50.5%, -50%);
  }
  75% { 
    transform: translate(-49.5%, -50%);
  }
}

/* Enhanced trajectory effects */
.trajectory-dice-container.phase-flying {
  filter: drop-shadow(0 0 15px rgba(255, 206, 0, 0.4)) drop-shadow(3px 3px 6px rgba(0, 0, 0, 0.6));
}

.trajectory-dice-container.phase-ricochet {
  filter: drop-shadow(0 0 20px rgba(240, 18, 70, 0.6)) drop-shadow(5px 5px 8px rgba(0, 0, 0, 0.7));
}

.trajectory-dice-container.phase-landing {
  filter: drop-shadow(0 0 12px rgba(76, 209, 46, 0.4)) drop-shadow(4px 4px 6px rgba(0, 0, 0, 0.5));
}

/* Player position mapping for trajectory start points */
.trajectory-start-top-left {
  transform: translate(-180px, -180px);
}

.trajectory-start-top-right {
  transform: translate(180px, -180px);
}

.trajectory-start-bottom-left {
  transform: translate(-180px, 180px);
}

.trajectory-start-bottom-right {
  transform: translate(180px, 180px);
}

/* Ensure trajectory container has proper positioning context */
.game-board {
  position: relative;
  overflow: visible;
}

/* Enhanced table area for trajectory targeting */
.table-background {
  position: relative;
  z-index: 1;
}

/* Debug mode enhancements */
/* .hit-area-debug {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 20;
}

.hit-area-debug .hit-area-circle {
  border: 2px solid rgba(34, 197, 94, 0.6);
  background: rgba(34, 197, 94, 0.15);
  border-radius: 50%;
  box-shadow: 
    inset 0 0 20px rgba(34, 197, 94, 0.2),
    0 0 10px rgba(34, 197, 94, 0.3);
}

.hit-area-debug .scatter-area-circle {
  border: 1px dashed rgba(34, 197, 94, 0.8);
  background: rgba(34, 197, 94, 0.08);
  border-radius: 50%;
}

.hit-area-debug .center-point {
  width: 8px;
  height: 8px;
  background: rgba(34, 197, 94, 1);
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(34, 197, 94, 0.8);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.hit-area-debug .dimensions-info {
  background: rgba(0, 0, 0, 0.9);
  color: rgba(34, 197, 94, 1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 4px;
  padding: 8px 12px;
  font-family: 'Courier New', monospace;
  font-size: 11px;
  line-height: 1.3;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
}

/* Trajectory calculations with dynamic sizing */
.trajectory-calculation-debug {
  position: fixed;
  top: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.8);
  color: #22c55e;
  padding: 10px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 12px;
  z-index: 1000;
  border: 1px solid rgba(34, 197, 94, 0.3);
} */

/* Responsive table calculations */
@media (max-width: 768px) {
  .table-background {
    /* Ensure consistent sizing for mobile calculations */
    width: min(70vh, 85vw);
    height: min(70vh, 85vw);
  }
}

@media (min-width: 769px) {
  .table-background {
    /* Ensure consistent sizing for desktop calculations */
    width: min(70vh, 85vw);
    height: min(70vh, 85vw);
  }
}

/* Skewed text styling for italic effect - maximum specificity */
.game-container .player .player-name,
.game-container [data-player-id] .player-name,
div[data-player-id] div.player-name,
.player > .player-name,
.player-name {
    transform: skew(-12deg) !important;
    font-weight: 700 !important;
    color: var(--score-color) !important;
    font-family: 'Quicksand', 'Inter', sans-serif !important;
    font-size: clamp(16px, 20px + 0.25vw, 22px) !important;
    line-height: 1.2 !important;
    text-shadow: 1px 1px 0px rgba(0, 0, 0, 0.4) !important;
    margin: 0 !important;
    padding: 0 !important;
    display: inline-block !important;
}

.game-container .player .player-score,
.game-container [data-player-id] .player-score,
div[data-player-id] div.player-score,
.player > .player-score,
.player-score {
    transform: skew(-12deg) !important;
    font-weight: 700 !important;
    color: var(--score-color) !important;
    font-family: 'Quicksand', 'Inter', sans-serif !important;
    font-size: clamp(20px, 24px + 0.25vw, 26px) !important;
    line-height: 1.2 !important;
    text-shadow: 1px 1px 0px rgba(0, 0, 0, 0.4) !important;
    margin: 0 !important;
    padding: 0 !important;
    display: inline-block !important;
}

/* Additional skew targeting */
div.player-name,
div.player-score {
    transform: skew(-12deg) !important;
    display: inline-block !important;
}

/* Interactive Cup Styling */
.player div[role="button"] {
  border-radius: 8px;
}

/* Active Cup Effects */
.player div[role="button"]:not(:focus) {
  filter: drop-shadow(2px 2px 11px #4CD12E) drop-shadow(0px 0px 1px #4CD12E);
  animation: pulseGlow 2s infinite;
}

/* Disabled Cup Effects (when rolling) */
.player div[role="button"][style*="opacity: 0.5"] {
  filter: drop-shadow(2px 2px 6px rgba(76, 209, 46, 0.3)) drop-shadow(0px 0px 1px rgba(76, 209, 46, 0.3)) grayscale(20%) !important;
  animation: none !important;
  cursor: default !important;
  pointer-events: none !important;
}

@keyframes pulseGlow {
    0% { filter: drop-shadow(2px 2px 11px #4CD12E) drop-shadow(0px 0px 1px #4CD12E); }
    50% { filter: drop-shadow(2px 2px 15px #4CD12E) drop-shadow(0px 0px 2px #4CD12E); }
    100% { filter: drop-shadow(2px 2px 11px #4CD12E) drop-shadow(0px 0px 1px #4CD12E); }
}

.player div[role="button"]:focus {
  outline: none;
  /* Override the pulsing when focused */
  filter: drop-shadow(2px 2px 15px #4CD12E) drop-shadow(0px 0px 2px #4CD12E);
  animation: none;
}

/* Ensure SVGs inside interactive cups don't interfere with clicks */
.player div[role="button"] svg,
.player div[role="button"] * {
  pointer-events: none !important;
}

/* Cup Shake Animation - Enhanced rotation-based shake around center */
@keyframes cupShake {
  0% { transform: rotate(0deg); }
  5% { transform: rotate(-6deg); }
  12% { transform: rotate(14deg); }
  20% { transform: rotate(-18deg); }
  28% { transform: rotate(16deg); }
  36% { transform: rotate(-14deg); }
  44% { transform: rotate(12deg); }
  52% { transform: rotate(-8deg); }
  60% { transform: rotate(6deg); }
  68% { transform: rotate(-4deg); }
  76% { transform: rotate(3deg); }
  84% { transform: rotate(-2deg); }
  92% { transform: rotate(1deg); }
  96% { transform: rotate(-0.5deg); }
  100% { transform: rotate(0deg); }
}

/* Position-specific shake animations that preserve original transforms */

/* Top-left: rotate(180deg) + shake */
@keyframes cupShakeTopLeft {
  0% { transform: rotate(180deg) rotateZ(0deg); }
  5% { transform: rotate(180deg) rotateZ(-6deg); }
  12% { transform: rotate(180deg) rotateZ(14deg); }
  20% { transform: rotate(180deg) rotateZ(-18deg); }
  28% { transform: rotate(180deg) rotateZ(16deg); }
  36% { transform: rotate(180deg) rotateZ(-14deg); }
  44% { transform: rotate(180deg) rotateZ(12deg); }
  52% { transform: rotate(180deg) rotateZ(-8deg); }
  60% { transform: rotate(180deg) rotateZ(6deg); }
  68% { transform: rotate(180deg) rotateZ(-4deg); }
  76% { transform: rotate(180deg) rotateZ(3deg); }
  84% { transform: rotate(180deg) rotateZ(-2deg); }
  92% { transform: rotate(180deg) rotateZ(1deg); }
  96% { transform: rotate(180deg) rotateZ(-0.5deg); }
  100% { transform: rotate(180deg) rotateZ(0deg); }
}

/* Top-right: rotate(180deg) scaleX(-1) + shake */
@keyframes cupShakeTopRight {
  0% { transform: rotate(180deg) scaleX(-1) rotateZ(0deg); }
  5% { transform: rotate(180deg) scaleX(-1) rotateZ(-6deg); }
  12% { transform: rotate(180deg) scaleX(-1) rotateZ(14deg); }
  20% { transform: rotate(180deg) scaleX(-1) rotateZ(-18deg); }
  28% { transform: rotate(180deg) scaleX(-1) rotateZ(16deg); }
  36% { transform: rotate(180deg) scaleX(-1) rotateZ(-14deg); }
  44% { transform: rotate(180deg) scaleX(-1) rotateZ(12deg); }
  52% { transform: rotate(180deg) scaleX(-1) rotateZ(-8deg); }
  60% { transform: rotate(180deg) scaleX(-1) rotateZ(6deg); }
  68% { transform: rotate(180deg) scaleX(-1) rotateZ(-4deg); }
  76% { transform: rotate(180deg) scaleX(-1) rotateZ(3deg); }
  84% { transform: rotate(180deg) scaleX(-1) rotateZ(-2deg); }
  92% { transform: rotate(180deg) scaleX(-1) rotateZ(1deg); }
  96% { transform: rotate(180deg) scaleX(-1) rotateZ(-0.5deg); }
  100% { transform: rotate(180deg) scaleX(-1) rotateZ(0deg); }
}

/* Bottom-left: scaleX(-1) + shake */
@keyframes cupShakeBottomLeft {
  0% { transform: scaleX(-1) rotateZ(0deg); }
  5% { transform: scaleX(-1) rotateZ(-6deg); }
  12% { transform: scaleX(-1) rotateZ(14deg); }
  20% { transform: scaleX(-1) rotateZ(-18deg); }
  28% { transform: scaleX(-1) rotateZ(16deg); }
  36% { transform: scaleX(-1) rotateZ(-14deg); }
  44% { transform: scaleX(-1) rotateZ(12deg); }
  52% { transform: scaleX(-1) rotateZ(-8deg); }
  60% { transform: scaleX(-1) rotateZ(6deg); }
  68% { transform: scaleX(-1) rotateZ(-4deg); }
  76% { transform: scaleX(-1) rotateZ(3deg); }
  84% { transform: scaleX(-1) rotateZ(-2deg); }
  92% { transform: scaleX(-1) rotateZ(1deg); }
  96% { transform: scaleX(-1) rotateZ(-0.5deg); }
  100% { transform: scaleX(-1) rotateZ(0deg); }
}

/* Bottom-right: no base transform + shake */
@keyframes cupShakeBottomRight {
  0% { transform: rotateZ(0deg); }
  5% { transform: rotateZ(-6deg); }
  12% { transform: rotateZ(14deg); }
  20% { transform: rotateZ(-18deg); }
  28% { transform: rotateZ(16deg); }
  36% { transform: rotateZ(-14deg); }
  44% { transform: rotateZ(12deg); }
  52% { transform: rotateZ(-8deg); }
  60% { transform: rotateZ(6deg); }
  68% { transform: rotateZ(-4deg); }
  76% { transform: rotateZ(3deg); }
  84% { transform: rotateZ(-2deg); }
  92% { transform: rotateZ(1deg); }
  96% { transform: rotateZ(-0.5deg); }
  100% { transform: rotateZ(0deg); }
}

/* Cup shake animations that preserve existing transforms */
.cup-shaking {
  animation: cupShake 0.9s ease-out 1;
  transform-origin: center;
}

/* Position-specific shake classes */
.player.top-left .cup-shaking {
  animation: cupShakeTopLeft 0.9s ease-out 1;
  transform-origin: center;
}

.player.top-right .cup-shaking {
  animation: cupShakeTopRight 0.9s ease-out 1;
  transform-origin: center;
}

.player.bottom-left .cup-shaking {
  animation: cupShakeBottomLeft 0.9s ease-out 1;
  transform-origin: center;
}

.player.bottom-right .cup-shaking {
  animation: cupShakeBottomRight 0.9s ease-out 1;
  transform-origin: center;
}
