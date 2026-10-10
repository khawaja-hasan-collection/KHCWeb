import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Truck, CreditCard, Sparkles } from 'lucide-react';
import { CartItem, CurrencyCode } from '../types';
import { formatCurrency } from '../lib/constants';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: CurrencyCode;
  onOrderComplete: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  onOrderComplete,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: 'India',
    notes: '',
    paymentMethod: 'cod' as 'cod' | 'bank_transfer' | 'card',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState<string | null>(null);

  if (!isOpen) return null;

  const totalAmount = items.reduce((acc, i) => acc + i.product.price * i.quantity, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      alert('Please fill in all required shipping fields.');
      return;
    }

    setIsSubmitting(true);
    // Simulate swift order creation
    setTimeout(() => {
      const orderNumber = `KH-${Math.floor(100000 + Math.random() * 900000)}`;
      setIsSubmitting(false);
      setOrderConfirmed(orderNumber);
    }, 1200);
  };

  const handleFinish = () => {
    setOrderConfirmed(null);
    onOrderComplete();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#111014] border border-[#38301e] rounded-xl overflow-hidden shadow-2xl p-6 sm:p-8 text-neutral-200 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-[#d4af37] text-white hover:text-black flex items-center justify-center transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {orderConfirmed ? (
          <div className="text-center py-8 space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
                Order Received
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-white mt-1">
                Thank You, {formData.name}
              </h2>
              <p className="text-sm text-neutral-300 mt-2">
                Your bespoke order <span className="text-[#f7dfa5] font-mono font-bold">#{orderConfirmed}</span> has been confirmed.
              </p>
            </div>

            <div className="bg-[#17151b] border border-[#2d2618] rounded-lg p-4 max-w-md mx-auto text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-neutral-400">Total Charged:</span>
                <span className="text-[#f7dfa5] font-bold">{formatCurrency(totalAmount, currency)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Delivery To:</span>
                <span className="text-white">{formData.city}, {formData.country}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Payment Option:</span>
                <span className="text-white uppercase">{formData.paymentMethod === 'cod' ? 'Cash on Delivery' : formData.paymentMethod}</span>
              </div>
            </div>

            <p className="text-xs text-neutral-400 max-w-md mx-auto">
              A master atelier representative will reach out at <span className="text-white">{formData.phone}</span> to confirm precise tailoring measurements and dispatch timeline.
            </p>

            <button
              onClick={handleFinish}
              className="px-8 py-3 bg-gradient-to-r from-[#d4af37] to-[#aa771c] text-black font-semibold text-xs uppercase tracking-widest rounded hover:brightness-110 shadow-lg cursor-pointer"
            >
              Continue Exploring Collection
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
                Khawaja Hasan Collection • Checkout
              </span>
              <h2 className="text-2xl font-serif text-white tracking-wide mt-1">
                Delivery & Tailoring Dispatch
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Hasan Khawaja"
                    className="w-full bg-[#18161d] border border-[#2b2518] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="hasan@khawajacollection.com"
                    className="w-full bg-[#18161d] border border-[#2b2518] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full bg-[#18161d] border border-[#2b2518] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Mumbai, Delhi, Lucknow"
                    className="w-full bg-[#18161d] border border-[#2b2518] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">
                  Complete Delivery Address *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="House / Street / Area / Landmark"
                  className="w-full bg-[#18161d] border border-[#2b2518] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              {/* Payment Option */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-2">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                    className={`p-3 rounded border text-left transition cursor-pointer flex flex-col justify-between ${
                      formData.paymentMethod === 'cod'
                        ? 'border-[#d4af37] bg-[#221c12] text-white'
                        : 'border-[#292318] bg-[#16141a] text-neutral-400'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#f7dfa5]">
                      <Truck className="w-4 h-4 text-[#d4af37]" />
                      <span>Cash On Delivery</span>
                    </div>
                    <span className="text-[10px] text-neutral-400 mt-1">Pay upon receiving packet</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'bank_transfer' })}
                    className={`p-3 rounded border text-left transition cursor-pointer flex flex-col justify-between ${
                      formData.paymentMethod === 'bank_transfer'
                        ? 'border-[#d4af37] bg-[#221c12] text-white'
                        : 'border-[#292318] bg-[#16141a] text-neutral-400'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#f7dfa5]">
                      <Sparkles className="w-4 h-4 text-[#d4af37]" />
                      <span>Bank Wire / IBFT</span>
                    </div>
                    <span className="text-[10px] text-neutral-400 mt-1">Direct official atelier account</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'card' })}
                    className={`p-3 rounded border text-left transition cursor-pointer flex flex-col justify-between ${
                      formData.paymentMethod === 'card'
                        ? 'border-[#d4af37] bg-[#221c12] text-white'
                        : 'border-[#292318] bg-[#16141a] text-neutral-400'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#f7dfa5]">
                      <CreditCard className="w-4 h-4 text-[#d4af37]" />
                      <span>Card / Online</span>
                    </div>
                    <span className="text-[10px] text-neutral-400 mt-1">Visa / Mastercard / PayPak</span>
                  </button>
                </div>
              </div>

              {/* Summary box */}
              <div className="bg-[#16141b] border border-[#2b2416] p-4 rounded text-xs space-y-1.5 mt-2">
                <div className="flex justify-between text-neutral-400">
                  <span>Selected Pieces:</span>
                  <span className="text-white font-medium">{items.length} item(s)</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>Domestic & Global Delivery:</span>
                  <span className="text-emerald-400 font-semibold">Complimentary</span>
                </div>
                <div className="flex justify-between text-sm font-serif font-bold text-[#f7dfa5] pt-2 border-t border-[#262015]">
                  <span>Total Payable:</span>
                  <span>{formatCurrency(totalAmount, currency)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-gradient-to-r from-[#d4af37] via-[#f7dfa5] to-[#c5a059] text-black font-bold uppercase tracking-widest text-xs rounded hover:brightness-110 shadow-lg shadow-[#d4af37]/20 transition cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'Confirming Atelier Order...' : `Complete Order • ${formatCurrency(totalAmount, currency)}`}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
