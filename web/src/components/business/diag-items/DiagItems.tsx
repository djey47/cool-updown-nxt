import DiagItem from '../diag-item/DiagItem';

import type { FeatureData, FeatureStatus } from '../../../model/device';
import { DiagItemType } from '../../../model/diagnostics';

export interface DiagItemsProps {
  items: {
    type: DiagItemType;
    status: FeatureStatus;
    data?: FeatureData;
  }[];
}

const DiagItems = ({ items }: DiagItemsProps) => {
  return (
    <>
      {items.map(({ status, type, data }) => (
        <DiagItem key={type} type={type} status={status} data={data} />
      ))}
    </>
  );
};

export default DiagItems;
