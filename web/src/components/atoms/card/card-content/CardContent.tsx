import classNames from 'classnames';
import { PropsWithChildren } from 'react';

interface CardContentProps extends PropsWithChildren {
  className?: string;
  alignment?: 'left' | 'right';
  justifyItems?: boolean;
}

const CardContent = ({ justifyItems, alignment, className, children }: CardContentProps) => {
  const completeClassNames = classNames(
    className,
    'flex',
    { 'flex-row-reverse': alignment === 'right' },
    { 'justify-between': justifyItems },
    'items-center',
    'gap-2'
  );
  return (
    <div className={completeClassNames}>
      {children}
    </div>
  );
};

export default CardContent;
