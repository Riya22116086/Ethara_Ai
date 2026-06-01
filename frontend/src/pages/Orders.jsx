import { useEffect, useState } from "react";
import { getOrders, createOrder } from "../services/orderService";
import { getCustomers } from "../services/customerService";
import { getProducts } from "../services/productService";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  // Form builder state
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState("");
  const [draftItems, setDraftItems] = useState([]); // [{ product_id, name, sku, price, quantity }]

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [ordersRes, customersRes, productsRes] = await Promise.all([
        getOrders(),
        getCustomers(),
        getProducts()
      ]);

      setOrders(ordersRes.data || []);
      setCustomers(customersRes.data || []);
      setProducts(productsRes.data || []);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      setError("Failed to load orders or catalog data. Check connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getProductDetails = (id) => products.find((p) => p.id === id);
  const getCustomerName = (id) => {
    const cust = customers.find((c) => c.id === id);
    return cust ? cust.name : `Customer (ID: ...${id.slice(-6)})`;
  };

  const handleAddDraftItem = () => {
    setError(null);
    if (!selectedProductId) {
      setError("Please select a product.");
      return;
    }
    const qty = parseInt(selectedQuantity, 10);
    if (isNaN(qty) || qty <= 0) {
      setError("Quantity must be a positive integer.");
      return;
    }

    const prod = getProductDetails(selectedProductId);
    if (!prod) return;

    // Check duplicate in draft
    const existingIndex = draftItems.findIndex(item => item.product_id === selectedProductId);
    const currentDraftQty = existingIndex >= 0 ? draftItems[existingIndex].quantity : 0;
    const totalRequestQty = currentDraftQty + qty;

    if (prod.stock < totalRequestQty) {
      setError(`Insufficient inventory for ${prod.name}. Available: ${prod.stock}, Requested: ${totalRequestQty}`);
      return;
    }

    if (existingIndex >= 0) {
      const updated = [...draftItems];
      updated[existingIndex].quantity = totalRequestQty;
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

    // Reset items input
    setSelectedProductId("");
    setSelectedQuantity("");
  };

  const handleRemoveDraftItem = (index) => {
    const updated = [...draftItems];
    updated.splice(index, 1);
    setDraftItems(updated);
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!selectedCustomerId) {
      setError("Please select a customer.");
      return;
    }
    if (draftItems.length === 0) {
      setError("Please add at least one item to the order.");
      return;
    }

    try {
      const payload = {
        customer_id: selectedCustomerId,
        items: draftItems.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
        })),
      };

      const res = await createOrder(payload);
      setSuccess(res.data?.message || "Order placed successfully!");
      setDraftItems([]);
      setSelectedCustomerId("");
      setIsBuilderOpen(false);
      loadData(); // Reload orders and updated product stock levels!
    } catch (err) {
      console.error("Error creating order:", err);
      const detail = err.response?.data?.detail || "Failed to create order. Check quantities and stock levels.";
      setError(detail);
    }
  };

  // Draft Order calculation
  const draftTotal = draftItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Total Orders value
  const totalSalesVolume = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);

  // Find currently selected product for live stock preview
  const currentSelectedProd = getProductDetails(selectedProductId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white m-0">Orders Management</h1>
          <p className="text-sm text-slate-400 mt-1">Review transaction history, draft multi-item client orders, and track stock deductions.</p>
        </div>
        <button
          onClick={() => {
            setIsBuilderOpen(!isBuilderOpen);
            setDraftItems([]);
            setError(null);
            setSuccess(null);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500 transition-all duration-150 active:scale-95"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          {isBuilderOpen ? "Close Builder" : "Create New Order"}
        </button>
      </div>

      {/* Metrics Section */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 shadow-sm backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-indigo-500/10 p-3 text-indigo-400">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Orders Placed</p>
              <h4 className="text-2xl font-bold text-white mt-1">{orders.length}</h4>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 shadow-sm backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-emerald-500/10 p-3 text-emerald-400">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Accumulated Sales Volume</p>
              <h4 className="text-2xl font-bold text-white mt-1">${totalSalesVolume.toFixed(2)}</h4>
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

      {/* Main Layout grid */}
      <div className="flex flex-col gap-6 lg:flex-row items-start">
        {/* Order Builder slide-out card */}
        {isBuilderOpen && (
          <div className="w-full lg:w-[480px] rounded-xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md shadow-xl animate-slide-down flex-shrink-0">
            <h3 className="text-lg font-bold text-white mb-4">Interactive Order Builder</h3>

            <div className="space-y-4">
              {/* Step 1: Select Customer */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase">1. Assign Customer</label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-sm text-white placeholder-slate-500 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="">-- Choose Customer --</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.email})
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 2: Add Product Item */}
              <div className="rounded-lg border border-slate-800 bg-slate-950/40 p-4 space-y-3">
                <label className="block text-xs font-semibold text-slate-300 uppercase">2. Add Item to Order</label>
                
                <div>
                  <select
                    value={selectedProductId}
                    onChange={(e) => {
                      setSelectedProductId(e.target.value);
                      setError(null);
                    }}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-sm text-white placeholder-slate-500 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="">-- Choose Product --</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (SKU: {p.sku})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Stock info feedback */}
                {currentSelectedProd && (
                  <div className="text-xs text-slate-400 flex items-center justify-between px-1">
                    <span>Catalog Price: <span className="font-semibold text-emerald-400">${Number(currentSelectedProd.price).toFixed(2)}</span></span>
                    <span>Available Stock: <span className={`font-semibold ${currentSelectedProd.stock > 0 ? "text-indigo-400" : "text-rose-400"}`}>{currentSelectedProd.stock} units</span></span>
                  </div>
                )}

                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Qty"
                    value={selectedQuantity}
                    onChange={(e) => setSelectedQuantity(e.target.value)}
                    className="w-24 rounded-lg border  border-slate-700 bg-slate-800/80 px-3.5 py-2 text-sm text-white placeholder-slate-500 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                  <button
                    type="button"
                    onClick={handleAddDraftItem}
                    className="flex-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-indigo-500 transition-colors"
                  >
                    Add Item
                  </button>
                </div>
              </div>

              {/* Step 3: View Draft Items List */}
              {draftItems.length > 0 && (
                <div className="space-y-2.5">
                  <label className="block text-xs font-semibold text-slate-400 uppercase">3. Order Summary Details</label>
                  <div className="rounded-lg border border-slate-800 bg-slate-950/20 overflow-hidden text-xs">
                    <div className="divide-y divide-slate-800">
                      {draftItems.map((item, index) => (
                        <div key={item.product_id} className="p-3 flex items-center justify-between hover:bg-slate-900/10">
                          <div>
                            <div className="font-semibold text-white">{item.name}</div>
                            <div className="text-[10px] text-slate-500 font-mono mt-0.5">{item.sku} &times; {item.quantity} @ ${Number(item.price).toFixed(2)}</div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-semibold font-mono text-emerald-400">${(item.price * item.quantity).toFixed(2)}</span>
                            <button
                              onClick={() => handleRemoveDraftItem(index)}
                              className="text-rose-400 hover:text-rose-300 font-bold"
                            >
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-slate-900/40 p-3 flex justify-between items-center border-t border-slate-800">
                      <span className="font-semibold text-slate-300">Running Total</span>
                      <span className="font-bold text-sm text-emerald-400 font-mono">${draftTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleSubmitOrder}
                    className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-500 transition-colors"
                  >
                    Confirm & Place Order
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Order History Table */}
        <div className="flex-1 w-full rounded-xl border border-slate-800 bg-slate-900/30 shadow-md overflow-hidden backdrop-blur-sm">
          <div className="border-b border-slate-800 bg-slate-900/50 px-6 py-4">
            <span className="text-sm font-semibold text-slate-300">Transaction History</span>
          </div>

          {loading ? (
            <div className="py-20 text-center text-slate-400">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent mb-3"></div>
              <p>Fetching orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="py-20 text-center text-slate-400">
              <svg className="mx-auto h-12 w-12 text-slate-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
              </svg>
              <p className="text-base font-semibold text-slate-300">No orders logged</p>
              <p className="text-xs text-slate-500 mt-1">Start by adding items in the order builder.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm text-slate-300">
                <thead className="bg-slate-900/60 text-xs font-semibold text-slate-400 uppercase border-b border-slate-800">
                  <tr>
                    <th className="px-6 py-3.5">Order Reference</th>
                    <th className="px-6 py-3.5">Customer Name</th>
                    <th className="px-6 py-3.5 text-center">Items Count</th>
                    <th className="px-6 py-3.5 text-right">Total Invoice</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-950/20">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-900/20 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-indigo-400 font-semibold">
                        {order.id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-white">{getCustomerName(order.customer_id)}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">{order.customer_id}</div>
                      </td>
                      <td className="px-6 py-4 text-center text-slate-300 font-mono text-xs">
                        {/* If items array exists, count them, otherwise display indicator */}
                        {order.items ? order.items.length : "Multi"}
                      </td>
                      <td className="px-6 py-4 text-right text-emerald-400 font-bold font-mono">
                        ${Number(order.total_amount).toFixed(2)}
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