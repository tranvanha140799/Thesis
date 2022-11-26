/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import FileBase from 'react-file-base64';
import { Form, Input, Select, Button, DatePicker, Row, Col, Avatar } from 'antd';

import 'antd/dist/antd.css';
import './index.css';
import { teacherActions } from '../../redux/teacherSlice';
import { showNotification, validatePhoneNumber } from '../Common/utilities';

const { createTeacher, getTeachers, updateTeacher } = teacherActions;
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
  const totalTeachers = useSelector((state) => state.teacherReducer.totalTeachers);
  const teacher = useSelector((state) =>
    id ? state.teacherReducer.teachers.find((p) => p.teacherId === id) : null
  );
  const [_id, set_Id] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [fullname, setFullname] = useState('');
  const [gender, setGender] = useState('');
  const [birthday, setBirtday] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [position, setPosition] = useState('');
  const [workType, setWorkType] = useState('');
  const [status, setStatus] = useState('');
  const [salaryRankId, setSalaryRankId] = useState('');
  const [image, setImage] = useState('');

  useEffect(() => {
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
      setPosition(teacher.position);
      setWorkType(teacher.workType);
      setStatus(teacher.status);
      setSalaryRankId(teacher?.salaryRankId);
      setImage(teacher.image);
    }
  }, [dispatch, teacher]);

  const onFinish = async (values) => {
    const payload = {
      teacherId,
      fullname,
      gender: values.gender,
      birthday: moment(values.birthday, 'DD/MM/YYYY'),
      email,
      address,
      phoneNumber,
      position,
      workType,
      status,
      salaryRankId,
      image,
      classId: teacher?.classId || '',
    };
    if (typeof id === 'string')
      await dispatch(
        updateTeacher(_id, payload, {
          onSuccess: () =>
            showNotification('success', 'Sửa thông tin giảng viên thành công.'),
          onError: () =>
            showNotification('error', 'Sửa thông tin giảng viên thất bại!'),
        })
      );
    else
      await dispatch(
        createTeacher(payload, {
          onSuccess: () => showNotification('success', 'Thêm giảng viên thành công.'),
          onError: () => showNotification('error', 'Thêm giảng viên thất bại!'),
        })
      );

    navigate('/teachers');
  };

  return (
    <Form
      {...formItemLayout}
      form={form}
      name="register"
      onFinish={onFinish}
      fields={[
        { name: ['teacherId'], value: teacherId },
        { name: ['fullname'], value: fullname },
        { name: ['gender'], value: gender },
        { name: ['birthday'], value: birthday ? moment(birthday) : '' },
        { name: ['email'], value: email },
        { name: ['address'], value: address },
        { name: ['phoneNumber'], value: phoneNumber },
        { name: ['position'], value: position },
        { name: ['workType'], value: workType },
        { name: ['status'], value: status },
        { name: ['image'], value: image },
      ]}
      scrollToFirstError
    >
      <Row>
        <Col span={12}>
          <Form.Item
            name="teacherId"
            label="Mã Giảng Viên"
            tooltip="Giảng viên có mã là..?"
            onChange={(e) => setTeacherId(e.target.value)}
            rules={[
              {
                required: true,
                message: 'Hãy nhập mã giảng viên!',
                whitespace: false,
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="fullname"
            label="Họ và Tên"
            tooltip="Giảng viên tên là..?"
            onChange={(e) => setFullname(e.target.value)}
            rules={[
              {
                required: true,
                message: 'Hãy nhập tên giảng viên!',
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
                message: 'Chọn giới tính của giảng viên!',
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
                message: 'Nhập ngày sinh của giảng viên!',
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
            <Input style={{ width: '100%' }} />
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
        </Col>

        <Col span={12}>
          <Form.Item name="image" label="Ảnh">
            {image && <Avatar src={image} size={200} />}
            <FileBase
              type="file"
              multiple={false}
              title="Chọn ảnh"
              onDone={({ base64 }) => setImage(base64)}
            />
          </Form.Item>

          <Form.Item
            name="position"
            label="Chức Vụ"
            rules={[
              {
                required: true,
                message: 'Đây là trường bắt buộc!',
              },
            ]}
          >
            <Select onChange={(e) => setPosition(e)}>
              <Option key="teacher" value="teacher">
                Giảng Viên
              </Option>
              <Option key="tutor" value="tutor">
                Trợ Giảng
              </Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="workType"
            label="Hình Thức Làm Việc"
            rules={[
              {
                required: true,
                message: 'Đây là trường bắt buộc!',
              },
            ]}
          >
            <Select onChange={(e) => setWorkType(e)}>
              <Option key="fulltime" value="fulltime">
                Toàn Thời Gian
              </Option>
              <Option key="parttime" value="parttime">
                Bán Thời Gian
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
              <Option key="active" value="active">
                Đang công tác
              </Option>
              <Option key="paused" value="paused">
                Tạm nghỉ
              </Option>
              <Option key="leaved" value="leaved">
                Đã nghỉ việc
              </Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row
        style={{
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            {id ? 'Sửa Thông Tin' : 'Thêm Giảng Viên'}
          </Button>
          <Button
            type="ghost"
            style={{ marginLeft: '10px' }}
            onClick={() => navigate('/teachers')}
          >
            Huỷ Bỏ
          </Button>
        </Form.Item>
      </Row>
    </Form>
  );
};

export default AddTeacher;
