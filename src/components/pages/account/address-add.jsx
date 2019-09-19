import React, {Component} from 'react';
import Breadcrumb from "../../common/breadcrumb";
import {Link, withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {Actions} from "../../../actions";
import "./address-add.css"
import validator from "validator";
import {ActionTypes} from "../../../constants/ActionTypes";
import FormCheckText from "../formCheckText";

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

            open:false
        }

        // 검색
        this.addressInput = React.createRef();

        // 등록
        this.addressRegInput = React.createRef();
        this.addressDetailRegInput = React.createRef();
        this.postCodeRegInput = React.createRef();
    }

    onOpenModal = () => {
        this.setState({ open: true });
    };

    onCloseModal = () => {
        this.setState({ open: false });
    };

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

            this.addressRegInput.current.value = address.roadAddr;
            this.postCodeRegInput.current.value = address.zipNo;
        }

        const onSubmit = (e) => {
            e.preventDefault();

            const address = this.addressRegInput.current.value;
            const postalNumber = this.postCodeRegInput.current.value;
            const addressDetail = this.addressDetailRegInput.current.value;

            console.log("this.state.isAddressSelected", this.state.isAddressSelected);
            if(address === "" || postalNumber === "" || addressDetail === "") {
                alert("배송지를 선택 해 주세요");
                return false;
            } else {
                // 이 곳에 배송지 추가 로직 넣어야 한다.
                this.props.addAddress({address, postalNumber, addressDetail})
                    .then(response => {
                        if(response.type === ActionTypes.ADD_ADDRESS_SUCCESS) {
                            return this.props.getMemberMe()
                                .then(response => {
                                    if(response.type === ActionTypes.GET_USER_SUCCESS) {
                                        alert("배송지가 등록되었습니다.");
                                        this.props.history.push("/account/addresses");
                                    } else {
                                        const { error } = response;
                                        return Promise.reject(error);
                                    }
                                })
                                .catch(error => {
                                    console.log("error >> ", error);
                                })
                        } else {
                            const { error } = response;
                            return Promise.reject(error);
                        }
                    })
                    .catch(error => {
                        console.log("error >> ", error);
                    })
            }
        }

        return (
            <div>
                <Breadcrumb title={'마이페이지'} />

                {/*Dashboard section*/}
                <section className="section-b-space">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-3">
                                {/*<div className="account-sidebar">*/}
                                {/*    <a className="popup-btn">마이페이지</a>*/}
                                {/*</div>*/}
                                <div className="dashboard-left">
                                    <div className="collection-mobile-back">
                                    <span className="filter-back">
                                        <i className="fa fa-angle-left" aria-hidden="true" /> back
                                    </span>
                                    </div>
                                    <div className="block-content">
                                        <ul>
                                            <li><Link to="/account">계정정보 관리</Link></li>
                                            <li><Link to="/account/password">비밀번호 변경</Link></li>
                                            <li className="active"><Link to="/account/addresses">배송지 관리</Link></li>
                                            <li><Link to="/account/orders">주문 관리</Link></li>
                                           
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-9">
                                <div className="dashboard-right">
                                    <div className="dashboard">
                                        <div className="box-account box-info">
                                            <div className="box-head">
                                                <h2>배송지 추가</h2>
                                            </div>
                                            <form onSubmit={e => onSubmit(e)}>
                                                <div className="row">
                                                    <div className="col-sm-8 mb-3">
                                                        <input type="text"
                                                                className="form-control"
                                                                name="postCodeReg"
                                                                ref={this.postCodeRegInput}
                                                                placeholder="우편번호를 선택 해 주세요"
                                                                required
                                                                readOnly
                                                        />
                                                    </div>
                                                    <div className="col-sm-4">
                                                        <button type="button" data-toggle="modal" data-target="#searchPostalNumber" 
                                                        className="btn btn-solid ta-btn-md postalBox" onClick={()=>this.onOpenModal}>우편번호검색</button>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-sm-12 mb-3">
                                                        <input type="text"
                                                               className="form-control"
                                                               name="addressReg"
                                                               placeholder="배송지 주소를 선택 해 주세요"
                                                               ref={this.addressRegInput}
                                                               required
                                                               readOnly
                                                        />
                                                    </div>
                                                    
                                                </div>
                                                <div className="row mb-3">
                                                    <div className="col-sm-12">
                                                        <input type="text"
                                                               className="form-control"
                                                               name="addressDetailReg"
                                                               ref={this.addressDetailRegInput}
                                                               placeholder="상세 주소를 입력 해 주세요"
                                                               required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="row mb-3 ta-btn-row">
                                                    <div className="col-sm-12">
                                                        <button className="btn btn-solid ta-btn-md">등록</button>
                                                    </div>
                                                </div>
                                            </form>
                                            
                                            <div className="modal fade" id="searchPostalNumber" tabIndex="-1" role="dialog" aria-labelledby="searchPostalNumberTitle" aria-hidden="true">
                                                <div className="modal-dialog modal-dialog-scrollable" role="document">
                                                    <div className="modal-content address_list">
                                                    <div className="modal-header">
                                                        <h5 className="modal-title" id="searchPostalNumberTitle">주소검색</h5>
                                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                        <span aria-hidden="true">&times;</span>
                                                        </button>
                                                    </div>
                                                    <div className="modal-body">
                                                        <form onSubmit={e => onSearch(e)}>
                                                            <div className="row mb-3">
                                                                <div className="col-sm-12">
                                                                    <div className="input-group form-group-control">
                                                                        <input type="text"
                                                                            className={`form-control ${inputClassNameHelper(this.state.isAddressValid)}`}
                                                                            name="address"
                                                                            placeholder="배송지 주소를 입력 해 주세요"
                                                                            ref={this.addressInput}
                                                                            required
                                                                            onChange={e => validateAddress(e.target.value)}
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
                                                                                            onClick={() => onSelected(index)}
                                                                                            data-dismiss="modal">
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
                                                    <div className="modal-footer">
                                                        <button type="button" className="btn btn-sm btn-solid ta-btn-sm cl" data-dismiss="modal">닫기</button>
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