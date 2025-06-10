
'use client';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './notification.css';
import { showToast, ToastType } from '@/app/lib/Toast';

interface Type_Data_information {
  name: string,
  roomNumber: number,
  handleClose : ()=>void,
  handleShow: ()=>void,
  show : boolean
} 

 
function Example ({Data_information } : {Data_information : Type_Data_information} ) {
  return (
    <>
      <Modal
        show={Data_information.show}
        onHide={Data_information.handleClose}
        backdrop="static"
        keyboard={false}
        // centered
        className="notificationChooseRoom-custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title className="notificationChooseRoom-modalReception-title">Thông Báo</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p className="fw-medium" style={{color : "#565656" , fontSize : "16px"}}>
              Bạn có chắc muốn chọn phòng này không?
          </p>
          <div className="d-flex justify-content-between">
              <span><strong style={{color : "#565656" , fontSize : "16px"}}>Tên phòng:</strong> {Data_information.roomNumber}</span>
              <span style={{color : "#565656" , fontSize : "16px"}}>
                  <strong>Tên bác sĩ:</strong> Dr. {Data_information.name}
              </span>
          </div>
        </Modal.Body>

        <Modal.Footer className='notificationChooseRoom-Button'>
          <Button variant="danger" onClick={Data_information.handleClose}>
            Hủy
          </Button>
          <Button variant="primary" onClick={() => showToast('Đã Xác Nhận',ToastType.success)}>
            Xác nhận
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Example;
