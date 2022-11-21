/* eslint-disable no-unused-expressions */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { Link } from 'react-router-dom';
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  InputNumber,
  Modal,
  Row,
  Select,
} from 'antd';

import {
  changeStringToNormalizeString,
  numberToVnd,
  showNotification,
} from '../Common/utilities';
import { courseActions } from '../../redux/courseSlice';
import { classActions } from '../../redux/classSlice';
import { classStudentActions } from '../../redux/classStudentSlice';
import { studentActions } from '../../redux/studentSlice';
import { EditOutlined } from '@ant-design/icons';
import { exemptActions } from '../../redux/exemptSlice';

const { getCourses } = courseActions;
const { getClasses } = classActions;
const {
  getAllClassStudents,
  createClassStudent,
  changeCurrentClassStudents,
  resetCurrentClassStudent,
} = classStudentActions;
const { getExempts } = exemptActions;
const { getStudents } = studentActions;

const TuitionFeePage = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const [selectedStudent, setSelectedStudent] = useState({});
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
    selectedStudent
      ? state.studentReducer.students.find((p) => p._id === selectedStudent._id)
      : null
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
  const exempts = useSelector((state) => state.exemptReducer.exempts); //
  const students = useSelector((state) => state.studentReducer.students); //

  const [listCourses, setListCurrentCourses] = useState([]); //
  const [listClasses, setListCurrentClasses] = useState([]); // Danh sách hiển thị để chọn
  const [listStudents, setListCurrentStudents] = useState([]); //
  const [selectedCourse, setSelectedCourse] = useState({}); //
  const [selectedClass, setSelectedClass] = useState({}); // Giá trị đang chọn của khung tìm kiếm
  // const [dataTable, setDataTable] = useState([]); // Dữ liệu bảng
  const [_id, set_Id] = useState('');
  const [classId, setClassId] = useState('');
  const [excemptId, setExcemptId] = useState('');
  const [finalTuitionFee, setFinalTuitionFee] = useState(-1);
  const [remainTuitionFee, setRemainTuitionFee] = useState(-1);
  const [payAmount, setPayAmount] = useState(0);
  const [payAmountType, setPayAmountType] = useState('');
  const [isShowModalTotal, setIsShowModalTotal] = useState(false);

  useEffect(() => {
    if (!courses.length) dispatch(getCourses());
    if (!classes.length) dispatch(getClasses());
    if (!students.length) dispatch(getStudents());
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

  // --------------- Info.js -----------------
  // Lấy thông tin học viên theo id
  useEffect(() => {
    if (currentStudent) {
      set_Id(currentStudent._id);
      setClassId(currentStudent.classId);
      setExcemptId(currentStudent.excemptId);
    }
  }, [dispatch, currentStudent]);

  // Lấy thông tin đóng học phí của học viên hiện tại
  useEffect(() => {
    if (!allClassStudents.length) dispatch(getAllClassStudents());
    if (currentStudent && allClassStudents.length)
      dispatch(changeCurrentClassStudents(currentStudent.classId, currentStudent._id));

    return () => dispatch(resetCurrentClassStudent());
  }, [selectedStudent, currentStudent, allClassStudents.length]);

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
  // -----------------------------------------

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

  // Nộp toàn bộ học phí còn lại
  const pay = () => {
    const payload = {
      class_id: newestCurrentClassStudent?.class_id,
      student_id: newestCurrentClassStudent?.student_id,
      classId: newestCurrentClassStudent?.classId,
      paidTuitionFee:
        payAmountType === 'total'
          ? finalTuitionFee
          : newestCurrentClassStudent?.paidTuitionFee + payAmount,
      payTime: newestCurrentClassStudent?.payTime + 1,
      payAmount: remainTuitionFee,
      payDate: new Date().toISOString(),
      expiryDatePayTuitionFee:
        payAmountType === 'total'
          ? ''
          : newestCurrentClassStudent?.expiryDatePayTuitionFee,
    };
    console.log(payload);

    dispatch(
      createClassStudent(payload, {
        onSuccess: () => showNotification('success', 'Nộp học phí thành công.'),
        onError: () => showNotification('error', 'Nộp học phí thất bại!'),
      })
    );
    setIsShowModalTotal(false);
  };

  return (
    <>
      <h3>Tìm kiếm học viên:</h3>
      <Row>
        <Col span={6} style={{ display: 'flex' }}>
          <h4 style={{ lineHeight: '200%', marginRight: '10px' }}>Khoá học:</h4>
          <Select
            allowClear
            onClear={clearCourse}
            showSearch
            placeholder="Khoá học"
            onChange={handleChangeCourse}
            onSearch={(e) => handleSearch(e, listCourses)}
            style={{ width: '75%' }}
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
        <Col span={6} style={{ display: 'flex' }}>
          <h4 style={{ lineHeight: '200%', marginRight: '10px' }}>Lớp học:</h4>
          <Select
            allowClear
            onClear={clearClass}
            showSearch
            placeholder="Lớp học"
            onChange={handleChangeClass}
            onSearch={(e) => handleSearch(e, listClasses)}
            style={{ width: '75%' }}
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
        <Col span={6} style={{ display: 'flex' }}>
          <h4 style={{ lineHeight: '200%', marginRight: '10px' }}>Học viên:</h4>
          <Select
            allowClear
            onClear={clearStudent}
            showSearch
            placeholder="Học viên"
            onChange={handleChangeStudent}
            onSearch={(e) => handleSearch(e, listStudents)}
            style={{ width: '75%' }}
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
      <Card hoverable={false}>
        {newestCurrentClassStudent._id ? (
          <>
            <Row>
              <Col
                span={24}
                style={{ display: 'flex', justifyContent: 'space-around' }}
              >
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
                  {remainTuitionFee ? (
                    <Button icon={<EditOutlined />} style={{ border: 'none' }} />
                  ) : null}
                </h3>
              </Col>
              <Col
                span={12}
                style={{ display: 'flex', justifyContent: 'space-around' }}
              >
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
                    ? moment(newestCurrentClassStudent?.payDate).format(
                        'DD/MM/YYYY HH:mm'
                      )
                    : 'Chưa nộp lần nào'}
                </h3>
                <h3>
                  Hạn nộp phần còn lại:{' '}
                  {newestCurrentClassStudent?.expiryDatePayTuitionFee
                    ? moment(
                        newestCurrentClassStudent?.expiryDatePayTuitionFee
                      ).format('DD/MM/YYYY HH:mm')
                    : '---'}
                </h3>
              </Col>
              <Col span={12}>
                <Row style={{ display: 'flex' }}>
                  <h3>Nộp học phí:</h3>
                  {remainTuitionFee ? (
                    <Select
                      placeholder="Chọn hình thức nộp"
                      style={{ width: '250px', margin: '0 10px' }}
                      value={payAmountType || undefined}
                      onChange={(e) => setPayAmountType(e)}
                    >
                      <Select.Option value="partial">Nộp một phần</Select.Option>
                      <Select.Option value="total">Nộp toàn bộ</Select.Option>
                    </Select>
                  ) : (
                    <h3 style={{ marginLeft: '5px' }}>
                      Học viên đã hoàn tất đóng học phí.
                    </h3>
                  )}
                  {payAmountType === 'total' && (
                    <Button onClick={() => setIsShowModalTotal(true)} type="primary">
                      Nộp
                    </Button>
                  )}
                </Row>
                {payAmountType === 'partial' && (
                  <>
                    <Divider />
                    <Form
                      form={form}
                      name="payAmountForm"
                      onFinish={(value) => console.log(value)}
                      scrollToFirstError
                    >
                      <Row>
                        <Col span={12}>
                          <Form.Item
                            style={{ display: 'flex-start' }}
                            name="payAmount"
                            label="Số tiền"
                            tooltip="Số tiền nộp..?"
                            rules={[
                              {
                                required: true,
                                message: 'Nhập số tiền!',
                              },
                            ]}
                            onChange={(e) => console.log(typeof e.target.value)}
                          >
                            <InputNumber style={{ width: '80%' }} value={payAmount} />{' '}
                            VND
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            style={{ display: 'flex', justifyContent: 'space-around' }}
                          >
                            <Button type="primary" htmlType="submit">
                              Ok
                            </Button>
                            <Button
                              type="ghost"
                              style={{ marginLeft: '10px' }}
                              onClick={() => console.log('/students')}
                            >
                              Huỷ Bỏ
                            </Button>
                          </Form.Item>
                        </Col>
                      </Row>
                    </Form>
                  </>
                )}
              </Col>
            </Row>
          </>
        ) : (
          <Row>
            <Col span={24} style={{ display: 'flex', justifyContent: 'space-around' }}>
              <h3>Không có thông tin!</h3>
            </Col>
          </Row>
        )}
      </Card>
      <Modal
        title="Nộp toàn bộ học phí"
        cancelText="Huỷ"
        open={isShowModalTotal}
        onOk={pay}
        onCancel={() => setIsShowModalTotal(false)}
      >
        Xác nhận nộp toàn bộ học phí còn lại của lớp học này?
      </Modal>
    </>
  );
};

export default TuitionFeePage;
