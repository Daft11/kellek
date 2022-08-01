import React, { Fragment } from "react";
import '@styles/Gallery.css'
import GalleryItem from "./GalleryItem";
import { useProductsService } from '../../services/products.service'

const Gallery = function () {

    const service = useProductsService();
    service.clearCurrentState()
    
    const items = service.getProductsList();

    return (
        <Fragment>
            <h2 className="gallery-header">Галерея</h2>
            <div className="gallery-items-wrapper">
                {items.map((item, i) => <GalleryItem  {...item} key={i}/>)}
            </div>
        </Fragment>
    )
}

export default Gallery