<template>
  <div class="login-page">
    <AppHeader />

    <main class="main-content">
      <form class="card" @submit.prevent="handleSubmit">
        <div class="card-heading">
          <h1 class="card-title">Login Admin</h1>
          <p class="card-subtitle">Masuk untuk mengakses Survey Central.</p>
        </div>

        <div class="field">
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

        <div class="field">
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

        <button type="submit" class="submit-button" :disabled="loading">
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

async function handleSubmit() {
  loading.value = true;
  try {
    await authStore.signIn(email.value, password.value);
    router.push("/admin/management");
  } catch (err) {
    toast.show(err.message || "Email atau password salah.", "error");
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.login-page {
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
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  gap: 20px;
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
}

.input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(0, 93, 172, 0.2);
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
  transition: background-color 0.15s ease;
}

.submit-button:hover:not(:disabled) {
  background-color: var(--color-primary-dark);
}

.submit-button:disabled {
  background-color: var(--color-border-strong);
  cursor: not-allowed;
}
</style>
