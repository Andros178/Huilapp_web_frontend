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
          <AvatarWrapper onClick={() => navigate("/editProfile")}> 
            <Avatar>
              {authUser?.profile_picture ? (
                <ProfileImg src={authUser.profile_picture} alt="avatar" />
              ) : (
                (authUser
                  ? (authUser.nombre || authUser.name || "").charAt(0).toUpperCase()
                  : "U")
              )}
            </Avatar>
            <EditOverlay title="Editar perfil">
              <AiOutlineEdit size={16} color="#fff" />
            </EditOverlay>
          </AvatarWrapper>

          <UserInfo>
            <UserName>
              {((authUser?.nombre || authUser?.name) || "Usuario")}
              {authUser?.apellidos ? ` ${authUser.apellidos}` : ""}
            </UserName>
            <UserMeta>
              <UserEmail>
                <AiOutlineMail size={14} style={{ marginRight: 8 }} />
                {authUser?.email || ""}
              </UserEmail>
              {authUser?.phone && <UserPhone>{authUser.phone}</UserPhone>}
            </UserMeta>
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
              <IconBubble>{item.icon}</IconBubble>
              <Label>{item.label}</Label>
            </Left>
            <Chevron />
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
  font-size: 25px;
  font-weight: 600;
  color: #008073;
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

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 12px;
    padding: 12px 4px 18px 4px;
  }
`;

const AvatarWrapper = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const Avatar = styled.div`
  width: 92px;
  height: 92px;
  border-radius: 50%;
  background: linear-gradient(180deg, #f7f8fb, #eef2f7);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #333;
  font-size: 28px;
  box-shadow: 0 6px 18px rgba(16, 24, 40, 0.06);
  overflow: hidden;

  @media (max-width: 600px) {
    width: 88px;
    height: 88px;
    font-size: 26px;
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;

  @media (max-width: 600px) {
    align-items: center;
  }
`;

const UserName = styled.div`
  font-size: 18px;
  font-weight: 600;
  color: #111;

  @media (max-width: 600px) {
    font-size: 17px;
  }
`;

const UserEmail = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #666;
  margin-top: 4px;

  @media (max-width: 600px) {
    justify-content: center;
  }
`;

const ProfileImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  display: block;
`;

const EditOverlay = styled.div`
  position: absolute;
  right: -4px;
  bottom: -4px;
  background: #008073;
  width: 36px;
  height: 36px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 18px rgba(43, 138, 239, 0.18);

  @media (max-width: 600px) {
    right: -6px;
    bottom: -6px;
    width: 34px;
    height: 34px;
  }
`;

const UserMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 6px;
`;

const UserPhone = styled.div`
  font-size: 13px;
  color: #777;
`;

const IconBubble = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #f6f8fb;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #008073;
`;

const Chevron = styled.div`
  width: 10px;
  height: 10px;
  transform: rotate(-45deg);
  border-right: 2px solid #cfcfcf;
  border-bottom: 2px solid #cfcfcf;
  margin-top: 8px;
`;