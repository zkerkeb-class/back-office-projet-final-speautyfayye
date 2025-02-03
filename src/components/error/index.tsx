import React from 'react';
import Text from '../textLocale';

interface ErrorComponentProps {
  message: string;
  locale: string;
}

const ErrorComponent: React.FC<ErrorComponentProps> = ({ message, locale }) => {
  return (
    <div
      style={{
        color: 'red',
        padding: '10px',
        border: '1px solid red',
        borderRadius: '5px',
        margin: '5px',
      }}
    >
      <strong>
        <Text locale={locale} text="error" />:
      </strong>
      {message}
    </div>
  );
};

export default ErrorComponent;
