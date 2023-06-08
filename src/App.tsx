import HomePage from './pages/Home.tsx';
import AddressPage from  './pages/AddressPage.tsx';

function App() {

  return (
    <main className="absolute top-0 left-0 w-full min-h-full bg-gray-100 dark:bg-gray-900"> 
        {window.location.search.includes('?address=')? <AddressPage/> : <HomePage /> }
      </main>
  )
};

export default App;

