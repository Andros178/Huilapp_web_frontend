import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

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
      navigate('/profile');
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
              <EditPhotoButton type="button" onClick={() => fileInputRef.current?.click()}>
                Editar foto
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
            <Input name="nombre" value={form.nombre} onChange={handleChange} />
          </Field>

          <Field>
            <Label>Apellidos</Label>
            <Input name="apellidos" value={form.apellidos} onChange={handleChange} />
          </Field>

          <Field>
            <Label>Teléfono</Label>
            <Input name="telefono" value={form.telefono} onChange={handleChange} />
          </Field>

          <Field>
            <Label>Correo</Label>
            <Input name="email" value={form.email} onChange={handleChange} />
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

const Button = styled.button`
  padding: 10px 14px;
  border-radius: 10px;
  background: transparent;
  border: 1px solid #ccc;
  cursor: pointer;
`;

const PrimaryButton = styled(Button)`
  background: #0d9488;
  color: #fff;
  border: none;
`;

const ErrorMsg = styled.div`
  color: #b91c1c;
  font-size: 13px;
`;

const Content = styled.div`
  display: flex;
  gap: 22px;
  align-items: flex-start;
`;

const Left = styled.div`
  width: 160px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

const Right = styled.div`
  flex: 1;
`;

const AvatarBox = styled.div`
  width: 140px;
  height: 140px;
  border-radius: 12px;
  background: #f6f6f6;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
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

const EditPhotoButton = styled.button`
  position: absolute;
  bottom: 8px;
  left: 8px;
  right: 8px;
  padding: 6px;
  background: rgba(0,0,0,0.45);
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
`;

const PhotoActions = styled.div`
  display: flex;
  gap: 8px;
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
