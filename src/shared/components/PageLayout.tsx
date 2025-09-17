import { useState } from 'react';
import { AppHeader } from './AppHeader';
import { AppFooter } from './AppFooter';
import { ConfirmModal } from './ConfirmModal';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  onNavigateToSecret: () => void;
}

export function PageLayout({ children, className = '', onNavigateToSecret }: PageLayoutProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSecretButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleModalConfirm = () => {
    setIsModalOpen(false);
    onNavigateToSecret();
  };

  return (
    <div className={`min-h-screen flex flex-col bg-gray-50 ${className}`}>
      <AppHeader />
      
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {children}
        </div>
      </main>
      
      <AppFooter onSecretButtonClick={handleSecretButtonClick} />
      
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
      />
    </div>
  );
}