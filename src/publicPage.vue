<template>
  <div class="public-page">
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
              <span v-if="selectedEmployee" class="quota-badge" :class="quotaBadgeClass">
                Kamu sudah isi {{ employeeSubmissionCount }}/{{ selectedSurvey.maxPengisian }} kali
              </span>
              <span v-else class="quota-badge quota-ok">
                Maks {{ selectedSurvey.maxPengisian }}x per pegawai
              </span>
              <a
                v-if="selectedSurvey.link"
                class="survey-link"
                :href="selectedSurvey.link"
                target="_blank"
                rel="noopener"
                @click="() => console.log('Link clicked:', selectedSurvey.link)"
              >
                Buka Link
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
              :max="today"
              required
            />
          </div>

          <div class="field">
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
                <p class="dropzone-hint">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
              </template>
            </div>
            <p v-if="quotaFull" class="field-error">
              Kamu sudah mencapai batas maksimal pengisian survey ini ({{ selectedSurvey?.maxPengisian }} kali).
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
});

function triggerFilePicker() {
  fileInput.value?.click();
}

function handleFileChange(event) {
  const file = event.target.files?.[0];
  if (file) form.file = file;
}

function handleDrop(event) {
  isDragging.value = false;
  if (quotaFull.value) return;
  const file = event.dataTransfer?.files?.[0];
  if (file) form.file = file;
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
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background:
    radial-gradient(50% 50% at 68% 68%, rgba(212, 227, 255, 1) 0%, rgba(212, 227, 255, 0) 50%),
    radial-gradient(50% 50% at 32% 68%, rgba(152, 240, 255, 1) 0%, rgba(152, 240, 255, 0) 50%),
    radial-gradient(50% 50% at 32% 32%, rgba(212, 227, 255, 1) 0%, rgba(212, 227, 255, 0) 50%),
    radial-gradient(50% 50% at 68% 32%, rgba(92, 233, 254, 1) 0%, rgba(92, 233, 254, 0) 50%),
    var(--color-bg);
}

.main-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 24px;
}

.card {
  position: relative;
  width: 100%;
  max-width: 480px;
  overflow: hidden;
  padding: 24px;
  border-radius: var(--radius-lg);
  background-color: #ffffffe6;
  backdrop-filter: blur(6px);
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  gap: 20px;
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
  font-weight: 600;
}

.card-subtitle {
  color: var(--color-text-secondary);
  font-size: 14px;
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

.field-label {
  color: var(--color-text-secondary);
  font-size: 12px;
  font-weight: 500;
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
  justify-content: space-between;
  margin-top: 4px;
}

.quota-badge {
  font-size: 12px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: var(--radius-full);
}

.quota-ok {
  background-color: var(--color-success-bg);
  color: var(--color-success);
}

.quota-warning {
  background-color: var(--color-warning-bg);
  color: var(--color-warning);
}

.quota-full {
  background-color: var(--color-danger-bg);
  color: var(--color-danger);
}

.survey-link {
  color: var(--color-primary);
  font-size: 13px;
  text-decoration: none;
  font-weight: 500;
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
  transition: border-color 0.15s ease, background-color 0.15s ease;
}

.dropzone:hover {
  border-color: var(--color-primary-light);
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
  color: var(--color-danger);
  font-size: 12px;
  margin: 0;
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
  transition: background-color 0.15s ease, transform 0.05s ease;
}

.submit-button:hover:not(:disabled) {
  background-color: var(--color-primary-dark);
}

.submit-button:active:not(:disabled) {
  transform: scale(0.99);
}

.submit-button:disabled {
  background-color: var(--color-border-strong);
  cursor: not-allowed;
}
</style>
