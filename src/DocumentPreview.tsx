import React, { FC } from 'react';
import './DocumentPreview.css';

interface DocumentPreviewProps {
  data: any;
}

export const DocumentPreview: FC<DocumentPreviewProps> = ({ data }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Placeholder for PDF generation/download logic
    alert('Функция загрузки будет реализована');
  };

  const handleSave = () => {
    // Placeholder for save logic
    alert('Документ сохранен');
  };

  return (
    <div className="document-preview">
      <div className="preview-toolbar">
        <button onClick={handlePrint} className="btn btn-primary">
          🖨️ Печать
        </button>
        <button onClick={handleDownload} className="btn btn-primary">
          ⬇️ Скачать PDF
        </button>
        <button onClick={handleSave} className="btn btn-success">
          💾 Сохранить
        </button>
      </div>

      <div className="document-container">
        <div className="document-content">
          <h1>ДОСУДЕБНАЯ ПРЕТЕНЗИЯ</h1>

          <section className="preview-section">
            <h2>Заявитель</h2>
            <p>
              <strong>ФИО/Название организации:</strong> {data?.applicant?.fullName}
            </p>
            <p>
              <strong>ИНН:</strong> {data?.applicant?.inn || '—'}
            </p>
            <p>
              <strong>ОГРН:</strong> {data?.applicant?.ogrn || '—'}
            </p>
            <p>
              <strong>Адрес:</strong>{' '}
              {data?.applicant?.address?.postalCode && `${data.applicant.address.postalCode}, `}
              {data?.applicant?.address?.region && `${data.applicant.address.region}, `}
              {data?.applicant?.address?.city && `${data.applicant.address.city}, `}
              {data?.applicant?.address?.street && `${data.applicant.address.street}, `}
              {data?.applicant?.address?.building && `д. ${data.applicant.address.building}`}
              {data?.applicant?.address?.office && `, оф. ${data.applicant.address.office}`}
            </p>
            <p>
              <strong>Телефон:</strong> {data?.applicant?.phone || '—'}
            </p>
            <p>
              <strong>Email:</strong> {data?.applicant?.email || '—'}
            </p>
          </section>

          <section className="preview-section">
            <h2>Ответчик</h2>
            <p>
              <strong>Название организации:</strong> {data?.defendant?.companyName}
            </p>
            <p>
              <strong>ИНН:</strong> {data?.defendant?.inn || '—'}
            </p>
            <p>
              <strong>ОГРН:</strong> {data?.defendant?.ogrn || '—'}
            </p>
            <p>
              <strong>Адрес:</strong>{' '}
              {data?.defendant?.address?.postalCode && `${data.defendant.address.postalCode}, `}
              {data?.defendant?.address?.region && `${data.defendant.address.region}, `}
              {data?.defendant?.address?.city && `${data.defendant.address.city}, `}
              {data?.defendant?.address?.street && `${data.defendant.address.street}, `}
              {data?.defendant?.address?.building && `д. ${data.defendant.address.building}`}
              {data?.defendant?.address?.office && `, оф. ${data.defendant.address.office}`}
            </p>
            <p>
              <strong>Телефон:</strong> {data?.defendant?.phone || '—'}
            </p>
            <p>
              <strong>Email:</strong> {data?.defendant?.email || '—'}
            </p>
          </section>

          <section className="preview-section">
            <h2>Содержание претензии</h2>
            <p>
              <strong>Номер контракта:</strong> {data?.claim?.contractNumber}
            </p>
            <p>
              <strong>Дата контракта:</strong> {data?.claim?.contractDate}
            </p>
            <p>
              <strong>Сумма требования:</strong> {data?.claim?.amount} руб.
            </p>
            {data?.claim?.penalty && (
              <p>
                <strong>Штраф/Пеня:</strong> {data.claim.penalty} руб.
              </p>
            )}
            <p>
              <strong>Описание претензии:</strong>
            </p>
            <div className="description-box">
              {data?.claim?.description}
            </div>
            <p>
              <strong>Требования:</strong>
            </p>
            <div className="description-box">
              {data?.claim?.demands}
            </div>
            <p>
              <strong>Срок ответа:</strong> {data?.claim?.deadline || 10} дней
            </p>
          </section>

          <section className="preview-section">
            <p className="footer-note">
              Документ создан с использованием системы генерации досудебных претензий.
              Дата создания: {new Date().toLocaleDateString('ru-RU')}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
