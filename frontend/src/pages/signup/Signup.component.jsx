import React, { useState } from "react";
import { signup } from "./Signup.service";
import { Container, Row, Col, Form, InputGroup, Alert } from "react-bootstrap";
import { Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../../components/ui/toast/toast";
import { Helmet } from "react-helmet-async";
import { PasswordInput } from "../../components/passwordInput/Password.component";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input, Label } from "../../components/ui/input";
import "./Signup.css";
import { useMutation } from '@tanstack/react-query';
import { validateEmail, validatePassword, validatePhoneNumber } from '../../utils/validationConstants';

const Signup = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    PhoneNumber: "",
    role: "requester",
    Address: { addressName: "", street: "" },
    RequesterProfile: { Documents: "" },
    shelterOwnerProfile: { shelterOwnerID: "" },
  });
  const [errors, setErrors] = useState({});
  const { toast } = useToast();
  const navigate = useNavigate();

  // React Query mutation for signup
  const signupMutation = useMutation({
    mutationFn: (data) => signup(data),
    onSuccess: () => {
      toast({
        title: "Account Created",
        description: "Your account was created successfully!",
        duration: 3000,
      });
      setTimeout(() => navigate("/auth/login"), 300);
    },
    onError: (err) => {
      const errorMsg = err?.response?.data?.error || "Signup failed";
      setErrors({ server: errorMsg });
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
        duration: 3000,
      });
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("Address.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        Address: { ...prev.Address, [key]: value },
      }));
    } else if (name.startsWith("RequesterProfile.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        RequesterProfile: { ...prev.RequesterProfile, [key]: value },
      }));
    } else if (name.startsWith("shelterOwnerProfile.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        shelterOwnerProfile: { ...prev.shelterOwnerProfile, [key]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    // Validate all fields
    const newErrors = {};
    newErrors.email = validateEmail(form.email);
    newErrors.password = validatePassword(form.password);
    newErrors.PhoneNumber = validatePhoneNumber(form.PhoneNumber);
    if (!form.Address.addressName.trim()) newErrors.addressName = 'Address name is required';
    if (!form.Address.street.trim()) newErrors.street = 'Street is required';
    if (form.role === 'requester' && !form.RequesterProfile.Documents.trim()) newErrors.Documents = 'Documents are required';
    if (form.role === 'ShelterOwner' && !form.shelterOwnerProfile.shelterOwnerID.trim()) newErrors.shelterOwnerID = 'Shelter Owner ID is required';
    if (!form.confirmPassword.trim()) newErrors.confirmPassword = 'Please confirm your password';
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    // Remove empty errors
    Object.keys(newErrors).forEach(key => { if (!newErrors[key]) delete newErrors[key]; });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    // Prepare payload based on role
    const payload = {
      email: form.email,
      password: form.password,
      PhoneNumber: form.PhoneNumber,
      role: form.role,
      Address: form.Address,
    };
    if (form.role === "requester") {
      payload.RequesterProfile = form.RequesterProfile;
    } else if (form.role === "ShelterOwner") {
      payload.shelterOwnerProfile = form.shelterOwnerProfile;
    }
    signupMutation.mutate(payload);
  };

  return (
    <>
      <Helmet>
        <title>Create Account</title>
        <meta name="description" content="Create a new account to get started" />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <Container fluid className="signup-container">
        <Row className="justify-content-center">
          <Col md={6} lg={4}>
            <Card className="signup-card">
              <CardHeader>
                <CardTitle>Create your account</CardTitle>
                <CardDescription>
                  Enter your details to create a new account
                </CardDescription>
              </CardHeader>

              <CardContent>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Label htmlFor="email">Email address</Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <Mail className="icon" />
                      </InputGroup.Text>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                      />
                    </InputGroup>
                    {errors.email && <p className="text-danger">{errors.email}</p>}
                  </Form.Group>

                  <PasswordInput
                    credentials={form}
                    errors={errors}
                    handleChange={handleChange}
                  />
                  <Form.Group className="mb-3">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm Password"
                      value={form.confirmPassword}
                      onChange={handleChange}
                    />
                    {errors.confirmPassword && <p className="text-danger">{errors.confirmPassword}</p>}
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Label htmlFor="PhoneNumber">Phone Number</Label>
                    <Input
                      id="PhoneNumber"
                      name="PhoneNumber"
                      type="text"
                      placeholder="Phone Number"
                      value={form.PhoneNumber}
                      onChange={handleChange}
                    />
                    {errors.PhoneNumber && <p className="text-danger">{errors.PhoneNumber}</p>}
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Label htmlFor="role">Role</Label>
                    <Form.Select
                      id="role"
                      name="role"
                      value={form.role}
                      onChange={handleChange}
                      className="role-select"
                    >
                      <option value="requester">Requester</option>
                      <option value="ShelterOwner">Shelter Owner</option>
                      <option value="admin">Admin</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Label htmlFor="addressName">Address Name</Label>
                    <Input
                      id="addressName"
                      name="Address.addressName"
                      type="text"
                      placeholder="Home, Work, etc."
                      value={form.Address.addressName}
                      onChange={handleChange}
                    />
                    {errors.addressName && <p className="text-danger">{errors.addressName}</p>}
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Label htmlFor="street">Street</Label>
                    <Input
                      id="street"
                      name="Address.street"
                      type="text"
                      placeholder="Street address"
                      value={form.Address.street}
                      onChange={handleChange}
                    />
                    {errors.street && <p className="text-danger">{errors.street}</p>}
                  </Form.Group>

                  {/* Show RequesterProfile fields if role is requester */}
                  {form.role === "requester" && (
                    <Form.Group className="mb-3">
                      <Label htmlFor="documents">Documents</Label>
                      <Input
                        id="documents"
                        name="RequesterProfile.Documents"
                        type="text"
                        placeholder="Documents"
                        value={form.RequesterProfile.Documents}
                        onChange={handleChange}
                      />
                      {errors.Documents && <p className="text-danger">{errors.Documents}</p>}
                    </Form.Group>
                  )}

                  {/* Show shelterOwnerProfile fields if role is ShelterOwner */}
                  {form.role === "ShelterOwner" && (
                    <Form.Group className="mb-3">
                      <Label htmlFor="shelterOwnerID">Shelter Owner ID</Label>
                      <Input
                        id="shelterOwnerID"
                        name="shelterOwnerProfile.shelterOwnerID"
                        type="text"
                        placeholder="Shelter Owner ID"
                        value={form.shelterOwnerProfile.shelterOwnerID}
                        onChange={handleChange}
                      />
                      {errors.shelterOwnerID && <p className="text-danger">{errors.shelterOwnerID}</p>}
                    </Form.Group>
                  )}

                  {errors.server && (
                    <Alert variant="danger" className="text-center mb-3">
                      {errors.server}
                    </Alert>
                  )}

                  <Button type="submit" className="w-100" disabled={signupMutation.isLoading}>
                    {signupMutation.isLoading ? "Creating account..." : "Create account"}
                  </Button>
                </Form>
              </CardContent>

              <CardFooter>
                <div className="text-center">
                  <span>Already have an account? </span>
                  <Link to="/auth/login" className="signin-link">
                    Sign in instead
                  </Link>
                </div>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Signup;