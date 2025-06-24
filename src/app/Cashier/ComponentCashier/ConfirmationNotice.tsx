
'use client';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './ConfirmationNotice.css';
import React from 'react';

import { TbCreditCardPay } from "react-icons/tb";
import { LiaMoneyCheckAltSolid } from "react-icons/lia";  
import PaymentMethodSelector from '@/app/components/ui/Pay/Pay';


interface Type_Data_information {
  name ? : string;
  totalPrice ?  : string;
  paymentMethod: string;
  handleClose: () => void;
  handleShow: () => void;
  show: boolean;
  callBack: () => void;
  paymentConfirmation : () => void;
}

 
export default function ConfirmationNotice({ Data_information }: { Data_information: Type_Data_information }) {
  const [paymentType, setPaymentType] = React.useState('Cash');


  return (
    <>
    <Modal  
        show={Data_information.show}
        onHide={Data_information.handleClose}
        backdrop="static"
        keyboard={false}
        className="confirmationNotice-custom-modal">

        <Modal.Header closeButton>
          <Modal.Title className="confirmationNotice-title">Xác nhận thu tiền?</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="confirmationNotice-body">
            <p> Tên bệnh nhân: <span className="patient-name">{Data_information.name}</span></p> 
            <p style={{display : 'flex' , alignItems : 'center' , gap : '10px'}}>< LiaMoneyCheckAltSolid  style={{marginTop : '2px'}} /> Tổng tiền: <span className="total-price">{Data_information.totalPrice} VNĐ</span></p>
            <p style={{display : 'flex' , alignItems : 'center' , gap : '10px'}}><TbCreditCardPay  style={{marginTop : '2px'}}/> Phương thức thanh toán</p>
            
            <PaymentMethodSelector callBack ={setPaymentType}></PaymentMethodSelector>
          </div>
        </Modal.Body>
 

        <Modal.Footer className="confirmationNotice-confirmationNotice-footer">          
          <button
                  onClick={Data_information.handleClose} 
                className="bigButton--red"
            >

                <i className ="bi bi-x-circle-fill"></i> Hủy
          </button>


          {
            paymentType == 'Cash' ? (
              <Button  variant="primary" 
                  onClick={() => {Data_information.callBack()}} 
                  className="btn-confirm  confirmationNotice-confirmationNotice-footer__iconCheck"
                >
              
                <i className ="bi bi-check-circle-fill"></i>
                Xác nhận thanh toán
              </Button>

              ) : ( null)
          }



          {
            paymentType == 'transfer' ? (
             <Button  variant="primary" 
                onClick={Data_information.callBack} 
                  className="btn-confirm  confirmationNotice-confirmationNotice-footer__iconCheck"
                >
                
              <i className="bi bi-qr-code-scan"></i>
                  Thanh toán
            </Button>

              ) : ( null)
          }





        </Modal.Footer>
      </Modal>
    </>
  );
}
