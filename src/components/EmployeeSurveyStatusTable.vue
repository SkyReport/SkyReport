<template>
  <div class="employee-status">
    <div v-if="survey" class="toolbar">
      <div class="search-box">
        <svg class="search-icon" width="15" height="15" viewBox="0 0 20 20" fill="none">
          <circle cx="9" cy="9" r="6.5" stroke="currentColor" stroke-width="1.6" />
          <path d="M17 17l-3.5-3.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
        </svg>
        <input v-model="search" class="search-input" type="text" placeholder="Cari Nama Pegawai..." />
      </div>

      <div class="status-toggle">
        <button
          type="button"
          class="toggle-option"
          :class="{ active: statusFilter === 'sudah' }"
          @click="statusFilter = 'sudah'; page = 1"
        >
          Sudah Selesai
        </button>
        <button
          type="button"
          class="toggle-option"
          :class="{ active: statusFilter === 'belum' }"
          @click="statusFilter = 'belum'; page = 1"
        >
          Belum Mengisi
        </button>
      </div>
    </div>

    <template v-if="survey">
      <div class="table-scroll">
        <table class="employee-table">
          <thead>
            <tr>
              <th class="col-no">No</th>
              <th>Nama Pegawai</th>
              <th>Departemen</th>
              <th>Status</th>
              <th>Pengisian</th>
              <th class="col-sisa-kuota">Sisa Kuota</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(employee, index) in pagedEmployees" :key="employee.id">
              <td class="col-no">{{ pageStart + index + 1 }}</td>
              <td class="cell-name">{{ employee.nama }}</td>
              <td class="cell-unit">{{ employee.unitKerja }}</td>
              <td>
                <span class="type-flag">
                  <span
                    class="type-dot"
                    :class="employee.jenisPegawai === 'Organik' ? 'type-organik' : 'type-non-organik'"
                  />
                  {{ jenisPegawaiLabel(employee.jenisPegawai) }}
                </span>
              </td>
              <td>
                <span class="fill-badge" :class="fillBadgeClass(employee)">
                  {{ fillCountFor(employee) }}/{{ survey.maxPengisian }}
                </span>
              </td>
              <td class="col-sisa-kuota">
                <span v-if="remainingQuotaFor(employee) > 0" class="remaining-badge">
                  {{ remainingQuotaFor(employee) }}
                </span>
                <span v-else class="remaining-badge remaining-done">Selesai</span>
              </td>
            </tr>
            <tr v-if="filteredEmployees.length === 0">
              <td colspan="6" class="empty-row">Tidak ada pegawai yang cocok.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="pagination">
        <span class="pagination-label">
          Menampilkan {{ filteredEmployees.length === 0 ? 0 : pageStart + 1 }}-{{ pageEnd }} dari
          {{ filteredEmployees.length }} pegawai
        </span>
        <div class="pager" v-if="totalPages > 1">
          <button class="pager-arrow" type="button" :disabled="page === 1" @click="page--">
            &lsaquo;
          </button>
          <button
            v-for="p in totalPages"
            :key="p"
            type="button"
            class="pager-page"
            :class="{ active: p === page }"
            @click="page = p"
          >
            {{ p }}
          </button>
          <button
            class="pager-arrow"
            type="button"
            :disabled="page === totalPages"
            @click="page++"
          >
            &rsaquo;
          </button>
        </div>
      </div>
    </template>

    <p v-else class="empty-state">Pilih survey tertentu (bukan "Semua Survey") untuk melihat detail pengisian pegawai.</p>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { jenisPegawaiLabel, useSurveyStore } from "../stores/surveyStore";

const props = defineProps({
  employees: {
    type: Array,
    required: true,
  },
  surveyId: {
    type: [Number, String, null],
    default: null,
  },
});

const store = useSurveyStore();

const search = ref("");
const statusFilter = ref("belum");
const page = ref(1);
const pageSize = 10;

const survey = computed(() => (props.surveyId ? store.findSurvey(props.surveyId) : null));

function fillCountFor(employee) {
  return store.submissionCountForEmployeeSurvey(props.surveyId, employee.nama);
}

function fillBadgeClass(employee) {
  const count = fillCountFor(employee);
  if (count === 0) return "fill-empty";
  if (survey.value && count >= survey.value.maxPengisian) return "fill-full";
  return "fill-partial";
}

