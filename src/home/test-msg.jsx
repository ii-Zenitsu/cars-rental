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

import React from 'react';
import { DatePicker, Space } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';
const weekFormat = 'MM/DD';
const monthFormat = 'YYYY/MM';

/** Manually entering any of the following formats will perform date parsing */
const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY', 'DD-MM-YYYY', 'DD-MM-YY'];
const customFormat = (value) => `custom format: ${value.format(dateFormat)}`;
const customWeekStartEndFormat = (value) =>
  `${dayjs(value).startOf('week').format(weekFormat)} ~ ${dayjs(value)
    .endOf('week')
    .format(weekFormat)}`;
const App2 = () => (
  <Space direction="vertical" size={12}>
    <DatePicker defaultValue={dayjs('2015/01/01', dateFormat)} format={dateFormat} />
    <DatePicker defaultValue={dayjs('01/01/2015', dateFormatList[0])} format={dateFormatList} />
    <DatePicker defaultValue={dayjs('2015/01', monthFormat)} format={monthFormat} picker="month" />
    <DatePicker defaultValue={dayjs()} format={customWeekStartEndFormat} picker="week" />
    <RangePicker
      defaultValue={[dayjs('2015/01/01', dateFormat), dayjs('2015/01/01', dateFormat)]}
      format={dateFormat}
    />
    <DatePicker defaultValue={dayjs('2015/01/01', dateFormat)} format={customFormat} />
  </Space>
);

import React from 'react';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
const App3 = () => (
  <DatePicker
    defaultValue={dayjs('2019-09-03', dateFormat)}
    minDate={dayjs('2019-08-01', dateFormat)}
    maxDate={dayjs('2020-10-31', dateFormat)}
  />
);



      {/* <div
        className="mx-auto p-4 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-start gap-4">
        {cards.map((card, index) => (
          <motion.div
            layoutId={`card-${card.id}-${id}`}
            key={index}
            onClick={() => setActive(card)}
            className="p-4 flex flex-col outline-transparent outline-2 transition-colors duration-300 hover:bg-base-300 hover:outline-primary rounded-xl cursor-pointer">
            <div className="flex gap-4 flex-col items-center w-full">
              <motion.div layoutId={`image-${card.id}-${id}`}>
                <img
                  src={card.image}
                  alt={card.title}
                  className="h-60 w-full rounded-lg object-cover object-center" />
              </motion.div>
              <div className="flex w-full justify-between items-center gap-2">
                <motion.div className="flex flex-col w-full px-2 gap-2 items-start">
                  <motion.span
                    layoutId={`title-${card.id}-${id}`}
                    className="font-medium text-neutral-800 dark:text-neutral-200 text-center md:text-left text-base">
                    {card.title}
                  </motion.span>
                  <motion.span
                    layoutId={`available-${card.id}-${id}`}
                    className={`badge badge-soft badge-lg ${card.available ? "badge-success" : "badge-secondary"}`}>
                    {card.available ? "Available Now" : `Available in ${card.getDaysLeft(contracts)} Days`}
                  </motion.span>
                </motion.div>
                  <motion.div
                    layoutId={`price-${card.id}-${id}`}
                    className="flex flex-col gap-1 w-1/3 text-center">
                    <span className="text-primary font-bold text-2xl border-b">{card.price}&nbsp;€</span>
                    <span className="text-sm">Per Day</span>
                  </motion.div>
              </div>
            </div>
          </motion.div>
        ))}
      </div> */}



      