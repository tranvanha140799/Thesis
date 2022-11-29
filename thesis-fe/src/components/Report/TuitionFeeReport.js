/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';
import * as XLSX from 'xlsx';
import { Button, Col, DatePicker, Row, Select, Table } from 'antd';
import { VerticalAlignBottomOutlined } from '@ant-design/icons';

import { numberToVnd } from '../Common/utilities';
import { classActions } from '../../redux/classSlice';
import { classStudentActions } from '../../redux/classStudentSlice';
import { studentActions } from '../../redux/studentSlice';

const { getClasses } = classActions;
const { getAllClassStudents } = classStudentActions;
const { getStudents } = studentActions;

const tuitionFeeReport = () => {
  const dispatch = useDispatch();

  const classes = useSelector((state) => state.classReducer.classes);
  const students = useSelector((state) => state.studentReducer.students);
  const allClassStudents = useSelector(
    (state) => state.classStudentReducer.allClassStudents
  );
  const [selectedClass, setSelectedClass] = useState({});
  const [listClasses, setListCurrentClasses] = useState([]);
  const [period, setPeriod] = useState('');
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    if (!classes.length) dispatch(getClasses());
    if (!students.length) dispatch(getStudents());
  }, []);

  useEffect(() => {
    if (classes.length) setListCurrentClasses(classes);
  }, [classes.length]);

  useEffect(() => {
    if (!allClassStudents.length) dispatch(getAllClassStudents());
  }, [allClassStudents.length]);

  // Nạp lại dataSource cho table
  useEffect(() => {
    let temp = [...dataSource];

    // Nếu chưa có dữ liệu:
    if (!temp.length && allClassStudents.length) {
      temp = [...allClassStudents];
      temp = temp
        // .filter((record) => record?.payTime !== 0)
        .sort((a, b) => a?.payTime - b?.payTime);
    }

    // Lọc theo lớp
    if (selectedClass?._id)
      temp = temp.filter((record) => record?.class_id === selectedClass._id);

    // Lọc theo tháng
    if (period) {
      const tempDate = new Date(period);
      const firstDate = new Date(tempDate.getFullYear(), tempDate.getMonth(), 1);
      const lastDate = new Date(tempDate.getFullYear(), tempDate.getMonth() + 1, 0);
      temp = temp.filter(
        (record) =>
          new Date(record?.payDate) > firstDate && new Date(record?.payDate) < lastDate
      );
    }

    // Tìm student cho mỗi bản ghi
    if (temp.length)
      temp = temp.map((record) => ({
        ...record,
        student: students.find((st) => st._id === record.student_id),
      }));

    setDataSource(temp);
  }, [
    selectedClass,
    period,
    dataSource.length,
    allClassStudents.length,
    students.length,
  ]);

  const handleChangeClass = (value) => {
    const dataClass = classes.find((clasS) => clasS?._id === value);
    setSelectedClass(dataClass);

    if (value) setDataSource([]);
  };

  const clearClass = () => {
    setSelectedClass({});
    setDataSource([]);
  };

  const handleExportExcel = () => {
    const tempArr = [...dataSource];
    const data = tempArr.map((item, index) => [
      index + 1,
      item.student.fullname,
      item.payTime,
      item.payAmount,
      item.payDate ? moment(item.payDate).format('DD/MM/YYYY HH:mm') : '---',
      item.payTime === 0
        ? 'Chưa nộp'
        : item.expiryDatePayTuitionFee
        ? 'Đang nộp'
        : 'Đã nộp xong',
    ]);
    data.unshift([
      'STT',
      'HỌC VIÊN',
      'LẦN NỘP',
      'SỐ TIỀN NỘP',
      'THỜI GIAN NỘP',
      'TRẠNG THÁI',
    ]);
    const wb = XLSX.utils.book_new();
    const ws_name = 'SheetJS';

    /* make worksheet */
    const ws_data = data;
    const ws = XLSX.utils.aoa_to_sheet(ws_data);

    /* Add the worksheet to the workbook */
    XLSX.utils.book_append_sheet(wb, ws, ws_name);
    XLSX.writeFile(
      wb,
      `BAO_CAO_THU_HOC_PHI${selectedClass ? `_${selectedClass.name}` : ''}${
        period ? `_${moment(period).format('MM/YYYY')}` : ''
      }.xlsx`
    );
  };

  return (
    <>
      <h3>Lọc theo:</h3>
      <Row>
        <Col span={24} style={{ display: 'flex' }}>
          <h4 style={{ lineHeight: '200%', marginRight: '10px' }}>Lớp học:</h4>
          <Select
            allowClear
            onClear={clearClass}
            showSearch
            placeholder="Lớp học"
            onChange={handleChangeClass}
            style={{ width: '15%' }}
            value={selectedClass?._id || undefined}
            filterOption={false}
          >
            {listClasses?.map((d) => (
              <Select.Option key={d?._id} value={d?._id}>
                {d?.name}
              </Select.Option>
            ))}
          </Select>
          <h4 style={{ lineHeight: '200%', margin: '0 10px' }}>Tháng:</h4>
          <DatePicker
            picker="month"
            placeholder="Chọn tháng"
            format="MM/YYYY"
            style={{ width: '15%' }}
            onChange={(date, dateString) => setPeriod(date)}
          />
          <Button
            type="primary"
            shape="round"
            icon={<VerticalAlignBottomOutlined />}
            style={{ marginLeft: '10px' }}
            onClick={handleExportExcel}
          >
            Tải file excel
          </Button>
        </Col>
      </Row>
      <Table dataSource={dataSource} rowKey="_id">
        <Table.Column
          title="Học Viên"
          dataIndex="student"
          render={(text, record) => (
            <Link to={`/students/${record.student?.studentId}`}>
              {record?.student?.fullname}
            </Link>
          )}
        />
        <Table.Column
          title="Lần Nộp"
          dataIndex="payTime"
          align="right"
          render={(text) => (text === 0 ? 'Chưa nộp' : text)}
        />
        <Table.Column
          title="Số Tiền Nộp"
          dataIndex="payAmount"
          align="right"
          render={(text) => (text ? numberToVnd(text) : '---')}
        />
        <Table.Column
          title="Thời Gian"
          dataIndex="payDate"
          render={(text) => (text ? moment(text).format('DD/MM/YYYY HH:mm') : '---')}
        />
      </Table>
    </>
  );
};

export default tuitionFeeReport;
