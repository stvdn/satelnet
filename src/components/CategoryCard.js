import React from "react";
import { Link } from "react-router-dom";

export default function CategoryCard({ category: {id, data} }) {
    return (
        <Link to="/products" state={{"categoria": id}} className="category-card-container hover:cursor-pointer">
            <img className="category-card-img" src={data.imagen} />
            <div className="category-card-title">{data.nombre.charAt(0).toUpperCase() + data.nombre.slice(1)}</div>
        </Link>
    )
}