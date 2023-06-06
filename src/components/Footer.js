import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function Footer(){
  const userId = useSelector((state) => state.signIn.userId);

    return (
        <div className="footer mt-10">
                <div className="container">
                    <div className="row">
                        <div className="footer-col-2">
                            <img src={require("../img/logo.jpeg")} className="block mx-auto mb-0 mb-20" />
                            <p>
                                "Innovación constante impulsa nuestro éxito: ofrecemos productos tecnológicos de vanguardia para mantener a nuestros clientes
                                a la vanguardia de la revolución digital. Nuestro compromiso con la calidad, la confiabilidad y el diseño excepcional nos 
                                posiciona como líderes en el mercado, brindando soluciones tecnológicas que mejoran la vida cotidiana y potencian el crecimiento 
                                de nuestros clientes."
                            </p>
                        </div>
                        <div className="footer-col-3">
                            <h3>Información</h3>
                            <ul>
                                <li className="hover:cursor-pointer">
                                    <Link to="/products" className="text-white">
                                        Productos
                                    </Link>
                                </li>
                                <li className="hover:cursor-pointer">
                                    <Link to="/contactus" className="text-white">
                                        Contactanos
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="footer-col-4">
                            <h3>Servicios</h3>
                            <ul>
                                <li className="hover:cursor-pointer">
                                    <Link to={userId ? "/profile" : "sign-in"} className="text-white">
                                       Mi cuenta 
                                    </Link>
                                </li>
                                <li className="hover:cursor-pointer">
                                    <Link to="/cart" className="text-white">
                                        Carrito
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <hr />
                    <p className="copyright">Copyright 2023</p>
                </div>
            </div>
    )
}