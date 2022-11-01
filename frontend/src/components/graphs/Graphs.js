import { useEffect, useRef } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Label,
  LineChart,
  Line,
} from "recharts";

const lineNames = [
  "1st",
  "2nd",
  "3rd",
  "4th",
  "5th",
  "6th",
  "7th",
  "8th",
  "9th",
  "10th",
  "11th",
  "12th",
  "13th",
  "14th",
  "15th",
  "16th",
  "17th",
  "18th",
  "19th",
  "20th",
];
const dataNames = [
  "first",
  "second",
  "third",
  "fourth",
  "fifth",
  "sixth",
  "seventh",
  "eighth",
  "ninth",
  "tenth",
  "eleventh",
  "twelveth",
  "thirteenth",
  "fourteenth",
  "fifteenth",
  "sixteenth",
  "seventeeth",
  "eighteenth",
  "ninteenth",
  "twentieth",
];
const lineColours = [
  "#a340d9",
  "#2ba14b",
  "#0800ff",
  "#f5a742",
  "#00fffb",
  "#a340d9",
  "#2ba14b",
  "#0800ff",
  "#f5a742",
  "#00fffb",
  "#a340d9",
  "#2ba14b",
  "#0800ff",
  "#f5a742",
  "#00fffb",
  "#a340d9",
  "#2ba14b",
  "#0800ff",
  "#f5a742",
  "#00fffb",
];

function refresh() {
  window.location.reload("Refresh");
}

