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

const AddExempt = (props) => {
  const [form] = Form.useForm();

  return (
    <Form {...formItemLayout} form={form} name="register" scrollToFirstError>
      <Form.Item
        name="name"
        label="Tên đối tượng"
        tooltip="Đối tượng miễn giảm là..?"
        onChange={(e) => props.onChangeName(e.target.value)}
        rules={[
          {
            required: true,
            message: 'Hãy nhập tên đối tượng miễn giảm!',
            whitespace: true,
          },
        ]}
      >
        <Input style={{ width: '250px' }} placeholder="Nhập tên đối tượng miễn giảm" />
      </Form.Item>

      <Form.Item name="percent" label="Tỷ lệ miễn giảm (%)">
        <InputNumber
          min={0}
          max={100}
          step={0.5}
          style={{ width: '170px' }}
          placeholder="Tỷ lệ miễn giảm (%)"
          onChange={(e) => props.onChangePercent(e)}
          rules={[
            {
              required: true,
              message: 'Đây là trường bắt buộc!',
            },
          ]}
        />
      </Form.Item>

      <Form.Item name="note" label="Ghi chú">
        <Input
          name="note"
          placeholder="Ghi chú"
          style={{ width: '250px' }}
          onChange={(e) => props.onChangeNote(e.target.value)}
        />
      </Form.Item>
    </Form>
  );
};

export default AddExempt;
