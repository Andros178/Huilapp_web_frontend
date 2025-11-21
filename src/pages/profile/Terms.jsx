import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FiArrowLeft } from "react-icons/fi";

const Terms = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <Card>
        <Header>
          <BackButton onClick={() => navigate("/profile")}>
            <FiArrowLeft />
          </BackButton>
          <Title>Términos y Condiciones</Title>
        </Header>

        <Divider />

        <Section>
          <SectionTitle>Política de privacidad</SectionTitle>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
            pellentesque congue lorem, vel tincidunt tortor placerat a.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
            pellentesque congue lorem, vel tincidunt tortor placerat a.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
            pellentesque congue lorem, vel tincidunt tortor placerat a.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
            pellentesque congue lorem, vel tincidunt tortor placerat a.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
            pellentesque congue lorem, vel tincidunt tortor placerat a.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
            pellentesque congue lorem, vel tincidunt tortor placerat a.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
            pellentesque congue lorem, vel tincidunt tortor placerat a.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
            pellentesque congue lorem, vel tincidunt tortor placerat a.
          </Text>
                    <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
            pellentesque congue lorem, vel tincidunt tortor placerat a.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
            pellentesque congue lorem, vel tincidunt tortor placerat a.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
            pellentesque congue lorem, vel tincidunt tortor placerat a.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
            pellentesque congue lorem, vel tincidunt tortor placerat a.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
            pellentesque congue lorem, vel tincidunt tortor placerat a.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
            pellentesque congue lorem, vel tincidunt tortor placerat a.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
            pellentesque congue lorem, vel tincidunt tortor placerat a.
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
            pellentesque congue lorem, vel tincidunt tortor placerat a.
          </Text>
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
            pellentesque congue lorem, vel tincidunt tortor placerat a.
          </Text>
        </Section>

        <Section>
          <SectionTitle>Términos y condiciones</SectionTitle>

          <List>
            <ListItem>
              <Bullet>1.</Bullet> Lorem ipsum dolor sit ametLorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
            pellentesque congue lorem, vel tincidunt tortor placerat a.
            </ListItem>
            <ListItem>
              <Bullet>2.</Bullet> Lorem ipsum dolor sit amet.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
            pellentesque congue lorem, vel tincidunt tortor placerat a.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
            pellentesque congue lorem, vel tincidunt tortor placerat a.
            </ListItem>
            <ListItem>
              <Bullet>3.</Bullet> Lorem ipsum dolor sit ametLorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
            pellentesque congue lorem, vel tincidunt tortor placerat a.
            </ListItem>
            <ListItem>
              <Bullet>4.</Bullet> Lorem ipsum dolor sit ametLorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
            pellentesque congue lorem, vel tincidunt tortor placerat a.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
            pellentesque congue lorem, vel tincidunt tortor placerat a.
            </ListItem>
            <ListItem>
              <Bullet>5.</Bullet> Lorem ipsum dolor sit ameLorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
            pellentesque congue lorem, vel tincidunt tortor placerat a.
            </ListItem>
          </List>
        </Section>

        <FooterNote>
          Al usar esta aplicación aceptas nuestras políticas y condiciones
          descritas anteriormente.
        </FooterNote>
      </Card>
    </Container>
  );
};

export default Terms;

/* ========== ESTILOS ========== */

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: 40px 20px;
`;

const Card = styled.div`
  width: 100%;
  max-width: 860px;
  background: #ffffff;
  padding: 40px 50px;
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.06);
  animation: fadeIn 0.4s ease;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 600px) {
    padding: 30px 20px;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
`;

const BackButton = styled.button`
  background: #eef8f7;
  padding: 12px 14px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 18px;
  transition: 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background: #dff3f1;
    transform: translateX(-3px);
  }
`;

const Title = styled.h1`
  flex: 1;
  text-align: center;
  font-size: 28px;
  font-weight: 700;
  color: #004c46;

  @media (max-width: 600px) {
    font-size: 24px;
  }
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  margin: 25px 0;
  background: #e5e5e5;
`;

const Section = styled.section`
  margin-bottom: 28px;
`;

const SectionTitle = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: #008073;
  margin-bottom: 12px;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 45px;
    height: 4px;
    background: #00a38c;
    border-radius: 2px;
  }
`;

const Text = styled.p`
  font-size: 16px;
  color: #444;
  line-height: 1.65;
  margin-bottom: 12px;
`;

const List = styled.ul`
  margin-top: 10px;
`;

const ListItem = styled.li`
  display: flex;
  align-items: flex-start;
  color: #444;
  font-size: 16px;
  line-height: 1.65;
  margin-bottom: 10px;
`;

const Bullet = styled.span`
  font-weight: 700;
  color: #00a38c;
  margin-right: 10px;
`;

const FooterNote = styled.p`
  margin-top: 30px;
  text-align: center;
  font-size: 14px;
  color: #777;
`;
