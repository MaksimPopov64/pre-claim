import React from 'react';
import './CookiesDisclaimer.css';

type Props = {
  visible: boolean;
  onAccept: () => void;
};

export const CookiesDisclaimer: React.FC<Props> = ({ visible, onAccept }) => {
  if (!visible) return null;

  return (
    <div className="pc-disclaimer-overlay" role="dialog" aria-live="polite">
      <div className="pc-disclaimer">
        <div className="pc-disclaimer__text">
          <strong>Внимание — приватность и cookies</strong>
          <p>
            Этот сайт может использовать файлы cookie и хранить введённые вами
            личные данные локально в браузере (localStorage) для удобства работы.
            Пожалуйста, не вводите конфиденциальную информацию, которую вы не
            готовы хранить локально на вашем устройстве.
          </p>
        </div>

        <div className="pc-disclaimer__actions">
          <button
            className="pc-btn pc-btn--accept"
            onClick={onAccept}
            aria-label="Принять и закрыть"
          >
            Понятно
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookiesDisclaimer;
