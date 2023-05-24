import React from 'react';
import Navigation from './navigation';

const Layout = ({ children }: any) => {
  return(
    <div>
      <Navigation />
      <div style={{marginTop: '64px'}}>
        {children}
      </div>
    </div>
  )
}
export default Layout;
