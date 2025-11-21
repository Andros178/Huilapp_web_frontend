import React from 'react';
import styled from 'styled-components';
import AddSiteForm from './AddSiteForm';
import { useNavigate } from 'react-router-dom';

export default function AddSite() {
  const navigate = useNavigate();
  return (
    <Page>
      <Card>
        <h2>Registrar un sitio</h2>
        <AddSiteForm onSuccess={() => navigate('/maps')} onCancel={() => navigate(-1)} />
      </Card>
    </Page>
  );
}

const Page = styled.div`
  padding: 20px;
`;

const Card = styled.div`
  max-width: 820px;
  margin: 0 auto;
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.06);
`;
