import React, { useState } from 'react';
import { X, Database, CheckCircle2, AlertTriangle, Key, Link as LinkIcon, RefreshCw, Copy, Check } from 'lucide-react';
import { getSupabaseCredentials, saveSupabaseCredentials, getSupabaseClient, seedProductsToSupabase } from '../../lib/supabase';

interface SupabaseSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshData: () => void;
}

export const SupabaseSettingsModal: React.FC<SupabaseSettingsModalProps> = ({
  isOpen,
  onClose,
  onRefreshData,
}) => {
  const currentCreds = getSupabaseCredentials();
  const [url, setUrl] = useState(currentCreds.url);
  const [anonKey, setAnonKey] = useState(currentCreds.anonKey);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  if (!isOpen) return null;

  const sqlSchema = `-- Run this in your Supabase SQL Editor if creating fresh:
CREATE TABLE IF NOT EXISTS products (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC NOT NULL,
  old_price NUMERIC,
  tag TEXT,
  image_url TEXT,
  image_urls TEXT[],
  description TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS and public read/write for demo or customize as needed:
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public insert products" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update products" ON products FOR UPDATE USING (true);
CREATE POLICY "Public delete products" ON products FOR DELETE USING (true);`;

  const handleSave = async () => {
    saveSupabaseCredentials(url, anonKey);
    setIsTesting(true);
    setTestResult(null);

    const client = getSupabaseClient();
    if (!client) {
      setTestResult({
        success: false,
        message: 'Please provide both Supabase URL and Anon Key.',
      });
      setIsTesting(false);
      return;
    }

    try {
      const { data, error } = await client.from('products').select('id').limit(1);
      if (error) {
        setTestResult({
          success: false,
          message: `Connected to Supabase, but query failed on 'products' table: ${error.message}. Check schema and RLS policies below.`,
        });
      } else {
        setTestResult({
          success: true,
          message: 'Connection successful! Supabase products table is reachable.',
        });
        onRefreshData();
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: `Connection error: ${err?.message || 'Failed to reach Supabase'}`,
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSeed = async () => {
    setIsSeeding(true);
    const res = await seedProductsToSupabase();
    if (res.error) {
      alert(`Seeding error: ${res.error}`);
    } else {
      alert(`Successfully seeded ${res.count} Khawaja Hasan Collection products into your Supabase database!`);
      onRefreshData();
    }
    setIsSeeding(false);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlSchema);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#111014] border border-[#3d331e] rounded-xl overflow-hidden shadow-2xl p-6 sm:p-8 text-neutral-200 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-[#d4af37] text-white hover:text-black flex items-center justify-center transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <Database className="w-5 h-5 text-[#d4af37]" />
          <h2 className="font-serif text-xl sm:text-2xl text-white">
            Supabase Database Configuration
          </h2>
        </div>
        <p className="text-xs text-neutral-400 mb-6">
          Connect your live Supabase project. Products added, updated, or deleted here will sync directly with the `products` table in your database.
        </p>

        {testResult && (
          <div
            className={`p-3.5 rounded-lg mb-6 border text-xs flex items-start gap-2.5 ${
              testResult.success
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                : 'bg-amber-950/60 border-amber-500/50 text-amber-200'
            }`}
          >
            {testResult.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            )}
            <div>{testResult.message}</div>
          </div>
        )}

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-1.5 flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-[#d4af37]" />
              Supabase Project URL (VITE_SUPABASE_URL)
            </label>
            <input
              type="text"
              placeholder="https://xyzcompany.supabase.co"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-[#18161e] border border-[#2e2617] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-300 font-medium mb-1.5 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-[#d4af37]" />
              Supabase Public Anon Key (VITE_SUPABASE_ANON_KEY)
            </label>
            <input
              type="password"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
              value={anonKey}
              onChange={(e) => setAnonKey(e.target.value)}
              className="w-full bg-[#18161e] border border-[#2e2617] rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4af37]"
            />
            <p className="text-[11px] text-neutral-500 mt-1">
              Never use the service_role secret key in browser code; only provide the public anon key.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <button
            onClick={handleSave}
            disabled={isTesting}
            className="px-6 py-2.5 bg-gradient-to-r from-[#d4af37] to-[#aa771c] hover:brightness-110 text-black font-semibold text-xs uppercase tracking-wider rounded transition cursor-pointer disabled:opacity-50 flex items-center gap-2"
          >
            {isTesting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
            <span>Save & Test Connection</span>
          </button>

          {url && anonKey && (
            <button
              onClick={handleSeed}
              disabled={isSeeding}
              className="px-4 py-2.5 bg-[#201c13] hover:bg-[#2d2618] text-[#f7dfa5] border border-[#d4af37]/40 text-xs uppercase tracking-wider rounded transition cursor-pointer disabled:opacity-50"
            >
              {isSeeding ? 'Seeding...' : 'Seed Sample Products to Supabase'}
            </button>
          )}
        </div>

        {/* SQL Reference schema helper */}
        <div className="border-t border-[#231e13] pt-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
              Expected Table Schema Reference
            </span>
            <button
              onClick={handleCopySql}
              className="flex items-center gap-1 text-[11px] text-[#c5a059] hover:text-white transition cursor-pointer"
            >
              {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSql ? 'Copied' : 'Copy SQL'}</span>
            </button>
          </div>
          <pre className="bg-[#0b0a0d] border border-[#211b11] p-3 rounded text-[11px] font-mono text-neutral-400 overflow-x-auto max-h-40 leading-relaxed">
            {sqlSchema}
          </pre>
        </div>
      </div>
    </div>
  );
};
