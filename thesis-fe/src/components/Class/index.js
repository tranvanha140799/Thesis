import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

<<<<<<< HEAD
import { Table, Space } from "antd";
=======
import { Table, Space, Row, Col } from 'antd';
>>>>>>> 815f0a9907a42977bb657ab1a708be48bf7fc075
// import ColumnGroup from 'antd/lib/table/ColumnGroup';
import Column from "antd/lib/table/Column";

import "antd/dist/antd.css";
// import "./index.css";
<<<<<<< HEAD
import AddBtn from "../Common/AddBtn";
import DeleteBtn from "../Common/DeleteBtn";
import { classActions } from "../../redux/classSlice";
import EditBtn from "../Common/EditBtn";
=======

import AddBtn from '../Common/AddBtn';
import DeleteBtn from '../Common/DeleteBtn';
import SearchBox from '../Common/SearchBox';
import { classActions } from '../../redux/classSlice';
import { courseActions } from '../../redux/courseSlice';
>>>>>>> 815f0a9907a42977bb657ab1a708be48bf7fc075

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

  const gotoAdd = () => {
    navigate("./add");
  };
  const gotoEdit = (id) => {
    navigate(`./${id}`);
  };

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
<<<<<<< HEAD
        <Column
          title="Số lượng học sinh"
          dataIndex="studentQuantity"
          key="key"
        />
        <Column title="Giới Tính" dataIndex="formTeacherId" key="key" />
=======
        <Column title="Số Lượng Học Viên" dataIndex="numberOfStudents" key="key" />
        <Column title="Mã Giáo Viên" dataIndex="formTeacherId" key="key" />
        <Column title="Thời Gian Bắt Đầu" dataIndex="dateStart" key="key" />
        <Column title="Thời Gian Kết Thúc" dataIndex="dateEnd" key="key" />
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
>>>>>>> 815f0a9907a42977bb657ab1a708be48bf7fc075
        <Column
          title="Action"
          key="action"
          render={(text, record) => (
            <Space size="middle">
              {/* <Button onClick={() => dispatch(deleteStudent(record._id))}>
                Xoá
              </Button> */}
<<<<<<< HEAD
              <DeleteBtn deletE={() => deleteStu(record._id)} />
              <EditBtn edit={() => gotoEdit(record.classId)} />
=======
              <DeleteBtn onDelete={() => deleteStu(record._id)} />
>>>>>>> 815f0a9907a42977bb657ab1a708be48bf7fc075
            </Space>
          )}
        />
      </Table>
    </div>
  );
};

export default ClassPage;