function remainingQuotaFor(employee) {
  if (!survey.value) return 0;
  return Math.max(0, survey.value.maxPengisian - fillCountFor(employee));
}

function isCompleted(employee) {
  return survey.value ? fillCountFor(employee) >= survey.value.maxPengisian : false;
}

const filteredEmployees = computed(() => {
  if (!survey.value) return [];
  let list = props.employees;

  list = list.filter((e) => (statusFilter.value === "sudah" ? isCompleted(e) : !isCompleted(e)));

  const term = search.value.trim().toLowerCase();
  if (term) {
    list = list.filter((e) => e.nama.toLowerCase().includes(term));
  }

  return list;
});

const totalPages = computed(() => Math.max(1, Math.ceil(filteredEmployees.value.length / pageSize)));

watch([search, statusFilter, () => props.surveyId, filteredEmployees], () => {
  if (page.value > totalPages.value) page.value = totalPages.value;
});

const pageStart = computed(() => (page.value - 1) * pageSize);
const pageEnd = computed(() => Math.min(pageStart.value + pageSize, filteredEmployees.value.length));
const pagedEmployees = computed(() => filteredEmployees.value.slice(pageStart.value, pageEnd.value));
</script>

<style scoped>
.employee-status {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
  max-width: 320px;
  flex: 1;
  min-width: 220px;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: var(--color-text-muted);
}

.search-input {
  width: 100%;
  padding: 10px 12px 10px 36px;
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: 14px;
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(0, 93, 172, 0.2);
}

.status-toggle {
  display: flex;
  gap: 4px;
  padding: 4px;
  background-color: var(--color-bg);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
}

.toggle-option {
  padding: 7px 14px;
  border: none;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--color-text-secondary);
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
  white-space: nowrap;
}

.toggle-option:hover:not(.active) {
  background-color: var(--color-surface);
}

.toggle-option.active {
  background-color: var(--color-primary);
  color: #ffffff;
}

.table-scroll {
  overflow-x: auto;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.employee-table {
  width: 100%;
  min-width: 700px;
  border-collapse: collapse;
  font-size: 13px;
  background-color: var(--color-surface);
}

.employee-table thead th {
  text-align: left;
  padding: 9px 14px;
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  background-color: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
  white-space: nowrap;
}

.employee-table tbody td {
  padding: 10px 14px;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text);
}

.employee-table tbody tr {
  transition: background-color 0.12s ease;
}

.employee-table tbody tr:hover td {
  background-color: rgba(248, 250, 252, 0.8);
}

.employee-table tbody tr:last-child td {
  border-bottom: none;
}

.col-no {
  width: 44px;
  color: var(--color-text-muted);
}

.cell-name {
  font-weight: 600;
}

.cell-unit {
  color: var(--color-text-secondary);
}

.type-flag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--color-text-secondary);
}

.type-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.type-organik {
  background-color: var(--color-primary);
}

.type-non-organik {
  background-color: var(--color-text-muted);
}

.fill-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 9px;
  border-radius: var(--radius-full);
  font-size: 11.5px;
  font-weight: 700;
}

.fill-empty {
  background-color: var(--color-danger-bg);
  color: var(--color-danger);
}

.fill-partial {
  background-color: #eff6ff;
  color: var(--color-primary);
}

.fill-full {
  background-color: #f0fdf4;
  color: var(--color-success);
}

.employee-table th.col-sisa-kuota,
.employee-table td.col-sisa-kuota {
  text-align: center;
}

.remaining-badge {
  display: inline-block;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--color-text-secondary);
}

.remaining-done {
  color: var(--color-success);
}

.empty-row {
  text-align: center;
  padding: 28px;
  color: var(--color-text-muted);
}

.empty-state {
  text-align: center;
  padding: 20px;
  color: var(--color-text-muted);
  font-size: 13px;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.pagination-label {
  font-size: 12.5px;
  color: var(--color-text-muted);
}

.pager {
  display: flex;
  align-items: center;
  gap: 4px;
}

.pager-arrow,
.pager-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 26px;
  height: 26px;
  padding: 0 6px;
  border: none;
  border-radius: var(--radius-sm);
  background-color: transparent;
  color: var(--color-text-secondary);
  font-family: var(--font-sans);
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
}

.pager-arrow:hover:not(:disabled),
.pager-page:hover:not(.active) {
  background-color: var(--color-bg);
}

.pager-arrow:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pager-page.active {
  background-color: var(--color-primary);
  color: #ffffff;
}
</style>
