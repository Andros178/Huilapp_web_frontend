"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff, CheckCircle, XCircle } from "lucide-react"
import styled from "styled-components"
import apiService from "../services/api.service"

// Styled Components
const PageContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  overflow: hidden;
`

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
`

const Logo = styled.h1`
  color: #ffffff;
  font-size: 24px;
  font-weight: bold;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`

const NavButton = styled.button`
  background-color: transparent;
  border: none;
  color: #ffffff;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 20px;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.8;
  }

  @media (max-width: 768px) {
    font-size: 12px;
    padding: 6px 12px;
  }
`

const ResetContainer = styled.div`
  display: flex;
  height: calc(100vh - 80px);
  gap: 0;

  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
  }
`

const FormSection = styled.div`
  flex: 0 0 40%;
  background-color: #ffffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  overflow-y: auto;

  @media (max-width: 768px) {
    flex: 1;
    background-color: #ffffff;
    padding: 30px 24px;
    height: auto;
  }
`

const Form = styled.form`
  width: 100%;
  max-width: 400px;

  @media (max-width: 768px) {
    max-width: 100%;
  }
`

const FormTitle = styled.h2`
  font-size: 32px;
  font-weight: bold;
  color: #0d9488;
  margin: 0 0 12px 0;
  line-height: 1.2;

  @media (max-width: 768px) {
    font-size: 28px;
  }
`

const FormDescription = styled.p`
  font-size: 14px;
  color: #4b5563;
  margin: 0 0 30px 0;
  line-height: 1.6;
`

const InputGroup = styled.div`
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
`

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #000000;
  margin-bottom: 8px;
`

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
`

const PasswordInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`

const PasswordInput = styled(Input)`
  width: 100%;
  padding-right: 40px;
`

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
`

const ErrorMessage = styled.span`
  font-size: 12px;
  color: #dc2626;
  margin-top: 4px;
`

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
`

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
`

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
`

const ModalContent = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  padding: 32px;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
`

const ModalIconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin: 0 auto 16px;
  background-color: ${(props) => props.bgColor || "#f0f0f0"};

  svg {
    width: 48px;
    height: 48px;
  }
`

const ModalTitle = styled.h3`
  font-size: 20px;
  font-weight: bold;
  color: #000000;
  margin: 0 0 12px 0;
`

const ModalMessage = styled.p`
  font-size: 14px;
  color: #4b5563;
  margin: 0 0 24px 0;
  line-height: 1.6;
`

const ModalButton = styled.button`
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  background-color: #0d9488;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;

  &:hover {
    background-color: #0d7a72;
  }
`

const ModalButtonError = styled(ModalButton)`
  background-color: #dc2626;

  &:hover {
    background-color: #b91c1c;
  }