function Graphs(props) {
  const leftHipRe = useRef(props.leftHip);
  const leftKneeRe = useRef(props.leftKnee);
  const leftAnkleRe = useRef(props.leftAnkle);

  const rightHipRe = useRef(props.rightHip);
  const rightKneeRe = useRef(props.rightKnee);
  const rightAnkleRe = useRef(props.rightAnkle);

  const steps = useRef(props.steps);

  // console.log(leftHipRe.current)

  useEffect(() => {
    //
  }, []);

  return (
    <div>
      <h1>Time-normalized (per-cycle)</h1>
      <div className="graphs">
        <LineChart
          width={590}
          height={370}
          data={leftHipRe.current}
          margin={{ top: 25, right: 0, left: 0, bottom: 0 }}
        >
          <XAxis dataKey="sample" type="number">
            <Label value="Left Hip Angle" offset={320} position="top" />
          </XAxis>
          <YAxis
            domain={[-30, 20]}
            allowDataOverflow={true}
            ticks={[-30, -25, -20, -15, -10, -5, 0, 5, 10, 15, 20]}
          />
          <CartesianGrid strokeDasharray="3 3" />

          <Tooltip
            formatter={(value) => value.toFixed(2)}
            wrapperStyle={{ top: -120, left: 150 }}
          />

          {(() => {
            let rows = [];
            for (let i = 0; i < steps.current; i++) {
              rows.push(
                <Line
                  key={lineNames[i]}
                  name={lineNames[i]}
                  type="monotone"
                  dataKey={dataNames[i]}
                  dot={false}
                  stroke={lineColours[i]}
                  activeDot={{ r: 5 }}
                />
              );
            }
            return rows;
          })()}
        </LineChart>
        <LineChart
          width={590}
          height={370}
          data={leftKneeRe.current}
          margin={{ top: 25, right: 0, left: 0, bottom: 0 }}
        >
          <XAxis dataKey="sample" type="number">
            <Label value="Left Knee Angle" offset={320} position="top" />
          </XAxis>
          <YAxis
            domain={[-20, 100]}
            allowDataOverflow={true}
            ticks={[
              -20, -15, -10, -5, 0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55,
              60, 65, 70, 75, 80, 85, 90, 95, 100,
            ]}
          />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip
            formatter={(value) => value.toFixed(2)}
            wrapperStyle={{ top: -120, left: 150 }}
          />

          {(() => {
            let rows = [];
            for (let i = 0; i < steps.current; i++) {
              rows.push(
                <Line
                  key={lineNames[i]}
                  name={lineNames[i]}
                  type="monotone"
                  dataKey={dataNames[i]}
                  dot={false}
                  stroke={lineColours[i]}
                  activeDot={{ r: 5 }}
                />
              );
            }
            return rows;
          })()}
        </LineChart>
        <LineChart
          width={590}
          height={370}
          data={leftAnkleRe.current}
          margin={{ top: 25, right: 0, left: 0, bottom: 0 }}
        >
          <XAxis dataKey="sample" type="number">
            <Label value="Left Ankle Joint" offset={320} position="top" />
          </XAxis>
          <YAxis
            domain={[-40, 40]}
            allowDataOverflow={true}
            ticks={[
              -40, -35, -30, -25, -20, -15, -10, -5, 0, 5, 10, 15, 20, 25, 30,
              35, 40,
            ]}
          />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip
            formatter={(value) => value.toFixed(2)}
            wrapperStyle={{ top: -120, left: 150 }}
          />

          {(() => {
            let rows = [];
            for (let i = 0; i < steps.current; i++) {
              rows.push(
                <Line
                  key={lineNames[i]}
                  name={lineNames[i]}
                  type="monotone"
                  dataKey={dataNames[i]}
                  dot={false}
                  stroke={lineColours[i]}
                  activeDot={{ r: 5 }}
                />
              );
            }
            return rows;
          })()}
        </LineChart>
        <LineChart
          width={590}
          height={370}
          data={rightHipRe.current}
          margin={{ top: 25, right: 0, left: 0, bottom: 0 }}
        >
          <XAxis dataKey="sample" type="number">
            <Label value="Right Hip Angle" offset={320} position="top" />
          </XAxis>
          <YAxis
            domain={[-30, 20]}
            allowDataOverflow={true}
            ticks={[-30, -25, -20, -15, -10, -5, 0, 5, 10, 15, 20]}
          />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip
            formatter={(value) => value.toFixed(2)}
            wrapperStyle={{ top: -120, left: 150 }}
          />

          {(() => {
            let rows = [];
            for (let i = 0; i < steps.current; i++) {
              rows.push(
                <Line
                  key={lineNames[i]}
                  name={lineNames[i]}
                  type="monotone"
                  dataKey={dataNames[i]}
                  dot={false}
                  stroke={lineColours[i]}
                  activeDot={{ r: 5 }}
                />
              );
            }
            return rows;
          })()}
        </LineChart>
        <LineChart
          width={590}
          height={370}
          data={rightKneeRe.current}
          margin={{ top: 25, right: 0, left: 0, bottom: 0 }}
        >
          <XAxis dataKey="sample" type="number">
            <Label value="Right Knee Angle" offset={320} position="top" />
          </XAxis>
          <YAxis
            domain={[-20, 100]}
            allowDataOverflow={true}
            ticks={[
              -20, -15, -10, -5, 0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55,
              60, 65, 70, 75, 80, 85, 90, 95, 100,
            ]}
          />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip
            formatter={(value) => value.toFixed(2)}
            wrapperStyle={{ top: -120, left: 150 }}
          />

          {(() => {
            let rows = [];
            for (let i = 0; i < steps.current; i++) {
              rows.push(
                <Line
                  key={lineNames[i]}
                  name={lineNames[i]}
                  type="monotone"
                  dataKey={dataNames[i]}
                  dot={false}
                  stroke={lineColours[i]}
                  activeDot={{ r: 5 }}
                />
              );
            }
            return rows;
          })()}
        </LineChart>
        <LineChart
          width={590}
          height={370}
          data={rightAnkleRe.current}
          margin={{ top: 25, right: 0, left: 0, bottom: 0 }}
        >
          <XAxis dataKey="sample" type="number">
            <Label value="Right Ankle Joint" offset={320} position="top" />
          </XAxis>
          <YAxis
            domain={[-40, 40]}
            allowDataOverflow={true}
            ticks={[
              -40, -35, -30, -25, -20, -15, -10, -5, 0, 5, 10, 15, 20, 25, 30,
              35, 40,
            ]}
          />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip
            formatter={(value) => value.toFixed(2)}
            wrapperStyle={{ top: -120, left: 150 }}
          />

          {(() => {
            let rows = [];
            for (let i = 0; i < steps.current; i++) {
              rows.push(
                <Line
                  key={lineNames[i]}
                  name={lineNames[i]}
                  type="monotone"
                  dataKey={dataNames[i]}
                  dot={false}
                  stroke={lineColours[i]}
                  activeDot={{ r: 5 }}
                />
              );
            }
            return rows;
          })()}
        </LineChart>
      </div>
      <input
        type="button"
        value="Go back"
        onClick={() => {
          refresh(this);
        }}
      />
    </div>
  );
}

export default Graphs;
