'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, Camera, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
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

const RegisterContainer = styled.div`
  display: flex;
  min-height: calc(100vh - 80px);
  justify-content: center;
  align-items: flex-start;
  padding: 40px 24px;
  background-color: #ffffff;

  @media (max-width: 768px) {
    padding: 30px 16px;
  }
`;

const FormSection = styled.div`
  background-color: #f5f5dc;
  padding: 40px;
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  overflow-y: auto;
  max-height: calc(100vh - 160px);

  @media (max-width: 768px) {
    padding: 30px 20px;
    max-height: none;
  }
`;

const Form = styled.form`
  width: 100%;
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

const InputGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const InputGroup = styled.div`
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
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-family: inherit;
  transition: all 0.3s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #0d9488;
    box-shadow: 0 0 0 3px rgba(13, 148, 136, 0.1);
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

const WarningMessage = styled.span`
  font-size: 12px;
  color: #dc2626;
  margin-top: 4px;
`;

const PhotoUploadSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding: 16px;
  background-color: #ffffff;
  border-radius: 6px;
`;

const PhotoUploadButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 600;
  color: #0d9488;
  background-color: transparent;
  border: 2px solid #0d9488;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(13, 148, 136, 0.05);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const PhotoPreview = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #0d9488;
`;

const LegalText = styled.p`
  font-size: 12px;
  color: #4b5563;
  margin: 20px 0;
  line-height: 1.6;
`;

const LegalLink = styled.a`
  color: #0d9488;
  text-decoration: none;
  cursor: pointer;
  font-weight: 600;

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

const LoginPrompt = styled.div`
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

// Modal Styles
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  padding: 32px;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
`;

const ModalIcon = styled.div`
  font-size: 60px;
  margin-bottom: 16px;
  display: flex;
  justify-content: center;

  svg {
    width: 60px;
    height: 60px;
  }
`;

const ModalTitle = styled.h3`
  font-size: 20px;
  font-weight: bold;
  color: #000000;
  margin: 0 0 12px 0;
`;

const ModalMessage = styled.p`
  font-size: 14px;
  color: #4b5563;
  margin: 0 0 24px 0;
  line-height: 1.6;
`;

const ModalButton = styled.button`
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 0 8px;

  &:first-child {
    margin-left: 0;
  }

  &:last-child {
    margin-right: 0;
  }
`;

const ModalButtonPrimary = styled(ModalButton)`
  color: #ffffff;
  background-color: #0d9488;

  &:hover {
    background-color: #0d7a72;
  }
`;

const ModalButtonSecondary = styled(ModalButton)`
  color: #0d9488;
  background-color: transparent;
  border: 2px solid #0d9488;

  &:hover {
    background-color: rgba(13, 148, 136, 0.05);
  }
`;

const ModalButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
`;