`

// Main Component
export default function ResetPassword() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    })

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [showMismatchModal, setShowMismatchModal] = useState(false)
    const [showErrorModal, setShowErrorModal] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    const validatePassword = (value) => {
        if (!value.trim()) return "La contraseña es requerida"
        if (value.length < 6) return "La contraseña debe tener al menos 6 caracteres"
        return ""
    }

    const validateConfirmPassword = (value, password) => {
        if (!value.trim()) return "Confirmar contraseña es requerido"
        if (value !== password) return "Las contraseñas no coinciden"
        return ""
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })

        if (errors[name]) {
            setErrors({ ...errors, [name]: "" })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Validate passwords
        const newErrors = {}

        if (validatePassword(formData.password)) {
            newErrors.password = validatePassword(formData.password)
        }

        if (validateConfirmPassword(formData.confirmPassword, formData.password)) {
            newErrors.confirmPassword = validateConfirmPassword(formData.confirmPassword, formData.password)
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        if (formData.password !== formData.confirmPassword) {
            setShowMismatchModal(true)
            return
        }

        setIsLoading(true)

        const resetToken = localStorage.getItem("resetToken")

        if (!resetToken) {
            setErrorMessage("No se encontró el token de recuperación. Por favor inicia el proceso nuevamente.")
            setShowErrorModal(true)
            setIsLoading(false)
            return
        }

        try {
            // Actualizar contraseña en el backend
            await apiService.post('/users/reset-password', {
                resetToken,
                nuevaContrasena: formData.password,
                nuevaContrasena2: formData.confirmPassword
            })

            // Clear localStorage
            localStorage.removeItem("recoveryEmail")
            localStorage.removeItem("verificationCode")
            localStorage.removeItem("resetToken")
            localStorage.removeItem("resendCodeEndTime")
            localStorage.removeItem("resendCodeCount")
            
            setShowSuccessModal(true)
        } catch (error) {
            console.error("Error al actualizar contraseña:", error)
            const errorMsg = error?.message || "Error al actualizar la contraseña. Por favor intenta de nuevo."
            setErrorMessage(errorMsg)
            setShowErrorModal(true)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSuccessModalClick = () => {
        navigate("/login")
    }

    const handleMismatchModalClick = () => {
        setShowMismatchModal(false)
    }

    const handleErrorModalClick = () => {
        setShowErrorModal(false)
    }

    const handleLoginClick = () => {
        navigate("/login")
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword)
    }

    return (
        <PageContainer>
            {/* Header */}
            <Header>
                <Logo>HuilApp</Logo>
                <NavButton onClick={handleLoginClick}>Iniciar sesión</NavButton>
            </Header>

            {/* Main Content */}
            <ResetContainer>
                {/* Form Section */}
                <FormSection>
                    <Form onSubmit={handleSubmit}>
                        <FormTitle>Crear nueva contraseña</FormTitle>
                        <FormDescription>Introduce una nueva contraseña</FormDescription>

                        {/* Password Input */}
                        <InputGroup>
                            <Label htmlFor="password">Contraseña</Label>
                            <PasswordInputWrapper>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
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
                            {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
                        </InputGroup>

                        {/* Confirm Password Input */}
                        <InputGroup>
                            <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                            <PasswordInputWrapper>
                                <PasswordInput
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
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
                            {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword}</ErrorMessage>}
                        </InputGroup>

                        {/* Submit Button */}
                        <SubmitButton type="submit" disabled={isLoading}>
                            {isLoading ? "Cargando..." : "Enviar"}
                        </SubmitButton>
                    </Form>
                </FormSection>

                {/* Image Section */}
                <ImageSection />
            </ResetContainer>

            {/* Success Modal */}
            {showSuccessModal && (
                <ModalOverlay onClick={(e) => e.stopPropagation()}>
                    <ModalContent onClick={(e) => e.stopPropagation()}>
                        <ModalIconContainer bgColor="#e0f2fe">
                            <CheckCircle color="#0d9488" />
                        </ModalIconContainer>
                        <ModalTitle>Contraseña actualizada correctamente</ModalTitle>
                        <ModalMessage>Tu contraseña ha sido cambiada exitosamente</ModalMessage>
                        <ModalButton onClick={handleSuccessModalClick}>Ir a iniciar sesión</ModalButton>
                    </ModalContent>
                </ModalOverlay>
            )}

            {/* Mismatch Modal */}
            {showMismatchModal && (
                <ModalOverlay onClick={(e) => e.stopPropagation()}>
                    <ModalContent onClick={(e) => e.stopPropagation()}>
                        <ModalIconContainer bgColor="#fee2e2">
                            <XCircle color="#dc2626" />
                        </ModalIconContainer>
                        <ModalTitle>Las contraseñas no coinciden</ModalTitle>
                        <ModalMessage>Por favor verifica que ambas contraseñas sean iguales</ModalMessage>
                        <ModalButtonError onClick={handleMismatchModalClick}>Aceptar</ModalButtonError>
                    </ModalContent>
                </ModalOverlay>
            )}

            {/* Error Modal */}
            {showErrorModal && (
                <ModalOverlay onClick={(e) => e.stopPropagation()}>
                    <ModalContent onClick={(e) => e.stopPropagation()}>
                        <ModalIconContainer bgColor="#fee2e2">
                            <XCircle color="#dc2626" />
                        </ModalIconContainer>
                        <ModalTitle>Error al actualizar</ModalTitle>
                        <ModalMessage>{errorMessage}</ModalMessage>
                        <ModalButtonError onClick={handleErrorModalClick}>Aceptar</ModalButtonError>
                    </ModalContent>
                </ModalOverlay>
            )}
        </PageContainer>
    )
}
