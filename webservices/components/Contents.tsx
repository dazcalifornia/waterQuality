import Home from '../pages/contents/home'
import DataInsights from '../pages/contents/datainsight'
import Map from '../pages/contents/map'
interface ContentsProps {
  selectedTab: string;
}

const Contents = ({ selectedTab }: ContentsProps) => {
  switch (selectedTab) {
    case 'home':
      return <Home />;
    case 'datainsights':
      return <DataInsights />;
    case 'map':
      return <Map />;
    default:
      return <Home />;
  }
};
export default Contents;
