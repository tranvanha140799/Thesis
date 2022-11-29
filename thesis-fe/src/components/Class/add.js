/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { Form, Input, Select, Button, DatePicker, Col, Row, InputNumber } from 'antd';

import 'antd/dist/antd.css';

import FormItem from 'antd/es/form/FormItem';
import { classScheduleActions } from '../../redux/classScheduleSlice';
import { classActions } from '../../redux/classSlice';
import { courseActions } from '../../redux/courseSlice';
import { scheduleActions } from '../../redux/scheduleSlice';

const {
  getAllClassSchedules,
  changeCurrentClassSchedules,
  resetCurrentClassSchedule,
} = classScheduleActions;
const { createClass, getClasses, updateClass } = classActions;
const { getCourses } = courseActions;
const { getSchedules } = scheduleActions;
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
  const schedules = useSelector((state) => state.scheduleReducer.schedules);
  const allClassSchedules = useSelector(
    (state) => state.classScheduleReducer.allClassSchedules
  );
  const currentClassSchedules = useSelector(
    (state) => state.classScheduleReducer.currentClassSchedules
  );
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
  const [selectedSchedules, setSelectedSchedules] = useState([]);

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
      setSelectedSchedules(clasS.schedules);
    }
  }, [dispatch, clasS]);

  useEffect(() => {
    if (!courses.length) dispatch(getCourses());
  }, []);

  useEffect(() => {
    if (!schedules.length) dispatch(getSchedules());
  }, [schedules.length]);

  useEffect(() => {
    if (!allClassSchedules.length) dispatch(getAllClassSchedules());
    if (clasS && allClassSchedules.length)
      dispatch(changeCurrentClassSchedules(clasS._id));

    return () => dispatch(resetCurrentClassSchedule());
  }, [id, clasS, allClassSchedules.length]);

  useEffect(() => {
    if (
      schedules.length &&
      !selectedSchedules.length &&
      currentClassSchedules.length
    ) {
      let temp = [];
      currentClassSchedules.forEach((record) => {
        const foundSchedule = schedules.find(
          (schedule) => schedule._id === record?.scheduleId
        );
        if (foundSchedule._id) temp.push(foundSchedule);
      });
      setSelectedSchedules(temp);
    }
  }, [currentClassSchedules]);

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
      schedules: selectedSchedules,
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
        { name: ['dateStart'], value: moment(dateStart) },
        { name: ['dateEnd'], value: moment(dateEnd) },
        { name: ['studentQuantity'], value: studentQuantity },
        { name: ['status'], value: status },
        { name: ['discount'], value: discount },
        { name: ['courseId'], value: courseId },
        { name: ['schedules'], value: selectedSchedules },
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
          <Form.Item name="discount" label="Giảm giá (%)">
            <InputNumber
              min={0}
              value={discount}
              style={{ width: '100%' }}
              placeholder="Giảm % học phí"
              onChange={(e) => setDiscount(e)}
            />
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
          <Form.Item name="schedules" label="Khung giờ học">
            <Select
              mode="multiple"
              value={selectedSchedules}
              onChange={(e) => setSelectedSchedules(e)}
              placeholder="Chọn khung giờ học"
            >
              {schedules.map((schedule) => (
                <Option value={schedule?._id} key={schedule?._id}>
                  {schedule?.name}
                </Option>
              ))}
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
