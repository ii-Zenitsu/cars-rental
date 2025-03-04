import React from 'react';
import { Button, message, Popconfirm } from 'antd';
const confirm = (e) => {
  console.log(e);
  message.success('Click on Yes', 1);
};
const cancel = (e) => {
  console.log(e);
  message.error('Click on No', 5);
};
const App = () => (
  <Popconfirm
    placement="topLeft"
    title="Delete the task"
    description="Are you sure to delete this task?"
    onConfirm={confirm}
    onCancel={cancel}
    okText="Yes"
    cancelText="No"
    icon={<QuestionCircleOutlined />}
  >
    <Button danger>Delete</Button>
  </Popconfirm>
);
export default App;