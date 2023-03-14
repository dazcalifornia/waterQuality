import { DatabaseIcon, HomeIcon, LocationIcon } from '@primer/octicons-react';
import {
  TabNav,
} from '@primer/react'
import {useState} from 'react'

interface Navprops{
  setSelectedTab: (tab: string)=> void 
  selectedTab:string
}

const Nav = ({setSelectedTab,selectedTab}:Navprops) => {
  return (
    <TabNav aria-label="Main">
      <TabNav.Link href="#home"
        selected={selectedTab === 'home'}
        onClick={() => setSelectedTab('home')}
        >
        <HomeIcon />
        <span className="ml-2">Home</span>
      </TabNav.Link>
      <TabNav.Link href="#datainsights"
        selected={selectedTab === 'datainsights'}
        onClick={() => setSelectedTab('datainsights')}
      >
        <DatabaseIcon />
        <span className="ml-2">Data insights</span>
      </TabNav.Link>
      <TabNav.Link href="#map"
        selected={selectedTab === 'map'}
        onClick={() => setSelectedTab('map')}
      >
        <LocationIcon />
        <span className="ml-2">Data Location</span>
      </TabNav.Link>
    </TabNav>
  );
}
export default Nav
