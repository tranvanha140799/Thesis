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
import { courseActions } from '../../redux/courseSlice';
import SearchBox from '../Common/SearchBox';
import { numberToVnd } from '../Common/utilities';

const { deleteCourse, getCourses, searchCourse } = courseActions;

const CoursePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const data = useSelector((state) => state.courseReducer.courses);

  useEffect(() => {
    dispatch(getCourses());
  }, []);

  const gotoAdd = () => {
    navigate('./add');
  };

  const delCourse = (id) => dispatch(deleteCourse(id));

  return (
    <div>
      <Row>
        <Col span={12}>
          <SearchBox
            style={{ width: '50%' }}
            placeholder="Tên hoặc mã khoá học..."
            onChange={(str) => dispatch(searchCourse(str))}
          />
        </Col>
        <Col span={12}>
          <AddBtn add={gotoAdd} />
        </Col>
      </Row>
      <Table dataSource={data} rowKey="_id">
        <Column title="Mã khoá học" dataIndex="courseId" key="key" />
        <Column
          title="Tên khoá học"
          dataIndex="name"
          key="key"
          render={(text, record) => (
            <Space size="middle">
              <Link to={`/courses/${record.courseId}`}>{record.name}</Link>
            </Space>
          )}
        />
        <Column
          title="Học phí"
          dataIndex="tuitionFee"
          key="key"
          render={(text) => (text ? numberToVnd(text) : '---')}
        />
        <Column title="Mô tả" dataIndex="description" key="key" />
        <Column
          title="Action"
          key="action"
          render={(text, record) => (
            <Space size="middle">
              {/* <Button onClick={() => dispatch(deleteStudent(record._id))}>
                Xoá
              </Button> */}
              <DeleteBtn deletE={() => delCourse(record._id)} />
            </Space>
          )}
        />
      </Table>
    </div>
  );
};

export default CoursePage;
