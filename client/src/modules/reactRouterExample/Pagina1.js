import React from 'react'
import { Route } from 'react-router-dom'

const Pagina1 = () => (
    <div>
        <Route exact={true} path="/pagina1" render={() => (
            <h1>PAGINA 1</h1>
        )}/>
    </div>
)
export default Pagina1;