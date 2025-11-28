import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import styled from "styled-components";
import apiService from "../../services/api.service";
import { useAuth } from "../../context/AuthContext";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Security = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(null);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const validate = () => {
    let hasErrors = false;
    setErrors({});

    if (newPassword.length < 8 || newPassword.length > 20) {
      setErrors((prev) => ({
        ...prev,
        newPassword: "La contraseña debe tener entre 8 y 20 caracteres",
      }));
      hasErrors = true;
    }
    // Validar número
    else if (!/(?=.*[0-9])/.test(newPassword)) {
      setErrors((prev) => ({
        ...prev,
        newPassword: "La contraseña debe contener al menos un número",
      }));
      hasErrors = true;
    }
    // Validar carácter especial
    else if (!/(?=.*[!@#$%^&*])/.test(newPassword)) {
      setErrors((prev) => ({
        ...prev,
        newPassword:
          "La contraseña debe contener al menos un carácter especial (!@#$%^&*)",
      }));
      hasErrors = true;
    }

    if (confirmPassword !== newPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Las contraseñas no coinciden",
      }));
      hasErrors = true;
    }

    return !hasErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(null);
    if (!validate()) return;

    try {
      setSaving(true);
      await apiService.post("/users/change-password", {
        newPassword,
        newPassword2: confirmPassword,
      });
      setSuccess("Contraseña actualizada correctamente");
      setSuccessModalOpen(true);
      setNewPassword("");
      setConfirmPassword("");
      setErrors({});
    } catch (err) {
      setErrors((prev) => ({ ...prev, submit: err.message || "Error al actualizar contraseña" }));
    } finally {
      setSaving(false);
    }
  };

  const lengthMet = newPassword.length >= 8 && newPassword.length <= 20;
  const hasNumber = /(?=.*[0-9])/.test(newPassword);
  const hasSpecial = /(?=.*[!@#$%^&*])/.test(newPassword);
  const passwordsMatch = newPassword && confirmPassword === newPassword;
  const showMismatch = confirmPassword && newPassword !== confirmPassword;

  const isFormValid = lengthMet && hasNumber && hasSpecial && passwordsMatch;

  const strengthScore = [lengthMet, hasNumber, hasSpecial].reduce((s, v) => s + (v ? 1 : 0), 0);

  return (
    <Container>
      <Card>
        <HeaderTitle>Seguridad</HeaderTitle>

        <Content>
          <Right>
            <AvatarBox>
              {user?.profile_picture ? (
                <AvatarImg src={user.profile_picture} alt="avatar" />
              ) : (
                <AvatarInitial>{(user?.nombre || 'U').charAt(0).toUpperCase()}</AvatarInitial>
              )}
            </AvatarBox>
          </Right>
          <Left>
            <Form onSubmit={handleSubmit}>
              <Field>
                <Label data-required>Nueva contraseña</Label>
                <InputWrapper>
                  <Input
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Ingresa la nueva contraseña"
                  />
                  <EyeButton type="button" onClick={() => setShowNew((s) => !s)} aria-label={showNew ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
                    {showNew ? <AiOutlineEyeInvisible size={18} /> : <AiOutlineEye size={18} />}
                  </EyeButton>
                </InputWrapper>
                {errors.newPassword && <ErrorMsg>{errors.newPassword}</ErrorMsg>}
              </Field>

              <Field>
                <Label data-required>Confirmar contraseña</Label>
                <InputWrapper>
                  <Input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repite la nueva contraseña"
                  />
                  <EyeButton type="button" onClick={() => setShowConfirm((s) => !s)} aria-label={showConfirm ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
                    {showConfirm ? <AiOutlineEyeInvisible size={18} /> : <AiOutlineEye size={18} />}
                  </EyeButton>
                </InputWrapper>
                {(errors.confirmPassword || showMismatch) && (
                  <ErrorMsg>{errors.confirmPassword || 'Las contraseñas no coinciden'}</ErrorMsg>
                )}
              </Field>

              <ReqList>
                <Req met={lengthMet}>• Entre 8 y 20 caracteres</Req>
                <Req met={hasNumber}>• Contener al menos un número</Req>
                <Req met={hasSpecial}>• Contener al menos un carácter especial (!@#$%^&*)</Req>
              </ReqList>

              <StrengthBar>
                <StrengthFill score={strengthScore} />
                <StrengthText>{strengthScore === 0 ? 'Débil' : strengthScore === 1 ? 'Débil' : strengthScore === 2 ? 'Medio' : 'Fuerte'}</StrengthText>
              </StrengthBar>

              {errors.submit && <ErrorMsg>{errors.submit}</ErrorMsg>}
              {success && <SuccessMsg>{success}</SuccessMsg>}

              {successModalOpen && (
                <ModalOverlay onClick={() => setSuccessModalOpen(false)}>
                  <ModalBox onClick={(e) => e.stopPropagation()}>
                    <ModalTitle>Éxito</ModalTitle>
                    <ModalText>{success}</ModalText>
                    <ModalActions>
                      <ModalButton
                        onClick={() => {
                          setSuccessModalOpen(false);
                          navigate('/profile');
                        }}
                      >
                        Aceptar
                      </ModalButton>
                    </ModalActions>
                  </ModalBox>
                </ModalOverlay>
              )}

              <Buttons>
                <PrimaryButton
                  type="submit"
                  disabled={saving}
                  aria-disabled={!isFormValid || saving}
                >
                  {saving ? "Guardando..." : "Actualizar contraseña"}
                </PrimaryButton>
              </Buttons>
            </Form>
          </Left>
        </Content>
      </Card>
    </Container>
  );
};

export default Security;

/* --------------------- ESTILOS MEJORADOS --------------------- */

const Container = styled.div`
  display: flex;
  justify-content: center;
  padding: 40px 20px;
`;

const Card = styled.div`
  width: 100%;
  max-width: 880px;
  background: #fff;
  padding: 35px 40px;
  border-radius: 22px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.07);
  display: flex;
  flex-direction: column;
  gap: 35px;
`;

const HeaderTitle = styled.h2`
  text-align: center;
  font-size: 26px;
  font-weight: 700;
  color: #008073;
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 40px;

  @media (max-width: 920px) {
    grid-template-columns: 1fr;
  }
`;

/* --- PANEL DERECHO (AVATAR) --- */
const Right = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const AvatarBox = styled.div`
  width: 220px;
  height: 220px;
  border-radius: 16px;
  overflow: hidden;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 0 8px rgba(0,0,0,0.06);
`;

const AvatarImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const AvatarInitial = styled.div`
  font-size: 60px;
  font-weight: 700;
  color: #555;
`;

/* --- PANEL IZQUIERDO (FORMULARIO) --- */
const Left = styled.div`
  flex: 1;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 15px;
  font-weight: 500;
  color: #111827;
  display: inline-flex;
  align-items: center;

  &[data-required]::after {
    content: "*";
    color: #dc2626;
    margin-left: 6px;
    font-weight: 700;
    font-size: 14px;
    line-height: 1;
  }
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 40px 12px 14px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  background: #fafafa;
  font-size: 15px;
  transition: 0.2s ease;
  outline: none;
  -webkit-appearance: none;
  -moz-appearance: none;

  /* Hide native browser password reveal / autofill buttons */
  &::-ms-clear,
  &::-ms-reveal {
    display: none;
    width: 0;
    height: 0;
  }

  &::-webkit-credentials-auto-fill-button,
  &::-webkit-textfield-decoration-button {
    display: none !important;
    visibility: hidden !important;
    pointer-events: none !important;
    width: 0 !important;
    height: 0 !important;
  }

  &:focus {
    outline: none;
    border-color: #008073;
    background: #fff;
    box-shadow: 0 0 0 4px rgba(0, 128, 115, 0.12);
  }
`;

const EyeButton = styled.button`
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: #6b7280;
  cursor: pointer;
  outline: none;
  z-index: 2;

  /* ensure clickable area doesn't overlap with native buttons */
  padding: 6px;

  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

/* --- REQUISITOS --- */
const ReqList = styled.div`
  margin-top: 6px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Req = styled.div`
  font-size: 14px;
  color: ${(p) => (p.met ? "#059669" : "#9ca3af")};
  font-weight: ${(p) => (p.met ? "500" : "400")};
`;

/* --- BARRA DE FUERZA --- */
const StrengthBar = styled.div`
  margin-top: 8px;
  height: 12px;
  background: #e5e7eb;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
`;

const StrengthFill = styled.div`
  height: 100%;
  width: ${(p) => (p.score / 3) * 100}%;
  background: ${(p) =>
    p.score === 3
      ? "#10b981"
      : p.score === 2
      ? "#f59e0b"
      : "#ef4444"};
  transition: width 200ms ease, background 200ms ease;
`;

const StrengthText = styled.span`
  font-size: 13px;
  color: #374151;
  margin-left: 5px;
`;

/* --- BOTONES --- */
const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const PrimaryButton = styled.button`
  padding: 12px 16px;
  border-radius: 10px;
  background: #0d9488;
  color: #fff;
  border: none;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease;

  &:hover {
    background: #0f766e;
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

const ErrorMsg = styled.div`
  font-size: 13px;
  color: #dc2626;
`;

const SuccessMsg = styled.div`
  font-size: 13px;
  color: #059669;
`;

/* --- MODAL --- */
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
`;

const ModalBox = styled.div`
  background: #fff;
  padding: 28px;
  border-radius: 16px;
  width: 90%;
  max-width: 420px;
  box-shadow: 0 12px 35px rgba(0,0,0,0.15);
`;

const ModalTitle = styled.h3`
  font-size: 20px;
  margin-bottom: 10px;
  font-weight: 600;
`;

const ModalText = styled.p`
  color: #374151;
  margin-bottom: 20px;
  font-size: 15px;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const ModalButton = styled.button`
  padding: 10px 16px;
  background: #0d9488;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease;

  &:hover {
    background: #0f766e;
  }
`;
