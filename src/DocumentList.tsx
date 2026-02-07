import React, { FC } from 'react';
import './DocumentList.css';

export const DocumentList: FC = () => {
  return (
    <div className="document-list">
      <h2>Список документов</h2>
      <p className="empty-state">
        📄 Документы будут отображаться здесь
      </p>
    </div>
  );
};
