export interface MasterData {
    id: string;
    name: string;
    email: string;
    postCode: string | number;
    address: string;
}

export interface MasterAccountForm {
    id?: string;
    name: string;
    email: string;
    postCode: string | number;
    address: string;
    password?: string;
    confirmPassword?: string;
}

export interface MasterAccountFormEdit {
    id: string;
    name: string;
    email: string;
    postCode: string | number;
    address: string;
}

export interface MemberAccountForm {
    id?: string;
    lastName: string;
    firstName: string;
    sex?: 'male' | 'female' | '';
    email: string;
    password: string;
    confirmPassword: string;
    postCode: string | number;
    address: string;
    birthdayY: string;
    birthdayM: string;
    birthdayD: string;
}

export interface MemberAccountFormEdit {
    id?: string;
    lastName: string;
    firstName: string;
    sex?: 'male' | 'female' | '' | string | null;
    email: string;
    postCode: string | number;
    address: string;
    birthdayY: string | number;
    birthdayM: string | number;
    birthdayD: string | number;
}

export interface MemberConnectForm {
    addressDisp: string;
    birthdayDisp: string;
    masterId: string;
}

export interface OCCListInside {
    id: string;
    masterId: string;
    configurationTitle: string;
    configurationConstraint: 'text' | 'int' | 'boolean';
    confMemberData?: {
        memberId: string;
        configurationData?: string;
    }[];
}

export interface MasterCustomForm {
    masterId: string;
    configurationTitle: string;
    configurationConstraint: string;
}

export interface DeleteMasterCustomForm {
    formId: string;
    masterId: string;
}

export interface ToggleDispData {
    masterId: string;
    memberId: string;
    target: string;
}
