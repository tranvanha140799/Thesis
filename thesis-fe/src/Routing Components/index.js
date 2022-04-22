import React, { useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';

import Header from '../components/Header/Header';

import logo from '../images/logo.jpg';
import { Layout, Menu, Breadcrumb } from 'antd';
import {
  TeamOutlined,
  BookOutlined,
  MoneyCollectOutlined,
  HomeOutlined,
  AppleOutlined,
  DollarCircleOutlined,
} from '@ant-design/icons';

import 'antd/dist/antd.css';
// import './index.css';
import Teachers from './Teachers';
import Students from './Students';
import SalaryChart from './SalaryChart';
import ExpenseOfMonthSheet from './ExpenseOfMonthSheet';
import TeachersSalaryChart from './TeachersSalaryChart';

const { Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

function Home() {
  const [collapsed, setCollapsed] = useState(false);

  const onCollapse = () => {
    setCollapsed(!collapsed);
  };

  // const temp = useParams();
  const route = useLocation();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <img className="logo" src={logo} alt="Logo" style={{ width: '70%' }} />
        <Menu
          theme="dark"
          defaultSelectedKeys={[route.pathname.split('/')[1]]}
          mode="inline"
        >
          <Menu.Item key="" icon={<HomeOutlined />}>
            <Link to="/">Trang Chủ</Link>
          </Menu.Item>
          <SubMenu key="salary" icon={<DollarCircleOutlined />} title="Lương">
            <Menu.Item key="salary-chart" icon={<BookOutlined />}>
              <Link to="/salary-chart">Bảng Bậc Lương</Link>
            </Menu.Item>
            <Menu.Item key="teachers-salary-chart" icon={<BookOutlined />}>
              <Link to="/teachers-salary-chart">Bảng Lương Tháng Giáo Viên</Link>
            </Menu.Item>
          </SubMenu>
          <Menu.Item key="teachers" icon={<TeamOutlined />}>
            <Link to="/teachers">Giáo Viên</Link>
          </Menu.Item>
          <Menu.Item key="students" icon={<TeamOutlined />}>
            <Link to="/students">Học Sinh</Link>
          </Menu.Item>
          <Menu.Item key="classes" icon={<AppleOutlined />}>
            <Link to="/classes">Lớp Giảng Dạy</Link>
          </Menu.Item>
          <Menu.Item key="expense-of-month-sheets" icon={<BookOutlined />}>
            <Link to="/expense-of-month-sheets">Phiếu Chi Tháng</Link>
          </Menu.Item>
          <Menu.Item key="tuition-fees" icon={<MoneyCollectOutlined />}>
            <Link to="/tuition-fees">Thu Học Phí</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header
          className="site-layout-background"
          style={{ position: 'fixed', zIndex: 1, width: '100%' }}
        />
        <Content style={{ margin: '0 16px' }}>
          {/* <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>User</Breadcrumb.Item>
            <Breadcrumb.Item>Bill</Breadcrumb.Item>
          </Breadcrumb> */}
          {/* <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 360 }}
          >
            Trang này chưa có dữ liệu.
          </div> */}
          <Teachers />
          <Students />
          <SalaryChart />
          <ExpenseOfMonthSheet />
          <TeachersSalaryChart />
        </Content>
        <Footer style={{ textAlign: 'center' }}>Hệ Thống Quản Lý Thu Chi</Footer>
      </Layout>
    </Layout>
  );
}

export default Home;
