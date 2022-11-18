import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import 'antd/dist/antd.css';

import { Form, Input, Select, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { classActions } from '../../redux/classSlice';

const { createClass, getClasses, updateClass } = classActions;
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 12,
    },
    sm: {
      span: 8,
    },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const AddClass = ({ id }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const totalClasses = useSelector((state) => state.classReducer.totalClasses);
  const clasS = useSelector((state) =>
    id ? state.classReducer.classes.find((p) => p.classId === id) : null
  );
  const [_id, set_Id] = useState('');
  const [classId, setClassId] = useState('');
  const [classname, setClassname] = useState('');
  const [studentQuantity, setStudentQuantity] = useState('');
  const [status, setStatus] = useState('');
  const [formTeacherId, setFormTeacherId] = useState('');

  useEffect(() => {
    if (totalClasses === 0) dispatch(getClasses());
    if (clasS) {
      set_Id(clasS._id);
      setClassId(clasS.classId);
      setClassname(clasS.name);
      setStudentQuantity(clasS.studentQuantity);
      setStatus(clasS.status);
      setFormTeacherId(clasS.formTeacherId);
    }
  }, [dispatch, clasS]);

  const onFinish = async (values) => {
    const clasS = {
      classId,
      name: classname,
      studentQuantity,
      formTeacherId,
      status,
    };
    if (typeof id === 'string') await dispatch(updateClass(_id, clasS));
    else await dispatch(createClass(clasS));

    navigate('/classes');
  };

  return (
    <Form
      {...formItemLayout}
      form={form}
      name="register"
      onFinish={onFinish}
      fields={[
        { name: ['classId'], value: classId },
        { name: ['classname'], value: classname },
        { name: ['studentQuantity'], value: studentQuantity },
        { name: ['formTeacherId'], value: formTeacherId },
        { name: ['status'], value: status },
      ]}
      scrollToFirstError
    >
      <Form.Item
        name="studentId"
        label="Mã Lớp học"
        tooltip="Lớp học có mã là..?"
        onChange={(e) => setClassId(e.target.value)}
        rules={[
          {
            required: true,
            message: 'Hãy nhập mã lớp học!',
            whitespace: false,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="classname"
        label="Tên lớp học"
        tooltip="lớp học tên là..?"
        onChange={(e) => setClassname(e.target.value)}
        rules={[
          {
            required: true,
            message: 'Hãy nhập tên lớp học!',
            whitespace: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item name="minStudents" label="Số học sinh tối thiểu">
        <Input />
      </Form.Item>
      <Form.Item name="maxStudents" label="Số học sinh tối đa">
        <Input />
      </Form.Item>
      <Form.Item name="discount" label="Giảm giá">
        <Input />
      </Form.Item>
      <Form.Item name="courseId" label="Khóa học">
        <Input />
      </Form.Item>
      {/* <Form.Item
        name="studentQuantity"
        label="số lượng học sinh"
        onChange={(e) => setStudentQuantity(e.target.value)}
        rules={[
          {
            required: true,
            message: "Nhập số lượng học sinh!",
          },
        ]}
      >
        <Input />
      </Form.Item> */}

      <Form.Item name="status" label="Trạng Thái">
        <Select
          value={status}
          onChange={(e) => {
            setStatus(e);
            console.log(e);
          }}
          rules={[
            {
              required: false,
              message: '',
            },
          ]}
        >
          <Option value="active">Hoạt động</Option>
          <Option value="paused">Tạm dừng</Option>
          <Option value="closed">Đã đóng</Option>
        </Select>
      </Form.Item>

      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit">
          {id ? 'Sửa Thông Tin' : 'Thêm lớp học'}
        </Button>
        <Button
          type="ghost"
          style={{ marginLeft: '10px' }}
          onClick={() => navigate('/classes')}
        >
          Huỷ Bỏ
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddClass;
