/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { Table, Space, Row, Col } from 'antd';
// import ColumnGroup from 'antd/lib/table/ColumnGroup';
import Column from 'antd/lib/table/Column';

import 'antd/dist/antd.css';
// import "./index.css";

import AddBtn from '../Common/AddBtn';
import DeleteBtn from '../Common/DeleteBtn';
import SearchBox from '../Common/SearchBox';
import { classActions } from '../../redux/classSlice';
import { courseActions } from '../../redux/courseSlice';
import moment from 'moment';

const { getCourses } = courseActions;
const { deleteClass, getClasses, searchClass } = classActions;

const ClassPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const data = useSelector((state) => state.classReducer.classes);
  const courses = useSelector((state) => state.courseReducer.courses);

  useEffect(() => {
    dispatch(getClasses());
    if (!courses.length) dispatch(getCourses());
  }, []);

  const gotoAdd = () => navigate('./add');

  const gotoEdit = (id) => navigate(`./${id}`);

  const deleteStu = (id) => dispatch(deleteClass(id));

  return (
    <div>
      <Row>
        <Col span={12}>
          <SearchBox
            style={{ width: '50%' }}
            placeholder="Tên hoặc mã lớp học..."
            onChange={(str) => dispatch(searchClass(str))}
          />
        </Col>
        <Col span={12}>
          <AddBtn add={gotoAdd} />
        </Col>
      </Row>
      <Table dataSource={data} rowKey="classId">
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
        <Column
          title="Action"
          key="action"
          render={(text, record) => (
            <Space size="middle">
              <DeleteBtn onDelete={() => deleteStu(record._id)} />
            </Space>
          )}
        />
      </Table>
    </div>
  );
};

export default ClassPage;
