import React from 'react';
import { Card as BsCard } from 'react-bootstrap';

export const Card = ({ children, className, ...props }) => (
  <BsCard className={`custom-card ${className || ''}`} {...props}>
    {children}
  </BsCard>
);

export const CardHeader = ({ children, className, ...props }) => (
  <BsCard.Header className={`custom-card-header ${className || ''}`} {...props}>
    {children}
  </BsCard.Header>
);

export const CardTitle = ({ children, className, ...props }) => (
  <BsCard.Title className={`custom-card-title ${className || ''}`} {...props}>
    {children}
  </BsCard.Title>
);

export const CardDescription = ({ children, className, ...props }) => (
  <div className={`custom-card-description ${className || ''}`} {...props}>
    {children}
  </div>
);

export const CardContent = ({ children, className, ...props }) => (
  <BsCard.Body className={`custom-card-content ${className || ''}`} {...props}>
    {children}
  </BsCard.Body>
);

export const CardFooter = ({ children, className, ...props }) => (
  <BsCard.Footer className={`custom-card-footer ${className || ''}`} {...props}>
    {children}
  </BsCard.Footer>
);