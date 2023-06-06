import React, { useEffect, useRef, useState } from "react";
import Input from "../../components/Input";
import { useForm } from "react-hook-form";
import {
  addDocWithoutId,
  updateDocById,
} from "../../services/firebase/firestore";
import { dowloadURL, uploadFile } from "../../services/firebase/firestorage";
import { notifySuccess } from "../../services/notification";
import { collection, doc, getDocs, getFirestore, query } from "firebase/firestore";
import { useLocation } from "react-router-dom";
import { addDocWithId } from "../../services/firebase/firestore";

export default function UploadProduct() {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    reset
  } = useForm();
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState("");
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const inputImage = useRef(null);
  let { state } = useLocation()


  useEffect(() => {
    const db = getFirestore();
    const getCategories = async (db) => {
      const q = query(collection(db, 'categorias'));
      const querySnapshot = await getDocs(q);
      const categories = querySnapshot.docs.map((doc) => { return { name: doc.data()["nombre"], id: doc.id } });
      setCategories(categories)
    }

    getCategories(db);
    if (state?.product) {
      reset(state.product.data)
      setImage(state.product.data.imagen)
    } 
  }, []);

  const displayPhoto = () => {
    const fileImage = inputImage.current.files[0];
    const imageURL = URL.createObjectURL(fileImage);
    setImage(imageURL);
    setImageFile(fileImage);
    setValue("imagen", imageURL);
  };

  const postProduct = async (data) => {
    setLoading(true)
    const db = getFirestore()
    data["categoria"] = doc(db, "categorias", data["categoria"])
    data["stock"] = Number(data["stock"])
    data["precio"] = Number(data["precio"])
    data["descuento"] = Number(data["descuento"])
    let productId = ""
    if (state?.product) {
      await addDocWithId("productos", state.product.id, data)
      productId = state.product.id
    } else {
      productId = await addDocWithoutId("productos", data);
    }
    const hasImage = state?.product?.data?.imagen
    if (hasImage && (image != hasImage)) {
      const pathPhoto = `images/${productId}`;
      uploadFile(productId, pathPhoto, imageFile).then(() => {
        uploadPhoto(productId, pathPhoto);
      });
    } else {
      notifySuccess("Producto publicado!");
      reset({});
      setImage("")
      setLoading(false)
    }
  };

  const uploadPhoto = (docId, path) => {
    dowloadURL(path).then((url) => {
      const data = { imagen: url };
      updateDocById("productos", docId, data).then(() => {
        notifySuccess("Producto publicado!");
        reset({});
        setImage("")
        setLoading(false)
      });
    });
  };

  return (
    <>
      {
        loading ? <div className="w-full h-full flex items-center justify-center text-xl">Publicando...</div> : <div>
          <form onSubmit={handleSubmit(postProduct)}>
            <h1 className="text-5xl text-center mt-5 text-[#1d4675]">Subir producto</h1>
            <div className="flex flex-col justify-center items-center mt-10">
              <div className="mx-auto w-44 h-52 mb-2 border relative bg-gray-100 mb-4 shadow-inset ">
                <img
                  id="image"
                  className="object-cover w-full h-full"
                  src={image ? image : ""}
                />
              </div>
              <label
                htmlFor="fileInput"
                type="button"
                className="cursor-pointer inine-flex justify-between items-center focus:outline-none border py-2 px-4 rounded-lg shadow-sm text-left text-gray-600 bg-white hover:bg-gray-100 font-medium "
              >
                <i
                  className="fa fa-file-image-o"
                  style={{ marginRight: "10px" }}
                  aria-hidden="true"
                ></i>
                Subir foto
              </label>
              <input
                type="file"
                className="hidden"
                id="fileInput"
                {...register("imagen", {
                  required: "Este campo es obligatorio",
                  onChange: () => {
                    displayPhoto();
                  },
                })}
                ref={inputImage}
              />

              <p className="text-red-500 mt-2">
                {errors.imagen && errors.imagen.message}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mx-10">
              <Input
                label="Nombre"
                name="nombre"
                register={register}
                validations={{
                  required: "Este campo es obligatorio",
                }}
                errors={errors}
              />
              <Input
                label="Precio"
                name="precio"
                type="number"
                register={register}
                validations={{
                  required: "Este campo es obligatorio",
                }}
                errors={errors}
              />
              <Input
                label="Cantidad"
                name="stock"
                type="number"
                register={register}
                validations={{
                  required: "Este campo es obligatorio",
                }}
                errors={errors}
              />
              <Input
                label="Descuento (%)"
                name="descuento"
                type="number"
                register={register}
                errors={errors}
              />
              <div className="mb-5">
                <label className="font-bold mb-1 text-gray-700 block capitalize">
                  Categoria
                </label>
                <select {...register("categoria", {
                  required: "Este campo es obligatorio",
                })}
                  className={`w-full px-4 py-3 bg-white rounded-lg shadow-sm shadow-gray-500 focus:outline focus:outline text-gray-600 font-medium capitalize`}
                >
                  <option>Seleccionar...</option>
                  {categories && categories.map((category) => <option className="capitalize" value={category.id} key={category.id}>{category.name}</option>)}
                </select>
                <p className="text-red-500 mt-2">{errors.categoria && errors.categoria.message}
                </p>
              </div>

              <div className="mb-5 col-span-full">
                <label className="font-bold mb-1 text-gray-700 block capitalize">
                  Descripción
                </label>
                <textarea
                  rows={5}
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
            <div className="flex justify-center mt-10">
              <button className="w-32 focus:outline-none border border-transparent py-2 px-5 rounded-lg shadow-sm text-center text-white bg-[#1d4675] hover:bg-[#419641]font-medium">
                Publicar
              </button>
            </div>
          </form>
        </div>
      }
    </>
  );
}
