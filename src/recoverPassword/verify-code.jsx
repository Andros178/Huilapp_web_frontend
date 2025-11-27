"use client"

import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { CheckCircle, XCircle, Mail } from "lucide-react"
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

const VerifyContainer = styled.div`
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

const CodeInputContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    gap: 8px;
    margin-bottom: 20px;
  }
`

const CodeInput = styled.input`
  width: 60px;
  height: 60px;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
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
    width: 50px;
    height: 50px;
    font-size: 20px;
  }
`

const ResendLink = styled.div`
  text-align: center;
  margin-bottom: 24px;
  font-size: 14px;
  color: #4b5563;

  span {
    color: #0d9488;
    text-decoration: none;
    cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
    font-weight: 600;
    opacity: ${props => props.$disabled ? '0.5' : '1'};

    &:hover {
      opacity: ${props => props.$disabled ? '0.5' : '0.8'};
    }
  }
`

const TimerContainer = styled.div`
  text-align: center;
  margin-bottom: 16px;
  padding: 12px;
  background-color: #f0fdfa;
  border-radius: 8px;
  border: 1px solid #0d9488;
`

const TimerText = styled.p`
  font-size: 14px;
  color: #0d9488;
  font-weight: 600;
  margin: 0;
  
  span {
    font-size: 18px;
    font-weight: bold;
  }
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
  background: url('/src/assets/images/woman-going-work-bicycle.jpg') center / contain no-repeat;
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
export default function VerifyCode() {
    const navigate = useNavigate()
    const [code, setCode] = useState(["", "", "", ""])
    const [isLoading, setIsLoading] = useState(false)
    const [showSuccessModal, setShowSuccessModal] = useState(false)
    const [showErrorModal, setShowErrorModal] = useState(false)
    const [showResendModal, setShowResendModal] = useState(false)
    const [resendCount, setResendCount] = useState(0)
    const [timeRemaining, setTimeRemaining] = useState(0)
    const [canResend, setCanResend] = useState(true)
    const inputRefs = useRef([])

    // Cargar el estado del timer al montar el componente
    useEffect(() => {
        const savedEndTime = localStorage.getItem("resendCodeEndTime")
        const savedResendCount = localStorage.getItem("resendCodeCount")
        
        if (savedEndTime) {
            const endTime = parseInt(savedEndTime, 10)
            const currentTime = Date.now()
            const remainingTime = Math.floor((endTime - currentTime) / 1000)
            
            if (remainingTime > 0) {
                setTimeRemaining(remainingTime)
                setCanResend(false)
            } else {
                // El tiempo ya expiró, limpiar localStorage
                localStorage.removeItem("resendCodeEndTime")
                setCanResend(true)
            }
        }
        
        if (savedResendCount) {
            setResendCount(parseInt(savedResendCount, 10))
        }
        
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus()
        }
    }, [])

    // Timer effect
    useEffect(() => {
        let interval = null
        
        if (timeRemaining > 0) {
            interval = setInterval(() => {
                setTimeRemaining((prevTime) => {
                    if (prevTime <= 1) {
                        setCanResend(true)
                        // Limpiar localStorage cuando el timer expira
                        localStorage.removeItem("resendCodeEndTime")
                        return 0
                    }
                    return prevTime - 1
                })
            }, 1000)
        }

        return () => {
            if (interval) clearInterval(interval)
        }
    }, [timeRemaining])

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${minutes}:${secs.toString().padStart(2, '0')}`
    }

    const handleCodeChange = (index, value) => {
        // Only allow numeric input
        if (!/^\d*$/.test(value)) return

        const newCode = [...code]
        newCode[index] = value.slice(-1) // Only keep last character if pasted

        setCode(newCode)

        // Auto-focus to next input
        if (value && index < 3) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace") {
            if (code[index]) {
                const newCode = [...code]
                newCode[index] = ""
                setCode(newCode)
            } else if (index > 0) {
                inputRefs.current[index - 1]?.focus()
            }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Check if all fields are filled
        if (code.some((digit) => !digit)) {
            return
        }

        setIsLoading(true)

        const email = localStorage.getItem("recoveryEmail")
        const enteredCode = code.join("")

        try {
            // Verificar código con el backend
            await apiService.post('/users/reset-password', {
                email,
                codigo: enteredCode
            })

            // Si llega aquí, el código es válido
            setShowSuccessModal(true)
        } catch (error) {
            console.error("Error al verificar código:", error)
            setShowErrorModal(true)
            // Clear inputs on error
            setCode(["", "", "", ""])
            inputRefs.current[0]?.focus()
        } finally {
            setIsLoading(false)
        }
    }

    const handleSuccessModalClick = () => {
        navigate("/reset-password")
    }

    const handleErrorModalClick = () => {
        setShowErrorModal(false)
    }

    const handleResendCode = async () => {
        if (!canResend) return

        const email = localStorage.getItem("recoveryEmail")
        
        try {
            await apiService.post('/users/request-password-reset', { email })
            
            // Generate new code for console (temporal)
            const newVerificationCode = Math.floor(Math.random() * 10000)
                .toString()
                .padStart(4, "0")
            console.log("Código de verificación (reenviado):", newVerificationCode)
            localStorage.setItem("verificationCode", newVerificationCode)
            
            // Incrementar contador y activar timer de 5 minutos (300 segundos)
            const newResendCount = resendCount + 1
            setResendCount(newResendCount)
            localStorage.setItem("resendCodeCount", newResendCount.toString())
            
            if (newResendCount >= 1) {
                const endTime = Date.now() + (300 * 1000) // 5 minutos en milisegundos
                localStorage.setItem("resendCodeEndTime", endTime.toString())
                setTimeRemaining(300) // 5 minutos
                setCanResend(false)
            }
            
            // Mostrar modal de código reenviado
            setShowResendModal(true)
        } catch (error) {
            console.error("Error al reenviar código:", error)
        }
    }

    const handleResendModalClick = () => {
        setShowResendModal(false)
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
            <VerifyContainer>
                {/* Form Section */}
                <FormSection>
                    <Form onSubmit={handleSubmit}>
                        <FormTitle>Código de verificación</FormTitle>
                        <FormDescription>Se ha enviado un código de 4 dígitos a tu correo electrónico</FormDescription>

                        {/* Code Input Boxes */}
                        <CodeInputContainer>
                            {code.map((digit, index) => (
                                <CodeInput
                                    key={index}
                                    ref={(el) => (inputRefs.current[index] = el)}
                                    type="text"
                                    maxLength="1"
                                    value={digit}
                                    onChange={(e) => handleCodeChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    placeholder="0"
                                />
                            ))}
                        </CodeInputContainer>

                        {/* Resend Link */}
                        <ResendLink $disabled={!canResend}>
                            ¿No recibiste el código? <span onClick={handleResendCode}>Reenviar código</span>
                        </ResendLink>

                        {/* Timer Display */}
                        {timeRemaining > 0 && (
                            <TimerContainer>
                                <TimerText>
                                    Podrás solicitar un nuevo código en <span>{formatTime(timeRemaining)}</span>
                                </TimerText>
                            </TimerContainer>
                        )}

                        {/* Submit Button */}
                        <SubmitButton type="submit" disabled={isLoading || code.some((digit) => !digit)}>
                            {isLoading ? "Verificando..." : "Verificar"}
                        </SubmitButton>
                    </Form>
                </FormSection>

                {/* Image Section */}
                <ImageSection />
            </VerifyContainer>

            {/* Success Modal */}
            {showSuccessModal && (
                <ModalOverlay onClick={(e) => e.stopPropagation()}>
                    <ModalContent onClick={(e) => e.stopPropagation()}>
                        <ModalIconContainer bgColor="#e0f2fe">
                            <CheckCircle color="#0d9488" />
                        </ModalIconContainer>
                        <ModalTitle>Código verificado correctamente</ModalTitle>
                        <ModalMessage>Tu código ha sido validado exitosamente</ModalMessage>
                        <ModalButton onClick={handleSuccessModalClick}>Continuar</ModalButton>
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
                        <ModalTitle>Código incorrecto</ModalTitle>
                        <ModalMessage>El código ingresado no es válido. Por favor verifica e intenta nuevamente</ModalMessage>
                        <ModalButtonError onClick={handleErrorModalClick}>Aceptar</ModalButtonError>
                    </ModalContent>
                </ModalOverlay>
            )}

            {/* Resend Code Modal */}
            {showResendModal && (
                <ModalOverlay onClick={(e) => e.stopPropagation()}>
                    <ModalContent onClick={(e) => e.stopPropagation()}>
                        <ModalIconContainer bgColor="#e0f2fe">
                            <Mail color="#0d9488" />
                        </ModalIconContainer>
                        <ModalTitle>Revisa tu correo electrónico</ModalTitle>
                        <ModalMessage>Hemos enviado un código para recuperar la contraseña a tu correo electrónico</ModalMessage>
                        <ModalMessage style={{ marginTop: '8px', marginBottom: '24px' }}>
                            El código llegará en un máximo de <span style={{ color: '#0d9488', fontWeight: 600 }}>30 segundos</span>
                        </ModalMessage>
                        <ModalButton onClick={handleResendModalClick}>Aceptar</ModalButton>
                    </ModalContent>
                </ModalOverlay>
            )}
        </PageContainer>
    )
}
