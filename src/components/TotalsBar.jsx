// src/components/TotalsBar.js
import React from 'react';
import { useSelector } from 'react-redux';
import { selectTotals } from '../features/performance/selectors';

const formatCurrency = value =>
  value.toLocaleString(undefined, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });

const TotalsBar = React.memo(function TotalsBar() {
  const totals = useSelector(selectTotals);

  return (
    <div
      style={{
        display: 'flex',
        gap: '2rem',
        padding: '0.75rem 1rem',
        borderRadius: '8px',
        border: '1px solid #eee',
        marginBottom: '1rem',
      }}
    >
      <div>
        <strong>Total Spend:</strong>{' '}
        {formatCurrency(totals.spend || 0)}
      </div>
      <div>
        <strong>Total Conversions:</strong>{' '}
        {totals.conversions.toLocaleString()}
      </div>
      <div>
        <strong>Total CTR:</strong>{' '}
        {totals.ctr.toFixed(2)}%
      </div>
    </div>
  );
});

export default TotalsBar;
