export interface ProductType extends ProductPropsType{
    id: string;
}
export interface ProductPropsType {
    category: string;
    size: string;
    type: string;
    color: string;
}

export interface ProductProp {
    idKey: string | number
    displayName: string
}

export interface ProductColorProp extends ProductProp {
    color: string
}
export interface ProductSizeProp extends ProductProp {
    additionalInfo: ProductAddInfo
}

export interface ProductAddInfo {
    displayName: string
    value: string
}

export enum GroupParamType {
    size = 'size',
    type = 'type',
    // color = 'color',
}