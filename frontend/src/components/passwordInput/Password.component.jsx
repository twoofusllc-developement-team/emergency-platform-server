import React, { useState } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';

export const PasswordInput = ({ credentials, errors, handleChange }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="password-input-container">
      <Label htmlFor="password">Password</Label>
      <InputGroup className="password-input-group">
        <InputGroup.Text className="password-input-icon">
          <Lock className="icon" />
        </InputGroup.Text>
        <Form.Control
          id="password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          value={credentials.password}
          onChange={handleChange}
          className={`password-input ${errors.password ? 'is-invalid' : ''}`}
        />
        <Button
          variant="outline-secondary"
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="password-toggle-btn"
        >
          {showPassword ? <EyeOff className="icon" /> : <Eye className="icon" />}
        </Button>
      </InputGroup>
      {errors.password && (
        <div className="invalid-feedback">{errors.password}</div>
      )}
    </div>
  );
};