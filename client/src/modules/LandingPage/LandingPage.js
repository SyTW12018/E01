import React, { Component } from 'react';
import { Container } from 'semantic-ui-react'
import SemanticUIExample from '../SemanticUIExample/SemanticUIExample.js'
// import logo from './logo.svg';
import './LandingPage.css';

class LandingPage extends Component {
  render() {
    return (
      <div className='LandingPage'>
        <header className='LandingPage-header'>
          <p>
            Videocon.io landing page (WIP)
          </p>
          <a
            className='LandingPage-link'
            href='https://github.com/SyTW12018/E01-videocon'
            target='_blank'
            rel='noopener noreferrer'
          >
            GitHub
          </a>
		  <Container className='LandingPage-semantic-example'>
			<SemanticUIExample />
		  </Container>
        </header>
      </div>
    );
  }
}

export default LandingPage;
