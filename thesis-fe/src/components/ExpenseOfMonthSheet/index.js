import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { Table, Space, Button } from 'antd';
import Column from 'antd/lib/table/Column';

import 'antd/dist/antd.css';
import './index.css';
import { Link } from 'react-router-dom';
import {
  deleteExpenseOfMonthSheet,
  getExpenseOfMonthSheets,
} from '../../actions/expenseOfMonthSheet';

const ExpenseOfMonthSheetPage = () => {
  const dispatch = useDispatch();
  const data = useSelector(
    (state) => state.expenseOfMonthSheetReducer.expenseOfMonthSheets
  );

  useEffect(() => {
    dispatch(getExpenseOfMonthSheets());
  }, []);

  return (
    <Table dataSource={data} rowKey="expenseOfMonthSheetId">
      <Column
        title="Mã Phiếu Chi Tháng"
        dataIndex="expenseOfMonthSheetId"
        key="key"
        render={(id, record) => (
          <Space size="middle">
            <Link to={`/expense-of-month-sheets/${record.expenseOfMonthSheetId}`}>
              {id}
            </Link>
          </Space>
        )}
      />
      <Column
        title="Ngày Lập Phiếu"
        dataIndex="createDate"
        key="key"
        render={(createDate) => {
          const date = new Date(createDate);
          let string = '';
          string += date.getDate().toString() + '/';
          string += (date.getMonth() + 1).toString() + '/';
          string += date.getFullYear().toString();
          return string;
        }}
      />
      <Column
        title="Người Lập Phiếu"
        dataIndex="createBy"
        key="key"
        // render={(allowance) => {
        //   const str = allowance.toString();
        //   return str
        //     .split('')
        //     .reverse()
        //     .reduce((prev, next, index) => {
        //       return (index % 3 ? next : next + '.') + prev;
        //     });
        // }}
      />
      <Column
        title="Action"
        key="action"
        render={(text, record) => (
          <Space size="middle">
            <Button onClick={() => dispatch(deleteExpenseOfMonthSheet(record._id))}>
              Xoá
            </Button>
          </Space>
        )}
      />
    </Table>
  );
};

export default ExpenseOfMonthSheetPage;
