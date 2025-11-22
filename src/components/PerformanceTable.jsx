// src/components/PerformanceTable.js
import React, { useMemo, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectGroupedByRegion,
  selectPagination,
  selectSort,
} from '../features/performance/selectors';
import {
  setPage,
  setPageSize,
  setSort,
} from '../features/performance/performanceSlice';

const formatNumber = value => value.toLocaleString();
const formatCurrency = value =>
  value.toLocaleString(undefined, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });

const PerformanceTable = React.memo(function PerformanceTable() {
  const dispatch = useDispatch();
  const { regions, total } = useSelector(selectGroupedByRegion);
  const pagination = useSelector(selectPagination);
  const sort = useSelector(selectSort);

  const [openRegions, setOpenRegions] = useState({}); // { [region]: bool }

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / pagination.pageSize)),
    [total, pagination.pageSize]
  );

  const toggleRegion = useCallback(region => {
    setOpenRegions(prev => ({
      ...prev,
      [region]: !prev[region],
    }));
  }, []);

  const handlePageChange = useCallback(
    newPage => {
      if (newPage < 1 || newPage > totalPages) return;
      dispatch(setPage(newPage));
    },
    [dispatch, totalPages]
  );

  const handlePageSizeChange = useCallback(
    e => {
      const newSize = Number(e.target.value);
      dispatch(setPageSize(newSize));
    },
    [dispatch]
  );

  const handleSort = useCallback(
    field => {
      dispatch(setSort({ field }));
    },
    [dispatch]
  );

  const getSortLabel = field => {
    if (sort.field !== field) return '';
    return sort.direction === 'asc' ? ' ▲' : ' ▼';
  };

  return (
    <div>
      <div
        style={{
          marginBottom: '0.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          Page {pagination.page} of {totalPages} &middot; Total:{' '}
          {total.toLocaleString()} rows
        </div>
        <div>
          Rows / page:&nbsp;
          <select
            value={pagination.pageSize}
            onChange={handlePageSizeChange}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          border: '1px solid #ddd',
          fontSize: '0.9rem',
        }}
      >
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5' }}>
            <th
              style={{ textAlign: 'left', padding: '0.5rem' }}
            >
              Region / Channel
            </th>
            <th
              style={{
                textAlign: 'right',
                padding: '0.5rem',
                cursor: 'pointer',
              }}
              onClick={() => handleSort('spend')}
            >
              Spend{getSortLabel('spend')}
            </th>
            <th
              style={{
                textAlign: 'right',
                padding: '0.5rem',
                cursor: 'pointer',
              }}
              onClick={() => handleSort('impressions')}
            >
              Impressions{getSortLabel('impressions')}
            </th>
            <th
              style={{
                textAlign: 'right',
                padding: '0.5rem',
                cursor: 'pointer',
              }}
              onClick={() => handleSort('clicks')}
            >
              Clicks{getSortLabel('clicks')}
            </th>
            <th
              style={{
                textAlign: 'right',
                padding: '0.5rem',
                cursor: 'pointer',
              }}
              onClick={() => handleSort('conversions')}
            >
              Conversions{getSortLabel('conversions')}
            </th>
            <th
              style={{
                textAlign: 'right',
                padding: '0.5rem',
                cursor: 'pointer',
              }}
              onClick={() => handleSort('ctr')}
            >
              CTR%{getSortLabel('ctr')}
            </th>
          </tr>
        </thead>
        <tbody>
          {regions.map(regionGroup => {
            const isOpen = !!openRegions[regionGroup.region];
            return (
              <React.Fragment key={regionGroup.region}>
                {/* REGION HEADER ROW (accordion) */}
                <tr
                  onClick={() => toggleRegion(regionGroup.region)}
                  style={{
                    backgroundColor: '#fafafa',
                    cursor: 'pointer',
                  }}
                >
                  <td
                    style={{
                      padding: '0.5rem',
                      fontWeight: 'bold',
                      borderTop: '1px solid #eee',
                    }}
                  >
                    {isOpen ? '▼' : '▶'} {regionGroup.region}
                  </td>
                  <td
                    style={{
                      textAlign: 'right',
                      padding: '0.5rem',
                      borderTop: '1px solid #eee',
                    }}
                  >
                    {formatCurrency(regionGroup.totals.spend)}
                  </td>
                  <td
                    style={{
                      textAlign: 'right',
                      padding: '0.5rem',
                      borderTop: '1px solid #eee',
                    }}
                  >
                    {formatNumber(regionGroup.totals.impressions)}
                  </td>
                  <td
                    style={{
                      textAlign: 'right',
                      padding: '0.5rem',
                      borderTop: '1px solid #eee',
                    }}
                  >
                    {formatNumber(regionGroup.totals.clicks)}
                  </td>
                  <td
                    style={{
                      textAlign: 'right',
                      padding: '0.5rem',
                      borderTop: '1px solid #eee',
                    }}
                  >
                    {formatNumber(regionGroup.totals.conversions)}
                  </td>
                  <td
                    style={{
                      textAlign: 'right',
                      padding: '0.5rem',
                      borderTop: '1px solid #eee',
                    }}
                  >
                    {regionGroup.totals.ctr.toFixed(2)}%
                  </td>
                </tr>

                {/* CHANNEL ROWS */}
                {isOpen &&
                  regionGroup.items.map(item => (
                    <tr key={item.id}>
                      <td
                        style={{
                          padding: '0.5rem 0.5rem 0.5rem 2rem',
                          borderTop: '1px solid #f0f0f0',
                        }}
                      >
                        {item.channel}
                      </td>
                      <td
                        style={{
                          textAlign: 'right',
                          padding: '0.5rem',
                          borderTop: '1px solid #f0f0f0',
                        }}
                      >
                        {formatCurrency(item.spend)}
                      </td>
                      <td
                        style={{
                          textAlign: 'right',
                          padding: '0.5rem',
                          borderTop: '1px solid #f0f0f0',
                        }}
                      >
                        {formatNumber(item.impressions)}
                      </td>
                      <td
                        style={{
                          textAlign: 'right',
                          padding: '0.5rem',
                          borderTop: '1px solid #f0f0f0',
                        }}
                      >
                        {formatNumber(item.clicks)}
                      </td>
                      <td
                        style={{
                          textAlign: 'right',
                          padding: '0.5rem',
                          borderTop: '1px solid #f0f0f0',
                        }}
                      >
                        {formatNumber(item.conversions)}
                      </td>
                      <td
                        style={{
                          textAlign: 'right',
                          padding: '0.5rem',
                          borderTop: '1px solid #f0f0f0',
                        }}
                      >
                        {((item.clicks / item.impressions) * 100 || 0).toFixed(
                          2
                        )}
                        %
                      </td>
                    </tr>
                  ))}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>

      <div
        style={{
          marginTop: '0.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <button
          onClick={() => handlePageChange(pagination.page - 1)}
          disabled={pagination.page === 1}
        >
          Prev
        </button>
        <span>
          Page {pagination.page} / {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(pagination.page + 1)}
          disabled={pagination.page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
});

export default PerformanceTable;
