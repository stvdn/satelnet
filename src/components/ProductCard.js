import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { notifyError, notifySuccess } from "../services/notification";
import { addToCart } from "../slices/cartSlice";
import { updateProductQuantity} from "../slices/cartSlice";
import { Link } from "react-router-dom";
import { deleteDoc, doc, getFirestore } from "firebase/firestore";

export default function ProductCard({ product: { id, data } }) {
  const dispatch = useDispatch();
  const productsCart = useSelector((state) => state.cart.products);
  const user = useSelector((state) => state.signIn.userData);

  const checkProductCart = (id) => {
    const indexProduct = productsCart.findIndex((productCart) => {
      return productCart.id === id;
    });
    indexProduct != -1 ? updateProductCart(indexProduct, 1) : addCart(data);
  };

  const addCart = (data) => {
    data.quantity = 1;
    data.id = id;
    dispatch(addToCart(data));
    notifySuccess("Producto agregrado!");
  };

  const deleteProduct = (id) => {
    if (window.confirm("Seguro de eliminar el producto?")) {
      const firestore = getFirestore();
      const documentRef = doc(firestore, `productos/${id}`);
      deleteDoc(documentRef)
        .then(() => {
          notifySuccess("Producto eliminado, espere un momento...", () => {
            window.location.reload();
          })
        })
        .catch((error) => {
          notifyError("Error al eliminar el producto")
        });
    }
  }

  const updateProductCart = (index, change) => {
    dispatch(updateProductQuantity({ index, change }));
    notifySuccess("Producto actualizado!");
  };

  return (
    <React.Fragment>
      <div className="flex flex-col rounded-lg  border bg-white m-5">
        <Link to="/product-detail" state={{ id: id }} className="flex justify-center">
          <img
            src={data.imagen}
            alt="Producto"
            style={{ height: "200px", width: "80%", marginTop: "30px" }}
            className="rounded"
          />
        </Link>

        <div className="p-6 flex flex-col h-full">
          <div className="text-gray-600 font-semibold tracking-wide text-xs uppercase">
            {data.stock > 0 ? `${data.stock} unidad(es) disponible(s)` : <span className="text-red-500">No disponible</span>}
          </div>
          <Link to="/product-detail" state={{ id: id }} className="font-semibold text-lg leading-tight truncate mt-2">
            {data.nombre}
          </Link>
          <div className="mb-2 mt-2">{data.categoria.charAt(0).toUpperCase() + data.categoria.slice(1)}</div>
          <div className="flex justify-between mt-auto">
            <div>
              <span className={`text-[#419641] ${data.descuento > 0 ? 'line-through text-sm' : 'text-xl'}`}>${data.precio}</span>
              {
                data.descuento > 0 &&
                <span className="text-[#419641] text-xl"> ${(data.precio - (data.precio * (data.descuento / 100))).toFixed(3).slice(0, -1)}</span>
              }
            </div>
            {
              data.stock > 0 ?
                <a
                  onClick={() => {
                    checkProductCart(id);
                  }}
                  className="hover:cursor-pointer hover:text-[#419641]"
                >
                  <i
                    className="fa fa-cart-plus"
                    aria-hidden="true"
                    style={{ fontSize: "20px" }}
                  ></i>
                </a> :
                <></>
            }

          </div>
          {
            user.esAdmin &&
            <div className="flex justify-evenly mt-3">

              <Link
                to={'/upload-product'}
                state={{product: {id, data}}}
                className="hover:cursor-pointer hover:text-yellow-500"
              >
                <i className="fa fa-pencil"
                  aria-hidden="true"
                  style={{ fontSize: "20px" }}
                ></i>
              </Link>
              <a
                onClick={() => {
                  deleteProduct(id);
                }}
                className="hover:cursor-pointer hover:text-red-500"
              >
                <i className="fa fa-trash-o"
                  aria-hidden="true"
                  style={{ fontSize: "20px" }}
                ></i>
              </a>
            </div>
          }
        </div>
      </div>
    </React.Fragment>
  );
}
