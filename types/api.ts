/*
/ api/v2/admin/taxons
*/
export interface ITaxonTranslation {
    id?: number;
    name: string;
    slug: string;
    description: string;
}

export interface ITaxonImage {
    id: number;
    type: string;
    path: string;
}

export interface ICreateTaxonRequest {
    code: string;
    parent: string | null;
    translations: {
        [locale: string]: Omit<ITaxonTranslation, 'id'>;
    };
    enabled: boolean;
}

export interface ITaxonResponse extends ICreateTaxonRequest {
    images: ITaxonImage[];
    id: number;
    position: number;
    children: string[];
    translations: {
        [locale: string]: Required<ITaxonTranslation>;
    };
}

export interface ITaxonViolation {
    propertyPath: string,
    message: string,
    code: string,
    hint: string,
    payload: string[]

}

export interface ICreateTaxonUnsuccessfullResponse extends ITaxonViolation {
    title: string,
    detail: string,
    status: number,
    instance: string,
    type: string,
    violations: ITaxonViolation[]
}

export interface IUnauthorizedResponse {
    code: number,
    message: string
}