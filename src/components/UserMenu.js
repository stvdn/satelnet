import React, { Fragment, useEffect, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signIn } from "../slices/signInSlice";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { notifyError, notifySuccess } from "../services/notification";
import { ToastContainer } from "react-toastify";
import { getDocById } from "../services/firebase/firestore";

export default function UserMenu() {
  const dispatch = useDispatch();
  const auth = getAuth();
  const [signInStatus, setSignInStatus] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const menuItemsLogged = [
    {
      title: "Perfil",
      icon: "fa fa-user",
      page: "profile",
      onlyAdmin: false,
    },
    {
      title: "Publicar",
      icon: "fa fa-handshake-o",
      page: "upload-product",
      onlyAdmin: true,
    },
    {
      title: "Cerrar sesión",
      icon: "fa fa-sign-out",
      page: "",
    },
  ];

  useEffect(() => {
    const dispatchUser = (user, userDoc) => {
      if (userDoc) {
        dispatch(
          signIn({
            signIn: true,
            userId: user.uid,
            userData: userDoc.data(),
          })
        );
        setSignInStatus(true);
        setIsAdmin(userDoc.data().esAdmin);
      }
    };
    const getCurrentUser = () => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const userDoc = await getDocById("usuarios", user.uid);
          userDoc.exists() && dispatchUser(user, userDoc);
        } else {
          dispatch(
            signIn({
              signIn: false,
              userId: "",
              userData: {},
              verifiedUser: false,
            })
          );
        }
      });
    };
    getCurrentUser();
  }, [signInStatus, auth, dispatch]);

  return (
    <Menu as="div" className="relative inline-block text-left">
      <ToastContainer />
      <div>
        {signInStatus ? (
          <Menu.Button>
            <i
              className="fa fa-user-circle mx-6 text-white"
              aria-hidden="true"
              style={{ fontSize: "30px" }}
            ></i>
          </Menu.Button>
        ) : (
          <Link to="/sign-in">
            <i
              className="fa fa-sign-in mx-6"
              aria-hidden="true"
              style={{ fontSize: "30px" }}
            ></i>
          </Link>
        )}
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-1 py-1 ">
            {signInStatus &&
              menuItemsLogged.map((item, index) => {
                return item.onlyAdmin ? (
                  isAdmin && (
                    <MenuItem
                      title={item.title}
                      icon={item.icon}
                      key={index}
                      page={item.page}
                      setSignInStatus={setSignInStatus}
                    />
                  )
                ) : (
                  <MenuItem
                    title={item.title}
                    icon={item.icon}
                    key={index}
                    page={item.page}
                    setSignInStatus={setSignInStatus}
                  />
                );
              })}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

function MenuItem({ title, icon, page, setSignInStatus }) {
  const navigate = useNavigate()
  if (title === "Cerrar sesión") {
    const auth = getAuth();
    const signOutUser = () => {
      signOut(auth)
        .then(() => {
          setSignInStatus(false);
          notifySuccess("Te esperamos");
          navigate("/")
        })
        .catch((error) => {
          notifyError(error);
        });
    };
    return (
      <Menu.Item>
        {({ active }) => (
          <button
            className={`${
              active ? "bg-[#1d4675] text-white" : "text-gray-900"
            } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
            onClick={() => signOutUser()}
          >
            {active ? (
              <i
                className={icon}
                aria-hidden="true"
                style={{ marginRight: "10px" }}
              ></i>
            ) : (
              <i
                className={icon}
                aria-hidden="true"
                style={{ marginRight: "10px" }}
              ></i>
            )}
            {title}
          </button>
        )}
      </Menu.Item>
    );
  }
  return (
    <Menu.Item>
      {({ active }) => (
        <Link to={page}>
          <button
            className={`${
              active ? "bg-[#1d4675] text-white" : "text-gray-900"
            } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
          >
            {active ? (
              <i
                className={icon}
                aria-hidden="true"
                style={{ marginRight: "10px" }}
              ></i>
            ) : (
              <i
                className={icon}
                aria-hidden="true"
                style={{ marginRight: "10px" }}
              ></i>
            )}
            {title}
          </button>
        </Link>
      )}
    </Menu.Item>
  );
}
