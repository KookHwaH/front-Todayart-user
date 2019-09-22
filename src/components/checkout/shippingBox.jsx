import React from 'react';
import {connect} from 'react-redux';
import './shippingBox.css';
import { Actions } from '../../actions';
import Modal from 'react-responsive-modal';
import { ActionTypes } from '../../constants/ActionTypes';
import AddressAdd from './address-add'
import FormCheckText from "../pages/formCheckText";
import {Redirect, withRouter} from "react-router-dom";

class ShippingBox extends React.Component{
    constructor(props){
        super(props);
        this.state={
            member:props.member,
            addresses:props.member.memberAddresses?props.member.memberAddresses:null,
            mainAddress:props.member.memberAddresses?props.member.memberAddresses.filter(item=>item.mainAddress==='y')[0]:null,
            shippingAddress:props.member.memberAddresses?props.member.memberAddresses.filter(item=>item.mainAddress==='y')[0]:null,
            checkedAddress:props.member.memberAddresses
                                ?props.member.memberAddresses.filter(item=>item.mainAddress==='y')[0]
                                ?props.member.memberAddresses.filter(item=>item.mainAddress==='y')[0]
                                :null
                            :null,
            realName:props.member.realName?props.member.realName:null,
            phone:props.member.phone?props.member.phone:null,
            email:props.member.username?props.member.username:null,
            selectAddress:"main",
            open:false,
            fetchAddress:props.fetchShippingAddress

        }
        
        this.props.getAddress().then(response=>{
            if(response.type===ActionTypes.GET_ADDRESS_SUCCESS){
                if(Object.prototype.toString.call(this.state.shippingAddress) === '[object Array]'){
                    console.log("check1")
                    this.state.fetchAddress(this.state.shippingAddress[0])
                }        
            }
        });
    }

    static getDerivedStateFromProps(nextProps, prevState){
        console.log("check aedfkals", nextProps, prevState)
      if(nextProps.shippingAddress!==prevState.shippingAddress){
            if(nextProps.shippingAddress===undefined){
                if(prevState.shippingAddress[0]!==null){
                return {shippingAddress:{...prevState.shippingAddress[0]} }
                }
            }
            return {shippingAddress:nextProps.shippingAddress, addresses:nextProps.order.addresses, mainAddress:nextProps.order.mainAddress}
        }

        if(nextProps.addresses!==prevState.addresses){
            return {addresses:nextProps.order.addresses, mainAddress:nextProps.order.mainAddress}
        }

        return prevState
    }

    shouldComponentUpdate(nextProps, nextState){
        return true;
    }

    selectShippingAddress(){
        this.setState({selectAddress:'main'})
        if(this.state.checkedAddress!==null){
            console.log("HEKJSE", this.state.checkedAddress)
            this.state.fetchAddress({...this.state.shippingAddress, 
                address:this.state.checkedAddress.address, 
                addressDetail:this.state.checkedAddress.addressDetail,
                postalNumber:this.state.checkedAddress.postalNumber,
                addressId:this.state.checkedAddress.addressId,
                consignee:this.state.checkedAddress.consignee?this.state.checkedAddress.consignee:this.state.realName,
                consigneePhone:this.state.checkedAddress.consigneePhone?this.state.checkedAddress.consigneePhone:this.state.phone})
        }
    }

    onOpenModal = () => {
        this.setState({ open: true });
    };

    onCloseModal = () => {
        this.setState({ open: false });
    };

