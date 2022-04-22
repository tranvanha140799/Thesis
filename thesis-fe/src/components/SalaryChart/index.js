import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Table, Space, Button } from 'antd';
// import ColumnGroup from 'antd/lib/table/ColumnGroup';
import Column from 'antd/lib/table/Column';

import 'antd/dist/antd.css';
import './index.css';
import { Link } from 'react-router-dom';
import { deleteSalary, getSalaries } from '../../actions/salaryChart';

const SalaryChartPage = () => {
  const dispatch = useDispatch();
  const salaries = useSelector((state) => state.salaryChartReducer.salaries);

  useEffect(() => {
    dispatch(getSalaries());
  }, []);

  let data = [];

  if (salaries.length > 0) {
    for (let salary of salaries) {
      salary = {
        ...salary,
        totalAmount: salary.basicSalary * salary.coefficient + salary.allowance,
      };
      data.push(salary);
    }
  }

  return (
    <Table dataSource={data} rowKey="salaryRankId">
      <Column
        title="Mã Bậc Lương"
        dataIndex="salaryRankId"
        key="key"
        render={(id, record) => (
          <Space size="middle">
            <Link to={`/salary-chart/${record.salaryRankId}`}>{id}</Link>
          </Space>
        )}
      />
      <Column
        title="Lương Cơ Bản"
        dataIndex="basicSalary"
        key="key"
        render={(salary) => {
          const str = salary.toString();
          return str
            .split('')
            .reverse()
            .reduce((prev, next, index) => {
              return (index % 3 ? next : next + '.') + prev;
            });
        }}
      />
      <Column
        title="Phụ Cấp"
        dataIndex="allowance"
        key="key"
        render={(allowance) => {
          const str = allowance.toString();
          return str
            .split('')
            .reverse()
            .reduce((prev, next, index) => {
              return (index % 3 ? next : next + '.') + prev;
            });
        }}
      />
      <Column title="Hệ Số" dataIndex="coefficient" key="key" />
      <Column
        title="Tổng Lương"
        dataIndex="totalAmount"
        key="key"
        render={(totalAmount) => {
          const str = totalAmount.toString();
          return str
            .split('')
            .reverse()
            .reduce((prev, next, index) => {
              return (index % 3 ? next : next + '.') + prev;
            });
        }}
      />
      <Column
        title="Action"
        key="action"
        render={(text, record) => (
          <Space size="middle">
            <Button onClick={() => dispatch(deleteSalary(record._id))}>Xoá</Button>
          </Space>
        )}
      />
    </Table>
  );
};

export default SalaryChartPage;
