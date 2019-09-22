import React, {Component} from 'react';
import { connect } from 'react-redux'
import {Link} from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Actions } from '../../../actions'
import {ActionTypes} from '../../../constants/ActionTypes'
import {withRouter} from "react-router-dom";

import { toast  } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import { addToCart } from '../../../actions'
import {getVisibleproducts} from '../../../services';
import ProductListItem from "./product-list-item";

class ProductListing1 extends Component {

    constructor (props) {
        super (props);
        this.state = {
            limit: 0,
            hasMoreItems: true,
            id:this.props.id

        };
    }
    shouldComponentUpdate(nextProps){
        if (this.props.wishlist !== nextProps.wishlist){
            return false
        }
        return true
    }

    componentWillReceiveProps(nextProps){
        if (this.state.limit < this.props.items.length) {
            this.setState({
                ...this.state,
                limit: this.state.limit + 4,
                hasMoreItems: true

            })
        }else if(this.state.limit >= this.props.items.length){
            this.setState({
                ...this.state,
                limit: 0,
                hasMoreItems: true
            })
        }else if(this.props.wishlist !== nextProps.wishlist){
        }
    }

    fetchMoreItems = () => {
        if (this.state.limit >= this.props.items.length) {
            this.setState({
                ...this.state,
                hasMoreItems: false });
        }else{
            setTimeout(() => {
                this.setState({
                    ...this.state,
                    limit: this.state.limit + 4,
                    hasMoreItems: true
                });
            }, 1000);
        }
    }

    render (){
        const {products, items, addToCart, symbol, auth} = this.props;
        const { userDetails } = auth;

        const addWishilist=(item)=>{
            if (userDetails === null) {

                {
                    let confirm = window.confirm('로그인 이후에 이용 가능합니다\n' + '확인을 누르면 로그인 페이지로 이동합니다')
                    if (confirm === true) {
                        this.props.history.push(`/login`)
                    } else if (confirm === false) {

                    }
                }

            }else{
            this.props.addWishlist(item)
                .then(response=>{
                if(response.type==ActionTypes.ADD_WISHLIST_SUCCESS){
                    toast.info("작품이 찜하기에 추가되었습니다");       
                }
            }).catch(error=>{
                console.log('error >>', error)
            })
        }
       }             

        const asyncAddCart=(item,qty)=>{
            if (userDetails === null) {

                {
                    let confirm = window.confirm('로그인 이후에 이용 가능합니다\n' + '확인을 누르면 로그인 페이지로 이동합니다')
                    if (confirm === true) {
                        this.props.history.push(`/login`)
                    } else if (confirm === false) {

                    }
                }

            }else {
            this.props.addToCart(item,qty)
                .then(response=>{
                if(response.type===ActionTypes.ADD_CART_SUCCESS){
                    this.props.calcPrice();

                }
             }).catch(error=>{
                 console.log('error >>', error)
             })
            }
        }

        return (
            <div>
                <div className="product-wrapper-grid">
                    <div className="container-fluid">
                        {items.length > 0 ?
                            <InfiniteScroll
                                dataLength={this.state.limit} //This is important field to render the next data
                                next={this.fetchMoreItems}
                                hasMore={this.state.hasMoreItems}
                                loader={<div className="loading-cls"></div>}
                                endMessage={
                                    <p className="seen-cls seen-it-cls">
                                        <b>Yay! You have seen it all</b>
                                    </p>
                                }
                            >
                                <div className="row">
                                    { items.slice(0, this.state.limit).map((item, index) =>
                                        <div className={`${this.props.colSize===3?'col-xl-3 col-md-6 col-grid-box':'col-lg-'+this.props.colSize}`} key={index}>
                                        <ProductListItem item={item} symbol={symbol}
                                                         onAddToWishlistClicked={() => addWishilist(item)}
                                                         onAddToCartClicked={asyncAddCart} key={index}/>
                                        </div>)
                                    }
                                </div>
                            </InfiniteScroll>
                            :
                            <div className="row">
                                <div className="col-sm-12 text-center section-b-space mt-5 no-found" >
                                    <img src={`${process.env.PUBLIC_URL}/assets/images/empty-search.jpg`} className="img-fluid mb-4" />
                                    <h3>죄송합니다! 찾고 있는 작품을 찾을 수 없습니다.</h3>
                                    <p>입력하신 내용이 잘못되었는지 확인하거나 다른 단어로 검색해주십시오.</p>
                                    <Link to={`${process.env.PUBLIC_URL}/`} className="btn btn-solid"> 계속 둘러보기 </Link>
                                </div>
                            </div>
                        }
                    </div>
                   
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    products: getVisibleproducts(state.data, state.filters),
    symbol: state.data.symbol,
    items : state.data.items,
    wishlist : state.wishlist.items,
    auth : state.auth
})

const mapDispatchToProps = (dispatch) => ({
    fetchCategory: (id) => dispatch(Actions.fetchCategory(id)),
    fetchArtwork:() => dispatch(Actions.fetchArtwork()),
    addWishlist: (item) => dispatch(Actions.addWishlist(item)), 
    addToCart: (item, qty) => dispatch(addToCart(item, qty))
   


})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProductListing1))