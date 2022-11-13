import axios from 'axios';

const API = axios.create({ baseUrl: 'http://localhost:5050' });

API.interceptors.request.use((req) => {
  if (localStorage.getItem('user')) {
    req.headers.authorization = `Bearer ${
      JSON.parse(localStorage.getItem('user')).token
    }`;
  }

  return req;
});

// AUTH
export const signIn = (formData) => API.post('/users/signin', formData);
export const signUp = (formData) => API.post('/users/signup', formData);

// TEACHERS
export const getTeachers = () => API.get('/teachers');
export const createTeacher = (newTeacher) => API.post('/teachers', newTeacher);
export const updateTeacher = (id, updatedTeacher) =>
  API.patch(`/teachers/${id}`, updatedTeacher);
export const deleteTeacher = (id) => API.delete(`/teachers/${id}`);

// STUDENTS
export const getStudents = () => API.get('/students');
export const createStudent = (newStudent) => API.post('/students', newStudent);
export const updateStudent = (id, updatedStudent) =>
  API.patch(`/students/${id}`, updatedStudent);
export const deleteStudent = (id) => API.delete(`/students/${id}`);

//CLASSES
export const getClasses = () => API.get('/classes');
export const createClass = (clasS) => API.post('/classes', clasS);
export const updateClass = (id, updateClass) =>
  API.patch(`/classes/${id}`, updateClass);
export const deleteClass = (id) => API.delete(`/classes/${id}`);

//CLASS-STUDENT
export const getAllClassStudents = () => API.get('/class-student');
export const createClassStudent = (classStudent) =>
  API.post('/class-student', classStudent);
export const updateClassStudent = (id, updateClassStudent) =>
  API.patch(`/class-student/${id}`, updateClassStudent);
export const deleteClassStudent = (id) => API.delete(`/class-student/${id}`);

//SCHEDULES
export const getSchedules = () => API.get('/schedules');
export const createSchedule = (clasS) => API.post('/schedules', clasS);
export const updateSchedule = (id, updateSchedule) =>
  API.patch(`/schedules/${id}`, updateSchedule);
export const deleteSchedule = (id) => API.delete(`/schedules/${id}`);

// SALARIES
export const getSalaries = () => API.get('/salaries');
export const createSalary = (newSalary) => API.post('/salaries', newSalary);
export const updateSalary = (id, updatedSalary) =>
  API.patch(`/salaries/${id}`, updatedSalary);
export const deleteSalary = (id) => API.delete(`/salaries/${id}`);

// TEACHER PAYMENTS
export const getTeacherPayments = () => API.get('/teacher-payment');
export const createTeacherPayment = (newTeacherPayment) =>
  API.post('/teacher-payment', newTeacherPayment);
export const updateTeacherPayment = (id, updatedTeacherPayment) =>
  API.patch(`/teacher-payment/${id}`, updatedTeacherPayment);
export const deleteTeacherPayment = (id) => API.delete(`/teacher-payment/${id}`);

// EXPENSEOFMONTHSHEETS
export const getExpenseOfMonthSheets = () => API.get('/expense-of-month-sheets');
export const createExpenseOfMonthSheet = (newExpenseOfMonthSheet) =>
  API.post('/expense-of-month-sheets', newExpenseOfMonthSheet);
export const updateExpenseOfMonthSheet = (id, updatedExpenseOfMonthSheet) =>
  API.patch(`/expense-of-month-sheets/${id}`, updatedExpenseOfMonthSheet);
export const deleteExpenseOfMonthSheet = (id) =>
  API.delete(`/expense-of-month-sheets/${id}`);
