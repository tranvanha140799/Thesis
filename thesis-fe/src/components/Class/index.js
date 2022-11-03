import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Table, Space, Button } from "antd";
// import ColumnGroup from 'antd/lib/table/ColumnGroup';
import Column from "antd/lib/table/Column";

import "antd/dist/antd.css";
// import "./index.css";
import { Link, useNavigate } from "react-router-dom";
import { deleteClass, getClass } from "../../actions/class";
import AddBtn from "../Common/AddBtn";
import DeleteBtn from "../Common/DeleteBtn";

const ClassPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const data = useSelector((state) => state.classesReducer.classes);

  useEffect(() => {
    dispatch(getClass());
  }, []);

  const gotoAdd = () => {
    navigate("./add");
  };

  const deleteStu = (id) => {
    dispatch(deleteClass(id));
  };

  return (
    <div>
      <AddBtn add={gotoAdd} />
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
        <Column
          title="Số lượng học sinh"
          dataIndex="studentQuantity"
          key="key"
        />
        <Column title="Giới Tính" dataIndex="formTeacherId" key="key" />
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
