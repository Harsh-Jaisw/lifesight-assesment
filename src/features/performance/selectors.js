// src/features/performance/selectors.js
import { createSelector } from '@reduxjs/toolkit';

const selectPerformanceState = state => state.performance;

export const selectRawItems = createSelector(
  [selectPerformanceState],
  performance => performance.items
);

export const selectFilters = createSelector(
  [selectPerformanceState],
  performance => performance.filters
);

export const selectSort = createSelector(
  [selectPerformanceState],
  performance => performance.sort
);

export const selectPagination = createSelector(
  [selectPerformanceState],
  performance => performance.pagination
);

// Unique regions & channels for select dropdowns
export const selectRegions = createSelector([selectRawItems], items => {
  const set = new Set(items.map(i => i.region));
  return ['All', ...Array.from(set)];
});

export const selectChannels = createSelector([selectRawItems], items => {
  const set = new Set(items.map(i => i.channel));
  return ['All', ...Array.from(set)];
});

// Filtered data
export const selectFilteredItems = createSelector(
  [selectRawItems, selectFilters],
  (items, filters) => {
    return items.filter(item => {
      const regionOk =
        filters.region === 'All' || item.region === filters.region;
      const channelOk =
        filters.channel === 'All' || item.channel === filters.channel;
      return regionOk && channelOk;
    });
  }
);

// Add CTR and compute sorting
const withCtr = item => {
  const ctr =
    item.impressions > 0
      ? (item.clicks / item.impressions) * 100
      : 0;
  return { ...item, ctr };
};

export const selectSortedItems = createSelector(
  [selectFilteredItems, selectSort],
  (items, sort) => {
    const withCtrItems = items.map(withCtr);
    const { field, direction } = sort;
    const factor = direction === 'asc' ? 1 : -1;

    return [...withCtrItems].sort((a, b) => {
      const valA = a[field];
      const valB = b[field];
      if (valA < valB) return -1 * factor;
      if (valA > valB) return 1 * factor;
      return 0;
    });
  }
);

// Pagination
export const selectPagedItems = createSelector(
  [selectSortedItems, selectPagination],
  (items, pagination) => {
    const { page, pageSize } = pagination;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return {
      total: items.length,
      pageItems: items.slice(start, end),
    };
  }
);

// Totals (Spend, Conversions, CTR)
export const selectTotals = createSelector(
  [selectFilteredItems],
  items => {
    const totals = items.reduce(
      (acc, item) => {
        acc.spend += item.spend;
        acc.conversions += item.conversions;
        acc.clicks += item.clicks;
        acc.impressions += item.impressions;
        return acc;
      },
      { spend: 0, conversions: 0, clicks: 0, impressions: 0 }
    );
    const ctr =
      totals.impressions > 0
        ? (totals.clicks / totals.impressions) * 100
        : 0;

    return {
      ...totals,
      ctr,
    };
  }
);

// Grouped by region for accordion (region row + channels)
export const selectGroupedByRegion = createSelector(
  [selectPagedItems],
  ({ pageItems, total }) => {
    const byRegion = pageItems.reduce((acc, item) => {
      if (!acc[item.region]) {
        acc[item.region] = [];
      }
      acc[item.region].push(item);
      return acc;
    }, {});

    const regions = Object.entries(byRegion).map(([region, items]) => {
      const agg = items.reduce(
        (acc, item) => {
          acc.spend += item.spend;
          acc.conversions += item.conversions;
          acc.clicks += item.clicks;
          acc.impressions += item.impressions;
          return acc;
        },
        { spend: 0, conversions: 0, clicks: 0, impressions: 0 }
      );
      const ctr =
        agg.impressions > 0
          ? (agg.clicks / agg.impressions) * 100
          : 0;
      return {
        region,
        items,
        totals: { ...agg, ctr },
      };
    });

    return { regions, total };
  }
);
