// Simple in-memory data store for students.
// Swappable for MongoDB later: replace the functions below with
// Mongoose model calls that return the same shapes.

let students = [
  { id: 1, name: "Aditi Sharma", email: "aditi.sharma@mail.com", course: "B.Tech CSE", marks: 78 },
  { id: 2, name: "Rohan Verma", email: "rohan.verma@mail.com", course: "BCA", marks: 31 },
  { id: 3, name: "Neha Gupta", email: "neha.gupta@mail.com", course: "B.Tech CSE", marks: 92 },
];

let nextId = 4;

function withResult(student) {
  return { ...student, result: student.marks >= 40 ? "Pass" : "Fail" };
}

function getAll() {
  return students.map(withResult);
}

function getById(id) {
  const student = students.find((s) => s.id === id);
  return student ? withResult(student) : null;
}

function findByEmail(email, excludeId = null) {
  return students.find(
    (s) => s.email.toLowerCase() === email.toLowerCase() && s.id !== excludeId
  );
}

function create(data) {
  const student = {
    id: nextId++,
    name: data.name,
    email: data.email,
    course: data.course,
    marks: data.marks,
  };
  students.push(student);
  return withResult(student);
}

function update(id, data) {
  const index = students.findIndex((s) => s.id === id);
  if (index === -1) return null;
  students[index] = { ...students[index], ...data };
  return withResult(students[index]);
}

function remove(id) {
  const index = students.findIndex((s) => s.id === id);
  if (index === -1) return false;
  students.splice(index, 1);
  return true;
}

function searchByName(name) {
  const query = name.toLowerCase();
  return students.filter((s) => s.name.toLowerCase().includes(query)).map(withResult);
}

module.exports = {
  getAll,
  getById,
  findByEmail,
  create,
  update,
  remove,
  searchByName,
};
