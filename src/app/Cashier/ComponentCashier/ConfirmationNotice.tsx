
'use client';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './ConfirmationNotice.css';
import React from 'react';


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
            <p>- Tên bệnh nhân: <span className="patient-name">{Data_information.name}</span></p>
            <p>- Tổng tiền: <span className="total-price">{Data_information.totalPrice} VNĐ</span></p>
            <p>- Phương thức thanh toán</p>
            
            <select className="form-select confirmationNotice-body__select">
              <option value={Data_information.paymentMethod}>{Data_information.paymentMethod}</option>
              <option value="Tiền mặt">Tiền mặt</option>
              <option value="Chuyển khoản">Chuyển khoản</option>
              <option value="Thẻ">Thẻ</option>
            </select>
          </div>
        </Modal.Body>


        <Modal.Footer className="confirmationNotice-confirmationNotice-footer">
          <Button variant="danger" 
              onClick={Data_information.handleClose} 
              className="btn-cancel confirmationNotice-confirmationNotice-footer__iconDelete"
              style={{
                paddingLeft : '20px',
                paddingRight : '30px'
              }}
            >
            <i className ="bi bi-x-circle-fill"></i> Hủy
          </Button>
          

          <Button  variant="primary" 
              onClick={Data_information.paymentConfirmation} 
              className="btn-confirm  confirmationNotice-confirmationNotice-footer__iconCheck"
            
            >
              
            <i className ="bi bi-check-circle-fill"></i>
             Xác nhận thanh toán
          </Button>
        </Modal.Footer>



      </Modal>
    </>
  );
}
