// hooks/use-toast.js
import React, { createContext, useContext, useState, useCallback } from 'react';
import { Toast as BsToast, ToastContainer } from 'react-bootstrap';

// Create Toast Context
const ToastContext = createContext();

// Toast Provider Component
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback(({ title, description, variant = 'success', duration = 3000 }) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      title,
      description,
      variant,
      show: true,
    };

    setToasts(prev => [...prev, newToast]);

    // Auto-hide toast after duration
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, duration);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast, toasts, dismissToast }}>
      {children}
      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
        {toasts.map(toast => (
          <BsToast
            key={toast.id}
            onClose={() => dismissToast(toast.id)}
            show={toast.show}
            delay={3000}
            autohide
            bg={toast.variant === 'destructive' ? 'danger' : 'success'}
            text={toast.variant === 'destructive' ? 'white' : 'dark'}
          >
            <BsToast.Header>
              <strong className="me-auto">{toast.title}</strong>
            </BsToast.Header>
            <BsToast.Body>{toast.description}</BsToast.Body>
          </BsToast>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
};

// Custom hook to use toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};