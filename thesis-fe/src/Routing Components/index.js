import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import Header from '../components/Header/Header';

import logo from '../images/logo.jpg';
import { Layout, Menu } from 'antd';
import {
  TeamOutlined,
  BookOutlined,
  MoneyCollectOutlined,
  HomeOutlined,
  DollarOutlined,
  PicCenterOutlined,
  PicLeftOutlined,
  SnippetsOutlined,
  CopyrightOutlined,
  ClockCircleOutlined,
  DollarCircleOutlined,
} from '@ant-design/icons';

import 'antd/dist/antd.css';
// import './index.css';

import Courses from './Course';
import Classes from './Class';
import HomePage from './Home';
import SalaryFactor from './SalaryFactor';
import Schedules from './Schedule';
import Students from './Students';
import Teachers from './Teachers';
import TeachersSalaryChart from './TeachersSalaryChart';
import TuitionFees from './TuitionFee';

const { Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

function Home() {
  const [collapsed, setCollapsed] = useState(false);

  const onCollapse = () => setCollapsed(!collapsed);

  // const temp = useParams();
  const route = useLocation();
  // console.log(route);

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
          {/* <SubMenu key="salary" icon={<DollarOutlined />} title="Lương"> */}
          {/* <Menu.Item key="teachers-salary-factors" icon={<BookOutlined />}>
              <Link to="/teachers-salary-factors">Bảng Lương Tháng Giáo Viên</Link>
            </Menu.Item> */}
          {/* </SubMenu> */}
          <Menu.Item key="teachers" icon={<TeamOutlined />}>
            <Link to="/teachers">Giảng Viên</Link>
          </Menu.Item>
          <Menu.Item key="students" icon={<TeamOutlined />}>
            <Link to="/students">Học Viên</Link>
          </Menu.Item>
          <Menu.Item key="courses" icon={<PicLeftOutlined />}>
            <Link to="/courses">Khoá Học</Link>
          </Menu.Item>
          <Menu.Item key="classes" icon={<PicCenterOutlined />}>
            <Link to="/classes">Lớp Học</Link>
          </Menu.Item>
          <Menu.Item key="schedules" icon={<ClockCircleOutlined />}>
            <Link to="/schedules">Khung Giờ Học</Link>
          </Menu.Item>
          <Menu.Item key="discounts" icon={<DollarCircleOutlined />}>
            <Link to="/discounts">Khuyến Mãi</Link>
          </Menu.Item>
          <Menu.Item key="salary-factors" icon={<BookOutlined />}>
            <Link to="/salary-factors">Bảng Bậc Lương</Link>
          </Menu.Item>
          <Menu.Item key="pay-salaries" icon={<MoneyCollectOutlined />}>
            <Link to="/pay-salaries">Chi Lương</Link>
          </Menu.Item>
          <Menu.Item key="tuition-fees" icon={<MoneyCollectOutlined />}>
            <Link to="/tuition-fees">Thu Học Phí</Link>
          </Menu.Item>
          <SubMenu key="reports" icon={<BookOutlined />} title="Báo Cáo">
            <Menu.Item key="pay-reports" icon={<SnippetsOutlined />}>
              <Link to="/pay-reports">Chi Lương</Link>
            </Menu.Item>
            <Menu.Item key="tuition-reports" icon={<SnippetsOutlined />}>
              <Link to="/tuition-reports">Thu Học Phí</Link>
            </Menu.Item>
          </SubMenu>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header
          className="site-layout-background"
          style={{ position: 'fixed', zIndex: 1, width: '100%' }}
        />
        <Content style={{ margin: '0 16px' }}>
          <HomePage />
          <Teachers />
          <Students />
          <Courses />
          <Classes />
          <SalaryFactor />
          <Schedules />
          <TuitionFees />
          <TeachersSalaryChart />
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Hệ Thống Quản Lý Thu Chi <CopyrightOutlined /> 2022
        </Footer>
      </Layout>
    </Layout>
  );
}

export default Home;
