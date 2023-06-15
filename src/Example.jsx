import React, { useState, createContext, useContext } from 'react';

//ПРИМЕР БАЗОВОЙ РЕАЛИЗАЦИИ REDUX

const initialState = {
    a: 1,
    b: 2
};

/**
 * 
 * @param {*} prevState предыдущее состояние
 * @param {*} action действие определяемое полем type с аргументами в payload
 * @returns новое или старое состояние
 */
function reducer(prevState, action) {
    switch (action.type) {
        case "change-a":
            // в ответ на действие возвращаем новое состояние
            return { 
                ...prevState, 
                a: action.payload
            };
        default:
            break;
    }

    // ничего не изменилось, вернем старое состояние
    return prevState;
}


const state = Object.assign({}, initialState);

// вот тут вся магия
function dispatch(type, payload) {
    // вызываем редюсер с экшеном
    const nextState = reducer(state, {
        type,
        payload
    });

    // если состояние изменилось, то ...
    if (nextState !== state) {
        state = nextState;
        // оповещаем слушателей об изменении состояния
    }
}

dispatch('change-a', 3);

