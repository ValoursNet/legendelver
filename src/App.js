import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Home, Controller, Screen } from "./components";
function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/" exact component={() => <Home />} />
          <Route path="/controller" exact component={() => <Controller />} />
          <Route path="/screen" exact component={() => <Screen />} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
