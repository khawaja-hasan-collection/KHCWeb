import React, { useState } from 'react';
import { Mail, Phone, MapPin, Instagram, Facebook, Send, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
  onSelectCategory: (cat: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin, onSelectCategory }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="bg-[#08080a] border-t border-[#231e13] text-neutral-400 text-xs">
      {/* Newsletter Signup */}
      <div className="border-b border-[#1b1710] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-serif text-xl sm:text-2xl text-white tracking-wide">
              Join The Khawaja Hasan Private Circle
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              Receive private invitations to bridal previews, trunk shows, and bespoke collections.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="flex w-full md:w-auto max-w-md gap-2">
            <input
              type="email"
              required
              placeholder="Enter your email address"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="bg-[#131117] border border-[#2e2617] focus:border-[#d4af37] px-4 py-2.5 rounded text-xs text-white focus:outline-none flex-1 md:w-64"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-[#d4af37] to-[#aa771c] hover:brightness-110 text-black font-semibold uppercase tracking-wider text-xs rounded transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>Subscribe</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
          {subscribed && (
            <div className="text-emerald-400 text-xs font-medium">
              Thank you for subscribing to our private salon updates.
            </div>
          )}
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col items-start">
              <span className="text-[10px] tracking-[0.3em] text-[#d4af37] font-serif uppercase font-semibold">
                KH
              </span>
              <h4 className="text-xl font-serif font-bold tracking-[0.2em] text-white">
                KHAWAJA HASAN
              </h4>
              <span className="text-[9px] tracking-[0.4em] text-[#c5a059] uppercase -mt-0.5">
                C O L L E C T I O N
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm font-light">
              High eastern luxury menswear and royal bridal couture. Curating bespoke sherwanis, prince coats, and heirloom weaves for over two decades.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#16131b] border border-[#2d2516] flex items-center justify-center text-neutral-300 hover:text-[#d4af37] hover:border-[#d4af37] transition"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#16131b] border border-[#2d2516] flex items-center justify-center text-neutral-300 hover:text-[#d4af37] hover:border-[#d4af37] transition"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h5 className="font-serif text-white tracking-wider uppercase text-xs font-semibold mb-4 text-[#d4af37]">
              Atelier Collections
            </h5>
            <ul className="space-y-2.5 text-xs">
              {['Sherwanis', 'Prince Coats', 'Embroidered Kurtas', 'Waistcoats', 'Royal Shawls'].map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => onSelectCategory(cat)}
                    className="hover:text-white transition hover:underline underline-offset-4 cursor-pointer"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Client Concierge */}
          <div>
            <h5 className="font-serif text-white tracking-wider uppercase text-xs font-semibold mb-4 text-[#d4af37]">
              Client Concierge
            </h5>
            <ul className="space-y-2.5 text-xs">
              <li>Bespoke Consultation</li>
              <li>Made-to-Measure Guide</li>
              <li>Worldwide Shipping & Duties</li>
              <li>Care & Preservation</li>
              <li>
                <button
                  onClick={onOpenAdmin}
                  className="hover:text-[#f7dfa5] text-[#d4af37] flex items-center gap-1 transition"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Management</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Flagship Ateliers */}
          <div>
            <h5 className="font-serif text-white tracking-wider uppercase text-xs font-semibold mb-4 text-[#d4af37]">
              Flagship Ateliers
            </h5>
            <div className="space-y-3 text-xs font-light">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#d4af37] flex-shrink-0 mt-0.5" />
                <span>India • By appointment</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#d4af37] flex-shrink-0" />
                <span>Contact details to be added</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#d4af37] flex-shrink-0" />
                <span>khawajahasancollection@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-8 border-t border-[#1b1710] flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-500 gap-4">
          <div>
            © {new Date().getFullYear()} Khawaja Hasan Collection. All Rights Reserved. Master Craftsmen & Couturiers.
          </div>
          <div className="flex items-center gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Couture Service</span>
            <button
              onClick={onOpenAdmin}
              className="text-[#d4af37] hover:underline cursor-pointer"
            >
              Atelier Portal
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
