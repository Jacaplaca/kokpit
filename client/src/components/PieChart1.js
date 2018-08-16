import React, { Component } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  LabelList,
  ResponsiveContainer
} from 'recharts';
import { scaleLog } from 'd3-scale';
const scale = scaleLog().base(Math.E);

const colors = [
  '#1f77b4',
  '#ff7f0e',
  '#2ca02c',
  '#d62728',
  '#9467bd',
  '#8c564b',
  '#e377c2',
  '#7f7f7f',
  '#bcbd22',
  '#17becf'
];
// const data = [
//   { name: 'Page A', uv: 4000, female: 2400, male: 2400 },
//   { name: 'Page B', uv: 3000, female: 1398, male: 2210 },
//   { name: 'Page C', uv: 2000, female: 9800, male: 2290 },
//   { name: 'Page D', uv: 2780, female: 3908, male: 2000 },
//   { name: 'Page E', uv: 1890, female: 4800, male: 2181 },
//   { name: 'Page F', uv: 2390, female: 3800, male: 2500 },
//   { name: 'Page G', uv: 3490, female: 4300, male: 2100 }
// ];
// const data = [
//   { name: 'Page A', value: 2400 },
//   { name: 'Page B', value: 2210 },
//   { name: 'Page C', value: 2290 },
//   { name: 'Page D', value: 2000 },
//   { name: 'Page E', value: 2181 },
//   { name: 'Page F', value: 2500 },
//   { name: 'Page G', value: 2100 }
// ];

const getPath = (x, y, width, height) => {
  return `M${x},${y + height}
          C${x + width / 3},${y + height} ${x + width / 2},${y +
    height / 3} ${x + width / 2}, ${y}
          C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y +
    height} ${x + width}, ${y + height}
          Z`;
};

const TriangleBar = props => {
  const { fill, x, y, width, height } = props;

  return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
};

// TriangleBar.propTypes = {
//   fill: PropTypes.string,
//   x: PropTypes.number,
//   y: PropTypes.number,
//   width: PropTypes.number,
//   height: PropTypes.number,
// };

class PieChart1 extends Component {
  render() {
    const data = this.props.dane;
    const nazwa = this.props.label;
    return (
      <div style={{ height: '190px', width: '100%' }}>
        {/* <h3>{this.props.label}</h3> */}
        <ResponsiveContainer width="100%">
          <BarChart
            // width={'50%'}
            height={190}
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 35 }}>
            <XAxis
              angle={-11}
              // width={5}
              interval={0}
              // tick={{ fontSize: 13 }}
              // tick={<CustomizedTick />}
              // ticks={nazwa => `${nazwa}zz`}
              // tickFormatter={el => `${el}zz`}
              // multiline
              dataKey="name"
              label={{
                value: nazwa,
                position: 'insideBottomRight',
                offset: -15
              }}
              // scale={scale}
              // scale="linear"
            />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Bar
              dataKey="value"
              fill="#8884d8"
              shape={<TriangleBar />}
              // label={{ position: 'top' }}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % 20]} />
              ))}
              <LabelList
                dataKey="value_format"
                position="top"
                formatter={val => {
                  const splituje = val.split(',');
                  return `${splituje[0]}`;
                }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

export default PieChart1;
