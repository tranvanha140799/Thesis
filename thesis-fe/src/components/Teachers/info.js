/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Col, Divider, InputNumber, Row, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { numberToVnd, showNotification } from '../Common/utilities';

import { classActions } from '../../redux/classSlice';
import { courseActions } from '../../redux/courseSlice';
import { paySalaryActions } from '../../redux/paySalarySlice';
import { salaryFactorActions } from '../../redux/salaryFactorSlice';
import { teacherActions } from '../../redux/teacherSlice';
import {
  CheckOutlined,
  CloseCircleOutlined,
  EditOutlined,
  MoneyCollectOutlined,
} from '@ant-design/icons';

const { getCourses } = courseActions;
const { getClasses } = classActions;
const { getAllPaySalaries, changeCurrentPaySalaries, resetCurrentPaySalary } =
  paySalaryActions;
const { getSalaryFactors } = salaryFactorActions;
const { getTeachers, updateTeacher } = teacherActions;
const localizer = momentLocalizer(moment);

const Info = ({ id }) => {
  const dispatch = useDispatch();

  const totalCourses = useSelector((state) => state.courseReducer.totalCourses);
  const totalClasses = useSelector((state) => state.classReducer.totalClasses);
  const salaryFactors = useSelector(
    (state) => state.salaryFactorReducer.salaryFactors
  );
  const allPaySalaries = useSelector((state) => state.paySalaryReducer.allPaySalaries);
  const latestPaySalaryTime = useSelector(
    (state) => state.paySalaryReducer.latestPaySalaryTime
  );
  const latestPaidSalary = useSelector(
    (state) => state.paySalaryReducer.latestPaidSalary
  );
  const totalTeachers = useSelector((state) => state.teacherReducer.totalTeachers);
  const currentStudent = useSelector((state) =>
    id ? state.studentReducer.students.find((p) => p.studentId === id) : null
  );
  const currentTeacher = useSelector((state) =>
    id ? state.teacherReducer.teachers.find((p) => p.teacherId === id) : null
  );
  const currentClass = useSelector((state) =>
    currentTeacher
      ? state.classReducer.classes.find(
          (clasS) => clasS._id === currentTeacher?.classId
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
  const currentSalaryFactor = useSelector((state) =>
    currentTeacher
      ? state.salaryFactorReducer.salaryFactors.find(
          (p) => p._id === currentTeacher?.salaryFactorId
        )
      : null
  );
  const currentExempt = useSelector((state) =>
    currentStudent
      ? state.exemptReducer.exempts.find((p) => p._id === currentStudent?.exemptId)
      : null
  );
  const [finalTuitionFee, setFinalTuitionFee] = useState(-1);
  const [remainTuitionFee, setRemainTuitionFee] = useState(-1);
  const [isEditContractSalary, setIsEditContractSalary] = useState(false);
  const [editingContractSalary, setEditingContractSalary] = useState(0);
  const [isEditSalaryFactorId, setIsEditSalaryFactorId] = useState(false);
  const [editingSalaryFactorId, setEditingSalaryFactorId] = useState('');

  useEffect(() => {
    if (totalTeachers === 0) dispatch(getTeachers());
  }, [dispatch, currentTeacher]);

  // Lấy thông tin lĩnh lương của giảng viên hiện tại
  useEffect(() => {
    if (!allPaySalaries.length) dispatch(getAllPaySalaries());
    if (currentTeacher && allPaySalaries.length)
      dispatch(changeCurrentPaySalaries(currentTeacher._id));

    return () => dispatch(resetCurrentPaySalary());
  }, [id, currentTeacher, allPaySalaries.length]);

  // Lấy thông tin lớp học mà giảng viên đang giảng dạy
  useEffect(() => {
    if (!totalClasses) dispatch(getClasses());
  }, [totalClasses]);

  // Lấy thông tin khoá học mà giảng viên đang giảng dạy
  useEffect(() => {
    if (!totalCourses) dispatch(getCourses());
  }, [totalCourses]);

  // Lấy thông tin hệ số lương của giảng viên
  useEffect(() => {
    if (!salaryFactors.length) dispatch(getSalaryFactors());
  }, [salaryFactors.length]);

  // Tính tiền học phí sau cùng
  if (
    finalTuitionFee === -1 &&
    currentClass &&
    latestPaySalaryTime &&
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
      finalTuitionFee <= latestPaySalaryTime?.paidTuitionFee
        ? 0
        : finalTuitionFee - latestPaySalaryTime?.paidTuitionFee
    );

  // Chỉnh sửa lương hợp đồng của giảng viên
  const handleChangeContractSalary = () => {
    const payload = {
      teacherId: currentTeacher?.teacherId,
      fullname: currentTeacher?.fullname,
      gender: currentTeacher?.gender,
      birthday: currentTeacher?.birthday,
      email: currentTeacher?.email,
      address: currentTeacher?.address,
      phoneNumber: currentTeacher?.phoneNumber,
      image: currentTeacher?.image,
      position: currentTeacher?.position,
      workType: currentTeacher?.workType,
      status: currentTeacher?.status,
      contractSalary: editingContractSalary,
      salaryFactorId: currentTeacher?.salaryFactorId,
      classId: currentTeacher?.classId,
    };

    dispatch(
      updateTeacher(currentTeacher?._id, payload, {
        onSuccess: () =>
          showNotification('success', 'Chỉnh sửa lương hợp đồng thành công.'),
        onError: () => showNotification('error', 'Chỉnh sửa lương hợp đồng thất bại.'),
      })
    );

    setIsEditContractSalary(false);
  };

  // Chỉnh sửa hệ số lương của giảng viên
  const handleChangeSalaryFactor = () => {
    const payload = {
      teacherId: currentTeacher?.teacherId,
      fullname: currentTeacher?.fullname,
      gender: currentTeacher?.gender,
      birthday: currentTeacher?.birthday,
      email: currentTeacher?.email,
      address: currentTeacher?.address,
      phoneNumber: currentTeacher?.phoneNumber,
      image: currentTeacher?.image,
      position: currentTeacher?.position,
      workType: currentTeacher?.workType,
      status: currentTeacher?.status,
      contractSalary: currentTeacher?.contractSalary,
      salaryFactorId: editingSalaryFactorId,
      classId: currentTeacher?.classId,
    };

    dispatch(
      updateTeacher(currentTeacher?._id, payload, {
        onSuccess: () =>
          showNotification('success', 'Chỉnh sửa hệ số lương thành công.'),
        onError: () => showNotification('error', 'Chỉnh sửa hệ số lương thất bại.'),
      })
    );

    setIsEditSalaryFactorId(false);
  };

  return currentClass?._id ? (
    <Row>
      <Col span={24} style={{ display: 'flex', justifyContent: 'space-around' }}>
        <h3>
          Khoá:{' '}
          <Link to={`/courses/${currentCourse?.courseId}`}>
            {currentCourse?.name || '---'}
          </Link>
        </h3>
        <h3>
          Lớp đang dạy:{' '}
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
          Trạng thái lớp:{' '}
          <h3
            style={{
              display: 'inline',
              color:
                currentClass?.status === 'closed'
                  ? 'red'
                  : currentClass?.status === 'paused'
                  ? 'orange'
                  : currentClass?.status === 'active'
                  ? 'green'
                  : 'black',
            }}
          >
            {currentClass?.status === 'closed'
              ? 'Đã kết thúc'
              : currentClass?.status === 'paused'
              ? 'Tạm dừng'
              : currentClass?.status === 'active'
              ? 'Đang hoạt động'
              : ''}
          </h3>
        </h3>
      </Col>
      <Col span={24} style={{ display: 'flex', justifyContent: 'space-around' }}>
        <h3>
          Lương hợp đồng:{' '}
          {isEditContractSalary ? (
            <>
              <InputNumber
                min={0}
                step={1000}
                style={{ width: '100px' }}
                defaultValue={currentTeacher?.contractSalary}
                onChange={setEditingContractSalary}
              />{' '}
              VND
            </>
          ) : (
            numberToVnd(currentTeacher?.contractSalary || 0)
          )}
          {isEditContractSalary ? (
            <>
              <Button
                type="link"
                icon={<CheckOutlined />}
                style={{ border: 'none' }}
                onClick={handleChangeContractSalary}
              />
              <Button
                type="link"
                danger
                icon={<CloseCircleOutlined />}
                style={{ border: 'none' }}
                onClick={() => setIsEditContractSalary(false)}
              />
            </>
          ) : (
            <Button
              type="link"
              icon={<EditOutlined />}
              style={{ border: 'none' }}
              onClick={() => setIsEditContractSalary(true)}
            />
          )}
        </h3>

        <h3>
          {isEditSalaryFactorId ? 'Hệ số lương & phụ cấp: ' : 'Hệ số lương: '}
          {isEditSalaryFactorId ? (
            <>
              <Select
                style={{ width: '180px' }}
                value={editingSalaryFactorId}
                onChange={setEditingSalaryFactorId}
              >
                {salaryFactors.map((p) => (
                  <Select.Option key={p._id} value={p._id}>
                    {p.factor} - {numberToVnd(p.allowance)}
                  </Select.Option>
                ))}
              </Select>
            </>
          ) : (
            currentSalaryFactor?.factor || 0
          )}
          {!isEditSalaryFactorId ? (
            <> - phụ cấp: {numberToVnd(currentSalaryFactor?.allowance) || `0 ₫`}</>
          ) : null}
          {isEditSalaryFactorId ? (
            <>
              <Button
                type="link"
                icon={<CheckOutlined />}
                style={{ border: 'none' }}
                onClick={handleChangeSalaryFactor}
              />
              <Button
                type="link"
                danger
                icon={<CloseCircleOutlined />}
                style={{ border: 'none' }}
                onClick={() => setIsEditSalaryFactorId(false)}
              />
            </>
          ) : (
            <Button
              type="link"
              icon={<EditOutlined />}
              style={{ border: 'none' }}
              onClick={() => {
                setEditingSalaryFactorId(currentSalaryFactor?._id);
                setIsEditSalaryFactorId(true);
              }}
            />
          )}
        </h3>

        <h3>
          Lương tháng gần nhất:{' '}
          {latestPaidSalary?.periodSalary
            ? numberToVnd(latestPaidSalary?.periodSalary)
            : 'Không có thông tin'}
        </h3>

        <h3>
          Ứng lương tháng này:{' '}
          {latestPaySalaryTime?.isAdvancePayment
            ? numberToVnd(latestPaySalaryTime?.advancePayment)
            : 'Chưa ứng'}
          {!latestPaySalaryTime?.isAdvancePayment ? (
            <Button
              type="link"
              icon={<MoneyCollectOutlined />}
              style={{ border: 'none' }}
              onClick={() => console.log('Alo alo')}
            />
          ) : null}
        </h3>
      </Col>
      {/* <Divider />
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
        />
      </Col> */}
    </Row>
  ) : (
    <Row>
      <Col span={24} style={{ display: 'flex', justifyContent: 'space-around' }}>
        <h3>Giảng viên chưa giảng dạy lớp học nào!</h3>
      </Col>
    </Row>
  );
};

export default Info;
