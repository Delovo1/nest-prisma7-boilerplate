import React, { useState, useEffect } from 'react';
import { type IProduct } from './types'; // Импортируем созданные типы

function ProductList() {
  // Указываем TS, что в стейте будет храниться массив товаров IProduct[]
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        // Замени на свой реальный URL бэкенда (например, http://localhost:3000/products)
        const response = await fetch('http://localhost:3000/product'); 
        
        if (!response.ok) {
          throw new Error('Не удалось загрузить товары');
        }

        const data: IProduct[] = await response.json();
        setProducts(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Произошла неизвестная ошибка');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (isLoading) return <div>Загрузка товаров...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return (
    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', padding: '20px' }}>
      {products.map((product) => (
        <div 
          key={product.id} 
          style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px', width: '250px' }}
        >
          {/* Изображение товара */}
          <img 
            src={product.imageSrc} 
            alt={product.name} 
            style={{ width: '100%', height: '200px', objectFit: 'contain' }} 
          />

          {/* Название и цена */}
          <h3 style={{ fontSize: '18px', margin: '10px 0' }}>{product.name}</h3>
          <p style={{ fontWeight: 'bold', color: '#2ecc71' }}>{product.price} ₽</p>
          
          {/* Описание */}
          <p style={{ fontSize: '14px', color: '#666' }}>{product.description}</p>
          
          {/* Рендерим категории */}
          <div style={{ marginTop: '10px' }}>
            {product.categories.map((item) => (
              <span 
                key={item.category.id} 
                style={{ 
                  background: '#eee', 
                  padding: '4px 8px', 
                  borderRadius: '4px', 
                  fontSize: '12px', 
                  marginRight: '5px' 
                }}
              >
                {item.category.name}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductList;
