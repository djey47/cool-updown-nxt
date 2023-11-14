import { PropsWithChildren } from 'react';

interface PopupProps extends PropsWithChildren {
  isShown?: boolean;
}

const Popup = ({ isShown, children }: PopupProps) => {
  return (
    <>
      {isShown && (
        <div className="absolute p-2 top-full left-0 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-indigo-300/50">
          {children}
        </div>
      )}
    </>
  );
}

export default Popup;