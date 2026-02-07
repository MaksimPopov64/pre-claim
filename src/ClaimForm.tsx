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
    // Данные заявителя
    applicant: {
      type: 'individual', // individual | legal
      fullName: '',
      inn: '',
      ogrn: '',
      address: {
        postalCode: '',
        region: '',
        city: '',
        street: '',
        building: '',
        office: ''
      },
      phone: '',
      email: '',
      bankDetails: {
        bankName: '',
        bik: '',
        correspondentAccount: '',
        settlementAccount: ''
      }
    },
    
    // Данные ответчика
    defendant: {
      type: 'legal',
      companyName: '',
      inn: '',
      ogrn: '',
      address: {
        postalCode: '',
        region: '',
        city: '',
        street: '',
        building: '',
        office: ''
      },
      phone: '',
      email: ''
    },
    
    // Данные претензии
    claim: {
      contractNumber: '',
      contractDate: '',
      amount: '',
      penalty: '',
      description: '',
      demands: '',
      deadline: 10, // дней на ответ
      attachments: []
    }
  });

  const handleInputChange = (section: string, field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section as keyof typeof prev],
          [parent]: {
            ...(prev[section as keyof typeof prev] as any)[parent],
            [child]: value
          }
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section as keyof typeof prev],
          [field]: value
        }
      }));
    }
    
    // Очищаем ошибку при изменении поля
    if (errors[`${section}.${field}`]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`${section}.${field}`];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Валидация заявителя
    if (!formData.applicant.fullName && formData.applicant.type === 'individual') {
      newErrors['applicant.fullName'] = 'Укажите ФИО';
    }
    if (!formData.applicant.address.city) {
      newErrors['applicant.address.city'] = 'Укажите город';
    }
    if (!formData.applicant.phone && !formData.applicant.email) {
      newErrors['applicant.contact'] = 'Укажите хотя бы один способ связи';
    }
    
    // Валидация ответчика
    if (!formData.defendant.companyName) {
      newErrors['defendant.companyName'] = 'Укажите название организации';
    }
    if (!formData.defendant.inn) {
      newErrors['defendant.inn'] = 'Укажите ИНН';
    }
    if (!formData.defendant.address.city) {
      newErrors['defendant.address.city'] = 'Укажите город ответчика';
    }
    
    // Валидация претензии
    if (!formData.claim.description) {
      newErrors['claim.description'] = 'Опишите суть претензии';
    }
    if (!formData.claim.demands) {
      newErrors['claim.demands'] = 'Укажите требования';
    }
    if (!formData.claim.amount) {
      newErrors['claim.amount'] = 'Укажите сумму претензии';
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
      {/* Раздел: Данные заявителя */}
      <section className="form-section">
        <h2>👤 Данные заявителя</h2>
        
        <div className="form-group">
          <label>Тип заявителя</label>
          <select 
            value={formData.applicant.type}
            onChange={(e) => handleInputChange('applicant', 'type', e.target.value)}
          >
            <option value="individual">Физическое лицо</option>
            <option value="legal">Юридическое лицо</option>
          </select>
        </div>

        {formData.applicant.type === 'individual' ? (
          <div className="form-group">
            <label>ФИО *</label>
            <input
              type="text"
              value={formData.applicant.fullName}
              onChange={(e) => handleInputChange('applicant', 'fullName', e.target.value)}
              placeholder="Иванов Иван Иванович"
              className={errors['applicant.fullName'] ? 'error' : ''}
            />
            {errors['applicant.fullName'] && (
              <span className="error-message">{errors['applicant.fullName']}</span>
            )}
          </div>
        ) : (
          <>
            <div className="form-group">
              <label>Название организации *</label>
              <input
                type="text"
                value={formData.applicant.fullName}
                onChange={(e) => handleInputChange('applicant', 'fullName', e.target.value)}
                placeholder="ООО «Компания»"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>ИНН</label>
                <input
                  type="text"
                  value={formData.applicant.inn}
                  onChange={(e) => handleInputChange('applicant', 'inn', e.target.value)}
                  placeholder="1234567890"
                  maxLength={12}
                />
              </div>
              <div className="form-group">
                <label>ОГРН</label>
                <input
                  type="text"
                  value={formData.applicant.ogrn}
                  onChange={(e) => handleInputChange('applicant', 'ogrn', e.target.value)}
                  placeholder="1234567890123"
                  maxLength={13}
                />
              </div>
            </div>
          </>
        )}

        <h3>📍 Адрес заявителя</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Индекс</label>
            <input
              type="text"
              value={formData.applicant.address.postalCode}
              onChange={(e) => handleInputChange('applicant', 'address.postalCode', e.target.value)}
              placeholder="123456"
              maxLength={6}
            />
          </div>
          <div className="form-group">
            <label>Регион/Область</label>
            <input
              type="text"
              value={formData.applicant.address.region}
              onChange={(e) => handleInputChange('applicant', 'address.region', e.target.value)}
              placeholder="Московская область"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group flex-2">
            <label>Город *</label>
            <input
              type="text"
              value={formData.applicant.address.city}
              onChange={(e) => handleInputChange('applicant', 'address.city', e.target.value)}
              placeholder="Москва"
              className={errors['applicant.address.city'] ? 'error' : ''}
            />
          </div>
          <div className="form-group flex-3">
            <label>Улица</label>
            <input
              type="text"
              value={formData.applicant.address.street}
              onChange={(e) => handleInputChange('applicant', 'address.street', e.target.value)}
              placeholder="ул. Ленина"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Дом/Строение</label>
            <input
              type="text"
              value={formData.applicant.address.building}
              onChange={(e) => handleInputChange('applicant', 'address.building', e.target.value)}
              placeholder="д. 1"
            />
          </div>
          <div className="form-group">
            <label>Офис/Квартира</label>
            <input
              type="text"
              value={formData.applicant.address.office}
              onChange={(e) => handleInputChange('applicant', 'address.office', e.target.value)}
              placeholder="оф. 101"
            />
          </div>
        </div>

        <h3>📞 Контактные данные</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Телефон</label>
            <input
              type="tel"
              value={formData.applicant.phone}
              onChange={(e) => handleInputChange('applicant', 'phone', e.target.value)}
              placeholder="+7 (999) 123-45-67"
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={formData.applicant.email}
              onChange={(e) => handleInputChange('applicant', 'email', e.target.value)}
              placeholder="email@example.com"
            />
          </div>
        </div>
        {errors['applicant.contact'] && (
          <span className="error-message">{errors['applicant.contact']}</span>
        )}
      </section>

      {/* Раздел: Данные ответчика */}
      <section className="form-section">
        <h2>🏢 Данные ответчика</h2>
        
        <div className="form-group">
          <label>Название организации *</label>
          <input
            type="text"
            value={formData.defendant.companyName}
            onChange={(e) => handleInputChange('defendant', 'companyName', e.target.value)}
            placeholder="ООО «Ответчик»"
            className={errors['defendant.companyName'] ? 'error' : ''}
          />
          {errors['defendant.companyName'] && (
            <span className="error-message">{errors['defendant.companyName']}</span>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>ИНН *</label>
            <input
              type="text"
              value={formData.defendant.inn}
              onChange={(e) => handleInputChange('defendant', 'inn', e.target.value)}
              placeholder="1234567890"
              maxLength={12}
              className={errors['defendant.inn'] ? 'error' : ''}
            />
            {errors['defendant.inn'] && (
              <span className="error-message">{errors['defendant.inn']}</span>
            )}
          </div>
          <div className="form-group">
            <label>ОГРН</label>
            <input
              type="text"
              value={formData.defendant.ogrn}
              onChange={(e) => handleInputChange('defendant', 'ogrn', e.target.value)}
              placeholder="1234567890123"
              maxLength={13}
            />
          </div>
        </div>

        <h3>📍 Адрес ответчика</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Индекс</label>
            <input
              type="text"
              value={formData.defendant.address.postalCode}
              onChange={(e) => handleInputChange('defendant', 'address.postalCode', e.target.value)}
              placeholder="123456"
              maxLength={6}
            />
          </div>
          <div className="form-group">
            <label>Регион/Область</label>
            <input
              type="text"
              value={formData.defendant.address.region}
              onChange={(e) => handleInputChange('defendant', 'address.region', e.target.value)}
              placeholder="Московская область"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group flex-2">
            <label>Город *</label>
            <input
              type="text"
              value={formData.defendant.address.city}
              onChange={(e) => handleInputChange('defendant', 'address.city', e.target.value)}
              placeholder="Москва"
              className={errors['defendant.address.city'] ? 'error' : ''}
            />
            {errors['defendant.address.city'] && (
              <span className="error-message">{errors['defendant.address.city']}</span>
            )}
          </div>
          <div className="form-group flex-3">
            <label>Улица</label>
            <input
              type="text"
              value={formData.defendant.address.street}
              onChange={(e) => handleInputChange('defendant', 'address.street', e.target.value)}
              placeholder="ул. Ленина"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Дом/Строение</label>
            <input
              type="text"
              value={formData.defendant.address.building}
              onChange={(e) => handleInputChange('defendant', 'address.building', e.target.value)}
              placeholder="д. 1"
            />
          </div>
          <div className="form-group">
            <label>Офис/Квартира</label>
            <input
              type="text"
              value={formData.defendant.address.office}
              onChange={(e) => handleInputChange('defendant', 'address.office', e.target.value)}
              placeholder="оф. 101"
            />
          </div>
        </div>

        <h3>📞 Контактные данные</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Телефон</label>
            <input
              type="tel"
              value={formData.defendant.phone}
              onChange={(e) => handleInputChange('defendant', 'phone', e.target.value)}
              placeholder="+7 (999) 123-45-67"
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={formData.defendant.email}
              onChange={(e) => handleInputChange('defendant', 'email', e.target.value)}
              placeholder="email@example.com"
            />
          </div>
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
              value={formData.claim.contractNumber}
              onChange={(e) => handleInputChange('claim', 'contractNumber', e.target.value)}
              placeholder="№ 2024-001"
            />
          </div>
          <div className="form-group">
            <label>Дата контракта</label>
            <input
              type="date"
              value={formData.claim.contractDate}
              onChange={(e) => handleInputChange('claim', 'contractDate', e.target.value)}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Сумма претензии (руб.) *</label>
            <input
              type="number"
              value={formData.claim.amount}
              onChange={(e) => handleInputChange('claim', 'amount', e.target.value)}
              placeholder="50000"
              className={errors['claim.amount'] ? 'error' : ''}
            />
            {errors['claim.amount'] && (
              <span className="error-message">{errors['claim.amount']}</span>
            )}
          </div>
          <div className="form-group">
            <label>Штраф/Пеня (руб.)</label>
            <input
              type="number"
              value={formData.claim.penalty}
              onChange={(e) => handleInputChange('claim', 'penalty', e.target.value)}
              placeholder="0"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Суть претензии *</label>
          <textarea
            value={formData.claim.description}
            onChange={(e) => handleInputChange('claim', 'description', e.target.value)}
            placeholder="Подробно опишите суть претензии, факты нарушения, дату и обстоятельства..."
            className={errors['claim.description'] ? 'error' : ''}
          />
          {errors['claim.description'] && (
            <span className="error-message">{errors['claim.description']}</span>
          )}
        </div>

        <div className="form-group">
          <label>Требования *</label>
          <textarea
            value={formData.claim.demands}
            onChange={(e) => handleInputChange('claim', 'demands', e.target.value)}
            placeholder="Четко сформулируйте требования, что именно должен сделать ответчик..."
            className={errors['claim.demands'] ? 'error' : ''}
          />
          {errors['claim.demands'] && (
            <span className="error-message">{errors['claim.demands']}</span>
          )}
        </div>

        <div className="form-group">
          <label>Срок ответа (дней)</label>
          <input
            type="number"
            value={formData.claim.deadline}
            onChange={(e) => handleInputChange('claim', 'deadline', e.target.value)}
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
