import { useEffect, useState } from 'react';
import { getConfiguration } from '../../../api/configuration';
import Device from '../device/Device';

import type { DeviceInfo } from '../../../model/device';

const Devices = () => {
  const [devices, setDevices] = useState<DeviceInfo[]>([]);

  useEffect(() => {
    const getConfig = async () => {
      const fetchedConf = await getConfiguration();
      setDevices(fetchedConf.devices);
    }
    getConfig();
  }, []);

  return (
    <div className="flex flex-wrap gap-4 justify-center md:justify-start">
      {devices.map((device) => (
        <Device deviceInfo={device} key={device.id} />
      ))}
    </div>
  );
}

export default Devices;
