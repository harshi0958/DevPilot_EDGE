"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { studentService } from '@/services/studentService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function EditStudentPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    enrollmentNo: '',
    course: '',
    status: 'ACTIVE' as 'ACTIVE' | 'INACTIVE' | 'GRADUATED',
  });

  useEffect(() => {
    if (id) {
      studentService.getStudentById(id)
        .then((res) => {
          setForm({
            firstName: res.data.firstName,
            lastName: res.data.lastName,
            email: res.data.email,
            enrollmentNo: res.data.enrollmentNo,
            course: res.data.course,
            status: res.data.status,
          });
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await studentService.updateStudent(id, form);
      router.push('/dashboard/students');
    } catch (error) {
      console.error('Failed to update student', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading student details...</div>;
  }

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Edit Student</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>First Name</Label>
            <Input
              required
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Last Name</Label>
            <Input
              required
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Email</Label>
          <Input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Enrollment Number</Label>
          <Input
            required
            value={form.enrollmentNo}
            onChange={(e) => setForm({ ...form, enrollmentNo: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Course</Label>
          <Input
            required
            value={form.course}
            onChange={(e) => setForm({ ...form, course: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Status</Label>
          <select
            className="w-full border rounded-md p-2 bg-background"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as any })}
          >
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="GRADUATED">Graduated</option>
          </select>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Updating...' : 'Update Student'}
          </Button>
        </div>
      </form>
    </div>
  );
}