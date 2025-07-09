import React from 'react';
import { Form } from 'react-bootstrap';

export const Label = ({ htmlFor, children, className, ...props }) => (
  <Form.Label 
    htmlFor={htmlFor}
    className={`custom-label ${className || ''}`}
    {...props}
  >
    {children}
  </Form.Label>
);