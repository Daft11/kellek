import React from "react";
import { Link } from "react-router-dom";
import '@styles/GalleryItem.css';
import { GroupedProduct } from "../../services/products.service";

const GalleryItem = function (item: GroupedProduct) {

    const image = require(`../../assets/products/${item.id}/image.png`);

    return (
        <Link className="gallery-item" to={`/product?id=${item.id}&color=${item.availableColors[0].idKey}&type=${item.availableTypes[0].idKey}&size=${item.availableSizes[0].idKey}`}>
            <div className="gallery-item-name-wrapper">
                <p className="gallery-item-groupname">{item.categoryName}</p>
                <p className="gallery-item-productname">{item.groupName}</p>
            </div>
            <img src={image} alt="" draggable="false"/>
        </Link>
    )

}

export default GalleryItem
