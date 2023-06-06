import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import {
  collection,
  query,
  onSnapshot,
  getFirestore,
  getDoc,
  where,
  getDocs,
  orderBy,
  doc,
} from "firebase/firestore";
import { useLocation } from "react-router-dom";

export default function Products() {
  let {state} = useLocation()
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("")
  const [categories, setCategories] = useState([])
  const [category, setCategory] = useState(state?.categoria ? state.categoria : "todas")
  const [sortBy, setSortBy] = useState("asc")

  useEffect(() => {
    const db = getFirestore();
    const getCategories = async (db) => {
      const q = query(collection(db, 'categorias'));
      const querySnapshot = await getDocs(q);
      const categories = querySnapshot.docs.map((doc) => { return { name: doc.data()["nombre"], id: doc.id  } });
      setCategories(categories)
    }
    const getProducts = async (db) => {
      let q = query(collection(db, 'productos'), orderBy("precio", sortBy));
      if(category != "todas"){
        const docRef = doc(db, "categorias" , category);
        q = query(q, where("categoria", "==", docRef))
      } 
      const querySnapshot = await getDocs(q);
      let products = querySnapshot.docs.map(async (doc) => { 
        const snapCategoria = await getDoc(doc.data()["categoria"])
        let docData = doc.data()
        docData["categoria"] = snapCategoria.data()["nombre"]       
        return {id: doc.id, data: docData}
      });
      products = await Promise.all(products)
      setProducts(products)
    }
    getProducts(db)
    getCategories(db);

  }, [category, sortBy]);

  return (
    <div>
      <h1 className="text-5xl text-center mt-5 text-[#1d4675]">Productos</h1>
      <div className="flex items-center justify-evenly">
        <div className="flex flex-col items-center md:flex-row">
          <div className="text-lg w-full">Categoria: </div>
          <select id="countries"
          class="bg-[#1d4675] border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5"
          onChange={(e)=>setCategory(e.target.value)}
          >
            <option value="todas" selected={state?.categoria ? false : true}>Todas</option>
            {categories && categories.map((category, index)=>
              <option key={index} value={category.id} selected={state?.categoria == category.id ? true : false}>{category.name}</option>
            )} 
          </select>
        </div>
        <div className="flex flex-col items-center md:flex-row">
          <div className="text-lg w-full mr-2">Ordenar por: </div>
          <select
          id="countries" class="bg-[#1d4675] border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5"
          onChange={(e)=>setSortBy(e.target.value)}
          >
            <option value="asc">Menor Precio</option>
            <option value="desc">Mayor Precio</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,_minmax(15rem,_1fr))] gap-7 mx-7 mt-10 pb-10">
        {products &&
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
      </div>
    </div>
  );
}
