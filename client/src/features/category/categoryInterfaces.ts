export interface ICategory {
    _id: string;
    name: string;
}

export interface CategoryState {
    categories: ICategory[];
    loadingCategory: boolean;
    loadingCategoryCategories: boolean;
    successCategory: boolean;
    errorCategory: boolean;
    messageCategory: string;
}