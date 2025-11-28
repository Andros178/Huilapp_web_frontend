"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Mail, XCircle } from "lucide-react"
import styled from "styled-components"
import apiService from "../services/api.service"
import ImgMitad from '../assets/mitad.png';

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

const RecoverContainer = styled.div`
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

const FormSubtitle = styled.p`
  font-size: 16px;
  color: #4b5563;
  margin: 0 0 30px 0;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 14px;
  }
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
`

const ImageSection = styled.div`
  flex: 0 0 60%;
  background: url(${ImgMitad}) center / contain no-repeat;
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
  margin: 0 0 12px 0;
  line-height: 1.6;
`

const ModalSubtext = styled.p`
  font-size: 13px;
  color: #4b5563;
  margin: 0 0 24px 0;
  line-height: 1.6;

  span {
    color: #0d9488;
    font-weight: 600;
  }
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
export default function RecoverPassword() {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [showErrorModal, setShowErrorModal] = useState(false)

    const validateEmail = (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Reset errors
        const newErrors = {}

        // Validate email
        if (!email.trim()) {
            newErrors.email = "El correo electrónico es requerido"
        } else if (!validateEmail(email)) {
            newErrors.email = "Por favor ingresa un correo electrónico válido"
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        setErrors({})
        setIsLoading(true)

        try {
            // Solicitar restablecimiento de contraseña al backend
            await apiService.post('/users/request-password-reset', { email })

            // Save email and code to localStorage
            localStorage.setItem("recoveryEmail", email)

            setShowSuccessModal(true)
        } catch (error) {
            console.error("Error al verificar email:", error)
            // El backend devuelve "Usuario no encontrado" si no existe
            setShowErrorModal(true)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSuccessModalClick = () => {
        navigate("/verify-code")
    }

    const handleErrorModalClick = () => {
        setShowErrorModal(false)
    }

    const handleLoginClick = () => {
        navigate("/login")
    }

    return (
        <PageContainer>
            {/* Header */}
            <Header>
                <Logo>HuilApp</Logo>
                <NavButton onClick={handleLoginClick}>Iniciar sesión</NavButton>
            </Header>

            {/* Main Content */}
            <RecoverContainer>
                {/* Form Section */}
                <FormSection>
                    <Form onSubmit={handleSubmit}>
                        <FormTitle>Recuperar contraseña</FormTitle>
                        <FormSubtitle>Introduce tu correo electrónico para recuperar tu contraseña</FormSubtitle>

                        {/* Email Input */}
                        <InputGroup>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Ingresa el correo electrónico"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value)
                                    if (errors.email) {
                                        setErrors({ ...errors, email: "" })
                                    }
                                }}
                            />
                            {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
                        </InputGroup>

                        {/* Submit Button */}
                        <SubmitButton type="submit" disabled={isLoading}>
                            {isLoading ? "Cargando..." : "Enviar código"}
                        </SubmitButton>

                        {/* Login Link */}
                        <LoginPrompt>
                            ¿Ya tienes una cuenta? <span onClick={handleLoginClick}>Inicia sesión</span>
                        </LoginPrompt>
                    </Form>
                </FormSection>

                {/* Image Section */}
                <ImageSection />
            </RecoverContainer>

            {/* Success Modal */}
            {showSuccessModal && (
                <ModalOverlay onClick={(e) => e.stopPropagation()}>
                    <ModalContent onClick={(e) => e.stopPropagation()}>
                        <ModalIconContainer bgColor="#e0f2fe">
                            <Mail color="#0d9488" />
                        </ModalIconContainer>
                        <ModalTitle>Revisa tu correo electrónico</ModalTitle>
                        <ModalMessage>Hemos enviado un código para recuperar la contraseña a tu correo electrónico</ModalMessage>
                        <ModalSubtext>
                            El código llegará en un máximo de <span>30 segundos</span>
                        </ModalSubtext>
                        <ModalButton onClick={handleSuccessModalClick}>Aceptar</ModalButton>
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
                        <ModalTitle>Email no encontrado</ModalTitle>
                        <ModalMessage>El correo electrónico ingresado no está registrado en el sistema</ModalMessage>
                        <ModalButtonError onClick={handleErrorModalClick}>Aceptar</ModalButtonError>
                    </ModalContent>
                </ModalOverlay>
            )}
        </PageContainer>
    )
}