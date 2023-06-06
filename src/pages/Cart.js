import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addDocWithoutId } from "../services/firebase/firestore";
import { notifyError, notifySuccess } from "../services/notification";
import {
  updateProductQuantity,
  removeProductCart,
  cleanCart,
} from "../slices/cartSlice";
import { collection, doc, getDocs, getFirestore, updateDoc } from "firebase/firestore";
import html2pdf from 'html2pdf.js';

export default function Cart() {
  const [productsPrice, setProductsPrice] = useState(0);
  const [totalReal, setTotalReal] = useState(0);
  const [products, setProducts] = useState([]);
  const productsRedux = useSelector((state) => state.cart.products);
  const userId = useSelector((state) => state.signIn.userId);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.signIn.userData);

  useEffect(() => {
    setProducts(productsRedux);
    let totalReal = 0
    let totalPrice = 0;
    productsRedux.forEach((product) => {
      const productPrice = product.descuento > 0 ?
        (product.precio - (product.precio * (product.descuento / 100))).toFixed(3).slice(0, -1)
        : product.precio.toFixed(3).slice(0, -1)
      totalPrice += productPrice * product.quantity;
      totalReal += product.precio * product.quantity;
    });
    setProductsPrice(parseFloat(totalPrice.toFixed(3).slice(0, -1)));
    setTotalReal(totalReal)
  }, [productsRedux]);

  const updateQuantity = (index, change) => {
    dispatch(updateProductQuantity({ index, change }));
    let productsUpdate = [...products];
    const productPrice = productsUpdate[index].descuento > 0 ?
      (productsUpdate[index].precio - (productsUpdate[index].precio * (productsUpdate[index].descuento / 100))).toFixed(3).slice(0, -1)
      : productsUpdate[index].precio.toFixed(3).slice(0, -1)
    change > 0
      ? updateTotalPrice(productPrice)
      : updateTotalPrice(-productPrice);
    setProducts(productsUpdate);
  };

  const updateTotalPrice = (change) => {
    setProductsPrice(
      parseFloat((productsPrice + change))
    );
  };

  const removeProduct = (product) => {
    dispatch(removeProductCart(product));
    notifySuccess("Producto eliminado!");
  };

  const createPurchase = async () => {
    const db = getFirestore()
    const comprasSnapshot = await getDocs(collection(db, "compras"));
    const fecha = new Date().toISOString().split('T')[0];
    const id = comprasSnapshot.size + 1
    let tituloFactura = document.getElementById('tituloFactura');
    tituloFactura.textContent = 'Factura #' + id;
    const purchaseData = {
      fecha,
      usuarioId: userId,
      productos: products,
      id: id
    };
    try {
      const purchaseId = await addDocWithoutId("compras", purchaseData);
      updateProducts()
      notifySuccess("Compra realizada con exito.\nFinalizando...", async () => {
        await downloadPDF()
        dispatch(cleanCart())
        let tituloFactura = document.getElementById('tituloFactura');
        tituloFactura.textContent = 'Factura';
      }
      );
    } catch (error) {
      notifyError(error);
    }
  };

  const updateProducts = () => {
    products.forEach((product) => {
      const db = getFirestore();
      const productRef = doc(db, "productos", product.id)
      const newStock = product.stock > 0 ? product.stock - product.quantity : 0
      updateDoc(productRef, { stock: newStock })
    })
  }

  const downloadPDF = () => new Promise((resolve, reject) => {
    const content = document.getElementById('factura');
    const opt = {
      margin: 10
    }
    html2pdf()
      .set(opt)
      .from(content)
      .save('factura.pdf');
    resolve('');
  });

  return (
    <div className="flex flex-col md:flex-row w-full items-center">
      <div className="w-3/4 bg-white px-10 py-10 m-10 shadow-md">
        <div className="flex flex-col md:flex-row justify-between border-b pb-8">
          <h1 className="font-semibold text-2xl">Carrito</h1>
          <h2 className="font-semibold text-2xl underline decoration-wavy">
            {products.length} Producto(s)
          </h2>
        </div>
        <div className="flex mt-10 mb-5 justify-center">
          <h3 className="font-semibold text-gray-600 text-xs uppercase w-2/5">
            Detalles
          </h3>
          <h3 className="hidden font-semibold text-center text-gray-600 text-xs uppercase md:block w-1/5 text-center">
            Cantidad
          </h3>
          <h3 className="hidden font-semibold text-center text-gray-600 text-xs uppercase md:block w-1/5 text-center">
            Precio
          </h3>
          <h3 className="hidden font-semibold text-center text-gray-600 text-xs uppercase md:block w-1/5 text-center">
            Total
          </h3>
        </div>
        {products.map((product, index) => {
          return (
            <div
              key={index}
              className="flex items-center hover:bg-gray-100 -mx-8 px-6 py-5"
            >
              <div className="flex w-[initial] md:w-2/5">
                <div className="w-20">
                  <img className="h-24" src={product.imagen} alt="" />
                </div>
                <div className="flex flex-col justify-between ml-4 flex-grow">
                  <span className="font-bold text-sm">{product.nombre}</span>
                  <span className="text-[#1d4675] text-xs">
                    {product.categoria.charAt(0).toUpperCase() + product.categoria.slice(1)}
                  </span>
                  <a
                    className="font-semibold hover:text-red-500 text-gray-500 text-xs"
                    onClick={() => removeProduct(product)}
                  >
                    Eliminar
                  </a>
                </div>
              </div>
              <div className="flex justify-center items-center w-1/5">
                {
                  product.quantity > 1 &&
                  <a
                    onClick={() => {
                      updateQuantity(index, -1);
                    }}
                    className="hover:cursor-pointer"
                  >
                    <svg
                      className="fill-current text-gray-600 w-3"
                      viewBox="0 0 448 512"
                    >
                      <path d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" />
                    </svg>
                  </a>
                }

                <input
                  className="mx-2 border text-center w-8"
                  type="text"
                  value={product.quantity}
                />
                {
                  product.stock > product.quantity &&
                  <a
                    onClick={() => {
                      updateQuantity(index, 1);
                    }}
                    className="hover:cursor-pointer"
                  >
                    <svg
                      className="fill-current text-gray-600 w-3"
                      viewBox="0 0 448 512"
                    >
                      <path d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" />
                    </svg>
                  </a>
                }

              </div>
              <span className="text-center font-semibold text-sm hidden w-1/5 md:block ">
                ${product.descuento > 0 ? (product.precio - (product.precio * (product.descuento / 100))).toFixed(3).slice(0, -1) : product.precio.toFixed(3).slice(0, -1)}
              </span>
              <span className="text-center w-1/5 font-semibold text-sm">
                ${((product.descuento > 0 ? (product.precio - (product.precio * (product.descuento / 100))).toFixed(3).slice(0, -1) : product.precio.toFixed(3).slice(0, -1))
                  * product.quantity).toFixed(3).slice(0, -1)}
              </span>
            </div>
          );
        })}
      </div>

      <div className="w-3/4 md:w-1/4 px-8 py-10 m-2 md:m-10 shadow-md">
        <div id="factura">
          <h1 className="font-semibold text-2xl pb-5 border-b" id="tituloFactura">Factura</h1>
          {
            userId &&
            <>
              <div className="border-b">
                <div className="pt-5"><span className="font-bold">Empresa</span></div>
                <div className="pt-2"><span className="font-bold">Ruc:</span> 17243030010</div>
                <div><span className="font-bold">Fecha:</span> {new Date().toISOString().split('T')[0]}</div>
                <div><span className="font-bold">Ciudad:</span> Quito</div>
                <div><span className="font-bold">Dirección:</span> La Betraña</div>
                <div><span className="font-bold">Telf.:</span> 0990014353</div>

                <div className="pb-5"><span className="font-bold">Email:</span> simon@yahoo.es</div>
              </div>
              <div className="border-b">
                <div className="pt-5"><span className="font-bold">Cliente</span></div>
                <div className="pt-2"><span className="font-bold">Nombre:</span> {user.nombre + " " + user.apellido}</div>
                <div><span className="font-bold">C.I:</span> {user.identificacion}</div>
                <div><span className="font-bold">Email:</span> {user.email}</div>
                <div className="pb-5"><span className="font-bold">Direccion:</span> {user.ciudad}, {user.direccion}</div>
              </div>
            </>
          }
          <div className="flex flex-col justify-between mt-5 mb-5">
            <div className="flex justify-between mb-2">
              <div className="font-semibold text-sm uppercase">
                <span className="mr-2">
                  cant.
                </span>
                <span>
                  producto
                </span>
              </div>
              <span>
                Total
              </span>
            </div>
            {products.map((product, key) => {
              return (
                <div className="flex justify-between">
                  <div className="font-semibold text-sm uppercase">
                    <span className="mr-10">
                      {product.quantity}
                    </span>
                    <span>
                      {product.nombre}
                    </span>
                  </div>
                  <span className="font-semibold text-sm">${((product.descuento > 0 ? (product.precio - (product.precio * (product.descuento / 100))).toFixed(3).slice(0, -1) : product.precio.toFixed(3).slice(0, -1))
                    * product.quantity).toFixed(3).slice(0, -1)}
                  </span>
                </div>
              )

            })}
          </div>
          <div className="border-t">
            <div className="flex flex-col my-3">
              <div className="flex font-semibold justify-between text-sm uppercase">
                <span>Subtotal</span>
                <span>${productsPrice ? parseFloat(productsPrice - (productsPrice * 0.12)).toFixed(3).slice(0, -1) : 0}</span>
              </div>
              <div className="flex font-semibold justify-between text-sm uppercase">
                <span>IVA 12%</span>
                <span>${productsPrice ? parseFloat(productsPrice * 0.12).toFixed(3).slice(0, -1) : 0}</span>
              </div>
              <div className="flex font-semibold justify-between text-sm uppercase">
                <span>Total</span>
                <span>${parseFloat(productsPrice)}</span>
              </div>
              {
                <div className="flex font-semibold justify-between text-sm uppercase">
                  <span>Ahorraste</span>
                  <span>${parseFloat(Math.abs(totalReal - productsPrice)).toFixed(3).slice(0, -1)}</span>
                </div>
              }

            </div>

          </div>
        </div>
        <button
          className={`font-semibold py-3 text-sm text-white uppercase w-full ${products.length > 0 && userId ? "bg-[#1d4675]" : "bg-gray-500"}`}
          disabled={products.length < 1 || !userId}
          onClick={() => {
            createPurchase();
          }}
        >
          {userId ? "Comprar" : "Inicia Sesión"}
        </button>
      </div>
    </div>
  );
}
