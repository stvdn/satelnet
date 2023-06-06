import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import CategoryCard from "../components/CategoryCard";
import { collection, getDoc, getDocs, getFirestore, onSnapshot, query, where } from "firebase/firestore";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";

function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{ ...style, display: "block", background: "#419641", borderRadius: "100%" }}
            onClick={onClick}
        />
    );
}

function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{ ...style, display: "block", background: "#419641", borderRadius: "100%" }}
            onClick={onClick}
        />
    );
}

export default function Home() {
    const [categories, setCategories] = useState([])
    const [products, setProducts] = useState([])
    const [discountProducts, setDiscountProducts] = useState([])
    const settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                },
            },
        ],
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />
    };

    useEffect(() => {
        const db = getFirestore();
        const getCategories = async (db) => {
            const q = query(collection(db, 'categorias'));
            const querySnapshot = await getDocs(q);
            const categories = querySnapshot.docs.map((doc) => { return { data: doc.data(), id: doc.id } });
            setCategories(categories)
        }
        const getProducts = async (db) => {
            const q = query(collection(db, 'productos'));
            const qd = query(collection(db, 'productos'), where("descuento", ">", 0));
            const querySnapshot = await getDocs(q);
            const querySnapshotD = await getDocs(qd);
            let products = querySnapshot.docs.map(async (doc) => {
                const snapCategoria = await getDoc(doc.data()["categoria"])
                let docData = doc.data()
                docData["categoria"] = snapCategoria.data()["nombre"]
                return { id: doc.id, data: docData }
            });
            let discountProducts = querySnapshotD.docs.map(async (doc) => {
                const snapCategoria = await getDoc(doc.data()["categoria"])
                let docData = doc.data()
                docData["categoria"] = snapCategoria.data()["nombre"]
                return { id: doc.id, data: docData }
            });
            products = await Promise.all(products)
            discountProducts = await Promise.all(discountProducts)
            setProducts(products)
            setDiscountProducts(discountProducts);
        }
        getProducts(db)
        getCategories(db);
    }, []);

    return (
        <>

            <div class="home-slider-row">
                <div class="small-container">
                    <h2 class="title home-title">Categorias</h2>
                    <Slider {...settings}>
                        {categories.map((category) => <CategoryCard key={category.id} category={category} />)}
                    </Slider>
                </div>
            </div>

            <div class="home-slider-row">
                <div class="small-container">
                    <h2 class="title home-title">Nuevos Productos</h2>
                    <Slider {...settings}>
                        {products.map((product) => <ProductCard key={product.id} product={product} />)}
                    </Slider>
                </div>
            </div>

            <div class="home-slider-row">
                <div class="small-container">
                    <h2 class="title home-title">Promociones</h2>
                    <Slider {...settings}>
                        {discountProducts.map((product) => <ProductCard key={product.id} product={product} />)}
                    </Slider>
                </div>
            </div>

            <div class="brands">
                <div class="small-container">
                    <div class="row">
                        <div class="col-5">
                            <img src={require("../img/acer.png")} />
                        </div>
                        <div class="col-5">
                            <img src={require("../img/sam.png")} />
                        </div>
                        <div class="col-5">
                            <img src={require("../img/hp.png")} />
                        </div>
                        <div class="col-5">
                            <img src={require("../img/nvidia.jpeg")} />
                        </div>
                        <div class="col-5">
                            <img src={require("../img/intel.jpeg")} />
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
}
