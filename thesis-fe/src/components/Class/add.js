/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import 'antd/dist/antd.css';

import { Form, Input, Select, Button, DatePicker, Col, Row, InputNumber } from 'antd';
import { useNavigate } from 'react-router-dom';
import { classActions } from '../../redux/classSlice';
import FormItem from 'antd/es/form/FormItem';
import moment from 'moment';
// import { getCourses } from "../../api";
import { courseActions } from '../../redux/courseSlice';

const { createClass, getClasses, updateClass } = classActions;
const { getCourses } = courseActions;
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

const AddClass = ({ id }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const totalClasses = useSelector((state) => state.classReducer.totalClasses);
  const courses = useSelector((state) => state.courseReducer.courses);
  const clasS = useSelector((state) =>
    id ? state.classReducer.classes.find((p) => p.classId === id) : null
  );
  const [_id, set_Id] = useState('');
  const [classId, setClassId] = useState('');
  const [name, setName] = useState('');
  const [studentQuantity, setStudentQuantity] = useState('');
  const [status, setStatus] = useState('');
  const [minStu, setMinStu] = useState('');
  const [maxStu, setMaxStu] = useState('');
  const [discount, setDiscount] = useState('');
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');
  const [courseId, setCourseId] = useState('');

  useEffect(() => {
    if (totalClasses === 0) dispatch(getClasses());
    if (clasS) {
      set_Id(clasS._id);
      setClassId(clasS.classId);
      setName(clasS.name);
      setStudentQuantity(clasS.studentQuantity);
      setStatus(clasS.status);
      setMinStu(clasS.minStudents);
      setMaxStu(clasS.maxStudents);
      setDiscount(clasS.discount);
      setDateStart(clasS.dateStart);
      setDateEnd(clasS.dateEnd);
      setCourseId(clasS.courseId);
    }
  }, [dispatch, clasS]);

  useEffect(() => {
    if (!courses.length) dispatch(getCourses());
  }, []);

  const onFinish = async (values) => {
    const payload = {
      classId,
      name,
      studentQuantity,
      status,
      minStudents: minStu,
      maxStudents: maxStu,
      discount,
      dateStart,
      dateEnd,
      courseId,
    };

    if (typeof id === 'string') await dispatch(updateClass(_id, payload));
    else await dispatch(createClass(payload));

    navigate('/classes');
  };

  return (
    <Form
      {...formItemLayout}
      form={form}
      name="register"
      onFinish={onFinish}
      fields={[
        { name: ['classId'], value: classId },
        { name: ['classname'], value: name },
        { name: ['studentQuantity'], value: studentQuantity },
        { name: ['minStudents'], value: minStu },
        { name: ['maxStudents'], value: maxStu },
        { name: ['studentQuantity'], value: studentQuantity },
        { name: ['status'], value: status },
        { name: ['discount'], value: discount },
        { name: ['courseId'], value: courseId },
      ]}
      scrollToFirstError
    >
      <Row>
        <Col span={12}>
          <Form.Item name="courseId" label="Khoá học">
            <Select
              value={courseId || undefined}
              onChange={(e) => setCourseId(e)}
              allowClear
              placeholder="Chọn khoá học"
            >
              {courses.map((course) => (
                <Select.Option key={course._id} value={course._id}>
                  {course.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="classId"
            label="Mã Lớp học"
            tooltip="Lớp học có mã là..?"
            onChange={(e) => setClassId(e.target.value)}
            rules={[
              {
                required: true,
                message: 'Hãy nhập mã lớp học!',
                whitespace: false,
              },
            ]}
          >
            <Input placeholder="Mã lớp học" />
          </Form.Item>

          <Form.Item
            name="classname"
            label="Tên lớp học"
            tooltip="lớp học tên là..?"
            onChange={(e) => setName(e.target.value)}
            rules={[
              {
                required: true,
                message: 'Hãy nhập tên lớp học!',
                whitespace: true,
              },
            ]}
          >
            <Input placeholder="Tên lớp học" />
          </Form.Item>
          <Form.Item
            name="minStudents"
            label="Số học viên tối thiểu"
            tooltip="Số học viên tối thiểu là..?"
          >
            <InputNumber
              min={1}
              value={minStu}
              style={{ width: '100%' }}
              placeholder="Số học viên tối thiểu"
              onChange={(e) => setMinStu(e)}
            />
          </Form.Item>
          <Form.Item
            name="maxStudents"
            label="Số học viên tối đa"
            tooltip="Số học viên tối đa là..?"
          >
            <InputNumber
              min={minStu}
              value={maxStu}
              style={{ width: '100%' }}
              placeholder="Số học viên tối đa"
              onChange={(e) => setMaxStu(e)}
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item
            name="discount"
            label="Giảm giá (%)"
            onChange={(e) => setDiscount(e.target.value)}
          >
            <Input placeholder="Giảm % học phí" />
          </Form.Item>
          <FormItem label="Ngày bắt đầu" name="dateStart">
            <DatePicker
              value={dateStart}
              style={{ width: '100%' }}
              showTime={{
                format: 'DD/MM/YYYY',
                placeholder: 'Chọn ngày',
              }}
              format="DD/MM/YYYY"
              placeholder="Chọn thời gian..."
              onChange={(date, dateString) =>
                setDateStart(new Date(date).toISOString())
              }
            />
          </FormItem>
          <FormItem label="Ngày kết thúc" name="dateEnd">
            <DatePicker
              value={dateEnd}
              style={{ width: '100%' }}
              showTime={{
                format: 'DD/MM/YYYY',
                placeholder: 'Chọn ngày',
              }}
              format="DD/MM/YYYY"
              placeholder="Chọn thời gian..."
              onChange={(date, dateString) => setDateEnd(new Date(date).toISOString())}
              disabledDate={(current) =>
                current && current < moment(new Date(dateStart)).startOf('day')
              }
            />
          </FormItem>
          <Form.Item name="status" label="Trạng Thái">
            <Select
              value={status || undefined}
              onChange={(e) => setStatus(e)}
              rules={[{ required: false, message: '' }]}
              placeholder="Chọn trạng thái lớp"
            >
              <Option value="active">Hoạt động</Option>
              <Option value="paused">Tạm dừng</Option>
              <Option value="closed">Đã đóng</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit">
          {id ? 'Sửa Thông Tin' : 'Thêm lớp học'}
        </Button>
        <Button
          type="ghost"
          style={{ marginLeft: '10px' }}
          onClick={() => navigate('/classes')}
        >
          Huỷ Bỏ
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddClass;
