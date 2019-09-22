import React, { Component } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import {connect} from 'react-redux'
import {getBestSellerProducts, getNewProducts} from '../../../services/index'
import ProductItem from '../common/product-item';
import {Actions} from '../../../actions'
import {ActionTypes} from '../../../constants/ActionTypes'
import { toast  } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { addToCart } from '../../../actions'


class SpecialProducts extends Component {

    constructor(props) {
        super(props);

        this.state = {
           
            randomItem : [],
            endSlice: 12
        }
    }

   

    componentDidMount() {

        this.props.fetchArtwork()
        .then(response => {
            if(response.type=== ActionTypes.FETCH_ARTWORK_SUCCESS){
                const { data } = response.payload;
                

                this.setState({
                    ...this.state,
                    endSlice: this.getRandomArbitrary(12, data.length)
                })

                const randomItem = data.slice(this.state.endSlice-12, this.state.endSlice);
                
                this.setState({
                    ...this.state,
                    randomItem: randomItem
                })
            }
        });

        console.log("this.state", this.state);
    }

    // min (포함) 과 max (불포함) 사이의 난수를 반환
    getRandomArbitrary = (min, max) => {
        return Math.floor(Math.random() * (max - min) + min);
    }

    

    

    render (){

        const {symbol,addToCart, addToCompare, items} = this.props

        const addWishilist=(item)=>{
            this.props.addWishlist(item)
                .then(response=>{
                if(response.type==ActionTypes.ADD_WISHLIST_SUCCESS){
                    toast.info("작품이 찜하기에 추가되었습니다");         
                } 
            }).catch(error=>{
                console.log('error >>', error)
            })
       }                 
                                 

        const asyncAddCart=(item,qty)=>{
            this.props.addToCart(item,qty)
                .then(response=>{
                if(response.type===ActionTypes.ADD_CART_SUCCESS){
                    this.props.calcPrice();

                }
             }).catch(error=>{
                 console.log('error >>', error)
             })
        } 
        
        



      

        return (
            <div>
                <div className="title1 section-t-space">
                    <h4>exclusive products</h4>
                    <h2 className="title-inner1">special products</h2>
                </div>
                <section className="section-b-space p-t-0">
                    <div className="container">
                        <div className="theme-tab">
                            <div  className="tabs tab-title">
                                <span>NEW PRODUCTS</span>                               
                            </div>

                                <div className="no-slider row">
                                    { this.state.randomItem.slice(0, 12).map((item, index) =>
                                        <ProductItem item={item} symbol={symbol}
                                                     onAddToWishlistClicked={() => addWishilist(item)}
                                                     onAddToCartClicked={asyncAddCart} key={index} /> )
                                    }
                                </div>
                            
                        </div>
                        <ToastContainer/>
                    </div>
                </section>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => ({
    bestSeller: getBestSellerProducts(state.data.products, ownProps.type),
    newProducts: getNewProducts(state.data.products, ownProps.type),
    featuredProducts: getBestSellerProducts(state.data.products, ownProps.type).reverse(),
    symbol: state.data.symbol,
    items: state.data.items
})

const mapDispatchToProps = (dispatch) => ({

    addWishlist: (item) => dispatch(Actions.addWishlist(item)),
    fetchArtwork:() => dispatch(Actions.fetchArtwork()) ,
    addToCart:(item, qty)=>dispatch(addToCart(item, qty))
   
})

export default connect(mapStateToProps, mapDispatchToProps) (SpecialProducts);