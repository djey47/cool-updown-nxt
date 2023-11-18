import { MdNetworkPing, MdTerminal } from 'react-icons/md';
import { DiagItemType } from '../../../model/diagnostics';

interface DiagItemProps {
  className?: string;
  type: DiagItemType;
}

const DIAG_ITEMS = {
  PING: {
    Icon: MdNetworkPing,
    label: 'ICMP ping',
  },
  SSH: {
    Icon: MdTerminal,
    label: 'SSH connectivity',
  },
}

const DiagItem = ({ className, type }: DiagItemProps) => {
  const itemConfig = DIAG_ITEMS[type];
  return (
    <itemConfig.Icon className={className} />
  );
}

export default DiagItem;
