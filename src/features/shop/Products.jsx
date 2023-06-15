import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToBasket, loadProducts, removeFromBasket, selectProducts } from './shopSlice';
import styles from './Shop.module.css';

/*
переиспользуемый компонент здесь и в корзине
*/
export function Amount({ amount, onAdd, onRemove }) {
    return <div className={styles.amount}>
        <button onClick={onRemove}>-</button>
        <span className={styles.amountValue}>{amount}</span>
        <button onClick={onAdd}>+</button>
      </div>;
}

/*
Дочерний компонент уже ничего не знает о redux, просто выводит данные и генерит события как и должен
*/
export function ProductCard({ id, name, price, ...props }) {
    return <article className={styles.item}>
      <h2>{name}</h2>
      <span className={styles.sku}>Артикул: {id}</span>
      <p>Цена: <span className={styles.price}>{price}</span></p>
      <Amount {...props} />
    </article>;
}

/*
Список товаров, подключается к redux чтобы обеспечить дочерние компоненты состоянием и экшенами
*/
export function Products() {
    const dispatch = useDispatch(); // для вызова экшенов
    const { items, loading } = useSelector(selectProducts); // получаем состояние из селектора, обратите внимание что не вызываем функцию если не передаем в нее аргументы
    
    useEffect(() => {
      dispatch(loadProducts()); // обращаемся к танку за данными
    }, []); // эффект без зависимостей исполнится один раз, удобно для загрузки данных
  
    return <section className={styles.list}>
    {loading ? <p>Товары загружаются</p> : items.map(item => <ProductCard
      {...item}
      key={item.id}
      onAdd={() => dispatch(addToBasket(item.id))} // вместо передачи dispatch передаем подготовленные действия
      onRemove={() => dispatch(removeFromBasket(item.id))}
    />)}
  </section>
}