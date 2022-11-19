/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  Table,
  Space,
  Row,
  Col,
  Tabs,
  Card,
  Input,
  InputNumber,
  Button,
  Modal,
} from 'antd';
// import ColumnGroup from 'antd/lib/table/ColumnGroup';
import Column from 'antd/lib/table/Column';

import 'antd/dist/antd.css';
import './index.css';
import { Link, useNavigate } from 'react-router-dom';
import AddBtn from '../Common/AddBtn';
import DeleteBtn from '../Common/DeleteBtn';
import { classActions } from '../../redux/classSlice';
import { exemptActions } from '../../redux/exemptSlice';
import { studentActions } from '../../redux/studentSlice';
import SearchBox from '../Common/SearchBox';
import { showNotification } from '../Common/utilities';
import ConfirmDeleteModal from '../Common/ConfirmDeleteModal';
import { EditOutlined } from '@ant-design/icons';
import EditBtn from '../Common/EditBtn';
import AddExempt from './addExempt';

const { TabPane } = Tabs;
const { getClasses } = classActions;
const { getExempts, createExempt, updateExempt, deleteExempt } = exemptActions;
const { deleteStudent, getStudents, searchStudent } = studentActions;

const StudentPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const data = useSelector((state) => state.studentReducer.students);
  const exempts = useSelector((state) => state.exemptReducer.exempts);
  const classes = useSelector((state) => state.classReducer.classes);

  const [isEditing, setIsEditing] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [editingName, setEditingName] = useState('');
  const [editingPercent, setEditingPercent] = useState(0);
  const [editingNote, setEditingNote] = useState('');
  const [newName, setNewName] = useState('');
  const [newPercent, setNewPercent] = useState(0);
  const [newNote, setNewNote] = useState('');
  const [editingRecordId, setEditingRecordId] = useState('');
  const [openConfirmDeleteModal, setOpenConfirmDeleteModal] = useState(false);

  useEffect(() => {
    dispatch(getStudents());
    dispatch(getClasses());
    dispatch(getExempts());
  }, []);

  const onDeleteStudent = () => {
    dispatch(
      deleteStudent(editingRecordId, {
        onSuccess: () => showNotification('success', 'Xoá học viên thành công.'),
        onError: () => showNotification('error', 'Xoá học viên thất bại!'),
      })
    );

    setEditingRecordId('');
    setOpenConfirmDeleteModal(false);
  };

  // -------------------------- Exemption case's function --------------------------

  const startEditing = (record) => {
    setIsEditing(true);
    setEditingRecordId(record._id);
    setEditingName(record.name);
    setEditingPercent(record.percent);
    setEditingNote(record.note);
  };

  const stopEditing = () => {
    setIsEditing(false);
    setEditingRecordId('');
    setEditingName('');
    setEditingPercent(0);
    setEditingNote('');
  };

  // Create new exempt
  const onOk = async () => {
    const exempt = {
      name: newName,
      percent: newPercent,
      note: newNote,
    };

    await dispatch(
      createExempt(exempt, {
        onSuccess: () =>
          showNotification('success', 'Thêm đối tượng miễn giảm thành công.'),

        onError: () => showNotification('error', 'Thêm đối tượng miễn giảm thất bại!'),
      })
    );

    setOpenModal(false);
  };

  // Edit a exempt
  const onEditExempt = (id) => {
    const exempt = {
      name: editingName,
      percent: editingPercent,
      note: editingNote,
    };

    dispatch(
      updateExempt(id, exempt, {
        onSuccess: () => showNotification('success', 'Sửa thông tin thành công.'),

        onError: () => showNotification('error', 'Sửa thông tin thất bại!'),
      })
    );
    stopEditing();
  };

  // Delete a exempt
  const onDeleteExempt = () => {
    dispatch(
      deleteExempt(editingRecordId, {
        onSuccess: () =>
          showNotification('success', 'Xoá đối tượng miễn giảm thành công.'),
        onError: () => showNotification('error', 'Xoá đối tượng miễn giảm thất bại!'),
      })
    );

    setEditingRecordId('');
    setOpenConfirmDeleteModal(false);
  };

  return (
    <>
      <Tabs defaultActiveKey="1" style={{ width: '100%' }}>
        <TabPane tab="Danh Sách Học Viên" key="1">
          <Card hoverable={false}>
            <Row>
              <Col span={12}>
                <SearchBox
                  style={{ width: '50%' }}
                  placeholder="Tên hoặc mã học viên..."
                  onChange={(str) => dispatch(searchStudent(str))}
                />
              </Col>
              <Col span={12}>
                <AddBtn add={() => navigate('./add')} />
              </Col>
            </Row>
            <Table dataSource={data} rowKey="studentId">
              <Column title="Mã Học Viên" dataIndex="studentId" key="key" />
              <Column
                title="Họ và Tên"
                dataIndex="fullname"
                key="key"
                render={(text, record) => (
                  <Space size="middle">
                    <Link to={`/students/${record.studentId}`}>{record.fullname}</Link>
                  </Space>
                )}
              />
              <Column
                title="Ngày Sinh"
                dataIndex="birthday"
                key="key"
                render={(birthday) => {
                  const date = new Date(birthday);
                  let string = '';
                  string += date.getDate().toString() + '/';
                  string += (date.getMonth() + 1).toString() + '/';
                  string += date.getFullYear().toString();
                  return string;
                }}
              />
              <Column
                title="Giới Tính"
                dataIndex="gender"
                key="key"
                render={(gender) => {
                  if (gender === 'male') return 'Nam';
                  else if (gender === 'female') return 'Nữ';
                  else return 'Khác';
                }}
              />
              <Column title="Địa Chỉ" dataIndex="address" key="key" />
              <Column title="Số Điện Thoại" dataIndex="phoneNumber" key="key" />
              <Column
                title="Lớp"
                dataIndex="classId"
                key="key"
                render={(text) => {
                  const foundClass = classes.filter((clasS) => clasS._id === text)[0];
                  return foundClass?._id ? (
                    <Link to={`/classes/${foundClass?.classId}`}>
                      {foundClass?.name || foundClass?.classname}
                    </Link>
                  ) : (
                    text
                  );
                }}
              />
              <Column
                title="Trạng Thái"
                dataIndex="status"
                key="key"
                render={(text) => {
                  switch (text) {
                    case 'learning':
                      return 'Đang học';
                    case 'paused':
                      return 'Bảo lưu';
                    case 'leaved':
                      return 'Đã nghỉ học';
                    default:
                      return '';
                  }
                }}
              />
              <Column
                title="Action"
                key="action"
                render={(text, record) => (
                  <Space size="middle">
                    <DeleteBtn
                      onDelete={() => {
                        setOpenConfirmDeleteModal(true);
                        setEditingRecordId(record._id);
                      }}
                    />
                  </Space>
                )}
              />
            </Table>
            <ConfirmDeleteModal
              open={openConfirmDeleteModal}
              onOk={onDeleteStudent}
              onCancel={() => setOpenConfirmDeleteModal(false)}
            />
          </Card>
        </TabPane>
        <TabPane tab="Quản Lý Đối Tượng Miễn Giảm Học Phí" key="2">
          <Card hoverable={false}>
            <AddBtn add={() => setOpenModal(true)} />
            <Table dataSource={exempts} rowKey="_id">
              <Column
                title="Tên Đối Tượng Miễn Giảm"
                dataIndex="name"
                key="key"
                render={(text, record) =>
                  isEditing && editingRecordId === record._id ? (
                    <Input
                      placeholder="Nhập tên đối tượng miễn giảm"
                      defaultValue={text}
                      onChange={(e) => setEditingName(e.target.value)}
                    />
                  ) : (
                    text
                  )
                }
              />
              <Column
                title="Tỷ Lệ Miễn Giảm (%)"
                dataIndex="percent"
                key="key"
                render={(text, record) =>
                  isEditing && editingRecordId === record._id ? (
                    <>
                      <InputNumber
                        style={{ width: '200px' }}
                        defaultValue={Number(text)}
                        onChange={(e) => setEditingPercent(e)}
                      />{' '}
                      %
                    </>
                  ) : (
                    text
                  )
                }
              />
              <Column
                title="Ghi Chú"
                dataIndex="note"
                key="key"
                render={(text, record) =>
                  isEditing && editingRecordId === record._id ? (
                    <Input
                      defaultValue={text}
                      onChange={(e) => setEditingNote(e.target.value)}
                    />
                  ) : (
                    text
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
                      onClick={() => onEditExempt(record._id)}
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
              title="Thêm đối tượng miễn giảm"
              cancelText="Huỷ"
              onOk={onOk}
              onCancel={() => setOpenModal(false)}
            >
              <AddExempt
                name={newName}
                percent={newPercent}
                onChangeName={setNewName}
                onChangePercent={setNewPercent}
                onChangeNote={setNewNote}
              />
            </Modal>

            <ConfirmDeleteModal
              open={openConfirmDeleteModal}
              onOk={onDeleteExempt}
              onCancel={() => setOpenConfirmDeleteModal(false)}
            />
          </Card>
        </TabPane>
      </Tabs>
    </>
  );
};

export default StudentPage;
