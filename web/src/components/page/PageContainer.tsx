import React from 'react';

type PageContainerProps = React.PropsWithChildren;

const PageContainer = ({ children }: PageContainerProps) => (
  <div className="page-container flex w-full h-screen bg-gradient-to-br from-indigo-900 via-indigo-800 to-black p-2 text-white">
    <div className="overflow-auto flex flex-col gap-4">
      {children}
    </div>
  </div>
);

export default PageContainer;
