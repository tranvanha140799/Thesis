import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { Form, Input, Select, Button, DatePicker } from 'antd';

import 'antd/dist/antd.css';
import './index.css';

import { validatePhoneNumber } from '../Common/utilities';
import { studentActions } from '../../redux/studentSlice';

const { createStudent, getStudents, updateStudent } = studentActions;
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

const AddStudent = ({ id }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const totalStudents = useSelector((state) => state.studentsReducer.totalStudents);
  const student = useSelector((state) =>
    id ? state.studentsReducer.students.find((p) => p.studentId === id) : null
  );
  const [_id, set_Id] = useState('');
  const [studentId, setStudentId] = useState('');
  const [fullname, setFullname] = useState('');
  const [birthday, setBirtday] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [classId, setClassId] = useState('');
  const [excemptId, setExcemptId] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (totalStudents === 0) dispatch(getStudents());
    if (student) {
      set_Id(student._id);
      setStudentId(student.studentId);
      setFullname(student.fullname);
      setGender(student.gender);
      setBirtday(student.birthday);
      setEmail(student.email);
      setAddress(student.address);
      setPhoneNumber(student.phoneNumber);
      setStatus(student.status);
      setClassId(student.classId);
      setExcemptId(student.excemptId);
    }
  }, [dispatch, student]);

  const onFinish = async (values) => {
    const student = {
      studentId,
      fullname,
      gender: values.gender,
      birthday: moment(values.birthday, 'DD/MM/YYYY'),
      email,
      address,
      phoneNumber,
      status,
      classId,
      excemptId,
    };
    if (typeof id === 'string') await dispatch(updateStudent(_id, student));
    else await dispatch(createStudent(student));

    navigate('/students');
  };

  return (
    <Form
      {...formItemLayout}
      form={form}
      name="register"
      onFinish={onFinish}
      fields={[
        { name: ['studentId'], value: studentId },
        { name: ['fullname'], value: fullname },
        {
          name: ['birthday'],
          value: birthday ? moment(birthday, 'YYYY-MM-DDTHH:00:00[Z]') : '',
        },
        { name: ['gender'], value: gender },
        { name: ['address'], value: address },
        { name: ['phoneNumber'], value: phoneNumber },
        { name: ['status'], value: status },
        { name: ['classId'], value: classId },
        { name: ['excemptId'], value: excemptId },
      ]}
      scrollToFirstError
    >
      <Form.Item
        name="studentId"
        label="Mã Học Sinh"
        tooltip="Học sinh có mã là..?"
        onChange={(e) => setStudentId(e.target.value)}
        rules={[
          {
            required: true,
            message: 'Hãy nhập mã học sinh!',
            whitespace: false,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="fullname"
        label="Họ và Tên"
        tooltip="Học sinh tên là..?"
        onChange={(e) => setFullname(e.target.value)}
        rules={[
          {
            required: true,
            message: 'Hãy nhập tên học sinh!',
            whitespace: true,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="birthday"
        label="Ngày Sinh"
        rules={[
          {
            required: true,
            message: 'Nhập ngày sinh của học sinh!',
          },
        ]}
      >
        <DatePicker
          format="DD/MM/YYYY"
          placeholder="Chọn ngày"
          onChange={(e) => {
            // setBirtday(e);
          }}
        />
      </Form.Item>

      <Form.Item
        name="gender"
        label="Giới Tính"
        onChange={(e) => setGender(e)}
        rules={[
          {
            required: true,
            message: 'Chọn giới tính của học sinh!',
          },
        ]}
      >
        <Select placeholder="Chọn giới tính">
          <Option value="male">Nam</Option>
          <Option value="female">Nữ</Option>
          <Option value="other">Khác</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="address"
        label="Địa Chỉ"
        onChange={(e) => setAddress(e.target.value)}
        rules={[
          {
            required: true,
            message: 'Nhập địa chỉ!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="phoneNumber"
        label="Số Điện Thoại"
        onChange={(e) => setPhoneNumber(e.target.value)}
        rules={[
          {
            required: true,
            message: 'Nhập số điện thoại!',
          },
          { validator: validatePhoneNumber },
        ]}
      >
        <Input
          style={{
            width: '100%',
          }}
        />
      </Form.Item>

      <Form.Item
        name="classId"
        label="Lớp đang học"
        onChange={(e) => setClassId(e.target.value)}
        rules={[
          {
            required: false,
            message: '',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="status"
        label="Trạng Thái"
        rules={[
          {
            required: false,
            message: '',
          },
        ]}
      >
        {/* <Input /> */}
        <Select value={status} onChange={(e) => setStatus(e)}>
          <Select.Option key="learning" value="learning">
            Đang học
          </Select.Option>
          <Select.Option key="paused" value="paused">
            Bảo lưu
          </Select.Option>
          <Select.Option key="leaved" value="leaved">
            Đã nghỉ học
          </Select.Option>
        </Select>
      </Form.Item>

      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit">
          {id ? 'Sửa Thông Tin' : 'Thêm Học Sinh'}
        </Button>
        <Button
          type="ghost"
          style={{ marginLeft: '10px' }}
          onClick={() => navigate('/students')}
        >
          Huỷ Bỏ
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddStudent;
