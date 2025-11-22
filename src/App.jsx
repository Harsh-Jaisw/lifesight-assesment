
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPerformanceData } from './features/performance/performanceSlice';
import Filters from './components/Filters';
import TotalsBar from './components/TotalsBar';
import PerformanceTable from './components/PerformanceTable';
import PerformanceChart from './components/PerformanceChart';

function App() {
  const dispatch = useDispatch();
  const status = useSelector(state => state.performance.status);
  const error = useSelector(state => state.performance.error);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPerformanceData());
    }
  }, [status, dispatch]);

  return (
    <div style={{ padding: '1.5rem', maxWidth: 1200, margin: '0 auto' }}>
      <h1>Marketing Performance Dashboard</h1>
      {status === 'loading' && <p>Loading data…</p>}
      {status === 'failed' && <p style={{ color: 'red' }}>{error}</p>}

      {status === 'succeeded' && (
        <>
          <Filters />
          <TotalsBar />
          <PerformanceTable />
          <PerformanceChart />
        </>
      )}
    </div>
  );
}

export default App;
