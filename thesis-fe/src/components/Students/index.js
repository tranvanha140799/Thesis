/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Table, Space, Button } from 'antd';
// import ColumnGroup from 'antd/lib/table/ColumnGroup';
import Column from 'antd/lib/table/Column';

import 'antd/dist/antd.css';
import './index.css';
import { Link, useNavigate, useRoutes } from 'react-router-dom';
import AddBtn from '../Common/AddBtn';
import DeleteBtn from '../Common/DeleteBtn';
import { studentActions } from '../../redux/studentSlice';
import { classActions } from '../../redux/classSlice';

const { deleteStudent, getStudents } = studentActions;
const { getClasses } = classActions;

const StudentPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const data = useSelector((state) => state.studentsReducer.students);

  useEffect(() => {
    dispatch(getStudents());
    dispatch(getClasses());
  }, []);

  const gotoAdd = () => navigate('./add');

  const deleteStu = (id) => dispatch(deleteStudent(id));

  return (
    <>
      <AddBtn add={gotoAdd} />
      <Table dataSource={data} rowKey="studentId">
        <Column title="Mã Học Sinh" dataIndex="studentId" key="key" />
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
        <Column title="Mã Lớp" dataIndex="classId" key="key" />
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
              <DeleteBtn deletE={() => deleteStu(record._id)} />
            </Space>
          )}
        />
      </Table>
    </>
  );
};

export default StudentPage;
