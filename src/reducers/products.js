import {
    FETCH_SINGLE_PRODUCT,
    CHANGE_CURRENCY,
    RECEIVE_PRODUCTS,
    FETCH_ARTWORK_SUCCESS
} from "../constants/ActionTypes";

import { ActionTypes } from "../constants/ActionTypes";


const initialState = {
    products: [],
    symbol: '원',
    product_details: [],
    items: [],
    item: {}

};

const productReducer = (state = initialState, action) => {
    const { items } = state;
    const { payload } = action;
    switch (action.type) {
        case ActionTypes.FETCH_ARTWORK_SUCCESS:
            if (payload !== null && payload !== undefined) {
                const { data } = payload;
                if (data !== null && data !== undefined) {
                    return {
                        ...state,
                        items: (data === undefined ? [] : data)
                    };
                }
            }
            return state;


        case ActionTypes.FETCH_SINGLEPRODUCT_SUCCESS:
            if (payload !== null && payload !== undefined) {
                const { data } = payload;
                console.log("fetchsingleproduct :", data);
                return {
                    ...state,
                    item: data
                };
            }
            return state;

        case ActionTypes.FETCH_CATEGORY_SUCCESS:
            if (payload !== null && payload !== undefined) {
                const { data } = payload;
                console.log("fetchcategory :", data);
                return {
                    ...state,
                    items: (data === undefined ? [] : data)
                };
            }
            return state;


        case ActionTypes.FETCH_PRICEASC_SUCCESS:
            if (payload !== null && payload !== undefined) {
                const { data } = payload;
                console.log("fetchpriceasc :", data);
                return {
                    ...state,
                    items: (data === undefined ? [] : data)
                };
            }
            return state;

        case ActionTypes.FETCH_PRICEDESC_SUCCESS:
            if (payload !== null && payload !== undefined) {
                const { data } = payload;
                console.log("fetchpricedesc :", data);
                return {
                    ...state,
                    items: (data === undefined ? [] : data)
                };
            }
            return state;


        case ActionTypes.FETCH_CATEGORY_SUCCESS:
            if (payload !== null && payload !== undefined) {
                const { data } = payload;
                console.log("fetchcategory :", data);
                return {
                    ...state,
                    items: (data === undefined ? [] : data)
                };
            }
            return state;

        case ActionTypes.FETCH_CATEGORYASC_SUCCESS:
            if (payload !== null && payload !== undefined) {
                const { data } = payload;
                console.log("fetchcategoryasc :", data);
                return {
                    ...state,
                    items: (data === undefined ? [] : data)
                };
            }
            return state;


        case ActionTypes.FETCH_CATEGORYDESC_SUCCESS:
            if (payload !== null && payload !== undefined) {
                const { data } = payload;
                console.log("fetchcategorydesc :", data);
                return {
                    ...state,
                    items: (data === undefined ? [] : data)
                };
            }
            return state;


            case ActionTypes.FETCH_BYSEARCH_SUCCESS:
                if (payload !== null && payload !== undefined) {
                    const { data } = payload;
                    console.log("fetchbtproductname :", data);
                    return {
                        ...state,
                        items: (data === undefined ? [] : data)
                    };
                }
                return state;

        case ActionTypes.LOGOUT:
            return initialState;




        case CHANGE_CURRENCY:
            return {
                ...state,
                symbol: action.symbol
            };
        default:
            return state;
    }
};
export default productReducer;