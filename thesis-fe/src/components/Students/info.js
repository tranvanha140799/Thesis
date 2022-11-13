/* eslint-disable react-hooks/exhaustive-deps */
import { Col, Divider, Form, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar';

import 'react-big-calendar/lib/css/react-big-calendar.css';

import { classActions } from '../../redux/classSlice';
import { classStudentActions } from '../../redux/classStudentSlice';
import { studentActions } from '../../redux/studentSlice';
import { numberToVnd } from '../Common/utilities';

const { getClasses } = classActions;
const { getAllClassStudents, changeCurrentClassStudent } = classStudentActions;
const { getStudents, updateStudent } = studentActions;
const localizer = momentLocalizer(moment);

const Info = ({ id }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const classes = useSelector((state) => state.classesReducer.classes);
  const currentClassStudent = useSelector(
    (state) => state.classStudentReducer.currentClassStudent
  );
  const allClassStudents = useSelector(
    (state) => state.classStudentReducer.allClassStudents
  );
  const totalStudents = useSelector((state) => state.studentsReducer.totalStudents);
  const student = useSelector((state) =>
    id ? state.studentsReducer.students.find((p) => p.studentId === id) : null
  );
  const clasS = useSelector((state) =>
    currentClassStudent
      ? state.classesReducer.classes.find(
          (clasS) => clasS._id === currentClassStudent?.class_id
        )
      : null
  );
  // const course = useSelector((state) =>
  //   clasS
  //     ? state.coursesReducer.courses.find(
  //         (course) => course.classId === clasS?.class_id
  //       )
  //     : null
  // );
  const [_id, set_Id] = useState('');
  const [classId, setClassId] = useState('');
  const [excemptId, setExcemptId] = useState('');

  // Lấy thông tin học viên theo id
  useEffect(() => {
    if (totalStudents === 0) dispatch(getStudents());
    if (student) {
      set_Id(student._id);
      setClassId(student.classId);
      setExcemptId(student.excemptId);
    }
  }, [dispatch, student]);

  // Lấy thông tin đóng học phí của học viên hiện tại
  useEffect(() => {
    if (!allClassStudents.length) dispatch(getAllClassStudents());
    if (student && allClassStudents.length)
      dispatch(changeCurrentClassStudent(student.classId, student._id));
  }, [id, student, allClassStudents.length]);

  // Lấy thông tin lớp học mà học viên đang theo học
  useEffect(() => {
    if (!classes.length) dispatch(getClasses());
  }, [classes.length]);

  // Lấy thông tin khoá học mà học viên đang theo học
  // useEffect(() => {
  //   if (!courses.length) dispatch(getCourses());
  // }, [courses.length]);

  const onFinish = async (values) => {
    const std = {
      ...student,
      classId,
      excemptId,
    };
    if (typeof id === 'string') await dispatch(updateStudent(_id, std));

    navigate('/students');
  };

  return currentClassStudent._id ? (
    <Row>
      <Col span={24} style={{ display: 'flex', justifyContent: 'space-around' }}>
        <h3>
          Lớp đang học:{' '}
          <Link to={`/classes/${clasS?.classId}`}>{clasS?.name || '---'}</Link>
        </h3>
        <h3>Sĩ số: {clasS?.numberOfStudents || '---'}</h3>
      </Col>
      <Col span={24} style={{ display: 'flex', justifyContent: 'space-around' }}>
        <h3>
          Học phí đã nộp: {numberToVnd(currentClassStudent?.paidTuitionFee || 0)}
        </h3>
        <h3>
          Ngày trả gần nhất:{' '}
          {moment(currentClassStudent?.lastestDatePaid).format('DD/MM/YYYY HH:mm')}
        </h3>
        <h3>
          Hạn trả phần còn lại:{' '}
          {moment(currentClassStudent?.expiryDatePayTuitionFee).format(
            'DD/MM/YYYY HH:mm'
          )}
        </h3>
      </Col>
      <Divider />
      <Col span={24}>
        <h3 style={{ textAlign: 'center' }}>Thời Khoá Biểu</h3>
        <Calendar
          localizer={localizer}
          defaultDate={new Date()}
          defaultView="month"
          style={{ height: '100vh' }}
          views={['month']}
          popup
          eventPropGetter={(event) => ({
            style: {
              backgroundColor: event.color,
            },
          })}
          tooltipAccessor={(event) => event.title}
          onSelectEvent={(event) => console.log(event)}
          // events={this.getPromotionEvents()}
          // titleAccessor={(event) =>
          //   event.gift_code ? `${event.title}: ${event.gift_code}` : event.title
          // }
        />
      </Col>
    </Row>
  ) : (
    <Row>
      <Col span={24} style={{ display: 'flex', justifyContent: 'space-around' }}>
        <h3>Học viên chưa tham gia khoá học nào!</h3>
      </Col>
    </Row>
  );
};

export default Info;
