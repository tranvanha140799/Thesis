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
        label="Mã Giáo Viên"
        tooltip="Giáo viên có mã là..?"
        onChange={(e) => setTeacherId(e.target.value)}
        rules={[
          {
            required: true,
            message: 'Hãy nhập mã giáo viên!',
            whitespace: false,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="fullname"
        label="Họ và Tên"
        tooltip="Giáo viên tên là..?"
        onChange={(e) => setFullname(e.target.value)}
        rules={[
          {
            required: true,
            message: 'Hãy nhập tên giáo viên!',
            whitespace: true,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="gender"
        label="Giới Tính"
        onChange={(e) => setGender(e)}
        rules={[
          {
            required: true,
            message: 'Chọn giới tính của giáo viên!',
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
        name="birthday"
        label="Ngày Sinh"
        rules={[
          {
            required: true,
            message: 'Nhập ngày sinh của giáo viên!',
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
            message: 'Email chưa đúng định dạng!',
          },
          {
            required: true,
            message: 'Vui lòng nhập email của bạn!',
          },
        ]}
      >
        <Input />
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
        label="Học Vị"
        rules={[
          {
            required: false,
            message: '',
          },
        ]}
      >
        {/* <Input /> */}
        <Select onChange={(e) => setDegree(e)}>
          <Option key={0} value="Tiến sĩ khoa học">
            Tiến sĩ khoa học
          </Option>
          <Option key={1} value="Tiến sĩ">
            Tiến sĩ
          </Option>
          <Option key={2} value="Thạc sĩ">
            Thạc sĩ
          </Option>
          <Option key={3} value="Cử nhân">
            Cử nhân
          </Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="position"
        label="Chức Vụ"
        rules={[
          {
            required: false,
            message: '',
          },
        ]}
      >
        {/* <Input /> */}
        <Select onChange={(e) => setPosition(e)}>
          <Option key={0} value="Hiệu trưởng">
            Hiệu trưởng
          </Option>
          <Option key={1} value="Phó hiệu trưởng">
            Phó hiệu trưởng
          </Option>
          <Option key={2} value="Tổ trưởng bộ môn">
            Tổ trưởng bộ môn
          </Option>
          <Option key={3} value="Giáo viên">
            Giáo viên
          </Option>
          <Option key={4} value="Trợ giảng">
            Trợ giảng
          </Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="subjectId"
        label="Môn Giảng Dạy"
        rules={[
          {
            required: false,
            message: '',
          },
        ]}
      >
        <Select onChange={(e) => setSubjectId(e)}>
          <Option key={0} value="001">
            Toán
          </Option>
          <Option key={1} value="002">
            Vật Lý
          </Option>
          <Option key={2} value="003">
            Hoá Học
          </Option>
          <Option key={3} value="004">
            Sinh Học
          </Option>
          <Option key={4} value="005">
            Ngữ Văn
          </Option>
          <Option key={5} value="006">
            Lịch Sử
          </Option>
          <Option key={6} value="007">
            Địa Lý
          </Option>
          <Option key={7} value="008">
            Tiếng Anh
          </Option>
        </Select>
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
        <Select onChange={(e) => setStatus(e)}>
          <Option key={0} value="1">
            Đang công tác
          </Option>
          <Option key={1} value="2">
            Tạm nghỉ
          </Option>
          <Option key={2} value="3">
            Đã nghỉ việc
          </Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="salaryRank"
        label="Mức lương"
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
          {id ? 'Sửa Thông Tin' : 'Thêm Giáo Viên'}
        </Button>
        <Button
          type="ghost"
          style={{ marginLeft: '10px' }}
          onClick={() => navigate('/teachers')}
        >
          Huỷ Bỏ
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddTeacher;
