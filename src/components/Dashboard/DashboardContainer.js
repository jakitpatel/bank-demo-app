import React, { useState } from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import "./dashboard.css";
import Customers from "./../customer/customers.js";
import Addeditcustomer from "./../customer/addeditcustomer";
import NavBar from "./../Navbar/navbar";
import LeftNavBar from "./../Leftnavbar/leftnavbar";
import DashboardMain from "./DashboardMain";

import { useSelector, useDispatch } from 'react-redux';

const CustomerWrap = props => {
  console.log(props);
  return <Addeditcustomer disType="edit" custdata={props.location.state} />;
};

const CustomerCloneWrap = props => {
  console.log(props);
  return <Addeditcustomer disType="clone" custdata={props.location.state} />;
};

const routes = [
  {
    path: "/dashboard",
    exact: true,
    main: () => <DashboardMain />
  },
  {
    path: "/customers",
    main: () => <Customers disType="list" />
  },
  {
    path: "/addcustomer",
    main: () => <Addeditcustomer disType="add" />
  },
  {
    path: "/clonecustomer",
    main: CustomerCloneWrap //() => <Customers disType="edit" />
  },
  {
    path: "/editcustomer",
    main: CustomerWrap //() => <Customers disType="edit" />
  }
];

function DashboardContainer(props) {
  const [mainpage, setMainpage] = useState(true);
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  
  const { session_token, name, email, host} = useSelector(state => {
      return {
          ...state.userReducer
      }
  });

  if (redirectToLogin === true) {
    return <Redirect to={`${process.env.PUBLIC_URL}/login`} />;
  }

  if (session_token === null) {
    //User Not Logged In
    alert("Please login first");
    setRedirectToLogin(true);
    return null;
  }
  //alert("Dashboard Container");
  function handleLogout() {
    console.log("Handle Logout & Redirect to Login");
    setRedirectToLogin(true);
  }
  return (
    <React.Fragment>
      <Router>
        {mainpage === true ? (
          <React.Fragment>
            <NavBar onHandleLogout={handleLogout} />
            <main className="container-fluid">
              <div className="row">
                <LeftNavBar />
                <main role="main" className="col-md-9 ml-sm-auto col-lg-10">
                  <div className="App">
                    {routes.map((route, index) => (
                      // Render more <Route>s with the same paths as
                      // above, but different components this time.
                      <Route
                        key={index}
                        path={`${process.env.PUBLIC_URL}${route.path}`}
                        exact={route.exact}
                        component={route.main}
                      />
                    ))}
                    {/*<Dashboard />*/}
                  </div>
                </main>
              </div>
            </main>
          </React.Fragment>
        ) : (
          ""
        )}
      </Router>
    </React.Fragment>
  );
}

export default DashboardContainer;
