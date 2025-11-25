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
                <Label>Nueva contraseña</Label>
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
                <Label>Confirmar contraseña</Label>
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
                {errors.confirmPassword && <ErrorMsg>{errors.confirmPassword}</ErrorMsg>}
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
                <PrimaryButton type="submit" disabled={!isFormValid || saving} aria-disabled={!isFormValid || saving}>
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

/* --------------------- STYLED COMPONENTS --------------------- */

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background: #ffffff;
  display: flex;
  justify-content: center;
  padding: 40px 20px;
`;

const Card = styled.div`
  width: 100%;
  max-width: 580px;
  background: #fff;
  padding: 25px;
  border-radius: 18px;
  box-shadow: 0 6px 22px rgba(0, 0, 0, 0.06);
`;

const HeaderTitle = styled.h2`
  text-align: center;
  font-size: 22px;
  font-weight: 600;
  color: #000;
  margin-bottom: 25px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 14px;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 10px 36px 10px 12px; 
  border-radius: 8px;
  border: 1px solid #e6e6e6;
  font-size: 14px;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 6px;
`;

const PrimaryButton = styled.button`
  padding: 10px 14px;
  border-radius: 10px;
  background: #0d9488;
  color: #fff;
  border: none;
  cursor: pointer;
`;

const ErrorMsg = styled.div`
  color: #b91c1c;
  font-size: 13px;
`;

const SuccessMsg = styled.div`
  color: #065f46;
  font-size: 13px;
`;

const ReqList = styled.div`
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Req = styled.div`
  font-size: 13px;
  color: ${(p) => (p.met ? '#059669' : '#7a7a7a')};
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const EyeButton = styled.button`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  color: #6b6b6b;
  cursor: pointer;
`;

/* --- Success modal styles --- */
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const ModalBox = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
`;

const ModalTitle = styled.h3`
  margin: 0 0 8px 0;
`;

const ModalText = styled.p`
  margin: 0 0 16px 0;
  color: #333;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const ModalButton = styled.button`
  padding: 10px 14px;
  background: #0d9488;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
`;

/* --- Layout for form + avatar --- */
const Content = styled.div`
  display: flex;
  gap: 24px;
  align-items: flex-start;
  justify-content: space-between;

  @media (max-width: 820px) {
    flex-direction: column;
    gap: 16px;
    align-items: center;
  }
`;

const Left = styled.div`
  flex: 1;
`;

const Right = styled.div`
  width: 200px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 820px) {
    width: auto;
  }
`;

const AvatarBox = styled.div`
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  overflow: hidden;
  background: #f5f5f5;
`;

const AvatarImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const AvatarInitial = styled.div`
  font-size: 48px;
  font-weight: 700;
  color: #444;
`;

const AvatarActions = styled.div`
  margin-top: 12px;
  display: flex;
  justify-content: center;
`;

const EditProfileButton = styled.button`
  padding: 8px 12px;
  background: transparent;
  border: 1px solid #0d9488;
  color: #0d9488;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background: #0d9488;
    color: #fff;
  }
`;

/* Strength bar */
const StrengthBar = styled.div`
  margin-top: 8px;
  height: 10px;
  background: #e6e6e6;
  border-radius: 8px;
  position: relative;
  display: flex;
  align-items: center;
`;

const StrengthFill = styled.div`
  height: 100%;
  width: ${(p) => (p.score / 3) * 100}%;
  background: ${(p) => (p.score === 3 ? '#059669' : p.score === 2 ? '#f59e0b' : '#ef4444')};
  border-radius: 8px;
  transition: width 180ms ease, background 180ms ease;
`;

const StrengthText = styled.div`
  position: absolute;
  right: 8px;
  font-size: 12px;
  color: #333;
`;