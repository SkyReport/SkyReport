<template>
  <div class="buat-survey-page">
    <div class="page-heading">
      <div>
        <RouterLink to="/admin/management" class="back-link">
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
            <path d="M12 4 6 10l6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          Kembali
        </RouterLink>
        <h1 class="page-title">{{ isEditing ? "Edit Survey" : "Buat Survey Baru" }}</h1>
        <p class="page-subtitle">
          {{
            isEditing
              ? "Perbarui detail survey ini."
              : "Isi detail survey untuk ditambahkan ke daftar survey."
          }}
        </p>
      </div>
    </div>

    <form class="form-card" @submit.prevent="handleSubmit">
      <div class="section">
        <span class="section-label">Informasi Dasar</span>

        <div class="field">
          <label class="field-label" for="nama">Nama Survey</label>
          <div class="input-wrap">
            <svg class="input-icon" width="15" height="15" viewBox="0 0 20 20" fill="none">
              <rect x="3" y="4" width="14" height="12" rx="1.5" stroke="currentColor" stroke-width="1.5" />
              <path d="M6 8h8M6 11h5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
            </svg>
            <input
              id="nama"
              v-model.trim="form.nama"
              class="input"
              placeholder="Contoh: Kepuasan Layanan Terminal 3"
              required
            />
          </div>
        </div>

        <div class="field">
          <label class="field-label" for="link">Link Survey</label>
          <div class="input-wrap">
            <svg class="input-icon" width="15" height="15" viewBox="0 0 20 20" fill="none">
              <path
                d="M8.5 11.5 11.5 8.5M9 6l.6-.6a3 3 0 0 1 4.2 4.2L13 10.4M11 14l-.6.6a3 3 0 0 1-4.2-4.2L7 9.6"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <input
              id="link"
              v-model.trim="form.link"
              class="input"
              type="text"
              placeholder="https://forms.familia.id/..."
            />
          </div>
          <p class="field-helper">Opsional — bisa dikosongkan dan diisi nanti sebelum survey diaktifkan.</p>
        </div>
      </div>

      <div class="section-divider" />

      <div class="section">
        <span class="section-label">Rentang Tanggal</span>

        <div class="field-row">
          <div class="field">
            <label class="field-label" for="tanggal-mulai">Tanggal Mulai</label>
            <div class="input-wrap" @click="openDatePicker(tanggalMulaiInput)">
              <svg class="input-icon" width="15" height="15" viewBox="0 0 20 20" fill="none">
                <rect x="3" y="4" width="14" height="13" rx="1.5" stroke="currentColor" stroke-width="1.5" />
                <path d="M3 8h14M6.5 2.5v3M13.5 2.5v3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              </svg>
              <input
                id="tanggal-mulai"
                ref="tanggalMulaiInput"
                v-model="form.tanggalMulai"
                class="input"
                type="date"
                required
              />
            </div>
          </div>
          <div class="field">
            <label class="field-label" for="tanggal-selesai">Tanggal Selesai</label>
            <div class="input-wrap" @click="openDatePicker(tanggalSelesaiInput)">
              <svg class="input-icon" width="15" height="15" viewBox="0 0 20 20" fill="none">
                <rect x="3" y="4" width="14" height="13" rx="1.5" stroke="currentColor" stroke-width="1.5" />
                <path d="M3 8h14M6.5 2.5v3M13.5 2.5v3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              </svg>
              <input
                id="tanggal-selesai"
                ref="tanggalSelesaiInput"
                v-model="form.tanggalSelesai"
                class="input"
                type="date"
                :min="form.tanggalMulai"
                required
              />
            </div>
          </div>
        </div>
        <p class="field-helper">
          Tidak wajib diisi jika Anda menyimpan survey ini sebagai draft.
        </p>
      </div>

      <div class="section-divider" />

      <div class="section">
        <span class="section-label">Kuota &amp; Status</span>

        <div class="field-row">
          <div class="field">
            <label class="field-label" for="max-pengisian">Max Pengisian</label>
            <div class="input-wrap">
              <svg class="input-icon" width="15" height="15" viewBox="0 0 20 20" fill="none">
                <path
                  d="M10 3v14M3 10h14"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
              </svg>
              <input
                id="max-pengisian"
                v-model.number="form.maxPengisian"
                class="input"
                type="number"
                min="1"
                required
              />
            </div>
            <p class="field-helper">
              Batas maksimal satu pegawai mengisi survey ini (standar: 20 kali). Pegawai lain tetap
              punya kuota sendiri-sendiri.
            </p>
          </div>
          <div class="field">
            <label class="field-label" for="status">Status Survey</label>
            <div class="input-wrap">
              <svg class="input-icon" width="15" height="15" viewBox="0 0 20 20" fill="none">
                <path d="M5 3v14M5 3h8l-2 3 2 3H5" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
              </svg>
              <select id="status" v-model="form.status" class="input input-select">
                <option value="Draft">Draft</option>
                <option value="Terjadwal">Terjadwal</option>
                <option value="Aktif">Aktif</option>
                <option value="Selesai">Selesai</option>
              </select>
            </div>
            <p class="field-helper">
              Survey "Aktif" langsung tampil di halaman input bukti pegawai. Jika periode tanggal
              diisi, status akan otomatis berubah ke "Aktif" saat tanggal mulai tiba dan ke "Selesai"
              setelah tanggal selesai terlewati.
            </p>
          </div>
        </div>
      </div>

      <div class="form-footer">
        <RouterLink to="/admin/management" class="btn-secondary">Batal</RouterLink>
        <button type="button" class="btn-outline" @click="handleSaveDraft">
          Simpan sebagai Draft
        </button>
        <button type="submit" class="btn-primary">
          {{ isEditing ? "Simpan Perubahan" : "Simpan Survey" }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useSurveyStore } from "./stores/surveyStore";
