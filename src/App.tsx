import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, 
  ArrowRightLeft, 
  Copy, 
  Check, 
  Moon, 
  Sun, 
  TrendingUp, 
  Info, 
  ChevronDown,
  RefreshCw,
  Calculator
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CURRENCIES, Currency } from './constants/currencies';
import { numberToIndianWords, formatIndianNumber, textToNumber } from './utils/currencyUtils';

const API_BASE_URL = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies';

export default function App() {
  const [amount, setAmount] = useState<string>('1');
  const [textAmount, setTextAmount] = useState<string>('');
  const [fromCurrency, setFromCurrency] = useState<Currency>(CURRENCIES[0]); // USD
  const [toCurrency, setToCurrency] = useState<Currency>(CURRENCIES.find(c => c.code === 'INR') || CURRENCIES[CURRENCIES.length - 1]);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [dropdownType, setDropdownType] = useState<'from' | 'to'>('from');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Toggle theme
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Fetch exchange rate
  const fetchRate = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/${fromCurrency.code.toLowerCase()}.json`);
      const data = await response.json();
      const rate = data[fromCurrency.code.toLowerCase()][toCurrency.code.toLowerCase()];
      setExchangeRate(rate);
    } catch (err) {
      setError('Failed to fetch exchange rates. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRate();
  }, [fromCurrency, toCurrency]);

  // Swap currencies
  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  // Handle numeric input change
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
      setTextAmount('');
    }
  };

  // Handle text input change
  const handleTextAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTextAmount(value);
    const numericValue = textToNumber(value);
    if (numericValue !== null) {
      setAmount(numericValue.toString());
    }
  };

  // Calculated result
  const numericAmount = parseFloat(amount) || 0;
  const result = exchangeRate ? numericAmount * exchangeRate : 0;

  // Copy to clipboard
  const copyToClipboard = () => {
    const formatted = toCurrency.code === 'INR' ? formatIndianNumber(result) : `${toCurrency.code} ${result.toFixed(2)}`;
    const words = toCurrency.code === 'INR' ? ` (${numberToIndianWords(result)})` : '';
    const text = `${formatted}${words}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Filtered currencies for search
  const filteredCurrencies = useMemo(() => {
    return CURRENCIES.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const openDropdown = (type: 'from' | 'to') => {
    setDropdownType(type);
    setShowDropdown(true);
  };

  return (
    <div className="min-h-screen font-sans selection:bg-emerald-500/30">
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Calculator className="text-white w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold tracking-tight">RupeeWise</h1>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">Currency Calculator</p>
            </div>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none"
            >
              <div className="space-y-8">
                {/* Currency Selection */}
                <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] items-end gap-4 relative" ref={dropdownRef}>
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-slate-500 uppercase tracking-wider">From</label>
                    <button 
                      onClick={() => openDropdown('from')}
                      className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={`https://flagcdn.com/w40/${fromCurrency.flag}.png`} 
                          alt={fromCurrency.name}
                          className="w-6 h-4 object-cover rounded shadow-sm"
                          referrerPolicy="no-referrer"
                        />
                        <span className="font-bold text-lg">{fromCurrency.code}</span>
                      </div>
                      <ChevronDown size={16} className="text-slate-400" />
                    </button>
                  </div>

                  <div className="flex justify-center pb-2">
                    <button 
                      onClick={swapCurrencies}
                      className="p-3 rounded-full bg-slate-100 dark:bg-slate-800 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                    >
                      <ArrowRightLeft size={20} className="rotate-90 md:rotate-0" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-slate-500 uppercase tracking-wider">To</label>
                    <button 
                      onClick={() => openDropdown('to')}
                      className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={`https://flagcdn.com/w40/${toCurrency.flag}.png`} 
                          alt={toCurrency.name}
                          className="w-6 h-4 object-cover rounded shadow-sm"
                          referrerPolicy="no-referrer"
                        />
                        <span className="font-bold text-lg">{toCurrency.code}</span>
                      </div>
                      <ChevronDown size={16} className="text-slate-400" />
                    </button>
                  </div>

                  <AnimatePresence>
                    {showDropdown && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className={`absolute z-50 top-full mt-2 p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl max-h-80 overflow-hidden flex flex-col w-full md:w-64 ${dropdownType === 'to' ? 'md:right-0' : 'md:left-0'}`}
                      >
                        <div className="relative mb-2">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                          <input 
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                            autoFocus
                          />
                        </div>
                        <div className="overflow-y-auto flex-1 custom-scrollbar">
                          {filteredCurrencies.map((c) => (
                            <button
                              key={c.code}
                              onClick={() => {
                                if (dropdownType === 'from') setFromCurrency(c);
                                else setToCurrency(c);
                                setShowDropdown(false);
                                setSearchQuery('');
                              }}
                              className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-colors ${((dropdownType === 'from' ? fromCurrency : toCurrency).code === c.code) ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                            >
                              <img 
                                src={`https://flagcdn.com/w40/${c.flag}.png`} 
                                alt={c.name}
                                className="w-5 h-3.5 object-cover rounded shadow-sm"
                                referrerPolicy="no-referrer"
                              />
                              <span className="font-bold text-sm">{c.code}</span>
                              <span className="text-xs opacity-70 truncate">{c.name}</span>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Amount Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wider">Numeric Amount</label>
                    <div className="relative">
                      <input 
                        type="text"
                        value={amount}
                        onChange={handleAmountChange}
                        placeholder="0.00"
                        className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 outline-none text-xl font-bold transition-all"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">{fromCurrency.code}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wider">Text Amount</label>
                    <div className="relative">
                      <input 
                        type="text"
                        value={textAmount}
                        onChange={handleTextAmountChange}
                        placeholder="e.g. Ten Thousand"
                        className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 focus:border-emerald-500 dark:focus:border-emerald-500 outline-none text-lg font-medium transition-all italic"
                      />
                    </div>
                  </div>
                </div>

                {/* Exchange Rate Info */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-slate-500">
                    <TrendingUp size={16} className="text-emerald-500" />
                    <span className="text-sm font-medium">
                      {loading ? (
                        <RefreshCw size={14} className="animate-spin inline mr-1" />
                      ) : (
                        `1 ${fromCurrency.code} = ${exchangeRate?.toFixed(4) || '...'} ${toCurrency.code}`
                      )}
                    </span>
                  </div>
                  <button 
                    onClick={fetchRate}
                    className="text-xs font-bold text-emerald-500 hover:text-emerald-600 uppercase tracking-widest flex items-center gap-1"
                  >
                    <RefreshCw size={12} /> Refresh
                  </button>
                </div>
              </div>
            </motion.div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm flex items-center gap-3"
              >
                <Info size={18} />
                {error}
              </motion.div>
            )}
          </div>

          {/* Result Section */}
          <div className="lg:col-span-5">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="h-full p-8 rounded-3xl bg-emerald-500 text-white shadow-2xl shadow-emerald-500/30 flex flex-col justify-between relative overflow-hidden"
            >
              {/* Background Decoration */}
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-black/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-8 opacity-80">
                  <ArrowRightLeft size={16} />
                  <span className="text-xs font-bold uppercase tracking-widest">Conversion Result</span>
                </div>

                <div className="space-y-6">
                  <div>
                    <h2 className="text-4xl md:text-5xl font-display font-bold break-all leading-tight">
                      {toCurrency.code === 'INR' ? formatIndianNumber(result) : `${toCurrency.code} ${result.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    </h2>
                    <p className="mt-2 text-emerald-100 font-medium opacity-90">
                      {toCurrency.name} ({toCurrency.code})
                    </p>
                  </div>

                  {toCurrency.code === 'INR' && (
                    <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
                      <p className="text-sm font-medium text-emerald-50 leading-relaxed italic">
                        "{numberToIndianWords(result)}"
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="relative z-10 mt-12 flex gap-3">
                <button 
                  onClick={copyToClipboard}
                  className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-white text-emerald-600 font-bold hover:bg-emerald-50 transition-all active:scale-95"
                >
                  {copied ? <Check size={18} /> : <Copy size={18} />}
                  {copied ? 'Copied!' : 'Copy Result'}
                </button>
              </div>
            </motion.div>
          </div>
        </main>

        {/* Footer Info */}
        <footer className="mt-16 text-center space-y-4">
          <p className="text-slate-400 text-sm font-medium">
            Powered by real-time exchange rates. Data updated daily.
          </p>
          <div className="flex items-center justify-center gap-6">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Rates
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              150+ Currencies
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

