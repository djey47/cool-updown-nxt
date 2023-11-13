import PageContainer from './components/page/PageContainer';
import Dashboard from './components/page/Dashboard';
import Banner from './components/molecules/banner/Banner';

const App = () => {
  return (
    <PageContainer>
      <Banner />
      <Dashboard />
    </PageContainer>
  )
};

export default App;
