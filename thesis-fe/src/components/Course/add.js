import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

import "antd/dist/antd.css";

import { Form, Input, Select, Button, DatePicker } from "antd";
import { useNavigate } from "react-router-dom";
import { courseAction } from "../../redux/courseSlice";

const { createCourse, updateCourse } = courseAction;
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

const AddCourse = ({ id }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const totalCourse = useSelector(
    (state) => state.courseReducer.totalCourse
  );
  const course = useSelector((state) =>
    id ? state.courseReducer.courses.find((p) => p._id === id) : null
  );
  const [_id, set_Id] = useState("");
  const [courseName, setCourseName] = useState("");
  const [tuitionFee, setTuitionFee] = useState("");
  const [desciption, setDesciption] = useState("");

  useEffect(() => {
    // if (totalStudents === 0) dispatch(getStudents());
    if (course) {
      set_Id(course._id);
      setCourseName(course.name);
      setTuitionFee(course.studentQuantity);
      setDesciption(course.status);
    }
  }, [dispatch, course]);

  const onFinish = async (values) => {
    const course = {
      name: courseName,
      tuitionFee,
      desciption,
    };
    if (typeof id === "string") await dispatch(updateCourse(_id, course));
    else await dispatch(createCourse(course));

    navigate("/courses");
  };

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select
        style={{
          width: 70,
        }}
      >
        <Option value="84">+84</Option>
        <Option value="1">+1</Option>
      </Select>
    </Form.Item>
  );

  return (
    <Form
      {...formItemLayout}
      form={form}
      name="register"
      onFinish={onFinish}
      initialValues={{
        residence: [],
        prefix: "84",
      }}
      fields={[
        { name: ["courseName"], value: courseName },
        { name: ["tuitionFee"], value: tuitionFee },
        { name: ["desciption"], value: desciption },
      ]}
      scrollToFirstError
    >
      {/* <Form.Item
        name="studentId"
        label="Mã Lớp học"
        tooltip="Lớp học có mã là..?"
        onChange={(e) => setClassId(e.target.value)}
        rules={[
          {
            required: true,
            message: "Hãy nhập mã lớp học!",
            whitespace: false,
          },
        ]}
      >
        <Input />
      </Form.Item> */}

      <Form.Item
        name="classname"
        label="Tên lớp học"
        tooltip="lớp học tên là..?"
        onChange={(e) => setCourseName(e.target.value)}
        rules={[
          {
            required: true,
            message: "Hãy nhập tên lớp học!",
            whitespace: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="tuitionFee"
        label="Tên lớp học"
        tooltip="lớp học tên là..?"
        onChange={(e) => setTuitionFee(e.target.value)}
        rules={[
          {
            required: true,
            message: "Hãy nhập tên lớp học!",
            whitespace: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item name="desciption" label="Mô tả lớp học">
        <Input />
      </Form.Item>
      <Form.Item {...tailFormItemLayout}>
        <Button type="primary" htmlType="submit">
          {id ? "Sửa Thông Tin" : "Thêm lớp học"}
        </Button>
        <Button
          type="ghost"
          style={{ marginLeft: "10px" }}
          onClick={() => navigate("/classes")}
        >
          Huỷ Bỏ
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddCourse;
