/**
 * title: Basic usage
 * desc: Controlled Input component with initial value and reset functionality
 *
 * title.zh-CN: 基本用法
 * desc.zh-CN: 带初始化值跟重置的受控Input组件
 */

import React, { Fragment } from 'react';
import { Input, Button } from 'antd';
import { useEventTarget } from 'ahooks'

export default () => {
  const [value, { reset, onChange }] = useEventTarget('this is initial value');

  return (<Fragment>
      <Input value={value} onChange={onChange} style={{ width: 200, marginRight: 20 }}/>
      <Button type="primary" onClick={reset}>重置</Button>
    </Fragment>
  );
};
