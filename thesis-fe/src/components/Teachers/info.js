/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Col, Divider, InputNumber, Row, Select, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { numberToVnd, showNotification } from '../Common/utilities';

import { classActions } from '../../redux/classSlice';
import { classTeacherActions } from '../../redux/classTeacherSlice';
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
const { getAllClassTeachers, changeCurrentClassTeachers, resetCurrentClassTeacher } =
  classTeacherActions;
const { getAllPaySalaries, changeCurrentPaySalaries, resetCurrentPaySalary } =
  paySalaryActions;
const { getSalaryFactors } = salaryFactorActions;
const { getTeachers, updateTeacher } = teacherActions;
const localizer = momentLocalizer(moment);

const Info = ({ id }) => {
  const dispatch = useDispatch();

  const allClassTeachers = useSelector(
    (state) => state.classTeacherReducer.allClassTeachers
  );
  const currentClassTeachers = useSelector(
    (state) => state.classTeacherReducer.currentClassTeachers
  );
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
  const currentTeacher = useSelector((state) =>
    id ? state.teacherReducer.teachers.find((p) => p.teacherId === id) : null
  );
  const classes = useSelector((state) => state.classReducer.classes);
  const currentSalaryFactor = useSelector((state) =>
    currentTeacher
      ? state.salaryFactorReducer.salaryFactors.find(
          (p) => p._id === currentTeacher?.salaryFactorId
        )
      : null
  );
  const [dataSource, setDataSource] = useState([]);
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

  useEffect(() => {
    if (!allClassTeachers.length) dispatch(getAllClassTeachers());
    if (currentTeacher && allClassTeachers.length)
      dispatch(changeCurrentClassTeachers(currentTeacher._id));

    return () => dispatch(resetCurrentClassTeacher());
  }, [id, currentTeacher, allClassTeachers.length]);

  // Lấy thông tin khoá học mà giảng viên đang giảng dạy
  useEffect(() => {
    if (!totalCourses) dispatch(getCourses());
  }, [totalCourses]);

  // Lấy thông tin hệ số lương của giảng viên
  useEffect(() => {
    if (!salaryFactors.length) dispatch(getSalaryFactors());
  }, [salaryFactors.length]);

  // Nạp lại thông tin lớp dạy - giảng viên
  useEffect(() => {
    if (classes.length && !dataSource.length && currentClassTeachers.length) {
      let temp = [];
      currentClassTeachers.forEach((record) => {
        const foundClass = classes.find((clasS) => clasS._id === record?.classId);
        if (foundClass._id) temp.push(foundClass);
      });
      setDataSource(temp);
    }
  }, [currentClassTeachers]);

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

  console.log(dataSource);
  return (
    <Row>
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
      <Divider />
      <Col span={24}>
        <h3>Các lớp tham gia: {currentClassTeachers.length}</h3>
        <Table rowKey="_id" dataSource={dataSource}>
          <Table.Column title="Lớp" dataIndex="name" />
          <Table.Column title="Sĩ Số" dataIndex="numberOfStudents" />
          <Table.Column
            title="Trạng Thái"
            dataIndex="status"
            render={(text) =>
              text === 'active'
                ? 'Hoạt động'
                : text === 'paused'
                ? 'Tạm dừng'
                : text === 'closed'
                ? 'Đã đóng'
                : '---'
            }
          />
        </Table>
      </Col>
      {/* <Col span={24}>
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
  );

  // <Row>
  //   <Col span={24} style={{ display: 'flex', justifyContent: 'space-around' }}>
  //     <h3>Giảng viên chưa giảng dạy lớp học nào!</h3>
  //   </Col>
  // </Row>
};

export default Info;
