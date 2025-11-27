'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import styled from 'styled-components';
import Footer from '../../components/Footer';

// Styled Components
const PageContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  overflow: hidden;
`;

const Header = styled.header`
  background-color: #0d9488;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 8px;
  margin: 16px 16px 0 16px;

  @media (max-width: 768px) {
    padding: 12px 16px;
  }
`;

const Logo = styled.h1`
  color: #ffffff;
  font-size: 24px;
  font-weight: bold;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const NavButton = styled.button`
  background-color: transparent;
  border: none;
  color: #ffffff;
  font-size: 14px;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 4px;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.8;
  }

  @media (max-width: 768px) {
    font-size: 12px;
    padding: 6px 12px;
  }
`;

const LoginContainer = styled.div`
  display: flex;
  height: calc(100vh - 80px);
  gap: 0;

  @media (max-width: 1024px) {
    height: calc(100vh - 70px);
  }

  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
  }
`;

const FormSection = styled.div`
  flex: 0 0 40%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  overflow-y: auto;

  @media (max-width: 1024px) {
    flex: 0 0 50%;
    padding: 40px 20px;
  }

  @media (max-width: 768px) {
    flex: 1;
    background-color: #ffffff;
    padding: 30px 24px;
    height: auto;
    min-height: auto;
  }
`;

const Form = styled.form`
  width: 100%;
  max-width: 400px;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const FormTitle = styled.h2`
  font-size: 32px;
  font-weight: bold;
  color: #0d9488;
  margin: 0 0 12px 0;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const FormSubtitle = styled.p`
  font-size: 16px;
  color: #4b5563;
  margin: 0 0 30px 0;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const InputGroup = styled.div`
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #000000;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  font-size: 14px;
  border: 2px solid ${props => props.$hasError ? '#dc2626' : '#e0e0e0'};
  border-radius: 6px;
  font-family: inherit;
  transition: all 0.3s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${props => props.$hasError ? '#dc2626' : '#0d9488'};
    box-shadow: 0 0 0 3px ${props => props.$hasError ? 'rgba(220, 38, 38, 0.1)' : 'rgba(13, 148, 136, 0.1)'};
  }

  &::placeholder {
    color: #b0b0b0;
  }

  @media (max-width: 768px) {
    padding: 10px 14px;
    font-size: 13px;
  }
`;

const PasswordInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const PasswordInput = styled(Input)`
  width: 100%;
  padding-right: 40px;
`;

const PasswordToggleButton = styled.button`
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0d9488;
  transition: color 0.2s ease;

  &:hover {
    color: #0d7a72;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const ErrorMessage = styled.span`
  font-size: 12px;
  color: #dc2626;
  margin-top: 4px;
`;

const ForgotPasswordLink = styled.a`
  font-size: 14px;
  color: #0d9488;
  text-decoration: none;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 14px 28px;
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  background-color: #0d9488;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 20px;

  &:hover:not(:disabled) {
    background-color: #0d7a72;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 12px 24px;
    font-size: 15px;
  }
`;

const SignupPrompt = styled.div`
  text-align: center;
  margin-top: 24px;
  font-size: 14px;
  color: #4b5563;

  span {
    color: #0d9488;
    text-decoration: none;
    cursor: pointer;
    font-weight: 600;

    &:hover {
      opacity: 0.8;
    }
  }
`;

const ImageSection = styled.div`
  flex: 0 0 60%;
  background: url('/src/assets/images/mitad.png') center / contain no-repeat;
  height: 100%;

  @media (max-width: 1024px) {
    flex: 0 0 50%;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

// Main Component
export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    // Validation helpers
    const validateEmail = (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value);
    };

    const validatePassword = (value) => {
        return value.length >= 6;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Reset errors
        const newErrors = {};

        // Validate email
        if (!email.trim()) {
            newErrors.email = 'El correo electrónico es requerido';
        } else if (!validateEmail(email)) {
            newErrors.email = 'Por favor ingresa un correo electrónico válido';
        }

        // Validate password
        if (!password.trim()) {
            newErrors.password = 'La contraseña es requerida';
        } else if (!validatePassword(password)) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        }

        // If there are errors, set them and return
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Clear errors if validation passes
        setErrors({});

        // Set loading state
        setIsLoading(true);

        try {
            // Llamada real al backend
            await login(email, password);
            
            // Si el login es exitoso, redirigir a home
            navigate('/home');
        } catch (error) {
            // Mostrar error del backend
            setErrors({ 
                submit: 'Email o contraseña incorrecta.' 
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = (e) => {
        e.preventDefault();
        navigate('/forgot-password');
    };

    const handleCreateAccount = () => {
        navigate('/register');
    };

    const handleHomeClick = () => {
        navigate('/');
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <PageContainer>
            {/* Header */}
            <Header>
                <Logo>HuilApp</Logo>
                <NavButton onClick={handleHomeClick}>Inicio</NavButton>
            </Header>

            {/* Main Content */}
            <LoginContainer>
                {/* Form Section */}
                <FormSection>
                    <Form onSubmit={handleSubmit}>
                        <FormTitle>Bienvenido de nuevo</FormTitle>
                        <FormSubtitle>Inicia sesión en tu cuenta</FormSubtitle>

                        {/* Email Input */}
                        <InputGroup>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Ingrese el correo electrónico"
                                value={email}
                                $hasError={errors.email || errors.submit}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (errors.email || errors.submit) {
                                        setErrors({ ...errors, email: '', submit: '' });
                                    }
                                }}
                            />
                            {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
                        </InputGroup>

                        {/* Password Input */}
                        <InputGroup>
                            <Label htmlFor="password">Contraseña</Label>
                            <PasswordInputWrapper>
                                <PasswordInput
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Contraseña"
                                    value={password}
                                    $hasError={errors.password || errors.submit}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (errors.password || errors.submit) {
                                            setErrors({ ...errors, password: '', submit: '' });
                                        }
                                    }}
                                />
                                <PasswordToggleButton
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    aria-label="Mostrar/ocultar contraseña"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </PasswordToggleButton>
                            </PasswordInputWrapper>
                            {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
                        </InputGroup>

                        {/* Forgot Password Link */}
                        <InputGroup>
                            <ForgotPasswordLink onClick={handleForgotPassword}>
                                ¿Olvidaste tu contraseña?
                            </ForgotPasswordLink>
                        </InputGroup>

                        {/* Error message general */}
                        {errors.submit && <ErrorMessage>{errors.submit}</ErrorMessage>}

                        {/* Submit Button */}
                        <SubmitButton type="submit" disabled={isLoading}>
                            {isLoading ? 'Cargando...' : 'Iniciar sesión'}
                        </SubmitButton>

                        {/* Sign Up Link */}
                        <SignupPrompt>
                            ¿No tienes una cuenta? <span onClick={handleCreateAccount}>Crear cuenta</span>
                        </SignupPrompt>
                    </Form>
                </FormSection>

                {/* Image Section */}
                <ImageSection />
            </LoginContainer>

            {/* Footer */}
            <Footer />
        </PageContainer>
    );
}
