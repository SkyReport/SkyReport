<template>
  <div class="report-page">
    <div class="page-heading">
      <div>
        <h1 class="page-title">Laporan Hasil Survei</h1>
        <p class="page-subtitle">
          Tinjauan komprehensif mengenai metrik survei karyawan, tingkat partisipasi, dan tren
          kepuasan di seluruh departemen InJourney Airports.
        </p>
      </div>
    </div>

    <div class="report-main">
        <div class="report-card">
          <div class="card-header">
            <div>
              <h2 class="card-title">Rekapitulasi Partisipasi per Tanggal</h2>
              <p class="card-subtitle">
                Ringkasan agregat pengisian survei pegawai organik dan non-organik.
              </p>
            </div>
            <div class="card-header-actions">
              <div class="date-filter">
                <div class="date-segment">
                  <svg
                    class="date-segment-icon"
                    width="14"
                    height="14"
                    viewBox="0 0 20 20"
                    fill="none"
                    @click="openPicker(dateFromInput)"
                  >
                    <rect x="3" y="4" width="14" height="13" rx="1.5" stroke="currentColor" stroke-width="1.5" />
                    <path d="M3 8h14M6.5 2.5v3M13.5 2.5v3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                  </svg>
                  <input
                    ref="dateFromInput"
                    v-model="dateFrom"
                    type="date"
                    class="date-input"
                    :max="dateTo || undefined"
                  />
                  <span v-if="!dateFrom" class="date-placeholder" @click="openPicker(dateFromInput)">
                    Input Tanggal
                  </span>
                </div>
                <svg class="date-filter-arrow" width="14" height="14" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <div class="date-segment">
                  <svg
                    class="date-segment-icon"
                    width="14"
                    height="14"
                    viewBox="0 0 20 20"
                    fill="none"
                    @click="openPicker(dateToInput)"
                  >
                    <rect x="3" y="4" width="14" height="13" rx="1.5" stroke="currentColor" stroke-width="1.5" />
                    <path d="M3 8h14M6.5 2.5v3M13.5 2.5v3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                  </svg>
                  <input
                    ref="dateToInput"
                    v-model="dateTo"
                    type="date"
                    class="date-input"
                    :min="dateFrom || undefined"
                  />
                  <span v-if="!dateTo" class="date-placeholder" @click="openPicker(dateToInput)">
                    Input Tanggal
                  </span>
                </div>
                <button
                  v-if="dateFrom || dateTo"
                  type="button"
                  class="date-filter-clear"
                  title="Tampilkan semua tanggal"
                  @click="dateFrom = ''; dateTo = ''"
                >
                  &times;
                </button>
              </div>
            </div>
          </div>

          <div class="table-scroll">
            <table class="report-table">
              <thead>
                <tr class="group-row">
                  <th rowspan="2">No</th>
                  <th rowspan="2">Tanggal</th>
                  <th colspan="3">Jumlah Pegawai</th>
                  <th colspan="3">Pengisian Survey</th>
                  <th colspan="3">Persentase</th>
                </tr>
                <tr class="sub-row">
                  <th>Organik</th>
                  <th>Non Organik</th>
                  <th>Total</th>
                  <th>Organik</th>
                  <th>Non Organik</th>
                  <th>Total</th>
                  <th>Organik</th>
                  <th>Non Organik</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="(row, index) in dateTable.pagedRows.value" :key="row.key">
                  <tr>
                    <td>{{ dateTable.pageStart.value + index + 1 }}</td>
                    <td>
                      <div class="cell-date">{{ formatDate(row.key) }}</div>
                      <button
                        type="button"
                        class="link-belum-survey"
                        @click="toggleBelumSurvey(row.key)"
                      >
                        Pegawai belum survey
                      </button>
                    </td>
                    <td>{{ row.pegawaiOrganik }}</td>
                    <td>{{ row.pegawaiNonOrganik }}</td>
                    <td>{{ row.pegawaiTotal }}</td>
                    <td class="cell-accent">{{ row.pengisianOrganik }}</td>
                    <td class="cell-accent">{{ row.pengisianNonOrganik }}</td>
                    <td class="cell-accent">{{ row.pengisianTotal }}</td>
                    <td>
                      <span class="percent-value" :class="percentValueClass(row.persenOrganik)">
                        {{ row.persenOrganik }}%
                      </span>
                    </td>
                    <td>
                      <span class="percent-value" :class="percentValueClass(row.persenNonOrganik)">
                        {{ row.persenNonOrganik }}%
                      </span>
                    </td>
                    <td>
                      <span class="percent-value" :class="percentValueClass(row.persenTotal)">
                        {{ row.persenTotal }}%
                      </span>
                    </td>
                  </tr>
                  <tr v-if="expandedDate === row.key" class="expand-row">
                    <td colspan="11">
                      <BelumSurveyTable :employees="store.employeesBelumSurveyOnDate(row.key)" />
                    </td>
                  </tr>
                </template>
                <tr v-if="dateTable.rows.value.length === 0">
                  <td colspan="11" class="empty-row">Belum ada data partisipasi survei.</td>
                </tr>
                <tr v-if="dateTable.rows.value.length > 0" class="total-row">
                  <td colspan="2">Total Akumulasi</td>
                  <td>{{ dateTable.totals.value.pegawaiOrganik }}</td>
                  <td>{{ dateTable.totals.value.pegawaiNonOrganik }}</td>
                  <td>{{ dateTable.totals.value.pegawaiTotal }}</td>
                  <td class="cell-accent">{{ dateTable.totals.value.pengisianOrganik }}</td>
                  <td class="cell-accent">{{ dateTable.totals.value.pengisianNonOrganik }}</td>
                  <td class="cell-accent">{{ dateTable.totals.value.pengisianTotal }}</td>
                  <td class="cell-accent">{{ dateTable.totals.value.persenOrganik }}%</td>
                  <td class="cell-accent">{{ dateTable.totals.value.persenNonOrganik }}%</td>
                  <td class="cell-accent">{{ dateTable.totals.value.persenTotal }}%</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="pagination">
            <span class="pagination-label">
              Menampilkan
              {{ dateTable.rows.value.length === 0 ? 0 : dateTable.pageStart.value + 1 }}-{{
                dateTable.pageEnd.value
              }}
              dari {{ dateTable.rows.value.length }} data
            </span>
            <div class="pagination-actions">
              <button
                type="button"
                class="btn-secondary"
                :disabled="dateTable.page.value === 1"
                @click="dateTable.page.value--"
              >
                Sebelumnya
              </button>
              <button
                type="button"
                class="btn-primary"
                :disabled="dateTable.page.value === dateTable.totalPages.value"
                @click="dateTable.page.value++"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        </div>

        <div class="report-card">
          <div class="card-header">
            <div>
              <h2 class="card-title">Rekapitulasi Partisipasi per Departemen</h2>
              <p class="card-subtitle">
                Sebaran pengisian survey berdasarkan unit kerja / departemen.
              </p>
            </div>
          </div>

          <div class="table-scroll">
            <table class="report-table">
              <thead>
                <tr class="group-row">
                  <th rowspan="2">No</th>
                  <th rowspan="2">Departemen</th>
                  <th colspan="3">Jumlah Pegawai</th>
                  <th colspan="3">Pengisian Survey</th>
                  <th colspan="3">Persentase</th>
                </tr>
                <tr class="sub-row">
                  <th>Organik</th>
                  <th>Non Organik</th>
                  <th>Total</th>
                  <th>Organik</th>
                  <th>Non Organik</th>
                  <th>Total</th>
                  <th>Organik</th>
                  <th>Non Organik</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, index) in deptTable.pagedRows.value" :key="row.key">
                  <td>{{ deptTable.pageStart.value + index + 1 }}</td>
                  <td>{{ row.key }}</td>
                  <td>{{ row.pegawaiOrganik }}</td>
                  <td>{{ row.pegawaiNonOrganik }}</td>
                  <td>{{ row.pegawaiTotal }}</td>
                  <td class="cell-accent">{{ row.pengisianOrganik }}</td>
                  <td class="cell-accent">{{ row.pengisianNonOrganik }}</td>
                  <td class="cell-accent">{{ row.pengisianTotal }}</td>
                  <td>
                    <span class="percent-value" :class="percentValueClass(row.persenOrganik)">
                      {{ row.persenOrganik }}%
                    </span>
                  </td>
                  <td>
                    <span class="percent-value" :class="percentValueClass(row.persenNonOrganik)">
                      {{ row.persenNonOrganik }}%
                    </span>
                  </td>
                  <td>
                    <span class="percent-value" :class="percentValueClass(row.persenTotal)">
                      {{ row.persenTotal }}%
                    </span>
                  </td>
                </tr>
                <tr v-if="deptTable.rows.value.length === 0">
                  <td colspan="11" class="empty-row">Belum ada data partisipasi survei.</td>
                </tr>
                <tr v-if="deptTable.rows.value.length > 0" class="total-row">
                  <td colspan="2">Total Akumulasi</td>
                  <td>{{ deptTable.totals.value.pegawaiOrganik }}</td>
                  <td>{{ deptTable.totals.value.pegawaiNonOrganik }}</td>
                  <td>{{ deptTable.totals.value.pegawaiTotal }}</td>
                  <td class="cell-accent">{{ deptTable.totals.value.pengisianOrganik }}</td>
                  <td class="cell-accent">{{ deptTable.totals.value.pengisianNonOrganik }}</td>
                  <td class="cell-accent">{{ deptTable.totals.value.pengisianTotal }}</td>
                  <td class="cell-accent">{{ deptTable.totals.value.persenOrganik }}%</td>
                  <td class="cell-accent">{{ deptTable.totals.value.persenNonOrganik }}%</td>
                  <td class="cell-accent">{{ deptTable.totals.value.persenTotal }}%</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="pagination">
            <span class="pagination-label">
              Menampilkan
              {{ deptTable.rows.value.length === 0 ? 0 : deptTable.pageStart.value + 1 }}-{{
                deptTable.pageEnd.value
              }}
              dari {{ deptTable.rows.value.length }} departemen
            </span>
            <div class="pagination-actions">
              <button
                type="button"
                class="btn-secondary"
                :disabled="deptTable.page.value === 1"
                @click="deptTable.page.value--"
              >
                Sebelumnya
              </button>
              <button
                type="button"
                class="btn-primary"
                :disabled="deptTable.page.value === deptTable.totalPages.value"
                @click="deptTable.page.value++"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import BelumSurveyTable from "./components/BelumSurveyTable.vue";
