/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

import { Table, Space, Button, Select, TimePicker, Modal, Input } from 'antd';
import Column from 'antd/lib/table/Column';
import { EditOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';

import AddBtn from '../Common/AddBtn';
import CancelBtn from '../Common/CancelBtn';
import EditBtn from '../Common/EditBtn';
import DeleteBtn from '../Common/DeleteBtn';
import ConfirmDeleteModal from '../Common/ConfirmDeleteModal';
import { showNotification } from '../Common/utilities';
import AddSchedule from './add';
import { scheduleActions } from '../../redux/scheduleSlice';

const { createSchedule, updateSchedule, deleteSchedule, getSchedules } =
  scheduleActions;

const SchedulePage = () => {
  const dispatch = useDispatch();

  const data = useSelector((state) => state.scheduleReducer.schedules);
  const [isEditing, setIsEditing] = useState(false);
  const [editingRecordId, setEditingRecordId] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [openConfirmDeleteModal, setOpenConfirmDeleteModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDayOfWeek, setNewDayOfWeek] = useState('');
  const [newTimeStart, setNewTimeStart] = useState('');
  const [newTimeEnd, setNewTimeEnd] = useState('');
  const [editingName, setEditingName] = useState('');
  const [editingDayOfWeek, setEditingDayOfWeek] = useState('');
  const [editingTimeStart, setEditingTimeStart] = useState('');
  const [editingTimeEnd, setEditingTimeEnd] = useState('');

  useEffect(() => {
    dispatch(getSchedules());

    document.addEventListener(
      'keydown',
      (keyboardEvent) => escFunction(keyboardEvent.key),
      false
    );

    return () =>
      document.removeEventListener(
        'keydown',
        (keyboardEvent) => escFunction(keyboardEvent.key),
        false
      );
  }, []);

  const escFunction = (event) => event === 'Escape' && stopEditing();

  const startEditing = (record) => {
    setIsEditing(true);
    setEditingRecordId(record._id);
    setEditingName(record.name);
    setEditingDayOfWeek(record.dayOfWeek);
    setEditingTimeStart(record.timeStart);
    setEditingTimeEnd(record.timeEnd);
  };

  const stopEditing = () => {
    setIsEditing(false);
    setEditingRecordId('');
    setEditingName('');
    setEditingDayOfWeek('');
    setEditingTimeStart('');
    setEditingTimeEnd('');
  };

  // Create new schedule
  const onOk = async () => {
    const schedule = {
      name: newName,
      dayOfWeek: newDayOfWeek,
      timeStart: newTimeStart,
      timeEnd: newTimeEnd,
    };

    await dispatch(
      createSchedule(schedule, {
        onSuccess: () => showNotification('success', 'Thêm khung giờ học thành công.'),

        onError: () => showNotification('error', 'Thêm khung giờ học thất bại!'),
      })
    );

    setOpenModal(false);
  };

  // Edit a schedule
  const onEditSchedule = (id) => {
    const schedule = {
      name: editingName,
      dayOfWeek: editingDayOfWeek,
      timeStart: editingTimeStart,
      timeEnd: editingTimeEnd,
    };

    dispatch(
      updateSchedule(id, schedule, {
        onSuccess: () => showNotification('success', 'Sửa thông tin thành công.'),

        onError: () => showNotification('error', 'Sửa thông tin thất bại!'),
      })
    );
    stopEditing();
  };

  // Delete a schedule
  const onDeleteSchedule = () => {
    dispatch(
      deleteSchedule(editingRecordId, {
        onSuccess: () => showNotification('success', 'Xoá khung giờ học thành công.'),
        onError: () => showNotification('error', 'Xoá khung giờ học thất bại!'),
      })
    );

    setEditingRecordId('');
    setOpenConfirmDeleteModal(false);
  };

  return (
    <>
      <AddBtn add={() => setOpenModal(true)} />
      <Table dataSource={data} rowKey="_id">
        <Column
          title="Tên Khung Giờ Học"
          dataIndex="name"
          key="key"
          render={(text, record) =>
            isEditing && editingRecordId === record._id ? (
              <Input
                placeholder="Nhập tên khung giờ học"
                defaultValue={record.name}
                onChange={(e) => setEditingName(e.target.value)}
              />
            ) : (
              text
            )
          }
        />
        <Column
          title="Ngày Trong Tuần"
          dataIndex="dayOfWeek"
          key="key"
          render={(text, record) =>
            isEditing && editingRecordId === record._id ? (
              <Select
                defaultValue={text}
                onChange={(e) => setEditingDayOfWeek(e)}
                style={{ width: '110px' }}
              >
                <Select.Option value="1" key="1">
                  Thứ Hai
                </Select.Option>
                <Select.Option value="2" key="2">
                  Thứ Ba
                </Select.Option>
                <Select.Option value="3" key="3">
                  Thứ Tư
                </Select.Option>
                <Select.Option value="4" key="4">
                  Thứ Năm
                </Select.Option>
                <Select.Option value="5" key="5">
                  Thứ Sáu
                </Select.Option>
                <Select.Option value="6" key="6">
                  Thứ Bảy
                </Select.Option>
                <Select.Option value="0" key="0">
                  Chủ Nhật
                </Select.Option>
              </Select>
            ) : text === '0' ? (
              'Chủ Nhật'
            ) : text === '1' ? (
              'Thứ Hai'
            ) : text === '2' ? (
              'Thứ Ba'
            ) : text === '3' ? (
              'Thứ Tư'
            ) : text === '4' ? (
              'Thứ Năm'
            ) : text === '5' ? (
              'Thứ Sáu'
            ) : text === '6' ? (
              'Thứ Bảy'
            ) : (
              text
            )
          }
        />
        <Column
          title="Thời Gian Bắt Đầu"
          dataIndex="timeStart"
          key="key"
          render={(text, record) =>
            isEditing && editingRecordId === record._id ? (
              <TimePicker
                defaultValue={text && moment(text)}
                format="HH:mm"
                onChange={(time) => setEditingTimeStart(time.toISOString())}
              />
            ) : text ? (
              moment(text).format('HH:mm')
            ) : (
              '---'
            )
          }
        />
        <Column
          title="Thời Gian Kết Thúc"
          dataIndex="timeEnd"
          key="key"
          render={(text, record) =>
            isEditing && editingRecordId === record._id ? (
              <TimePicker
                defaultValue={text && moment(text)}
                format="HH:mm"
                onChange={(time) => setEditingTimeEnd(time.toISOString())}
              />
            ) : text ? (
              moment(text).format('HH:mm')
            ) : (
              '---'
            )
          }
        />
        <Column
          title="Actions"
          key="actions"
          render={(text, record) =>
            isEditing && editingRecordId === record._id ? (
              <Space size="middle">
                <Button
                  type="primary"
                  shape="round"
                  onClick={() => onEditSchedule(record._id)}
                  icon={<EditOutlined />}
                >
                  Ok
                </Button>
                <CancelBtn onCancel={() => stopEditing()} />
              </Space>
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
        title="Thêm Khung Giờ Học"
        cancelText="Huỷ"
        onOk={onOk}
        onCancel={() => setOpenModal(false)}
      >
        <AddSchedule
          name={newName}
          dayOfWeek={newDayOfWeek}
          onChangeName={setNewName}
          onChangeDayOfWeek={setNewDayOfWeek}
          onChangeTimeStart={setNewTimeStart}
          onChangeTimeEnd={setNewTimeEnd}
        />
      </Modal>
      <ConfirmDeleteModal
        open={openConfirmDeleteModal}
        onOk={onDeleteSchedule}
        onCancel={() => setOpenConfirmDeleteModal(false)}
      />
    </>
  );
};

export default SchedulePage;
