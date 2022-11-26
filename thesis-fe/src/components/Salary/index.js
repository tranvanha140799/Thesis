/* eslint-disable no-unused-expressions */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import moment from 'moment';
import { Link, useParams } from 'react-router-dom';
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
import { paySalaryActions } from '../../redux/paySalarySlice';
import { salaryFactorActions } from '../../redux/salaryFactorSlice';
import { teacherActions } from '../../redux/teacherSlice';

const { getClasses } = classActions;
const { getCourses } = courseActions;
const {
  getAllPaySalaries,
  createPaySalary,
  changeCurrentPaySalaries,
  resetCurrentPaySalary,
} = paySalaryActions;
const { getSalaryFactors } = salaryFactorActions;
const { getTeachers } = teacherActions;

const SalaryPage = () => {
  const dispatch = useDispatch();
  const { teacherId } = useParams();
  const [form] = Form.useForm();

  const [selectedTeacher, setSelectedTeacher] = useState({});
  const user = useSelector((state) => state.authReducer.authData.result);
  const allPaySalaries = useSelector((state) => state.paySalaryReducer.allPaySalaries); //
  const currentPaySalaries = useSelector(
    (state) => state.paySalaryReducer.currentPaySalaries
  ); //
  const latestPaidSalary = useSelector(
    (state) => state.paySalaryReducer.latestPaidSalary
  ); //
  const latestPaySalaryTime = useSelector(
    (state) => state.paySalaryReducer.latestPaySalaryTime
  );
  const currentTeacher = useSelector((state) =>
    selectedTeacher
      ? state.teacherReducer.teachers.find((p) => p._id === selectedTeacher._id)
      : null
  ); //
  const currentSalaryFactor = useSelector((state) =>
    currentTeacher
      ? state.salaryFactorReducer.salaryFactors.find(
          (p) => p._id === currentTeacher?.salaryFactorId
        )
      : null
  ); //
  const currentClass = useSelector((state) =>
    currentTeacher
      ? state.classReducer.classes.find(
          (clasS) => clasS._id === currentTeacher?.classId
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
  const salaryFactors = useSelector(
    (state) => state.salaryFactorReducer.salaryFactors
  ); //
  const teachers = useSelector((state) =>
    state.teacherReducer.teachers.filter((teacher) => teacher?.status === 'active')
  ); //

  const [listCourses, setListCurrentCourses] = useState([]); //
  const [listClasses, setListCurrentClasses] = useState([]); // Danh sách hiển thị để chọn
  const [listTeachers, setListCurrentTeachers] = useState([]); //
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
    if (!teachers.length) dispatch(getTeachers());
  }, []);

  useEffect(() => {
    if (courses.length) setListCurrentCourses(courses);
  }, [courses.length]);

  useEffect(() => {
    if (classes.length) setListCurrentClasses(classes);
  }, [classes.length]);

  useEffect(() => {
    if (teachers.length) setListCurrentTeachers(teachers);
  }, [teachers.length]);

  // Chọn giảng viên mặc định (navigate từ trang thông tin giảng viên)
  useEffect(() => {
    if (teacherId && courses.length && classes.length && teachers.length)
      handleChangeTeacher(
        teachers.find((teacher) => teacher?.teacherId === teacherId)?._id
      );
  }, [teacherId]);

  // --------------- Info.js -----------------
  // Lấy thông tin lĩnh lương của giảng viên hiện tại
  useEffect(() => {
    if (!allPaySalaries.length) dispatch(getAllPaySalaries());
    if (currentTeacher && allPaySalaries.length)
      dispatch(changeCurrentPaySalaries(currentTeacher._id));

    return () => dispatch(resetCurrentPaySalary());
  }, [selectedTeacher, currentTeacher, allPaySalaries.length]);

  // Lấy thông tin hệ số lương của giảng viên
  useEffect(() => {
    if (!salaryFactors.length) dispatch(getSalaryFactors());
  }, [salaryFactors.length]);

  // Tính tiền học phí sau cùng-------
  // useEffect(() => {
  //   if (currentClass && currentTeacher && Object.keys(latestPaidSalary)) {
  //     if (
  //       currentClass._id === latestPaidSalary.class_id ||
  //       currentTeacher._id === latestPaidSalary.student_id
  //     ) {
  //       if (currentClass?.discount && currentSalaryFactor?.percent)
  //         setFinalTuitionFee(
  //           currentCourse?.tuitionFee -
  //             (currentCourse?.tuitionFee *
  //               (currentClass?.discount + currentSalaryFactor?.percent)) /
  //               100
  //         );
  //       else if (currentClass?.discount)
  //         setFinalTuitionFee(
  //           currentCourse?.tuitionFee -
  //             (currentCourse?.tuitionFee * currentClass?.discount) / 100
  //         );
  //       else if (currentSalaryFactor?.percent)
  //         setFinalTuitionFee(
  //           currentCourse?.tuitionFee -
  //             (currentCourse?.tuitionFee * currentSalaryFactor?.percent) / 100
  //         );
  //       else setFinalTuitionFee(currentCourse?.tuitionFee);
  //     }
  //   }
  // }, [latestPaidSalary, currentClass, currentTeacher]);

  // useEffect(() => {
  //   if (finalTuitionFee !== -1 && remainTuitionFee === -1)
  //     setRemainTuitionFee(
  //       finalTuitionFee <= latestPaidSalary?.paidTuitionFee
  //         ? 0
  //         : finalTuitionFee - latestPaidSalary?.paidTuitionFee
  //     );
  // }, [finalTuitionFee, remainTuitionFee]);
  // ---------------------------------

  // Nạp lại dataSource cho table
  useEffect(() => {
    if (!dataSource.length && currentPaySalaries.length) {
      let temp = [...currentPaySalaries];
      temp = temp
        .filter((record) => record?.payTime !== 0)
        .sort((a, b) => a?.payTime - b?.payTime);

      setDataSource(temp);
    }
  }, [currentPaySalaries]);

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
      setSelectedTeacher({});
      setDataSource([]);
    }
  };

  const clearCourse = () => {
    setListCurrentCourses(courses);
    setListCurrentClasses(classes);
    setListCurrentTeachers(teachers);
    setSelectedCourse({});
    setSelectedClass({});
    setSelectedTeacher({});
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

      const dataStudents = teachers.filter(
        (student) => student.classId === dataClass?._id
      );
      setListCurrentTeachers(dataStudents);
      setSelectedTeacher({});
      setDataSource([]);
    }
  };

  const clearClass = () => {
    setSelectedClass({});
    setSelectedTeacher({});
    setDataSource([]);
  };

  // Thay đổi giảng viên
  const handleChangeTeacher = (value) => {
    const dataTeacher = teachers.find((teacher) => teacher?._id === value);
    setSelectedTeacher(dataTeacher);
    if (listTeachers.length === teachers.length)
      setListCurrentTeachers(
        teachers.filter((teacher) => teacher.classId === dataTeacher.classId)
      );

    if (dataTeacher.classId) {
      const dataClasses = classes.find((clasS) => clasS._id === dataTeacher?.classId);
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

  const clearTeacher = () => {
    setSelectedTeacher({});
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
        : arr === listTeachers
        ? setListCurrentTeachers(temp)
        : null;
    } else {
      arr === listCourses
        ? setListCurrentCourses(courses)
        : arr === listClasses
        ? setListCurrentClasses(classes)
        : arr === listTeachers
        ? setListCurrentTeachers(teachers)
        : null;
    }
  };

  // Lĩnh lương
  const pay = () => {
    const payload = {
      period: `${new Date().getMonth() + 1}/${new Date().getFullYear()}`,
      periodSalary: 0,
      paidSalary: 0,
      isPaidSalary: !!(payAmountType === 'total'),
      datePaidSalary: new Date().toISOString(),
      isAdvancePayment: !(payAmountType === 'total'),
      advancePayment: latestPaidSalary?.advancePayment,
      teacherId: currentTeacher?._id,
    };
    console.log(payload);

    // dispatch(
    //   createPaySalary(payload, {
    //     onSuccess: () => {
    //       showNotification('success', 'Lưu thông tin lĩnh lương thành công.');
    //       setRemainTuitionFee(remainTuitionFee - payAmount);
    //     },
    //     onError: () => showNotification('error', 'Lưu thông tin lĩnh lương thất bại!'),
    //   })
    // );

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
    doc.text(`Giảng viên: ${currentTeacher?.fullname}`, 18, 70);
    doc.text(`Lớp: ${currentClass?.name}`, 200, 70, null, null, 'right');
    doc.text(`Số điện thoại: ${currentTeacher?.phoneNumber}`, 18, 80);
    doc.text(`Học phí: ${numberToVnd(finalTuitionFee)}`, 200, 80, null, null, 'right');
    doc.text(`Địa chỉ: ${currentTeacher?.address}`, 18, 90);

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
        ['', '', `Tổng tiền đã nộp: ${numberToVnd(latestPaidSalary?.paidTuitionFee)}`],
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
    if (!currentPaySalaries.length) {
      showNotification('warning', 'Không có thông tin lĩnh lương của giảng viên!');
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

    renderItem(doc, currentPaySalaries);
    doc.save(`${currentTeacher?.fullname}_BAO_CAO_THU_HOC_PHI.pdf`);
  };
  // ---------------------

  return (
    <>
      <h3>Tìm kiếm giảng viên:</h3>
      <Row>
        <Col span={6} style={{ display: 'flex' }}>
          <h4 style={{ lineHeight: '200%', marginRight: '10px' }}>Khoá:</h4>
          <Select
            allowClear
            onClear={clearCourse}
            showSearch
            placeholder="Khoá"
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
          <h4 style={{ lineHeight: '200%', marginRight: '10px' }}>Lớp:</h4>
          <Select
            allowClear
            onClear={clearClass}
            showSearch
            placeholder="Lớp"
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
          <h4 style={{ lineHeight: '200%', marginRight: '10px' }}>Giảng viên:</h4>
          <Select
            allowClear
            onClear={clearTeacher}
            showSearch
            placeholder="Giảng viên"
            onChange={handleChangeTeacher}
            onSearch={(e) => handleSearch(e, listTeachers)}
            style={{ width: '75%' }}
            value={selectedTeacher?._id || undefined}
            filterOption={false}
          >
            {listTeachers?.map((d) => (
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
            disabled={!currentTeacher || !latestPaidSalary.payTime}
          >
            Tải file PDF
          </Button>
        </Col>
      </Row>

      <Divider />

      <Card hoverable={false}>
        {latestPaidSalary._id ? (
          <>
            <Row>
              {/* <Col
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
                  Lớp đang giảng dạy:{' '}
                  <Link to={`/classes/${currentClass?.classId}`}>
                    {currentClass?.name || '---'}
                  </Link>
                </h3>
                <h3>
                  Sĩ số:{' '}
                  {currentClass?.numberOfStudents
                    ? `${currentClass?.numberOfStudents} học viên`
                    : '--- giảng viên'}
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
              </Col> */}
              <Col
                span={24}
                style={{ display: 'flex', justifyContent: 'space-around' }}
              >
                <h3>
                  Kỳ lương hiện tại:{' '}
                  {`${new Date().getMonth() + 1}/${new Date().getFullYear()}`}
                </h3>
                <h3>
                  Lương hợp đồng: {numberToVnd(currentTeacher?.contractSalary || 0)}
                </h3>
                <h3>
                  Hệ số lương:{' '}
                  {currentSalaryFactor
                    ? `${currentSalaryFactor?.factor}`
                    : 'Không có thông tin'}
                </h3>
                <h3>
                  Phụ cấp:{' '}
                  {currentSalaryFactor
                    ? `${numberToVnd(currentSalaryFactor?.allowance)}`
                    : 'Không có thông tin'}
                </h3>
                <h3>
                  Lương tháng trước:{' '}
                  {latestPaidSalary?._id
                    ? numberToVnd(latestPaidSalary?.periodSalary)
                    : 'Không có thông tin'}
                </h3>
                <h3>
                  Ứng lương tháng này:{' '}
                  {latestPaySalaryTime?.isAdvancePayment
                    ? numberToVnd(latestPaySalaryTime?.advancePayment)
                    : 'Chưa ứng'}
                </h3>
              </Col>

              <Divider />

              <Col span={24}>
                <Row>
                  <Col span={12} style={{ display: 'flex' }}>
                    <h3>Lĩnh lương:</h3>
                    {remainTuitionFee ? (
                      <Select
                        placeholder="Chọn hình thức lĩnh"
                        style={{ width: '260px', margin: '0 10px' }}
                        value={payAmountType || undefined}
                        onChange={setPayAmountType}
                      >
                        {!latestPaySalaryTime?.isAdvancePayment && (
                          <Select.Option value="partial">Ứng lương</Select.Option>
                        )}
                        <Select.Option value="total">Lĩnh toàn bộ</Select.Option>
                      </Select>
                    ) : (
                      <h3 style={{ marginLeft: '5px' }}>
                        Học viên đã hoàn tất đóng học phí.
                      </h3>
                    )}
                    {payAmountType === 'total' && (
                      <Button onClick={() => setIsShowModalTotal(true)} type="primary">
                        Lĩnh lương
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
                  <Col span={8} style={{ display: 'flex' }}>
                    <h4 style={{ lineHeight: '200%', marginRight: '10px' }}>
                      Lịch sử lương:
                    </h4>
                    {/* <Select
                      allowClear
                      onClear={clearCourse}
                      showSearch
                      placeholder="Chọn kỳ lương"
                      onChange={handleChangeCourse}
                      onSearch={(e) => handleSearch(e, listCourses)}
                      style={{ width: '75%' }}
                      value={selectedCourse?._id || undefined}
                      filterOption={false}
                    ></Select> */}
                  </Col>
                  <Table
                    style={{ width: '100%' }}
                    dataSource={currentPaySalaries}
                    rowKey="_id"
                    pagination={{ pageSize: 20 }}
                  >
                    <Table.Column title="Kỳ Lương" dataIndex="period" />
                    <Table.Column
                      title="Lương Nhận"
                      dataIndex="paidSalary"
                      render={(text) => numberToVnd(text)}
                    />
                    <Table.Column
                      title="Ứng Trước"
                      dataIndex="advancePayment"
                      render={(text) => numberToVnd(text)}
                    />
                    <Table.Column
                      title="Ngày Nhận"
                      dataIndex="datePaidSalary"
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
              <h3>Hãy chọn một giảng viên!</h3>
            </Col>
          </Row>
        )}
      </Card>
      <Modal
        title="Lĩnh lương tháng này"
        cancelText="Huỷ"
        open={isShowModalTotal}
        onOk={pay}
        onCancel={() => setIsShowModalTotal(false)}
      >
        Xác nhận lĩnh toàn bộ lương tháng này?
      </Modal>
      <Modal
        title="Ứng trước lương"
        cancelText="Huỷ"
        open={isShowModalPartial}
        onOk={pay}
        onCancel={() => setIsShowModalPartial(false)}
      >
        Xác nhận ứng lương cho giảng viên {currentTeacher?.fullname}?
      </Modal>
    </>
  );
};

export default SalaryPage;
