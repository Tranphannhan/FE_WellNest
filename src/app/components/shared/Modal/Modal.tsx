
'use client';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './Modal.css'

interface Type_Data_information {
  content:string
  handleClose : ()=>void,
  handleShow: ()=>void,
  show : boolean,
  callBack:()=>void
} 

 
export default function ModalComponent ({Data_information } : {Data_information : Type_Data_information} ) {
  return (
    <>
      <Modal
        show={Data_information.show}
        onHide={Data_information.handleClose}
        backdrop="static"
        keyboard={false}
        className="notificationChooseRoom-custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title className="notificationChooseRoom-modalReception-title">Thông Báo</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p className="fw-medium" style={{color : "#565656" , fontSize : "16px"}}>
              {Data_information.content}
          </p>
        </Modal.Body>

        <Modal.Footer className='notificationChooseRoom-Button'>
          <Button variant="danger" onClick={Data_information.handleClose}>
            Hủy
          </Button>
          <Button variant="primary" onClick={Data_information.callBack}>
            Xác nhận
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

