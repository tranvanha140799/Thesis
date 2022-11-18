import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { Table, Space, Row, Col } from "antd";
// import ColumnGroup from 'antd/lib/table/ColumnGroup';
import Column from "antd/lib/table/Column";

import "antd/dist/antd.css";
// import "./index.css";
import AddBtn from "../Common/AddBtn";
import DeleteBtn from "../Common/DeleteBtn";
import { classActions } from "../../redux/classSlice";
import { courseAction } from "../../redux/courseSlice";
import SearchBox from "../Common/SearchBox";

const { deleteCourse, getCourses , searchCourse} = courseAction;

const CoursePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const data = useSelector((state) => state.courseReducer.courses);
  console.log(data);
  useEffect(() => {
    dispatch(getCourses());
  }, []);

  const gotoAdd = () => {
    navigate("./add");
  };

  const deleteCourse = (id) => dispatch(deleteCourse(id));

  return (
    <div>
      <Row>
      <Col >
          <SearchBox
            style={{ width: '50%' }}
            placeholder="Tên hoặc mã học viên..."
            onChange={(str) => dispatch(searchCourse(str))}
          />
        </Col>
        <Col span={12}>
          <AddBtn add={gotoAdd} />
        </Col>
      </Row>
      <Table dataSource={data} rowKey="classId">
        <Column title="Mã lớp học" dataIndex="classId" key="key" />
        <Column
          title="Tên Khóa học"
          dataIndex="name"
          key="key"
          render={(text, record) => (
            <Space size="middle">
              <Link to={`/courses/${record.classId}`}>{record.name}</Link>
            </Space>
          )}
        />
        <Column
          title="Số lượng học sinh"
          dataIndex="studentQuantity"
          key="key"
        />
        <Column title="học phí" dataIndex="tuitionFee" key="key" />
        <Column title="Mô tả" dataIndex="desciption" key="key" />
        <Column
          title="Action"
          key="action"
          render={(text, record) => (
            <Space size="middle">
              {/* <Button onClick={() => dispatch(deleteStudent(record._id))}>
                Xoá
              </Button> */}
              <DeleteBtn deletE={() => deleteCourse(record._id)} />
            </Space>
          )}
        />
      </Table>
    </div>
  );
};

export default CoursePage;
