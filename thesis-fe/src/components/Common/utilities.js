export const validatePhoneNumber = (rule, value, callback) => {
  const test1 = /^(0|\+84)[1-9]([0-9]{8})\d?\b/;
  const test2 = /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/;

  if (value && !test1.test(value.replace(/\s/g, '')))
    callback('Số điện thoại sai định dạng!');
  else if (value && !test2.test(value.replace(/\s/g, '')))
    callback('Đầu số không tồn tại!');
  else callback();
};