    render(){
        const {realName, phone, email, mainAddress} = this.state;
        return(
            <div className="col-lg-6 col-sm-12 col-xs-12">
                <div className="checkout-title">
                    <div className="shippingBox orderUser">
                        <h3>주문자 정보</h3>
                        <table>
                            <tbody>
                                <tr>
                                    <td>이름</td>
                                    <td className="secondTd">{ realName ? realName : <input type="text" id="member"/> }</td>
                                </tr>
                                <tr>
                                    <td>연락처</td>
                                    <td className="secondTd">
                                        { phone ?
                                            phone
                                            :
                                            <div className="input-group">
                                                <input type="tel" name="memberPhone" className="form-control memberPhone" />
                                            </div>
                                        }
                                    </td>
                                </tr>
                                <tr>
                                    <td>Email</td>
                                    <td className="secondTd">{email}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                    
                <div className="checkout-title">
                    <div className="shippingBox">
                        <h3>배송지 정보</h3>
                        <div className="selectAddressBox">
                            <span id="mainAddress">
                                <input type="radio"
                                       name="address"
                                       value="MainAddress"
                                       id="MainAddress"
                                       defaultChecked="true"
                                       onClick={()=>{this.selectShippingAddress()}}
                                />
                                <label htmlFor="MainAddress">기본배송지 </label>
                            </span>
                            <span>
                                <input type="radio"
                                       name="address"
                                       value="otherAddress"
                                       id="otherAddress"
                                       onClick={()=>{this.setState({...this.state, selectAddress:"new"})}}
                                />
                                <label htmlFor="otherAddress">신규배송지 </label>
                            </span>
                            <button type="button"
                                    data-toggle="modal"
                                    data-target="#exampleModalScrollable"
                                    className="btn btn-sm btn-solid ta-btn-sm"
                                    onClick={()=>this.onOpenModal}
                            >
                                배송지 목록
                            </button>
                            {/*Modal*/}
                            <div className="modal fade" id="exampleModalScrollable" tabIndex="-1" role="dialog" aria-labelledby="exampleModalScrollableTitle" aria-hidden="true">
                                <div className="modal-dialog modal-dialog-scrollable" role="document">
                                    <div className="modal-content address_list">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="exampleModalScrollableTitle">배송지 목록</h5>
                                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>
                                        <div className="modal-body">
                                            <div className="row">
                                                <div className="col-sm-12">
                                                    <div className="table-responsive">
                                                        <table className="table table-responsive-sm ta-table">
                                                            <thead>
                                                                <tr>
                                                                    <th>No</th>
                                                                    <th>주소</th>
                                                                    <th>우편번호</th>
                                                                    <th></th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                            {this.state.member.memberAddresses === null || this.state.member.memberAddresses === undefined ?
                                                                <tr>
                                                                    <td colSpan="4" className="ta-address-none">등록된 배송지가 없어요!</td>
                                                                </tr>
                                                                :
                                                                this.state.member.memberAddresses.map((memberAddress, index) => {
                                                                    return (
                                                                        <tr key={memberAddress.addressId}>
                                                                            <td>{index+1}</td>
                                                                            <td style={{'textAlign': 'left'}}>{memberAddress.address} {memberAddress.addressDetail}</td>
                                                                            <td>{memberAddress.postalNumber}</td>
                                                                            <td>
                                                                                <input type="radio"
                                                                                       name="check"
                                                                                       value={memberAddress.addressId} defaultChecked={memberAddress.mainAddress === 'y'}
                                                                                       onClick={()=>this.setState({checkedAddress:memberAddress})}/>
                                                                            </td>
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
                                        <div className="modal-footer">
                                            <button type="button"
                                                    className="btn btn-sm btn-solid ta-btn-sm"
                                                    data-dismiss="modal"
                                                    onClick={()=>this.selectShippingAddress()}
                                            >
                                                주소 선택하기
                                            </button>
                                            <button type="button"
                                                    className="btn btn-sm btn-solid ta-btn-sm cl"
                                                    data-dismiss="modal"
                                            >
                                                닫기
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {this.state.selectAddress==="main"?
                            <div className="viewAddress">
                                {this.state.mainAddress?
                                    <AsyncMainAddressBox mainAddress={this.state.mainAddress}
                                                         shippingAddress={this.state.shippingAddress}
                                                         fetchAddress={this.state.fetchAddress}
                                                         consignee={this.state.realName}
                                                         consigneePhone={this.state.phone} />
                                                         : "로딩중입니다"
                                }
                            </div>
                            :
                            <div className="viewAddress">
                                <NewAddressBox fetchAddress={this.state.fetchAddress}
                                               shippingAddress={this.state.shippingAddress}/>
                            </div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

class AsyncMainAddressBox extends React.Component{
    constructor(props){
        super(props)
        this.state={
            mainAddress : props.mainAddress,
            shippingAddress:props.shippingAddress,
            consignee:props.consignee,
            consigneePhone:props.consigneePhone,
            fetchAddress:props.fetchAddress
        }

        this.consignee=React.createRef();
        this.consigneePhone=React.createRef();
    }

    static getDerivedStateFromProps(nextProps, prevState){
        if (prevState.shippingAddress !== null && prevState.shippingAddress !== undefined
            && nextProps.shippingAddress !== null && nextProps.shippingAddress !== undefined) {
            if((prevState.shippingAddress.address !== null && prevState.shippingAddress.address !== undefined)
                && (nextProps.shippingAddress.address !== null && nextProps.shippingAddress.address !== undefined))
                {
                    if(prevState.shippingAddress!==nextProps.shippingAddress){
                        return {shippingAddress:nextProps.shippingAddress}
                }
            }
            return {shippingAddress:nextProps.shippingAddress};
        }
        return null
    }

    
    shouldComponentUpdate(nextProps, nextState){
        if(this.state.shippingAddress!==nextProps.shippingAddress){
            return true
        }else if(this.state.shippingAddress!==nextState.shippingAddress){
            return true
        }
        return false
    }
    
    componentDidUpdate(){

    }

    onChangeShippingInfo(){
        const name = this.consignee.current.value.trim();
        const phone = this.consigneePhone.current.value.trim()
        const shippingAddress = {...this.state.shippingAddress, consignee:name, consigneePhone:phone}
        this.state.fetchAddress(shippingAddress)
    }

    

    render(){
        if(this.consignee.current!==null&&this.state.shippingAddress.consingee!==null){
            this.consignee.current.value= this.state.shippingAddress.consignee
            }
        if(this.consigneePhone.current!==null&&this.state.shippingAddress.consingeePhone!==null){
            this.consigneePhone.current.value= this.state.shippingAddress.consigneePhone
            }
        return(
            <div>
                {this.state.mainAddress!==null&&this.state.mainAddress!==undefined?
                    this.state.shippingAddress!==null&&this.state.shippingAddress!==undefined&&this.state.shippingAddress.address!==undefined?
                    <table>
                        <tbody className="addressTable">
                            <tr>
                                <td>수령인</td>
                                <td className="secondTd">
                                    <input type="text" 
                                    id="consignee" 
                                    ref={this.consignee} 
                                    defaultValue={this.state.shippingAddress.consignee?this.state.shippingAddress.consignee:this.state.consignee}
                                    placeholder="수령인을 입력 해 주세요" 
                                    onChange={_=>this.onChangeShippingInfo()}/>
                                </td>
                            </tr>
                            <tr>
                                <td>연락처</td>
                                <td className="secondTd">
                                    <input type="text" 
                                    id="consigneePhone" 
                                    ref={this.consigneePhone} 
                                    defaultValue={this.state.shippingAddress.consigneePhone?this.state.shippingAddress.consigneePhone:this.state.consigneePhone}
                                    placeholder="연락처를 입력 해 주세요" 
                                    onChange={_=>this.onChangeShippingInfo()}/>
                                </td>
                            </tr>
                            <tr className="addressCell">
                                <td rowSpan="3">주소</td>
                                <td className="secondTd">{this.state.shippingAddress.postalNumber}</td>
                            </tr>
                            <tr>
                                <td className="secondTd">{this.state.shippingAddress.address?this.state.shippingAddress.address:"주소를 선택해주세요"}</td>
                                
                            </tr>
                            <tr>
                                <td className="secondTd">{this.state.shippingAddress.addressDetail}</td>
                            </tr>
                        </tbody>
                    </table>
                    :<div className="ta-address-none" style={{"marginTop":"30px","marginBottom":"10px", "textAlign":"left", "paddingLeft":"10px"}}>주소를 선택해주세요!</div>
                :<div className="ta-address-none" style={{"marginTop":"30px","marginBottom":"10px", "textAlign":"left", "paddingLeft":"10px"}}>등록된 메인 배송지가 없어요!</div>
                }
            </div>
        )
    }
}

class NewAddressBox extends React.Component{
    constructor(props){
        super(props)
        this.state={
            addAddress:false,
            fetchAddress:props.fetchAddress,
            shippingAddress:props.shippingAddress?props.shippingAddress:{consignee:'', consigneePhone:'', address:'', addressDetail:'', postalNumber:''},
            open:false
        }

        this.consignee=React.createRef()
        this.consigneePhone=React.createRef()
        this.postalNumber=React.createRef()
        this.addressDetail=React.createRef()
        this.address=React.createRef()
    }

    static getDerivedStateFromProps(nextProps, prevState){
        console.log("New Address Box :: nextProps", nextProps, "prevState", prevState);
        if(nextProps.shippingAddress !== null) {
            if(prevState.shippingAddress!==nextProps.shippingAddress){
                return{shippingAddress:{...nextProps.shippingAddress}}
            }
        }
        return prevState;
    }

    shouldComponentUpdate(nextProps, nextState){
        return true
    }

    onChangeShippingInfo(){
        const name = this.consignee.current.value.trim();
        const phone = this.consigneePhone.current.value.trim()
        const postalNumber=this.postalNumber.current.value.trim()
        const address = this.address.current.value.trim()
        const addressDetail = this.addressDetail.current.value.trim()
        const shippingAddress = {...this.state.shippingAddress, consignee:name, consigneePhone:phone, postalNumber:postalNumber, address:address, addressDetail:addressDetail}
        this.state.fetchAddress(shippingAddress)
    }
    
    onOpenModal = () => {
        this.setState({ open: true });
    };

    onCloseModal = () => {
        this.setState({ open: false });
    };

    render(){
        if(this.address.current!==null&&this.postalNumber.current!==null){
        this.address.current.value= this.state.shippingAddress.address
        this.postalNumber.current.value = this.state.shippingAddress.postalNumber
        }
        return(
            <div>
                    <table>
                        <tbody>
                        <tr>
                        <td><label htmlFor="consignee">수령인</label></td>
                        <td colSpan="3" className="secondTd">
                            <input type="text" 
                            id="consignee"  
                            ref={this.consignee} 
                            onChange={_=>this.onChangeShippingInfo()}
                            placeholder="수령인을 입력 해 주세요"/></td>
                        </tr>
                        <tr>
                            <td><label htmlFor="consigneePhone">연락처</label></td>
                            <td className="secondTd" colSpan="3">
                                <input type="tel" 
                                id="consigneePhone"  
                                ref={this.consigneePhone} 
                                onChange={_=>this.onChangeShippingInfo()}
                                placeholder="연락처를 입력 해 주세요"/>
                            </td>
                        </tr>
                        <tr className="addressCell">
                            <td rowSpan="3"><label htmlFor="address">주소</label></td>
                            <td colSpan="2" className="secondTd"><input type="number" id="postalNumber" ref={this.postalNumber} placeholder="우편번호를 선택 해 주세요" readOnly/> </td>
                            <td><button type="button" data-toggle="modal" data-target="#searchPostalNumber" className="btn btn-sm btn-solid ta-btn-sm" onClick={()=>this.onOpenModal}>우편번호검색</button></td>                            
                        </tr>

                        <tr>
                            <td colSpan="3" className="secondTd"><input type="text" id="address" ref={this.address} placeholder="배송지 주소를 선택 해 주세요" readOnly/></td>
                            
                        </tr>
                        <tr>
                            <td colSpan="3" className="secondTd"><input type="text" id="addressDetail" ref={this.addressDetail} placeholder="상세주소를 입력 해 주세요"/></td>
                        </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                            <td></td>
                            <td colSpan="3" className="secondTd"><input type="checkBox" defaultChecked={false}
                             onClick={()=>{this.state.addAddress?this.setState({addAddress:false}):this.setState({addAddress:true})}}/>내 배송지에 추가합니다</td>
                            </tr>
                        </tfoot>
                    </table>
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
                                <AddressAdd fetchAddress={this.state.fetchAddress} shippingAddress={this.state.shippingAddress}/>                  
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-sm btn-solid ta-btn-sm cl" data-dismiss="modal">닫기</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps=(state)=>({
    member:state.auth.userDetails,
    order:state.order,
    shippingAddress:state.order.shippingAddress
})

const mapDispatchToProps=(dispatch)=>({
    getAddress:()=>dispatch(Actions.getAddress()),
    fetchShippingAddress:(address)=>dispatch(Actions.fetchShippingAddress(address))
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ShippingBox));