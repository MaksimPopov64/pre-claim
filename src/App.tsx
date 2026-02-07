// App.jsx
import React, { useState } from 'react';
import { ClaimForm } from './ClaimForm';
import { DocumentPreview } from './DocumentPreview';
import { DocumentList } from './DocumentList';
import './App.css';

const App = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [previewData, setPreviewData] = useState(null);

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
    </div>
  );
};

export default App;
