
import { ActionTypes } from '../constants/ActionTypes';

const initialStateArticle = {
    items: [],
    detail: null,
    boardName: [],
    comment: null,
    page: 1,
    size: 10,
    totalCount: 0,
};

const article = (state = initialStateArticle, action) => {
    const { items } = state;
    const { payload } = action;

    switch (action.type) {

        case ActionTypes.ARTICLELIST_SUCCESS:
            if (payload !== undefined && payload !== null) {
                const { data } = payload;
                console.log('data = ', data)
                if (data !== undefined && data !== null) {
                    return {
                        ...state,
                        items: data.items,
                        boardName: data.boardName,
                    };
                }
            }
            return state;

        case ActionTypes.ARTICLESEARCH_SUCCESS:
            if (payload !== undefined && payload !== null) {
                const { data } = payload;
                console.log('data = ', data)
                if (data !== undefined && data !== null) {
                    return {
                        ...state,
                        items: data.items,
                        boardName: data.boardName,
                    };
                }
            }
            return state;

        case ActionTypes.ARTICLEDETAIL_SUCCESS:
            if (payload !== undefined && payload !== null) {
                const { data } = payload;
                if (data !== undefined && data !== null) {
                    return {
                        ...state,
                        detail: data
                    };
                }
            }
            return state;

        case ActionTypes.ARTICLEDELETE_SUCCESS:
            if (payload !== null && payload !== null) {
                const { data } = payload;
                return {
                    ...state,
                    items: items.filter(detail => detail.articleId !== data.articleId)
                }
            }
            return state;

        case ActionTypes.COMMENTDELETE_SUCCESS:
            if (payload !== null && payload !== null) {
                const { data } = payload;
                return {
                    ...state,
                    items: items.filter(comment => comment.commentId !== data.commentId)
                }
            }
            return state;

        // case ActionTypes.COMMENTLIST_SUCCESS:
        //     if (payload !== undefined && payload !== null) {
        //         const { data } = payload;
        //         if (data !== undefined && data !== null) {
        //             return {
        //                 ...state,
        //                 comment: data.items
        //             };
        //         }
        //     }
        //     return state;


        case ActionTypes.LOGOUT:
            return initialStateArticle;

        default:
            return state;
    }
}

export default article;
