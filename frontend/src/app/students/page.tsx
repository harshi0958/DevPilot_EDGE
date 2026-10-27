'use client';

import React, { useEffect, useState } from 'react';
import { Student } from '@/types/student';
import { fetchStudents, createStudent, updateStudent, deleteStudent } from '@/services/studentService';

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [form, setForm] = useState({ name: '', email: '', age: '', grade: '' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const loadStudents = async () => {
    try {
      const data = await fetchStudents();
      setStudents(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateStudent(editingId, { ...form, age: Number(form.age) });
        setEditingId(null);
      } else {
        await createStudent({ ...form, age: Number(form.age) });
      }
      setForm({ name: '', email: '', age: '', grade: '' });
      loadStudents();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEdit = (student: Student) => {
    setEditingId(student.id);
    setForm({ name: student.name, email: student.email, age: student.age.toString(), grade: student.grade });
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteStudent(id);
      loadStudents();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Student Management System</h1>
      {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>}
      
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-6 grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          placeholder="Age"
          value={form.age}
          onChange={(e) => setForm({ ...form, age: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Grade"
          value={form.grade}
          onChange={(e) => setForm({ ...form, grade: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <button type="submit" className="col-span-2 bg-blue-600 text-white p-2 rounded">
          {editingId ? 'Update Student' : 'Add Student'}
        </button>
      </form>

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Age</th>
              <th className="p-3 text-left">Grade</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="border-b">
                <td className="p-3">{student.name}</td>
                <td className="p-3">{student.email}</td>
                <td className="p-3">{student.age}</td>
                <td className="p-3">{student.grade}</td>
                <td className="p-3 text-right">
                  <button onClick={() => handleEdit(student)} className="text-blue-600 mr-3">Edit</button>
                  <button onClick={() => handleDelete(student.id)} className="text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}