import { useSurveyStore } from "./stores/surveyStore";

const store = useSurveyStore();

onMounted(() => store.ensureBaseData());

const dateFrom = ref("");
const dateTo = ref("");
const dateFromInput = ref(null);
const dateToInput = ref(null);
const expandedDate = ref(null);

function toggleBelumSurvey(tanggal) {
  expandedDate.value = expandedDate.value === tanggal ? null : tanggal;
}

function openPicker(inputEl) {
  if (!inputEl) return;
  if (typeof inputEl.showPicker === "function") {
    inputEl.showPicker();
  } else {
    inputEl.focus();
  }
}

const filteredSubmissions = computed(() => {
  if (!dateFrom.value && !dateTo.value) return store.submissions;
  return store.submissions.filter((s) => {
    if (dateFrom.value && s.tanggal < dateFrom.value) return false;
    if (dateTo.value && s.tanggal > dateTo.value) return false;
    return true;
  });
});

function useParticipationTable(getKey, { pageSize = 3, sort } = {}) {
  const page = ref(1);

  const rows = computed(() => {
    const list = store.participationGroupedBy(getKey, filteredSubmissions.value);
    return sort ? [...list].sort(sort) : list;
  });

  const totalPages = computed(() => Math.max(1, Math.ceil(rows.value.length / pageSize)));

  watch(rows, () => {
    if (page.value > totalPages.value) page.value = totalPages.value;
  });

  const pageStart = computed(() => (page.value - 1) * pageSize);
  const pageEnd = computed(() => Math.min(pageStart.value + pageSize, rows.value.length));
  const pagedRows = computed(() => rows.value.slice(pageStart.value, pageEnd.value));

  const totals = computed(() => {
    const list = rows.value;
    const first = list[0];
    const pengisianOrganik = list.reduce((sum, r) => sum + r.pengisianOrganik, 0);
    const pengisianNonOrganik = list.reduce((sum, r) => sum + r.pengisianNonOrganik, 0);
    const pengisianTotal = pengisianOrganik + pengisianNonOrganik;
    const pegawaiOrganik = first?.pegawaiOrganik ?? 0;
    const pegawaiNonOrganik = first?.pegawaiNonOrganik ?? 0;
    const pegawaiTotal = first?.pegawaiTotal ?? 0;

    return {
      pegawaiOrganik,
      pegawaiNonOrganik,
      pegawaiTotal,
      pengisianOrganik,
      pengisianNonOrganik,
      pengisianTotal,
      persenOrganik: pegawaiOrganik > 0 ? Math.round((pengisianOrganik / pegawaiOrganik) * 1000) / 10 : 0,
      persenNonOrganik:
        pegawaiNonOrganik > 0 ? Math.round((pengisianNonOrganik / pegawaiNonOrganik) * 1000) / 10 : 0,
      persenTotal: pegawaiTotal > 0 ? Math.round((pengisianTotal / pegawaiTotal) * 1000) / 10 : 0,
    };
  });

  return { page, rows, totalPages, pageStart, pageEnd, pagedRows, totals };
}

