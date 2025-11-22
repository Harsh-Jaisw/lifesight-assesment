import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectRegions,
  selectChannels,
  selectFilters,
} from '../features/performance/selectors';
import { 
  setRegionFilter,
  setChannelFilter,
} from '../features/performance/performanceSlice';
import CustomSelect from './CustomSelect';
const Filters = React.memo(function Filters() {
  const dispatch = useDispatch();
  const regions = useSelector(selectRegions);
  const channels = useSelector(selectChannels);
  const filters = useSelector(selectFilters);
   const regionOptions = regions.map((r) => ({ label: r, value: r }));
  const channelOptions = channels.map((c) => ({ label: c, value: c }));

const handleRegionChange = useCallback(
  (value) => {
    dispatch(setRegionFilter(value));
  },
  [dispatch]
);

const handleChannelChange = useCallback(
  (value) => {
    dispatch(setChannelFilter(value));
  },
  [dispatch]
);


  return (
    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
      <div>
        <label>
          Region:&nbsp;
          <CustomSelect
          options={regionOptions}
          value={filters.region}
          handleChange={handleRegionChange}
          className="filters-select"
        />
        </label>
      </div>
      <div>
        <label>
          Channel:&nbsp;
           <CustomSelect
          options={channelOptions}
          value={filters.channel}
          handleChange={handleChannelChange}
          className="filters-select"
        />
        </label>
      </div>
    </div>
  );
});

export default Filters;
