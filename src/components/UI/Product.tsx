import React, { Fragment, useRef } from "react";
import '@styles/Product.css'
import expandIcon from '@assets/expand-btn.svg';
import closeIcon from '@assets/expand-close-btn.svg';
import '@google/model-viewer';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GroupedProduct, useProductsService } from "../../services/products.service";
import MediaQuery, { useMediaQuery } from "react-responsive";
import { useObservable } from "../../services/observable/useObservable";
import {ModelViewerMagicQuick as ModelViewer} from "./modelViewer";
import { GroupParamType, ProductPropsType } from "../../types/types";

function useQuery() {
    const { search } = useLocation();
    return React.useMemo(() => new URLSearchParams(search), [search]);
}
  
const ProductComponent = function () {

    let navigate = useNavigate();
    
    const service = useProductsService();
    const id = useQuery().get('id') || '';
    const currentType = useQuery().get('type');
    const currentColor = useQuery().get('color');
    const currentSize = useQuery().get('size');


    const isMobile = useMediaQuery({
        query: '(hover: none) and (pointer: coarse)'
    })
    
    const product = service.setCurrentProduct(id) as GroupedProduct;
    const isViewboxExpanded = useObservable(service.isViewboxExpanded)
    const modelViewerRef = useRef<HTMLHeadingElement>(null);

    const setViewboxExpanded = (value) => {
        const height = modelViewerRef.current?.scrollHeight || 0
        const width = modelViewerRef.current?.scrollWidth || 0
        const offsetLeft = modelViewerRef.current?.offsetLeft
        const offsetTop = modelViewerRef.current?.offsetTop
        modelViewerRef.current?.style.setProperty("height", value ? height+ "px" : '100%');
        modelViewerRef.current?.style.setProperty("width", value ? width + "px" : '100%');
        modelViewerRef.current?.style.setProperty("position", value ? "absolute" : "relative");
        modelViewerRef.current?.style.setProperty("left", offsetLeft + "px");
        modelViewerRef.current?.style.setProperty("top", offsetTop + "px");
        modelViewerRef.current?.style.removeProperty("height");
        modelViewerRef.current?.style.removeProperty("width");
        modelViewerRef.current?.style.removeProperty("left");
        modelViewerRef.current?.style.removeProperty("top");
        // setTimeout(() => {
        // }, 1)
        // modelViewerRef.current?.style.setProperty("transform", "translate(-50%, -50%)");
        
        // modelViewerRef.current?.style.setProperty("left", 0 + "px");
        // modelViewerRef.current?.style.setProperty("top", 0 + "px");
        service.isViewboxExpanded.set(value)
    }

    const groupType = product?.groupType

    const currentProductProps: ProductPropsType = {
        category: product?.category || '',
        color: currentColor || '',
        size: currentSize || '',
        type: currentType || ''
    }

    return (
        <div className="product-wrapper">
            <div className={"product-3d-wrapper " + (isViewboxExpanded ? "fullscreen" : "")} ref={modelViewerRef}>
                <ModelViewer productId={product?.getMagicQuickModelId(currentProductProps)} className={"modelViewer"}></ModelViewer>
                <button className={"product-3d-expand-btn " + (isViewboxExpanded ? "top" : "bottom")} onClick={() => setViewboxExpanded(!isViewboxExpanded)}>
                    {
                        isViewboxExpanded 
                        ? <Fragment><p>свернуть</p><img src={closeIcon} alt="" className="expand-close-btn"/></Fragment>
                        : <Fragment><img src={expandIcon} alt="" className="expand-btn"/></Fragment>
                    }
                </button>
            </div>
            <div className={"product-sidebar " + (isViewboxExpanded ? "" : "")}>
                <div className="product-sidebar-top">
                    {
                        isMobile
                        ? <div className="product-info-mobile">
                            <ProductNameInfoComponent product={product} currSize={currentProductProps.size}/>
                          </div>
                        : <ProductNameInfoComponent product={product} currSize={currentProductProps.size}/>
                    }
                    <div className="product-types" hidden={groupType === GroupParamType.type}>
                        {product?.availableTypes.map((type, i) => 
                            <button className={"btn type-btn " + (currentType === type.idKey ? "active" : "")}
                                    key={i}
                                    onClick={() => navigate(`/product?id=${product?.id}&color=${currentColor}&type=${type.idKey}&size=${currentSize}`)}>
                                        {type.displayName}
                            </button>
                        )}
                    </div>
                    <div className="product-sizes" hidden={groupType === GroupParamType.size}>
                        {product?.availableSizes.map((size, i) => 
                            <button className={"btn type-btn " + (currentSize === size.idKey ? "active" : "")}
                                    key={i}
                                    onClick={() => navigate(`/product?id=${product?.id}&color=${currentColor}&type=${currentType}&size=${size.idKey}`)}>
                                        {size.displayName}
                            </button>
                        )}
                    </div>
                    <div className="product-colors">
                        {product?.availableColors.map((color, i) => 
                        <button className="btn color-btn"
                                key={i}
                                onClick={() => navigate(`/product?id=${product?.id}&color=${color.idKey}&type=${currentType}&size=${currentSize}`)}>
                            <p className={"color-example " + (currentColor === color.idKey ? "active" : "")}
                                  style={{backgroundColor: color.color}}></p>
                            <p className={"color-name " + (currentColor === color.idKey ? "active" : "")}>{color.displayName}</p>
                        </button>)}
                    </div>
                </div>
                <Link to="/gallery" className="backtogallery-btn">
                    Смотреть все{isMobile ? ' ' : <br/>}продукты KELLEK
                </Link>
            </div>
        </div>
    )
}

const ProductNameInfoComponent = function ({product, currSize}: {product: GroupedProduct, currSize: string}) {
    return (
        <Fragment>
            <div className="product-name-wrapper">
                <p className="product-groupname">{product.categoryName}</p>
                <p className="product-productname">{product.groupName}</p>
            </div>
            <div className="product-info-wrapper">
                <p className="product-info-name">{product.getSizeAdditionalInfo(currSize).displayName}</p>
                <p className="product-info-value">{product.getSizeAdditionalInfo(currSize).value}</p>
            </div>
        </Fragment>
    )
}

export default ProductComponent