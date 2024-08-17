import Register from "./components/Register";
import ipConfig from "./ipConfig.json";
import "./App.css";
import Login from "./components/Login";
import Products from "./components/Products";
import Checkout from "./components/Checkout";
import theme from "../src/theme";
import { Route, Switch } from "react-router-dom";

export const config = {
  endpoint: `http://localhost:8082/api/v1`,
};


function App() {
  return (
    <div className="App">
          <div className="registerContainer">
          {/* <Register /> */}
            <Switch>
              {/* <Redirect strict from="/one/" to="/home" /> */}
              <Route exact path="/home">
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
            </Switch>
        
          </div>
          
      {/* TODO: CRIO_TASK_MODULE_LOGIN - To add configure routes and their mapping */}
          {/* <Register /> */}
    </div>
  );
}

export default App;



