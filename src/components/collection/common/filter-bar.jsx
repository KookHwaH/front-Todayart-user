import React, {Component} from 'react';
import { connect } from 'react-redux'
import {filterSort} from '../../../actions'
import {getVisibleproducts} from '../../../services';
import {Actions} from '../../../actions';

class FilterBar extends Component {

    //List Layout View
    listLayout(){
        document.querySelector(".collection-grid-view").style = "opacity:0";
        document.querySelector(".product-wrapper-grid").style = "opacity:0.2";
        document.querySelector(".product-wrapper-grid").classList.add("list-view");
        var elems = document.querySelector(".infinite-scroll-component .row").childNodes;
        [].forEach.call(elems, function(el) {
            el.className = '';
            el.classList.add('col-lg-12');
        });
        setTimeout(function(){
            document.querySelector(".product-wrapper-grid").style = "opacity: 1";
        }, 500);
    }

    //Grid Layout View
    gridLayout(){
        document.querySelector(".collection-grid-view").style = "opacity:1";
        document.querySelector(".product-wrapper-grid").classList.remove("list-view");
        var elems = document.querySelector(".infinite-scroll-component .row").childNodes;
        [].forEach.call(elems, function(el) {
            el.className = '';
            el.classList.add('col-lg-3');
        });
    }

    // Layout Column View
    LayoutView = (colSize) =>{
        if(!document.querySelector(".product-wrapper-grid").classList.contains("list-view")) {
            var elems = document.querySelector(".infinite-scroll-component .row").childNodes;
            [].forEach.call(elems, function(el) {
                el.className = '';
                el.classList.add('col-lg-'+colSize);
            });
        }

        this.props.onLayoutViewClicked(colSize);
    }

    render (){
        const { id } = this.props;
        
        return (
            <div className="product-filter-content">
                <div className="search-count">
                    <h5> 총 {this.props.items.length}개의 작품이 있습니다.</h5>
                </div>
                <div className="collection-view">
                    <ul>
                        <li><i
                            className="fa fa-th grid-layout-view" onClick={this.gridLayout}></i>
                        </li>
                        <li><i
                            className="fa fa-list-ul list-layout-view" onClick={this.listLayout}></i>
                        </li>
                    </ul>
                </div>
                <div className="collection-grid-view">
                    <ul>
                        <li>
                            <img
                                src={`${process.env.PUBLIC_URL}/assets/images/icon/3.png`}
                                alt=""
                                className="product-3-layout-view" onClick={() => this.LayoutView(4)} />
                        </li>
                        <li>
                            <img
                                src={`${process.env.PUBLIC_URL}/assets/images/icon/4.png`}
                                alt=""
                                className="product-4-layout-view" onClick={() => this.LayoutView(3)} />
                        </li>
                        <li>
                            <img
                                src={`${process.env.PUBLIC_URL}/assets/images/icon/6.png`}
                                alt=""
                                className="product-6-layout-view" onClick={() => this.LayoutView(2)} />
                        </li>
                    </ul>
                </div>
                <div className="product-page-filter">
                <select onChange={(e) => {
                        if(e.target.value=="HighToLow"&&id==0){
                            this.props.fetchPriceDesc();
                        }else if(e.target.value=="LowToHigh"&&id==0){
                            this.props.fetchPriceAsc();
                        }else if(e.target.value=="HighToLow"&&id==1){
                            this.props.fetchCategoryDesc(id);
                        }else if(e.target.value=="LowToHigh"&&id==1){
                            this.props.fetchCategoryAsc(id);
                        }else if(e.target.value=="HighToLow"&&id==2){
                            this.props.fetchCategoryDesc(id);
                        }else if(e.target.value=="LowToHigh"&&id==2){
                            this.props.fetchCategoryAsc(id);
                        }else if(e.target.value=="HighToLow"&&id==3){
                            this.props.fetchCategoryDesc(id);
                        }else if(e.target.value=="LowToHigh"&&id==3){
                            this.props.fetchCategoryAsc(id);
                        }
                    }
                        }>
                        <option value="">작품정렬</option>
                        <option value="HighToLow">높은가격순</option>
                        <option value="LowToHigh">낮은가격순</option>                       
                    </select>
                </div>
            </div>
        )
    }
}




const mapStateToProps = state => ({
    products: getVisibleproducts(state.data, state.filters),
    filters: state.filters,
    items : state.data.items
})


const mapDispatchToProps = (dispatch) => ({
    fetchPriceAsc: () => dispatch(Actions.fetchPriceAsc()),
    fetchPriceDesc:() => dispatch(Actions.fetchPriceDesc()),
    fetchCategoryAsc: (id) => dispatch(Actions.fetchCategoryAsc(id)),
    fetchCategoryDesc:(id) => dispatch(Actions.fetchCategoryDesc(id)) 
   
})

export default connect(mapStateToProps, mapDispatchToProps)(FilterBar);