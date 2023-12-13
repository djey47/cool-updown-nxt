import { useState } from 'react';
import { IoEllipsisVerticalSharp } from 'react-icons/io5';
import Button from '../button/Button';

export interface DropDownMenuItem {
  label: string;
  linkHref?: string;
  clickHandler: () => void;
}

interface DropDownMenuProps {
  items: DropDownMenuItem[];
}

const DropDownMenu = ({ items }: DropDownMenuProps) => {
  const [isDropDownMenuVisible, setDropDownMenuVisible] = useState(false);

  const handleDeviceDropDownClick = () => {
    setDropDownMenuVisible(!isDropDownMenuVisible);
  };

  const handleMenuAction = (clickHandler: () => void) => () => {
    setDropDownMenuVisible(false);
    clickHandler();
  };

  return (
    <div className="dropdown-menu relative">
      <Button data-dropdown-toggle="deviceDropDownMenu" onClick={handleDeviceDropDownClick}>
        <IoEllipsisVerticalSharp />
      </Button>
      {isDropDownMenuVisible && (
      <div className="absolute top-0 left-full bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-indigo-300/75">
        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="deviceDropdownCta">
          {items.map((mi) => (
            <li key={mi.label}>
              <a href={mi.linkHref} onClick={handleMenuAction(mi.clickHandler)} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-indigo-900 dark:hover:text-white cursor-pointer">{mi.label}</a>
            </li>
          ))}
        </ul>
      </div>
      )}
    </div>
  );
};

export default DropDownMenu;