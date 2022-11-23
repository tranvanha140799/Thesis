/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Table, Space, Input, InputNumber, Button, Modal } from 'antd';
import Column from 'antd/lib/table/Column';
import { EditOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import './index.css';

import AddBtn from '../Common/AddBtn';
import EditBtn from '../Common/EditBtn';
import DeleteBtn from '../Common/DeleteBtn';
import { numberToVnd, showNotification } from '../Common/utilities';
import ConfirmDeleteModal from '../Common/ConfirmDeleteModal';
import AddSalaryFactor from './addSalaryFactor';
import { salaryFactorActions } from '../../redux/salaryFactorSlice';

const {
  getSalaryFactors,
  createSalaryFactor,
  updateSalaryFactor,
  deleteSalaryFactor,
} = salaryFactorActions;

const SalaryFactorPage = () => {
  const dispatch = useDispatch();

  const salaryFactors = useSelector(
    (state) => state.salaryFactorReducer.salaryFactors
  );

  const [isEditing, setIsEditing] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [editingId, setEditingId] = useState('');
  const [editingName, setEditingName] = useState('');
  const [editingFactor, setEditingFactor] = useState(0);
  const [editingAllowance, setEditingAllowance] = useState(0);
  const [newId, setNewId] = useState('');
  const [newName, setNewName] = useState('');
  const [newFactor, setNewFactor] = useState(0);
  const [newAllowance, setNewAllowance] = useState(0);
  const [editingRecordId, setEditingRecordId] = useState('');
  const [openConfirmDeleteModal, setOpenConfirmDeleteModal] = useState(false);

  useEffect(() => dispatch(getSalaryFactors()), []);

  const startEditing = (record) => {
    setIsEditing(true);
    setEditingRecordId(record._id);
    setEditingId(record.salaryFactorId);
    setEditingName(record.name);
    setEditingFactor(record.factor);
    setEditingAllowance(record.allowance);
  };

  const stopEditing = () => {
    setIsEditing(false);
    setEditingRecordId('');
    setEditingId('');
    setEditingName('');
    setEditingFactor(0);
    setEditingAllowance(0);
  };

  // Create new salaryFactor
  const onOk = async () => {
    const salaryFactor = {
      salaryFactorId: newId,
      name: newName,
      factor: newFactor,
      allowance: newAllowance,
    };

    await dispatch(
      createSalaryFactor(salaryFactor, {
        onSuccess: () => showNotification('success', 'Thêm hệ số lương thành công.'),

        onError: () => showNotification('error', 'Thêm hệ số lương thất bại!'),
      })
    );

    setOpenModal(false);
  };

  // Edit a salaryFactor
  const onEditSalaryFactor = (id) => {
    const salaryFactor = {
      salaryFactorId: editingId,
      name: editingName,
      factor: editingFactor,
      allowance: editingAllowance,
    };

    dispatch(
      updateSalaryFactor(id, salaryFactor, {
        onSuccess: () => showNotification('success', 'Sửa thông tin thành công.'),

        onError: () => showNotification('error', 'Sửa thông tin thất bại!'),
      })
    );
    stopEditing();
  };

  // Delete a salaryFactor
  const onDeleteSalaryFactor = () => {
    dispatch(
      deleteSalaryFactor(editingRecordId, {
        onSuccess: () => showNotification('success', 'Xoá hệ số lương thành công.'),
        onError: () => showNotification('error', 'Xoá hệ số lương thất bại!'),
      })
    );

    setEditingRecordId('');
    setOpenConfirmDeleteModal(false);
  };

  return (
    <>
      <AddBtn add={() => setOpenModal(true)} />
      <Table dataSource={salaryFactors} rowKey="_id">
        <Column
          title="Mã Hệ Số Lương"
          dataIndex="salaryFactorId"
          key="key"
          render={(text, record) =>
            isEditing && editingRecordId === record._id ? (
              <Input
                placeholder="Nhập mã hệ số lương"
                defaultValue={text}
                onChange={(e) => setEditingId(e.target.value)}
              />
            ) : (
              text
            )
          }
        />
        <Column
          title="Tên Hệ Số Lương"
          dataIndex="name"
          key="key"
          render={(text, record) =>
            isEditing && editingRecordId === record._id ? (
              <Input
                placeholder="Nhập tên hệ số lương"
                defaultValue={text}
                onChange={(e) => setEditingName(e.target.value)}
              />
            ) : (
              text
            )
          }
        />
        <Column
          title="Hệ Số Lương (%)"
          dataIndex="factor"
          key="key"
          render={(text, record) =>
            isEditing && editingRecordId === record._id ? (
              <>
                <InputNumber
                  min={0}
                  max={100}
                  step={0.01}
                  style={{ width: '200px' }}
                  defaultValue={Number(text)}
                  onChange={(e) => setEditingFactor(e)}
                />{' '}
                %
              </>
            ) : (
              text
            )
          }
        />
        <Column
          title="Trợ Cấp (VND)"
          dataIndex="allowance"
          key="key"
          render={(text, record) =>
            isEditing && editingRecordId === record._id ? (
              <>
                <InputNumber
                  min={0}
                  step={1000}
                  style={{ width: '200px' }}
                  defaultValue={Number(text)}
                  onChange={(e) => setEditingAllowance(e)}
                />{' '}
                VND
              </>
            ) : (
              numberToVnd(text)
            )
          }
        />
        <Column
          title="Actions"
          key="actions"
          render={(text, record) =>
            isEditing && editingRecordId === record._id ? (
              <Button
                type="primary"
                shape="round"
                onClick={() => onEditSalaryFactor(record._id)}
                icon={<EditOutlined />}
              >
                Ok
              </Button>
            ) : (
              <Space size="middle">
                <EditBtn onEdit={() => startEditing(record)} />
                <DeleteBtn
                  onDelete={() => {
                    setOpenConfirmDeleteModal(true);
                    setEditingRecordId(record._id);
                  }}
                />
              </Space>
            )
          }
        />
      </Table>

      <Modal
        destroyOnClose
        open={openModal}
        title="Thêm hệ số lương"
        cancelText="Huỷ"
        onOk={onOk}
        onCancel={() => setOpenModal(false)}
      >
        <AddSalaryFactor
          id={newId}
          name={newName}
          factor={newFactor}
          allowance={newAllowance}
          onChangeId={setNewId}
          onChangeName={setNewName}
          onChangeFactor={setNewFactor}
          onChangeAllowance={setNewAllowance}
        />
      </Modal>

      <ConfirmDeleteModal
        open={openConfirmDeleteModal}
        onOk={onDeleteSalaryFactor}
        onCancel={() => setOpenConfirmDeleteModal(false)}
      />
    </>
  );
};

export default SalaryFactorPage;
