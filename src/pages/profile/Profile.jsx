import { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// ICONOS WEB (equivalentes)
import { AiOutlineEdit, AiOutlineLogout, AiOutlineMail } from "react-icons/ai";
import { IoLockClosedOutline } from "react-icons/io5";
import { FiHelpCircle } from "react-icons/fi";
import { MdDescription } from "react-icons/md";

const Profile = () => {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const [showModal, setShowModal] = useState(false);

  // Opciones del menú
  const options = [
    {
      id: 1,
      icon: <AiOutlineEdit size={22} />,
      label: "Editar perfil",
      screen: "/editProfile",
    },
    {
      id: 2,
      icon: <IoLockClosedOutline size={22} />,
      label: "Seguridad",
      screen: "/Security",
    },
    {
      id: 3,
      icon: <FiHelpCircle size={22} />,
      label: "Ayuda y soporte",
      screen: "/help",
    },
    {
      id: 4,
      icon: <MdDescription size={22} />,
      label: "Términos y condiciones",
      screen: "/terms",
    },
  ];

  return (
    <Container>
      <Card>
        <HeaderTitle>Perfil</HeaderTitle>

        {/* USER INFO */}
        <ProfileHeader>
          <Avatar>
            {authUser?.profile_picture ? (
              <ProfileImg src={authUser.profile_picture} alt="avatar" />
            ) : (
              (authUser
                ? (authUser.nombre || authUser.name || "").charAt(0).toUpperCase()
                : "U")
            )}
          </Avatar>
          <UserInfo>
            <UserName>
              {((authUser?.nombre || authUser?.name) || "Usuario")}
              {authUser?.apellidos ? ` ${authUser.apellidos}` : ""}
            </UserName>
            <UserEmail>
              <AiOutlineMail size={14} style={{ marginRight: 8 }} />
              {authUser?.email || ""}
            </UserEmail>
          </UserInfo>
        </ProfileHeader>

        {/* OPTIONS */}
        {options.map((item) => (
          <OptionRow
            key={item.id}
            onClick={() =>
              item.screen === "logout"
                ? setShowModal(true)
                : navigate(item.screen)
            }
          >
            <Left>
              {item.icon}
              <Label>{item.label}</Label>
            </Left>
          </OptionRow>
        ))}
      </Card>
    </Container>
  );
};

export default Profile;

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

const OptionRow = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px 4px;
  cursor: pointer;
  border-bottom: 1px solid #eee;

  &:hover {
    background: #f6f6f6;
  }
`;

const Left = styled.div`
  display: flex;
  gap: 14px;
  align-items: center;
`;

const Label = styled.p`
  font-size: 16px;
  color: #333;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 8px 4px 18px 4px;
  border-bottom: 1px solid #eee;
  margin-bottom: 10px;
`;

const Avatar = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #333;
  font-size: 22px;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #111;
`;

const UserEmail = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #666;
  margin-top: 4px;
`;

const ProfileImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
`;