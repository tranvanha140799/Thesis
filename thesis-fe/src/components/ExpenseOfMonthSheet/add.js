import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

import {
  createExpenseOfMonthSheet,
  getExpenseOfMonthSheets,
  updateExpenseOfMonthSheet,
} from '../../actions/expenseOfMonthSheet';

import 'antd/dist/antd.css';
import './index.css';

import { Form, Input, Select, Button, InputNumber, DatePicker } from 'antd';
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

const AddExpenseOfMonthSheet = ({ id }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const totalExpenseOfMonthSheets = useSelector(
    (state) => state.expenseOfMonthSheetReducer.totalExpenseOfMonthSheets
  );
  const expenseOfMonthSheet = useSelector((state) =>
    id
      ? state.expenseOfMonthSheetReducer.expenseOfMonthSheets.find(
          (p) => p.expenseOfMonthSheetId === id
        )
      : null
  );
  const [_id, set_Id] = useState('');
  const [expenseOfMonthSheetId, setExpenseOfMonthSheetId] = useState('');
  const [createBy, setCreateBy] = useState('');
  const [createDate, setCreateDate] = useState('');

  useEffect(() => {
    if (totalExpenseOfMonthSheets === 0) dispatch(getExpenseOfMonthSheets());
    if (expenseOfMonthSheet) {
      set_Id(expenseOfMonthSheet._id);
      setExpenseOfMonthSheetId(expenseOfMonthSheet.expenseOfMonthSheetId);
      setCreateBy(expenseOfMonthSheet.createBy);
      setCreateDate(expenseOfMonthSheet.createDate);
    }
  }, [dispatch, expenseOfMonthSheet]);

  const onFinish = async (values) => {
    const expenseOfMonthSheet = {
      expenseOfMonthSheetId,
      createBy,
      createDate: moment(values.createDate, 'DD/MM/YYYY'),
    };
    if (typeof id === 'string')
      await dispatch(updateExpenseOfMonthSheet(_id, expenseOfMonthSheet));
    else await dispatch(createExpenseOfMonthSheet(expenseOfMonthSheet));

    navigate('/expense-of-month-sheets');
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
        createDate: moment(createDate, 'DD/MM/YYYY'),
      }}
      fields={[
        { name: ['expenseOfMonthSheetId'], value: expenseOfMonthSheetId },
        { name: ['createBy'], value: createBy },
        {
          name: ['createDate'],
          value: createDate ? moment(createDate, 'YYYY-MM-DDTHH:00:00[Z]') : '',
        },
      ]}
      scrollToFirstError
    >
      <Form.Item
        name="expenseOfMonthSheetId"
        label="Mã Phiếu Chi Tháng"
        tooltip="Phiếu chi có mã là..?"
        onChange={(e) => setExpenseOfMonthSheetId(e.target.value)}
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
        name="createBy"
        label="Người Lập Phiếu"
        tooltip="Người lập phiếu là..?"
        onChange={(e) => setCreateBy(e.target.value)}
        rules={[
          {
            required: true,
            message: 'Hãy nhập!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="createDate"
        label="Ngày Lập Phiếu"
        tooltip="Ngày lập phiếu là..?"
        // onChange={(e) => setCreateDate(e.target.value)}
        rules={[
          {
            required: true,
            message: 'Hãy nhập!',
          },
        ]}
      >
        <DatePicker format="DD/MM/YYYY" />
      </Form.Item>

      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit">
          {id ? 'Sửa Thông Tin' : 'Thêm Phiếu'}
        </Button>
        <Button
          type="ghost"
          style={{ marginLeft: '10px' }}
          onClick={() => navigate('/expense-of-month-sheets')}
        >
          Huỷ Bỏ
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddExpenseOfMonthSheet;
