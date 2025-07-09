import React, { useState, useEffect } from "react";
import { login } from "./Signin.service";
import { Container, Row, Col, Form, InputGroup, Alert } from "react-bootstrap";
import { Mail, KeyRound } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../redux/slices/authSlices";
import { setPersonData } from "../../redux/slices/userSlice";
import { RateLimiter } from "../../utils/rateLimit";
import { useToast } from "../../components/ui/toast/toast";
import {
  validateEmail,
  validatePassword,
} from "../../utils/validationConstants";
import { Helmet } from "react-helmet-async";
import { PasswordInput } from "../../components/passwordInput/Password.component";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input, Label } from "../../components/ui/input";
import "./Signin.css";
import { useMutation } from '@tanstack/react-query';

const RATE_LIMIT_CONFIG = {
  maxAttempts: 5, 
  windowMs: 15 * 60 * 1000,
};

const signinLimiter = new RateLimiter("authIn", RATE_LIMIT_CONFIG);

const Signin = () => {
  // Signin states
  const [userInput, setUserInput] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    server: "",
    otp: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState(null);
  const [verificationStep, setVerificationStep] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [forgotPasswordStep, setForgotPasswordStep] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [resetPasswordStep, setResetPasswordStep] = useState(false);
  const [resetPasswordInput, setResetPasswordInput] = useState({
    code: "",
    newPassword: "",
  });
  const [resendTimer, setResendTimer] = useState(0);

  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // React Query mutation for login
  const loginMutation = useMutation({
    mutationFn: (data) => login(data),
    onSuccess: (response) => {
      handleLoginSuccess(response);
    },
    onError: (error) => {
      signinLimiter.increment();
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.error || 
        "Failed to login";
      
      setErrors((prev) => ({ ...prev, server: errorMessage }));
      
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
        duration: 4000,
      });
      
      if (
        error?.response?.status === 403 &&
        error?.response?.data?.message?.includes("Email not verified. Please verify your email first.")
      ) {
        setVerificationStep(true);
        setErrors({ email: "", password: "", server: "", otp: "" });
        setResendTimer(60);
        
        toast({
          title: "Email Verification Required",
          description: "Please verify your email before signing in.",
          variant: "destructive",
          duration: 5000,
        });
      }
    },
  });

  // Timer effect for forgot password cooldown
  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  const validateField = (name, value) => {
    switch (name) {
      case "email":
        return validateEmail(value);
      case "password":
        return validatePassword(value);
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInput((prev) => ({ ...prev, [name]: value }));
    setUnverifiedEmail(null);

    const fieldError = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: fieldError,
      server: fieldError ? "" : prev.server,
    }));
  };

  const handleResendCode = async () => {
    setUnverifiedEmail(userInput.email);
    if (resendTimer > 0 || !unverifiedEmail) return;
    
    try {
      // Mock API call - replace with actual service call when ready
      // await resendVerificationCode(unverifiedEmail);
      setResendTimer(60);
      
      toast({
        title: "Verification Code Sent",
        description: "A new verification code has been sent to your email.",
        variant: "success",
        duration: 3000,
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to resend code";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleResendForgotCode = async () => {
    if (resendTimer > 0) return;

    try {
      // Mock API call - replace with actual service call when ready
      // await requestPasswordReset({ email: forgotPasswordEmail });
      setResendTimer(60);
      
      toast({
        title: "Reset Code Sent",
        description: "A new password reset code has been sent to your email.",
        variant: "success",
        duration: 3000,
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to send reset code";
      setErrors((prev) => ({ ...prev, server: errorMessage }));
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleVerificationSubmit = async (e) => {
    e.preventDefault();
    
    const otpError = validateField("otp", otpInput);
    if (otpError) {
      setErrors((prev) => ({ ...prev, otp: otpError }));
      toast({
        title: "Invalid Code",
        description: "Please enter a valid 6-digit verification code.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    setIsLoading(true);
    try {
      // Mock verification - replace with actual service call when ready
      // await verifyEmail({
      //   email: userInput.email,
      //   code: otpInput,
      // });

      // After successful verification, attempt login again
      const response = await login(userInput);
      handleLoginSuccess(response);

      toast({
        title: "Email Verified",
        description: "Your email has been verified successfully.",
        variant: "success",
        duration: 3000,
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Verification failed";
      setErrors((prev) => ({ ...prev, server: errorMessage }));
      
      toast({
        title: "Verification Failed",
        description: errorMessage,
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    const emailError = validateField("email", forgotPasswordEmail);
    if (emailError) {
      setErrors((prev) => ({ ...prev, email: emailError }));
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    setForgotPasswordLoading(true);
    try {
      // Mock API call - replace with actual service call when ready
      // await requestPasswordReset({ email: forgotPasswordEmail });
      setResendTimer(60);
      setResetPasswordStep(true);
      setErrors({
        email: "",
        password: "",
        server: "",
        otp: "",
      });
      
      toast({
        title: "Reset Code Sent",
        description: "Please check your email for the password reset code.",
        variant: "success",
        duration: 5000,
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to send reset code";
      setErrors((prev) => ({ ...prev, server: errorMessage }));
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();

    const codeError = validateField("otp", resetPasswordInput.code);
    const passwordError = validateField("password", resetPasswordInput.newPassword);

    if (codeError || passwordError) {
      setErrors((prev) => ({
        ...prev,
        otp: codeError,
        password: passwordError,
      }));
      
      toast({
        title: "Validation Error",
        description: "Please check your reset code and password.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    setIsLoading(true);
    try {
      // Mock API call - replace with actual service call when ready
      // await resetPassword({
      //   email: forgotPasswordEmail,
      //   code: resetPasswordInput.code,
      //   newPassword: resetPasswordInput.newPassword,
      // });

      toast({
        title: "Password Reset Successful",
        description: "You can now sign in with your new password.",
        variant: "success",
        duration: 3000,
      });

      // Reset all states and go back to sign in
      setForgotPasswordStep(false);
      setResetPasswordStep(false);
      setForgotPasswordEmail("");
      setResetPasswordInput({ code: "", newPassword: "" });
      setErrors({ email: "", password: "", server: "", otp: "" });
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to reset password";
      setErrors((prev) => ({ ...prev, server: errorMessage }));
      
      toast({
        title: "Reset Failed",
        description: errorMessage,
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = (responseData) => {
    dispatch(
      setCredentials({
        accessToken: responseData.token,
        id: responseData.data.user.id,
        _initialized: true,
      })
    );
    dispatch(
      setPersonData({
        name: responseData.data.user.name,
        email: responseData.data.user.email,
        role: responseData.data.user.role,
      })
    );

    signinLimiter.reset();
    
    const navigation = responseData.data.user.role === "admin" ? "/" : "/";

    toast({
      title: "Welcome back!",
      description: `Successfully signed in`,
      variant: "success",
      duration: 3000,
    });

    navigate(navigation);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check rate limiting
    const rateLimit = signinLimiter.canAttempt();
    if (!rateLimit.allowed) {
      const minutes = Math.ceil((rateLimit.remainingMs || 0) / 60000);
      const errorMessage = `Too many login attempts. Please try again in ${minutes} minutes`;
      
      toast({
        title: "Access Temporarily Blocked",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
      
      setErrors((prev) => ({ ...prev, server: errorMessage }));
      return;
    }

    // Validate fields
    const emailError = validateEmail(userInput.email);
    const passwordError = validatePassword(userInput.password);
    
    if (emailError || passwordError) {
      setErrors({ 
        ...errors, 
        email: emailError, 
        password: passwordError 
      });
      
      toast({
        title: "Validation Error",
        description: "Please check your email and password.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    // Clear previous errors
    setErrors({ email: "", password: "", server: "", otp: "" });
    
    // Trigger login mutation
    loginMutation.mutate({ 
      email: userInput.email, 
      password: userInput.password 
    });
  };

  return (
    <>
      <Helmet>
        <title>{forgotPasswordStep ? "Reset Password" : "Sign In"}</title>
        <meta
          name="description"
          content={
            forgotPasswordStep
              ? "Reset your password to regain access to your account"
              : "Sign in to access your account and manage your tasks"
          }
        />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <Container fluid className="signin-container">
        <Row className="justify-content-center">
          <Col md={6} lg={4}>
            <Card className="signin-card">
              <CardHeader>
                <CardTitle>
                  {forgotPasswordStep
                    ? resetPasswordStep
                      ? "Reset your password"
                      : "Forgot Password"
                    : "Sign in to your account"}
                </CardTitle>
                <CardDescription>
                  {forgotPasswordStep
                    ? resetPasswordStep
                      ? "Enter the code from your email and your new password"
                      : "Enter your email to receive a password reset code"
                    : "Enter your credentials to access your account"}
                </CardDescription>
              </CardHeader>

              <CardContent>
                {forgotPasswordStep ? (
                  resetPasswordStep ? (
                    // Reset Password Form
                    <Form onSubmit={handleResetPasswordSubmit}>
                      <Form.Group className="mb-3">
                        <Label htmlFor="resetCode">Reset Code</Label>
                        <InputGroup>
                          <InputGroup.Text>
                            <KeyRound className="icon" />
                          </InputGroup.Text>
                          <Input
                            id="resetCode"
                            name="code"
                            type="text"
                            maxLength={6}
                            placeholder="Enter 6-digit code"
                            value={resetPasswordInput.code}
                            onChange={(e) => {
                              setResetPasswordInput((prev) => ({
                                ...prev,
                                code: e.target.value,
                              }));
                              const otpError = validateField("otp", e.target.value);
                              setErrors((prev) => ({ ...prev, otp: otpError }));
                            }}
                            className={errors.otp ? "error" : ""}
                          />
                        </InputGroup>
                        {errors.otp && (
                          <div className="error-message">{errors.otp}</div>
                        )}
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Label htmlFor="newPassword">New Password</Label>
                        <PasswordInput
                          credentials={{ email: '', password: resetPasswordInput.newPassword }}
                          errors={{ password: errors.password }}
                          handleChange={(e) => {
                            setResetPasswordInput((prev) => ({
                              ...prev,
                              newPassword: e.target.value,
                            }));
                            const passwordError = validateField("password", e.target.value);
                            setErrors((prev) => ({
                              ...prev,
                              password: passwordError,
                            }));
                          }}
                        />
                      </Form.Group>

                      <div className="text-center mb-3">
                        <Button
                          type="button"
                          variant="link"
                          onClick={handleResendForgotCode}
                          disabled={resendTimer > 0}
                        >
                          {resendTimer > 0
                            ? `Resend code in ${resendTimer}s`
                            : "Resend reset code"}
                        </Button>
                      </div>

                      {errors.server && (
                        <Alert variant="danger" className="text-center">
                          {errors.server}
                        </Alert>
                      )}

                      <Button
                        type="submit"
                        className="w-100 mb-3"
                        disabled={isLoading}
                      >
                        {isLoading ? "Resetting..." : "Reset Password"}
                      </Button>

                      <div className="text-center">
                        <Button
                          type="button"
                          variant="link"
                          onClick={() => {
                            setForgotPasswordStep(false);
                            setResetPasswordStep(false);
                            setErrors({
                              email: "",
                              password: "",
                              server: "",
                              otp: "",
                            });
                          }}
                        >
                          Back to Sign in
                        </Button>
                      </div>
                    </Form>
                  ) : (
                    // Forgot Password Email Form
                    <Form onSubmit={handleForgotPassword}>
                      <Form.Group className="mb-3">
                        <Label htmlFor="forgotPasswordEmail">Email address</Label>
                        <InputGroup>
                          <InputGroup.Text>
                            <Mail className="icon" />
                          </InputGroup.Text>
                          <Input
                            id="forgotPasswordEmail"
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            value={forgotPasswordEmail}
                            onChange={(e) => {
                              setForgotPasswordEmail(e.target.value);
                              const fieldError = validateField("email", e.target.value);
                              setErrors((prev) => ({ ...prev, email: fieldError }));
                            }}
                            className={errors.email ? "error" : ""}
                          />
                        </InputGroup>
                        {errors.email && (
                          <div className="error-message">{errors.email}</div>
                        )}
                      </Form.Group>

                      {errors.server && (
                        <Alert variant="danger" className="text-center">
                          {errors.server}
                        </Alert>
                      )}

                      <Button
                        type="submit"
                        className="w-100 mb-3"
                        disabled={forgotPasswordLoading || resendTimer > 0}
                      >
                        {forgotPasswordLoading
                          ? "Sending..."
                          : resendTimer > 0
                          ? `Try again in ${resendTimer}s`
                          : "Send Reset Code"}
                      </Button>

                      <div className="text-center">
                        <Button
                          type="button"
                          variant="link"
                          onClick={() => {
                            setForgotPasswordStep(false);
                            setErrors({
                              email: "",
                              password: "",
                              server: "",
                              otp: "",
                            });
                          }}
                        >
                          Back to Sign in
                        </Button>
                      </div>
                    </Form>
                  )
                ) : verificationStep ? (
                  // Email Verification Form
                  <Form onSubmit={handleVerificationSubmit}>
                    <Form.Group className="mb-3">
                      <Label htmlFor="otp">Verification Code</Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <KeyRound className="icon" />
                        </InputGroup.Text>
                        <Input
                          id="otp"
                          name="otp"
                          type="text"
                          maxLength={6}
                          placeholder="Enter 6-digit code"
                          value={otpInput}
                          onChange={(e) => {
                            setOtpInput(e.target.value);
                            const otpError = validateField("otp", e.target.value);
                            setErrors((prev) => ({ ...prev, otp: otpError }));
                          }}
                          className={errors.otp ? "error" : ""}
                        />
                      </InputGroup>
                      {errors.otp && (
                        <div className="error-message">{errors.otp}</div>
                      )}
                    </Form.Group>

                    <div className="text-center mb-3">
                      <Button
                        type="button"
                        variant="link"
                        onClick={handleResendCode}
                        disabled={resendTimer > 0}
                      >
                        {resendTimer > 0
                          ? `Resend code in ${resendTimer}s`
                          : "Resend verification code"}
                      </Button>
                    </div>

                    {errors.server && (
                      <Alert variant="danger" className="text-center">
                        {errors.server}
                      </Alert>
                    )}

                    <Button type="submit" className="w-100 mb-3" disabled={isLoading}>
                      {isLoading ? "Verifying..." : "Verify"}
                    </Button>

                    <div className="text-center">
                      <Button
                        type="button"
                        variant="link"
                        onClick={() => {
                          setVerificationStep(false);
                          setErrors({
                            email: "",
                            password: "",
                            server: "",
                            otp: "",
                          });
                        }}
                      >
                        Back to Sign in
                      </Button>
                    </div>
                  </Form>
                ) : (
                  // Sign In Form
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
                          autoComplete="email"
                          value={userInput.email}
                          onChange={handleChange}
                          className={errors.email ? "error" : ""}
                        />
                      </InputGroup>
                      {errors.email && (
                        <div className="error-message">{errors.email}</div>
                      )}
                    </Form.Group>

                    <PasswordInput
                      credentials={userInput}
                      errors={errors}
                      handleChange={handleChange}
                    />

                    {errors.server && (
                      <Alert variant="danger" className="text-center mb-3">
                        {errors.server}
                      </Alert>
                    )}

                    <Button 
                      type="submit" 
                      className="w-100 mb-3" 
                      disabled={loginMutation.isLoading}
                    >
                      {loginMutation.isLoading ? "Signing in..." : "Sign in"}
                    </Button>


                    {/* <div className="text-center">
                      <Button
                        type="button"
                        variant="link"
                        onClick={() => {
                          setForgotPasswordStep(true);
                          setErrors({
                            email: "",
                            password: "",
                            server: "",
                            otp: "",
                          });
                        }}
                      >
                        Forgot your password?
                      </Button>
                    </div> */}
                  </Form>
                )}
              </CardContent>

              <CardFooter>
                <div className="text-center">
                  <span>Don't have an account? </span>
                  <Link to="/auth/signup" className="signup-link">
                    Create an account
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

export default Signin;