<template>
  <div class="public-page">
    <div class="bg-blob bg-blob-1" aria-hidden="true" />
    <div class="bg-blob bg-blob-2" aria-hidden="true" />
    <div class="bg-blob bg-blob-3" aria-hidden="true" />
    <div class="bg-blob bg-blob-4" aria-hidden="true" />

    <svg class="bg-flower bg-flower-1" viewBox="0 0 24 24" aria-hidden="true">
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
    <svg class="bg-flower bg-flower-2" viewBox="0 0 24 24" aria-hidden="true">
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

    <AppHeader />

    <main class="main-content">
      <div class="card">
        <div class="decorative-blur-blob" />

        <div class="card-heading">
          <h1 class="card-title">Halaman Input Bukti Survei</h1>
          <p class="card-subtitle">Silakan lengkapi data survei di bawah ini.</p>
        </div>

        <form class="form" @submit.prevent="handleSubmit">
          <div class="field">
            <label class="field-label" for="survey">Pilih survey</label>
            <select id="survey" v-model="selectedSurveyId" class="select">
              <option v-for="survey in surveys" :key="survey.id" :value="survey.id">
                {{ survey.nama }}
              </option>
            </select>

            <div v-if="selectedSurvey" class="survey-meta">
              <a
                v-if="selectedSurvey.link"
                class="survey-link-button"
                :href="selectedSurvey.link"
                target="_blank"
                rel="noopener"
              >
                <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M8.5 11.5 11.5 8.5M9 6l.6-.6a3 3 0 0 1 4.2 4.2L13 10.4M11 14l-.6.6a3 3 0 0 1-4.2-4.2L7 9.6"
                    stroke="currentColor"
                    stroke-width="1.6"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                Buka Link Survey
              </a>
              <span v-else class="survey-link-empty">Link belum tersedia</span>
            </div>
          </div>

          <div class="field">
            <label class="field-label" for="tanggal">Pilih tgl</label>
            <input
              id="tanggal"
              v-model="form.tanggal"
              type="date"
              class="input"
              :min="minDate"
              :max="maxDate"
              required
            />
          </div>

          <div class="field" :class="{ 'field-elevated': showSuggestions }">
            <label class="field-label" for="nama">Pilih nama</label>
            <div ref="autocompleteRef" class="autocomplete">
              <input
                id="nama"
                v-model="nameQuery"
                type="text"
                class="input"
                placeholder="Cari nama pegawai..."
                autocomplete="off"
                required
                @focus="showSuggestions = true"
                @input="handleNameInput"
              />
              <ul v-if="showSuggestions && suggestions.length" class="suggestion-list">
                <li
                  v-for="employee in suggestions"
                  :key="employee.id"
                  class="suggestion-item"
                  @click="selectEmployee(employee)"
                >
                  <span class="suggestion-name">{{ employee.nama }}</span>
                  <span class="suggestion-unit">{{ employee.unitKerja }}</span>
                </li>
              </ul>
              <p
                v-else-if="showSuggestions && nameQuery && !selectedEmployee"
                class="suggestion-empty"
              >
                Nama tidak ditemukan di data pegawai.
              </p>
            </div>
            <p v-if="selectedEmployee && selectedSurvey" class="name-quota-info" :class="quotaBadgeClass">
              Anda sudah mengisi survey sebanyak {{ employeeSubmissionCount }} / {{ selectedSurvey.maxPengisian }}
            </p>
          </div>

          <div class="field">
            <label class="field-label">Upload Bukti</label>
            <div
              class="dropzone"
              :class="{ 'dropzone-active': isDragging, 'dropzone-disabled': quotaFull }"
              @click="!quotaFull && triggerFilePicker()"
              @dragover.prevent="!quotaFull && (isDragging = true)"
              @dragleave.prevent="isDragging = false"
              @drop.prevent="handleDrop"
            >
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                class="file-input"
                :disabled="quotaFull"
                @change="handleFileChange"
              />
              <template v-if="form.file">
                <p class="dropzone-filename">{{ form.file.name }}</p>
                <p class="dropzone-hint">Klik untuk mengganti file</p>
              </template>
              <template v-else>
                <p class="dropzone-text">
                  <span class="dropzone-link">Klik untuk upload</span> atau drag and drop
                </p>
                <p class="dropzone-hint">PNG, JPG, atau GIF (Maks. 10MB)</p>
              </template>
            </div>
            <p v-if="quotaFull" class="field-error">
              <svg class="field-error-icon" width="16" height="16" viewBox="0 0 20 20" fill="none">
                <path
                  d="M10 2 2 17h16L10 2Z"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linejoin="round"
                />
                <path d="M10 8v4M10 14.5v.01" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
              </svg>
              Anda sudah mencapai batas maksimal pengisian survey ini ({{ selectedSurvey?.maxPengisian }} kali).
            </p>
          </div>

          <button type="submit" class="submit-button" :disabled="!canSubmit || submitting">
            {{ submitting ? "Mengunggah..." : "Upload Bukti" }}
          </button>
        </form>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import AppHeader from "./components/AppHeader.vue";
