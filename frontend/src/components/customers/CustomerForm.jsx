import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EMPTY_FORM = { name: '', email: '', phone: '' };
const EMPTY_ERRORS = { name: '', email: '', phone: '' };

export default function CustomerForm({ isOpen, onClose, onSubmit, loading }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState(EMPTY_ERRORS);

  // Reset form whenever the modal opens
  useEffect(() => {
    if (isOpen) {
      setForm(EMPTY_FORM);
      setErrors(EMPTY_ERRORS);
    }
  }, [isOpen]);

  const validate = () => {
    const next = { name: '', email: '', phone: '' };
    let valid = true;

    if (!form.name.trim()) {
      next.name = 'Full name is required.';
      valid = false;
    }

    if (!form.email.trim()) {
      next.email = 'Email address is required.';
      valid = false;
    } else if (!EMAIL_REGEX.test(form.email.trim())) {
      next.email = 'Please enter a valid email address.';
      valid = false;
    }

    if (!form.phone.trim()) {
      next.phone = 'Phone number is required.';
      valid = false;
    }

    setErrors(next);
    return valid;
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    // Clear the field error on change
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim() });
  };

  const inputBase =
    'w-full rounded-lg border bg-slate-800/80 px-3.5 py-2 text-sm text-white placeholder-slate-500 shadow-sm focus:outline-none focus:ring-2 transition-colors';
  const inputNormal = `${inputBase} border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20`;
  const inputError = `${inputBase} border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/20`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Customer">
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
            Full Name
          </label>
          <input
            type="text"
            placeholder="e.g. Jane Smith"
            value={form.name}
            onChange={handleChange('name')}
            disabled={loading}
            className={errors.name ? inputError : inputNormal}
          />
          {errors.name && (
            <p className="mt-1.5 text-xs text-rose-400">{errors.name}</p>
          )}
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
            Email Address
          </label>
          <input
            type="text"
            placeholder="jane.smith@example.com"
            value={form.email}
            onChange={handleChange('email')}
            disabled={loading}
            className={errors.email ? inputError : inputNormal}
          />
          {errors.email && (
            <p className="mt-1.5 text-xs text-rose-400">{errors.email}</p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
            Phone Number
          </label>
          <input
            type="text"
            placeholder="+1 (555) 000-1234"
            value={form.phone}
            onChange={handleChange('phone')}
            disabled={loading}
            className={errors.phone ? inputError : inputNormal}
          />
          {errors.phone && (
            <p className="mt-1.5 text-xs text-rose-400">{errors.phone}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-500 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/40 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Registering…
              </>
            ) : (
              'Register Customer'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
