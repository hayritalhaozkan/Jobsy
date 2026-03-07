import client from "./client";

export async function fetchUniversities(limit = 200) {
  const res = await client.get(`/universities?limit=${limit}`);
  return res.data.data;
}