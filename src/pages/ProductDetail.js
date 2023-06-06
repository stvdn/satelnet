import React, { useEffect, useState } from "react";
import { getDocById } from "../services/firebase/firestore";
import { useLocation } from "react-router-dom";
import { getDoc } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, updateProductQuantity } from "../slices/cartSlice";
import { notifySuccess } from "../services/notification";

export default function ProductDetail() {
    const [product, setProduct] = useState({})
    let { state } = useLocation()
    const dispatch = useDispatch();
    const productsCart = useSelector((state) => state.cart.products);

    const checkProductCart = (id) => {
        const indexProduct = productsCart.findIndex((productCart) => {
            return productCart.id === id;
        });
        indexProduct != -1 ? updateProductCart(indexProduct, 1) : addCart(product.data);
    };

    const addCart = (data) => {
        data.quantity = 1;
        data.id = product.id;
        dispatch(addToCart(data));
        notifySuccess("Producto agregrado!");
    };

    const updateProductCart = (index, change) => {
        dispatch(updateProductQuantity({ index, change }));
        notifySuccess("Producto actualizado!");
    };

    useEffect(() => {
        async function getProduct() {
            const product = await getDocById("productos", state.id)
            let productData = product.data()
            let category = await getDoc(product.data()["categoria"])
            productData["categoria"] = category.data()["nombre"]
            setProduct({ id: product.id, data: productData })
        }

        getProduct()
    }, []);

    return (
        <div>
            {
                product.data &&
                <div class="small-container single-product">
                    <div class="row">
                        <div class="col-2">
                            <img src={product.data.imagen} width="100%" id="ProductImg" />
                        </div>
                        <div class="col-2">
                            <p>{product.data.categoria.charAt(0).toUpperCase() + product.data.categoria.slice(1)}</p>
                            <h1>{product.data.nombre}</h1>
                            <h4>$ {product.data.precio}</h4>
                            <h3>{product.data.stock > 0 ? `${product.data.stock} unidad(es) disponible(s)` : <span className="text-red-500">No disponible</span>}</h3>
                            {
                                product.data.stock > 0 
                                ? <a onClick={() => {
                                        checkProductCart(product.id);
                                    }} className="btn hover:cursor-pointer">Agregar al carrito</a>
                                : <a className="btn hover:cursor-pointer">Producto no disponible</a>
                            }
                            <h3>Detalles del Producto</h3>
                            <br />
                            <p>{product.data.descripcion}</p>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}