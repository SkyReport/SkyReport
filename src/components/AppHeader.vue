<template>
  <header class="app-header">
    <div class="brand">
      <slot name="brand">
        <div class="brand-mark">
          <img src="/logo_skyvote.jpeg" alt="SkyVote" class="brand-mark-img" />
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
  width: 44px;
  height: 44px;
  flex-shrink: 0;
}

.brand-mark-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 10px;
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