import { useSurveyStore } from "./stores/surveyStore";
import { useToastStore } from "./stores/toastStore";

const store = useSurveyStore();
const toast = useToastStore();
const router = useRouter();
const surveys = computed(() => store.activeAvailableSurveys);

const selectedSurveyId = ref(null);
const fileInput = ref(null);
const isDragging = ref(false);
const submitting = ref(false);

const today = new Date().toISOString().slice(0, 10);

const form = reactive({
  tanggal: today,
  file: null,
});

let pollInterval = null;

onMounted(async () => {
  await store.ensureBaseData();
  selectedSurveyId.value = surveys.value[0]?.id ?? null;

  // Poll surveys every 3 seconds for real-time updates
  pollInterval = setInterval(async () => {
    try {
      await store.fetchSurveys();
    } catch (err) {
      console.error("Poll error:", err);
    }
  }, 3000);

  // Also refetch when user refocuses tab
  window.addEventListener("focus", () => {
    store.fetchSurveys().catch(console.error);
  });
});

const nameQuery = ref("");
const selectedEmployee = ref(null);
const showSuggestions = ref(false);
const autocompleteRef = ref(null);

const suggestions = computed(() => {
  const term = nameQuery.value.trim().toLowerCase();
  if (!term) return [];
  return store.employees.filter((e) => e.nama.toLowerCase().includes(term)).slice(0, 6);
});

function handleNameInput() {
  showSuggestions.value = true;
  if (selectedEmployee.value && selectedEmployee.value.nama !== nameQuery.value) {
    selectedEmployee.value = null;
  }
}

function selectEmployee(employee) {
  selectedEmployee.value = employee;
  nameQuery.value = employee.nama;
  showSuggestions.value = false;
}

function closeSuggestionsOnOutsideClick(event) {
  if (autocompleteRef.value && !autocompleteRef.value.contains(event.target)) {
    showSuggestions.value = false;
  }
}

onMounted(() => document.addEventListener("click", closeSuggestionsOnOutsideClick));
onBeforeUnmount(() => {
  document.removeEventListener("click", closeSuggestionsOnOutsideClick);
  if (pollInterval) clearInterval(pollInterval);
  window.removeEventListener("focus", () => store.fetchSurveys());
});

const selectedSurvey = computed(() => store.findSurvey(selectedSurveyId.value));

// Date picker is clamped to the selected survey's own period — can't log
// evidence for a date before it started or after it ended, and never for a
// date in the future.
const minDate = computed(() => selectedSurvey.value?.tanggalMulai || undefined);
const maxDate = computed(() => {
  const surveyEnd = selectedSurvey.value?.tanggalSelesai;
  return surveyEnd && surveyEnd < today ? surveyEnd : today;
});

const employeeSubmissionCount = computed(() =>
  selectedSurveyId.value && selectedEmployee.value
    ? store.submissionCountForEmployeeSurvey(selectedSurveyId.value, selectedEmployee.value.nama)
    : 0
);

const quotaFull = computed(() =>
  selectedSurveyId.value && selectedEmployee.value
    ? store.isSurveyFullForEmployee(selectedSurveyId.value, selectedEmployee.value.nama)
    : false
);

const quotaBadgeClass = computed(() => {
  if (!selectedSurvey.value || !selectedEmployee.value) return "";
  const ratio = employeeSubmissionCount.value / selectedSurvey.value.maxPengisian;
  if (ratio >= 1) return "quota-full";
  if (ratio >= 0.8) return "quota-warning";
  return "quota-ok";
});

const canSubmit = computed(
  () => !quotaFull.value && !!selectedEmployee.value && !!form.tanggal && !!form.file
);

watch(selectedSurveyId, () => {
  form.file = null;
  if (fileInput.value) fileInput.value.value = "";
  if (minDate.value && form.tanggal < minDate.value) form.tanggal = minDate.value;
  if (maxDate.value && form.tanggal > maxDate.value) form.tanggal = maxDate.value;
});

