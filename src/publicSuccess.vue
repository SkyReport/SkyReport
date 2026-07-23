<template>
  <div class="public-success">
    <AppHeader />

    <main class="main-content">
      <div class="card">
        <div class="icon-badge">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
            <path
              d="M20 6L9 17l-5-5"
              stroke="#005dac"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>

        <div class="card-heading">
          <h1 class="card-title">Berhasil Mengunggah Bukti</h1>
          <p class="card-subtitle">
            Terima kasih, bukti survei Anda telah berhasil disimpan dalam sistem.
          </p>
        </div>

        <div v-if="submission" class="summary">
          <div class="summary-row">
            <span class="summary-label">Survey</span>
            <span class="summary-value">{{ surveyName }}</span>
          </div>
          <div class="summary-row">
            <span class="summary-label">Tanggal</span>
            <span class="summary-value">{{ submission.tanggal }}</span>
          </div>
          <div class="summary-row">
            <span class="summary-label">Nama</span>
            <span class="summary-value">{{ submission.nama }}</span>
          </div>
        </div>

        <RouterLink to="/" class="button">Kembali</RouterLink>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed } from "vue";
import AppHeader from "./components/AppHeader.vue";
import { useSurveyStore } from "./stores/surveyStore";

const store = useSurveyStore();
const submission = computed(() => store.lastSubmission);
const surveyName = computed(() =>
  submission.value ? store.findSurvey(submission.value.surveyId)?.nama ?? "-" : "-"
);
</script>

<style scoped>
.public-success {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(
    328deg,
    rgba(0, 93, 172, 1) 0%,
    rgba(92, 233, 254, 1) 33%,
    rgba(25, 118, 210, 1) 67%,
    rgba(69, 216, 237, 1) 100%
  );
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
  max-width: 480px;
  padding: 24px;
  border-radius: var(--radius-lg);
  background-color: #ffffffd9;
  backdrop-filter: blur(8px);
  border: 1px solid #ffffff66;
  box-shadow: 0 8px 32px rgba(0, 93, 172, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.icon-badge {
  width: 64px;
  height: 64px;
  border-radius: var(--radius-full);
  background-color: var(--color-accent-cyan-strong);
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-heading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-align: center;
}

.card-title {
  color: var(--color-text);
  font-size: 20px;
  font-weight: 600;
}

.card-subtitle {
  color: var(--color-text-secondary);
  font-size: 14px;
}

.summary {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 24px;
  border-radius: var(--radius-md);
  background-color: rgba(242, 244, 246, 0.6);
  border: 1px solid #ffffff66;
  backdrop-filter: blur(2px);
}

.summary-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.summary-label {
  color: var(--color-text-secondary);
  font-size: 12px;
  font-weight: 500;
}

.summary-value {
  color: var(--color-text);
  font-size: 14px;
  font-weight: 600;
}

.button {
  width: 100%;
  padding: 12px 0;
  border-radius: var(--radius-md);
  background-color: var(--color-primary);
  color: #ffffff;
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  box-shadow: var(--shadow-sm);
}

.button:hover {
  background-color: var(--color-primary-dark);
}
</style>
