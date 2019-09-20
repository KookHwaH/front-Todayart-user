import { ActionTypes } from '../constants/ActionTypes';

const initialStateOrder={
    ordered:null,
    nextUrl:null,
    tid:null,
    addresses:null,
    shippingAddress:null,
    orderList:null,
    refresh:false
}
// window.open(next_redirect_pc_url, "카카오 결제", "width=550, height=650");      

const order = (state=initialStateOrder, action) =>{
    const { payload } = action;
    const { next_redirect_pc_url, tid, ordered, address } = state;

    switch(action.type){
        case ActionTypes.MAKE_ORDER_SUCCESS:
            if(payload!==undefined&&payload!==null){
                const {data} = payload;
                if(data!==undefined&&data!==null){
                    return {...state, ordered:data};
                }
            }
            return state;

        case ActionTypes.MAKE_ORDER_FAIL:
            console.log("주문 실패");
            return state;

        case ActionTypes.EXCUTE_KAKAO_PAY_SUCCESS:
                if(payload!==undefined&&payload!==null){
                    const {data}=payload;
                    if(data!==null&&data!==undefined){
                        const {next_redirect_pc_url, tid} = data
                        return{
                            ...state,
                            nextUrl:next_redirect_pc_url,
                            tid:tid
                        }
                    }
                }
            return state;

        case ActionTypes.GET_ADDRESS_SUCCESS:
            if(payload!==undefined&&payload!==null){
                const {data}=payload;
                if(data!==null&&data!==undefined){
                    return{
                        ...state,
                        addresses:data,
                        mainAddress:data.filter((item)=>item.mainAddress==='y'),
                        shippingAddress:data.filter((item)=>item.mainAddress==='y')
                    }
                }
            }

        
        case ActionTypes.CHANGE_STATUS_SUCCESS:
            return {...state, refresh:true};

        case ActionTypes.FETCH_SHIPPING_ADDRESS:
            const address = action.address;
            console.log("REDUCER", address)
            return {...state, shippingAddress:address}

        case ActionTypes.LOGOUT:
                return initialStateOrder;

        case ActionTypes.EXCUTE_KAKAOPAY_FAIL:
        case ActionTypes.APPROVE_KAKAO_PAY_SUCCESS:
        case ActionTypes.APPROVE_KAKAO_PAY_FAIL:
        case ActionTypes.GET_ADDRESS_FAIL:
        default:
            return state;
    }
}



export default order;