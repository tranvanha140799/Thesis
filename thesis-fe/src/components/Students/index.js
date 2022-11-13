/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Table, Space, Row, Col } from 'antd';
// import ColumnGroup from 'antd/lib/table/ColumnGroup';
import Column from 'antd/lib/table/Column';

import 'antd/dist/antd.css';
import './index.css';
import { Link, useNavigate } from 'react-router-dom';
import AddBtn from '../Common/AddBtn';
import DeleteBtn from '../Common/DeleteBtn';
import { studentActions } from '../../redux/studentSlice';
import { classActions } from '../../redux/classSlice';
import SearchBox from '../Common/SearchBox';

const { deleteStudent, getStudents, searchStudent } = studentActions;
const { getClasses } = classActions;

const StudentPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const data = useSelector((state) => state.studentsReducer.students);
  const classes = useSelector((state) => state.classesReducer.classes);

  useEffect(() => {
    dispatch(getStudents());
    dispatch(getClasses());
  }, []);

  return (
    <>
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
              <DeleteBtn deletE={() => dispatch(deleteStudent(record._id))} />
            </Space>
          )}
        />
      </Table>
    </>
  );
};

export default StudentPage;
