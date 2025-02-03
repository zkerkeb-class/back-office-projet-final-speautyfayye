import React from 'react';

interface ErrorComponentProps {
  message: string;
}

const ErrorComponent: React.FC<ErrorComponentProps> = ({ message }) => {
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
      <strong>Error:</strong> {message}
    </div>
  );
};

export default ErrorComponent;
