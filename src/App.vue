<template>
  <view class="app-shell">
    <router-view />
  </view>
</template>

<style lang="scss">
@import "./styles/tokens.scss";

page,
body {
  min-height: 100%;
  background:
    radial-gradient(circle at 18% 12%, oklch(92% 0.025 85 / 0.7), transparent 28rem),
    linear-gradient(135deg, oklch(96% 0.014 89), oklch(91% 0.018 82));
  color: var(--ink);
  font-family: var(--font-body);
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
}

.app-shell::before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  opacity: 0.42;
  background-image:
    linear-gradient(90deg, oklch(37% 0.035 94 / 0.04) 1px, transparent 1px),
    linear-gradient(0deg, oklch(37% 0.035 94 / 0.035) 1px, transparent 1px);
  background-size: 72px 72px;
  mask-image: linear-gradient(to bottom, rgb(1 1 1) 0%, transparent 72%);
}
</style>
