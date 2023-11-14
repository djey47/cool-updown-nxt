import classNames from 'classnames';
import { PropsWithChildren } from 'react';

interface CardContentProps extends PropsWithChildren {
  className?: string;
}

const CardContent = ({ className, children }: CardContentProps) => {
  const completeClassNames = classNames(
    className,
    'flex',
    'justify-between',
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
