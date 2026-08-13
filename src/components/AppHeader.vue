<template>
  <header class="app-header">
    <div class="brand">
      <slot name="brand">
        <div class="brand-mark">
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 2 17 6v8l-7 4-7-4V6l7-4Z"
              stroke="white"
              stroke-width="1.4"
              stroke-linejoin="round"
            />
            <path d="M10 2v16M3 6l14 8M17 6 3 14" stroke="white" stroke-width="1" opacity="0.45" />
          </svg>
        </div>
        <div class="brand-text">
          <span class="brand-title">SkyVote</span>
          <span class="brand-subtitle">InJourney Management System</span>
        </div>
      </slot>
    </div>
    <div class="header-actions">
      <slot name="actions" />
    </div>
  </header>
</template>

<script setup></script>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  align-self: stretch;
  width: 100%;
  height: 64px;
  padding: 0 24px;
  background-color: var(--color-surface);
  box-shadow: var(--shadow-sm);
  position: relative;
  z-index: 10;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-mark {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent-cyan-strong) 100%);
  box-shadow: 0 2px 8px rgba(0, 93, 172, 0.35);
}

.brand-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 1px;
  min-width: 0;
}

.brand-title {
  color: var(--color-primary);
  font-family: var(--font-sans);
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.2px;
  white-space: nowrap;
}

.brand-subtitle {
  color: var(--color-text-muted);
  font-family: var(--font-sans);
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}
</style>
