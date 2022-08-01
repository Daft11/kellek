import React, { Fragment } from "react";
import '@styles/Product.css'
import expandIcon from '@assets/expand-btn.svg';
import closeIcon from '@assets/expand-close-btn.svg';
import '@google/model-viewer';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useProductsService } from "../../services/products.service";
import MediaQuery, { useMediaQuery } from "react-responsive";
import { useObservable } from "../../services/observable/useObservable";
import {ModelViewerMagicQuick as ModelViewer} from "./modelViewer";

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

    const isMobile = useMediaQuery({
        query: '(hover: none) and (pointer: coarse)'
    })
    
    const product = service.setCurrentProduct(id);
    const isViewboxExpanded = useObservable(service.isViewboxExpanded)

    const setViewboxExpanded = (value) => {
        service.isViewboxExpanded.set(value)
    }

    return (
        <div className="product-wrapper">
            <div className={"product-3d-wrapper " + (isViewboxExpanded ? "expanded" : "")}>
                <ModelViewer productId={product?.getMagicQuickModelId(currentType, currentColor)}></ModelViewer>
                <button className={"product-3d-expand-btn " + (isViewboxExpanded ? "top" : "bottom")} onClick={() => setViewboxExpanded(!isViewboxExpanded)}>
                    {
                        isViewboxExpanded 
                        ? <Fragment><p>свернуть</p><img src={closeIcon} alt="" className="expand-close-btn"/></Fragment>
                        : <Fragment><img src={expandIcon} alt="" className="expand-btn"/></Fragment>
                    }
                </button>
            </div>
            <div className={"product-sidebar " + (isViewboxExpanded ? "expanded" : "")}>
                <div className="product-sidebar-top">
                    {
                        isMobile
                        ? <div className="product-info-mobile">
                            <ProductNameInfoComponent product={product}/>
                          </div>
                        : <ProductNameInfoComponent product={product}/>
                    }
                    <div className="product-types">
                        {product?.availableTypes.map((type, i) => 
                            <button className={"btn type-btn " + (currentType === type.idKey ? "active" : "")}
                                    key={i}
                                    onClick={() => navigate(`/product?id=${product?.id}&color=${currentColor}&type=${type.idKey}`)}>
                                        {type.displayName}
                            </button>
                        )}
                    </div>
                    <div className="product-colors">
                        {product?.availableColors.map((color, i) => 
                        <button className="btn color-btn" key={i} onClick={() => navigate(`/product?id=${product?.id}&color=${color.idKey}&type=${currentType}`)}>
                            <p className={"color-example " + (currentColor === color.idKey ? "active" : "")}
                                  style={{backgroundColor: color.color}}></p>
                            <p className={"color-name " + (currentColor === color.idKey ? "active" : "")}>{color.displayName}</p>
                        </button>)}
                    </div>
                </div>
                <Link to="/gallery" className="backtogallery-btn">
                    Смотреть все<MediaQuery minWidth={600}><br/></MediaQuery>продукты KELLEK
                </Link>
            </div>
        </div>
    )
}

const ProductNameInfoComponent = function ({product}) {
    return (
        <Fragment>
            <div className="product-name-wrapper">
                <p className="product-groupname">{product.groupName}</p>
                <p className="product-productname">{product.productName}</p>
            </div>
            <div className="product-info-wrapper">
                <p className="product-info-name">{product.additionalInfo.displayName}</p>
                <p className="product-info-value">{product.additionalInfo.value}</p>
            </div>
        </Fragment>
    )
}

export default ProductComponent