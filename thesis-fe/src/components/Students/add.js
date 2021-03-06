import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

import { createStudent, getStudents, updateStudent } from '../../actions/students';

import 'antd/dist/antd.css';
import './index.css';

import { Form, Input, Select, Button, DatePicker } from 'antd';
import { useNavigate } from 'react-router-dom';
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
  // const [degree, setDegree] = useState('');
  // const [position, setPosition] = useState('');
  // const [subject, setSubject] = useState('');
  const [classId, setClassId] = useState('');
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
      // setDegree(student.degree);
      // setPosition(student.position);
      // setSubject(student.subject);
      setClassId(student.classId);
      setStatus(student.status);
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
      // degree,
      // position,
      // subject,
      classId,
      status,
    };
    if (typeof id === 'string') await dispatch(updateStudent(_id, student));
    else await dispatch(createStudent(student));

    navigate('/students');
  };

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select
        style={{
          width: 70,
        }}
      >
        <Option value="84">+84</Option>
        <Option value="1">+1</Option>
      </Select>
    </Form.Item>
  );

  return (
    <Form
      {...formItemLayout}
      form={form}
      name="register"
      onFinish={onFinish}
      initialValues={{
        residence: [],
        prefix: '84',
      }}
      fields={[
        { name: ['studentId'], value: studentId },
        { name: ['fullname'], value: fullname },
        { name: ['gender'], value: gender },
        {
          name: ['birthday'],
          value: birthday ? moment(birthday, 'YYYY-MM-DDTHH:00:00[Z]') : '',
        },
        { name: ['email'], value: email },
        { name: ['address'], value: address },
        { name: ['phoneNumber'], value: phoneNumber },
        // { name: ['degree'], value: degree },
        // { name: ['position'], value: position },
        // { name: ['subject'], value: subject },
        { name: ['classId'], value: classId },
        { name: ['status'], value: status },
      ]}
      scrollToFirstError
    >
      <Form.Item
        name="studentId"
        label="M?? H???c Sinh"
        tooltip="H???c sinh c?? m?? l??..?"
        onChange={(e) => setStudentId(e.target.value)}
        rules={[
          {
            required: true,
            message: 'H??y nh???p m?? h???c sinh!',
            whitespace: false,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="fullname"
        label="H??? v?? T??n"
        tooltip="H???c sinh t??n l??..?"
        onChange={(e) => setFullname(e.target.value)}
        rules={[
          {
            required: true,
            message: 'H??y nh???p t??n h???c sinh!',
            whitespace: true,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="birthday"
        label="Ng??y Sinh"
        rules={[
          {
            required: true,
            message: 'Nh???p ng??y sinh c???a h???c sinh!',
          },
        ]}
      >
        <DatePicker
          format="DD/MM/YYYY"
          onChange={(e) => {
            // setBirtday(e);
          }}
        />
      </Form.Item>

      <Form.Item
        name="gender"
        label="Gi???i T??nh"
        onChange={(e) => setGender(e)}
        rules={[
          {
            required: true,
            message: 'Ch???n gi???i t??nh c???a h???c sinh!',
          },
        ]}
      >
        <Select placeholder="Ch???n gi???i t??nh">
          <Option value="male">Nam</Option>
          <Option value="female">N???</Option>
          <Option value="other">Kh??c</Option>
        </Select>
      </Form.Item>

      {/* <Form.Item
        name="email"
        label="E-mail"
        onChange={(e) => setEmail(e.target.value)}
        rules={[
          {
            type: 'email',
            message: 'Email ch??a ????ng ?????nh d???ng!',
          },
          {
            required: true,
            message: 'Vui l??ng nh???p email c???a b???n!',
          },
        ]}
      >
        <Input />
      </Form.Item> */}

      <Form.Item
        name="address"
        label="?????a Ch???"
        onChange={(e) => setAddress(e.target.value)}
        rules={[
          {
            required: true,
            message: 'Nh???p ?????a ch???!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="phoneNumber"
        label="S??? ??i???n Tho???i"
        onChange={(e) => setPhoneNumber(e.target.value)}
        rules={[
          {
            required: true,
            message: 'Nh???p s??? ??i???n tho???i!',
          },
        ]}
      >
        <Input
          addonBefore={prefixSelector}
          style={{
            width: '100%',
          }}
        />
      </Form.Item>

      <Form.Item
        name="classId"
        label="M?? L???p"
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

      {/* <Form.Item
        name="position"
        label="Ch???c V???"
        onChange={(e) => setPosition(e.target.value)}
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
        name="subject"
        label="M??n Gi???ng D???y"
        onChange={(e) => setSubject(e.target.value)}
        rules={[
          {
            required: false,
            message: '',
          },
        ]}
      >
        <Input />
      </Form.Item> */}

      <Form.Item
        name="status"
        label="Tr???ng Th??i"
        onChange={(e) => setStatus(e.target.value)}
        rules={[
          {
            required: false,
            message: '',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit">
          {id ? 'S???a Th??ng Tin' : 'Th??m H???c Sinh'}
        </Button>
        <Button
          type="ghost"
          style={{ marginLeft: '10px' }}
          onClick={() => navigate('/students')}
        >
          Hu??? B???
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddStudent;
