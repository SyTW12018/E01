import React, { Component } from 'react';
import { Link, Route, Switch  } from 'react-router-dom'
import { Container } from 'semantic-ui-react'
import SemanticUIExample from '../SemanticUIExample/SemanticUIExample.js'
// import logo from './logo.svg';
import './LandingPage.css';
import Pagina1 from './Pagina1';
import Pagina2 from './Pagina2';

class ReactRouter extends Component { //class LandingPage extends Component {
  render() {
    return (
      <div className ='LandingPage'>
        <header className='LandingPage-header'>
          <nav>
            <ul>
              <li><Link to='/'>ReactRouter</Link></li>
              <li><Link to='/pagina1'>Pagina1</Link></li>
              <li><Link to='/pagina2'>Pagina2</Link></li>
            </ul>
          </nav>
          <Switch>
            <Route path='/pagina1' component={Pagina1} />
            <Route path='/pagina2' component={Pagina2} />
          </Switch>
          <Body />
        </header> 
        </div>
    );
  }
}

export default ReactRouter;

const Body = () => (
  <div>
      <Route exact={true} path="/" render={() => ( //
            <div>
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
            </div>
          )}/>
  </div>
)


