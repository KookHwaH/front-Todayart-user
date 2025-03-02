import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import Modal from 'react-responsive-modal';
import CurrencyFormat from "react-currency-format";


class ProductStyleSeven extends Component {

    render() {
        const {product, symbol, onAddToCartClicked, onAddToWishlistClicked, onAddToCompareClicked} = this.props;

        let RatingStars = []
        for(var i = 0; i < product.rating; i++) {
            RatingStars.push(<i className="fa fa-star" key={i}></i>)
        }

        return (

            <div className="product-box">
                <div className="img-wrapper">
                    <div className="lable-block">
                        {(product.new == true)? <span className="lable3">new</span> : ''}
                        {(product.sale == true)? <span className="lable4">on sale</span> : ''}
                    </div>
                    <div className="front">
                        <Link to={`${process.env.PUBLIC_URL}/left-sidebar/product/${product.id}`} ><img
                            src={product.variants?
                                product.variants[0].images
                                :product.pictures[0]}
                            className="img-fluid"
                            alt="" /></Link>
                    </div>
                    <div className="cart-info cart-wrap">
                        <a href="javascript:void(0)" title="Add to Wishlist" onClick={onAddToWishlistClicked} >
                            <i className="fa fa-heart" aria-hidden="true"></i>
                        </a>
                        <a href="javascript:void(0)" data-toggle="modal"
                               data-target="#quick-view"
                               title="Quick View">
                            <i className="fa fa-search" aria-hidden="true"></i>
                        </a>
                        <Link to={`${process.env.PUBLIC_URL}/compare`} title="Compare" onClick={onAddToCompareClicked}>
                            <i className="fa fa-refresh" aria-hidden="true"></i></Link>
                    </div>
                    <div className="add-button" title="Add to cart" onClick={() => onAddToCartClicked(product, 1)}>
                        Add To Cart
                    </div>
                </div>
                <div className="product-detail  text-center">
                    <div>
                        <div className="rating">
                            {RatingStars}
                        </div>
                        <Link to={`${process.env.PUBLIC_URL}/left-sidebar/product/${product.id}`}>
                            <h6>{product.name}</h6>
                        </Link>
                        <h4><CurrencyFormat value={product.price-(product.price*product.discount/100)} suffix={symbol} displayType={'text'} thousandSeparator={true} /></h4>
                    </div>
                </div>
            </div>
        )
    }
}

export default ProductStyleSeven;