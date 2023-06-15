import { 
    createAsyncThunk, 
    createSlice // главное что вам нужно
} from '@reduxjs/toolkit';

// код для заглушки сервера, нужно только для примера
const PRODUCTS = [
    { id: 1, name: "test 1", price: 100 },
    { id: 2, name: "test 2", price: 250 },
    { id: 3, name: "test 3", price: 310 },
    { id: 4, name: "test 4", price: 440 },
    { id: 5, name: "test 5", price: 520 },
    { id: 6, name: "test 6", price: 680 },
    { id: 7, name: "test 7", price: 730 }
];

function fakeFetch(response) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(response);
        }, 1000);
    });
}
// заглушка кончилась.


// имя той части глобального состояния которую мы здесь реализуем
const SLICE = 'shop';
// начальное состояние
const initialState = { 
  products: [],
  status: false,
  basket: [],
  total: 0
};

/*
асинхронные экшены (танки от middleware thunk) прописываем до слайса
чтобы ссылаться на их состояния.
они нужны для упрощенного описания типичного запроса к серверу

const getDataFromServer = (payload) => dispatch => {
    dispatch('action/loading'); // до запроса вызываем экшен с состоянием загрузки
    fetch('...') // вот это то асинхронное действие, которое реализуется в танке
        .then(result => dispatch('action/result', result)) // если все хорошо вызываем экшен с результатом
        .catch(err => dispatch('action/error', err)); // если плохо, то экшен с ошибкой
}

getDataFromServer.pending = 'getDataFromServer/pending'; // ждем
getDataFromServer.pending = 'getDataFromServer/fulfilled'; // есть результат
getDataFromServer.pending = 'getDataFromServer/rejected'; // увы, ошибка

*/
export const loadProducts = createAsyncThunk(
  'counter/fetchCount',
  async () => { // экшены будут вызваны за нас, нам нужно только реализовать само асинхронное действие
    const response = await fakeFetch(PRODUCTS);
    return response.map(item => Object.assign({}, item, {
        amount: 0
    }));
  }
);

/*
Слайс это обертка над старым способом создания отдельно экшенов и редюсеров,
здесь все происходит одновременно
*/
export const shopSlice = createSlice({
  name: SLICE, // имя поля в глобальном состояния
  initialState, // начальное состояние
  reducers: {
    /*
    в старом синтаксисе это было так
    switch (action.type) {
        case "setProduct": ... возвращаем новое состояние
        case "setBasket": ... возвращаем новое состояние
    }
    */
    setProduct: (state, action) => {
        /*
        в новом синтаксисе можно и нужно мутировать состояние
        state актуальное (предыдущее) состояние
        action объект вида { type, payload }, в payload аргументы с которыми был вызван экшен

        общее правило что в редюсерах только изменяем состояние, 
        но не держим логику его получения и избегаем сайдэффектов
        */
        state.products = state.products.map(item => {
            if (item.id === action.payload.id) {
                return action.payload;
            } else {
                return item;
            }
        });
    },
    setBasket: (state, action) => {
      state.basket = action.payload.items;
      state.total = action.payload.total;
    },
  },
  /*
  в дополнительных редюсерах можно добавить наши танки или экшены из других слайсов
  */
  extraReducers: (builder) => {
    builder
      .addCase(loadProducts.pending, (state) => { // вместо loadProducts.pending может быть экшен из другого слайса
        state.status = 'loading';
      })
      .addCase(loadProducts.fulfilled, (state, action) => { // в редюсере все так же
        state.status = 'idle';
        state.products = action.payload;
      });
  },
});

// простые экшены получаем из блока reducers
export const { setProduct, setBasket } = shopSlice.actions;

// далее определяем селекторы для получения данных из состояния в удобном для нас виде
export const selectProducts = (state) => ({
    items: state[SLICE].products,
    loading: state[SLICE].status === 'loading'
});

// мы можем передавать в селекторы аргументы таким образом
export const selectProduct = (id/* аргументы */) => (state/*обычный селектор*/) => {
    return state[SLICE].products.filter(item => item.id === id).pop();
};
export const selectBasket = (state) => ({
    items: state[SLICE].basket,
    total: state[SLICE].total
});

/*
это классическая запись танка, сначала вызываем функцию с сохранением аргументов в замыкании
из нее возвращаем обычный экшен генератор
*/
export const addToBasket = (id) => (dispatch, getState) => {
    // нам не обязательно завершать функцию в принципе
    // можем кидать отсюда столько dispatch сколько хотим

    //обратите внимание на запись для получения данных из селектора
    const product = selectProduct(id)(getState());
    if (!product) return;

    const basket = selectBasket(getState());
    dispatch(setProduct(Object.assign({}, product, {
        amount: product.amount + 1
    })));
    const items = (new Set([...basket.items, product.id]));
    dispatch(setBasket({
        items: [...items.values()],
        total: basket.total + product.price
    }))
};

export const removeFromBasket = (id) => (dispatch, getState) => {
    const product = selectProduct(id)(getState());
    if (!product) return;

    const basket = selectBasket(getState());
    if (basket.items.includes(product.id)) {
        dispatch(setProduct(Object.assign({}, product, {
            amount: product.amount - 1
        })));

        // вся логика формирования данных в экшене, 
        // а в редюсер только передаем подготовленные данные
        const items = (new Set([...basket.items]));
        if (product.amount === 1) {
            items.delete(product.id);
        }
        dispatch(setBasket({
            items: [...items.values()],
            total: basket.total - product.price
        }))
    }
};

export default shopSlice.reducer;
