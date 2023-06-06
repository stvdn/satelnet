import React, { useEffect } from "react";
import Input from "../../components/Input";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { notifyError, notifySuccess } from "../../services/notification";
import { signIn } from "../../slices/signInSlice";
import { getAuth, updatePassword } from "firebase/auth";

export default function Profile() {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.signIn.userData);
  const userId = useSelector((state) => state.signIn.userId);
  const {
    register,
    getValues,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    reset(user);
  }, [user]);

  const updateUser = async (data) => {
    const pwd = data.password
    delete data.password
    delete data["re-password"]
    try {
      const db = getFirestore();
      const auth = getAuth()
      const userAuth = auth.currentUser
      const userRef = doc(db, "usuarios", userId)
      if (pwd) {
        await updatePassword(userAuth, pwd)
      }
      await updateDoc(userRef, data)
      dispatch(
        signIn({
          signIn: true,
          userId: userId,
          userData: data,
        })
      );
      notifySuccess("Datos actualizados!")
    } catch (error) {
      notifyError(`Datos actualizados: ${error}`)
      reset(user)
    }
  };

  return (
    <div>
      <h1 className="text-5xl text-center mt-5 text-[#1d4675]">Perfil</h1>
      <form
        onSubmit={handleSubmit(updateUser)}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 mt-10 gap-10 mx-10 md:mx-20">
          <Input
            label="nombre"
            name="nombre"
            register={register}
            validations={{
              required: "Este campo es obligatorio",
            }}
            errors={errors}
          />
          <Input
            label="apellido"
            name="apellido"
            register={register}
            validations={{
              required: "Este campo es obligatorio",
            }}
            errors={errors}
          />
          <Input
            label="identificación"
            name="identificacion"
            register={register}
            validations={{
              required: "Este campo es obligatorio",
            }}
            errors={errors}
          />
          <Input
            label="ciudad"
            name="ciudad"
            register={register}
            validations={{
              required: "Este campo es obligatorio",
            }}
            errors={errors}
          />
          <Input
            label="dirección"
            name="direccion"
            register={register}
            validations={{
              required: "Este campo es obligatorio",
            }}
            errors={errors}
          />
          <div className="mb-5">
            <label className="font-bold mb-1 text-gray-700 block capitalize">
              correo electrónico
            </label>
            <input
              className="w-full px-4 py-5 rounded-lg shadow-sm shadow-gray-500 focus:outline text-gray-600 font-medium"
              {...register("email")}
              readOnly
            />
          </div>
          <Input
            label="contraseña"
            name="password"
            register={register}
            type="password"
            errors={errors}
          />
          <Input
            label="confirmar contraseña"
            name="re-password"
            register={register}
            type="password"
            validations={{
              validate: {
                positive: () =>
                  getValues("password") === getValues("re-password") ||
                  "Las contraseñas deben ser las concidir.",
              },
            }}
            errors={errors}
          />
        </div>
        <div className="flex justify-center mb-10">
          <button className="w-32 focus:outline-none border border-transparent py-2 px-5 rounded-lg shadow-sm text-center text-white bg-[#1d4675] font-medium">
            Editar
          </button>
        </div>
      </form>
    </div>
  );
}
