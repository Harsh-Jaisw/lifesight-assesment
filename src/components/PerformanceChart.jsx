// src/components/PerformanceChart.js
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectFilteredItems } from '../features/performance/selectors';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

const PerformanceChart = React.memo(function PerformanceChart() {
  const items = useSelector(selectFilteredItems);

  const chartData = useMemo(() => {
    const byChannel = items.reduce((acc, item) => {
      if (!acc[item.channel]) {
        acc[item.channel] = {
          channel: item.channel,
          spend: 0,
          conversions: 0,
        };
      }
      acc[item.channel].spend += item.spend;
      acc[item.channel].conversions += item.conversions;
      return acc;
    }, {});

    const arr = Object.values(byChannel);
    // Top 10 by spend
    arr.sort((a, b) => b.spend - a.spend);
    return arr.slice(0, 10);
  }, [items]);

  if (chartData.length === 0) {
    return <div>No data for chart.</div>;
  }
 
  return (
    <div
      style={{ 
        height: 300,
        marginTop: '1rem',
        padding: '1rem',
        border: '1px solid #eee',
        borderRadius: '8px',
      }}
    >
      <h3 style={{ marginBottom: '0.5rem' }}>Performance Insights</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="channel" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="spend" name="Spend" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
});

export default PerformanceChart;
