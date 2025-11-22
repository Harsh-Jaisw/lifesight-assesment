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
import CustomSelect from './CustomSelect';
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
  const pageOptions = [{ label: 10, value: 10 },{ label: 25, value: 25 },{ label: 50, value: 50 }]
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
    value => {
      const newSize = Number(value);
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
           <CustomSelect
          options={pageOptions}
          value={pagination.pageSize}
          handleChange={handlePageSizeChange}
          wrapperClassName='filters-row-select'
        />
        </div>
      </div>
      <div className="table-wrapper">
          <table className="perf-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('spend')}>
                  Region / Channel
                </th>

                <th onClick={() => handleSort('spend')}>
                  Spend{getSortLabel('spend')}
                </th>

                <th onClick={() => handleSort('impressions')}>
                  Impressions{getSortLabel('impressions')}
                </th>

                <th onClick={() => handleSort('clicks')}>
                  Clicks{getSortLabel('clicks')}
                </th>

                <th onClick={() => handleSort('conversions')}>
                  Conversions{getSortLabel('conversions')}
                </th>

                <th onClick={() => handleSort('ctr')}>
                  CTR%{getSortLabel('ctr')}
                </th>
              </tr>
            </thead>

            <tbody>
                {regions.map(regionGroup => {
                  const isOpen = !!openRegions[regionGroup.region];
                  return (
                    <React.Fragment key={regionGroup.region}>
                      {/* REGION ROW */}
                      <tr
                        className="region-row"
                        onClick={() => toggleRegion(regionGroup.region)}
                      >
                        <td>{isOpen ? '▼' : '▶'} {regionGroup.region}</td>
                        <td>{formatCurrency(regionGroup.totals.spend)}</td>
                        <td>{formatNumber(regionGroup.totals.impressions)}</td>
                        <td>{formatNumber(regionGroup.totals.clicks)}</td>
                        <td>{formatNumber(regionGroup.totals.conversions)}</td>
                        <td>{regionGroup.totals.ctr.toFixed(2)}%</td>
                      </tr>

                      {/* CHANNEL ROWS */}
                      {isOpen &&
                        regionGroup.items.map((item) => (
                          <tr
                            key={item.id}
                            className="channel-row"
                          >
                            <td className="child-cell">{item.channel}</td>
                            <td>{formatCurrency(item.spend)}</td>
                            <td>{formatNumber(item.impressions)}</td>
                            <td>{formatNumber(item.clicks)}</td>
                            <td>{formatNumber(item.conversions)}</td>
                            <td>{((item.clicks / item.impressions) * 100 || 0).toFixed(2)}%</td>
                          </tr>
                        ))}
                    </React.Fragment>
                  );
                })}
            </tbody>
          </table>
      </div>
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
