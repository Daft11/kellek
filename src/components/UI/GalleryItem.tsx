import React from "react";
import { Link } from "react-router-dom";
import '@styles/GalleryItem.css';
import { ProductType } from "../../types/types";

const GalleryItem = function (item: ProductType) {

    const image = require(`../../assets/${item.id}/image.png`);

    return (
        <Link className="gallery-item" to={`/product?id=${item.id}&color=${item.availableColors[0].idKey}&type=${item.availableTypes[0].idKey}`}>
            <div className="gallery-item-name-wrapper">
                <p className="gallery-item-groupname">{item.groupName}</p>
                <p className="gallery-item-productname">{item.productName}</p>
            </div>
            <img src={image} alt="" draggable="false"/>
        </Link>
    )

}

export default GalleryItem
