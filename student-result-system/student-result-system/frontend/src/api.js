const BASE_URL = "http://localhost:5000";

async function handleResponse(res) {
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(body.message || "Request failed");
    error.errors = body.errors || (body.message ? [body.message] : ["Something went wrong."]);
    error.status = res.status;
    throw error;
  }
  return body;
}

export async function fetchStudents() {
  const res = await fetch(`${BASE_URL}/students`);
  return handleResponse(res);
}

export async function searchStudents(name) {
  const res = await fetch(`${BASE_URL}/students/search?name=${encodeURIComponent(name)}`);
  return handleResponse(res);
}

export async function createStudent(data) {
  const res = await fetch(`${BASE_URL}/students`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function updateStudent(id, data) {
  const res = await fetch(`${BASE_URL}/students/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function deleteStudent(id) {
  const res = await fetch(`${BASE_URL}/students/${id}`, {
    method: "DELETE",
  });
  return handleResponse(res);
}
