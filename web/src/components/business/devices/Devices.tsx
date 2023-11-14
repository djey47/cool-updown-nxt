import { useQuery } from '@tanstack/react-query';
import { getConfiguration } from '../../../api/configuration';
import Device from '../device/Device';

const Devices = () => {
  const devicesQuery = useQuery({
    queryKey: ['config'],
    queryFn: getConfiguration,
    select: (config) => config.devices,
  });  

  return (
    <div className="relative flex flex-wrap gap-4 justify-center md:justify-start">
      {devicesQuery.isLoading && (
        <p>Getting configured devices, one moment please...</p>
      )}
      {devicesQuery.data?.map((device) => (
        <Device deviceInfo={device} key={device.id} />
      ))}
    </div>
  );
}

export default Devices;
