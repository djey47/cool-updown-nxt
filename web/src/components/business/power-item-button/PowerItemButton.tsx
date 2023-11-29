import { IoPowerSharp } from 'react-icons/io5';
import Button from '../../atoms/button/Button';
import classNames from 'classnames';

import { PowerState } from '../../../model/device';

interface PowerItemButtonProps {
  devicePowerState: PowerState;
  onPowerAction: () => void;
  isPerformingPowerOperation: boolean;
}

const PowerItemButton = ({ onPowerAction, isPerformingPowerOperation, devicePowerState }: PowerItemButtonProps) => {
  const devicePowerClassNames = classNames(
    'device-power-cta',
    'text-xl',
    {
      'is-on': devicePowerState === 'on',
      'is-off': devicePowerState === 'off',
      'is-na': devicePowerState === 'n/a',
      'text-indigo-900': devicePowerState === 'n/a',
      'animate-pulse': isPerformingPowerOperation,
    });

  return (
    <Button onClick={onPowerAction}>
      <IoPowerSharp className={devicePowerClassNames} />
    </Button>
  );
}

export default PowerItemButton;
