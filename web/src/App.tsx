import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PageContainer from './components/page/PageContainer';
import Dashboard from './components/page/Dashboard';
import Banner from './components/molecules/banner/Banner';

// Create a react-query client
const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <PageContainer>
        <Banner />
        <Dashboard />
      </PageContainer>
    </QueryClientProvider>
  )
};

export default App;
