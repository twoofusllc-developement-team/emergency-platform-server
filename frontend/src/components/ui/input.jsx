import React from 'react';
import { Form } from 'react-bootstrap';

export const Input = ({ className, ...props }) => (
  <Form.Control 
    className={`custom-input ${className || ''}`} 
    {...props}
  />
);

export const Label = ({ htmlFor, children, className, ...props }) => (
  <Form.Label 
    htmlFor={htmlFor}
    className={`custom-label ${className || ''}`}
    {...props}
  >
    {children}
  </Form.Label>
);