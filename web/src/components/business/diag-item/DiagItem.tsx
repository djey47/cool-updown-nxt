import { MdHttp, MdNetworkPing, MdTerminal } from 'react-icons/md';
import { DiagItemType } from '../../../model/diagnostics';
import { FeatureData } from '../../../model/device';

interface DiagItemProps {
  className?: string;
  type: DiagItemType;
  data?: FeatureData;
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
  HTTP: {
    Icon: MdHttp,
    label: 'HTTP server',
  },
}

const DiagItem = ({ className, data, type }: DiagItemProps) => {
  const itemConfig = DIAG_ITEMS[type];
  return (
    <>
      {type === DiagItemType.HTTP && data && (
        <a href={data.url} target="_blank">
          <itemConfig.Icon className={className} />
        </a>
      )}
      {type !== DiagItemType.HTTP && (
        <itemConfig.Icon className={className} />
      )}
    </>
  );
}

export default DiagItem;
