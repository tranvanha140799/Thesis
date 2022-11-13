import { Input } from 'antd';
import React from 'react';

const SearchBox = (props) => {
  return (
    <>
      <Input
        addonBefore="Tìm kiếm:"
        placeholder={props.placeholder}
        style={{ ...props.style }}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </>
  );
};

export default SearchBox;
