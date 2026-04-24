<template>
  <view class="app-shell">
    <router-view />
  </view>
</template>

<style lang="scss">
@import "./styles/tokens.scss";

@property --field-spin {
  syntax: "<angle>";
  inherits: false;
  initial-value: 0deg;
}

@property --pulse-x {
  syntax: "<percentage>";
  inherits: false;
  initial-value: 18%;
}

page,
body {
  min-height: 100%;
  background:
    radial-gradient(circle at var(--pulse-x) 10%, oklch(66% 0.22 326 / 0.18), transparent 28rem),
    radial-gradient(circle at 82% 16%, oklch(70% 0.14 195 / 0.16), transparent 30rem),
    conic-gradient(from var(--field-spin) at 50% -10%, oklch(11% 0.028 260), oklch(18% 0.045 240), oklch(12% 0.036 285), oklch(11% 0.028 260));
  color: var(--ink);
  font-family: var(--font-body);
  animation: field-shift 14s linear infinite;
}

* {
  box-sizing: border-box;
}

button,
input {
  font: inherit;
}

.app-shell {
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  isolation: isolate;
}

.app-shell::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: -2;
  pointer-events: none;
  opacity: 0.56;
  background-image:
    linear-gradient(90deg, oklch(72% 0.14 194 / 0.08) 1px, transparent 1px),
    linear-gradient(0deg, oklch(72% 0.14 194 / 0.065) 1px, transparent 1px),
    radial-gradient(circle at 50% 50%, oklch(72% 0.18 332 / 0.14) 0 1px, transparent 1px 100%);
  background-size: 64px 64px, 64px 64px, 22px 22px;
  mask-image: radial-gradient(ellipse at 50% 8%, rgb(1 1 1), transparent 74%);
}

.app-shell::after {
  content: "";
  position: fixed;
  inset: -18%;
  z-index: -1;
  pointer-events: none;
  background:
    linear-gradient(112deg, transparent 0 42%, oklch(72% 0.14 194 / 0.16) 48%, transparent 55% 100%),
    linear-gradient(28deg, transparent 0 58%, oklch(72% 0.18 332 / 0.12) 64%, transparent 72% 100%);
  filter: blur(18px);
  transform: translate3d(-10%, -4%, 0) rotate(8deg);
  animation: aurora-pass 8s var(--ease-snap) infinite alternate;
}

@keyframes field-shift {
  0% {
    --field-spin: 0deg;
    --pulse-x: 18%;
  }

  50% {
    --pulse-x: 64%;
  }

  100% {
    --field-spin: 360deg;
    --pulse-x: 18%;
  }
}

@keyframes aurora-pass {
  from {
    transform: translate3d(-12%, -5%, 0) rotate(6deg);
    opacity: 0.42;
  }

  to {
    transform: translate3d(8%, 3%, 0) rotate(12deg);
    opacity: 0.72;
  }
}

@media (prefers-reduced-motion: reduce) {
  page,
  body,
  .app-shell::after {
    animation-duration: 1ms;
    animation-iteration-count: 1;
  }
}
</style>
