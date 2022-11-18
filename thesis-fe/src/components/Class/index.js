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
import { classActions } from '../../redux/classSlice';
import SearchBox from '../Common/SearchBox';

const { deleteClass, getClasses, searchClass } = classActions;

const ClassPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const data = useSelector((state) => state.classReducer.classes);

  useEffect(() => {
    dispatch(getClasses());
  }, []);

  const gotoAdd = () => {
    navigate('./add');
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
        <Column title="Mã lớp học" dataIndex="classId" key="key" />
        <Column
          title="Tên lớp học"
          dataIndex="name"
          key="key"
          render={(text, record) => (
            <Space size="middle">
              <Link to={`/classes/${record.classId}`}>{record.name}</Link>
            </Space>
          )}
        />
        <Column title="Số lượng học viên" dataIndex="studentQuantity" key="key" />
        <Column title="Mã giáo viên" dataIndex="formTeacherId" key="key" />
        <Column title="Thời gian bắt đầu" dataIndex="dateStart" key="key" />
        <Column title="Thời gian kết thúc" dataIndex="dateEnd" key="key" />
        <Column title="Số học viên tối thiểu" dataIndex="minStudents" key="key" />
        <Column title="Số học viên tối đa" dataIndex="maxStudents" key="key" />
        <Column title="Giảm giá" dataIndex="discount" key="key" />
        <Column title="Khoá học" dataIndex="courseId" key="key" />
        <Column
          title="Trạng thái"
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
              {/* <Button onClick={() => dispatch(deleteStudent(record._id))}>
                Xoá
              </Button> */}
              <DeleteBtn deletE={() => deleteStu(record._id)} />
            </Space>
          )}
        />
      </Table>
    </div>
  );
};

export default ClassPage;
