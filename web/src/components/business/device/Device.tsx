import { useEffect, useState } from 'react';
import { IoPowerSharp } from 'react-icons/io5';
import { MdNetworkPing } from 'react-icons/md';
import classNames from 'classnames';
import Button from '../../atoms/button/Button';
import Card from '../../atoms/card/Card';
import CardContent from '../../atoms/card/card-content/CardContent';
import { getDiagnosticsForDevice } from '../../../api/diagnostics';
import { postPowerOnForDevice } from '../../../api/power';

import type { DeviceDiagnostics, DeviceInfo } from '../../../model/device';

import './Device.css';

interface DeviceProps {
  deviceInfo: DeviceInfo;
}

const Device = ({ deviceInfo }: DeviceProps) => {
  const [diags, setDiags] = useState<DeviceDiagnostics>();

  useEffect(() => {
    const getDiags = async (deviceId: string) => {
      const diagsResponse = await getDiagnosticsForDevice(deviceId);
      setDiags(diagsResponse);
    };
    getDiags(deviceInfo.id);
  }, [deviceInfo.id]);

  const handlePowerClick = async () => {
    await postPowerOnForDevice(deviceInfo.id);
  };

  const devicePowerState = diags?.power?.state || 'n/a';
  const devicePowerClassNames = classNames(
    'device-power-cta',
    {
      'is-on': devicePowerState === 'on',
      'is-off': devicePowerState === 'off',
      'is-na': devicePowerState === 'n/a'
    });

  const devicePingStatus = diags?.ping?.status || 'n/a';
  const devicePingClassNames = classNames(
    'device-ping-status',
    {
      'is-ok': devicePingStatus === 'ok',
      'is-ko': devicePingStatus === 'ko',
      'is-na': devicePingStatus === 'n/a'
    });

  console.log('Device::render', { diags });

  return (
    <Card key={deviceInfo.id}>
      <CardContent>
        <Button onClick={handlePowerClick}>
          <IoPowerSharp className={devicePowerClassNames} />
        </Button>
        {deviceInfo.network.hostname} ({deviceInfo.id})
      </CardContent>
      <CardContent>
        <MdNetworkPing className={devicePingClassNames} />
      </CardContent>
    </Card>
  );
}

export default Device;
