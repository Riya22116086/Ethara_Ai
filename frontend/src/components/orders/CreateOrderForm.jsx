import React, { useState } from 'react';
import Modal from '../ui/Modal';

const STEPS = [
  { number: 1, label: 'Customer' },
  { number: 2, label: 'Items' },
  { number: 3, label: 'Review' },
];

function StepIndicator({ step }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-6">
      {STEPS.map((s, idx) => {
        const isCompleted = step > s.number;
        const isActive = step === s.number;
        return (
          <React.Fragment key={s.number}>
            <div className="flex flex-col items-center">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-200
                  ${isCompleted
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : isActive
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
              >
                {isCompleted ? (
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  s.number
                )}
              </div>
              <span
                className={`mt-1.5 text-[10px] font-semibold uppercase tracking-wider
                  ${isActive ? 'text-indigo-400' : isCompleted ? 'text-emerald-400' : 'text-slate-500'}`}
              >
                {s.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className={`h-0.5 w-12 mx-1 mb-5 rounded transition-colors duration-200
                  ${step > s.number ? 'bg-emerald-600' : 'bg-slate-700'}`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default function CreateOrderForm({
  isOpen,
  onClose,
  onSubmit,
  customers = [],
  products = [],
  loading = false,
}) {
  const [step, setStep] = useState(1);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [draftItems, setDraftItems] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [errors, setErrors] = useState({});

  const resetForm = () => {
    setStep(1);
    setSelectedCustomerId('');
    setDraftItems([]);
    setSelectedProductId('');
    setSelectedQuantity(1);
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId);
  const selectedProduct = products.find((p) => p.id === selectedProductId);

  const draftTotal = draftItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // --- Step 1 ---
  const handleNextFromStep1 = () => {
    if (!selectedCustomerId) {
      setErrors({ customer: 'Please select a customer to continue.' });
      return;
    }
    setErrors({});
    setStep(2);
  };

  // --- Step 2 ---
  const handleAddItem = () => {
    const newErrors = {};
    if (!selectedProductId) {
      newErrors.product = 'Please select a product.';
    }
    const qty = parseInt(selectedQuantity, 10);
    if (isNaN(qty) || qty <= 0) {
      newErrors.quantity = 'Quantity must be a positive number.';
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const prod = products.find((p) => p.id === selectedProductId);
    if (!prod) return;

    const existingIndex = draftItems.findIndex((i) => i.product_id === selectedProductId);
    const currentDraftQty = existingIndex >= 0 ? draftItems[existingIndex].quantity : 0;
    const totalRequestQty = currentDraftQty + qty;

    if (prod.stock < totalRequestQty) {
      setErrors({
        product: `Insufficient stock for "${prod.name}". Available: ${prod.stock}, Requested: ${totalRequestQty}.`,
      });
      return;
    }

    if (existingIndex >= 0) {
      const updated = [...draftItems];
      updated[existingIndex] = { ...updated[existingIndex], quantity: totalRequestQty };
      setDraftItems(updated);
    } else {
      setDraftItems([
        ...draftItems,
        {
          product_id: prod.id,
          name: prod.name,
          sku: prod.sku,
          price: prod.price,
          quantity: qty,
        },
      ]);
    }

    setSelectedProductId('');
    setSelectedQuantity(1);
    setErrors({});
  };

  const handleRemoveItem = (index) => {
    const updated = [...draftItems];
    updated.splice(index, 1);
    setDraftItems(updated);
  };

  const handleNextFromStep2 = () => {
    if (draftItems.length === 0) {
      setErrors({ items: 'Add at least one item before continuing.' });
      return;
    }
    setErrors({});
    setStep(3);
  };

  // --- Step 3 ---
  const handleConfirm = () => {
    onSubmit({
      customer_id: selectedCustomerId,
      items: draftItems.map((i) => ({ product_id: i.product_id, quantity: i.quantity })),
    });
    resetForm();
  };

  const inputCls =
    'w-full rounded-lg border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-sm text-white placeholder-slate-500 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20';
  const selectCls =
    'w-full rounded-lg border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20';

  const stepTitle = step === 1 ? 'Select Customer' : step === 2 ? 'Add Order Items' : 'Review & Confirm';

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={`Create Order — ${stepTitle}`}>
      <StepIndicator step={step} />

      {/* ── Step 1: Select Customer ── */}
      {step === 1 && (
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">
              Customer
            </label>
            <select
              value={selectedCustomerId}
              onChange={(e) => {
                setSelectedCustomerId(e.target.value);
                setErrors({});
              }}
              className={selectCls}
            >
              <option value="">— Choose a customer —</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.email})
                </option>
              ))}
            </select>
            {errors.customer && (
              <p className="mt-1.5 text-xs text-rose-400">{errors.customer}</p>
            )}
          </div>

          {selectedCustomer && (
            <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 px-4 py-3 text-sm">
              <p className="font-semibold text-indigo-300">{selectedCustomer.name}</p>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">{selectedCustomer.email}</p>
              {selectedCustomer.phone && (
                <p className="text-xs text-slate-500 mt-0.5">{selectedCustomer.phone}</p>
              )}
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              onClick={handleNextFromStep1}
              disabled={!selectedCustomerId}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* ── Step 2: Add Items ── */}
      {step === 2 && (
        <div className="space-y-5">
          {/* Product + Qty row */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">
              Add Item to Order
            </label>
            <div className="flex gap-2 items-start">
              <div className="flex-1">
                <select
                  value={selectedProductId}
                  onChange={(e) => {
                    setSelectedProductId(e.target.value);
                    setErrors({});
                  }}
                  className={selectCls}
                >
                  <option value="">— Choose product —</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — SKU: {p.sku}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-24">
                <input
                  type="number"
                  min="1"
                  value={selectedQuantity}
                  onChange={(e) => {
                    setSelectedQuantity(e.target.value);
                    setErrors({});
                  }}
                  placeholder="Qty"
                  className={inputCls}
                />
              </div>
              <button
                type="button"
                onClick={handleAddItem}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500 transition-colors whitespace-nowrap"
              >
                Add Item
              </button>
            </div>

            {/* Stock/price preview */}
            {selectedProduct && (
              <div className="mt-2 flex items-center justify-between px-1 text-xs text-slate-400">
                <span>
                  Price:{' '}
                  <span className="font-semibold text-emerald-400">
                    ₹{Number(selectedProduct.price).toFixed(2)}
                  </span>
                </span>
                <span>
                  Stock:{' '}
                  <span
                    className={`font-semibold ${
                      selectedProduct.stock > 0 ? 'text-indigo-400' : 'text-rose-400'
                    }`}
                  >
                    {selectedProduct.stock} units
                  </span>
                </span>
              </div>
            )}

            {(errors.product || errors.quantity) && (
              <p className="mt-1.5 text-xs text-rose-400">
                {errors.product || errors.quantity}
              </p>
            )}
          </div>

          {/* Draft Items List */}
          {draftItems.length > 0 ? (
            <div className="rounded-lg border border-slate-800 bg-slate-950/30 overflow-hidden">
              <div className="divide-y divide-slate-800">
                {draftItems.map((item, index) => (
                  <div
                    key={item.product_id}
                    className="flex items-center justify-between p-3 hover:bg-slate-900/20 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-white truncate">{item.name}</p>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                        {item.sku} &times; {item.quantity} @ ₹{Number(item.price).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 ml-3">
                      <span className="font-semibold font-mono text-sm text-emerald-400">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => handleRemoveItem(index)}
                        className="text-rose-400 hover:text-rose-300 transition-colors"
                        title="Remove item"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-slate-900/50 border-t border-slate-800 px-4 py-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-300">Subtotal</span>
                <span className="font-bold font-mono text-emerald-400">
                  ₹{draftTotal.toFixed(2)}
                </span>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-slate-700 py-8 text-center text-slate-500 text-sm">
              No items added yet.
            </div>
          )}

          {errors.items && (
            <p className="text-xs text-rose-400">{errors.items}</p>
          )}

          <div className="flex justify-between pt-2">
            <button
              onClick={() => { setStep(1); setErrors({}); }}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-700 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <button
              onClick={handleNextFromStep2}
              disabled={draftItems.length === 0}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* ── Step 3: Review & Confirm ── */}
      {step === 3 && (
        <div className="space-y-5">
          {/* Customer summary */}
          <div className="rounded-lg border border-slate-800 bg-slate-950/30 p-4">
            <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Customer</p>
            <p className="font-semibold text-white">{selectedCustomer?.name}</p>
            <p className="text-xs font-mono text-slate-400 mt-0.5">{selectedCustomer?.email}</p>
          </div>

          {/* Items table */}
          <div className="rounded-lg border border-slate-800 bg-slate-950/30 overflow-hidden">
            <div className="px-4 py-2.5 border-b border-slate-800 bg-slate-900/40">
              <p className="text-xs font-semibold text-slate-400 uppercase">Order Items</p>
            </div>
            <div className="divide-y divide-slate-800">
              {draftItems.map((item) => (
                <div key={item.product_id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-white">{item.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                      {item.sku} &times; {item.quantity} &nbsp;@&nbsp; ₹{Number(item.price).toFixed(2)}
                    </p>
                  </div>
                  <span className="font-mono font-semibold text-sm text-slate-300">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-700 bg-slate-900/60 px-4 py-4 flex items-center justify-between">
              <span className="text-base font-bold text-white">Grand Total</span>
              <span className="text-xl font-extrabold font-mono text-emerald-400">
                ₹{draftTotal.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex justify-between pt-2">
            <button
              onClick={() => { setStep(2); setErrors({}); }}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-700 transition-colors"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow shadow-emerald-600/20 hover:bg-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Placing…
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Confirm &amp; Place Order
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
