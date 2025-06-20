'use client';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './Modal.css';

interface Type_Data_information {
  content: string;
  remid?: string; // remid là optional
  handleClose: () => void;
  handleShow: () => void;
  show: boolean;
  callBack: () => void;
}

export default function ModalComponent({
  Data_information: {
    content,
    remid = '',
    handleClose,
    show,
    callBack
  }
}: {
  Data_information: Type_Data_information;
}) {
  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        className="notificationChooseRoom-custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title className="notificationChooseRoom-modalReception-title">
            Thông Báo
          </Modal.Title>
        </Modal.Header>

      <Modal.Body className="text-start">
        <p className="fw-medium mb-1" style={{ color: '#565656', fontSize: '16px' }}>
          {content}
        </p>
        {remid && (
          <p className="remid-style">
            {remid}
          </p>
        )}
      </Modal.Body>


        <Modal.Footer className="notificationChooseRoom-Button">
          <Button variant="danger" onClick={handleClose}>
            Hủy
          </Button>
          <Button variant="primary" onClick={callBack}>
            Xác nhận
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
