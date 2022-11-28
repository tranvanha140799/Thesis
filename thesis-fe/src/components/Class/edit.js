/* eslint-disable react-hooks/exhaustive-deps */
import { Col, Modal, Select, Space, Table, Tabs } from "antd";
import Column from "antd/lib/table/Column";
import TabPane from "antd/lib/tabs/TabPane";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { classActions } from "../../redux/classSlice";
import { studentActions } from "../../redux/studentSlice";
import { teacherActions } from "../../redux/teacherSlice";
import AddBtn from "../Common/AddBtn";
import { showNotification } from "../Common/utilities";
import AddStudent from "./add";
import DeleteBtn from "../Common/DeleteBtn";
import { classTeacherActions } from "../../redux/classTeacherSlice";
import { classStudentActions } from "../../redux/classStudentSlice";

const EditCLass = () => {
  const { classId } = useParams();
  const dispatch = useDispatch();
  const { getStudents } = studentActions;
  const { getClasses } = classActions;
  const { getTeachers, updateTeacher } = teacherActions;
  const {
    createClassTeacher,
    changeCurrentClassTeachers,
    getAllClassTeachers,
  } = classTeacherActions;
  const {
    getAllClassStudents,
    createClassStudent,
    changeCurrentClassStudents,
  } = classStudentActions;

  const [openModal, setOpenModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState({});
  const [listStudents, setListCurrentStudents] = useState([]);
  const [openModalTea, setOpenModalTea] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState({});
  const [listTeachers, setListCurrentTeachers] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [dataSourceStu, setDataSourceStu] = useState([]);

  const classes = useSelector((state) => state.classReducer.classes);
  const allStu = useSelector((state) => state.studentReducer.students);
  const allTeachers = useSelector((state) => state.teacherReducer.teachers);
  const dataClass = classes.find((clasS) => clasS?.classId === classId);
  const stuOfClass = allStu?.filter((stu) => stu?.classId === dataClass?._id);

  const stuNoClassId = allStu.filter((student) => student.classId === "");
  const teacherNoClassId = allTeachers.filter((tea) => tea.classId === "");
  const allClassTeachers = useSelector(
    (state) => state.classTeacherReducer.allClassTeachers
  );

  const allClassStu = useSelector(
    (state) => state.classStudentReducer.allClassStudents
  );
  const currentClassTeachers =
    useSelector((state) => state.classTeacherReducer.currentClassTeachers) ||
    [];
  const currentClassStudents =
    useSelector((state) => state.classStudentReducer.currentClassStudents) ||
    [];
  useEffect(() => {
    dispatch(getStudents());
    dispatch(getClasses());
    dispatch(getTeachers());
  }, []);

  useEffect(() => {
    if (!allClassTeachers.length) dispatch(getAllClassTeachers());
    if (!allClassStu.length) dispatch(getAllClassStudents());
    if (!currentClassTeachers.length)
      dispatch(changeCurrentClassTeachers(dataClass?._id));
  });

  useEffect(() => {
    if (
      allTeachers.length &&
      !dataSource.length &&
      currentClassTeachers.length
    ) {
      let temp = [];
      currentClassTeachers.forEach((record) => {
        const foundClass = allTeachers.find(
          (tea) => tea._id === record?.teacherId
        );
        if (foundClass._id) temp.push(foundClass);
      });
      setDataSource(temp);
    }
  }, [currentClassTeachers]);
  console.log(dataSource);
  useEffect(() => {
    if (
      allStu.length &&
      !dataSource.length &&
      currentClassStudents.length
    ) {
      let temp = [];
      currentClassStudents.forEach((record) => {
        const foundStu = allStu.find(
          (tea) => tea._id === record?.student_id
        );
        if (foundStu._id) temp.push(foundStu);
      });
      setDataSourceStu(temp);
    }
  }, [currentClassStudents]);

  const onOk = () => {
    const payload = {
      teacher_id: selectedTeacher._id,
      classID: classId,
      class_id: dataClass._id,
    };
    console.log(payload);

    dispatch(
      createClassTeacher(payload, {
        onSuccess: () =>
          showNotification("success", "Thêm giảng viên vào lớp thành công."),
        onError: () =>
          showNotification("error", "Thêm giảng viên vào lớp thất bại!"),
      })
    );
    setOpenModalTea(false);
  };

  const onDeleteTea = (record) => {
    console.log(record);
  };
  const openModalAddStu = () => {
    setOpenModal(true);
  };
  const clearStudent = () => {
    setSelectedStudent({});
  };
  const clearTeacher = () => {
    setSelectedTeacher({});
  };

  const openModalAddTea = () => {
    setOpenModalTea(true);
  };
  // console.log(selectedTeacher);
  const handleChangeStudent = (value) => {
    const dataStudent = allStu.find((student) => student?._id === value);
    setSelectedStudent(dataStudent);
    if (listStudents.length === allStu.length)
      setListCurrentStudents(
        allStu.filter((student) => student.classId === "")
      );
  };

  const handleChangeTeacher = (value) => {
    const dataTeacher = allTeachers.find((student) => student?._id === value);
    setSelectedTeacher(dataTeacher);
    if (listTeachers.length === allStu.length)
      setListCurrentTeachers(allTeachers.filter((tea) => tea.classId === ""));
  };

  return (
    <>
      <Tabs>
        <TabPane tab="Sửa thông tin lớp học" key={1}>
          <AddStudent id={classId} />
        </TabPane>
        <TabPane tab="Danh sách sinh viên" key={2}>
          <AddBtn add={openModalAddStu} />
          <Table
            dataSource={dataSourceStu}
            rowKey="studentId"
            // pagination={{
            //   pageSize,
            //   showTotal: (total, range) =>
            //     `${range[0]}-${range[1]} của ${total} học viên`,
            //   showSizeChanger: true,
            //   pageSizeOptions: ['10', '20', '50'],
            // }}
            // onChange={(e) => setPageSize(e?.pageSize)}
          >
            <Column title="Mã Học Viên" dataIndex="studentId" key="key" />
            <Column
              title="Họ và Tên"
              dataIndex="fullname"
              key="key"
              render={(text, record) => (
                <Space size="middle">
                  <Link to={`/students/${record.studentId}`}>
                    {record.fullname}
                  </Link>
                </Space>
              )}
            />
            <Column
              title="Ngày Sinh"
              dataIndex="birthday"
              key="key"
              render={(birthday) => {
                const date = new Date(birthday);
                let string = "";
                string += date.getDate().toString() + "/";
                string += (date.getMonth() + 1).toString() + "/";
                string += date.getFullYear().toString();
                return string;
              }}
            />
            <Column
              title="Giới Tính"
              dataIndex="gender"
              key="key"
              render={(gender) => {
                if (gender === "male") return "Nam";
                else if (gender === "female") return "Nữ";
                else return "Khác";
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
                  case "learning":
                    return "Đang học";
                  case "paused":
                    return "Bảo lưu";
                  case "leaved":
                    return "Đã nghỉ học";
                  default:
                    return "";
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
            <Col span={24} style={{ display: "flex" }}>
              <h4 style={{ lineHeight: "200%", marginRight: "10px" }}>
                Học viên:
              </h4>
              <Select
                allowClear
                onClear={clearStudent}
                showSearch
                placeholder="Học viên"
                onChange={handleChangeStudent}
                // onSearch={(e) => handleSearch(e, listStudents)}
                style={{ width: "75%" }}
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
          <AddBtn add={openModalAddTea} />
          <Table
            dataSource={dataSource}
            rowKey="teacherId"
            style={{ width: "100%" }}
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
                  <Link to={`/teachers/${record.teacherId}`}>
                    {record.fullname}
                  </Link>
                </Space>
              )}
            />
            <Column
              title="Giới Tính"
              dataIndex="gender"
              key="gender"
              render={(gender) => {
                if (gender === "male") return "Nam";
                else if (gender === "female") return "Nữ";
                else return "Khác";
              }}
            />
            <Column
              title="Ngày Sinh"
              dataIndex="birthday"
              key="birthday"
              render={(text) => moment(text).format("DD/MM/YYYY")}
            />
            <Column title="Địa Chỉ" dataIndex="address" key="address" />
            <Column
              title="Số Điện Thoại"
              dataIndex="phoneNumber"
              key="phoneNumber"
            />
            {/* <Column title="Học Vị" dataIndex="degree" key="degree" /> */}
            <Column
              title="Chức Vụ"
              dataIndex="position"
              key="position"
              filters={[
                {
                  text: "Giảng Viên",
                  value: "teacher",
                },
                {
                  text: "Trợ Giảng",
                  value: "tutor",
                },
              ]}
              onFilter={(value, record) => record.position === value}
              // filterSearch={true}
              render={(text) =>
                text === "teacher"
                  ? "Giảng Viên"
                  : text === "tutor"
                  ? "Trợ Giảng"
                  : ""
              }
            />
            <Column
              title="Trạng Thái"
              dataIndex="status"
              key="status"
              filters={[
                {
                  text: "Đang công tác",
                  value: "active",
                },
                {
                  text: "Tạm nghỉ",
                  value: "paused",
                },
                {
                  text: "Đã nghỉ việc",
                  value: "leaved",
                },
              ]}
              onFilter={(value, record) => record.status === value}
              // filterSearch={true}
              render={(text) => {
                switch (text) {
                  case "active":
                    return "Đang công tác";
                  case "paused":
                    return "Tạm nghỉ";
                  case "leaved":
                    return "Đã nghỉ việc";
                  default:
                    return "";
                }
              }}
            />

            <Column
              title="Action"
              key="action"
              render={(text, record) => (
                <Space size="middle">
                  <DeleteBtn onDelete={() => onDeleteTea(record)} />
                </Space>
              )}
            />
          </Table>
          <Modal
            destroyOnClose
            open={openModalTea}
            title="Thêm giảng viên"
            cancelText="Huỷ"
            onOk={onOk}
            onCancel={() => setOpenModalTea(false)}
          >
            <Col span={24} style={{ display: "flex" }}>
              <h4 style={{ lineHeight: "200%", marginRight: "10px" }}>
                Học viên:
              </h4>
              <Select
                allowClear
                onClear={clearTeacher}
                showSearch
                placeholder="Học viên"
                onChange={handleChangeTeacher}
                // onSearch={(e) => handleSearch(e, listStudents)}
                style={{ width: "75%" }}
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
    </>
  );
};

export default EditCLass;
