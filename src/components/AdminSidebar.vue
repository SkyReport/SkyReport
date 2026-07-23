<template>
  <aside class="sidebar">
    <div class="sidebar-brand">
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
        <span class="brand-title">Survey Central</span>
        <span class="brand-subtitle">InJourney Management</span>
      </div>
    </div>

    <nav class="sidebar-nav">
      <RouterLink to="/admin/management" class="nav-item" active-class="active">
        <span class="nav-icon-box">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <path
              d="M3 15V5m6.5 10V8m6.5 7V3"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
            />
          </svg>
        </span>
        Survey Data
      </RouterLink>

      <RouterLink to="/admin/report" class="nav-item" active-class="active">
        <span class="nav-icon-box">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <rect x="2" y="3" width="16" height="14" rx="2" stroke="currentColor" stroke-width="1.6" />
            <path d="M6 12v2M10 9v5M14 7v7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
          </svg>
        </span>
        Reports
      </RouterLink>

      <RouterLink to="/admin/detail-survey" class="nav-item" active-class="active">
        <span class="nav-icon-box">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="1.6" />
            <path d="M7 10.5l2 2 4-4.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>
        Detail Survey
      </RouterLink>
    </nav>

    <div class="sidebar-footer">
      <button class="nav-item nav-item-plain" type="button" @click="handleLogout">
        <span class="nav-icon-box">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <path
              d="M7.5 17H4a1.5 1.5 0 0 1-1.5-1.5V4.5A1.5 1.5 0 0 1 4 3h3.5M13 13.5 17.5 9 13 4.5M17.5 9H7.5"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
        Logout
      </button>
    </div>
  </aside>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/authStore";

const authStore = useAuthStore();
const router = useRouter();

async function handleLogout() {
  await authStore.signOut();
  router.push("/admin/login");
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 64px;
  left: 0;
  bottom: 0;
  width: 256px;
  background-color: var(--color-sidebar-bg);
  display: flex;
  flex-direction: column;
  z-index: 20;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 22px 20px;
  border-bottom: 1px solid var(--color-sidebar-border);
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
  gap: 2px;
  min-width: 0;
}

.brand-title {
  color: #ffffff;
  font-family: var(--font-sans);
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.01em;
  white-space: nowrap;
}

.brand-subtitle {
  color: var(--color-sidebar-text-muted);
  font-size: 11.5px;
  white-space: nowrap;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 16px 12px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: var(--radius-md);
  color: var(--color-sidebar-text-muted);
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  border: none;
  background: transparent;
  width: 100%;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.nav-item:hover {
  background-color: var(--color-sidebar-bg-alt);
  color: #ffffff;
}

.nav-item.active {
  background-color: var(--color-sidebar-active);
  color: #ffffff;
  font-weight: 600;
}

.nav-icon-box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.sidebar-footer {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  border-top: 1px solid var(--color-sidebar-border);
}

@media (max-width: 768px) {
  .sidebar {
    display: none;
  }
}
</style>