// Main Component
export default function Register() {
    const navigate = useNavigate();
    const { register, registerWithPhoto } = useAuth();
    
    const [formData, setFormData] = useState({
        nombre: '',
        apellidos: '',
        email: '',
        telefono: '',
        password: '',
        confirmPassword: '',
    });

    const [foto, setFoto] = useState(null);
    const [fotoPreview, setFotoPreview] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showExistingUserModal, setShowExistingUserModal] = useState(false);

    const validateNombre = (value) => {
        if (!value.trim()) return 'El nombre es requerido';
        if (value.length > 60) return 'El nombre no puede exceder 60 caracteres';
        return '';
    };

    const validateApellidos = (value) => {
        if (!value.trim()) return 'Los apellidos son requeridos';
        if (value.length > 60) return 'Los apellidos no pueden exceder 60 caracteres';
        return '';
    };

    const validateEmail = (value) => {
        if (!value.trim()) return 'El email es requerido';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Por favor ingresa un correo electrónico válido';
        return '';
    };

    const validateTelefono = (value) => {
        if (!value.trim()) return 'El teléfono es requerido';
        const phoneRegex = /^\d+$/;
        if (!phoneRegex.test(value)) return 'El teléfono debe contener solo números';
        if (value.length !== 10) return 'El teléfono debe tener exactamente 10 dígitos';
        return '';
    };

    const validatePassword = (value) => {
        if (!value.trim()) return 'La contraseña es requerida';
        if (value.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
        return '';
    };

    const validateConfirmPassword = (value, password) => {
        if (!value.trim()) return 'Confirmar contraseña es requerido';
        if (value !== password) return 'Las contraseñas no coinciden';
        return '';
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handlePhotoUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setFoto(file);
            const reader = new FileReader();
            reader.onload = (event) => {
                setFotoPreview(event.target?.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate all fields
        const newErrors = {};

        if (validateNombre(formData.nombre)) newErrors.nombre = validateNombre(formData.nombre);
        if (validateApellidos(formData.apellidos)) newErrors.apellidos = validateApellidos(formData.apellidos);
        if (validateEmail(formData.email)) newErrors.email = validateEmail(formData.email);
        if (validateTelefono(formData.telefono)) newErrors.telefono = validateTelefono(formData.telefono);
        if (validatePassword(formData.password)) newErrors.password = validatePassword(formData.password);
        if (validateConfirmPassword(formData.confirmPassword, formData.password))
            newErrors.confirmPassword = validateConfirmPassword(formData.confirmPassword, formData.password);

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);

        try {
            // Si hay foto, usar registerWithPhoto con FormData
            if (foto) {
                const formDataToSend = new FormData();
                formDataToSend.append('nombre', formData.nombre);
                formDataToSend.append('apellidos', formData.apellidos);
                formDataToSend.append('email', formData.email);
                formDataToSend.append('telefono', formData.telefono);
                formDataToSend.append('contrasena', formData.password);  // ✅ Cambiar a "contrasena"
                formDataToSend.append('foto', foto);
                
                await registerWithPhoto(formDataToSend);
            } else {
                // Sin foto, enviar solo JSON
                await register({
                    nombre: formData.nombre,
                    apellidos: formData.apellidos,
                    email: formData.email,
                    telefono: formData.telefono,
                    contrasena: formData.password,  // ✅ Cambiar a "contrasena"
                });
            }
            
            // Si el registro es exitoso, mostrar modal de éxito
            setShowSuccessModal(true);
        } catch (error) {
            // Manejar diferentes tipos de errores
            const errorMessage = error.message || 'Error desconocido';
            
            // Si el error indica que el usuario ya existe
            if (errorMessage.toLowerCase().includes('exist') || 
                errorMessage.toLowerCase().includes('ya registrado')) {
                setShowExistingUserModal(true);
            } else {
                // Cualquier otro error
                setShowErrorModal(true);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuccessModalClick = () => {
        navigate('/login');
    };

    const handleExistingUserLoginClick = () => {
        navigate('/login');
    };

    const handleLoginClick = () => {
        navigate('/login');
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <PageContainer>
            {/* Header */}
            <Header>
                <Logo>HuilApp</Logo>
                <NavButton onClick={handleLoginClick}>Iniciar sesión</NavButton>
            </Header>

            {/* Register Container */}
            <RegisterContainer>
                <FormSection>
                    <Form onSubmit={handleSubmit}>
                        <FormTitle>Registrarse</FormTitle>
                        <FormSubtitle>Crea tu nueva cuenta</FormSubtitle>

                        {/* Two Column Grid for Name and Surname */}
                        <InputGrid>
                            <InputGroup>
                                <Label htmlFor="nombre">Nombre</Label>
                                <Input
                                    id="nombre"
                                    name="nombre"
                                    type="text"
                                    placeholder="Nombre"
                                    value={formData.nombre}
                                    onChange={handleInputChange}
                                />
                                {errors.nombre && <WarningMessage>{errors.nombre}</WarningMessage>}
                            </InputGroup>

                            <InputGroup>
                                <Label htmlFor="apellidos">Apellidos</Label>
                                <Input
                                    id="apellidos"
                                    name="apellidos"
                                    type="text"
                                    placeholder="Apellidos"
                                    value={formData.apellidos}
                                    onChange={handleInputChange}
                                />
                                {errors.apellidos && <WarningMessage>{errors.apellidos}</WarningMessage>}
                            </InputGroup>
                        </InputGrid>

                        {/* Email and Phone in Grid */}
                        <InputGrid>
                            <InputGroup>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Correo electrónico"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />
                                {errors.email && <WarningMessage>{errors.email}</WarningMessage>}
                            </InputGroup>

                            <InputGroup>
                                <Label htmlFor="telefono">Teléfono</Label>
                                <Input
                                    id="telefono"
                                    name="telefono"
                                    type="tel"
                                    placeholder="Teléfono"
                                    value={formData.telefono}
                                    onChange={handleInputChange}
                                />
                                {errors.telefono && <WarningMessage>{errors.telefono}</WarningMessage>}
                            </InputGroup>
                        </InputGrid>

                        {/* Password and Confirm Password in Grid */}
                        <InputGrid>
                            <InputGroup>
                                <Label htmlFor="password">Contraseña</Label>
                                <PasswordInputWrapper>
                                    <PasswordInput
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Contraseña"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                    />
                                    <PasswordToggleButton
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        aria-label="Mostrar/ocultar contraseña"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </PasswordToggleButton>
                                </PasswordInputWrapper>
                                {errors.password && <WarningMessage>{errors.password}</WarningMessage>}
                            </InputGroup>

                            <InputGroup>
                                <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                                <PasswordInputWrapper>
                                    <PasswordInput
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder="Confirmar contraseña"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                    />
                                    <PasswordToggleButton
                                        type="button"
                                        onClick={toggleConfirmPasswordVisibility}
                                        aria-label="Mostrar/ocultar contraseña"
                                    >
                                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </PasswordToggleButton>
                                </PasswordInputWrapper>
                                {errors.confirmPassword && <WarningMessage>{errors.confirmPassword}</WarningMessage>}
                            </InputGroup>
                        </InputGrid>

                        {/* Photo Upload */}
                        <PhotoUploadSection>
                            <HiddenFileInput
                                id="photoInput"
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoUpload}
                            />
                            <PhotoUploadButton
                                type="button"
                                onClick={() => document.getElementById('photoInput')?.click()}
                            >
                                <Camera />
                                Añadir foto
                            </PhotoUploadButton>
                            {fotoPreview && <PhotoPreview src={fotoPreview} alt="Vista previa de foto" />}
                        </PhotoUploadSection>

                        {/* Legal Text */}
                        <LegalText>
                            Al registrarte, aceptas nuestros{' '}
                            <LegalLink href="#terms">Términos y condiciones</LegalLink> y{' '}
                            <LegalLink href="#privacy">Política de privacidad</LegalLink>
                        </LegalText>

                        {/* Submit Button */}
                        <SubmitButton type="submit" disabled={isLoading}>
                            {isLoading ? 'Cargando...' : 'Regístrate'}
                        </SubmitButton>

                        {/* Login Link */}
                        <LoginPrompt>
                            ¿Ya tienes una cuenta? <span onClick={handleLoginClick}>Iniciar sesión</span>
                        </LoginPrompt>
                    </Form>
                </FormSection>
            </RegisterContainer>

            {/* Success Modal */}
            {showSuccessModal && (
                <ModalOverlay onClick={() => setShowSuccessModal(false)}>
                    <ModalContent onClick={(e) => e.stopPropagation()}>
                        <ModalIcon>
                            <CheckCircle color="#16a34a" />
                        </ModalIcon>
                        <ModalTitle>¡Registro exitoso!</ModalTitle>
                        <ModalMessage>Tu cuenta ha sido creada correctamente</ModalMessage>
                        <ModalButtonContainer>
                            <ModalButtonPrimary onClick={handleSuccessModalClick}>
                                Ir al inicio
                            </ModalButtonPrimary>
                        </ModalButtonContainer>
                    </ModalContent>
                </ModalOverlay>
            )}

            {/* Error Modal */}
            {showErrorModal && (
                <ModalOverlay onClick={() => setShowErrorModal(false)}>
                    <ModalContent onClick={(e) => e.stopPropagation()}>
                        <ModalIcon>
                            <XCircle color="#dc2626" />
                        </ModalIcon>
                        <ModalTitle>Error en el registro</ModalTitle>
                        <ModalMessage>
                            Ocurrió un error al crear tu cuenta. Por favor intenta nuevamente
                        </ModalMessage>
                        <ModalButtonContainer>
                            <ModalButtonPrimary onClick={() => setShowErrorModal(false)}>
                                Cerrar
                            </ModalButtonPrimary>
                        </ModalButtonContainer>
                    </ModalContent>
                </ModalOverlay>
            )}

            {/* Existing User Modal */}
            {showExistingUserModal && (
                <ModalOverlay onClick={() => setShowExistingUserModal(false)}>
                    <ModalContent onClick={(e) => e.stopPropagation()}>
                        <ModalIcon>
                            <AlertCircle color="#f59e0b" />
                        </ModalIcon>
                        <ModalTitle>Usuario ya registrado</ModalTitle>
                        <ModalMessage>Ya existe una cuenta con este correo electrónico</ModalMessage>
                        <ModalButtonContainer>
                            <ModalButtonPrimary onClick={handleExistingUserLoginClick}>
                                Iniciar sesión
                            </ModalButtonPrimary>
                            <ModalButtonSecondary onClick={() => setShowExistingUserModal(false)}>
                                Cerrar
                            </ModalButtonSecondary>
                        </ModalButtonContainer>
                    </ModalContent>
                </ModalOverlay>
            )}

            {/* Footer */}
            <Footer />
        </PageContainer>
    );
}
