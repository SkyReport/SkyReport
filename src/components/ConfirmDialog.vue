<template>
  <teleport to="body">
    <transition name="confirm-fade">
      <div v-if="visible" class="confirm-overlay" @click.self="$emit('cancel')">
        <div class="confirm-card" role="alertdialog" aria-modal="true">
          <h2 class="confirm-title">{{ title }}</h2>
          <p class="confirm-message">{{ message }}</p>
          <div class="confirm-actions">
            <button type="button" class="confirm-btn confirm-btn-secondary" @click="$emit('cancel')">
              {{ cancelText }}
            </button>
            <button
              type="button"
              class="confirm-btn"
              :class="danger ? 'confirm-btn-danger' : 'confirm-btn-primary'"
              @click="$emit('confirm')"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
defineProps({
  visible: { type: Boolean, default: false },
  title: { type: String, default: "Konfirmasi" },
  message: { type: String, default: "Apakah Anda yakin?" },
  confirmText: { type: String, default: "Ya" },
  cancelText: { type: String, default: "Batal" },
  danger: { type: Boolean, default: false },
});
defineEmits(["confirm", "cancel"]);
</script>

<style scoped>
.confirm-overlay {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 23, 42, 0.45);
  backdrop-filter: blur(4px);
  padding: 16px;
}

.confirm-card {
  width: 100%;
  max-width: 380px;
  background-color: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 24px;
  font-family: var(--font-sans);
}

.confirm-title {
  margin: 0 0 8px;
  font-size: 17px;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: var(--color-text);
}

.confirm-message {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: var(--color-text-muted);
}

.confirm-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.confirm-btn {
  padding: 9px 16px;
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 600;
  border: 1px solid transparent;
  cursor: pointer;
}

.confirm-btn-secondary {
  background-color: var(--color-surface);
  border-color: var(--color-border);
  color: var(--color-text-secondary);
}

.confirm-btn-secondary:hover {
  background-color: var(--color-bg);
}

.confirm-btn-primary {
  background-color: var(--color-primary);
  color: #ffffff;
}

.confirm-btn-primary:hover {
  background-color: var(--color-primary-dark);
}

.confirm-btn-danger {
  background-color: var(--color-danger);
  color: #ffffff;
}

.confirm-btn-danger:hover {
  filter: brightness(0.92);
}

.confirm-fade-enter-active,
.confirm-fade-leave-active {
  transition: opacity 0.15s ease;
}

.confirm-fade-enter-from,
.confirm-fade-leave-to {
  opacity: 0;
}

.confirm-fade-enter-active .confirm-card,
.confirm-fade-leave-active .confirm-card {
  transition: transform 0.15s ease;
}

.confirm-fade-enter-from .confirm-card,
.confirm-fade-leave-to .confirm-card {
  transform: scale(0.96);
}
</style>
