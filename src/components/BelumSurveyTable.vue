<template>
  <div class="belum-survey-table">
    <div class="search-box">
      <svg class="search-icon" width="15" height="15" viewBox="0 0 20 20" fill="none">
        <circle cx="9" cy="9" r="6.5" stroke="currentColor" stroke-width="1.6" />
        <path d="M17 17l-3.5-3.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
      </svg>
      <input v-model="search" class="search-input" type="text" placeholder="Cari Nama Pegawai..." />
    </div>

    <div class="table-scroll">
      <table class="employee-table">
        <thead>
          <tr>
            <th class="col-no">No</th>
            <th>Nama Pegawai</th>
            <th>Unit Kerja / Departemen</th>
            <th>Status</th>
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
                {{ employee.jenisPegawai }}
              </span>
            </td>
          </tr>
          <tr v-if="filteredEmployees.length === 0">
            <td colspan="4" class="empty-row">Tidak ada pegawai yang cocok dengan pencarian.</td>
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
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useSurveyStore } from "../stores/surveyStore";

const props = defineProps({
  employees: {
    type: Array,
    default: null,
  },
});

const store = useSurveyStore();
const search = ref("");
const page = ref(1);
const pageSize = 5;

const sourceEmployees = computed(() => props.employees ?? store.employeesBelumSurvey);

const filteredEmployees = computed(() => {
  const term = search.value.trim().toLowerCase();
  if (!term) return sourceEmployees.value;
  return sourceEmployees.value.filter((e) => e.nama.toLowerCase().includes(term));
});

const totalPages = computed(() => Math.max(1, Math.ceil(filteredEmployees.value.length / pageSize)));

watch([search, filteredEmployees], () => {
  if (page.value > totalPages.value) page.value = totalPages.value;
});

const pageStart = computed(() => (page.value - 1) * pageSize);
const pageEnd = computed(() => Math.min(pageStart.value + pageSize, filteredEmployees.value.length));
const pagedEmployees = computed(() => filteredEmployees.value.slice(pageStart.value, pageEnd.value));
</script>

<style scoped>
.belum-survey-table {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
  max-width: 384px;
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

.table-scroll {
  overflow-x: auto;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.employee-table {
  width: 100%;
  min-width: 520px;
  border-collapse: collapse;
  font-size: 14px;
}

.employee-table thead th {
  text-align: left;
  padding: 10px 16px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  background-color: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
  white-space: nowrap;
}

.employee-table tbody td {
  padding: 12px 16px;
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
  width: 48px;
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
  font-size: 13px;
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

.empty-row {
  text-align: center;
  padding: 32px;
  color: var(--color-text-muted);
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.pagination-label {
  font-size: 13px;
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
  min-width: 28px;
  height: 28px;
  padding: 0 6px;
  border: none;
  border-radius: var(--radius-sm);
  background-color: transparent;
  color: var(--color-text-secondary);
  font-family: var(--font-sans);
  font-size: 13px;
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
