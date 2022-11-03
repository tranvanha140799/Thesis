import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Table, Space, Button } from 'antd';
// import ColumnGroup from 'antd/lib/table/ColumnGroup';
import Column from 'antd/lib/table/Column';

import 'antd/dist/antd.css';
import './index.css';
import { Link } from 'react-router-dom';
import { teacherActions } from '../../redux/teacherSlice';

const { deleteTeacher, getTeachers } = teacherActions;

const TeacherPage = () => {
  const dispatch = useDispatch();
  const teachers = useSelector((state) => state.teachersReducer.teachers);

  let data = [];

  // if (teachers.length > 0 && salaries.length > 0) {
  //   var editTeachers = teachers;
  //   // var editTeacherPayments = teacherPayments;
  //   for (let teacher of editTeachers) {
  //     if (teacher.salaryRankId) {
  //       for (let salary of salaries) {
  //         if (teacher.salaryRankId === salary.salaryRankId) {
  //           teacher = {
  //             ...teacher,
  //             salaryAmount: salary.basicSalary * salary.coefficient + salary.allowance,
  //           };
  //           // console.log(teacher);
  //           break;
  //         }
  //       }
  //     }
  //     if (!teacher.salaryAmount) {
  //       // console.log('here');
  //       teacher = {
  //         ...teacher,
  //         salaryAmount: 0,
  //       };
  //     }
  //     data.push(teacher);
  //   }
  //   // console.log(data);
  // }

  useEffect(() => {
    dispatch(getTeachers());
  }, []);

  return (
    <Table dataSource={data} rowKey="teacherId">
      <Column
        title="Mã Giáo Viên"
        dataIndex="teacherId"
        key="teacherId"
        defaultSortOrder="ascend"
        sorter={(a, b) => Number(a.teacherId) - Number(b.teacherId)}
      />
      <Column
        title="Họ và Tên"
        dataIndex="fullname"
        key="fullname"
        render={(text, record) => (
          <Space size="middle">
            <Link to={`/teachers/${record.teacherId}`}>{record.fullname}</Link>
          </Space>
        )}
      />
      <Column
        title="Giới Tính"
        dataIndex="gender"
        key="gender"
        render={(gender) => {
          if (gender === 'male') return 'Nam';
          else if (gender === 'female') return 'Nữ';
          else return 'Khác';
        }}
      />
      <Column
        title="Ngày Sinh"
        dataIndex="birthday"
        key="birthday"
        render={(birthday) => {
          const date = new Date(birthday);
          let string = '';
          string += date.getDate().toString() + '/';
          string += (date.getMonth() + 1).toString() + '/';
          string += date.getFullYear().toString();
          return string;
        }}
      />
      <Column title="Địa Chỉ" dataIndex="address" key="address" />
      <Column title="Số Điện Thoại" dataIndex="phoneNumber" key="phoneNumber" />
      <Column title="Học Vị" dataIndex="degree" key="degree" />
      <Column title="Chức Vụ" dataIndex="position" key="position" />
      <Column
        title="Môn Giảng Dạy"
        dataIndex="subjectId"
        key="subjectId"
        sorter={(a, b) => Number(a.subjectId) - Number(b.subjectId)}
        render={(text) => {
          switch (text) {
            case '001':
              return 'Toán';
            case '002':
              return 'Vật Lý';
            case '003':
              return 'Hoá Học';
            case '004':
              return 'Sinh Học';
            case '005':
              return 'Ngữ Văn';
            case '006':
              return 'Lịch Sử';
            case '007':
              return 'Địa Lý';
            case '008':
              return 'Tiếng Anh';
            default:
              return '';
          }
        }}
      />
      <Column
        title="Trạng Thái"
        dataIndex="status"
        key="status"
        filters={[
          {
            text: 'Đang công tác',
            value: '1',
          },
          {
            text: 'Tạm nghỉ',
            value: '2',
          },
          {
            text: 'Đã nghỉ việc',
            value: '3',
          },
        ]}
        onFilter={(value, record) => record.status === value}
        filterSearch={true}
        render={(text) => {
          switch (text) {
            case '1':
              return 'Đang công tác';
            case '2':
              return 'Tạm nghỉ';
            case '3':
              return 'Đã nghỉ việc';
            default:
              return '';
          }
        }}
      />
      <Column
        title="Mức Lương Hiện Tại"
        dataIndex="salaryAmount"
        key="salaryAmount"
        sorter={(a, b) => a.salaryAmount - b.salaryAmount}
        render={(salary) => {
          const str = salary?.toString();
          return str
            ?.split('')
            ?.reverse()
            ?.reduce((prev, next, index) => {
              return (index % 3 ? next : next + '.') + prev;
            });
        }}
      />
      <Column
        title="Action"
        key="action"
        render={(text, record) => (
          <Space size="middle">
            <Button onClick={() => dispatch(deleteTeacher(record._id))}>Xoá</Button>
          </Space>
        )}
      />
    </Table>
  );
};

export default TeacherPage;
