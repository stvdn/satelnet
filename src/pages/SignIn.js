import React from "react";
import Input from "../components/Input";
import { useForm } from "react-hook-form";
import { ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signIn } from "../slices/signInSlice";
import { Link } from "react-router-dom";
import {
  notifyError,
  notifyInfo,
  notifySuccess,
} from "../services/notification";
import {
  signInWithEmail,
  signInWithGoogle,
} from "../services/firebase/fireauth";
import { getDocById } from "../services/firebase/firestore";
import { FcGoogle } from "react-icons/fc";

export default function SignIn() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const signInUser = (data) => {
    signInWithEmail(data)
      .then(async (userCredential) => {
        const userId = userCredential.user.uid;
        const userData = await getUserData(userId);
        dispatch(
          signIn({
            signIn: true,
            userId,
            userData,
          })
        );
        notifySuccess("Bienvenido!");
        navigate("/");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if(errorCode == 'auth/invalid-email'){
          notifyError("El correo no esta registrado");
        } else if(errorCode == 'auth/wrong-password'){
          notifyError("El contraseña es incorrecta");
        }
        reset();
      });
  };

  const signInGoogle = () => {
    signInWithGoogle()
      .then((result) => {
        const user = result.user;
        checkIfUserExist(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        notifyError(errorMessage, errorCode);
      });
  };

  const checkIfUserExist = async (user) => {
    const userId = user.uid;
    const userData = await getUserData(userId);
    if (userData) {
      dispatch(
        signIn({
          signIn: true,
          userId,
          userData,
          verifiedUser: user.emailVerified,
        })
      );
      notifySuccess("Bienvenido!");
      navigate("/");
    } else {
      notifyInfo("Necesitamos conocer mas de ti");
      navigate("/sign-up", {
        state: { userEmail: user.email, userUID: user.uid },
      });
    }
  };

  const getUserData = async (id) => {
    const docSnap = await getDocById("users", id);
    return docSnap.data();
  };

  return (
    <div className="mt-32">
      <ToastContainer />
      <h1 className="text-5xl text-center mt-5 text-[#1d4675]">Iniciar sesión</h1>
      <form onSubmit={handleSubmit(signInUser)}>
        <div className="flex flex-col  items-center mt-10">
          <Input
            label="correo electrónico"
            name="email"
            register={register}
            validations={{
              required: "Este campo es obligatorio",
            }}
            errors={errors}
          />
          <Input
            label="contraseña"
            name="password"
            type="password"
            register={register}
            validations={{
              required: "Este campo es obligatorio",
            }}
            errors={errors}
          />
        </div>
        <div className="flex flex-col justify-center items-center">
          <button
            type="submit"
            className="w-32 focus:outline-none border border-transparent py-2 px-5 rounded-lg shadow-sm text-center text-white bg-[#1d4675] font-medium"
          >
            Ingresar
          </button>
          {
            /*
          <div
            className="mt-6 hover:cursor-pointer flex items-center"
            onClick={() => {
              signInGoogle();
            }}
          >
            <div className="mr-5">
              Iniciar sesión con:
            </div>
            <FcGoogle size={30} />
          </div>
            */
          }

          <Link
            to="/sign-up"
            className="text-gray-500 text-xl font-semibold mt-6 hover:text-[#1d4675]"
          >
            Registrarme
          </Link>
        </div>
      </form>
    </div>
  );
}
