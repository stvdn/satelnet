import React, { useEffect, useState, Fragment, useRef } from "react";
import { Link } from "react-router-dom";
import UserMenu from "./UserMenu";

export default function Header() {
  const [currentPath, setCurrentPath] = useState("");
  const [isInCart, setIsInCart] = useState(false);

  useEffect(() => {
    setCurrentPath(window.location.pathname);
    currentPath === "/cart" ? setIsInCart(true) : setIsInCart(false);
  }, [currentPath]);

  return (
    <div className="header">
      <div className="container">
        <div className="navbar">
          <div className="logo">
            <Link to="/" onClick={()=>setCurrentPath("/")}>
              <img src={require("../img/logo.jpeg")} alt="logo" width="150px" />
            </Link>
          </div>
          <nav>
            <ul id="MenuItems">
              <li>
                <HeaderLink
                  currentPath={currentPath}
                  page={""}
                  setCurrentPath={setCurrentPath}
                  title={"Inicio"}
                />
              </li>
              <li>
                <HeaderLink
                  currentPath={currentPath}
                  page={"products"}
                  setCurrentPath={setCurrentPath}
                  title={"Productos"}
                />
              </li>
              <li>
                <HeaderLink
                  currentPath={currentPath}
                  page={"contactus"}
                  setCurrentPath={setCurrentPath}
                  title={"Contactanos"}
                />
              </li>
              <li>
                <UserMenu />
              </li>
            </ul>
          </nav>
          <Link to="cart" onClick={()=>setCurrentPath("/cart")} className="text-[32px]">
            <i class="fa fa-shopping-cart"></i>
          </Link>
          <img src={require("../images/menu.png")} className="menu-icon" onclick="menutoggle()" />
        </div>
      </div>
    </div>
  );
}

function HeaderLink({ currentPath, page, setCurrentPath, title }) {
  return (
    <Link
      className={`text-center block rounded py-2 px-4 ${currentPath === `/${page}`
        ? ""
        : ""
        }`}
      to={`/${page}`}
      onClick={() => {
        setCurrentPath(`/${page}`);
      }}
    >
      {title.charAt(0).toUpperCase() + title.slice(1)}
    </Link>
  );
}
