import React from "react";
import { GroupParamType, ProductAddInfo, ProductColorProp, ProductProp, ProductPropsType, ProductSizeProp, ProductType } from "../types/types";
import { Observable } from "./observable/observable";
import availableProducts from '../availableProducts.json'
import productProps from '../productProps.json'

const { createContext, useContext } = React  

export class GroupedProduct {
    id: string
    categoryName: string
    groupName: string

    constructor(public category: string,
                public groupParamValue: string,
                public groupType: GroupParamType,
                public availableColors: ProductColorProp[] = [],
                public availableTypes: ProductProp[] = [],
                public availableSizes: ProductSizeProp[] = []
    ) {
        this.categoryName = productProps.category[this.category.valueOf()]?.displayName || ''
        switch (groupType) {
            case GroupParamType.size:
                this.id = `${this.category}-${groupParamValue}`
                this.groupName = productProps.sizes[groupParamValue]?.displayName || ''
                break;
            case GroupParamType.type:
                this.id = `${this.category}-${groupParamValue}`
                this.groupName = productProps.types[groupParamValue]?.displayName || ''
                break;
            default: 
                this.id = `${this.category}`
        }
    }
    getModel = (type = 'default', color = 'default'): any => {
        return require(`../assets/${this.id}/${type}-${color}.glb`)
    }

    getImage = (): any => {
        return require(`../assets/products/${this.id}/image.png`)
    }

    getMagicQuickModelId = (product: ProductPropsType) => {
        const {color, size, type} = product
        let idTailPart = ''
        switch (this.groupType) {
            case GroupParamType.size: {
                idTailPart = type + productProps.sizes[this.groupParamValue].idKey + color
                break;
            }
            case GroupParamType.type: {
                idTailPart = productProps.types[this.groupParamValue].idKey + size + color
                break;
            }
        }
        return '' + productProps.category[this.category].idKey + idTailPart
    }

    getSizeAdditionalInfo = (sizeIdKey: string) => {
        return this.availableSizes.find(size => size.idKey === sizeIdKey)?.additionalInfo || {displayName: '', value: ''}
    }

    addColor = (id: string) => {
        const color: ProductColorProp = productProps.colors[id]
        if (this.availableColors.find(({idKey})=>idKey===color.idKey)){
            return
        }
        this.availableColors.push(color)
    }

    addType = (id: string) => {
        const type: ProductProp = productProps.types[id]
        if (this.availableTypes.find(({idKey})=>idKey===type.idKey)){
            return
        }
        this.availableTypes.push(type)
    }

    addSize = (id: string) => {
        const size: ProductSizeProp = productProps.sizes[id]
        if (this.availableSizes.find(({idKey})=>idKey===size.idKey)){
            return
        }
        this.availableSizes.push(size)
    }
}

const productGroups = groupProductsByCatPredicate(availableProducts.products)

function groupProductsByCatPredicate(products: ProductType[]) {
    return products.reduce<GroupedProduct[]>((acc, product) => {
        const category = productProps.category[product.category]
        const predicate = category.groupType as GroupParamType
        const predicateValue = product[predicate.valueOf()]
        const groupId = predicateValue ? `${product.category}-${predicateValue}` : `${product.category}`

        const group = acc.find(({id}) => id === groupId)
        if (group) {
            group.addColor(product.color)
            group.addType(product.type)
            group.addSize(product.size)
            return acc
        }

        const color = productProps.colors[product.color]
        const type = productProps.types[product.type]
        const size = productProps.sizes[product.size]
        return [...acc, new GroupedProduct(
            product.category,
            predicateValue,
            predicate,
            color ? [color] : [],
            type ? [type] : [],
            size ? [size] : []
        )]
    }, [])
}

class ProductsService {
    
    public currentProduct = new Observable<GroupedProduct | null>(null)
    public isViewboxExpanded = new Observable<boolean>(false)

    constructor(private readonly productsList: GroupedProduct[]) {}

    public getProductsList = (): GroupedProduct[] => {
        return this.productsList
    }

    public setCurrentProduct = (id: string): GroupedProduct | null => {
        this.currentProduct.set(this.productsList.find(p => p.id === id) || null)
        return this.getCurrentProduct()
    }

    public getCurrentProduct = (): GroupedProduct | null => {
        return this.currentProduct.get()
    }

    public clearCurrentState =() => {
        this.currentProduct.set(null)
    }

}

const ProductsSericeContext = createContext(new ProductsService(productGroups))

export const useProductsService = () => {
    return useContext(ProductsSericeContext)
}
