/* eslint-disable no-unused-expressions */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import moment from 'moment';
import { useParams } from 'react-router-dom';
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
  // const currentClass = useSelector((state) =>
  //   currentTeacher
  //     ? state.classReducer.classes.find(
  //         (clasS) => clasS._id === currentTeacher?.classId
  //       )
  //     : null
  // ); //
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
  const [payAmount, setPayAmount] = useState(0); // Tiền trả lần này (nhập)
  const [payAmountType, setPayAmountType] = useState(''); // Kiểu trả lương (ứng/lĩnh)
  const [isShowModalTotal, setIsShowModalTotal] = useState(false);
  const [isShowModalPartial, setIsShowModalPartial] = useState(false);
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    if (!courses.length) dispatch(getCourses());
    if (!classes.length) dispatch(getClasses());
    if (!teachers.length) dispatch(getTeachers());
  }, []);

  useEffect(() => courses.length && setListCurrentCourses(courses), [courses.length]);
  useEffect(() => classes.length && setListCurrentClasses(classes), [classes.length]);
  useEffect(
    () => teachers.length && setListCurrentTeachers(teachers),
    [teachers.length]
  );

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

  // Nạp lại dataSource cho table
  useEffect(() => {
    if (!dataSource.length && currentPaySalaries.length) {
      let temp = [...currentPaySalaries];
      temp = temp.sort(
        (a, b) => new Date(b?.datePaidSalary) - new Date(a?.datePaidSalary)
      );

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

      const dataTeachers = teachers.filter(
        (teacher) => teacher.classId === dataClass?._id
      );
      setListCurrentTeachers(dataTeachers);
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
      periodSalary:
        currentTeacher?.contractSalary * currentSalaryFactor?.factor +
        currentSalaryFactor?.allowance, // Continue...
      paidSalary:
        payAmountType === 'total'
          ? currentTeacher?.contractSalary * currentSalaryFactor?.factor +
            currentSalaryFactor?.allowance
          : payAmount,
      isPaidSalary: !!(payAmountType === 'total'),
      datePaidSalary: new Date().toISOString(),
      isAdvancePayment: !(payAmountType === 'total'),
      advancePayment:
        payAmountType === 'total' && latestPaidSalary?.advancePayment
          ? latestPaidSalary?.advancePayment || 0
          : payAmount,
      teacherId: currentTeacher?._id,
    };

    dispatch(
      createPaySalary(payload, {
        onSuccess: () => {
          showNotification(
            'success',
            `Lưu thông tin ${
              payAmountType === 'total' ? 'lĩnh' : 'ứng'
            } lương thành công.`
          );
          setPayAmount(0);
          setPayAmountType('');
        },
        onError: () =>
          showNotification(
            'error',
            `Lưu thông tin ${
              payAmountType === 'total' ? 'lĩnh' : 'ứng'
            } lương thất bại!`
          ),
      })
    );

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
    doc.text('BÁO CÁO CHI LƯƠNG', 105, 40, null, null, 'center');

    doc.setFontSize(12);
    doc.text(`Họ và tên: ${currentTeacher?.fullname}`, 18, 70);
    doc.text(
      `Chức vụ: ${
        currentTeacher?.position === 'teacher'
          ? 'Giảng viên'
          : currentTeacher?.position === 'tutor'
          ? 'Trợ giảng'
          : ''
      }`,
      18,
      80
    );
    doc.text(`Số điện thoại: ${currentTeacher?.phoneNumber}`, 18, 90);
    doc.text(
      `Lương hợp đồng: ${numberToVnd(currentTeacher?.contractSalary)}`,
      200,
      70,
      null,
      null,
      'right'
    );
    doc.text(
      `Hệ số lương: x${currentSalaryFactor?.factor}`,
      200,
      80,
      null,
      null,
      'right'
    );
    doc.text(
      `Phụ cấp: ${numberToVnd(currentSalaryFactor?.allowance)}`,
      200,
      90,
      null,
      null,
      'right'
    );
    doc.text(`Địa chỉ: ${currentTeacher?.address}`, 18, 100);

    let arr = [...currentPaySalaries];
    arr = arr
      .sort((a, b) => new Date(b?.datePaidSalary) - new Date(a?.datePaidSalary))
      .map((record) => [
        record?.period,
        record?.isAdvancePayment ? 'Ứng lương' : 'Lĩnh lương',
        record?.isAdvancePayment
          ? numberToVnd(record?.advancePayment).toString()
          : numberToVnd(record?.paidSalary - record?.advancePayment).toString(),
        moment(record?.datePaidSalary).format('DD/MM/YYYY HH:mm').toString(),
      ]);

    autoTable(doc, {
      head: [['Kỳ Lương', 'Hình Thức', 'Số Tiền', 'Ngày Nhận']],
      body: [...arr],
      // foot: [
      //   [
      //     '',
      //     '',
      //     `Tổng tiền đã nhận: ${numberToVnd(latestPaidSalary?.paidTuitionFee)}`,
      //   ],
      // ],
      // styles
      theme: 'grid',
      margin: { top: 110, left: 18 },
      columnStyles: {
        0: { halign: 'center' },
        1: { halign: 'center' },
        2: { halign: 'center' },
        3: { halign: 'center' },
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
    doc.save(`${currentTeacher?.fullname}_BAO_CAO_CHI_LUONG.pdf`);
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
            disabled={!currentTeacher || !latestPaidSalary.datePaidSalary}
          >
            Tải file PDF
          </Button>
        </Col>
      </Row>

      <Divider />

      <Card hoverable={false}>
        {currentTeacher?.status === 'active' ? (
          <>
            <Row>
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
              </Col>

              <Divider />

              <Col span={24}>
                <Row>
                  <Col span={12} style={{ display: 'flex' }}>
                    <h3>Lĩnh lương:</h3>
                    <Select
                      allowClear
                      placeholder="Chọn hình thức lĩnh lương"
                      style={{ width: '260px', margin: '0 10px' }}
                      value={payAmountType || undefined}
                      onChange={setPayAmountType}
                    >
                      {!latestPaySalaryTime?.isAdvancePayment && (
                        <Select.Option value="partial">Ứng lương</Select.Option>
                      )}
                      <Select.Option value="total">Lĩnh toàn bộ</Select.Option>
                    </Select>

                    {
                      // new Date().getDate() > 10 &&
                      // new Date().getDate() < 15 &&
                      // payAmountType === 'total' ? (
                      <Button
                        shape="round"
                        type="primary"
                        onClick={() => setIsShowModalTotal(true)}
                        disabled={payAmountType !== 'total'}
                      >
                        Lĩnh lương
                      </Button>
                      // ) : (
                      //   <span style={{ color: 'red', lineHeight: '200%' }}>
                      //     Ngày lĩnh lương là 10 - 15 hàng tháng!
                      //   </span>
                      // )
                    }
                  </Col>
                  {!latestPaySalaryTime?.isAdvancePayment &&
                    // new Date().getDate() > 10 &&
                    // new Date().getDate() < 15 &&
                    payAmountType === 'partial' && (
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
                                tooltip="Số tiền lĩnh..?"
                                rules={[
                                  {
                                    required: true,
                                    message: 'Nhập số tiền!',
                                  },
                                ]}
                                onChange={(e) => setPayAmount(Number(e.target.value))}
                              >
                                <InputNumber
                                  min={1000}
                                  max={
                                    (currentTeacher?.contractSalary *
                                      currentSalaryFactor?.factor +
                                      currentSalaryFactor?.allowance) /
                                    2
                                  }
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
                                      ? showNotification('warning', 'Nhập số tiền!')
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
                    <h3 style={{ lineHeight: '200%', marginRight: '10px' }}>
                      Lịch sử lương:
                    </h3>
                  </Col>
                  <Table
                    style={{ width: '100%' }}
                    dataSource={dataSource}
                    rowKey="_id"
                    pagination={{ pageSize: 20 }}
                  >
                    <Table.Column title="Kỳ Lương" dataIndex="period" />
                    <Table.Column
                      title="Hình Thức"
                      dataIndex="isAdvancePayment"
                      render={(text) => (text ? 'Ứng lương' : 'Lĩnh lương')}
                    />
                    <Table.Column
                      title="Số Tiền"
                      dataIndex="advancePayment"
                      render={(text, record) =>
                        record?.isAdvancePayment
                          ? numberToVnd(text)
                          : numberToVnd(Number(record?.paidSalary) - Number(text))
                      }
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