function triggerFilePicker() {
  fileInput.value?.click();
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB — cukup untuk screenshot HP resolusi tinggi

function setFileIfValid(file) {
  if (!file) return;
  if (file.size > MAX_FILE_SIZE) {
    toast.show(
      `Ukuran file terlalu besar (${(file.size / 1024 / 1024).toFixed(1)}MB). Maksimal 10MB.`,
      "error"
    );
    return;
  }
  form.file = file;
}

function handleFileChange(event) {
  const file = event.target.files?.[0];
  setFileIfValid(file);
  if (event.target.value) event.target.value = "";
}

function handleDrop(event) {
  isDragging.value = false;
  if (quotaFull.value) return;
  const file = event.dataTransfer?.files?.[0];
  setFileIfValid(file);
}

async function handleSubmit() {
  if (!canSubmit.value || !selectedSurveyId.value || submitting.value) return;
  submitting.value = true;
  try {
    await store.addSubmission({
      surveyId: selectedSurveyId.value,
      nama: selectedEmployee.value.nama,
      tanggal: form.tanggal,
      jenisPegawai: selectedEmployee.value.jenisPegawai,
      departemen: selectedEmployee.value.unitKerja,
      file: form.file,
    });
    toast.show("Bukti berhasil di-upload", "success");
    router.push("/success");
  } catch (err) {
    toast.show(err.message, "error");
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
.public-page {
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

/* ── Drifting spinning-flower silhouettes ────────────────────────────────
   Purely decorative, sits behind the glass card at the same z-index/style
   as the bg-blobs (translucent, brand accent colors, no new palette). */
.bg-flower {
  position: absolute;
  z-index: -1;
  pointer-events: none;
  will-change: transform, opacity;
}

.bg-flower-1 {
  top: 20%;
  left: -8%;
  width: 88px;
  height: 88px;
  fill: var(--color-primary-light);
  animation: flower-drift-1 24s linear infinite;
}

.bg-flower-2 {
  top: 64%;
  left: -8%;
  width: 60px;
  height: 60px;
  fill: var(--color-accent-cyan-strong);
  animation: flower-drift-2 32s linear infinite;
  animation-delay: 8s;
}

@keyframes flower-drift-1 {
  0% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
  8% { opacity: 0.4; }
  92% { opacity: 0.4; }
  100% { transform: translate(125vw, -18vh) rotate(1080deg); opacity: 0; }
}

@keyframes flower-drift-2 {
  0% { transform: translate(0, 0) rotate(0deg); opacity: 0; }
  8% { opacity: 0.45; }
  92% { opacity: 0.45; }
  100% { transform: translate(120vw, 16vh) rotate(-1080deg); opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .bg-flower {
    animation: none !important;
    display: none;
  }
}

.card {
  position: relative;
  width: 100%;
  max-width: 480px;
  overflow: hidden;
  padding: 24px;
  border-radius: var(--radius-lg);
  background-color: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow);
  display: flex;
  flex-direction: column;
  gap: 20px;
  animation: card-enter 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.card:hover {
  box-shadow: var(--shadow-lg), 0 0 0 1px rgba(0, 93, 172, 0.08);
  transform: translateY(-2px);
}

.card-heading,
.form .field {
  animation: field-enter 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.card-heading {
  animation-delay: 0.06s;
}

.form .field:nth-of-type(1) { animation-delay: 0.13s; }
.form .field:nth-of-type(2) { animation-delay: 0.19s; }
.form .field:nth-of-type(3) { animation-delay: 0.25s; }
.form .field:nth-of-type(4) { animation-delay: 0.31s; }

.submit-button {
  animation: field-enter 0.45s cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: 0.37s;
}

@keyframes card-enter {
  from {
    opacity: 0;
    transform: translateY(28px) scale(0.97);
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

@media (prefers-reduced-motion: reduce) {
  .card,
  .card-heading,
  .form .field,
  .submit-button {
    animation: none !important;
  }

  .card:hover {
    transform: none;
  }
}

.decorative-blur-blob {
  position: absolute;
  top: -40px;
  right: -40px;
  width: 128px;
  height: 128px;
  border-radius: var(--radius-full);
  background-color: var(--color-accent-blue-soft);
  filter: blur(32px);
  opacity: 0.5;
}

.card-heading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-align: center;
  position: relative;
}

.card-title {
  color: var(--color-text);
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.card-subtitle {
  color: var(--color-text-secondary);
  font-size: 14px;
  line-height: 1.5;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.field-elevated {
  position: relative;
  z-index: 30;
}

.field-label {
  color: var(--color-text-secondary);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.01em;
}

.select,
.input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: 14px;
  color: var(--color-text);
  background-color: var(--color-surface);
}

.select:focus,
.input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(0, 93, 172, 0.12);
}

.autocomplete {
  position: relative;
}

.suggestion-list {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  max-height: 220px;
  overflow-y: auto;
  margin: 0;
  padding: 4px;
  list-style: none;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  z-index: 20;
}

.suggestion-item {
  display: flex;
  flex-direction: column;
  padding: 8px 10px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background-color 0.15s ease, transform 0.1s ease;
}

.suggestion-item:active {
  transform: scale(0.97);
}

.suggestion-item:hover {
  background-color: var(--color-bg);
}

.suggestion-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
}

.suggestion-unit {
  font-size: 12px;
  color: var(--color-text-muted);
}

.suggestion-empty {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  margin: 0;
  padding: 10px 12px;
  font-size: 13px;
  color: var(--color-text-muted);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  z-index: 20;
}

.survey-meta {
  display: flex;
  align-items: center;
  margin-top: 8px;
}

.name-quota-info {
  margin-top: 6px;
  padding: 8px 12px;
  border-radius: var(--radius-md);
  font-size: 12.5px;
  line-height: 1.5;
}

.name-quota-info.quota-ok {
  background-color: var(--color-success-bg);
  color: var(--color-success);
}

.name-quota-info.quota-warning {
  background-color: var(--color-warning-bg);
  color: var(--color-warning);
}

.name-quota-info.quota-full {
  background-color: var(--color-danger-bg);
  color: var(--color-danger);
}

.survey-link-button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 16px;
  border-radius: var(--radius-md);
  background-color: var(--color-primary);
  color: #ffffff;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  box-shadow: 0 2px 6px rgba(0, 93, 172, 0.3);
  transition: background-color 0.15s ease, box-shadow 0.15s ease, transform 0.1s ease;
}

.survey-link-button:hover {
  background-color: var(--color-primary-dark);
  box-shadow: 0 3px 10px rgba(0, 93, 172, 0.4);
}

.survey-link-button:active {
  transform: translateY(1px);
}

.survey-link-empty {
  font-size: 13px;
  color: var(--color-text-muted);
  font-style: italic;
}

.dropzone {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 24px 16px;
  border: 1.5px dashed var(--color-border-strong);
  border-radius: var(--radius-md);
  background-color: var(--color-surface);
  text-align: center;
  cursor: pointer;
  transition: border-color 0.15s ease, background-color 0.15s ease, transform 0.1s ease;
}

.dropzone:hover {
  border-color: var(--color-primary-light);
}

.dropzone:active {
  transform: scale(0.985);
}

.dropzone-active {
  border-color: var(--color-primary);
  background-color: rgba(0, 93, 172, 0.04);
}

.dropzone-disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.file-input {
  display: none;
}

.dropzone-text,
.dropzone-filename {
  color: var(--color-text-secondary);
  font-size: 14px;
  margin: 0;
}

.dropzone-link {
  color: var(--color-primary);
  font-weight: 600;
}

.dropzone-hint {
  color: var(--color-text-muted);
  font-size: 12px;
  margin: 0;
}

.field-error {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 0;
  padding: 10px 12px;
  border-radius: var(--radius-md);
  background-color: var(--color-danger-bg);
  border: 1px solid var(--color-danger);
  color: var(--color-danger);
  font-size: 12.5px;
  font-weight: 600;
}

.field-error-icon {
  flex-shrink: 0;
}

.submit-button {
  width: 100%;
  padding: 12px 0;
  border: none;
  border-radius: var(--radius-md);
  background-color: var(--color-primary);
  color: #ffffff;
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.14px;
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: background-color 0.15s ease, box-shadow 0.2s ease, transform 0.15s ease;
}

.submit-button:hover:not(:disabled) {
  background-color: var(--color-primary-dark);
  box-shadow: 0 4px 14px rgba(0, 93, 172, 0.35);
  transform: translateY(-1px);
}

.submit-button:active:not(:disabled) {
  transform: scale(0.97);
  box-shadow: var(--shadow-sm);
}

.submit-button:disabled {
  background-color: var(--color-border-strong);
  cursor: not-allowed;
}
</style>