const dateTable = useParticipationTable((s) => s.tanggal, {
  pageSize: 6,
  sort: (a, b) => (a.key < b.key ? 1 : -1),
});
const deptTable = useParticipationTable((s) => s.departemen, {
  pageSize: 10,
  sort: (a, b) => (a.key < b.key ? -1 : 1),
});

function percentValueClass(value) {
  return value >= 10 ? "value-positive" : "value-neutral";
}

function formatDate(isoDate) {
  const date = new Date(isoDate);
  return date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
}
</script>

<style scoped>
.report-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}

.page-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.page-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--color-text);
  letter-spacing: -0.01em;
}

.page-subtitle {
  font-size: 14px;
  color: var(--color-text-muted);
  max-width: 720px;
}

.report-main {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Report card */
.report-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.card-title {
  font-size: 15px;
  font-weight: 700;
  color: var(--color-text);
}

.card-subtitle {
  font-size: 13px;
  color: var(--color-text-muted);
  margin-top: 2px;
}

.card-header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.date-filter {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 40px;
  padding: 0 14px;
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-md);
  background-color: var(--color-surface);
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.date-filter:hover {
  border-color: var(--color-primary-light);
}

.date-filter:focus-within {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(0, 93, 172, 0.15);
}

.date-filter-arrow {
  color: var(--color-text-muted);
  flex-shrink: 0;
}

.date-segment {
  position: relative;
  display: flex;
  align-items: center;
  height: 100%;
  gap: 6px;
}

.date-segment-icon {
  position: relative;
  z-index: 2;
  color: var(--color-primary);
  flex-shrink: 0;
  cursor: pointer;
}

.date-input {
  border: none;
  outline: none;
  width: 90px;
  height: 100%;
  font-family: var(--font-sans);
  font-size: 13px;
  color: var(--color-text-secondary);
  background: transparent;
}

.date-input::-webkit-calendar-picker-indicator {
  opacity: 0;
  -webkit-appearance: none;
}

.date-placeholder {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  padding-left: 20px;
  background-color: var(--color-surface);
  color: var(--color-text-muted);
  font-size: 13px;
  cursor: pointer;
}

.date-filter-clear {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: var(--color-text-muted);
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  flex-shrink: 0;
  transition: background-color 0.15s ease, color 0.15s ease;
}

.date-filter-clear:hover {
  background-color: var(--color-danger-bg);
  color: var(--color-danger);
}

.date-filter-clear:hover {
  color: var(--color-danger);
}

.table-scroll {
  overflow-x: auto;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.report-table {
  width: 100%;
  min-width: 900px;
  border-collapse: collapse;
  font-size: 13px;
}

.report-table thead th {
  text-align: center;
  padding: 10px 14px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  background-color: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
  border-right: 1px solid var(--color-border);
  white-space: nowrap;
}

.report-table thead .group-row th:first-child,
.report-table thead .group-row th:nth-child(2) {
  text-align: left;
}

.report-table tbody td {
  text-align: center;
  padding: 12px 14px;
  border-bottom: 1px solid var(--color-border);
  border-right: 1px solid var(--color-border);
  color: var(--color-text);
}

.report-table tbody td:first-child,
.report-table tbody td:nth-child(2) {
  text-align: left;
}

.report-table tbody tr:last-child td {
  border-bottom: none;
}

.report-table th:last-child,
.report-table td:last-child {
  border-right: none;
}

.report-table tbody tr:not(.total-row):not(.expand-row):hover td {
  background-color: rgba(248, 250, 252, 0.8);
}

.report-table tbody tr {
  transition: background-color 0.15s ease;
}

.cell-accent {
  color: var(--color-primary);
  font-weight: 600;
}

.cell-date {
  color: var(--color-text);
}

.link-belum-survey {
  display: block;
  margin-top: 2px;
  border: none;
  background: transparent;
  padding: 0;
  color: var(--color-primary);
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  text-align: left;
}

.link-belum-survey:hover {
  text-decoration: underline;
}

.expand-row td {
  background-color: var(--color-bg);
  text-align: left;
  padding: 16px 20px;
}

.total-row td {
  font-weight: 700;
  color: var(--color-primary);
  background-color: #eff6ff;
}

.percent-value {
  font-weight: 600;
}

.value-positive {
  color: var(--color-success);
}

.value-neutral {
  color: var(--color-text-secondary);
}

.empty-row {
  text-align: center !important;
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

.pagination-actions {
  display: flex;
  gap: 8px;
}

.btn-secondary,
.btn-primary {
  padding: 8px 16px;
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.btn-secondary {
  border: 1px solid var(--color-border);
  background-color: var(--color-surface);
  color: var(--color-text-secondary);
}

.btn-secondary:hover:not(:disabled) {
  background-color: var(--color-bg);
}

.btn-primary {
  border: none;
  background-color: var(--color-primary);
  color: #ffffff;
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--color-primary-dark);
}

.btn-secondary:disabled,
.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

</style>
