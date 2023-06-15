import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToBasket, removeFromBasket, selectBasket, selectProduct } from './shopSlice';
import { declOfNum } from '../../lib/utils';
import styles from './Shop.module.css';
import { Amount } from './Products';

const formatMessage = (amount, price) => {
    const goods = declOfNum(amount, ['товар', 'товара', 'товаров']);
    return `В корзине ${amount} ${goods} на сумму ${price}₽`;
}

/*
аналог карточки товара, но вместо передачи состояния и действий мы подключаемся здесь сами к редакс, так тоже можно
*/
export function BasketItem({ id }) {
    const dispatch = useDispatch();
    const { name, amount } = useSelector(selectProduct(id)); // получаем конкретный продукт

    return <div>
        <span>{name}</span>
        <Amount
            amount={amount}
            onAdd={() => dispatch(addToBasket(id))}
            onRemove={() => dispatch(removeFromBasket(id))}
        />
    </div>
}

/*
полный аналог списка товаров
*/
export function Basket() {
    //const dispatch = useDispatch(); // получаем только если нужно делать действия
    const { items, total } = useSelector(selectBasket); // но сейчас нам нужны только данные
    const [opened, setOpened] = useState(false); // а это уже локальное состояние, но часто при использовании редакс стараются вытащить все чтобы он управлял всем отображением приложения, но это бывает сложно

    return <div className={styles.basketContainer}>
        <button onClick={() => setOpened(!opened)}>
            {formatMessage(items.length, total)}
        </button>
        {opened ? <div className={styles.basketContent}>
            { items.map(id => <BasketItem key={id} id={id} />) }
        </div> : null}
    </div>
}