import React from "react";
import { ProductAddInfo, ProductColorProp, ProductProp, ProductType } from "../types/types";
import { Observable } from "./observable/observable";
import availableProducts from '../availableProducts.json'
import productProps from '../productProps.json'

const { createContext, useContext } = React  

export class Product {
    constructor(public id: string,
                public groupName: string,
                public productName: string,
                public additionalInfo: ProductAddInfo = null,
                public availableColors: ProductColorProp[] = [],
                public availableTypes: ProductProp[] = [],
                ) {}
    getModel = (type = 'default', color = 'default'): any => {
        return require(`../assets/${this.id}/${type}-${color}.glb`)
    }

    getMagicQuickModelId = (type, color) => {
        const [category, size] = this.id.split('-')
        return '' + productProps.category[category].idKey + type + productProps.sizes[size].idKey + color
    }

    getImage = (): any => {
        return require(`../assets/${this.id}/image.png`)
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
}

const productGroups = availableProducts.products.reduce<Product[]>((acc, product) => {
    const groupId = `${product.category}-${product.size}`
    const group = acc.find(({id}) => id === groupId)
    if (group) {
        group.addColor(product.color)
        group.addType(product.type)
        return acc
    }
    const category = productProps.category[product.category]
    const size = productProps.sizes[product.size]
    const color = productProps.colors[product.color]
    const type = productProps.types[product.type]
    return [...acc, new Product(groupId, category.displayName, size.displayName, size.additionalInfo, color ? [color] : [], type ? [type] : [])]
}, [])

class ProductsService {
    
    public currentProduct = new Observable<Product | null>(null)
    public isViewboxExpanded = new Observable<boolean>(false)

    constructor(private readonly productsList: Product[]) {}

    public getProductsList = (): ProductType[] => {
        return this.productsList
    }

    public setCurrentProduct = (id: string): Product | null => {
        this.currentProduct.set(this.productsList.find(p => p.id === id) || null)
        return this.getCurrentProduct()
    }

    public getCurrentProduct = (): Product | null => {
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
