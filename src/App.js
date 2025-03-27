import Register from "./components/Register";
import ipConfig from "./ipConfig.json";
import "./App.css";
import Login from "./components/Login";
import Products from "./components/Products";
import Checkout from "./components/Checkout";
import Thanks from "./components/Thanks";
import theme from "../src/theme";
import { Route, Switch } from "react-router-dom";

export const config = {
  // endpoint: `http://${ipConfig.workspaceIp}:8082/api/v1`,
  endpoint: ` https://qkart-backend-9wnz.onrender.com/api/v1`,
 
};


function App() {
  return (
    <div className="App">
          <div className="registerContainer">
          {/* <Register /> */}
            <Switch>
              {/* <Redirect strict from="/one/" to="/home" /> */}
              <Route exact path="/">
              <Products/>
              </Route>
              <Route path="/register">
                <Register />
              </Route>
              <Route path="/login">
              <Login />
              </Route>
              <Route path="/checkout">
              <Checkout />
              </Route>
              <Route path="/thanks">
              <Thanks />
              </Route>
            </Switch>
          </div>
      </div>
)}

export default App;



