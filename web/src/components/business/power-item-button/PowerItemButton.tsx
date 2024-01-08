import { IoPowerSharp } from 'react-icons/io5';
import Button from '../../atoms/button/Button';
import classNames from 'classnames';

import { PowerState } from '../../../model/device';

interface PowerItemButtonProps {
  devicePowerState: PowerState;
  onPowerAction: () => void;
  isPerformingPowerOperation: boolean;
  isClickable?: boolean;
}

const PowerItemButton = ({ onPowerAction, isPerformingPowerOperation, devicePowerState, isClickable = true }: PowerItemButtonProps) => {
  const handlePowerAction = () => {
    if (isClickable) {
      onPowerAction();
    }
  };

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
    <Button onClick={handlePowerAction} isClickable={isClickable}>
      <IoPowerSharp className={devicePowerClassNames} />
    </Button>
  );
};

export default PowerItemButton;
