import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Chat from "./components/Chat/Chat.js";
import Join from "./components/Join/Join.js";
import Create from "./components/Create";
import Home from "./components/Home/Home";
import LoginPage from "./components/LoginPage/LoginPage";

// import "./App.css";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          {/* <Form /> */}
          <LoginPage />
        </Route>
        <Route exact path="/home">
          <Home />
        </Route>
        <Route path="/join">
          <Join />
        </Route>
        <Route path="/create">
          <Create />
        </Route>
        <Route path="/chat">
          <Chat />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
