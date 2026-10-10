import React from 'react';
import { Sparkles, Crown, Scissors, Gem } from 'lucide-react';

export const BrandStory: React.FC = () => {
  return (
    <section className="py-20 bg-[#0a0a0d] border-t border-b border-[#211c12] relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#d4af37]/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#d4af37]/30 bg-[#16130d] text-[#d4af37] text-[11px] uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Khawaja Hasan Legacy</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif text-white tracking-wide leading-tight mb-4">
            Mastery of the Needle, Regal Grace
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed font-light">
            Founded on the pillars of subcontinent imperial heritage, every Khawaja Hasan creation is an ode to meticulous hand craftsmanship—weaving ancient zardozi, tilla work, and structured modern tailoring for discerning gentlemen worldwide.
          </p>
        </div>

        {/* 4 Pillars of Craftsmanship */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-[#121016] border border-[#262016] hover:border-[#d4af37]/50 rounded-xl transition group">
            <div className="w-12 h-12 rounded-lg bg-[#1c1810] border border-[#3e341f] flex items-center justify-center text-[#d4af37] mb-4 group-hover:scale-110 transition">
              <Crown className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-base text-white font-medium mb-2 group-hover:text-[#f7dfa5] transition">
              Imperial Silhouettes
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              Structured cuts inspired by royal courtiers, balanced with contemporary comfort and razor-sharp drape.
            </p>
          </div>

          <div className="p-6 bg-[#121016] border border-[#262016] hover:border-[#d4af37]/50 rounded-xl transition group">
            <div className="w-12 h-12 rounded-lg bg-[#1c1810] border border-[#3e341f] flex items-center justify-center text-[#d4af37] mb-4 group-hover:scale-110 transition">
              <Scissors className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-base text-white font-medium mb-2 group-hover:text-[#f7dfa5] transition">
              Bespoke Tailoring
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              Each garment can be custom-fitted to exact measurements by our master tailors with multi-point fitting trials.
            </p>
          </div>

          <div className="p-6 bg-[#121016] border border-[#262016] hover:border-[#d4af37]/50 rounded-xl transition group">
            <div className="w-12 h-12 rounded-lg bg-[#1c1810] border border-[#3e341f] flex items-center justify-center text-[#d4af37] mb-4 group-hover:scale-110 transition">
              <Gem className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-base text-white font-medium mb-2 group-hover:text-[#f7dfa5] transition">
              Authentic Raw Silks & Velvets
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              Directly sourced pure Banarasi jamawar, Italian micro-velvet, and pure raw silk chosen for heirloom durability.
            </p>
          </div>

          <div className="p-6 bg-[#121016] border border-[#262016] hover:border-[#d4af37]/50 rounded-xl transition group">
            <div className="w-12 h-12 rounded-lg bg-[#1c1810] border border-[#3e341f] flex items-center justify-center text-[#d4af37] mb-4 group-hover:scale-110 transition">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-base text-white font-medium mb-2 group-hover:text-[#f7dfa5] transition">
              Intricate Hand Embellishment
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              Hundreds of artisan hours dedicated to antique dabka, kora, nakshi, and resham hand embroidery.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
