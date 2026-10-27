'use client';

import React, { useEffect, useState } from 'react';
import { Student } from '@/types/student';
import { StudentService } from '@/services/studentService';

interface StudentManagerProps {
  projectId: string;
}

export default function StudentManager({ projectId }: StudentManagerProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', enrollmentNo: '', course: '', status: 'ACTIVE' });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const fetchStudents = async () => {
    try {
      const data = await StudentService.getStudents(projectId);
      setStudents(data);
    } catch (err) {
      setError('Failed to load students');
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchStudents();
    }
  }, [projectId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await StudentService.updateStudent(projectId, editingId, form);
        setEditingId(null);
      } else {
        await StudentService.createStudent(projectId, form);
      }

      setForm({ firstName: '', lastName: '', email: '', enrollmentNo: '', course: '', status: 'ACTIVE' });
      fetchStudents();
    } catch (err) {
      setError('Failed to save student');
    }
  };

  const handleEdit = (student: Student) => {
    setEditingId(student.id);
    setForm({
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      enrollmentNo: student.enrollmentNo,
      course: student.course,
      status: student.status,
    });
  };

  const handleDelete = async (id: string) => {
    try {
      await StudentService.deleteStudent(projectId, id);
      fetchStudents();
    } catch (err) {
      setError('Failed to delete student');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Student Management System</h1>
      
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="First Name"
          value={form.firstName}
          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          value={form.lastName}
          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
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
          type="text"
          placeholder="Enrollment No"
          value={form.enrollmentNo}
          onChange={(e) => setForm({ ...form, enrollmentNo: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Course"
          value={form.course}
          onChange={(e) => setForm({ ...form, course: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <button type="submit" className="md:col-span-3 bg-blue-600 text-white p-2 rounded font-semibold hover:bg-blue-700">
          {editingId ? 'Update Student' : 'Add Student'}
        </button>
      </form>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 border-b">Name</th>
              <th className="p-3 border-b">Email</th>
              <th className="p-3 border-b">Enrollment No</th>
              <th className="p-3 border-b">Course</th>
              <th className="p-3 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="p-3 border-b">{student.firstName} {student.lastName}</td>
                <td className="p-3 border-b">{student.email}</td>
                <td className="p-3 border-b">{student.enrollmentNo}</td>
                <td className="p-3 border-b">{student.course}</td>
                <td className="p-3 border-b space-x-2">
                  <button onClick={() => handleEdit(student)} className="text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(student.id)} className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center p-4 text-gray-500">No students found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}