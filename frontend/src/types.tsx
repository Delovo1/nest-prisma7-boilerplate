export interface ICategory {
  id: number;
  name: string;
}

// Описываем структуру вложенности, которую присылает бэкенд
export interface IProductCategoryWrapper {
  category: ICategory;
}

export interface IProduct {
  id: number;
  name: string;
  price: number;
  description: string;
  imageSrc: string;
  categories: IProductCategoryWrapper[]; // Массив обёрнутых категорий
}
