import React from "react";

export default function Input({
  label,
  name,
  register,
  validations,
  errors,
  type,
}) {
  const errorMessage = errors[name]?.message;
  return (
    <div className="mb-5">
      <label className="font-bold mb-1 text-gray-700 block capitalize">
        {label}
      </label>
      <input
        type={type ? type : "text"}
        step={name == "precio" ? "0.01" : ""}
        className="w-full px-4 py-5 rounded-lg shadow-sm shadow-gray-500 focus:outline text-gray-600 font-medium"
        {...register(name, validations)}
      />
      <p className="text-red-500 mt-2">{errorMessage}</p>
    </div>
  );
}
