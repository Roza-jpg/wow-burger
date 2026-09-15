import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, CheckCircle2, User, Phone, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function CartDrawer() {
  const { cart, removeFromCart, updateQuantity, clearCart, isCartOpen, setIsCartOpen } = useAuth();
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [loading, setLoading] = useState(false);

  // Customer info
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [note, setNote] = useState('');

  if (!isCartOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.15);
  const total = subtotal + tax;

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branchId: 1,
          customerName: customerName.trim() || 'Walk-in Customer',
          customerPhone: customerPhone.trim(),
          tableNumber: tableNumber.trim(),
          note: note.trim(),
          items: cart.map(item => ({
            foodId: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            lineTotal: item.price * item.quantity
          })),
          subtotal,
          tax,
          total
        }),
      });

      if (res.ok) {
        const order = await res.json();
        setOrderNumber(order.orderNumber);
        setOrderSuccess(true);
        clearCart();
        // Reset form
        setCustomerName('');
        setCustomerPhone('');
        setTableNumber('');
        setNote('');
        setTimeout(() => {
          setOrderSuccess(false);
          setIsCartOpen(false);
        }, 4000);
      }
    } catch (err) {
      console.error('Order placement failed', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-stone-950 text-stone-100 shadow-2xl border-l border-stone-800 flex flex-col justify-between">

          {/* Header */}
          <div className="p-5 border-b border-stone-800 flex items-center justify-between bg-stone-900/60">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-extrabold tracking-tight">Your Order Cart</h2>
              <span className="bg-amber-500/20 text-amber-400 text-xs font-bold px-2 py-0.5 rounded-full">
                {cart.reduce((a, b) => a + b.quantity, 0)} items
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-stone-400 hover:text-white rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {orderSuccess ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <CheckCircle2 className="w-20 h-20 text-emerald-500" />
                <h3 className="text-2xl font-black text-white">Order Placed!</h3>
                <div className="bg-emerald-900/40 border border-emerald-700 rounded-2xl p-4 w-full">
                  <p className="text-emerald-400 font-extrabold text-lg">{orderNumber}</p>
                  <p className="text-xs text-stone-400 mt-1">Your order number</p>
                </div>
                <p className="text-sm text-stone-400">
                  Your order has been sent to the kitchen. The staff will prepare it shortly!
                </p>
              </div>
            ) : cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-500">
                <ShoppingBag className="w-16 h-16 stroke-1 mb-3 text-stone-700" />
                <p className="text-base font-bold text-stone-300">Your cart is empty</p>
                <p className="text-xs text-stone-500 mt-1">Add some delicious items to get started!</p>
              </div>
            ) : (
              <>
                {/* Cart Items */}
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="bg-stone-900/80 p-3.5 rounded-xl border border-stone-800 flex items-center justify-between gap-3"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 object-cover rounded-lg bg-stone-950 flex-shrink-0"
                      onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=100&q=60'; }}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                      <span className="text-xs font-extrabold text-amber-500 mt-0.5 block">
                        {(item.price * item.quantity).toFixed(2)} ETB
                      </span>
                    </div>
                    <div className="flex items-center gap-2 bg-stone-950 px-2 py-1 rounded-lg border border-stone-800">
                      <button onClick={() => updateQuantity(item.id, -1)} className="p-1 text-stone-400 hover:text-white">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-white w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="p-1 text-stone-400 hover:text-white">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="p-1.5 text-stone-500 hover:text-red-400 transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {/* Customer Info Form */}
                <div className="border-t border-stone-800 pt-4 space-y-3">
                  <p className="text-xs font-extrabold text-stone-400 uppercase tracking-wider">Your Details (Optional)</p>

                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-500" />
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-500" />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <input
                    type="text"
                    placeholder="Table Number (e.g. Table 5)"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
                  />

                  <div className="relative">
                    <FileText className="absolute left-3 top-3 w-3.5 h-3.5 text-stone-500" />
                    <textarea
                      rows="2"
                      placeholder="Special notes (e.g. No onions, extra sauce...)"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer Summary & Place Order */}
          {cart.length > 0 && !orderSuccess && (
            <div className="p-5 border-t border-stone-800 bg-stone-900/80 space-y-3">
              <div className="flex justify-between text-xs text-stone-400">
                <span>Subtotal</span>
                <span className="font-semibold text-stone-200">{subtotal.toFixed(2)} ETB</span>
              </div>
              <div className="flex justify-between text-xs text-stone-400">
                <span>VAT (15%)</span>
                <span className="font-semibold text-stone-200">{tax.toFixed(2)} ETB</span>
              </div>
              <div className="flex justify-between text-base font-black text-white pt-2 border-t border-stone-800">
                <span>Total Amount</span>
                <span className="text-amber-500">{total.toFixed(2)} ETB</span>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full mt-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition active:scale-[0.98] disabled:opacity-50"
              >
                <span>{loading ? 'Placing Order...' : 'Place Order Now'}</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
