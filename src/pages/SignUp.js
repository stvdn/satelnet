import React from "react";
import Input from "../components/Input";
import { useForm } from "react-hook-form";
import { ToastContainer } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signIn } from "../slices/signInSlice";
import { addDocWithId } from "../services/firebase/firestore";
import { createUserEmail } from "../services/firebase/fireauth";
import { notifyError, notifySuccess } from "../services/notification";

export default function SignUp() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const checkUserEmail = (data) => {
    if (location.state) {
      const { userEmail, userUID } = location.state;
      createUserDoc(userUID, data, userEmail);
    } else {
      registerUser(data);
    }
  };

  const registerUser = (data) => {
    createUserEmail(data)
      .then((userCredential) => {
        const user = userCredential.user;
        createUserDoc(user.uid, data, user.email);
      })
      .catch((error) => {
        const errorMessage = error.message;
        notifyError(errorMessage);
      });
  };

  const createUserDoc = async (docID, data, email) => {
    const dataWithoutCredentials = {
      nombre: data.name,
      apellido: data.lastName,
      identificacion: data.identification,
      ciudad: data.city,
      direccion: data.direction,
      email: email,
    };
    try {
      addDocWithId("usuarios", docID, dataWithoutCredentials);
      dispatch(
        signIn({
          signIn: true,
          userId: docID,
          userData: dataWithoutCredentials,
        })
      );
      notifySuccess("Bienvenid@");
      navigate("/")
    } catch (error) {
      notifyError(error);
    }
  };

  return (
    <div>
      <ToastContainer />
      <h1 className="text-5xl text-center mt-5 text-[#1d4675]">Registro</h1>
      <form onSubmit={handleSubmit(checkUserEmail)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mx-20 mt-10">
          <Input
            label="nombre"
            name="name"
            register={register}
            validations={{
              required: "Este campo es obligatorio",
            }}
            errors={errors}
          />
          <Input
            label="apellido"
            name="lastName"
            register={register}
            validations={{
              required: "Este campo es obligatorio",
            }}
            errors={errors}
          />
          <Input
            label="identificación"
            name="identification"
            register={register}
            validations={{
              required: "Este campo es obligatorio",
            }}
            errors={errors}
          />
          <Input
            label="ciudad"
            name="city"
            register={register}
            validations={{
              required: "Este campo es obligatorio",
            }}
            errors={errors}
          />
          <Input
            label="dirección"
            name="direction"
            register={register}
            validations={{
              required: "Este campo es obligatorio",
            }}
            errors={errors}
          />
        {!location.state?.userEmail && (
            <>
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
                register={register}
                type="password"
                validations={{
                  required: "Este campo es obligatorio",
                }}
                errors={errors}
              />
              <Input
                label="confirmar contraseña"
                name="re-password"
                register={register}
                type="password"
                validations={{
                  required: "Este campo es obligatorio",
                  validate: {
                    positive: () =>
                      getValues("password") === getValues("re-password") ||
                      "Las contraseñas deben ser las concidir.",
                  },
                }}
                errors={errors}
              />
            </>
          )}
        </div>
        <div className="flex justify-center my-10">
          <button
            type="submit"
            className="w-32 focus:outline-none border border-transparent py-2 px-5 rounded-lg shadow-sm text-center text-white bg-[#1d4675] font-medium"
          >
            Registrarme
          </button>
        </div>
      </form>
    </div>
  );
}
