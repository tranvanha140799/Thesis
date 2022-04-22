import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import moment from 'moment';

import { createSalary, getSalaries, updateSalary } from '../../actions/salaryChart';

import 'antd/dist/antd.css';
import './index.css';

import { Form, Input, Select, Button, InputNumber } from 'antd';
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

const AddSalary = ({ id }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const totalSalaries = useSelector((state) => state.salaryChartReducer.totalSalarys);
  const salary = useSelector((state) =>
    id ? state.salaryChartReducer.salaries.find((p) => p.salaryRankId === id) : null
  );
  const [_id, set_Id] = useState('');
  const [salaryRankId, setSalaryRankId] = useState('');
  const [basicSalary, setBasicSalary] = useState(0);
  const [allowance, setAllowance] = useState(0);
  const [coefficient, setCoefficient] = useState(0);

  useEffect(() => {
    if (totalSalaries === 0) dispatch(getSalaries());
    if (salary) {
      set_Id(salary._id);
      setSalaryRankId(salary.salaryRankId);
      setBasicSalary(salary.basicSalary);
      setAllowance(salary.allowance);
      setCoefficient(salary.coefficient);
    }
  }, [dispatch, salary]);

  const onFinish = async (values) => {
    const salary = {
      salaryRankId,
      basicSalary,
      allowance,
      coefficient,
    };
    if (typeof id === 'string') await dispatch(updateSalary(_id, salary));
    else await dispatch(createSalary(salary));

    navigate('/salary-chart');
  };

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
        { name: ['salaryRankId'], value: salaryRankId },
        { name: ['basicSalary'], value: basicSalary },
        { name: ['allowance'], value: allowance },
        { name: ['coefficient'], value: coefficient },
      ]}
      scrollToFirstError
    >
      <Form.Item
        name="salaryRankId"
        label="Mã Mức Lương"
        tooltip="Mức lương có mã là..?"
        onChange={(e) => setSalaryRankId(e.target.value)}
        rules={[
          {
            required: true,
            message: 'Hãy nhập mã!',
            whitespace: false,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="basicSalary"
        label="Lương Cơ Bản"
        tooltip="Lương cơ bản là..?"
        onChange={(e) => setBasicSalary(e.target.value)}
        rules={[
          {
            required: true,
            message: 'Hãy nhập!',
          },
        ]}
      >
        <InputNumber />
      </Form.Item>

      <Form.Item
        name="allowance"
        label="Phụ Cấp"
        tooltip="Phụ Cấp là..?"
        onChange={(e) => setAllowance(e.target.value)}
        rules={[
          {
            required: true,
            message: 'Hãy nhập!',
          },
        ]}
      >
        <InputNumber />
      </Form.Item>

      <Form.Item
        name="coefficient"
        label="Hệ Số"
        tooltip="Hệ Số là..?"
        onChange={(e) => setCoefficient(e.target.value)}
        rules={[
          {
            required: true,
            message: 'Hãy nhập!',
          },
        ]}
      >
        <InputNumber />
      </Form.Item>

      {/* <Form.Item
        name="fullname"
        label="Họ và Tên"
        tooltip="[...] tên là..?"
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
          onChange={(e) => {
            // setBirtday(e);
          }}
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
        onChange={(e) => setDegree(e.target.value)}
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
        name="position"
        label="Chức Vụ"
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
        label="Môn Giảng Dạy"
        onChange={(e) => setSubject(e.target.value)}
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
        onChange={(e) => setStatus(e.target.value)}
        rules={[
          {
            required: false,
            message: '',
          },
        ]}
      >
        <Input />
      </Form.Item> */}

      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit">
          {id ? 'Sửa Thông Tin' : 'Thêm Mức Lương'}
        </Button>
        <Button
          type="ghost"
          style={{ marginLeft: '10px' }}
          onClick={() => navigate('/salary-chart')}
        >
          Huỷ Bỏ
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddSalary;