import { useToastStore } from "./stores/toastStore";

const store = useSurveyStore();
const toast = useToastStore();
const router = useRouter();
const route = useRoute();

const editingId = computed(() => (route.params.id ? Number(route.params.id) : null));
const isEditing = computed(() => editingId.value !== null);

const tanggalMulaiInput = ref(null);
const tanggalSelesaiInput = ref(null);

function openDatePicker(inputRef) {
  try {
    inputRef.value?.showPicker();
  } catch {
    inputRef.value?.focus();
  }
}

const form = reactive({
  nama: "",
  link: "",
  tanggalMulai: "",
  tanggalSelesai: "",
  status: "Draft",
  maxPengisian: 20,
});

watch(
  editingId,
  async (id) => {
    await store.ensureBaseData();

    if (id === null) {
      form.nama = "";
      form.link = "";
      form.tanggalMulai = "";
      form.tanggalSelesai = "";
      form.status = "Draft";
      form.maxPengisian = 20;
      return;
    }

    const survey = store.findSurvey(id);
    if (!survey) {
      toast.show("Survey tidak ditemukan.", "error");
      router.replace("/admin/management");
      return;
    }

    form.nama = survey.nama;
    form.link = survey.link;
    form.tanggalMulai = survey.tanggalMulai;
    form.tanggalSelesai = survey.tanggalSelesai;
    form.status = survey.status;
    form.maxPengisian = survey.maxPengisian;
  },
  { immediate: true }
);

function buildPayload(overrides = {}) {
  return {
    nama: form.nama,
    link: form.link,
    tanggalMulai: form.tanggalMulai,
    tanggalSelesai: form.tanggalSelesai,
    status: form.status,
    maxPengisian: form.maxPengisian,
    ...overrides,
  };
}

async function saveSurvey(payload) {
  if (isEditing.value) {
    await store.updateSurvey(editingId.value, payload);
  } else {
    await store.addSurvey(payload);
  }
}

async function handleSubmit() {
  try {
    await saveSurvey(buildPayload());
    toast.show(isEditing.value ? "Survey berhasil diperbarui" : "Survey berhasil ditambahkan", "success");
    router.push("/admin/management");
  } catch (err) {
    toast.show(err.message, "error");
  }
}

async function handleSaveDraft() {
  if (!form.nama.trim()) {
    toast.show("Nama survey wajib diisi.", "error");
    return;
  }
  try {
    await saveSurvey(buildPayload({ status: "Draft" }));
    toast.show("Survey disimpan sebagai draft", "success");
    router.push("/admin/management");
  } catch (err) {
    toast.show(err.message, "error");
  }
}
</script>

<style scoped>
.buat-survey-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 640px;
  margin: 0 auto;
}

.page-heading {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
  color: var(--color-text-muted);
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
}

.back-link:hover {
  color: var(--color-primary);
}

.page-title {
  font-size: 22px;
  font-weight: 800;
  color: var(--color-text);
  letter-spacing: -0.025em;
}

.page-subtitle {
  font-size: 14px;
  color: var(--color-text-muted);
  line-height: 1.5;
}

.form-card {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 28px;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  animation: field-enter 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.section:nth-of-type(1) {
  animation-delay: 0.16s;
}

.section:nth-of-type(2) {
  animation-delay: 0.24s;
}

.section:nth-of-type(3) {
  animation-delay: 0.32s;
}

.form-footer {
  animation: field-enter 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: 0.4s;
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
  .section,
  .form-footer {
    animation: none !important;
  }
}

.section-label {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}

.section-divider {
  height: 1px;
  background-color: var(--color-border);
}

.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.01em;
  color: var(--color-text-secondary);
}

.field-helper {
  font-size: 12px;
  color: var(--color-text-muted);
  margin-top: 2px;
}

.input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 12px;
  color: var(--color-text-muted);
  pointer-events: none;
  transition: color 0.15s ease;
}

.input {
  width: 100%;
  height: 40px;
  padding: 0 12px 0 36px;
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: 14px;
  color: var(--color-text);
  background-color: var(--color-surface);
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.input-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'%3E%3Cpath d='M1 1.5 6 6.5 11 1.5' stroke='%23334155' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  padding-right: 34px;
  cursor: pointer;
}

.input:hover {
  border-color: var(--color-text-muted);
}

.input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(0, 93, 172, 0.2);
}

.input-wrap:has(.input:focus) .input-icon {
  color: var(--color-primary);
}

.form-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  margin-top: 4px;
  flex-wrap: wrap;
}

.btn-primary {
  min-height: 40px;
  padding: 10px 24px;
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

.btn-primary:hover {
  background-color: var(--color-primary-dark);
}

.btn-outline {
  min-height: 40px;
  padding: 10px 20px;
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-md);
  background-color: var(--color-surface);
  color: var(--color-primary);
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.btn-outline:hover {
  background-color: var(--color-bg);
}

.btn-secondary {
  min-height: 40px;
  padding: 10px 20px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background-color: var(--color-surface);
  color: var(--color-text-secondary);
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.15s ease;
}

.btn-secondary:hover {
  background-color: var(--color-bg);
}

@media (max-width: 640px) {
  .form-card {
    padding: 18px;
  }

  .field-row {
    grid-template-columns: 1fr;
  }

  .form-footer {
    flex-direction: column-reverse;
    align-items: stretch;
  }

  .form-footer > * {
    width: 100%;
    justify-content: center;
    text-align: center;
  }
}
</style>
