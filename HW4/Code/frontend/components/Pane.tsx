import React, { useState } from 'react';
import { Search, Gauge, Database, AlertCircle, Timer } from 'lucide-react';
import { Player, PaneTheme } from '../types';
import { searchService } from '../services/apiService';
import ResultTable from './ResultTable';

interface PaneProps {
  title: string;
  theme: PaneTheme;
  simpleEndpoint: string;
  complexEndpoint: string;
  description: string;
}

const Pane: React.FC<PaneProps> = ({ title, theme, simpleEndpoint, complexEndpoint, description }) => {
  // Input States
  const [simpleQuery, setSimpleQuery] = useState('');
  const [nationQuery, setNationQuery] = useState('');
  const [positionQuery, setPositionQuery] = useState('');

  // Execution States
  const [loading, setLoading] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [results, setResults] = useState<Player[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Theme styles
  const isRed = theme === 'red';
  const containerClass = isRed ? 'bg-red-50/50 border-red-200' : 'bg-green-50/50 border-green-200';
  const borderClass = isRed ? 'border-red-200' : 'border-green-200';
  const buttonClass = isRed 
    ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-200' 
    : 'bg-green-600 hover:bg-green-700 text-white shadow-green-200';
  const titleColor = isRed ? 'text-red-900' : 'text-green-900';
  const accentText = isRed ? 'text-red-600' : 'text-green-600';
  const ringFocus = isRed ? 'focus:ring-red-500' : 'focus:ring-green-500';

  const handleSimpleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!simpleQuery.trim()) return;
    
    setLoading(true);
    setError(null);
    setExecutionTime(null);
    setResults([]);

    try {
      const data = await searchService.searchByName(simpleEndpoint, simpleQuery);
      setResults(data.results);
      setExecutionTime(data.execution_time);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleComplexSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nationQuery.trim() || !positionQuery.trim()) return;

    setLoading(true);
    setError(null);
    setExecutionTime(null);
    setResults([]);

    try {
      const data = await searchService.searchComplex(complexEndpoint, nationQuery, positionQuery);
      setResults(data.results);
      setExecutionTime(data.execution_time);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex flex-col h-full overflow-hidden border-r last:border-r-0 ${containerClass}`}>
      {/* Header */}
      <div className={`p-6 border-b ${borderClass} bg-white/50 backdrop-blur-sm sticky top-0 z-10`}>
        <div className="flex items-center gap-2 mb-1">
          {isRed ? <AlertCircle className="w-5 h-5 text-red-600" /> : <Database className="w-5 h-5 text-green-600" />}
          <h2 className={`text-xl font-bold ${titleColor}`}>{title}</h2>
        </div>
        <p className="text-sm text-slate-500">{description}</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        
        {/* Forms Container */}
        <div className="grid grid-cols-1 gap-6">
          
          {/* Option 1: Simple Search */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
              <Search className="w-4 h-4" /> Single Table Search
            </h3>
            <form onSubmit={handleSimpleSearch} className="flex gap-3">
              <input
                type="text"
                placeholder="Enter Player Name..."
                value={simpleQuery}
                onChange={(e) => setSimpleQuery(e.target.value)}
                className={`flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 ${ringFocus} transition-all`}
              />
              <button 
                type="submit" 
                disabled={loading}
                className={`px-6 py-2 rounded-lg font-medium shadow-lg shadow-opacity-20 transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${buttonClass}`}
              >
                {loading ? '...' : 'Search'}
              </button>
            </form>
          </div>

          {/* Option 2: Complex Search */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
              <Gauge className="w-4 h-4" /> Joined Query Search
            </h3>
            <form onSubmit={handleComplexSearch} className="flex flex-col gap-3">
              <div className="flex gap-3">
                {/* 65% Width */}
                <input
                  type="text"
                  placeholder="Nation (e.g. Brazil)"
                  value={nationQuery}
                  onChange={(e) => setNationQuery(e.target.value)}
                  className={`w-[65%] px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 ${ringFocus} transition-all`}
                />
                {/* 35% Width */}
                <input
                  type="text"
                  placeholder="Pos (e.g. ST)"
                  value={positionQuery}
                  onChange={(e) => setPositionQuery(e.target.value)}
                  className={`w-[35%] px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 ${ringFocus} transition-all`}
                />
              </div>
              <button 
                type="submit"
                disabled={loading}
                className={`w-full py-2 rounded-lg font-medium shadow-lg shadow-opacity-20 transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${buttonClass}`}
              >
                {loading ? 'Running Join...' : 'Run Join Search'}
              </button>
            </form>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-4">
          <div className="flex items-end justify-between border-b pb-2 border-slate-200">
            <h3 className="font-semibold text-slate-700 flex items-center gap-2">
              Results 
              {executionTime !== null && <span className="text-xs font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Top 5 shown</span>}
            </h3>
            {executionTime !== null && (
              <div className="flex items-center gap-2 text-3xl font-bold font-mono animate-in fade-in slide-in-from-bottom-2 duration-500">
                <Timer className={`w-6 h-6 ${accentText}`} />
                <span className={accentText}>{executionTime.toFixed(4)}s</span>
              </div>
            )}
          </div>

          {error && (
            <div className="p-4 bg-red-100 text-red-700 rounded-lg border border-red-200 text-sm">
              <strong>Error:</strong> {error}
            </div>
          )}

          {!error && (
            <ResultTable data={results} theme={theme} />
          )}
        </div>

      </div>
    </div>
  );
};

export default Pane;