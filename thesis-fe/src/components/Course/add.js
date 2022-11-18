import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import 'antd/dist/antd.css';

import { Form, Input, Button, InputNumber } from 'antd';
import { useNavigate } from 'react-router-dom';
import { courseActions } from '../../redux/courseSlice';

const { getCourses, createCourse, updateCourse } = courseActions;

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

const AddCourse = ({ id }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const totalCourses = useSelector((state) => state.courseReducer.totalCourses);
  const course = useSelector((state) =>
    id ? state.courseReducer.courses.find((p) => p.courseId === id) : null
  );
  const [_id, set_Id] = useState('');
  const [courseId, setCourseId] = useState('');
  const [courseName, setCourseName] = useState('');
  const [tuitionFee, setTuitionFee] = useState(0);
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (totalCourses === 0) dispatch(getCourses());
    if (course) {
      set_Id(course._id);
      setCourseId(course.courseId);
      setCourseName(course.name);
      setTuitionFee(course.tuitionFee);
      setDescription(course.description);
    }
  }, [dispatch, course]);

  const onFinish = async (values) => {
    const course = {
      courseId,
      name: courseName,
      tuitionFee,
      description,
    };
    if (typeof id === 'string') await dispatch(updateCourse(_id, course));
    else await dispatch(createCourse(course));

    navigate('/courses');
  };

  return (
    <Form
      {...formItemLayout}
      form={form}
      name="register"
      onFinish={onFinish}
      fields={[
        { name: ['courseId'], value: courseId },
        { name: ['courseName'], value: courseName },
        // { name: ['tuitionFee'], value: Number(tuitionFee) },
        { name: ['desciption'], value: description },
      ]}
      scrollToFirstError
    >
      <Form.Item
        name="courseId"
        label="Mã khoá học"
        tooltip="Khoá học có mã là..?"
        onChange={(e) => setCourseId(e.target.value)}
        rules={[
          {
            required: true,
            message: 'Hãy nhập mã khoá học!',
            whitespace: false,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="courseName"
        label="Tên khoá học"
        tooltip="Khoá học tên là..?"
        onChange={(e) => setCourseName(e.target.value)}
        rules={[
          {
            required: true,
            message: 'Hãy nhập tên khoá học!',
            whitespace: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="tuitionFee"
        label="Học phí"
        tooltip="Khoá học có học phí là..?"
        onChange={(e) => setTuitionFee(Number(e.target.value))}
      >
        <InputNumber style={{ width: '200px' }} value={tuitionFee} /> VND
      </Form.Item>
      <Form.Item
        name="desciption"
        label="Mô tả khoá học"
        onChange={(e) => setDescription(e.target.value)}
      >
        <Input />
      </Form.Item>
      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit">
          {id ? 'Sửa Thông Tin' : 'Thêm khoá học'}
        </Button>
        <Button
          type="ghost"
          style={{ marginLeft: '10px' }}
          onClick={() => navigate('/courses')}
        >
          Huỷ Bỏ
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddCourse;
