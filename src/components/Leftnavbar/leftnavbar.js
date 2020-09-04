import React from "react";
import { NavLink } from "react-router-dom";
import * as Icon from "react-feather";

function MenuListItem(props) {
  const components = {
    home: Icon.Home,
    camera: Icon.Camera,
    users: Icon.Users,
    useradd: Icon.UserPlus
  };
  const IconCmp = components[props.iconName || "home"];
  return (
    <li className="nav-item">
      <NavLink className="nav-link" exact to={props.routePath}>
        <IconCmp />
        <span style={{ marginLeft: 10 }}>{props.menuName}</span>
      </NavLink>
    </li>
  );
}

// Stateless Function Component
function LeftNavBar(props) {
  return (
    <nav className="col-md-2 d-none d-md-block bg-light sidebar">
      <div className="sidebar-sticky">
        <ul className="nav flex-column">
          <MenuListItem
            menuName="Dashboard"
            routePath={`${process.env.PUBLIC_URL}/dashboard`}
            iconName="home"
          />
         
          <MenuListItem
            menuName="Customers"
            routePath={`${process.env.PUBLIC_URL}/customers`}
            iconName="users"
          />
          {/*
          <MenuListItem
            menuName="Add New Customer"
            routePath="/addcustomer"
            iconName="useradd"
          />
          */}
        </ul>
      </div>
    </nav>
  );
}
export default LeftNavBar;
