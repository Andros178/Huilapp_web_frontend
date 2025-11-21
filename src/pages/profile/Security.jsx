import { useState } from "react";
import styled from "styled-components";
import apiService from "../../services/api.service";
import { useAuth } from "../../context/AuthContext";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Security = () => {
  const { user } = useAuth();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(null);
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

  return (
    <Container>
      <Card>
        <HeaderTitle>Seguridad</HeaderTitle>

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

          {errors.submit && <ErrorMsg>{errors.submit}</ErrorMsg>}
          {success && <SuccessMsg>{success}</SuccessMsg>}

          <Buttons>
            <PrimaryButton type="submit" disabled={saving}>
              {saving ? "Guardando..." : "Actualizar contraseña"}
            </PrimaryButton>
          </Buttons>
        </Form>
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
  padding: 10px 12px;
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
  right: 8px;
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  color: #6b6b6b;
  cursor: pointer;
`;