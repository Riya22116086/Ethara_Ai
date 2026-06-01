import React from 'react';
import Modal from './Modal';

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Delete',
  confirmClassName = 'bg-rose-600 hover:bg-rose-500',
}) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      {message && (
        <p className="mb-6 text-sm leading-relaxed text-slate-400">{message}</p>
      )}
      <div className="flex items-center justify-end gap-3">
        <button
          onClick={onClose}
          className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-700 hover:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500 ${confirmClassName}`}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
