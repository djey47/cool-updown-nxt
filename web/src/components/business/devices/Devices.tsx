import { useQuery } from '@tanstack/react-query';
import { getConfiguration } from '../../../api/configuration';
import Device from '../device/Device';

const Devices = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['config'],
    queryFn: getConfiguration,
    select: (config) => config.devices,
  });  

  return (
    <div className="relative flex flex-wrap gap-4 justify-center md:justify-start">
      {isLoading && (
        <p>Retrieving configured devices, one moment please...</p>
      )}
      {data?.map((deviceInfo) => (
        <Device deviceInfo={deviceInfo} key={deviceInfo.id} />
      ))}
    </div>
  );
};

export default Devices;
