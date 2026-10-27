"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { studentService } from '@/services/studentService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function NewStudentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    enrollmentNo: '',
    course: '',
    status: 'ACTIVE' as const,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await studentService.createStudent(form);
      router.push('/dashboard/students');
    } catch (error) {
      console.error('Failed to create student', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Add New Student</h1>
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

        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Student'}
          </Button>
        </div>
      </form>
    </div>
  );
}