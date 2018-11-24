import React from 'react'
import { Route } from 'react-router-dom'

const Pagina2 = () => (
    <div>
        <Route exact={true} path="/pagina2" render={() => (
            <h1>PAGINA 2</h1>
        )}/>
    </div>
)
export default Pagina2;