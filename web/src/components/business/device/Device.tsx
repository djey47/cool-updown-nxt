import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { IoPowerSharp } from 'react-icons/io5';
import { MdDownloading } from 'react-icons/md';
import classNames from 'classnames';
import Button from '../../atoms/button/Button';
import Card from '../../atoms/card/Card';
import CardContent from '../../atoms/card/card-content/CardContent';
import { getDiagnosticsForDevice } from '../../../api/diagnostics';
import { getStatisticsForDevice } from '../../../api/statistics';
import { postPowerOnForDevice } from '../../../api/power';
import DropDownMenu, { type DropDownMenuItem } from '../../atoms/dropdown-menu/DropDownMenu';
import DiagItem from '../diag-item/DiagItem';
import Popup from '../../atoms/popup/Popup';
import { prettyFormatDuration } from '../../../helpers/time';

import type { DeviceInfo } from '../../../model/device';
import { DiagItemType } from '../../../model/diagnostics';

import './Device.css';

interface DeviceProps {
  deviceInfo: DeviceInfo;
}

const Device = ({ deviceInfo }: DeviceProps) => {
  const [isDetailedMode, setDetailedMode] = useState(false);
  const [isLogDisplayed, setLogDisplayed] = useState(false);
  const [isPerformingPowerOn, setPerformingPowerOn] = useState(false);
  const [isPerformingPowerOff, setPerformingPowerOff] = useState(false);

  const deviceId = deviceInfo.id;
  const diagsQuery = useQuery({
    queryKey: ['diags', deviceId],
    queryFn: ({ queryKey }) => getDiagnosticsForDevice(queryKey[1]),
    refetchInterval: 5000,
  });
  const statsQuery = useQuery({
    queryKey: ['stats', deviceId],
    queryFn: ({ queryKey }) => getStatisticsForDevice(queryKey[1]),
    refetchInterval: 5000,
  });

  const diagsQueryData = diagsQuery.data;
  const devicePowerState = diagsQueryData?.power?.state || 'n/a';

  const handlePowerClick = async () => {
    if (devicePowerState === 'off') {
      await postPowerOnForDevice(deviceInfo.id);
      setPerformingPowerOn(true);  
      setPerformingPowerOff(false);  
    } else if (devicePowerState === 'on') {
      // TODO OFF
      setPerformingPowerOff(true);
      setPerformingPowerOn(false);
    }
  };

  const handleShowLogs = () => {
    console.log('Device::handleShowLogs', { deviceId });

    setDetailedMode(false);
    setLogDisplayed((prev) => !prev);
  };

  const handleShowDetails = () => {
    console.log('Device::handleShowDetails', { deviceId });

    setLogDisplayed(false);
    setDetailedMode((prev) => !prev);
  };

  if (isPerformingPowerOn && devicePowerState === 'on') {
    setPerformingPowerOn(false);
  }
  if (isPerformingPowerOff && devicePowerState === 'off') {
    setPerformingPowerOff(false);
  }

  const devicePowerClassNames = classNames(
    'device-power-cta',
    'text-xl',
    {
      'is-on': devicePowerState === 'on',
      'is-off': devicePowerState === 'off',
      'is-na': devicePowerState === 'n/a',
      'animate-pulse': isPerformingPowerOn || isPerformingPowerOff,
    });

  const devicePingStatus = diagsQueryData?.ping?.status || 'n/a';
  const devicePingClassNames = classNames(
    'device-ping-status',
    'text-lg',
    {
      'is-ok': devicePingStatus === 'ok',
      'is-ko': devicePingStatus === 'ko',
      'is-na': devicePingStatus === 'n/a'
    });

  const statsQueryData = statsQuery.data;

  console.log('Device::render', { diagsQueryData, statsQueryData });

  const menuItems: DropDownMenuItem[] = [{
    label: 'Details',
    clickHandler: handleShowDetails,
    linkHref: '#',
  }, {
    label: 'Logs',
    clickHandler: handleShowLogs,
    linkHref: '#',
  }];

  const fetchStatusClassName = classNames({
    'text-white': diagsQuery.isFetching || statsQuery.isFetching,
    'text-indigo-900': !diagsQuery.isFetching && !statsQuery.isFetching,
  });


  return (
    <>
      <Card key={deviceInfo.id}>
        <CardContent>
          <Button onClick={handlePowerClick}>
            <IoPowerSharp className={devicePowerClassNames} />
          </Button>
          {deviceInfo.network.hostname} ({deviceInfo.id})
        </CardContent>
        <CardContent>
          <DiagItem type={DiagItemType.PING} className={devicePingClassNames} />
        </CardContent>
        <CardContent>
          Uptime: {prettyFormatDuration(statsQueryData?.uptimeSeconds.current || 0)} / {prettyFormatDuration(statsQueryData?.uptimeSeconds.overall || 0)}
        </CardContent>
        <CardContent alignment='right'>
          <MdDownloading className={fetchStatusClassName} />
        </CardContent>
        <CardContent>
          <DropDownMenu items={menuItems} />
        </CardContent>
      </Card>
      <Popup isShown={isDetailedMode}>
        Details
      </Popup>
      <Popup isShown={isLogDisplayed}>
        Logs
      </Popup>
    </>
  );
}

export default Device;
