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

const Filters = React.memo(function Filters() {
  const dispatch = useDispatch();
  const regions = useSelector(selectRegions);
  const channels = useSelector(selectChannels);
  const filters = useSelector(selectFilters);

  const handleRegionChange = useCallback(
    e => {
      dispatch(setRegionFilter(e.target.value));
    },
    [dispatch]
  );

  const handleChannelChange = useCallback(
    e => {
      dispatch(setChannelFilter(e.target.value));
    },
    [dispatch]
  );

  return (
    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
      <div>
        <label>
          Region:&nbsp;
          <select value={filters.region} onChange={handleRegionChange}>
            {regions.map(region => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <label>
          Channel:&nbsp;
          <select value={filters.channel} onChange={handleChannelChange}>
            {channels.map(channel => (
              <option key={channel} value={channel}>
                {channel}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
});

export default Filters;
