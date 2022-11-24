/* eslint-disable no-unused-expressions */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
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
  Table,
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
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
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
  const user = useSelector((state) => state.authReducer.authData.result);
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
  const [finalTuitionFee, setFinalTuitionFee] = useState(-1); // Học phí
  const [remainTuitionFee, setRemainTuitionFee] = useState(-1); // Học phí còn lại
  const [payAmount, setPayAmount] = useState(0); // Tiền nộp lần này (nhập)
  const [payAmountType, setPayAmountType] = useState(''); // Kiểu nộp hp (toàn bộ/một phần)
  const [isShowModalTotal, setIsShowModalTotal] = useState(false);
  const [isShowModalPartial, setIsShowModalPartial] = useState(false);
  const [dataSource, setDataSource] = useState([]);

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

  // Tính tiền học phí sau cùng-------
  useEffect(() => {
    if (currentClass && currentStudent && Object.keys(newestCurrentClassStudent)) {
      if (
        currentClass._id === newestCurrentClassStudent.class_id ||
        currentStudent._id === newestCurrentClassStudent.student_id
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
        else setFinalTuitionFee(currentCourse?.tuitionFee);
      }
    }
  }, [newestCurrentClassStudent, currentClass, currentStudent]);

  useEffect(() => {
    if (finalTuitionFee !== -1 && remainTuitionFee === -1)
      setRemainTuitionFee(
        finalTuitionFee <= newestCurrentClassStudent?.paidTuitionFee
          ? 0
          : finalTuitionFee - newestCurrentClassStudent?.paidTuitionFee
      );
  }, [finalTuitionFee, remainTuitionFee]);
  // ---------------------------------

  // Nạp lại dataSource cho table
  useEffect(() => {
    if (!dataSource.length && currentClassStudents.length) {
      let temp = [...currentClassStudents];
      temp = temp
        .filter((record) => record?.payTime !== 0)
        .sort((a, b) => a?.payTime - b?.payTime);

      setDataSource(temp);
    }
  }, [currentClassStudents]);

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
      setDataSource([]);
    }
  };

  const clearCourse = () => {
    setListCurrentCourses(courses);
    setListCurrentClasses(classes);
    setListCurrentStudents(students);
    setSelectedCourse({});
    setSelectedClass({});
    setSelectedStudent({});
    setDataSource([]);
  };

  // Thay đổi lớp học
  const handleChangeClass = (value) => {
    const dataClass = classes.find((clasS) => clasS?._id === value);
    setSelectedClass(dataClass);
    if (listClasses.length === classes.length)
      setListCurrentClasses(
        classes.filter((clasS) => clasS.courseId === dataClass.courseId)
      );

    if (value) {
      const dataCourses = courses.find((course) => course._id === dataClass?.courseId);
      setSelectedCourse(dataCourses);
      if (listCourses.length === courses.length)
        setListCurrentCourses(
          courses.filter((course) => course._id === dataCourses._id)
        );

      const dataStudents = students.filter(
        (student) => student.classId === dataClass?._id
      );
      setListCurrentStudents(dataStudents);
      setSelectedStudent({});
      setDataSource([]);
    }
  };

  const clearClass = () => {
    setSelectedClass({});
    setSelectedStudent({});
    setDataSource([]);
  };

  // Thay đổi học viên
  const handleChangeStudent = (value) => {
    const dataStudent = students.find((student) => student?._id === value);
    setSelectedStudent(dataStudent);
    if (listStudents.length === students.length)
      setListCurrentStudents(
        students.filter((student) => student.classId === dataStudent.classId)
      );

    if (value) {
      const dataClasses = classes.find((clasS) => clasS._id === dataStudent?.classId);
      setSelectedClass(dataClasses);
      if (listClasses.length === classes.length)
        setListCurrentClasses(
          classes.filter((clasS) => clasS.courseId === dataClasses.courseId)
        );

      const dataCourses = courses.find(
        (course) => course._id === dataClasses?.courseId
      );
      setSelectedCourse(dataCourses);
      if (listCourses.length === courses.length)
        setListCurrentCourses(
          courses.filter((course) => course._id === dataCourses._id)
        );

      setFinalTuitionFee(-1);
      setRemainTuitionFee(-1);
      setDataSource([]);
    }
  };

  const clearStudent = () => {
    setSelectedStudent({});
    setDataSource([]);
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

  // Nộp học phí
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
      payAmount: payAmountType === 'total' ? remainTuitionFee : payAmount,
      payDate: new Date().toISOString(),
      expiryDatePayTuitionFee:
        payAmountType === 'total'
          ? ''
          : newestCurrentClassStudent?.expiryDatePayTuitionFee,
    };

    dispatch(
      createClassStudent(payload, {
        onSuccess: () => {
          showNotification('success', 'Nộp học phí thành công.');
          setRemainTuitionFee(remainTuitionFee - payAmount);
        },
        onError: () => showNotification('error', 'Nộp học phí thất bại!'),
      })
    );

    setRemainTuitionFee(-1);
    payAmountType === 'total'
      ? setIsShowModalTotal(false)
      : setIsShowModalPartial(false);
  };

  // In ra file PDF-------
  const renderItem = (doc, classStudents) => {
    doc.setFontSize(14);
    doc.text('TRUNG TÂM TIẾNG ANH........', 10, 10);
    doc.text(`Ngày: ${moment().format('DD-MM-YYYY HH:mm').toString()}`, 18, 18);

    doc.setFontSize(20);
    doc.text('BÁO CÁO THU HỌC PHÍ', 105, 40, null, null, 'center');

    doc.setFontSize(12);
    doc.text(`Học viên: ${currentStudent?.fullname}`, 18, 70);
    doc.text(`Lớp: ${currentClass?.name}`, 200, 70, null, null, 'right');
    doc.text(`Số điện thoại: ${currentStudent?.phoneNumber}`, 18, 80);
    doc.text(`Học phí: ${numberToVnd(finalTuitionFee)}`, 200, 80, null, null, 'right');
    doc.text(`Địa chỉ: ${currentStudent?.address}`, 18, 90);

    let arr = classStudents
      .filter((record) => record.payTime !== 0)
      .map((record) => [
        record?.payTime.toString(),
        numberToVnd(record?.payAmount).toString(),
        moment(record?.payDate).format('DD/MM/YYYY HH:mm').toString(),
      ]);

    autoTable(doc, {
      head: [['Lần Nộp', 'Số Tiền Nộp', 'Ngày Nộp']],
      body: [...arr],
      foot: [
        [
          '',
          '',
          `Tổng tiền đã nộp: ${numberToVnd(
            newestCurrentClassStudent?.paidTuitionFee
          )}`,
        ],
      ],
      // styles
      theme: 'grid',
      margin: { top: 100, left: 18 },
      columnStyles: {
        0: { halign: 'center' },
        1: { halign: 'right' },
        2: { halign: 'center' },
      },
      headStyles: {
        halign: 'center',
        fontStyle: 'bold',
        font: 'Arial',
        lineWidth: 0.1,
        lineColor: [236, 238, 239],
      },
      bodyStyles: {
        font: 'Arial',
      },
      footStyles: { fontStyle: 'bold', font: 'Arial', halign: 'right' },
    });

    doc.text(`Người lập báo cáo`, 35, 250);
    doc.text(`${user.name}`, 40, 280);
  };

  // Xuất file PDF
  const exportToPDF = () => {
    if (!currentClassStudents.length) {
      showNotification('warning', 'Không có thông tin nộp học phí của học viên!');
      return;
    }

    const doc = new jsPDF({
      orientation: 'portrait',
      // format: [chieudai1don(currentClassStudents), 31.5],
    });

    doc.addFont('/fonts/arial.ttf', 'Arial', 'normal');
    doc.setDisplayMode('fullpage', 'continuous', 'FullScreen');
    doc.getFontList();
    doc.setFont('Arial', 'normal');
    doc.setFontSize(18);

    renderItem(doc, currentClassStudents);
    doc.save(`${currentStudent?.fullname}_BAO_CAO_THU_HOC_PHI.pdf`);
  };
  // ---------------------

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
        <Col span={6} style={{ display: 'flex' }}>
          <Button
            type="primary"
            shape="round"
            onClick={exportToPDF}
            disabled={!currentStudent || !newestCurrentClassStudent.payTime}
          >
            Tải file PDF
          </Button>
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
                  Trạng thái:{' '}
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
                    {remainTuitionFee === finalTuitionFee ? (
                      <>
                        Chưa nộp <ExclamationCircleOutlined />
                      </>
                    ) : remainTuitionFee ? (
                      <>
                        Đang nộp <ClockCircleOutlined />
                      </>
                    ) : (
                      <>
                        Đã nộp đủ <CheckCircleOutlined />
                      </>
                    )}
                  </h3>
                  {/* {remainTuitionFee ? (
                    <Button icon={<EditOutlined />} style={{ border: 'none' }} />
                  ) : null} */}
                </h3>
              </Col>
              <Col
                span={24}
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

              <Divider />

              <Col span={24}>
                <Row>
                  <Col span={12} style={{ display: 'flex' }}>
                    <h3>Nộp học phí:</h3>
                    {remainTuitionFee ? (
                      <Select
                        placeholder="Chọn hình thức nộp"
                        style={{ width: '260px', margin: '0 10px' }}
                        value={payAmountType || undefined}
                        onChange={setPayAmountType}
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
                  </Col>
                  {payAmountType === 'partial' && (
                    <Col span={12} style={{ display: 'flex' }}>
                      <Form
                        form={form}
                        name="payAmountForm"
                        onFinish={(value) => console.log(value)}
                        scrollToFirstError
                      >
                        <Row>
                          <Col span={16}>
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
                              onChange={(e) => setPayAmount(Number(e.target.value))}
                            >
                              <InputNumber
                                style={{ width: '70%' }}
                                value={payAmount}
                              />{' '}
                              VND
                            </Form.Item>
                          </Col>
                          <Col span={8}>
                            <Form.Item
                              style={{
                                display: 'flex',
                                justifyContent: 'space-around',
                              }}
                            >
                              <Button
                                type="primary"
                                onClick={() =>
                                  !payAmount
                                    ? showNotification(
                                        'warning',
                                        'Nhập số tiền học phí!'
                                      )
                                    : setIsShowModalPartial(true)
                                }
                              >
                                Ok
                              </Button>
                            </Form.Item>
                          </Col>
                        </Row>
                      </Form>
                    </Col>
                  )}
                </Row>

                <Divider />

                <Row>
                  <Table
                    style={{ width: '100%' }}
                    dataSource={dataSource}
                    rowKey="_id"
                    pagination={{ pageSize: 20 }}
                  >
                    <Table.Column title="Lần Nộp" dataIndex="payTime" />
                    <Table.Column
                      title="Số Tiền Nộp"
                      dataIndex="payAmount"
                      render={(text) => numberToVnd(text)}
                    />
                    <Table.Column
                      title="Thời Gian"
                      dataIndex="payDate"
                      render={(text) => moment(text).format('DD/MM/YYYY HH:mm')}
                    />
                  </Table>
                </Row>
              </Col>
            </Row>
          </>
        ) : (
          <Row>
            <Col span={24} style={{ display: 'flex', justifyContent: 'space-around' }}>
              <h3>Hãy chọn một học viên!</h3>
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
      <Modal
        title="Nộp một phần học phí"
        cancelText="Huỷ"
        open={isShowModalPartial}
        onOk={pay}
        onCancel={() => setIsShowModalPartial(false)}
      >
        Xác nhận nộp học phí cho học viên {currentStudent?.fullname}?
      </Modal>
    </>
  );
};

export default TuitionFeePage;
