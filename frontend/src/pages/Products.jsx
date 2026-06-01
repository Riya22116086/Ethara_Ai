import { useEffect, useState } from "react";
import { getProducts, createProduct, deleteProduct } from "../services/productService";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [form, setForm] = useState({ name: "", sku: "", price: "", stock: "" });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getProducts();
      setProducts(res.data || []);
    } catch (err) {
      console.error("Error loading products:", err);
      setError("Failed to load products. Check your backend connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Basic Validation
    if (!form.name || !form.sku || !form.price || form.stock === "") {
      setError("All fields are required.");
      return;
    }

    if (isNaN(Number(form.price)) || Number(form.price) <= 0) {
      setError("Price must be a valid positive number.");
      return;
    }

    if (isNaN(Number(form.stock)) || Number(form.stock) < 0) {
      setError("Stock must be a valid non-negative integer.");
      return;
    }

    try {
      await createProduct({
        name: form.name.trim(),
        sku: form.sku.trim().toUpperCase(),
        price: Number(form.price),
        stock: parseInt(form.stock, 10),
      });
      setSuccess("Product created successfully!");
      setForm({ name: "", sku: "", price: "", stock: "" });
      setIsFormOpen(false);
      loadProducts();
    } catch (err) {
      console.error("Error creating product:", err);
      const message = err.response?.data?.detail || "Failed to create product. SKU might already exist.";
      setError(message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    setError(null);
    setSuccess(null);
    try {
      await deleteProduct(id);
      setSuccess("Product deleted successfully.");
      loadProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
      setError("Failed to delete product. It might be linked to existing orders.");
    }
  };

  // Metrics
  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);
  const outOfStockCount = products.filter((p) => (p.stock || 0) === 0).length;

  // Filtered Products
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header and Add Button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white m-0">Products Inventory</h1>
          <p className="text-sm text-slate-400 mt-1">Manage and track your products, stock levels, and pricing.</p>
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          {isFormOpen ? "Close Panel" : "Add New Product"}
        </button>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 shadow-sm backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-indigo-500/10 p-3 text-indigo-400">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Products</p>
              <h4 className="text-2xl font-bold text-white mt-1">{totalProducts}</h4>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 shadow-sm backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-emerald-500/10 p-3 text-emerald-400">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Stock Items</p>
              <h4 className="text-2xl font-bold text-white mt-1">{totalStock}</h4>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 shadow-sm backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-rose-500/10 p-3 text-rose-400">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Out of Stock</p>
              <h4 className="text-2xl font-bold text-white mt-1">{outOfStockCount}</h4>
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

      {/* Main Content Area: List and Form */}
      <div className="flex flex-col gap-6 lg:flex-row items-start">
        {/* Form Slide-Down Panel */}
        {isFormOpen && (
          <div className="w-full lg:w-96 rounded-xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md shadow-xl animate-slide-down">
            <h3 className="text-lg font-bold text-white mb-4">Add Product</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Product Name</label>
                <input
                  type="text"
                  placeholder="e.g. Mechanical Keyboard"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-sm text-white placeholder-slate-500 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Unique SKU</label>
                <input
                  type="text"
                  placeholder="e.g. TECH-KEY-001"
                  value={form.sku}
                  onChange={(e) => setForm({ ...form, sku: e.target.value })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-sm text-white placeholder-slate-500 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="99.99"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-sm text-white placeholder-slate-500 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">Initial Stock</label>
                  <input
                    type="number"
                    placeholder="50"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-sm text-white placeholder-slate-500 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-500 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              >
                Save Product
              </button>
            </form>
          </div>
        )}

        {/* Products Table Area */}
        <div className="flex-1 w-full rounded-xl border border-slate-800 bg-slate-900/30 shadow-md overflow-hidden backdrop-blur-sm">
          {/* Table Search */}
          <div className="border-b border-slate-800 bg-slate-900/50 px-6 py-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <span className="text-sm font-semibold text-slate-300">Items List</span>
            <div className="relative max-w-xs w-full">
              <svg className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search products/SKUs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-9 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center text-slate-400">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent mb-3"></div>
              <p>Fetching inventory...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-20 text-center text-slate-400">
              <svg className="mx-auto h-12 w-12 text-slate-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <p className="text-base font-semibold text-slate-300">No products found</p>
              <p className="text-xs text-slate-500 mt-1">Try creating a product or adjusting your search filter.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm text-slate-300">
                <thead className="bg-slate-900/60 text-xs font-semibold text-slate-400 uppercase border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-3.5">Product Details</th>
                    <th className="px-6 py-3.5">SKU</th>
                    <th className="px-6 py-3.5">Unit Price</th>
                    <th className="px-6 py-3.5 text-center">Stock Level</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-950/20">
                  {filteredProducts.map((product) => {
                    const isOutOfStock = (product.stock || 0) === 0;
                    const isLowStock = (product.stock || 0) > 0 && (product.stock || 0) <= 10;

                    return (
                      <tr key={product.id} className="hover:bg-slate-900/20 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-white">{product.name}</div>
                          <div className="text-xs text-slate-500 font-mono mt-0.5">{product.id}</div>
                        </td>
                        <td className="px-6 py-4 font-mono text-xs font-semibold text-indigo-400">
                          {product.sku}
                        </td>
                        <td className="px-6 py-4 text-emerald-400 font-semibold font-mono">
                          ${Number(product.price).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {isOutOfStock ? (
                            <span className="inline-flex items-center rounded-full bg-rose-500/10 px-2.5 py-1 text-xs font-medium text-rose-400 border border-rose-500/20">
                              Out of Stock
                            </span>
                          ) : isLowStock ? (
                            <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-400 border border-amber-500/20">
                              Low Stock ({product.stock})
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400 border border-emerald-500/20">
                              {product.stock} Units
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="inline-flex items-center gap-1 text-rose-400 hover:text-rose-300 font-medium transition-colors hover:underline text-xs bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/10 px-2.5 py-1 rounded"
                          >
                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}