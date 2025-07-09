import React from 'react';
import { Button as BsButton } from 'react-bootstrap';

export const Button = ({ variant = 'primary', children, className, ...props }) => {
  const getButtonVariant = (variant) => {
    switch (variant) {
      case 'link':
        return 'link';
      case 'outline':
        return 'outline-primary';
      case 'destructive':
        return 'danger';
      default:
        return 'primary';
    }
  };

  return (
    <BsButton
      variant={getVariant(variant)}
      className={`custom-button ${className || ''}`}
      {...props}
    >
      {children}
    </BsButton>
  );
};

const getVariant = (variant) => {
  switch (variant) {
    case 'link':
      return 'link';
    case 'outline':
      return 'outline-primary';
    case 'destructive':
      return 'danger';
    case 'default':
    default:
      return 'primary';
  }
};