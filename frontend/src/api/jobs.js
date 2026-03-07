import client from "./client";

export async function fetchJobsByUniversity(universityId) {
  const res = await client.get(`/jobs?universityId=${universityId}`);
  return res.data.data;
}

export async function fetchJobDetail(id) {
  const res = await client.get(`/jobs/${id}`);
  return res.data;
}