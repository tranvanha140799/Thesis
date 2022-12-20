/* eslint-disable react-hooks/exhaustive-deps */
import { Col, Modal, Select, Space, Table, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import moment from 'moment';
import Column from 'antd/lib/table/Column';
import TabPane from 'antd/lib/tabs/TabPane';

import AddBtn from '../Common/AddBtn';
import DeleteBtn from '../Common/DeleteBtn';
import AddStudent from './add';
import { showNotification } from '../Common/utilities';

import { classActions } from '../../redux/classSlice';
import { classStudentActions } from '../../redux/classStudentSlice';
import { classTeacherActions } from '../../redux/classTeacherSlice';
import { studentActions } from '../../redux/studentSlice';
import { teacherActions } from '../../redux/teacherSlice';

const { getClasses } = classActions;
const { getStudents } = studentActions;
const { getTeachers, updateTeacher } = teacherActions;
const { getAllClassStudents } = classStudentActions;
const { createClassTeacher, getAllClassTeachers } = classTeacherActions;

const EditCLass = () => {
  const { classId } = useParams();
  const dispatch = useDispatch();

  const [openModal, setOpenModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState({});
  const [listStudents, setListCurrentStudents] = useState([]);
  const [openModalTeacher, setOpenModalTeacher] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState({});
  const [listTeachers, setListCurrentTeachers] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [dataSourceStudent, setDataSourceStudent] = useState([]);

  const classes = useSelector((state) => state.classReducer.classes);
  const students = useSelector((state) => state.studentReducer.students);
  const teachers = useSelector((state) => state.teacherReducer.teachers);
  const allClassTeachers = useSelector(
    (state) => state.classTeacherReducer.allClassTeachers
  );
  const allClassStudents = useSelector(
    (state) => state.classStudentReducer.allClassStudents
  );
  const currentClass = classes.find((clasS) => clasS?.classId === classId);
  const stuNoClassId = students.filter((student) => student.classId === '');
  const teacherNoClassId = teachers.filter((tea) => tea.classId === '');

  useEffect(() => {
    dispatch(getStudents());
    dispatch(getClasses());
    dispatch(getTeachers());
  }, []);

  useEffect(() => {
    if (!allClassTeachers.length) dispatch(getAllClassTeachers());
    if (!allClassStudents.length) dispatch(getAllClassStudents());
  }, [currentClass]);

  // Lấy danh sách giảng viên thuộc lớp
  useEffect(() => {
    if (teachers.length && !dataSource.length && allClassTeachers.length) {
      let temp = [];
      allClassTeachers
        .filter(
          (cltc) =>
            cltc.classId === currentClass?._id || cltc.class_id === currentClass?._id
        )
        .forEach((record) => {
          const foundTeacher = teachers.find(
            (teacher) =>
              teacher._id === record?.teacherId || teacher._id === record?.teacher_id
          );
          if (foundTeacher?._id) temp.push(foundTeacher);
        });

      //Loại bỏ phần tử trùng nhau
      temp = [...new Set(temp)];
      setDataSource(temp);
    }
  }, [teachers.length, allClassTeachers.length]);

  // Lấy danh sách học viên thuộc lớp
  useEffect(() => {
    if (students.length && !dataSourceStudent.length && allClassStudents.length) {
      let temp = [];
      allClassStudents
        .filter(
          (clst) =>
            clst.classId === currentClass?._id || clst.class_id === currentClass?._id
        )
        .forEach((record) => {
          const foundStudent = students.find(
            (student) =>
              student._id === record?.studentId || student._id === record?.student_id
          );
          if (foundStudent._id) temp.push(foundStudent);
        });

      //Loại bỏ phần tử trùng nhau
      temp = [...new Set(temp)];
      setDataSourceStudent(temp);
    }
  }, [students.length, allClassStudents.length]);

  const onOk = () => {
    const payload = {
      class_id: currentClass._id,
      teacher_id: selectedTeacher._id,
      classId,
    };

    dispatch(
      createClassTeacher(payload, {
        onSuccess: () =>
          showNotification('success', 'Thêm giảng viên vào lớp thành công.'),
        onError: () => showNotification('error', 'Thêm giảng viên vào lớp thất bại!'),
      })
    );

    setOpenModalTeacher(false);
  };

  const onDeleteTeacherFromClass = (record) => {
    const payload = {
      teacherId: record.teacherId,
      fullname: record.fullname,
      gender: record.gender,
      birthday: record.birthday,
      email: record.email,
      address: record.address,
      phoneNumber: record.phoneNumber,
      position: record.position,
      workType: record.workType,
      status: record.status,
      salaryRankId: record.salaryRankId,
      image: record.image,
      classId: '',
    };

    dispatch(
      updateTeacher(record._id, payload, {
        onSuccess: () =>
          showNotification('success', 'Xóa giảng viên khỏi lớp thành công.'),
        onError: () => showNotification('error', 'Xóa giảng viên khỏi lớp thất bại!'),
      })
    );
  };

  const openModalAddStudent = () => setOpenModal(true);

  const openModalAddTeacher = () => setOpenModalTeacher(true);

  const clearTeacher = () => setSelectedTeacher({});

  const clearStudent = () => setSelectedStudent({});

  const handleChangeStudent = (value) => {
    const dataStudent = students.find((student) => student?._id === value);
    setSelectedStudent(dataStudent);
    if (listStudents.length === students.length)
      setListCurrentStudents(students.filter((student) => student.classId === ''));
  };

  const handleChangeTeacher = (value) => {
    const dataTeacher = teachers.find((student) => student?._id === value);
    setSelectedTeacher(dataTeacher);
    if (listTeachers.length === students.length)
      setListCurrentTeachers(teachers.filter((teacher) => teacher.classId === ''));
  };

  return (
    <Tabs>
      <TabPane tab="Sửa thông tin lớp học" key={1}>
        <AddStudent id={classId} />
      </TabPane>
      <TabPane tab="Danh sách học viên" key={2}>
        <AddBtn add={openModalAddStudent} />
        <Table
          dataSource={dataSourceStudent}
          rowKey="studentId"
          pagination={{
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} học viên`,
          }}
        >
          <Column title="Mã Học Viên" dataIndex="studentId" key="key" />
          <Column
            title="Họ và Tên"
            dataIndex="fullname"
            key="key"
            render={(text, record) => (
              <Space size="middle">
                <Link to={`/students/${record.studentId}`}>{record.fullname}</Link>
              </Space>
            )}
          />
          <Column
            title="Ngày Sinh"
            dataIndex="birthday"
            key="key"
            render={(birthday) => {
              const date = new Date(birthday);
              let string = '';
              string += date.getDate().toString() + '/';
              string += (date.getMonth() + 1).toString() + '/';
              string += date.getFullYear().toString();
              return string;
            }}
          />
          <Column
            title="Giới Tính"
            dataIndex="gender"
            key="key"
            render={(gender) => {
              if (gender === 'male') return 'Nam';
              else if (gender === 'female') return 'Nữ';
              else return 'Khác';
            }}
          />
          <Column title="Địa Chỉ" dataIndex="address" key="key" />
          <Column title="Số Điện Thoại" dataIndex="phoneNumber" key="key" />
          <Column
            title="Trạng Thái"
            dataIndex="status"
            key="key"
            render={(text) => {
              switch (text) {
                case 'learning':
                  return 'Đang học';
                case 'paused':
                  return 'Bảo lưu';
                case 'leaved':
                  return 'Đã nghỉ học';
                default:
                  return '';
              }
            }}
          />
          <Column
            title="Action"
            key="action"
            // render={(text, record) => (
            //   <Space size="middle">
            //     <DeleteBtn
            //       onDelete={() => {
            //         setOpenConfirmDeleteModal(true);
            //         setEditingRecordId(record._id);
            //       }}
            //     />
            //   </Space>
            // )}
          />
        </Table>
        <Modal
          destroyOnClose
          open={openModal}
          title="Thêm đối tượng miễn giảm"
          cancelText="Huỷ"
          onOk={onOk}
          onCancel={() => setOpenModal(false)}
        >
          <Col span={24} style={{ display: 'flex' }}>
            <h4 style={{ lineHeight: '200%', marginRight: '10px' }}>Học viên:</h4>
            <Select
              allowClear
              onClear={clearStudent}
              showSearch
              placeholder="Học viên"
              onChange={handleChangeStudent}
              // onSearch={(e) => handleSearch(e, listStudents)}
              style={{ width: '75%' }}
              value={selectedStudent?._id || undefined}
              filterOption={false}
            >
              {stuNoClassId?.map((d) => (
                <Select.Option key={d?._id} value={d?._id}>
                  {d?.fullname}
                </Select.Option>
              ))}
            </Select>
          </Col>
        </Modal>
      </TabPane>
      <TabPane tab="Danh sách giảng viên" key={3}>
        <AddBtn add={openModalAddTeacher} />
        <Table
          dataSource={dataSource}
          rowKey="teacherId"
          style={{ width: '100%' }}
          pagination={{
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} giảng viên`,
          }}
          // pagination={{
          //   pageSize,
          //   showTotal: (total, range) =>
          //     `${range[0]}-${range[1]} của ${total} giảng viên`,
          //   showSizeChanger: true,
          //   pageSizeOptions: ['10', '20', '50'],
          // }}
          // onChange={(e) => setPageSize(e?.pageSize)}
        >
          <Column
            title="Mã Giảng Viên"
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
            render={(text) => moment(text).format('DD/MM/YYYY')}
          />
          <Column title="Địa Chỉ" dataIndex="address" key="address" />
          <Column title="Số Điện Thoại" dataIndex="phoneNumber" key="phoneNumber" />
          <Column
            title="Chức Vụ"
            dataIndex="position"
            key="position"
            filters={[
              {
                text: 'Giảng Viên',
                value: 'teacher',
              },
              {
                text: 'Trợ Giảng',
                value: 'tutor',
              },
            ]}
            onFilter={(value, record) => record.position === value}
            render={(text) =>
              text === 'teacher' ? 'Giảng Viên' : text === 'tutor' ? 'Trợ Giảng' : ''
            }
          />
          <Column
            title="Trạng Thái"
            dataIndex="status"
            key="status"
            filters={[
              {
                text: 'Đang công tác',
                value: 'active',
              },
              {
                text: 'Tạm nghỉ',
                value: 'paused',
              },
              {
                text: 'Đã nghỉ việc',
                value: 'leaved',
              },
            ]}
            onFilter={(value, record) => record.status === value}
            // filterSearch={true}
            render={(text) => {
              switch (text) {
                case 'active':
                  return 'Đang công tác';
                case 'paused':
                  return 'Tạm nghỉ';
                case 'leaved':
                  return 'Đã nghỉ việc';
                default:
                  return '';
              }
            }}
          />

          <Column
            title="Action"
            key="action"
            render={(text, record) => (
              <Space size="middle">
                <DeleteBtn onDelete={() => onDeleteTeacherFromClass(record)} />
              </Space>
            )}
          />
        </Table>
        <Modal
          destroyOnClose
          open={openModalTeacher}
          title="Thêm giảng viên"
          cancelText="Huỷ"
          onOk={onOk}
          onCancel={() => setOpenModalTeacher(false)}
        >
          <Col span={24} style={{ display: 'flex' }}>
            <h4 style={{ lineHeight: '200%', marginRight: '10px' }}>Học viên:</h4>
            <Select
              allowClear
              onClear={clearTeacher}
              showSearch
              placeholder="Học viên"
              onChange={handleChangeTeacher}
              // onSearch={(e) => handleSearch(e, listStudents)}
              style={{ width: '75%' }}
              value={selectedTeacher?._id || undefined}
              filterOption={false}
            >
              {teacherNoClassId?.map((d) => (
                <Select.Option key={d?._id} value={d?._id}>
                  {d?.fullname}
                </Select.Option>
              ))}
            </Select>
          </Col>
        </Modal>
      </TabPane>
    </Tabs>
  );
};

export default EditCLass;
