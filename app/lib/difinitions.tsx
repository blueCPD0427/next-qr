export interface OwnerData {
    id: string
    name: string
    email: string
    postCode: number
    address: string
}

export interface OwnerAccountCreateForm {
    name: string
    email: string
    password: string
    confirmPassword: string
    postCode: string
    address: string
}

export interface CustomerAccountCreateForm {
    lastName: string
    firstName: string
    sex?: string
    email: string
    password: string
    confirmPassword: string
    postCode: string
    address: string
    birthdayY: string
    birthdayM: string
    birthdayD: string
}

export interface CustomerConnectForm {
    addressDisp: string
    birthdayDisp: string
    ownerId: string
}