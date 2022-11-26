import React from 'react';

import 'antd/dist/antd.css';

import { Form, Input, Select, TimePicker } from 'antd';

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

const AddSchedule = (props) => {
  const [form] = Form.useForm();

  const onChangeTimeStart = (time) => props.onChangeTimeStart(time.toISOString());

  const onChangeTimeEnd = (time) => props.onChangeTimeEnd(time.toISOString());

  return (
    <Form {...formItemLayout} form={form} name="register" scrollToFirstError>
      <Form.Item
        name="name"
        label="Tên khung giờ học"
        tooltip="Khung giờ học tên là..?"
        onChange={(e) => props.onChangeName(e.target.value)}
        rules={[
          {
            required: true,
            message: 'Hãy nhập tên khung giờ học!',
            whitespace: true,
          },
        ]}
      >
        <Input style={{ width: '250px' }} placeholder="Nhập tên khung giờ học" />
      </Form.Item>

      <Form.Item name="dayOfWeek" label="Ngày trong tuần">
        <Select
          style={{ width: '150px' }}
          placeholder="Chọn ngày học"
          // value={props.dayOfWeek}
          onChange={(e) => props.onChangeDayOfWeek(e)}
          rules={[
            {
              required: false,
              message: '',
            },
          ]}
        >
          <Option value="1" key="1">
            Thứ Hai
          </Option>
          <Option value="2" key="2">
            Thứ Ba
          </Option>
          <Option value="3" key="3">
            Thứ Tư
          </Option>
          <Option value="4" key="4">
            Thứ Năm
          </Option>
          <Option value="5" key="5">
            Thứ Sáu
          </Option>
          <Option value="6" key="6">
            Thứ Bảy
          </Option>
          <Option value="0" key="0">
            Chủ Nhật
          </Option>
        </Select>
      </Form.Item>
      <Form.Item name="timeStart" label="Giờ bắt đầu">
        <TimePicker
          format="HH:mm"
          placeholder="Chọn giờ bắt đầu buổi học"
          style={{ width: '220px' }}
          onChange={onChangeTimeStart}
        />
      </Form.Item>
      <Form.Item name="timeEnd" label="Giờ kết thúc">
        <TimePicker
          format="HH:mm"
          placeholder="Chọn giờ kết thúc buổi học"
          style={{ width: '220px' }}
          onChange={onChangeTimeEnd}
        />
      </Form.Item>
    </Form>
  );
};

export default AddSchedule;
