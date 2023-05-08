import Home from '../pages/contents/home'
import DataInsights from '../pages/contents/datainsight'
import Map from '../pages/contents/map'
interface ContentsProps {
  selectedTab: string;
}

const Contents = ({ selectedTab }: ContentsProps) => {
  switch (selectedTab) {
    case 'Dashboard':
      return <Home />;
    case 'Forecast':
      return <DataInsights />;
    case 'Map':
      return <Map />;
    default:
      return <Home />;
  }
};
export default Contents;
