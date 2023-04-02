import Register from "./components/Register";
import ipConfig from "./ipConfig.json";
import "./App.css";

export const config = {
  endpoint: `http://${ipConfig.workspaceIp}:8082/api/v1`,
};

function App() {
  return (
    <div className="App">
          <div className="registerContainer">
          <Register />
          </div>
          
    </div>
  );
}

export default App;
