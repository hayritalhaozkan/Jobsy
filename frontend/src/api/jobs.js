import client from "./client";

/* öğrenci feed */
export async function fetchJobsByUniversity(universityId) {
  const res = await client.get(`/jobs?universityId=${universityId}`);
  return res.data.data;
}

/* ilan detayı */
export async function fetchJobDetail(id) {
  const res = await client.get(`/jobs/${id}`);
  return res.data;
}

/* işveren kendi ilanları */
export async function fetchEmployerJobs() {
  const token = localStorage.getItem("token");

  const res = await client.get("/jobs/employer/mine", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data.data;
}

/* işveren dashboard özeti */
export async function fetchEmployerDashboard() {
  const token = localStorage.getItem("token");

  const res = await client.get("/jobs/employer/dashboard", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
}

/* yeni ilan oluştur */
export async function createJob(data) {
  const token = localStorage.getItem("token");

  const res = await client.post("/jobs", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
}

/* ilan güncelle */
export async function updateJob(id, data) {
  const token = localStorage.getItem("token");

  const res = await client.patch(`/jobs/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
}

/* ilan pasife alma */
export async function deactivateJob(id) {
  const token = localStorage.getItem("token");

  await client.patch(
    `/jobs/${id}/deactivate`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

/* ilan aktifleştirme */
export async function activateJob(id) {
  const token = localStorage.getItem("token");

  await client.patch(
    `/jobs/${id}/activate`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

/* ogrenci - kaydedilen is ilanlari */
export async function fetchSavedJobs() {
  const token = localStorage.getItem("token");
  const res = await client.get("/jobs/student/saved", {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data.data;
}

export async function checkJobSaved(id) {
  const token = localStorage.getItem("token");
  if (!token) return { isSaved: false }; // Guest user check
  try {
    const res = await client.get(`/jobs/${id}/check-save`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (err) {
    return { isSaved: false };
  }
}

export async function saveJob(id) {
  const token = localStorage.getItem("token");
  const res = await client.post(`/jobs/${id}/save`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

export async function unsaveJob(id) {
  const token = localStorage.getItem("token");
  const res = await client.delete(`/jobs/${id}/save`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}