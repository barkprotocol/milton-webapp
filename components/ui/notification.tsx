import React from 'react';

interface NotificationProps {
  message: string;
  type: 'success' | 'error';
  visible: boolean;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, type, visible, onClose }) => {
  const baseStyles = 'p-4 mb-4 rounded-md shadow-md transition duration-200 ease-in-out';
  const typeStyles =
    type === 'success'
      ? 'bg-green-100 border border-green-300 text-green-800'
      : 'bg-red-100 border border-red-300 text-red-800';

  return (
    <div className={`${baseStyles} ${typeStyles} ${visible ? 'scale-100' : 'scale-0'}`} role="alert">
      {message}
      <button className="ml-4 text-gray-600" onClick={onClose}>
        &times;
      </button>
    </div>
  );
};

export default Notification;
