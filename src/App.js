import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./components/Login/login";
import Dashboard from "./components/Dashboard/DashboardContainer";
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './reducer/rootreducer';

const INITIAL_STATE = {};

const store = createStore(rootReducer, INITIAL_STATE);

function App(props) {
  return (
    <React.Fragment>
      <Router>
      <Provider store = {store}>
        <Switch>
          <Route exact path={`${process.env.PUBLIC_URL}/login`} component={Login} />
          <Route exact path={`${process.env.PUBLIC_URL}/dashboard`} component={Dashboard} />
          <Route exact path={`${process.env.PUBLIC_URL}/customers`} component={Dashboard} />
          <Route exact path={`${process.env.PUBLIC_URL}/addcustomer`} component={Dashboard} />
          <Route exact path={`${process.env.PUBLIC_URL}/clonecustomer`} component={Dashboard} />
          <Route exact path={`${process.env.PUBLIC_URL}/editcustomer`} component={Dashboard} />
          <Route exact path={`${process.env.PUBLIC_URL}`} component={Login} />
        </Switch>
      </Provider>
      </Router>
    </React.Fragment>
  );
}

export default App;
