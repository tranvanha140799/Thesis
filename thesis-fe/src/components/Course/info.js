/* eslint-disable react-hooks/exhaustive-deps */
import { Space, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { classActions } from '../../redux/classSlice';
import { courseActions } from '../../redux/courseSlice';
import Column from 'antd/lib/table/Column';
import AddBtn from '../Common/AddBtn';
import moment from 'moment';

const { getCourses } = courseActions;
const { getClasses } = classActions;

const Info = ({ id }) => {
  const dispatch = useDispatch();

  const courses = useSelector((state) => state.courseReducer.courses);
  const classes = useSelector((state) => state.classReducer.classes);
  const [currentCourse, setCurrentCourse] = useState({});
  const [listClassOfCourse, setListClassOfCourse] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  // Lấy danh sách khoá học
  useEffect(() => {
    if (!courses.length) dispatch(getCourses());
  }, [courses.length]);

  // Lấy danh sách lớp học
  useEffect(() => {
    if (!classes.length) dispatch(getClasses());
  }, [classes.length]);

  // Lấy thông tin khoá học hiện tại
  useEffect(() => {
    if (courses.length)
      setCurrentCourse(courses.find((course) => course.courseId === id));
  }, [id, courses.length]);

  // Lấy danh sách lớp học thuộc khoá học
  useEffect(() => {
    if (currentCourse._id && classes.length)
      setListClassOfCourse(
        classes.filter((clasS) => clasS.courseId === currentCourse._id)
      );
  }, [currentCourse._id, classes.length]);

  const openModalAddStudent = () => setOpenModal(true);

  return (
    <>
      <AddBtn add={openModalAddStudent} />
      <Table
        dataSource={listClassOfCourse}
        rowKey="classId"
        pagination={{
          showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} lớp học`,
        }}
      >
        <Column title="Mã Lớp Học" dataIndex="classId" key="key" />
        <Column
          title="Tên Lớp Học"
          dataIndex="name"
          key="key"
          render={(text, record) => (
            <Space size="middle">
              <Link to={`/classes/${record.classId}`}>{record.name}</Link>
            </Space>
          )}
        />

        <Column title="Số Lượng Học Viên" dataIndex="numberOfStudents" key="key" />
        <Column
          title="Thời Gian Bắt Đầu"
          dataIndex="dateStart"
          key="key"
          render={(text) => (text ? moment(text).format('DD/MM/YYYY') : '')}
        />
        <Column
          title="Thời Gian Kết Thúc"
          dataIndex="dateEnd"
          key="key"
          render={(text) => (text ? moment(text).format('DD/MM/YYYY') : '')}
        />
        <Column title="Số Học Viên Tối Thiểu" dataIndex="minStudents" key="key" />
        <Column title="Số Học Viên Tối Đa" dataIndex="maxStudents" key="key" />
        <Column title="Khuyến Mãi (%)" dataIndex="discount" key="key" />
        <Column
          title="Khoá Học"
          dataIndex="courseId"
          key="key"
          render={(text, record) =>
            text ? (
              <Link
                to={`/courses/${
                  courses.find((course) => course?._id === text)?.courseId
                }`}
              >
                {courses.find((course) => course?._id === text)?.name}
              </Link>
            ) : (
              '---'
            )
          }
        />
        <Column
          title="Trạng Thái"
          dataIndex="status"
          key="key"
          render={(text) =>
            text === 'active'
              ? 'Hoạt động'
              : text === 'paused'
              ? 'Tạm dừng'
              : text === 'closed'
              ? 'Đã đóng'
              : '---'
          }
        />
      </Table>
    </>
  );
};

export default Info;
