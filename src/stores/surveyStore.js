import { defineStore } from "pinia";
import { BUKTI_BUCKET, supabase } from "../lib/supabaseClient";

// ── Row <-> app-shape mappers (DB columns are snake_case, the app/components
// use the camelCase field names that were already in place before this
// Supabase migration, so component templates don't need to change) ────────

function mapSurvey(row) {
  return {
    id: row.id,
    nama: row.nama,
    link: row.link ?? "",
    tanggalMulai: row.tanggal_mulai ?? "",
    tanggalSelesai: row.tanggal_selesai ?? "",
    status: row.status,
    maxPengisian: row.max_pengisian,
  };
}

function toSurveyRow({ nama, link, tanggalMulai, tanggalSelesai, status, maxPengisian }) {
  let processedLink = link ? link.trim() : "";
  // Auto-add https:// if link doesn't start with http:// or https://
  if (processedLink && !processedLink.match(/^https?:\/\//i)) {
    processedLink = "https://" + processedLink;
  }
  return {
    nama: nama.trim(),
    link: processedLink,
    tanggal_mulai: tanggalMulai || null,
    tanggal_selesai: tanggalSelesai || null,
    status: status || "Draft",
    max_pengisian: Number(maxPengisian) || 20,
  };
}

function mapSubmission(row) {
  return {
    id: row.id,
    nama: row.nama,
    tanggal: row.tanggal,
    surveyId: row.survey_id,
    jenisPegawai: row.jenis_pegawai,
    departemen: row.departemen,
    fileBukti: row.file_bukti,
  };
}

function mapEmployee(row) {
  return {
    id: row.id,
    nama: row.nama,
    unitKerja: row.unit_kerja,
    jenisPegawai: row.jenis_pegawai,
  };
}

function mapNotification(row) {
  return {
    id: row.id,
    message: row.message,
    createdAt: row.created_at,
    read: row.read,
  };
}

export const useSurveyStore = defineStore("survey", {
  state: () => ({
    surveys: [],
    submissions: [],
    employees: [],
    notifications: [],
    workforceTotals: { Organik: 0, "Non-Organik": 0 },
    lastSubmission: null,
    baseDataLoaded: false,
    realtimeChannels: [],
  }),

  getters: {
    findSurvey: (state) => (surveyId) =>
      state.surveys.find((s) => s.id === surveyId) || null,

    submissionCountForSurvey: (state) => (surveyId) =>
      state.submissions.filter((s) => s.surveyId === surveyId).length,

    submissionCountForEmployeeSurvey: (state) => (surveyId, nama) =>
      state.submissions.filter((s) => s.surveyId === surveyId && s.nama === nama).length,

    isSurveyFullForEmployee() {
      return (surveyId, nama) => {
        const survey = this.findSurvey(surveyId);
        if (!survey || !survey.maxPengisian || !nama) return false;
        return this.submissionCountForEmployeeSurvey(surveyId, nama) >= survey.maxPengisian;
      };
    },

    activeAvailableSurveys() {
      return this.surveys.filter((s) => s.status === "Aktif");
    },

    employeesBelumSurvey(state) {
      const submittedNames = new Set(state.submissions.map((s) => s.nama));
      return state.employees.filter((e) => !submittedNames.has(e.nama));
    },

    employeesBelumSurveyOnDate: (state) => (tanggal) => {
      const submittedNames = new Set(
        state.submissions.filter((s) => s.tanggal === tanggal).map((s) => s.nama)
      );
      return state.employees.filter((e) => !submittedNames.has(e.nama));
    },

    submissionsBySurvey: (state) => (surveyId) =>
      state.submissions.filter((s) => s.surveyId === surveyId),

    sortedNotifications: (state) => [...state.notifications].sort((a, b) => b.id - a.id),

    unreadNotificationCount: (state) => state.notifications.filter((n) => !n.read).length,

    participationGroupedBy(state) {
      return (getKey, submissionsList) => {
        const list = submissionsList ?? state.submissions;
        const totalOrganik = state.workforceTotals.Organik;
        const totalNonOrganik = state.workforceTotals["Non-Organik"];
        const totalPegawai = totalOrganik + totalNonOrganik;

        const grouped = new Map();
        for (const submission of list) {
          const key = getKey(submission);
          if (!grouped.has(key)) {
            grouped.set(key, { organik: 0, nonOrganik: 0 });
          }
          const bucket = grouped.get(key);
          if (submission.jenisPegawai === "Organik") bucket.organik++;
          else bucket.nonOrganik++;
        }

        return Array.from(grouped.entries()).map(([key, { organik, nonOrganik }]) => ({
          key,
          pegawaiOrganik: totalOrganik,
          pegawaiNonOrganik: totalNonOrganik,
          pegawaiTotal: totalPegawai,
          pengisianOrganik: organik,
          pengisianNonOrganik: nonOrganik,
          pengisianTotal: organik + nonOrganik,
          persenOrganik: totalOrganik > 0 ? Math.round((organik / totalOrganik) * 1000) / 10 : 0,
          persenNonOrganik:
            totalNonOrganik > 0 ? Math.round((nonOrganik / totalNonOrganik) * 1000) / 10 : 0,
          persenTotal:
            totalPegawai > 0
              ? Math.round(((organik + nonOrganik) / totalPegawai) * 1000) / 10
              : 0,
        }));
      };
    },
  },

  actions: {
    // ── Fetches (populate the reactive cache from Supabase) ──────────────
    async fetchSurveys() {
      const { data, error } = await supabase.from("surveys").select("*").order("id");
      if (error) throw error;
      this.surveys = data.map(mapSurvey);
    },

    async fetchSubmissions() {
      const { data, error } = await supabase.from("submissions").select("*").order("id");
      if (error) throw error;
      this.submissions = data.map(mapSubmission);
    },

    async fetchEmployees() {
      const { data, error } = await supabase.from("employees").select("*").order("nama");
      if (error) throw error;
      this.employees = data.map(mapEmployee);
    },

    async fetchWorkforceTotals() {
      const { data, error } = await supabase.from("workforce_totals").select("*");
      if (error) throw error;
      const totals = { Organik: 0, "Non-Organik": 0 };
      for (const row of data) totals[row.jenis_pegawai] = row.total;
      this.workforceTotals = totals;
    },

    async fetchNotifications() {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("id", { ascending: false })
        .limit(50);
      if (error) throw error;
      this.notifications = data.map(mapNotification);
    },

    // Fetches the shared data every page needs (surveys, employees,
    // submissions, workforce totals). Safe to call from every page's
    // onMounted — only hits the network once thanks to baseDataLoaded.
    async ensureBaseData() {
      if (this.baseDataLoaded) return;
      await Promise.all([
        this.fetchSurveys(),
        this.fetchEmployees(),
        this.fetchSubmissions(),
        this.fetchWorkforceTotals(),
      ]);
      this.baseDataLoaded = true;
    },

    // ── Mutations ─────────────────────────────────────────────────────────
    async addSurvey(payload) {
      const { data, error } = await supabase
        .from("surveys")
        .insert(toSurveyRow(payload))
        .select()
        .single();
      if (error) throw error;
      const survey = mapSurvey(data);
      this.surveys.push(survey);
      return survey;
    },

    async updateSurvey(surveyId, payload) {
      const { data, error } = await supabase
        .from("surveys")
        .update(toSurveyRow(payload))
        .eq("id", surveyId)
        .select()
        .single();
      if (error) throw error;
      const survey = mapSurvey(data);
      const index = this.surveys.findIndex((s) => s.id === surveyId);
      if (index !== -1) this.surveys[index] = survey;
      return survey;
    },

    async updateSurveyStatus(surveyId, status) {
      const { error } = await supabase.from("surveys").update({ status }).eq("id", surveyId);
      if (error) throw error;
      const survey = this.findSurvey(surveyId);
      if (survey) survey.status = status;
    },

    async removeSurvey(surveyId) {
      const { error } = await supabase.from("surveys").delete().eq("id", surveyId);
      if (error) throw error;
      this.surveys = this.surveys.filter((s) => s.id !== surveyId);
      this.submissions = this.submissions.filter((s) => s.surveyId !== surveyId);
    },

    async addSubmission({ nama, tanggal, surveyId, jenisPegawai, departemen, file }) {
      const path = `${surveyId}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from(BUKTI_BUCKET)
        .upload(path, file);
      if (uploadError) {
        throw new Error(`Gagal mengunggah bukti: ${uploadError.message}`);
      }

      const { data, error } = await supabase
        .from("submissions")
        .insert({
          nama,
          tanggal,
          survey_id: surveyId,
          jenis_pegawai: jenisPegawai,
          departemen,
          file_bukti: path,
        })
        .select()
        .single();

      if (error) {
        // The DB trigger raises the quota/inactive-survey exceptions in
        // Indonesian already (see enforce_submission_quota in
        // 001_schema.sql) — surface that message as-is to the toast.
        throw new Error(error.message);
      }

      const submission = mapSubmission(data);
      this.submissions.push(submission);
      this.lastSubmission = submission;
      return submission;
    },

    async markNotificationRead(notificationId) {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", notificationId);
      if (error) throw error;
      const notification = this.notifications.find((n) => n.id === notificationId);
      if (notification) notification.read = true;
    },

    async markAllNotificationsRead() {
      const unreadIds = this.notifications.filter((n) => !n.read).map((n) => n.id);
      if (unreadIds.length === 0) return;
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .in("id", unreadIds);
      if (error) throw error;
      this.notifications.forEach((n) => {
        n.read = true;
      });
    },

    // ── Realtime subscriptions ────────────────────────────────────────────
    setupRealtimeSubscriptions() {
      const surveysChannel = supabase
        .channel("surveys-changes")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "surveys" },
          (payload) => {
            const survey = mapSurvey(payload.new);
            this.surveys.push(survey);
          }
        )
        .on(
          "postgres_changes",
          { event: "UPDATE", schema: "public", table: "surveys" },
          (payload) => {
            const index = this.surveys.findIndex((s) => s.id === payload.new.id);
            if (index !== -1) {
              this.surveys[index] = mapSurvey(payload.new);
            }
          }
        )
        .on(
          "postgres_changes",
          { event: "DELETE", schema: "public", table: "surveys" },
          (payload) => {
            this.surveys = this.surveys.filter((s) => s.id !== payload.old.id);
          }
        )
        .subscribe();

      const submissionsChannel = supabase
        .channel("submissions-changes")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "submissions" },
          (payload) => {
            const submission = mapSubmission(payload.new);
            this.submissions.push(submission);
            this.lastSubmission = submission;
          }
        )
        .on(
          "postgres_changes",
          { event: "UPDATE", schema: "public", table: "submissions" },
          (payload) => {
            const index = this.submissions.findIndex((s) => s.id === payload.new.id);
            if (index !== -1) {
              this.submissions[index] = mapSubmission(payload.new);
            }
          }
        )
        .on(
          "postgres_changes",
          { event: "DELETE", schema: "public", table: "submissions" },
          (payload) => {
            this.submissions = this.submissions.filter((s) => s.id !== payload.old.id);
          }
        )
        .subscribe();

      const notificationsChannel = supabase
        .channel("notifications-changes")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "notifications" },
          (payload) => {
            const notification = mapNotification(payload.new);
            this.notifications.unshift(notification);
          }
        )
        .on(
          "postgres_changes",
          { event: "UPDATE", schema: "public", table: "notifications" },
          (payload) => {
            const index = this.notifications.findIndex((n) => n.id === payload.new.id);
            if (index !== -1) {
              this.notifications[index] = mapNotification(payload.new);
            }
          }
        )
        .subscribe();

      this.realtimeChannels.push(surveysChannel, submissionsChannel, notificationsChannel);
    },

    cleanupRealtimeSubscriptions() {
      for (const channel of this.realtimeChannels) {
        supabase.removeChannel(channel);
      }
      this.realtimeChannels = [];
    },
  },
});
