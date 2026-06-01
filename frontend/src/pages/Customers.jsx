import { useEffect, useState } from "react";
import { getCustomers, createCustomer, deleteCustomer } from "../services/customerService";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getCustomers();
      setCustomers(res.data || []);
    } catch (err) {
      console.error("Error loading customers:", err);
      setError("Failed to load customers. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Client-side validation
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      setError("All fields (Name, Email, Phone) are required.");
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      await createCustomer({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
      });
      setSuccess("Customer profile created successfully!");
      setForm({ name: "", email: "", phone: "" });
      setIsFormOpen(false);
      loadCustomers();
    } catch (err) {
      console.error("Error creating customer:", err);
      const message = err.response?.data?.detail || "Failed to create customer. Email may already be in use.";
      setError(message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;
    setError(null);
    setSuccess(null);
    try {
      await deleteCustomer(id);
      setSuccess("Customer deleted successfully.");
      loadCustomers();
    } catch (err) {
      console.error("Error deleting customer:", err);
      setError("Failed to delete customer. They may have active orders linked to their profile.");
    }
  };

  // Metrics
  const totalCustomers = customers.length;

  // Filtered Customers
  const filteredCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      {/* Header and Add Button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white m-0">Customers Registry</h1>
          <p className="text-sm text-slate-400 mt-1">Manage customer accounts, contact details, and database files.</p>
        </div>
        <button
          onClick={() => {
            setIsFormOpen(!isFormOpen);
            setError(null);
            setSuccess(null);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500 transition-all duration-150 active:scale-95"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          {isFormOpen ? "Close Panel" : "Register Customer"}
        </button>
      </div>

      {/* Metrics Section */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 shadow-sm backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-indigo-500/10 p-3 text-indigo-400">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Registrations</p>
              <h4 className="text-2xl font-bold text-white mt-1">{totalCustomers}</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="rounded-lg border border-rose-800 bg-rose-950/30 p-4 text-sm text-rose-200 flex justify-between items-center animate-shake">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-rose-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-rose-400 hover:text-rose-200">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-emerald-800 bg-emerald-950/30 p-4 text-sm text-emerald-200 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{success}</span>
          </div>
          <button onClick={() => setSuccess(null)} className="text-emerald-400 hover:text-emerald-200">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      )}

      {/* Layout Content */}
      <div className="flex flex-col gap-6 lg:flex-row items-start">
        {/* Form sliding drawer card */}
        {isFormOpen && (
          <div className="w-full lg:w-96 rounded-xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md shadow-xl animate-slide-down">
            <h3 className="text-lg font-bold text-white mb-4">New Customer Form</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-sm text-white placeholder-slate-500 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Email Address</label>
                <input
                  type="text"
                  placeholder="john.doe@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-sm text-white placeholder-slate-500 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Phone Number</label>
                <input
                  type="text"
                  placeholder="+1 (555) 019-2834"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-sm text-white placeholder-slate-500 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-500 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              >
                Register
              </button>
            </form>
          </div>
        )}

        {/* Customer list table */}
        <div className="flex-1 w-full rounded-xl border border-slate-800 bg-slate-900/30 shadow-md overflow-hidden backdrop-blur-sm">
          {/* Table Search */}
          <div className="border-b border-slate-800 bg-slate-900/50 px-6 py-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <span className="text-sm font-semibold text-slate-300">Registered Accounts</span>
            <div className="relative max-w-xs w-full">
              <svg className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-9 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center text-slate-400">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent mb-3"></div>
              <p>Fetching records...</p>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="py-20 text-center text-slate-400">
              <svg className="mx-auto h-12 w-12 text-slate-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <p className="text-base font-semibold text-slate-300">No customers found</p>
              <p className="text-xs text-slate-500 mt-1">Try registering a customer or adjusting your search.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm text-slate-300">
                <thead className="bg-slate-900/60 text-xs font-semibold text-slate-400 uppercase border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-3.5">Customer Name</th>
                    <th className="px-6 py-3.5">Email Address</th>
                    <th className="px-6 py-3.5">Phone Number</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-950/20">
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-slate-900/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white">{customer.name}</div>
                        <div className="text-xs text-slate-500 font-mono mt-0.5">{customer.id}</div>
                      </td>
                      <td className="px-6 py-4 text-indigo-300 font-mono text-xs">
                        {customer.email}
                      </td>
                      <td className="px-6 py-4 text-slate-400 font-mono text-xs">
                        {customer.phone}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(customer.id)}
                          className="inline-flex items-center gap-1 text-rose-400 hover:text-rose-300 font-medium transition-colors hover:underline text-xs bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/10 px-2.5 py-1 rounded"
                        >
                          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}