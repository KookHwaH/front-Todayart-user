import React, {Component} from 'react';
import Breadcrumb from "../common/breadcrumb";
import {Link, withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {Actions} from "../../actions";
import "./address-add.css"
import validator from "validator";
import {ActionTypes} from "../../constants/ActionTypes";
import FormCheckText from "../pages/formCheckText";

class AddressAdd extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isAddressValid: '',
            isSubmitAddressValid: false,
            addressValidMsg: '',

            addresses: [],
            totalCount: -1,

            isAddressSelected: {},
            fetchAddress:props.fetchAddress,
            shippingAddress:props.shippingAddress
        }

        // 검색
        this.addressInput = React.createRef();

        // 등록
        this.addressRegInput = React.createRef();
        this.addressDetailRegInput = React.createRef();
        this.postCodeRegInput = React.createRef();
    }

    static getDerivedStateFromProps(nextProps, prevState){
        console.log("AdressAdd :: New Address Box :: nextProps", nextProps, "prevState", prevState);
        if(nextProps.shippingAddress !== null) {
            if(prevState.shippingAddress!==nextProps.shippingAddress){
                return{shippingAddress:{...nextProps.shippingAddress}}
            }
        }
        return prevState;
    }


    render() {
        // 유효성에 관련된 메시지 CSS
        const inputClassNameHelper = boolean => {
            switch (boolean) {
                case true:
                    return 'is-valid';
                case false:
                    return 'is-invalid';
                default:
                    return '';
            }
        };


        // 주소 검색 전 예외처리
        const checkKeyword = (keyword) => {
            // 특수문자 불가
            const expText = /[%=><]/ ;
            if(expText.test(keyword)){
                return false;
            }

            // 특정문자열(sql예약어의 앞뒤공백포함) 제거
            const sqlArray = ["OR", "SELECT", "INSERT", "DELETE", "UPDATE", "CREATE", "DROP", "EXEC",
                "UNION", "FETCH", "DECLARE", "TRUNCATE"];

            let regex;
            for(let i=0; i<sqlArray.length; i++){
                regex = new RegExp( sqlArray[i] ,"gi") ;

                if (regex.test(keyword) ) {
                    return false;
                }
            }

            return true;
        };

        // 주소 유효성 검증
        const validateAddress = e => {
            if (checkKeyword(e)) {
                this.setState({
                    ...this.state,
                    isAddressValid: true,
                    isSubmitAddressValid: true,
                    addressValidMsg: '주소를 검색 해 주세요!'
                });
            } else {
                this.setState({
                    ...this.state,
                    isAddressValid: false,
                    isSubmitAddressValid: false,
                    addressValidMsg: '특수문자 또는 허용되지 않는 문자열이 존재합니다.'
                });
            }
        };

        const onSearch = (e) => {
            e.preventDefault();

            const addressText = this.addressInput.current.value;

            if (addressText.length === 0) {
                this.setState({
                    ...this.state,
                    isAddressValid: false,
                    isSubmitAddressValid: false,
                    addressValidMsg: '주소를 입력 해 주세요'
                });
            } else {
                this.props.searchAddressInApi(addressText)
                    .then(response => {
                        if(response.type === ActionTypes.SEARCH_ADDRESS_API_SUCCESS) {
                            const { errorCode, totalCount } = response.payload.data.results.common;

                            if(errorCode === "0") {
                                const { juso } = response.payload.data.results;
                                this.setState({
                                    ...this.state,
                                    addresses: juso,
                                    totalCount: totalCount,
                                    addressValidMsg: '페이지에 주소가 나오지 않는 경우 더 자세히 주소를 입력 해 주세요'
                                })
                            } else {
                                const { errorMessage } = response.payload.data.results.common;

                                this.setState({
                                    ...this.state,
                                    isAddressValid: false,
                                    isSubmitAddressValid: false,
                                    addressValidMsg: errorMessage
                                })
                            }
                        } else {
                            const { error } = response;
                            return Promise.reject(error);
                        }
                    })
                    .catch(error => {
                        this.setState({
                            ...this.state,
                            isAddressValid: false,
                            isSubmitAddressValid: false,
                            addressValidMsg: '오류가 발생했습니다. 잠시 후 다시 시도해 주세요'
                        })
                        console.log("error >> ", error)
                    })
            }
        }

        const onSelected = (e) => {
            const address = this.state.addresses[e];
            const shippingAddress = {...this.state.shippingAddress, address:address.roadAddr,postalNumber:address.zipNo}
            console.log('ONSELECTED', shippingAddress)
            this.state.fetchAddress(shippingAddress);
        }

        return (
            <div>
                {/*Dashboard section*/}
                    <div className="container">
                        <div className="dashboard">
                            <div className="box-account box-info">
                                <div className="box-head">
                                    <h2>배송지 추가</h2>
                                </div>

                                <form onSubmit={e => onSearch(e)}>
                                    <div className="row mb-3">
                                        <div className="col-sm-12">
                                            <div className="input-group form-group-control">
                                                <input type="text"
                                                        className={`${inputClassNameHelper(this.state.isAddressValid)}`}
                                                        name="address"
                                                        placeholder="배송지 주소를 입력 해 주세요"
                                                        ref={this.addressInput}
                                                        required
                                                        onChange={e => validateAddress(e.target.value)}
                                                        style={{"width":"85%"}}
                                                />
                                                <div className="input-group-append">
                                                    <button
                                                        className="btn btn-outline-secondary btn-input-group-bottom"
                                                        type="submit">검색</button>
                                                </div>
                                            </div>
                                            <FormCheckText sendMsg={this.state.addressValidMsg} isCheck={this.state.isSubmitAddressValid} />
                                        </div>
                                    </div>
                                </form>
                                <div className="ta-address-result-box">
                                    <div className="row">
                                        <div className="col-sm-12">
                                            <div className="table-responsive">
                                                <table className="table table-responsive-xs">
                                                    <thead>
                                                        <tr>
                                                            <th>No</th>
                                                            <th>주소</th>
                                                            <th>우편번호</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {this.state.totalCount <= 0 ? <tr>
                                                            <td colSpan="3" className="ta-address-none">검색결과가 존재하지 않습니다.</td>
                                                        </tr> : this.state.addresses.map((address, index) => {
                                                            return (
                                                                <tr className="ta-address-tr"
                                                                    key={index}
                                                                    onClick={() => onSelected(index)} data-dismiss="modal">
                                                                    <td>{index + 1}</td>
                                                                    <td>{address.roadAddr}<br/><small>{address.jibunAddr}</small></td>
                                                                    <td>{address.zipNo}</td>
                                                                </tr>
                                                            )
                                                        })
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

        )
    }
}

const mapStateToProps = (state) => ({
    auth: state.auth
});

const mapDispatchToProps = (dispatch) => ({
    searchAddressInApi: (keyword) => dispatch(Actions.searchAddressInApi(keyword)),
    addAddress: ({address, postalNumber, addressDetail}) => dispatch(Actions.addAddress({address, postalNumber, addressDetail})),

    getMemberMe: () => dispatch(Actions.getMemberMe())
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddressAdd))