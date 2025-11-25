// @ts-nocheck
import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FiEdit } from 'react-icons/fi';

const EditProfile = () => {
  const navigate = useNavigate();
  const { user, updateProfile, refreshUser } = useAuth();

  const [form, setForm] = useState({
    nombre: "",
    apellidos: "",
    telefono: "",
    email: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef();
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [formErrors, setFormErrors] = useState({});


  useEffect(() => {
    if (user) {
      setForm({
        nombre: user.nombre || "",
        apellidos: user.apellidos || "",
        telefono: user.telefono || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // clear field error on change
    setFormErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!form.nombre || !form.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
      isValid = false;
    }

    if (!form.apellidos || !form.apellidos.trim()) {
      newErrors.apellidos = 'El apellido es obligatorio';
      isValid = false;
    }

    if (!form.email || !form.email.trim()) {
      newErrors.email = 'El correo es obligatorio';
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) {
        newErrors.email = 'Formato de correo inválido';
        isValid = false;
      }
    }

    if (!form.telefono || !form.telefono.trim()) {
      newErrors.telefono = 'El teléfono es obligatorio';
      isValid = false;
    } else {
      const phoneRegex = /^[0-9]+$/;
      if (!phoneRegex.test(form.telefono)) {
        newErrors.telefono = 'El teléfono solo debe contener números';
        isValid = false;
      }
    }

    setFormErrors(newErrors);
    return isValid;
  };

  const handleFileSelect = (e) => {
    const f = e.target.files && e.target.files[0];
    if (f) {
      setSelectedFile(f);
      const url = URL.createObjectURL(f);
      setPreviewUrl(url);
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (!user || !user.id) return setError("Usuario no encontrado");
    // validar campos antes de enviar
    if (!validateForm()) return;

    try {
      setSaving(true);
      // Si hay una imagen seleccionada, enviar FormData en una sola petición PUT
      if (selectedFile) {
        const API_URL = import.meta.env.VITE_API_URL || 'http://192.168.1.15:3000';
        const formData = new FormData();
        formData.append('profile_picture', selectedFile);
        formData.append('usuario', user.usuario || '');
        formData.append('email', form.email || user.email || '');
        formData.append('nombre', form.nombre || user.nombre || '');
        formData.append('apellidos', form.apellidos || user.apellidos || '');
        formData.append('telefono', form.telefono || user.telefono || '');

        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/users/${user.id}`, {
          method: 'PUT',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData,
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || data.message || 'Error al actualizar usuario');
        }

        // Refrescar usuario y limpiar selección
        if (typeof refreshUser === 'function') await refreshUser();
        setSelectedFile(null);
        setPreviewUrl(null);
      } else {
        const payload = {
          nombre: form.nombre,
          apellidos: form.apellidos,
          telefono: form.telefono,
          email: form.email,
        };

        await updateProfile(user.id, payload);
      }

      setSaving(false);
      setSuccessMessage('Datos actualizados correctamente');
      setSuccessModalOpen(true);
    } catch (err) {
      setSaving(false);
      setError(err.message || 'Error al actualizar');
    }
  };

  return (
    <Container>
      <Card>
        <HeaderTitle>Editar perfil</HeaderTitle>

        <Content>
          <Left>
            <AvatarBox>
              {previewUrl ? (
                <AvatarImg src={previewUrl} alt="avatar" />
              ) : user?.profile_picture ? (
                <AvatarImg src={user.profile_picture} alt="avatar" />
              ) : (
                <AvatarInitial>{(user?.nombre || 'U').charAt(0).toUpperCase()}</AvatarInitial>
              )}
              <EditPhotoButton type="button" onClick={() => fileInputRef.current?.click()} aria-label="Editar foto">
                <FiEdit size={18} />
              </EditPhotoButton>
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileSelect} />
            </AvatarBox>
            <PhotoActions>
              <SmallButton onClick={() => { setSelectedFile(null); setPreviewUrl(null); }}>Cancelar</SmallButton>
              <SmallNote>La foto se sube al guardar los cambios</SmallNote>
            </PhotoActions>
          </Left>

          <Right>
            <Form onSubmit={handleSubmit}>
          <Field>
            <Label>Nombre</Label>
            <Input id="nombre" name="nombre" value={form.nombre} onChange={handleChange} data-error={!!formErrors.nombre} aria-invalid={!!formErrors.nombre} aria-describedby={formErrors.nombre ? 'error-nombre' : undefined} />
            {formErrors.nombre && <FieldError id="error-nombre">{formErrors.nombre}</FieldError>}
          </Field>

          <Field>
            <Label>Apellidos</Label>
            <Input id="apellidos" name="apellidos" value={form.apellidos} onChange={handleChange} data-error={!!formErrors.apellidos} aria-invalid={!!formErrors.apellidos} aria-describedby={formErrors.apellidos ? 'error-apellidos' : undefined} />
            {formErrors.apellidos && <FieldError id="error-apellidos">{formErrors.apellidos}</FieldError>}
          </Field>

          <Field>
            <Label>Teléfono</Label>
            <Input id="telefono" name="telefono" value={form.telefono} onChange={handleChange} data-error={!!formErrors.telefono} aria-invalid={!!formErrors.telefono} aria-describedby={formErrors.telefono ? 'error-telefono' : undefined} />
            {formErrors.telefono && <FieldError id="error-telefono">{formErrors.telefono}</FieldError>}
          </Field>

          <Field>
            <Label>Correo</Label>
            <Input id="email" name="email" value={form.email} onChange={handleChange} data-error={!!formErrors.email} aria-invalid={!!formErrors.email} aria-describedby={formErrors.email ? 'error-email' : undefined} />
            {formErrors.email && <FieldError id="error-email">{formErrors.email}</FieldError>}
          </Field>

          {error && <ErrorMsg>{error}</ErrorMsg>}
          <Buttons>
            <Button type="button" onClick={() => navigate('/profile')} disabled={saving}>
              Cancelar
            </Button>
            <PrimaryButton type="submit" disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </PrimaryButton>
          </Buttons>
        </Form>
          </Right>
        </Content>
        {successModalOpen && (
          <ModalOverlay onClick={() => setSuccessModalOpen(false)}>
            <ModalBox onClick={(e) => e.stopPropagation()}>
              <ModalTitle>Éxito</ModalTitle>
              <ModalText>{successMessage}</ModalText>
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
      </Card>
    </Container>
  );
};

export default EditProfile;

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
  max-width: 760px;
  background: #fff;
  padding: 25px;
  border-radius: 18px;
  box-shadow: 0 6px 22px rgba(0, 0, 0, 0.06);

  @media (max-width: 768px) {
    padding: 18px;
    border-radius: 14px;
  }
`;

const HeaderTitle = styled.h2`
  text-align: center;
  font-size: 22px;
  font-weight: 600;
  color: #000;
  margin-bottom: 25px;

  @media (max-width: 480px) {
    font-size: 20px;
    margin-bottom: 18px;
  }
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
  outline: none;
  transition: box-shadow 120ms ease, border-color 120ms ease;

  &:focus {
    box-shadow: 0 0 0 4px rgba(13,148,136,0.12);
    border-color: #0d9488;
  }

  /* when input has data-error attribute, show red border and red focus ring */
  &[data-error="true"] {
    border-color: #b91c1c;
  }

  &:focus[data-error="true"] {
    box-shadow: 0 0 0 4px rgba(185,28,28,0.08);
    border-color: #b91c1c;
  }
`;
// TypeScript: declare transient prop type for styled-components compatibility
// (If using TS, you can change to: const Input = styled.input<{ $error?: boolean }>`...` )

const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 6px;

  @media (max-width: 520px) {
    flex-direction: column-reverse;
    align-items: stretch;
    gap: 8px;
  }
`;

const Button = styled.button`
  padding: 10px 14px;
  border-radius: 10px;
  background: transparent;
  border: 1px solid #ccc;
  cursor: pointer;

  @media (max-width: 520px) {
    width: 100%;
  }
`;

const PrimaryButton = styled(Button)`
  background: #0d9488;
  color: #fff;
  border: none;

  @media (max-width: 520px) {
    width: 100%;
  }
`;

const ErrorMsg = styled.div`
  color: #b91c1c;
  font-size: 13px;
`;

const FieldError = styled.div`
  color: #b91c1c;
  font-size: 12px;
  margin-top: 6px;
`;

const Content = styled.div`
  display: flex;
  gap: 28px;
  align-items: flex-start;

  @media (max-width: 820px) {
    flex-direction: column;
    gap: 18px;
    align-items: center;
  }
`;

const Left = styled.div`
  width: 240px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;

  @media (max-width: 820px) {
    width: auto;
    align-items: center;
    margin: 0 auto;
  }
`;

const Right = styled.div`
  flex: 1;
  width: 100%;
`;

const AvatarBox = styled.div`
  width: 250px;
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;

  @media (max-width: 480px) {
    width: 140px;
    height: 140px;
  }
`;

const AvatarImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  border: 3px solid #32cfc0ff;
`;

const AvatarInitial = styled.div`
  font-size: 64px;
  font-weight: 700;
  color: #444;
  @media (max-width: 480px) {
    font-size: 28px;
  }
`;

const EditPhotoButton = styled.button`
  position: absolute;
  bottom: 12px;
  right: 12px;
  width: 44px;
  height: 44px;
  padding: 0;
  background: #0d9488;
  color: #fff;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 14px rgba(13,148,136,0.18);
  cursor: pointer;

  &:hover {
    background: #0b7b6f;
    transform: translateY(-1px);
  }

  svg {
    display: block;
  }
`;

/* smaller edit button on mobile */
const EditPhotoButtonMobile = styled(EditPhotoButton)`
  @media (max-width: 480px) {
    width: 36px;
    height: 36px;
    bottom: 8px;
    right: 8px;
  }
`;

const PhotoActions = styled.div`
  display: flex;
  gap: 8px;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
    gap: 6px;
  }
`;

const SmallButton = styled.button`
  padding: 8px 10px;
  border-radius: 8px;
  background: transparent;
  border: 1px solid #ccc;
  cursor: pointer;
`;

const SmallPrimary = styled(SmallButton)`
  background: #0d9488;
  color: #fff;
  border: none;
`;

const SmallNote = styled.div`
  font-size: 13px;
  color: #666;
  padding: 8px 6px;
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
