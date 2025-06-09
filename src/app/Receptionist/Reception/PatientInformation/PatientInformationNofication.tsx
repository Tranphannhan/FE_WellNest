
'use client';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './PatientInformationNofication.css';


interface Type_Data_information {
  handleClose : ()=>void,
  handleShow: ()=>void,
  show : boolean ,
  callBack : () => void
}
 

function PatientInformationExample ({Data_information } : {Data_information : Type_Data_information} ) {
  return (
    <>
      <Modal
        show={Data_information.show}
        onHide={Data_information.handleClose}
        backdrop="static"
        keyboard={false}
        // centered
        className="receptionResultNotification-custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title className="modalReception-title">Thông Báo</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p style={{ fontSize: "16px", color: "#333", marginBottom: "0.5rem" }}>
            Bệnh nhân đã có thẻ tạm thời
          </p>
          <p style={{ fontSize: "16px", color: "#333" }}>
             Cập nhật thông tin bệnh nhân
          </p>
        </Modal.Body>


        <Modal.Footer className='receptionResultNotification-Footer'>
          <Button className='receptionResultNotification-Footer__Huy' variant="danger" onClick={Data_information.handleClose}>
            Hủy
          </Button>

          <Button  variant="primary" onClick={Data_information.callBack}>
            Tiếp tục
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default PatientInformationExample;
