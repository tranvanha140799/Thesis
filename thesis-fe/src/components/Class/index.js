import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Table, Space, Button } from "antd";
// import ColumnGroup from 'antd/lib/table/ColumnGroup';
import Column from "antd/lib/table/Column";

import "antd/dist/antd.css";
// import "./index.css";
import { Link } from "react-router-dom";
import { deleteClass, getClass } from "../../actions/class";

const ClassPage = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.classesReducer.classes);

  useEffect(() => {
    dispatch(getClass());
  }, []);

  return (
    <Table dataSource={data} rowKey="classId">
      <Column title="Mã lớp học" dataIndex="classId" key="key" />
      <Column
        title="Tên lớp học"
        dataIndex="classname"
        key="key"
        render={(text, record) => (
          <Space size="middle">
            <Link to={`/classes/${record.classId}`}>{record.classname}</Link>
          </Space>
        )}
      />
      <Column title="Số lượng học sinh" dataIndex="studentQuantity" key="key" />
      <Column title="Giới Tính" dataIndex="formTeacherId" key="key" />
    </Table>
  );
};

export default ClassPage;
