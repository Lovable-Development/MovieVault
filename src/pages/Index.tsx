import { useState } from 'react';
import { Header } from '@/components/Header';
import { HomePage } from './HomePage';
import { SearchPage } from './SearchPage';
import { CollectionsPage } from './CollectionsPage';

type Page = 'home' | 'search' | 'collections';

const Index = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleItemAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handlePageChange = (page: Page) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onItemAdded={handleItemAdded}
      />
      
      {currentPage === 'home' && (
        <HomePage 
          onPageChange={handlePageChange}
          refreshTrigger={refreshTrigger}
        />
      )}
      
      {currentPage === 'search' && (
        <SearchPage onItemAdded={handleItemAdded} />
      )}
      
      {currentPage === 'collections' && (
        <CollectionsPage />
      )}
    </div>
  );
};

export default Index;
