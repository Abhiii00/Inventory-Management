import React, { Component, useEffect, useState } from 'react'
import config from '../coreFIles/config'
import Cookies from 'js-cookie'
import { ToastContainer } from 'react-toastify';
import { FaAlignLeft } from "react-icons/fa6";

const Header = () => {
  const [isBodyClassActive, setIsBodyClassActive] = useState(false);

  const loginData = (!Cookies.get('Inventory_Management')) ? [] : JSON.parse(Cookies.get('Inventory_Management'));
  console.log("loginData in header:", loginData.name);
  if (!loginData || loginData == '') {
    window.location.href = `${config.baseUrl}`;
  }

  useEffect(() => {
    if (!loginData || loginData == '') {
      window.location.href = `${config.baseUrl}`;
    }
  }, [loginData])



  useEffect(() => {
    if (isBodyClassActive) {
      document.body.classList.add('sidebar-open');
    } else {
      document.body.classList.remove('sidebar-open');
    }
    return () => {
      document.body.classList.remove('sidebar-open');
    };
  }, [isBodyClassActive]);

  const handleButtonClick = () => {
    setIsBodyClassActive(!isBodyClassActive);
  };

  return (

    <>
      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={true}
        toastStyle={{
          backgroundColor: "#010000",
          color: "#fff",
        }}
      />

      <header className="main-header ">
        <div className="d-flex align-items-center logo-box justify-content-start">
          <a href="#" className="logo">
            <div className="logo-lg">
              <span className="dark-logo">
                <span style={{ fontSize: '25px', color: '#fff', marginLeft: '8px' }}> Inventory  </span>
              </span>
            </div>
          </a>
        </div>
        <nav className="navbar navbar-static-top">
          <div className="app-menu">
            <ul className="header-megamenu nav">
              <li className="btn-group nav-item push-btn" onClick={handleButtonClick}>
                <FaAlignLeft />
              </li>

            </ul>
          </div>
          <div className="navbar-custom-menu r-side">
            <ul className="nav navbar-nav">

              <li className="dropdown user user-menu">
                <a
                  href="#"
                  className=" dropdown-toggle w-auto l-h-12 bg-transparent py-0 no-shadow"
                  data-bs-toggle="dropdown"
                  title="User"
                >
                  <div className="d-flex align-items-center">
                    <div className="text-end me-10">
                      <p className="pt-5 fs-14 mb-0 fw-700 text-primary">
                        <span>{(loginData?.name || 'User').toUpperCase()}</span>
                      </p>
                    </div>
                    <img
                      src="./images/avatar/avatar-1.png"
                      className="avatar rounded-10 bg-primary-light h-40 w-40"
                      alt=""
                    />
                  </div>
                </a>

              </li>
            </ul>
          </div>
        </nav>
      </header>

    </>
  )
}
export default Header;
