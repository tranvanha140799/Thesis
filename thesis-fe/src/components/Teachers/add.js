import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

import { createTeacher, getTeachers, updateTeacher } from '../../actions/teachers';

import 'antd/dist/antd.css';
import './index.css';

import { Form, Input, Select, Button, DatePicker } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getSalaries } from '../../actions/salaryChart';
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

const AddTeacher = ({ id }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const salaryRank = useSelector((state) => state.salaryChartReducer.salaries);
  const totalTeachers = useSelector((state) => state.teachersReducer.totalTeachers);
  const teacher = useSelector((state) =>
    id ? state.teachersReducer.teachers.find((p) => p.teacherId === id) : null
  );
  const [_id, set_Id] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [fullname, setFullname] = useState('');
  const [gender, setGender] = useState('');
  const [birthday, setBirtday] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [degree, setDegree] = useState('');
  const [position, setPosition] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [status, setStatus] = useState('');
  const [salaryRankId, setSalaryRankId] = useState('');

  useEffect(() => {
    dispatch(getSalaries());
    if (totalTeachers === 0) dispatch(getTeachers());
    if (teacher) {
      set_Id(teacher._id);
      setTeacherId(teacher.teacherId);
      setFullname(teacher.fullname);
      setGender(teacher.gender);
      setBirtday(teacher.birthday);
      setEmail(teacher.email);
      setAddress(teacher.address);
      setPhoneNumber(teacher.phoneNumber);
      setDegree(teacher.degree);
      setPosition(teacher.position);
      setSubjectId(teacher.subjectId);
      setStatus(teacher.status);
      setSalaryRankId(teacher?.salaryRankId);
    }
  }, [dispatch, teacher]);

  const onFinish = async (values) => {
    const teacher = {
      teacherId,
      fullname,
      gender: values.gender,
      birthday: moment(values.birthday, 'DD/MM/YYYY'),
      email,
      address,
      phoneNumber,
      degree,
      position,
      subjectId,
      status,
      salaryRankId,
    };
    if (typeof id === 'string') await dispatch(updateTeacher(_id, teacher));
    else await dispatch(createTeacher(teacher));

    navigate('/teachers');
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
        // salaryRank: teacher?.salaryRankId ? teacher?.salaryRankId : '',
      }}
      fields={[
        { name: ['teacherId'], value: teacherId },
        { name: ['fullname'], value: fullname },
        { name: ['gender'], value: gender },
        {
          name: ['birthday'],
          value: birthday ? moment(birthday, 'YYYY-MM-DDTHH:00:00[Z]') : '',
        },
        { name: ['email'], value: email },
        { name: ['address'], value: address },
        { name: ['phoneNumber'], value: phoneNumber },
        { name: ['degree'], value: degree },
        { name: ['position'], value: position },
        { name: ['subjectId'], value: subjectId },
        { name: ['status'], value: status },
        { name: ['salaryRank'], value: salaryRankId },
      ]}
      scrollToFirstError
    >
      <Form.Item
        name="teacherId"
        label="M?? Gi??o Vi??n"
        tooltip="Gi??o vi??n c?? m?? l??..?"
        onChange={(e) => setTeacherId(e.target.value)}
        rules={[
          {
            required: true,
            message: 'H??y nh???p m?? gi??o vi??n!',
            whitespace: false,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="fullname"
        label="H??? v?? T??n"
        tooltip="Gi??o vi??n t??n l??..?"
        onChange={(e) => setFullname(e.target.value)}
        rules={[
          {
            required: true,
            message: 'H??y nh???p t??n gi??o vi??n!',
            whitespace: true,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="gender"
        label="Gi???i T??nh"
        onChange={(e) => setGender(e)}
        rules={[
          {
            required: true,
            message: 'Ch???n gi???i t??nh c???a gi??o vi??n!',
          },
        ]}
      >
        <Select placeholder="Ch???n gi???i t??nh">
          <Option value="male">Nam</Option>
          <Option value="female">N???</Option>
          <Option value="other">Kh??c</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="birthday"
        label="Ng??y Sinh"
        rules={[
          {
            required: true,
            message: 'Nh???p ng??y sinh c???a gi??o vi??n!',
          },
        ]}
      >
        <DatePicker
          format="DD/MM/YYYY"
          // onChange={(e) => {
          // setBirtday(e);
          // }}
        />
      </Form.Item>

      <Form.Item
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
      </Form.Item>

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
        name="degree"
        label="H???c V???"
        rules={[
          {
            required: false,
            message: '',
          },
        ]}
      >
        {/* <Input /> */}
        <Select onChange={(e) => setDegree(e)}>
          <Option key={0} value="Ti???n s?? khoa h???c">
            Ti???n s?? khoa h???c
          </Option>
          <Option key={1} value="Ti???n s??">
            Ti???n s??
          </Option>
          <Option key={2} value="Th???c s??">
            Th???c s??
          </Option>
          <Option key={3} value="C??? nh??n">
            C??? nh??n
          </Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="position"
        label="Ch???c V???"
        rules={[
          {
            required: false,
            message: '',
          },
        ]}
      >
        {/* <Input /> */}
        <Select onChange={(e) => setPosition(e)}>
          <Option key={0} value="Hi???u tr?????ng">
            Hi???u tr?????ng
          </Option>
          <Option key={1} value="Ph?? hi???u tr?????ng">
            Ph?? hi???u tr?????ng
          </Option>
          <Option key={2} value="T??? tr?????ng b??? m??n">
            T??? tr?????ng b??? m??n
          </Option>
          <Option key={3} value="Gi??o vi??n">
            Gi??o vi??n
          </Option>
          <Option key={4} value="Tr??? gi???ng">
            Tr??? gi???ng
          </Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="subjectId"
        label="M??n Gi???ng D???y"
        rules={[
          {
            required: false,
            message: '',
          },
        ]}
      >
        <Select onChange={(e) => setSubjectId(e)}>
          <Option key={0} value="001">
            To??n
          </Option>
          <Option key={1} value="002">
            V???t L??
          </Option>
          <Option key={2} value="003">
            Ho?? H???c
          </Option>
          <Option key={3} value="004">
            Sinh H???c
          </Option>
          <Option key={4} value="005">
            Ng??? V??n
          </Option>
          <Option key={5} value="006">
            L???ch S???
          </Option>
          <Option key={6} value="007">
            ?????a L??
          </Option>
          <Option key={7} value="008">
            Ti???ng Anh
          </Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="status"
        label="Tr???ng Th??i"
        rules={[
          {
            required: false,
            message: '',
          },
        ]}
      >
        <Select onChange={(e) => setStatus(e)}>
          <Option key={0} value="1">
            ??ang c??ng t??c
          </Option>
          <Option key={1} value="2">
            T???m ngh???
          </Option>
          <Option key={2} value="3">
            ???? ngh??? vi???c
          </Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="salaryRank"
        label="M???c l????ng"
        rules={[
          {
            required: false,
            message: '',
          },
        ]}
      >
        <Select onChange={(e) => setSalaryRankId(e)}>
          {salaryRank.map((rank) => {
            return (
              <Option key={rank.salaryRankId} value={rank.salaryRankId}>
                {rank.salaryRankId}
              </Option>
            );
          })}
        </Select>
      </Form.Item>

      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit">
          {id ? 'S???a Th??ng Tin' : 'Th??m Gi??o Vi??n'}
        </Button>
        <Button
          type="ghost"
          style={{ marginLeft: '10px' }}
          onClick={() => navigate('/teachers')}
        >
          Hu??? B???
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddTeacher;
