'use client';

import React, { useEffect, useState } from 'react';
import { Student } from '@/types/student';
import { studentService } from '@/services/studentService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Trash2, Edit } from 'lucide-react';

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    enrollmentNo: '',
    course: '',
    status: 'ACTIVE' as const,
  });

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await studentService.getStudents({ search });
      const list = Array.isArray(response) ? response : (response as any).data || [];
      setStudents(list);
    } catch (err) {
      console.error('Failed to fetch students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && currentId) {
        await studentService.updateStudent(currentId, formData);
      } else {
        await studentService.createStudent(formData);
      }
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        enrollmentNo: '',
        course: '',
        status: 'ACTIVE',
      });
      setIsEditing(false);
      setCurrentId(null);
      fetchStudents();
    } catch (err) {
      console.error('Failed to save student:', err);
    }
  };

  const handleEdit = (student: Student) => {
    setIsEditing(true);
    setCurrentId(student.id);
    setFormData({
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      enrollmentNo: student.enrollmentNo,
      course: student.course,
      status: (student.status as any) || 'ACTIVE',
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this student?')) {
      try {
        await studentService.deleteStudent(id);
        fetchStudents();
      } catch (err) {
        console.error('Failed to delete student:', err);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Management</h1>
          <p className="text-muted-foreground">Manage student records, enrollments, and academic status.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-card border p-4 rounded-lg shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          placeholder="First Name"
          value={formData.firstName}
          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          required
        />
        <Input
          placeholder="Last Name"
          value={formData.lastName}
          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          required
        />
        <Input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <Input
          placeholder="Enrollment No"
          value={formData.enrollmentNo}
          onChange={(e) => setFormData({ ...formData, enrollmentNo: e.target.value })}
          required
        />
        <Input
          placeholder="Course"
          value={formData.course}
          onChange={(e) => setFormData({ ...formData, course: e.target.value })}
          required
        />
        <select
          className="border rounded-md p-2 bg-background text-sm"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
        >
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="GRADUATED">Graduated</option>
          <option value="SUSPENDED">Suspended</option>
        </select>
        <div className="md:col-span-3 flex justify-end gap-2">
          {isEditing && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsEditing(false);
                setCurrentId(null);
                setFormData({
                  firstName: '',
                  lastName: '',
                  email: '',
                  enrollmentNo: '',
                  course: '',
                  status: 'ACTIVE',
                });
              }}
            >
              Cancel
            </Button>
          )}
          <Button type="submit">
            {isEditing ? 'Update Student' : 'Add Student'}
          </Button>
        </div>
      </form>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or enrollment no..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="border rounded-lg bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Enrollment No</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Loading students...
                </TableCell>
              </TableRow>
            ) : students.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No students found.
                </TableCell>
              </TableRow>
            ) : (
              students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-mono text-sm">{student.enrollmentNo}</TableCell>
                  <TableCell className="font-medium">{student.firstName} {student.lastName}</TableCell>
                  <TableCell className="text-muted-foreground">{student.email}</TableCell>
                  <TableCell>{student.course}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        student.status === 'ACTIVE'
                          ? 'default'
                          : student.status === 'GRADUATED'
                          ? 'secondary'
                          : 'destructive'
                      }
                    >
                      {student.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(student)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => handleDelete(student.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}