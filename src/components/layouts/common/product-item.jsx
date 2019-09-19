// 메인 홈화면에 대한 부분

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import Modal from 'react-responsive-modal';
import {addToCart, Actions} from '../../../actions'
import {ActionTypes} from '../../../constants/ActionTypes'
import { toast  } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { Files } from '../../../utils';
import "./productitem.css";
import CurrencyFormat from "react-currency-format";
import {withRouter} from "react-router-dom";


class ProductItem extends Component {

    constructor(props){
        super(props)

        this.state = {
            open: false,
            stock: 'InStock',
            quantity: 1,
            image: '',
            onAddToWishlistClicked:props.onAddToCartClicked,
            
        }
    }


 

    onClickHandle(img) {
        this.setState({ image : img} );
    }
    onOpenModal = () => {
        this.setState({ open: true });
    };

    onCloseModal = () => {
        
        this.setState({ open: false });  
        
    };

    minusQty = () => {
        if(this.state.quantity > 1) {
            this.setState({stock: 'InStock'})
            this.setState({quantity: this.state.quantity - 1})
        }
    }


    plusQty = () => {
        if(this.props.product.remain > this.state.quantity) {
            this.setState({quantity: this.state.quantity+1})
        }else{
            this.setState({stock: 'Out of Stock !'})
        }
    }
    changeQty = (e) => {
        this.setState({ quantity: parseInt(e.target.value) })
    }

    render() {
        const {symbol,  onAddToWishlistClicked,  item, auth} = this.props;
        const {thumbnail} = item;

        const { fileName } = thumbnail
        const image = Files.filePath(fileName);

        const { userDetails } =auth;

        const asyncAddCart=(item,qty)=>{
            if (userDetails === null) {

                {
                    let confirm = window.confirm('로그인 이후에 이용 가능합니다\n' + '확인을 누르면 로그인 페이지로 이동합니다')
                    if (confirm === true) {
                        this.props.history.push(`/login`)
                    } else if (confirm === false) {

                    }
                }

            }else{
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
                    console.log('찜하기성공!')    
                }
            }).catch(error=>{
                console.log('error >>', error)
            })
        }
       }           
               

        return (
                <div className="product-box">
                    <div className="img-wrapper">
                        <div className="front">

                                {/* 이미지 */}
                                <Link to={{pathname :`${process.env.PUBLIC_URL}/product/${item.productId}`,
                                state :{ item:this.props.item }}}>
                                    <img src={image}className="img-fluid"
                                    alt="" /></Link>

                        </div>
                        <div className="cart-info cart-wrap">
                            
                            <a title="Add to cart" onClick={()=>asyncAddCart(item, 1)}>
                                <i className="fa fa-shopping-cart" style={{"color": "white", "cursor": "pointer"}} aria-hidden="true" />
                            </a>
                            <a title="Add to Wishlist" onClick={()=>addWishilist(item)}>
                                <i className="fa fa-heart" style={{"color": "white", "cursor": "pointer"}} aria-hidden="true" />
                            </a>
                            <a data-toggle="modal"
                               data-target="#quick-view"
                               title="Quick View"
                               onClick={this.onOpenModal}><i className="fa fa-search" style={{"color": "white", "cursor": "pointer"}} aria-hidden="true" /></a>
                           
                        </div>

                    </div>
                    <div className="product-detail">
                        <div>
                            <div className="rating">
                            <Link to={{pathname :`${process.env.PUBLIC_URL}/product/${item.productId}`,
                                state :{ item:this.props.item }}}>
                            <h4>
                                <span className="money">{item.productName}</span>
                            </h4>
                            </Link>

                            
                        </div>
                    </div>
                    <Modal open={this.state.open} onClose={this.onCloseModal} center>
                        <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                            <div className="modal-content quick-view-modal">
                                <div className="modal-body">
                                    <div className="row">
                                        <div className="col-lg-6  col-xs-12">
                                            <div className="quick-view-img">
                                                <img src={image} alt="" className="img-fluid" />
                                            </div>
                                        </div>
                                        <div className="col-lg-6 rtl-text">
                                            <div className="product-right">
                                                <h2>{item.productName} </h2>
                                                <h3><CurrencyFormat value={item.productPrice} suffix={symbol} displayType={'text'} thousandSeparator={true} /></h3>
                                                <div className="border-product">

                                                     {/* 여기는 거기야 돋보기 눌렀을 때 뜨는 창에 나오는 상품상세설명 */}
                                                     <h6 className="product-title">작가 | Artist </h6>
                                                        <li>{item.artistName} </li>
                                                    </div>
                                                <div className="product-description border-product">
                                                    
                                                <div className="size-box">
                                                            <ul>
                                                            <h6 className="product-title">상품크기 | Size</h6>
                                                               <li>{item.productSize}</li>
                                                                
                                                            </ul>
                                                        </div>
                                                        <h6 className="product-title">수량 | quantity</h6>
                                                        <div className="qty-box">
                                                            <div className="input-group">
                                                              <span className="input-group-prepend">
                                                                <button type="button" className="btn quantity-left-minus" onClick={this.minusQty} data-type="minus" data-field="">
                                                                 <i className="fa fa-angle-left"></i>
                                                                </button>
                                                              </span>
                                                                <input type="text" name="quantity" value={this.state.quantity}  onChange={this.changeQty} className="form-control input-number" />
                                                                <span className="input-group-prepend">
                                                                <button type="button" className="btn quantity-right-plus" onClick={this.plusQty} data-type="plus" data-field="">
                                                                <i className="fa fa-angle-right"></i>
                                                                </button>
                                                               </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                <div className="product-buttons">
                                                    <button  className="btn btn-solid" onClick={() => asyncAddCart(item, this.state.quantity)} > 장바구니 </button>
                                                    
                                                    <Link to={{pathname :`${process.env.PUBLIC_URL}/product/${item.productId}`,
                                                        state :{ item:this.props.item }}} className="btn btn-solid" onClick={this.onCloseModal}> 상품페이지로 이동</Link>
                                                       
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
 
    auth : state.auth
})

const mapDispatchToProps=(dispatch)=>({
 addToCart:(item, qty)=>dispatch(addToCart(item, qty)),
 calcPrice:()=>dispatch(Actions.calcCartPrice()),
 addWishlist: (item) => dispatch(Actions.addWishlist(item)),
})

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(ProductItem))