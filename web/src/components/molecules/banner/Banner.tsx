import { IoSettings } from 'react-icons/io5';
import Button from '../../atoms/button/Button';
import Divider from '../../atoms/divider/Divider';

const Banner = () => (
  <div className="flex justify-between bg-indigo-950 p-2 drop-shadow rounded text-white">
    <div className="flex justify-between gap-2 items-center">
      <span className="text-xl">
        COOL-UPDOWN-NXT
      </span>
      <Divider direction="vertical" />
      <Button className="text-l">Dashboard</Button>
      <Button className="text-l">Logs</Button>
      <Divider direction="vertical" />
      <Button>
        <IoSettings />
      </Button>
    </div>
  </div>
);

export default Banner;
