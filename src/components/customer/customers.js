import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { Link } from "react-router-dom";
import Listview from "./Listview";
import * as Icon from "react-feather";
import "./customers.css";
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import {Customer_Url} from './../../const';
import {API_KEY} from './../../const';

function Customers(props) {
  const [loading, setLoading] = useState(true);
  const [custlist, setCustlist] = useState([]);
  const [toEditcustomer, setToEditcustomer] = useState(false);
  const [toAddcustomer, setToAddcustomer] = useState(false);
  const button = <button className="btn btn-primary btn-sm">Edit</button>;

  const { session_token, name, email, host, CUSTOMER_ENABLER, CUSTOMER_MODIFY_CREATE} = useSelector(state => {
      return {
          ...state.userReducer
      }
  });

  function handleActiveCustomerList(id,activeVal) {
    const newList = custlist.map((item) => {
      if (item.ID === id) {
        const updatedItem = {
          ...item,
          IsActiveCustomer: activeVal,
        };
        return updatedItem;
      }
      return item;
    });
    setCustlist(newList);
  }

  async function activeCustomerChange(currObj, e) {
    console.log("Option Change Checkbox Click");
    if(CUSTOMER_ENABLER){
      //console.log(e);
      let optAction = "activate";
      let activeVal = true;
      if (currObj.IsActiveCustomer) {
        optAction = "deactivate";
        activeVal = false;
      }
      
      let confMsg =
        "Are you sure you want to " +
        optAction +
        " this customer" +
        "?";
      
      if (window.confirm(confMsg)) {
        //Perform Opration
        try {
          let custObj = currObj;
          custObj.active = activeVal;

          const options = {
            headers: {
              'X-DreamFactory-API-Key': API_KEY,
              'X-DreamFactory-Session-Token': session_token
            }
          };
          let postObj = {
            "IsActiveCustomer" : activeVal
          };
          let res = await axios.put(Customer_Url+"/"+custObj.ID, postObj, options);
          console.log(res);
          
          handleActiveCustomerList(custObj.ID,activeVal);

          alert("Customer "+optAction+" successfully!");
        } catch (error) {
          console.log(error.response);
          if (401 === error.response.status) {
              // handle error: inform user, go to login, etc
              let res = error.response.data;
              alert(res.error.message);
          } else {
            alert(error);
          }
        }
      } else {
        handleActiveCustomerList(currObj.ID,currObj.IsActiveCustomer);
        return false;
      }
    } else {
      handleActiveCustomerList(currObj.ID,currObj.IsActiveCustomer);
      return false;
    }
  }

  const columnDefs = [
    {
      Header: "Active",
      width: 70,
      field: "IsActiveCustomer",
      filterable: false, // Overrides the table option
      className: "text-center",
      Cell: obj => {
        //console.log(obj.row);
        let opId = obj.row.original.ID;
        let opExists = false;
        if (obj.row.original.IsActiveCustomer) {
          opExists = true;
        }
        const chboEl = (
          <input
            type="checkbox"
            disabled={!CUSTOMER_ENABLER}
            onChange={(e) => {activeCustomerChange(obj.row.original, e)}}
            name={opId}
            checked={opExists}
          />
        );
        return chboEl;
      }
    },
    {
      Header: "Edit",
      show : CUSTOMER_MODIFY_CREATE, 
      width: 40,
      id: 'colEdit',
      accessor: row => row.attrbuiteName,
      filterable: false, // Overrides the table option
      Cell: obj => {
        //console.log("Edit");
        //console.log(obj.row);
        return (
          <Link
            to={{
              pathname: `${process.env.PUBLIC_URL}/editcustomer`,
              state: obj.row.original
            }}
          >
            <Icon.Edit />
          </Link>
        );
      }
    },
    {
      Header: "Clone",
      width: 40,
      show : CUSTOMER_MODIFY_CREATE,
      id: 'colCopy',
      accessor: row => row.attrbuiteName,
      filterable: false, // Overrides the table option
      Cell: obj => {
        //console.log("Edit");
        //console.log(obj.row);
        let custObj = obj.row.original;
        //custObj.key = null;
        return (
          <Link
            to={{
              pathname: `${process.env.PUBLIC_URL}/clonecustomer`,
              state: custObj
            }}
          >
            <Icon.Copy />
          </Link>
        );
      }
    },
    {
      name: "Name",
      field: "name",
      Header: "Name",
      accessor: "CustomerFriendlyName"
    },
    {
      name: "Type",
      field: "CustomerType",
      Header: "Type",
      accessor: "CustomerType"
    },
    {
      headerName: "CompanyID",
      field: "CompanyID",
      Header: "CompanyID",
      accessor: "CompanyID"
    },
    {
      headerName: "IncomingFundsAccount",
      field: "IncomingFundsAccount",
      Header: "IncomingFundsAcct",
      accessor: "IncomingFundsAccount"
    },
    {
      headerName: "OutgoingFundsAccount",
      field: "OutgoingFundsAccount",
      Header: "OutgoingFundsAcct",
      accessor: "OutgoingFundsAccount"
    },
    {
      headerName: "ReturnCreditAcct",
      field: "ReturnCreditAcct",
      Header: "ReturnCreditAcct",
      accessor: "ReturnCreditAcct"
    },
    /*,
    {
      Header: "",
      field: "delete",
      width: 40,
      id: 'colDelete',
      //accessor: row => row.attrbuiteName,
      filterable: false, // Overrides the table option
      Cell: row => (
        <div>
          <Icon.Delete />
        </div>
      )
    }*/
  ];

  useEffect(() => {
    let ignore = false;
    async function fetchCustomersList() {
      const options = {
        headers: {
          'X-DreamFactory-API-Key': API_KEY,
          'X-DreamFactory-Session-Token': session_token
        }
      };
      let res = await axios.get(Customer_Url, options);
      console.log(res.data);
      console.log(res.data.resource);
      let custArray = res.data.resource;
      console.log(custArray);
      setLoading(false);
      setCustlist(custArray);
    }
    fetchCustomersList();
    return () => { ignore = true };
  }, []);

  function handleEditCustomer(key) {
    console.log("handle Edit Customer : " + key);
    setToEditcustomer(true);
  }

  function handleRemoveCustomer(index) {
    console.log("handleRemoveCustomer : " + index);
    /*
    var custRef = firebase.db.ref("customers/" + index);
    custRef
      .remove()
      .then(function() {
        console.log("Remove succeeded.");
      })
      .catch(function(error) {
        console.log("Remove failed: " + error.message);
      });
      */
  }

  function addNewCustomer(){
    console.log("Add New Customer");
    setToAddcustomer(true);
  }

  if (toAddcustomer === true) {
    console.log("toAddcustomer : "+toAddcustomer);
    return (
      <Redirect to={{ pathname: `${process.env.PUBLIC_URL}/addcustomer` }} />
    );
  }

  if (toEditcustomer === true) {
    return (
      <Redirect to={{ pathname: `${process.env.PUBLIC_URL}/editcustomer`, state: props.original }} />
    );
  }

  console.log("Properties", props);
  let disCmp =
    loading === true ? (
      <h3> LOADING... </h3>
    ) : (
      <Listview
        items={custlist}
        columnDefs={columnDefs}
        remove={handleRemoveCustomer}
        onEditClick={handleEditCustomer}
      />
    );
  
    console.log("CUSTOMER_MODIFY_CREATE : "+ CUSTOMER_MODIFY_CREATE);
  return (
    <React.Fragment>
      <div className="container">
        <div className="row">
          <div className="col-sm-12 col-md-offset-3">
            <h3 className="title-center">Customers List</h3>
            <div className="btnCls">
              {CUSTOMER_MODIFY_CREATE && (
                <button type="button" onClick={addNewCustomer} className="btn btn-primary btn-sm">
                  Add New
                </button>
              )}
              
            </div>
            {disCmp}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Customers;
