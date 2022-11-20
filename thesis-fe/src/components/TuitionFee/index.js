/* eslint-disable no-unused-expressions */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { Button, Col, Divider, Row, Select } from 'antd';

import { changeStringToNormalizeString, numberToVnd } from '../Common/utilities';
import { courseActions } from '../../redux/courseSlice';
import { classActions } from '../../redux/classSlice';
import { classStudentActions } from '../../redux/classStudentSlice';
import { studentActions } from '../../redux/studentSlice';
import { EditOutlined } from '@ant-design/icons';

const { getCourses } = courseActions;
const { getClasses } = classActions;
const { getAllClassStudents } = classStudentActions;
const { getStudents } = studentActions;

const TuitionFeePage = ({ id }) => {
  const dispatch = useDispatch();

  const allClassStudents = useSelector(
    (state) => state.classStudentReducer.allClassStudents
  ); //
  const currentClassStudents = useSelector(
    (state) => state.classStudentReducer.currentClassStudents
  ); //
  const newestCurrentClassStudent = useSelector(
    (state) => state.classStudentReducer.newestCurrentClassStudent
  ); //
  const currentStudent = useSelector((state) =>
    id ? state.studentReducer.students.find((p) => p.studentId === id) : null
  ); //
  const currentExempt = useSelector((state) =>
    currentStudent
      ? state.exemptReducer.exempts.find((p) => p._id === currentStudent?.exemptId)
      : null
  ); //
  const currentClass = useSelector((state) =>
    newestCurrentClassStudent
      ? state.classReducer.classes.find(
          (clasS) => clasS._id === newestCurrentClassStudent?.class_id
        )
      : null
  ); //
  const currentCourse = useSelector((state) =>
    currentClass
      ? state.courseReducer.courses.find(
          (course) => course._id === currentClass?.courseId
        )
      : null
  ); //
  const courses = useSelector((state) => state.courseReducer.courses); //
  const classes = useSelector((state) => state.classReducer.classes); // Redux
  const students = useSelector((state) => state.studentReducer.students); //

  const [listCourses, setListCurrentCourses] = useState([]); //
  const [listClasses, setListCurrentClasses] = useState([]); // Danh sách hiển thị để chọn
  const [listStudents, setListCurrentStudents] = useState([]); //
  const [selectedCourse, setSelectedCourse] = useState({}); //
  const [selectedClass, setSelectedClass] = useState({}); // Giá trị đang chọn của khung tìm kiếm
  const [selectedStudent, setSelectedStudent] = useState({}); //
  // const [dataTable, setDataTable] = useState([]); // Dữ liệu bảng
  const [finalTuitionFee, setFinalTuitionFee] = useState(-1);
  const [remainTuitionFee, setRemainTuitionFee] = useState(-1);

  useEffect(() => {
    if (!courses.length) dispatch(getCourses());
    if (!classes.length) dispatch(getClasses());
    if (!students.length) dispatch(getStudents());
    if (!allClassStudents.length) dispatch(getAllClassStudents());
  }, []);

  useEffect(() => {
    if (courses.length) setListCurrentCourses(courses);
  }, [courses.length]);

  useEffect(() => {
    if (classes.length) setListCurrentClasses(classes);
  }, [classes.length]);

  useEffect(() => {
    if (students.length) setListCurrentStudents(students);
  }, [students.length]);

  // // Tạo lại data cho table mỗi khi thay đổi đk lọc
  // useEffect(() => {
  //   makeDataTable();
  // }, [currentCourse?._id, currentClass?._id, selectedStudent?._id]);

  // // Lấy toàn bộ học viên phù hợp với điều kiện lọc => data cho table
  // const makeDataTable = () => {
  //   let data = [];
  //   if (selectedStudent._id) data.push(selectedStudent);
  //   else if (currentClass._id) data = listStudents.length ? [...listStudents] : [];
  //   else if (currentCourse._id)
  //     listClasses.map((clasS) =>
  //       data.push(...students.filter((student) => student.classId === clasS._id))
  //     );
  //   else data.push(...students);

  //   setDataTable(data);
  // };

  // Thay đổi khoá học
  const handleChangeCourse = (value) => {
    const dataCourse = courses.find((course) => course?._id === value);
    setSelectedCourse(dataCourse);

    if (value) {
      const dataClasses = classes.filter(
        (clasS) => clasS.courseId === dataCourse?._id
      );
      setListCurrentClasses(dataClasses);
      setSelectedClass({});
      setSelectedStudent({});
    }
  };

  const clearCourse = () => {
    setListCurrentCourses(courses);
    setListCurrentClasses(classes);
    setListCurrentStudents(students);
    setSelectedCourse({});
    setSelectedClass({});
    setSelectedStudent({});
  };

  // Thay đổi lớp học
  const handleChangeClass = (value) => {
    const dataClass = classes.find((clasS) => clasS?._id === value);
    setSelectedClass(dataClass);

    if (value) {
      const dataCourses = courses.find((course) => course._id === dataClass?.courseId);
      setSelectedCourse(dataCourses);
    }

    if (value) {
      const dataStudents = students.filter(
        (student) => student.classId === dataClass?._id
      );
      setListCurrentStudents(dataStudents);
      setSelectedStudent({});
    }
  };

  const clearClass = () => {
    setListCurrentClasses(classes);
    setListCurrentStudents(students);
    setSelectedClass({});
    setSelectedStudent({});
  };

  // Thay đổi học viên
  const handleChangeStudent = (value) => {
    const dataStudent = students.find((student) => student?._id === value);
    setSelectedStudent(dataStudent);

    if (value) {
      const dataClasses = classes.find((clasS) => clasS._id === dataStudent?.classId);
      setSelectedClass(dataClasses);

      const dataCourses = courses.find(
        (course) => course._id === dataClasses?.courseId
      );
      setSelectedCourse(dataCourses);
    }
  };

  const clearStudent = () => {
    setSelectedStudent({});
    setListCurrentStudents(students);
  };

  // Xử lý nhập liệu trong các ô tìm kiếm
  const handleSearch = (searchStr, arr) => {
    if (searchStr) {
      const str = changeStringToNormalizeString(searchStr).toLowerCase();
      const temp = arr.filter(
        (p) =>
          p._id.includes(str) ||
          changeStringToNormalizeString(p.name || p.fullname)
            .toLowerCase()
            .includes(str)
      );
      arr === listCourses
        ? setListCurrentCourses(temp)
        : arr === listClasses
        ? setListCurrentClasses(temp)
        : arr === listStudents
        ? setListCurrentStudents(temp)
        : null;
    } else {
      arr === listCourses
        ? setListCurrentCourses(courses)
        : arr === listClasses
        ? setListCurrentClasses(classes)
        : arr === listStudents
        ? setListCurrentStudents(students)
        : null;
    }
  };

  return (
    <>
      <h3>Tìm kiếm học viên:</h3>
      <Row>
        <Col span={6}>
          <Select
            allowClear
            onClear={clearCourse}
            showSearch
            placeholder="Khoá học"
            onChange={handleChangeCourse}
            onSearch={(e) => handleSearch(e, listCourses)}
            style={{ width: '100%' }}
            value={selectedCourse?._id || undefined}
            filterOption={false}
          >
            {listCourses?.map((d) => (
              <Select.Option key={d?._id} value={d?._id}>
                {d?.name}
              </Select.Option>
            ))}
          </Select>
        </Col>
        <Col span={6}>
          <Select
            allowClear
            onClear={clearClass}
            showSearch
            placeholder="Lớp học"
            onChange={handleChangeClass}
            onSearch={(e) => handleSearch(e, listClasses)}
            style={{ width: '100%' }}
            value={selectedClass?._id || undefined}
            filterOption={false}
          >
            {listClasses?.map((d) => (
              <Select.Option key={d?._id} value={d?._id}>
                {d?.name}
              </Select.Option>
            ))}
          </Select>
        </Col>
        <Col span={6}>
          <Select
            allowClear
            onClear={clearStudent}
            showSearch
            placeholder="Học viên"
            onChange={handleChangeStudent}
            onSearch={(e) => handleSearch(e, listStudents)}
            style={{ width: '100%' }}
            value={selectedStudent?._id || undefined}
            filterOption={false}
          >
            {listStudents?.map((d) => (
              <Select.Option key={d?._id} value={d?._id}>
                {d?.fullname}
              </Select.Option>
            ))}
          </Select>
        </Col>
      </Row>
      <Divider />
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
            {remainTuitionFee && (
              <Button icon={<EditOutlined />} style={{ border: 'none' }} />
            )}
          </h3>
        </Col>
        <Col span={24} style={{ display: 'flex', justifyContent: 'space-around' }}>
          <h3>
            Học phí đã nộp:{' '}
            {numberToVnd(newestCurrentClassStudent?.paidTuitionFee || 0)}
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
            {moment(newestCurrentClassStudent?.expiryDatePayTuitionFee).format(
              'DD/MM/YYYY HH:mm'
            )}
          </h3>
        </Col>
      </Row>
    </>
  );
};

export default TuitionFeePage;
