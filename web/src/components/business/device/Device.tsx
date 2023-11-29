import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import Card from '../../atoms/card/Card';
import CardContent from '../../atoms/card/card-content/CardContent';
import { getDiagnosticsForDevice } from '../../../api/diagnostics';
import { getStatisticsForDevice } from '../../../api/statistics';
import { postPowerOffForDevice, postPowerOnForDevice } from '../../../api/power';
import DropDownMenu, { type DropDownMenuItem } from '../../atoms/dropdown-menu/DropDownMenu';
import Popup from '../../atoms/popup/Popup';
import PowerItemButton from '../power-item-button/PowerItemButton';
import UptimeItem from '../uptime-item/UptimeItem';
import FetchStatus from '../fetch-status/FetchStatus';
import DiagItems, { DiagItemsProps } from '../diag-items/DiagItems';

import { DiagItemType } from '../../../model/diagnostics';
import { STATUS_UNAVAIL, type DeviceInfo } from '../../../model/device';

import './Device.css';

interface DeviceProps {
  deviceInfo: DeviceInfo;
}

type PopupDisplayMode  = 'details' | 'logs' | 'none';

const Device = ({ deviceInfo }: DeviceProps) => {
  const [popupDisplayMode, setPopupDisplayMode] = useState<PopupDisplayMode>('none');
  const [isPerformingPowerOn, setPerformingPowerOn] = useState(false);
  const [isPerformingPowerOff, setPerformingPowerOff] = useState(false);

  const deviceId = deviceInfo.id;
  const { data: diagsQueryData, isFetching: isFetchingDiags} = useQuery({
    queryKey: ['diags', deviceId],
    queryFn: ({ queryKey }) => getDiagnosticsForDevice(queryKey[1]),
    refetchInterval: 5000,
  });
  const { data: statsQueryData, isFetching: isFetchingStats} = useQuery({
    queryKey: ['stats', deviceId],
    queryFn: ({ queryKey }) => getStatisticsForDevice(queryKey[1]),
    refetchInterval: 5000,
  });

  const devicePowerState = diagsQueryData?.power?.state || STATUS_UNAVAIL;

  const handlePowerClick = async () => {
    if (devicePowerState === 'off') {
      await postPowerOnForDevice(deviceId);
      setPerformingPowerOn(true);  
      setPerformingPowerOff(false);  
    } else if (devicePowerState === 'on') {
      await postPowerOffForDevice(deviceId);
      setPerformingPowerOff(true);
      setPerformingPowerOn(false);
    }
  };

  const handleShowPopup = (mode: PopupDisplayMode) => () => {
    // console.log('Device::handleShowPopup', { mode, deviceId });

    setPopupDisplayMode(mode);
  };

  const handleEndedPowerOps = () => {
    if (isPerformingPowerOn && devicePowerState === 'on') {
      setPerformingPowerOn(false);
    }
    if (isPerformingPowerOff && devicePowerState === 'off') {
      setPerformingPowerOff(false);
    }  
  }

  handleEndedPowerOps();

  // console.log('Device::render', { diagsQueryData, statsQueryData });

  const menuItems: DropDownMenuItem[] = [{
    label: 'Details',
    clickHandler: handleShowPopup('details') ,
    linkHref: '#',
  }, {
    label: 'Logs',
    clickHandler: handleShowPopup('logs') ,
    linkHref: '#',
  }];

  const diagItems: DiagItemsProps['items'] = [{
    type: DiagItemType.HTTP,
    status: diagsQueryData?.http.status || STATUS_UNAVAIL,
    data: diagsQueryData?.http.data,
  }, {
    type: DiagItemType.SSH,
    status: diagsQueryData?.ssh.status || STATUS_UNAVAIL,
  }, {
    type: DiagItemType.PING,
    status: diagsQueryData?.ping.status || STATUS_UNAVAIL,
  }];

  return (
    <>
      <Card key={deviceId}>
        <CardContent justifyItems>
          <PowerItemButton
            isPerformingPowerOperation={isPerformingPowerOn || isPerformingPowerOff}
            onPowerAction={handlePowerClick}
            devicePowerState={devicePowerState}
          />
          {deviceInfo.network.hostname} ({deviceId})
        </CardContent>
        <CardContent alignment="right">
          <DiagItems items={diagItems} />
        </CardContent>
        <CardContent>
          <UptimeItem deviceUptimeStats={statsQueryData?.uptimeSeconds} />
        </CardContent>
        <CardContent alignment='right'>
          <FetchStatus isFetchingDiags={isFetchingDiags} isFetchingStats={isFetchingStats} />
        </CardContent>
        <CardContent>
          <DropDownMenu items={menuItems} />
        </CardContent>
      </Card>
      <Popup isShown={popupDisplayMode !== 'none'}>
        {popupDisplayMode === 'details' && (
          <>Details</>
        )}
        {popupDisplayMode === 'logs' && (
          <>Logs</>
        )}
      </Popup>
    </>
  );
}

export default Device;
