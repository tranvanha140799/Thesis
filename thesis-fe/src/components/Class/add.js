import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import 'antd/dist/antd.css';

import { Form, Input, Select, Button, DatePicker, Col } from 'antd';
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
  const [classname, setClassname] = useState('');
  const [studentQuantity, setStudentQuantity] = useState('');
  const [status, setStatus] = useState('');
  // const [formTeacherId, setFormTeacherId] = useState("");
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
      setClassname(clasS.name);
      setStudentQuantity(clasS.studentQuantity);
      setStatus(clasS.status);
      // setFormTeacherId(clasS.formTeacherId);
      setMinStu(clasS.minStu);
      setMaxStu(clasS.maxStu);
      setDiscount(clasS.discount);
      setDateStart(clasS.dateStart);
      setDateEnd(clasS.dateEnd);
      setCourseId(clasS.courseId);
    }
  }, [dispatch, clasS]);

  useEffect(() => {
    if (!courses.length) {
      dispatch(getCourses());
    }
  });

  const onFinish = async (values) => {
    const clasS = {
      classId,
      name: classname,
      studentQuantity,
      // formTeacherId,
      status,
      minStudents: minStu,
      maxStudents: maxStu,
      discount,
      dateStart,
      dateEnd,
      courseId,
    };
    if (typeof id === 'string') await dispatch(updateClass(_id, clasS));
    else await dispatch(createClass(clasS));

    navigate('/classes');
  };
  const onChange1 = (date, dateString) => {
    console.log(date, dateString);
  };

  return (
    <Form
      {...formItemLayout}
      form={form}
      name="register"
      onFinish={onFinish}
      fields={[
        { name: ['classId'], value: classId },
        { name: ['classname'], value: classname },
        { name: ['studentQuantity'], value: studentQuantity },
        { name: ['status'], value: status },
        { name: ['dateStart'], value: dateStart },
        { name: ['dateEnd'], value: dateEnd },
        { name: ['minStudents'], value: minStu },
        { name: ['maxStudents'], value: maxStu },
        { name: ['discount'], value: discount },
        { name: ['courseId'], value: courseId },
      ]}
      scrollToFirstError
    >
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
        <Input />
      </Form.Item>

      <Form.Item
        name="classname"
        label="Tên lớp học"
        tooltip="lớp học tên là..?"
        onChange={(e) => setClassname(e.target.value)}
        rules={[
          {
            required: true,
            message: 'Hãy nhập tên lớp học!',
            whitespace: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="minStudents"
        label="Số học sinh tối thiểu"
        tooltip="Số học sinh tối thiểu là..?"
        onChange={(e) => setMinStu(e.target.value)}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="maxStudents"
        label="Số học sinh tối đa"
        tooltip="Số học sinh tối đa là..?"
        onChange={(e) => setMaxStu(e.target.value)}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="discount"
        label="Giảm giá"
        tooltip="% giảm giá..?"
        onChange={(e) => setDiscount(e.target.value)}
      >
        <Input />
      </Form.Item>
      <Form.Item name="courseId" label="Khóa học">
        <Select value={courseId} onChange={(e) => setCourseId(e)} allowClear>
          {courses.map((course) => (
            <Select.Option key={course._id} value={course._id}>
              {course.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      {/* <Form.Item
        name="studentQuantity"
        label="số lượng học sinh"
        onChange={(e) => setStudentQuantity(e.target.value)}
        rules={[
          {
            required: true,
            message: "Nhập số lượng học sinh!",
          },
        ]}
      >
        <Input />
      </Form.Item> */}
      <FormItem label="Ngày bắt đầu" name="dateStart">
        <DatePicker
          // disabledDate={(current) =>
          //   current && current < moment().startOf("day")
          // }
          style={{ width: '100%' }}
          showTime={{
            format: 'HH:mm',
            minuteStep: 15,
            defaultValue: moment('21:00', 'HH:mm'),
            placeholder: 'Chọn giờ',
          }}
          format="DD-MM-YYYY HH:mm"
          placeholder="Chọn thời gian ..."
          onChange={(date, dateString) => {
            // setDateStart(dateString);
            console.log(new Date(dateString).toISOString());
          }}
        />
      </FormItem>
      <FormItem
        label="Ngày kết thúc"
        name="dateEnd"
        onChange={(e) => setDateEnd(e.target.value)}
      >
        <DatePicker
          // disabledDate={(current) => current && current < moment().startOf('day')}
          style={{ width: '100%' }}
          showTime={{
            format: 'HH:mm',
            minuteStep: 15,
            defaultValue: moment('21:00', 'HH:mm'),
            placeholder: 'Chọn giờ',
          }}
          format="DD-MM-YYYY HH:mm"
          placeholder="Chọn thời gian ..."
        />
      </FormItem>

      <Form.Item name="status" label="Trạng Thái">
        <Select
          value={status}
          onChange={(e) => {
            setStatus(e);
            console.log(e);
          }}
          rules={[
            {
              required: false,
              message: '',
            },
          ]}
        >
          <Option value="active">Hoạt động</Option>
          <Option value="paused">Tạm dừng</Option>
          <Option value="closed">Đã đóng</Option>
        </Select>
      </Form.Item>

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
