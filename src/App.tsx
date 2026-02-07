// App.jsx
import React, { useState, useEffect } from 'react';
import { ClaimForm } from './ClaimForm';
import { DocumentPreview } from './DocumentPreview';
import { DocumentList } from './DocumentList';
import './App.css';
import CookiesDisclaimer from './CookiesDisclaimer';

const App = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [previewData, setPreviewData] = useState(null);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  useEffect(() => {
    try {
      const flag = localStorage.getItem('preclaim_disclaimer_shown');
      if (!flag) setShowDisclaimer(true);
    } catch (e) {
      // ignore storage errors
      setShowDisclaimer(true);
    }
  }, []);

  const handleDisclaimerAccept = () => {
    try {
      localStorage.setItem('preclaim_disclaimer_shown', '1');
    } catch (e) {
      // ignore
    }
    setShowDisclaimer(false);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>📄 Генератор досудебных претензий</h1>
        <nav className="nav-tabs">
          <button 
            className={activeTab === 'create' ? 'active' : ''}
            onClick={() => setActiveTab('create')}
          >
            Создать претензию
          </button>
          <button 
            className={activeTab === 'list' ? 'active' : ''}
            onClick={() => setActiveTab('list')}
          >
            Список документов
          </button>
          {previewData && (
            <button 
              className={activeTab === 'preview' ? 'active' : ''}
              onClick={() => setActiveTab('preview')}
            >
              Предпросмотр
            </button>
          )}
        </nav>
      </header>

      <main className="app-main">
        {activeTab === 'create' && (
          <ClaimForm 
            onPreview={(data) => {
              setPreviewData(data);
              setActiveTab('preview');
            }}
          />
        )}
        {activeTab === 'list' && <DocumentList />}
        {activeTab === 'preview' && previewData && (
          <DocumentPreview data={previewData} />
        )}
      </main>
      <CookiesDisclaimer visible={showDisclaimer} onAccept={handleDisclaimerAccept} />
    </div>
  );
};

export default App;
