<template>
  <header class="app-header">
    <div class="brand">
      <slot name="brand">
        <span class="brand-title">Survey Central</span>
        <span class="brand-subtitle">InJourney Management System</span>
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
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 1px;
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
