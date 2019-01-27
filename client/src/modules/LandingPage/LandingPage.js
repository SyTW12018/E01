import React from 'react';
import { Container } from 'semantic-ui-react';
import HeaderSection from './components/HeaderSection/HeaderSection';
import InfoSection from './components/InfoSection/InfoSection';
import FeaturesSection from './components/FeaturesSection/FeaturesSection';

const LandingPage = () => (
  <Container fluid>

    <HeaderSection />
    <InfoSection />
    <FeaturesSection />

  </Container>
);

export default LandingPage;
