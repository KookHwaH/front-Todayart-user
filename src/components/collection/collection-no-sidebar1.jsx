import React, { Component } from 'react';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom';
import Slider from 'react-slick';
import '../common/index.scss';
import {Actions} from '../../actions'

// import custom Components
import ProductListing1 from './common/product-listing1'
import Breadcrumb from "../common/breadcrumb";
import FilterBar from "./common/filter-bar";
import { ToastContainer } from 'react-toastify';


class CollectionCategory extends Component {
    constructor(props){
        super(props);
        this.state={
            id:this.props.match.params,
            layoutColumns:3
        }

    }

    static getDerivedStateFromProps(nextProps, prevState){
        if(prevState.id!==nextProps.match.params){
            return {id:nextProps.match.params}}
        return prevState
    }
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if(this.props.match.params.id!==nextProps.match.params.id){
            return true
        }
        return false
    }

    getSnapshotBeforeUpdate(prevProps, prevState) {
        if (this.props.match.params.id == 0){
            this.props.fetchArtwork();
        }else {
            this.props.fetchCategory(this.props.match.params.id);
        }

        return null
    }

    componentDidUpdate(){}

    LayoutViewClicked(colums) {
        this.setState({
            layoutColumns:colums
        })
    }

    componentDidMount() {
        const { id } = this.props.match.params;
        if ( id == 0){
            this.props.fetchArtwork();
        }else {
            this.props.fetchCategory(id);
        }
    }

    render(){
        const { id } = this.props.match.params;
        const { items } = this.props;
        return (
            <div>
                <Breadcrumb title={'Collection'} />

                {/*Section Start*/}
                <section className="section-b-space">
                    <div className="collection-wrapper">
                        <div className="container">
                            <div className="row">
                                <div className="collection-content col">
                                    <div className="page-main-content">
                                        <div className="container-fluid">
                                            <div className="row">
                                                <div className="col-sm-12">
                                                    <div className="top-banner-wrapper">
                                                        <a ><img src={`${process.env.PUBLIC_URL}/assets/images/mega-menu/2.jpg`}
                                                                         className="img-fluid" alt=""/></a>
                                                        <div className="top-banner-content small-section">
                                                          
                                                            <p>"언젠가는 내 그림이 내 생활비와 물감 값보다 더 가치가 있다는 것을 알아줄 때가 올 것이다.</p>
                                                                <p> 진정한 화가는 캔버스를 두려워하지 않는다. 오히려 캔버스가 화가를 두려워 한다" </p>
                                                                    <p> _빈센트 반 고흐 Vincent Van Gogh</p>    
                                                           
                                                        </div>
                                                    </div>
                                                    <div className="collection-product-wrapper">
                                                        <div className="product-top-filter">
                                                            <div className="container-fluid p-0">
                                                                <div className="row">
                                                                    <div className="col-12">
                                                                        <FilterBar id={id} onLayoutViewClicked={(colmuns) => this.LayoutViewClicked(colmuns)}/>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="product-wrapper-grid">
                                                            <div className="container-fluid">
                                                                <div className="row">
                                                                    <ProductListing1 colSize={this.state.layoutColumns} id={id}/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <ToastContainer/>
                {/*Section End*/}

            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    wishlist: state.wishlist.items,
    symbol: "원"
})

const mapDispatchToProps = (dispatch) => ({
    fetchCategory: (id) => dispatch(Actions.fetchCategory(id)),
    fetchArtwork:() => dispatch(Actions.fetchArtwork())

})

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(CollectionCategory));