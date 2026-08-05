<template>
  <div class="login-page">
    <div class="bg-blob bg-blob-1" aria-hidden="true" />
    <div class="bg-blob bg-blob-2" aria-hidden="true" />
    <div class="bg-blob bg-blob-3" aria-hidden="true" />
    <div class="bg-blob bg-blob-4" aria-hidden="true" />

    <AppHeader />

    <main class="main-content">
      <form class="card" :class="{ shake: shakeError }" @submit.prevent="handleSubmit">
        <div class="card-heading">
          <h1 class="card-title">Login Admin</h1>
          <p class="card-subtitle">Masuk untuk mengakses SkyVote.</p>
        </div>

        <div class="field field-1">
          <label class="field-label" for="email">Email</label>
          <input
            id="email"
            v-model.trim="email"
            type="email"
            class="input"
            placeholder="admin@injourneyairports.id"
            autocomplete="username"
            required
          />
        </div>

        <div class="field field-2">
          <label class="field-label" for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            class="input"
            placeholder="••••••••"
            autocomplete="current-password"
            required
          />
        </div>

        <button type="submit" class="submit-button field-3" :disabled="loading">
          <span v-if="loading" class="spinner" aria-hidden="true" />
          {{ loading ? "Memproses..." : "Masuk" }}
        </button>
      </form>
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import AppHeader from "./components/AppHeader.vue";
import { useAuthStore } from "./stores/authStore";
import { useToastStore } from "./stores/toastStore";

const authStore = useAuthStore();
const toast = useToastStore();
const router = useRouter();

const email = ref("");
const password = ref("");
const loading = ref(false);
const shakeError = ref(false);

async function handleSubmit() {
  loading.value = true;
  try {
    await authStore.signIn(email.value, password.value);
    router.push("/admin/management");
  } catch (err) {
    toast.show(err.message || "Email atau password salah.", "error");
    shakeError.value = true;
    setTimeout(() => {
      shakeError.value = false;
    }, 420);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.login-page {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--color-bg);
}

.main-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 24px;
}

.card {
  width: 100%;
  max-width: 400px;
  padding: 28px;
  border-radius: var(--radius-lg);
  background-color: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow);
  display: flex;
  flex-direction: column;
  gap: 20px;
  animation: card-enter 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.card.shake {
  animation: shake 0.42s ease-in-out;
}

.card-heading,
.field-1,
.field-2,
.field-3 {
  animation: field-enter 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.card-heading {
  animation-delay: 0.05s;
}

.field-1 {
  animation-delay: 0.12s;
}

.field-2 {
  animation-delay: 0.19s;
}

.field-3 {
  animation-delay: 0.26s;
}

@keyframes card-enter {
  from {
    opacity: 0;
    transform: translateY(24px) scale(0.98);
  }
  to {
    opacity: 1;
  }
}

@keyframes field-enter {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
  }
}

@keyframes shake {
  10%, 90% { transform: translateX(-1px); }
  20%, 80% { transform: translateX(3px); }
  30%, 50%, 70% { transform: translateX(-6px); }
  40%, 60% { transform: translateX(6px); }
}

@media (prefers-reduced-motion: reduce) {
  .card,
  .card-heading,
  .field-1,
  .field-2,
  .field-3,
  .card.shake {
    animation: none !important;
  }
}

.card-heading {
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: center;
}

.card-title {
  color: var(--color-text);
  font-size: 20px;
  font-weight: 700;
}

.card-subtitle {
  color: var(--color-text-muted);
  font-size: 14px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.field-label {
  color: var(--color-text-secondary);
  font-size: 12px;
  font-weight: 500;
}

.input {
  width: 100%;
  height: 40px;
  padding: 0 12px;
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: 14px;
  color: var(--color-text);
  background-color: var(--color-surface);
  transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.15s ease;
}

.input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(0, 93, 172, 0.16);
  transform: translateY(-1px);
}

.submit-button {
  height: 40px;
  border: none;
  border-radius: var(--radius-md);
  background-color: var(--color-primary);
  color: #ffffff;
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background-color 0.15s ease, box-shadow 0.2s ease, transform 0.15s ease;
}

.submit-button:hover:not(:disabled) {
  background-color: var(--color-primary-dark);
  box-shadow: 0 4px 14px rgba(0, 93, 172, 0.35);
  transform: translateY(-1px);
}

.submit-button:active:not(:disabled) {
  transform: scale(0.96);
  box-shadow: none;
}

.submit-button:disabled {
  background-color: var(--color-border-strong);
  cursor: not-allowed;
  transform: none;
}

.spinner {
  width: 15px;
  height: 15px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
