import React from 'react';

type PageContainerProps = React.PropsWithChildren;

const PageContainer = ({ children }: PageContainerProps) => (
    <div className="page-container">
        {children}
    </div> 
);

export default PageContainer;
