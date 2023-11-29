import { IoStopwatch } from 'react-icons/io5';
import { prettyFormatDuration } from '../../../helpers/time';

import type { DeviceUptimeStatistics } from '../../../model/device';

interface UptimeItemProps {
  deviceUptimeStats?: DeviceUptimeStatistics;
}

const UptimeItem = ({ deviceUptimeStats }: UptimeItemProps) => {
  return (
    <>
      <IoStopwatch />
      {prettyFormatDuration(deviceUptimeStats?.current || 0)}
      &nbsp;/&nbsp;
      {prettyFormatDuration(deviceUptimeStats?.overall || 0)} in total
    </>
  );
};

export default UptimeItem;
