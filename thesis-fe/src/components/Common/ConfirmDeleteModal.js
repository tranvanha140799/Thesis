import React from 'react';
import { Modal } from 'antd';

const ConfirmDeleteModal = (props) => {
  return (
    <Modal
      title="Xoá bản ghi"
      cancelText="Huỷ"
      open={props.open}
      onOk={props.onOk}
      onCancel={props.onCancel}
    >
      Bạn chắc chắn muốn xoá bản ghi?
    </Modal>
  );
};

export default ConfirmDeleteModal;
