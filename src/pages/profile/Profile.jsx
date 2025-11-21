import { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

// ICONOS WEB (equivalentes)
import { AiOutlineEdit, AiOutlineLogout, AiOutlineMail } from "react-icons/ai";
import { IoLockClosedOutline } from "react-icons/io5";
import { FiHelpCircle } from "react-icons/fi";
import { MdDescription } from "react-icons/md";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "", email: "", image: null });
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
    {
      id: 5,
      icon: <AiOutlineLogout size={22} />,
      label: "Cerrar sesión",
      screen: "logout",
    },
  ];

  return (
    <Container>
      <Card>
        <HeaderTitle>Perfil</HeaderTitle>

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

        {/* MODAL LOGOUT */}
        {showModal && (
          <ModalOverlay>
            <ModalCard>
              <ModalTitle>Cerrar sesión</ModalTitle>
              <ModalMessage>
                ¿Estás seguro de que deseas cerrar sesión?
              </ModalMessage>

              <ModalButtons>
                <CancelBtn onClick={() => setShowModal(false)}>
                  Cancelar
                </CancelBtn>

                <LogoutBtn
                  onClick={() => {
                    // Aquí va tu función logout
                    navigate("/login");
                  }}
                >
                  Cerrar sesión
                </LogoutBtn>
              </ModalButtons>
            </ModalCard>
          </ModalOverlay>
        )}
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

const UserInfo = styled.div`
  text-align: center;
  margin-bottom: 25px;
`;

const ProfileImg = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 100%;
  border: 3px solid #c1dcd9;
  object-fit: cover;
  margin-bottom: 12px;
`;

const Placeholder = styled.div`
  width: 150px;
  height: 150px;
  border-radius: 100%;
  background: #c1dcd9;
  margin: auto;
  margin-bottom: 12px;
`;

const UserName = styled.h3`
  font-size: 19px;
  color: #000;
`;

const UserEmail = styled.p`
  font-size: 15px;
  color: #777;
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

/* Modal */

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalCard = styled.div`
  width: 90%;
  max-width: 380px;
  padding: 25px;
  background: #fff;
  border-radius: 18px;
`;

const ModalTitle = styled.h3`
  font-size: 20px;
  text-align: center;
  margin-bottom: 10px;
`;

const ModalMessage = styled.p`
  text-align: center;
  color: #555;
  margin-bottom: 25px;
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const CancelBtn = styled.button`
  flex: 1;
  padding: 10px;
  border-radius: 12px;
  background: #c1dcd9;
  border: none;
  cursor: pointer;
`;

const LogoutBtn = styled.button`
  flex: 1;
  padding: 10px;
  border-radius: 12px;
  background: #ff342b;
  color: white;
  border: none;
  cursor: pointer;
`;
