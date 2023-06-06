import React from "react";
import Input from "../components/Input";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export default function Contactus() {
    const {
        handleSubmit,
        register,
        formState: { errors },
        setValue,
        reset
    } = useForm();
    const navigate = useNavigate()

    const sendEmail = (data) => {
        const mailtoURL = `mailto:${data.to}?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(data.descripcion)}`;
        window.open(mailtoURL);
        navigate("/")
    }
    return <form onSubmit={handleSubmit(sendEmail)}>
        <h1 className="text-5xl text-center my-5 text-[#1d4675]">Contactanos</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mx-10 md:mx-20">
            <Input
                label="Destinatario (email)"
                name="to"
                type="email"
                register={register}
                validations={{
                    required: "Este campo es obligatorio",
                }}
                errors={errors}
            />
            <Input
                label="Asunto"
                name="subject"
                type="text"
                register={register}
                validations={{
                    required: "Este campo es obligatorio",
                }}
                errors={errors}
            />
            <div className="mb-5 col-span-full">
                <label className="font-bold mb-1 text-gray-700 block capitalize">
                    Descripción
                </label>
                <textarea
                    rows={13}
                    type="text"
                    className={`w-full px-4 py-3 rounded-lg shadow-sm shadow-gray-500 focus:outline focus:outline text-gray-600 font-medium`}
                    {...register("descripcion", {
                        required: "Este campo es obligatorio",
                    })}
                />
                <p className="text-red-500 mt-2">
                    {errors.descripcion && errors.descripcion.message}
                </p>
            </div>

        </div>
        <div className="w-full flex justify-center mt-10">
            <button className="w-50 focus:outline-none border border-transparent py-2 px-5 rounded-lg shadow-sm text-center text-white bg-[#1d4675] hover:bg-[#419641]font-medium">
                Enviar correo
            </button>
        </div>
    </form>
}