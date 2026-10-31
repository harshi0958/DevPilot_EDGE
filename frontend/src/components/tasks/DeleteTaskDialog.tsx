'use client';

import React from 'react';

interface DeleteTaskDialogProps {
  isOpen: boolean;
  taskId: string | null;
  taskTitle?: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export const DeleteTaskDialog: React.FC<DeleteTaskDialogProps> = ({
  isOpen,
  taskTitle,
  onClose,
  onConfirm,
}) => {
  const [deleting, setDeleting] = React.useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    try {
      setDeleting(true);
      await onConfirm();
      onClose();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 border border-neutral-200">
        <h3 className="text-lg font-semibold text-neutral-900 mb-2">
          Delete Task
        </h3>
        <p className="text-sm text-neutral-600 mb-6">
          Are you sure you want to delete <span className="font-medium text-neutral-900">"{taskTitle}"</span>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="px-4 py-2 border rounded-md text-sm font-medium text-neutral-700 hover:bg-neutral-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={deleting}
            className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 disabled:opacity-50"
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};