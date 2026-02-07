// components/ClaimForm.jsx
import React, { useState, FC, FormEvent } from 'react';
import './ClaimForm.css';

interface ApiService {
  generateClaim: (data: any) => Promise<any>;
  saveDraft: (data: any) => Promise<any>;
  getTemplate: (id: string) => Promise<any>;
}

// Mock apiService - replace with actual implementation
const apiService: ApiService = {
  generateClaim: async (data) => ({ data }),
  saveDraft: async (data) => ({ data }),
  getTemplate: async (id) => ({ data: {} })
};

interface ClaimFormProps {
  onPreview: (data: any) => void;
}

export const ClaimForm: FC<ClaimFormProps> = ({ onPreview }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    // Данные истца (объединенное поле)
    claimantData: '',
    
    // Данные ответчика (объединенное поле)
    respondentData: '',
    
    // Суть претензии (объединенное поле)
    claimEssence: '',
    
    // Дополнительные данные
    contractNumber: '',
    contractDate: '',
    amount: '',
    penalty: '',
    deadline: 10
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Очищаем ошибку при изменении поля
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Валидация данных истца
    if (!formData.claimantData.trim()) {
      newErrors['claimantData'] = 'Укажите данные истца';
    }
    
    // Валидация данных ответчика
    if (!formData.respondentData.trim()) {
      newErrors['respondentData'] = 'Укажите данные ответчика';
    }
    
    // Валидация сути претензии
    if (!formData.claimEssence.trim()) {
      newErrors['claimEssence'] = 'Укажите суть претензии';
    }
    
    // Валидация суммы
    if (!formData.amount) {
      newErrors['amount'] = 'Укажите сумму претензии';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }
    
    setLoading(true);
    try {
      const response = await apiService.generateClaim(formData);
      onPreview(response.data);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error generating claim:', error);
      alert('Ошибка при генерации документа: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    try {
      await apiService.saveDraft(formData);
      alert('Черновик сохранен');
    } catch (error) {
      alert('Ошибка сохранения черновика');
    }
  };

  

  return (
    <form className="claim-form" onSubmit={handleSubmit}>
      {/* Раздел: Данные истца */}
      <section className="form-section">
        <h2>👤 Данные истца</h2>
        
        <div className="form-group">
          <label>Данные истца *</label>
          <textarea
            value={formData.claimantData}
            onChange={(e) => handleInputChange('claimantData', e.target.value)}
            placeholder="ФИО/Название организации, ИНН, ОГРН, адрес (индекс, регион, город, улица, дом), телефон, email"
            className={errors['claimantData'] ? 'error' : ''}
            rows={6}
          />
          {errors['claimantData'] && (
            <span className="error-message">{errors['claimantData']}</span>
          )}
        </div>
      </section>

      {/* Раздел: Данные ответчика */}
      <section className="form-section">
        <h2>🏢 Данные ответчика</h2>
        
        <div className="form-group">
          <label>Данные ответчика *</label>
          <textarea
            value={formData.respondentData}
            onChange={(e) => handleInputChange('respondentData', e.target.value)}
            placeholder="Название организации, ИНН, ОГРН, адрес (индекс, регион, город, улица, дом), телефон, email"
            className={errors['respondentData'] ? 'error' : ''}
            rows={6}
          />
          {errors['respondentData'] && (
            <span className="error-message">{errors['respondentData']}</span>
          )}
        </div>
      </section>

      {/* Раздел: Содержание претензии */}
      <section className="form-section">
        <h2>📋 Содержание претензии</h2>
        
        <div className="form-row">
          <div className="form-group">
            <label>Номер контракта</label>
            <input
              type="text"
              value={formData.contractNumber}
              onChange={(e) => handleInputChange('contractNumber', e.target.value)}
              placeholder="№ 2024-001"
            />
          </div>
          <div className="form-group">
            <label>Дата контракта</label>
            <input
              type="date"
              value={formData.contractDate}
              onChange={(e) => handleInputChange('contractDate', e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Суть претензии *</label>
          <textarea
            value={formData.claimEssence}
            onChange={(e) => handleInputChange('claimEssence', e.target.value)}
            placeholder="Подробно опишите суть претензии, факты нарушения, требования, обстоятельства и другую информацию о претензии..."
            className={errors['claimEssence'] ? 'error' : ''}
            rows={8}
          />
          {errors['claimEssence'] && (
            <span className="error-message">{errors['claimEssence']}</span>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Сумма претензии (руб.) *</label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
              placeholder="50000"
              className={errors['amount'] ? 'error' : ''}
            />
            {errors['amount'] && (
              <span className="error-message">{errors['amount']}</span>
            )}
          </div>
          <div className="form-group">
            <label>Штраф/Пеня (руб.)</label>
            <input
              type="number"
              value={formData.penalty}
              onChange={(e) => handleInputChange('penalty', e.target.value)}
              placeholder="0"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Срок ответа (дней)</label>
          <input
            type="number"
            value={formData.deadline}
            onChange={(e) => handleInputChange('deadline', e.target.value)}
            placeholder="10"
            min="1"
            max="60"
          />
        </div>
      </section>

      {/* Кнопки действия */}
      <div className="form-actions">
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? '⏳ Генерация...' : '📄 Сгенерировать претензию'}
        </button>
        <button 
          type="button" 
          className="btn btn-secondary"
          onClick={handleSaveDraft}
          disabled={loading}
        >
          💾 Сохранить черновик
        </button>
      </div>
    </form>
  );
};
