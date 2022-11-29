/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import * as XLSX from 'xlsx';
import { Button, Col, DatePicker, Row, Select, Table } from 'antd';
import { VerticalAlignBottomOutlined } from '@ant-design/icons';

import { numberToVnd } from '../Common/utilities';
import { paySalaryActions } from '../../redux/paySalarySlice';
import { teacherActions } from '../../redux/teacherSlice';
import { Link } from 'react-router-dom';

const { getAllPaySalaries } = paySalaryActions;
const { getTeachers } = teacherActions;

const tuitionFeeReport = () => {
  const dispatch = useDispatch();

  const teachers = useSelector((state) => state.teacherReducer.teachers);
  const allPaySalaries = useSelector((state) => state.paySalaryReducer.allPaySalaries);
  const [period, setPeriod] = useState('');
  const [salaryType, setSalaryType] = useState('');
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    if (!teachers.length) dispatch(getTeachers());
  }, []);

  useEffect(() => {
    if (!allPaySalaries.length) dispatch(getAllPaySalaries());
  }, [allPaySalaries.length]);

  // Nạp lại dataSource cho table
  useEffect(() => {
    let temp = [...dataSource];

    // Nếu chưa có dữ liệu:
    if (!temp.length && allPaySalaries.length) {
      temp = [...allPaySalaries];
      temp = temp.sort(
        (a, b) => new Date(b?.datePaidSalary) - new Date(a?.datePaidSalary)
      );
    }

    // Lọc theo tháng
    if (period) temp = temp.filter((record) => record?.period === period);

    // Lọc theo hình thức nhận lương
    if (salaryType) {
      if (salaryType === 'advancePayment')
        temp = temp.filter((record) => record?.isAdvancePayment);
      else if (salaryType === 'total')
        temp = temp.filter((record) => !record?.isAdvancePayment);
    }

    // Tìm teacher cho mỗi bản ghi
    if (temp.length)
      temp = temp.map((record) => ({
        ...record,
        teacher: teachers.find((teacher) => teacher._id === record.teacherId),
      }));

    setDataSource(temp);
  }, [period, salaryType, dataSource.length, allPaySalaries.length, teachers.length]);

  const clearSalaryType = () => {
    setSalaryType('');
    setDataSource([]);
  };

  const handleExportExcel = () => {
    const tempArr = [...dataSource];
    const data = tempArr.map((item, index) => [
      index + 1,
      item.teacher.fullname,
      item.period,
      item.paidSalary,
      item.isAdvancePayment ? 'Ứng lương' : 'Lĩnh lương',
      item.datePaidSalary
        ? moment(item.datePaidSalary).format('DD/MM/YYYY HH:mm')
        : '---',
    ]);
    data.unshift([
      'STT',
      'GIẢNG VIÊN',
      'KỲ LƯƠNG',
      'SỐ TIỀN NHẬN',
      'HÌNH THỨC NHẬN',
      'THỜI GIAN',
    ]);
    const wb = XLSX.utils.book_new();
    const ws_name = 'SheetJS';

    const ws_data = data;
    const ws = XLSX.utils.aoa_to_sheet(ws_data);

    XLSX.utils.book_append_sheet(wb, ws, ws_name);
    XLSX.writeFile(wb, `BAO_CAO_CHI_LUONG${period ? `_${period}` : ''}.xlsx`);
  };

  return (
    <>
      <h3>Lọc theo:</h3>
      <Row>
        <Col span={24} style={{ display: 'flex' }}>
          <h4 style={{ lineHeight: '200%', margin: '0 10px' }}>Tháng:</h4>
          <DatePicker
            picker="month"
            placeholder="Chọn tháng"
            format="MM/YYYY"
            style={{ width: '15%', marginRight: '10px' }}
            onChange={(date, dateString) => setPeriod(dateString)}
          />
          <h4 style={{ lineHeight: '200%', marginRight: '10px' }}>Hình thức:</h4>
          <Select
            allowClear
            showSearch
            placeholder="Hình thức nhận lương"
            filterOption={false}
            style={{ width: '15%' }}
            value={salaryType || undefined}
            onChange={setSalaryType}
            onClear={clearSalaryType}
          >
            <Select.Option key={1} value="advancePayment">
              Ứng lương
            </Select.Option>
            <Select.Option key={2} value="total">
              Lĩnh lương
            </Select.Option>
          </Select>
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
          title="Giảng Viên"
          dataIndex="teacher"
          render={(text, record) => (
            <Link to={`/teachers/${record?.teacher?.teacherId}`}>
              {record?.teacher?.fullname}
            </Link>
          )}
        />
        <Table.Column title="Kỳ Lương" align="center" dataIndex="period" />
        <Table.Column
          title="Số Tiền Nhận"
          dataIndex="paidSalary"
          align="right"
          render={(text) => (text ? numberToVnd(text) : '---')}
        />
        <Table.Column
          title="Hình Thức Nhận"
          dataIndex="isAdvancePayment"
          align="left"
          render={(text) => (text ? 'Ứng lương' : 'Lĩnh lương')}
        />
        <Table.Column
          title="Thời Gian"
          dataIndex="datePaidSalary"
          render={(text) => (text ? moment(text).format('DD/MM/YYYY HH:mm') : '---')}
        />
      </Table>
    </>
  );
};

export default tuitionFeeReport;
