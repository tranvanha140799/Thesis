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
        label="M?? M???c L????ng"
        tooltip="M???c l????ng c?? m?? l??..?"
        onChange={(e) => setSalaryRankId(e.target.value)}
        rules={[
          {
            required: true,
            message: 'H??y nh???p m??!',
            whitespace: false,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="basicSalary"
        label="L????ng C?? B???n"
        tooltip="L????ng c?? b???n l??..?"
        onChange={(e) => setBasicSalary(e.target.value)}
        rules={[
          {
            required: true,
            message: 'H??y nh???p!',
          },
        ]}
      >
        <InputNumber />
      </Form.Item>

      <Form.Item
        name="allowance"
        label="Ph??? C???p"
        tooltip="Ph??? C???p l??..?"
        onChange={(e) => setAllowance(e.target.value)}
        rules={[
          {
            required: true,
            message: 'H??y nh???p!',
          },
        ]}
      >
        <InputNumber />
      </Form.Item>

      <Form.Item
        name="coefficient"
        label="H??? S???"
        tooltip="H??? S??? l??..?"
        onChange={(e) => setCoefficient(e.target.value)}
        rules={[
          {
            required: true,
            message: 'H??y nh???p!',
          },
        ]}
      >
        <InputNumber />
      </Form.Item>

      {/* <Form.Item
        name="fullname"
        label="H??? v?? T??n"
        tooltip="[...] t??n l??..?"
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
      </Form.Item>

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
      </Form.Item> */}

      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit">
          {id ? 'S???a Th??ng Tin' : 'Th??m M???c L????ng'}
        </Button>
        <Button
          type="ghost"
          style={{ marginLeft: '10px' }}
          onClick={() => navigate('/salary-chart')}
        >
          Hu??? B???
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddSalary;
