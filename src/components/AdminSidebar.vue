<template>
  <div v-if="open" class="sidebar-backdrop" @click="$emit('close')" />

  <aside class="sidebar" :class="{ 'sidebar-open': open }">
    <svg class="sidebar-flower sidebar-flower-1" viewBox="0 0 24 24" aria-hidden="true">
      <g>
        <ellipse cx="12" cy="6" rx="3" ry="5" />
        <ellipse cx="12" cy="6" rx="3" ry="5" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="6" rx="3" ry="5" transform="rotate(120 12 12)" />
        <ellipse cx="12" cy="6" rx="3" ry="5" transform="rotate(180 12 12)" />
        <ellipse cx="12" cy="6" rx="3" ry="5" transform="rotate(240 12 12)" />
        <ellipse cx="12" cy="6" rx="3" ry="5" transform="rotate(300 12 12)" />
        <circle cx="12" cy="12" r="2.4" />
      </g>
    </svg>
    <svg class="sidebar-flower sidebar-flower-2" viewBox="0 0 24 24" aria-hidden="true">
      <g>
        <ellipse cx="12" cy="6" rx="3" ry="5" />
        <ellipse cx="12" cy="6" rx="3" ry="5" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="6" rx="3" ry="5" transform="rotate(120 12 12)" />
        <ellipse cx="12" cy="6" rx="3" ry="5" transform="rotate(180 12 12)" />
        <ellipse cx="12" cy="6" rx="3" ry="5" transform="rotate(240 12 12)" />
        <ellipse cx="12" cy="6" rx="3" ry="5" transform="rotate(300 12 12)" />
        <circle cx="12" cy="12" r="2.4" />
      </g>
    </svg>

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
        <span class="brand-title">SkyVote</span>
        <span class="brand-subtitle">InJourney Management</span>
      </div>
    </div>

    <nav class="sidebar-nav">
      <RouterLink to="/admin/dashboard" class="nav-item" active-class="active" @click="$emit('close')">
        <span class="nav-icon-box">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <rect x="2.5" y="10.5" width="3.5" height="7" rx="1" stroke="currentColor" stroke-width="1.6" />
            <rect x="8.25" y="6" width="3.5" height="11.5" rx="1" stroke="currentColor" stroke-width="1.6" />
            <rect x="14" y="2.5" width="3.5" height="15" rx="1" stroke="currentColor" stroke-width="1.6" />
          </svg>
        </span>
        Dashboard Admin
      </RouterLink>

      <RouterLink to="/admin/management" class="nav-item" active-class="active" @click="$emit('close')">
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
        Manage Survey
      </RouterLink>

      <RouterLink to="/admin/report" class="nav-item" active-class="active" @click="$emit('close')">
        <span class="nav-icon-box">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <rect x="2" y="3" width="16" height="14" rx="2" stroke="currentColor" stroke-width="1.6" />
            <path d="M6 12v2M10 9v5M14 7v7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
          </svg>
        </span>
        Reports
      </RouterLink>

      <RouterLink to="/admin/hapus-gambar" class="nav-item" active-class="active" @click="$emit('close')">
        <span class="nav-icon-box">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <path
              d="M3 5.5h14M8 5.5V4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v1.5M5 5.5l.7 10.2a1.5 1.5 0 0 0 1.5 1.4h5.6a1.5 1.5 0 0 0 1.5-1.4l.7-10.2"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
        Delete Image
      </RouterLink>
    </nav>

    <div class="sidebar-footer">
      <button class="nav-item nav-item-plain" type="button" @click="showLogoutConfirm = true">
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

    <ConfirmDialog
      :visible="showLogoutConfirm"
      title="Logout dari SkyVote?"
      message="Anda perlu login lagi untuk mengakses halaman admin."
      confirm-text="Ya, Logout"
      cancel-text="Batal"
      danger
      @confirm="handleLogout"
      @cancel="showLogoutConfirm = false"
    />
  </aside>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/authStore";
import ConfirmDialog from "./ConfirmDialog.vue";

defineProps({
  open: { type: Boolean, default: false },
});
defineEmits(["close"]);

const authStore = useAuthStore();
const router = useRouter();
const showLogoutConfirm = ref(false);

async function handleLogout() {
  showLogoutConfirm.value = false;
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
  overflow: hidden;
  background-color: var(--glass-sidebar-bg);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  z-index: 20;
}

/* ── Drifting spinning-flower silhouettes ────────────────────────────────
   Same decorative motif as the public page, tuned for this narrow, tall
   panel (px-based travel instead of vw/vh, muted so nav text stays legible). */
.sidebar-flower {
  position: absolute;
  z-index: -1;
  pointer-events: none;
  will-change: transform, opacity;
}

.sidebar-flower-1 {
  top: 42%;
  left: -14%;
  width: 64px;
  height: 64px;
  fill: rgba(255, 255, 255, 0.4);
  animation: sidebar-flower-drift-1 20s linear infinite;
}

.sidebar-flower-2 {
  top: 58%;
  left: 60%;
  width: 46px;
  height: 46px;
  fill: var(--color-accent-cyan-strong);
  animation: sidebar-flower-drift-2 26s linear infinite;
  animation-delay: 6s;
}

@keyframes sidebar-flower-drift-1 {
  0% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
  10% { opacity: 0.35; }
  90% { opacity: 0.35; }
  100% { transform: translate(220px, -380px) rotate(720deg); opacity: 0; }
}

@keyframes sidebar-flower-drift-2 {
  0% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
  10% { opacity: 0.3; }
  90% { opacity: 0.3; }
  100% { transform: translate(-160px, 320px) rotate(-720deg); opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .sidebar-flower {
    animation: none !important;
    display: none;
  }
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

.sidebar-backdrop {
  display: none;
}

@media (max-width: 768px) {
  .sidebar-backdrop {
    display: block;
    position: fixed;
    inset: 64px 0 0 0;
    background-color: rgba(15, 23, 42, 0.5);
    z-index: 19;
    animation: backdrop-fade 0.2s ease both;
  }

  @keyframes backdrop-fade {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .sidebar {
    transform: translateX(-100%);
    box-shadow: none;
    transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .sidebar.sidebar-open {
    transform: translateX(0);
    box-shadow: 8px 0 24px rgba(15, 23, 42, 0.25);
  }

  @media (prefers-reduced-motion: reduce) {
    .sidebar {
      transition: none;
    }

    .sidebar-backdrop {
      animation: none;
    }
  }
}
</style>
