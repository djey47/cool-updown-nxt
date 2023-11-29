import classNames from 'classnames';
import { MdDownloading } from 'react-icons/md';

interface FetchStatusProps {
  isFetchingDiags: boolean;
  isFetchingStats: boolean;
}

const FetchStatus = ({ isFetchingDiags, isFetchingStats }: FetchStatusProps) => {
  const fetchStatusClassName = classNames({
    'text-white': isFetchingDiags || isFetchingStats,
    'text-indigo-900': !isFetchingDiags && !isFetchingStats,
  });

  return (
    <MdDownloading className={fetchStatusClassName} />
  )
};

export default FetchStatus;
