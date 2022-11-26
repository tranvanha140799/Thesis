/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Col, Divider, Form, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { EditOutlined } from '@ant-design/icons';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { numberToVnd } from '../Common/utilities';

import { classActions } from '../../redux/classSlice';
import { courseActions } from '../../redux/courseSlice';
import { exemptActions } from '../../redux/exemptSlice';
import { classStudentActions } from '../../redux/classStudentSlice';
import { studentActions } from '../../redux/studentSlice';

const { getCourses } = courseActions;
const { getClasses } = classActions;
const { getExempts } = exemptActions;
const { getAllClassStudents, changeCurrentClassStudents, resetCurrentClassStudent } =
  classStudentActions;
const { getStudents } = studentActions;
const localizer = momentLocalizer(moment);

const Info = ({ id }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const courses = useSelector((state) => state.courseReducer.courses);
  const classes = useSelector((state) => state.classReducer.classes);
  const exempts = useSelector((state) => state.exemptReducer.exempts);
  const allClassStudents = useSelector(
    (state) => state.classStudentReducer.allClassStudents
  );
  const newestCurrentClassStudent = useSelector(
    (state) => state.classStudentReducer.newestCurrentClassStudent
  );
  const totalStudents = useSelector((state) => state.studentReducer.totalStudents);
  const currentStudent = useSelector((state) =>
    id ? state.studentReducer.students.find((p) => p.studentId === id) : null
  );
  const currentExempt = useSelector((state) =>
    currentStudent
      ? state.exemptReducer.exempts.find((p) => p._id === currentStudent?.exemptId)
      : null
  );
  const currentClass = useSelector((state) =>
    newestCurrentClassStudent
      ? state.classReducer.classes.find(
          (clasS) => clasS._id === newestCurrentClassStudent?.class_id
        )
      : null
  );
  const currentCourse = useSelector((state) =>
    currentClass
      ? state.courseReducer.courses.find(
          (course) => course._id === currentClass?.courseId
        )
      : null
  );
  const [finalTuitionFee, setFinalTuitionFee] = useState(-1);
  const [remainTuitionFee, setRemainTuitionFee] = useState(-1);

  // Lấy thông tin học viên theo id
  useEffect(() => {
    if (totalStudents === 0) dispatch(getStudents());
  }, [dispatch, currentStudent]);

  // Lấy thông tin đóng học phí của học viên hiện tại
  useEffect(() => {
    if (!allClassStudents.length) dispatch(getAllClassStudents());
    if (currentStudent && allClassStudents.length)
      dispatch(changeCurrentClassStudents(currentStudent.classId, currentStudent._id));

    return () => dispatch(resetCurrentClassStudent());
  }, [id, currentStudent, allClassStudents.length]);

  // Lấy thông tin lớp học mà học viên đang theo học
  useEffect(() => {
    if (!classes.length) dispatch(getClasses());
  }, [classes.length]);

  // Lấy thông tin khoá học mà học viên đang theo học
  useEffect(() => {
    if (!courses.length) dispatch(getCourses());
  }, [courses.length]);

  // Lấy thông tin đối tượng miễn giảm của học viên
  useEffect(() => {
    if (!exempts.length) dispatch(getExempts());
  }, [exempts.length]);

  // Tính tiền học phí sau cùng
  if (
    finalTuitionFee === -1 &&
    currentClass &&
    newestCurrentClassStudent &&
    currentStudent &&
    currentCourse
  ) {
    if (currentClass?.discount && currentExempt?.percent)
      setFinalTuitionFee(
        currentCourse?.tuitionFee -
          (currentCourse?.tuitionFee *
            (currentClass?.discount + currentExempt?.percent)) /
            100
      );
    else if (currentClass?.discount)
      setFinalTuitionFee(
        currentCourse?.tuitionFee -
          (currentCourse?.tuitionFee * currentClass?.discount) / 100
      );
    else if (currentExempt?.percent)
      setFinalTuitionFee(
        currentCourse?.tuitionFee -
          (currentCourse?.tuitionFee * currentExempt?.percent) / 100
      );
  }

  // Tính tiền học phí còn lại
  if (finalTuitionFee !== -1 && remainTuitionFee === -1)
    setRemainTuitionFee(
      finalTuitionFee <= newestCurrentClassStudent?.paidTuitionFee
        ? 0
        : finalTuitionFee - newestCurrentClassStudent?.paidTuitionFee
    );

  return newestCurrentClassStudent._id ? (
    <Row>
      <Col span={24} style={{ display: 'flex', justifyContent: 'space-around' }}>
        <h3>
          Khoá học:{' '}
          <Link to={`/courses/${currentCourse?.courseId}`}>
            {currentCourse?.name || '---'}
          </Link>
        </h3>
        <h3>
          Lớp đang học:{' '}
          <Link to={`/classes/${currentClass?.classId}`}>
            {currentClass?.name || '---'}
          </Link>
        </h3>
        <h3>
          Sĩ số:{' '}
          {currentClass?.numberOfStudents
            ? `${currentClass?.numberOfStudents} học viên`
            : '--- học viên'}
        </h3>
        <h3>
          Học phí:{' '}
          {currentCourse?.tuitionFee ? (
            <>
              {finalTuitionFee !== -1 ? numberToVnd(finalTuitionFee) : '---'}
              {(currentClass?.discount || currentExempt?.percent) && (
                <h5 style={{ display: 'inline' }}>
                  {' '}
                  (-
                  {currentClass?.discount && currentExempt?.percent
                    ? `${currentClass?.discount + currentExempt?.percent}`
                    : currentClass?.discount
                    ? `${currentClass?.discount}`
                    : currentExempt?.percent
                    ? `${currentExempt?.percent}`
                    : ''}
                  %)
                </h5>
              )}
            </>
          ) : (
            '--- VND'
          )}
        </h3>
        <h3>
          Tình trạng:{' '}
          <h3
            style={{
              display: 'inline',
              color:
                remainTuitionFee === finalTuitionFee
                  ? 'red'
                  : remainTuitionFee
                  ? 'orange'
                  : 'green',
            }}
          >
            {remainTuitionFee === finalTuitionFee
              ? 'Chưa nộp'
              : remainTuitionFee
              ? 'Đang nộp'
              : 'Đã nộp đủ'}
          </h3>
          <Button
            icon={<EditOutlined />}
            style={{ border: 'none' }}
            onClick={() => navigate(`/tuition-fees/${currentStudent?.studentId}`)}
          />
        </h3>
      </Col>
      <Col span={24} style={{ display: 'flex', justifyContent: 'space-around' }}>
        <h3>
          Học phí đã nộp: {numberToVnd(newestCurrentClassStudent?.paidTuitionFee || 0)}
        </h3>
        <h3>
          Học phí còn lại:{' '}
          {remainTuitionFee !== -1 ? numberToVnd(remainTuitionFee) : '--- VND'}
        </h3>
        <h3>
          Ngày nộp gần nhất:{' '}
          {newestCurrentClassStudent?.payDate
            ? moment(newestCurrentClassStudent?.payDate).format('DD/MM/YYYY HH:mm')
            : 'Chưa nộp lần nào'}
        </h3>
        <h3>
          Hạn nộp phần còn lại:{' '}
          {newestCurrentClassStudent?.expiryDatePayTuitionFee
            ? moment(newestCurrentClassStudent?.expiryDatePayTuitionFee).format(
                'DD/MM/YYYY HH:mm'
              )
            : 'Đã nộp xong'}
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
