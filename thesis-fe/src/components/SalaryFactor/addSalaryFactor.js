import React from 'react';

import 'antd/dist/antd.css';

import { Form, Input, InputNumber } from 'antd';

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

const AddSalaryFactor = (props) => {
  const [form] = Form.useForm();

  return (
    <Form {...formItemLayout} form={form} name="register" scrollToFirstError>
      <Form.Item
        name="salaryFactorId"
        label="Mã hệ số lương"
        tooltip="Mã hệ số lương là..?"
        onChange={(e) => props.onChangeId(e.target.value)}
        rules={[
          {
            required: true,
            message: 'Hãy nhập mã hệ số lương!',
            whitespace: true,
          },
        ]}
      >
        <Input style={{ width: '250px' }} placeholder="Nhập mã hệ số lương" />
      </Form.Item>

      <Form.Item
        name="name"
        label="Tên hệ số lương"
        tooltip="Tên hệ số lương là..?"
        onChange={(e) => props.onChangeName(e.target.value)}
        rules={[
          {
            required: true,
            message: 'Hãy nhập tên hệ số lương!',
            whitespace: true,
          },
        ]}
      >
        <Input style={{ width: '250px' }} placeholder="Nhập tên hệ số lương" />
      </Form.Item>

      <Form.Item name="factor" label="Hệ số (%)">
        <InputNumber
          min={0}
          max={100}
          step={0.01}
          style={{ width: '170px' }}
          placeholder="Hệ số (%)"
          onChange={(e) => props.onChangeFactor(e)}
          rules={[
            {
              required: true,
              message: 'Đây là trường bắt buộc!',
            },
          ]}
        />
      </Form.Item>

      <Form.Item name="allowance" label="Trợ cấp (VND)">
        <InputNumber
          min={0}
          step={1000}
          style={{ width: '170px' }}
          placeholder="Trợ cấp (VND)"
          onChange={(e) => props.onChangeAllowance(e)}
        />
      </Form.Item>
    </Form>
  );
};

export default AddSalaryFactor;
