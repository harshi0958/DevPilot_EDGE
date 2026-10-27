"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { studentService } from '@/services/studentService';
import { Student } from '@/types/student';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Trash2, Edit } from 'lucide-react';

export default function StudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await studentService.getStudents({ search });
      setStudents(res.data);
    } catch (error) {
      console.error('Failed to fetch students', error);
    } finally {
      setLoading(false);
    };
  };

  useEffect(() => {
    fetchStudents();
  }, [search]);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this student?')) {
      try {
        await studentService.deleteStudent(id);
        fetchStudents();
      } catch (error) {
        console.error('Failed to delete student', error);
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Management</h1>
          <p className="text-muted-foreground">Manage student records, view details, and track enrollments.</p>
        </div>
        <Button onClick={() => router.push('/dashboard/students/new')}>
          <Plus className="mr-2 h-4 w-4" /> Add Student
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, email or enrollment no..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="border rounded-md">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="p-3 font-medium">Enrollment No</th>
              <th className="p-3 font-medium">Name</th>
              <th className="p-3 font-medium">Email</th>
              <th className="p-3 font-medium">Course</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-muted-foreground">Loading students...</td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-muted-foreground">No students found.</td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student.id} className="border-b hover:bg-muted/30">
                  <td className="p-3 font-mono text-sm">{student.enrollmentNo}</td>
                  <td className="p-3 font-medium">{student.firstName} {student.lastName}</td>
                  <td className="p-3 text-muted-foreground">{student.email}</td>
                  <td className="p-3">{student.course}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      student.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                      student.status === 'INACTIVE' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/students/${student.id}`)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(student.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}