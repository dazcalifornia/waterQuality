import { DatabaseIcon, HomeIcon, LocationIcon } from '@primer/octicons-react';
import {
  TabNav,
} from '@primer/react'


const Nav = () => {
  return (
    <TabNav aria-label="Main">
      <TabNav.Link href="#home" selected>
        <HomeIcon />
        <span className="ml-2">Home</span>
      </TabNav.Link>
      <TabNav.Link href="#documentation">
        <DatabaseIcon />
        <span className="ml-2">Data insights</span>
      </TabNav.Link>
      <TabNav.Link href="#map">
        <LocationIcon />
        <span className="ml-2">Data Location</span>
      </TabNav.Link>
    </TabNav>
  );
}
export default Nav
