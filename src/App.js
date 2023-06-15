import React from 'react';

//это стандартный пример redux из шаблона cra redux (npx create-react-app app --template redux)
import { Counter } from './features/counter/Counter';

import './App.css';

// компоненты магазина использующие redux для синхронизации состояния
import { Products } from './features/shop/Products';
import { Basket } from './features/shop/Basket';

function App() {
  return (
    <div className="App">
        <header>
          <Basket />
        </header>
        <main>
          <h1>Каталог товаров</h1>
          <Products />
        </main>
        {/* <Counter /> */}
    </div>
  );
}

export default App;
