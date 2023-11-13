import { PropsWithChildren } from 'react';

interface CardContentProps extends PropsWithChildren {}

const CardContent = ({ children }: CardContentProps) => {
  return (
    <div className="flex justify-between items-center gap-2">
      {children}
    </div>
  );
};

export default CardContent;
