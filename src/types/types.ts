export interface ProductType {
    id: string
    groupName: string
    productName: string
    availableColors: ProductProp[]
    availableTypes: ProductProp[]
    additionalInfo: ProductAddInfo
}

export interface ProductProp {
    idKey: string | number
    displayName: string
}

export interface ProductColorProp extends ProductProp {
    color: string
}

export interface ProductAddInfo {
    displayName: string
    value: string
}