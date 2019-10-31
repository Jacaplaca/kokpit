import React from 'react'
import { BrowserRouter, Route } from "react-router-dom";
import MiniDrawer from "./MiniDrawer";
import ResetPassword from "./ResetPassword";
import Register from "./Register";
import Login from "./Login";


const Drawer = (props) => {
    return (
        <MiniDrawer {...props}>
            <Route
                path="/login"
                component={Login}
            />
            <Route path="/register" component={Register} />
            <Route path="/reset" component={ResetPassword} />
        </MiniDrawer>
    )
}

export default Drawer