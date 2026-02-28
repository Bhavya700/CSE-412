import React from 'react';
import { Player } from '../types';

interface ResultTableProps {
  data: Player[];
  theme: 'red' | 'green';
}

const ResultTable: React.FC<ResultTableProps> = ({ data, theme }) => {
  if (!data || data.length === 0) {
    return (
      <div className="p-4 text-center text-slate-500 italic border rounded-lg bg-white/50">
        No results found.
      </div>
    );
  }

  const headerColor = theme === 'red' ? 'bg-red-100 text-red-900' : 'bg-green-100 text-green-900';
  const rowHoverColor = theme === 'red' ? 'hover:bg-red-50' : 'hover:bg-green-50';

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-slate-200 shadow-sm bg-white">
      {/* min-w-max ensures the table doesn't shrink its columns to fit, forcing a scrollbar instead */}
      <table className="w-full min-w-max text-sm text-left text-slate-600">
        <thead className={`text-xs uppercase ${headerColor}`}>
          <tr>
            <th scope="col" className="px-4 py-3 font-semibold whitespace-nowrap">ID</th>
            <th scope="col" className="px-4 py-3 font-semibold whitespace-nowrap">Name</th>
            <th scope="col" className="px-4 py-3 font-semibold whitespace-nowrap">Nation</th>
            <th scope="col" className="px-4 py-3 font-semibold whitespace-nowrap">Club</th>
            <th scope="col" className="px-4 py-3 font-semibold text-right whitespace-nowrap">Rating</th>
            <th scope="col" className="px-4 py-3 font-semibold text-right whitespace-nowrap">Pace</th>
          </tr>
        </thead>
        <tbody>
          {data.map((player) => (
            <tr key={player.id} className={`border-b border-slate-100 last:border-b-0 transition-colors ${rowHoverColor}`}>
              <td className="px-4 py-3 font-mono text-xs whitespace-nowrap">{player.id}</td>
              <td className="px-4 py-3 font-medium text-slate-900 whitespace-nowrap">{player.name}</td>
              <td className="px-4 py-3 whitespace-nowrap">{player.nation}</td>
              <td className="px-4 py-3 whitespace-nowrap">{player.club}</td>
              <td className="px-4 py-3 text-right whitespace-nowrap">{player.overall}</td>
              <td className="px-4 py-3 text-right font-semibold whitespace-nowrap">{player.pace}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResultTable;