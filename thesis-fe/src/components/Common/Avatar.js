import React from 'react';

const Avatar = ({ src, border, borderRadius, style }) => (
  <div>
    <img
      src={src}
      alt=""
      style={Object.assign(
        {
          width: '100%',
          border: border || '1px solid #ddd',
          padding: '5px',
          borderRadius,
        },
        style && style
      )}
    />
  </div>
);

export default Avatar;
