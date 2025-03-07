import React, { useEffect, useState } from 'react';

function StatusMessage({ message, type, duration = 3000 }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  return (
    <div className={`status-message ${type}`}>
      {message}
    </div>
  );
}

export default StatusMessage;
