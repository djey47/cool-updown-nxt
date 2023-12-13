import { MdHttp, MdNetworkPing, MdTerminal } from 'react-icons/md';

import { DiagItemType } from '../../../model/diagnostics';
import type { FeatureData, FeatureStatus } from '../../../model/device';
import classNames from 'classnames';

interface DiagItemProps {
  className?: string;
  type: DiagItemType;
  data?: FeatureData;
  status: FeatureStatus;
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
};

const DiagItem = ({ className, data, status, type }: DiagItemProps) => {
  const itemConfig = DIAG_ITEMS[type];

  const getFeatureClassNames = (featureStatus: FeatureStatus) => {
    return classNames(
      className,
      'device-ping-status',
      'text-lg',
      {
        'is-ok': featureStatus === 'ok',
        'is-ko': featureStatus === 'ko',
        'is-na': featureStatus === 'n/a',
        'text-indigo-900': featureStatus === 'n/a',
      });
  }; 

  const customClassName = getFeatureClassNames(status);

  return (
    <>
      {data && type === DiagItemType.HTTP && (
        <a href={data.url} target="_blank">
          <itemConfig.Icon className={customClassName} />
        </a>
      )}
      {!data && (
        <itemConfig.Icon className={customClassName} />
      )}
    </>
  );
};

export default DiagItem;
