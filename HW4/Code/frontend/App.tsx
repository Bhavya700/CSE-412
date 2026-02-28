import React from 'react';
import Pane from './components/Pane';
import { ENDPOINTS } from './constants';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left Pane: No Indexing */}
      {/* min-w-0 prevents the flex child from expanding beyond its allocated width when content is wide */}
      <div className="w-full md:w-1/2 h-screen border-r border-slate-200 flex flex-col min-w-0 shrink-0">
        <Pane 
          title="Search WITHOUT Indexing"
          description="Standard queries on raw tables. Slow for large datasets."
          theme="red"
          simpleEndpoint={ENDPOINTS.NO_INDEX.SIMPLE}
          complexEndpoint={ENDPOINTS.NO_INDEX.COMPLEX}
        />
      </div>

      {/* Right Pane: With Indexing */}
      <div className="w-full md:w-1/2 h-screen flex flex-col min-w-0 shrink-0">
        <Pane 
          title="Search WITH Indexing"
          description="Optimized queries using B-Tree indexes. Significantly faster."
          theme="green"
          simpleEndpoint={ENDPOINTS.WITH_INDEX.SIMPLE}
          complexEndpoint={ENDPOINTS.WITH_INDEX.COMPLEX}
        />
      </div>
    </div>
  );
};

export default App;