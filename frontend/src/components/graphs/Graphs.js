import { useRef, useState } from "react"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Label,
  LineChart,
  Line,
  ReferenceLine
} from "recharts"

import Button from "../home/Button";

import * as html2canvas from 'html2canvas'
import { saveAs } from 'file-saver';

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
]
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
  "twelvth",
  "thirteenth",
  "fourteenth",
  "fiftheenth",
  "sixteenth",
  "seventeeth",
  "eighteenth",
  "ninteenth",
  "twentieth",
]
const lineColours = [
  // "#a340d9",
  // "#2ba14b",
  // "#0800ff",
  // "#f5a742",
  // "#00fffb",
  // "#a340d9",
  // "#2ba14b",
  // "#0800ff",
  // "#f5a742",
  // "#00fffb",
  // "#a340d9",
  // "#2ba14b",
  // "#0800ff",
  // "#f5a742",
  // "#00fffb",
  // "#a340d9",
  // "#2ba14b",
  // "#0800ff",
  // "#f5a742",
  // "#00fffb",
]

function refresh() {
  window.location.reload("Refresh")
}

function saveSshot() {
  html2canvas(document.querySelector("#capture")).then(canvas => {
    canvas.toBlob(function (blob) {
      saveAs(blob, new Date().toLocaleString('en-GB'));
    });
  });
}

function Graphs(props) {
  const leftHipRe = useRef(props.leftHip)
  const leftKneeRe = useRef(props.leftKnee)
  const leftAnkleRe = useRef(props.leftAnkle)

  const rightHipRe = useRef(props.rightHip)
  const rightKneeRe = useRef(props.rightKnee)
  const rightAnkleRe = useRef(props.rightAnkle)

  const leftHipReAvg = useRef(props.leftHipAvg)
  const leftKneeReAvg = useRef(props.leftKneeAvg)
  const leftAnkleReAvg = useRef(props.leftAnkleAvg)

  const rightHipReAvg = useRef(props.rightHipAvg)
  const rightKneeReAvg = useRef(props.rightKneeAvg)
  const rightAnkleReAvg = useRef(props.rightAnkleAvg)

  const leftSteps = useRef(props.leftSteps)
  const rightSteps = useRef(props.rightSteps)  
 
  const [showAverages, setShowAverages] = useState(true)

  const leftSwing = useRef(props.leftSwing)
  const rightSwing = useRef(props.rightSwing)
  // console.log(leftHipRe.current)

  // useEffect(() => {
  //   //
  // }, [])

  return (
    <div>
      <div id='graphBtns'><Button className='btn' text='&#128281;' onClick={() => refresh()}></Button><Button className='btn' text='&#x1F4BE;' onClick={() => saveSshot()}></Button></div>
      <div id='avgTickBox'><input type="checkbox" id="showAvgs" value="showAverages" checked={showAverages} onChange={() => setShowAverages(!showAverages)}></input><label> draw averages</label></div>
      <h1 className="graphTitle">Time-normalized (per-cycle)</h1>
      <div className="graphs" id='capture'>
        {showAverages ? (
          <>
            <LineChart
              width={570}
              height={350}
              data={leftHipReAvg.current}
              margin={{ top: 25, right: 0, left: 0, bottom: 0 }}
            >
              <XAxis dataKey="sample" type="number" domain={[0, 100]}>
                <Label value="Left Hip Flexion/Extension" offset={300} position="top" />
              </XAxis>
              <YAxis
                domain={[-45, 45]}
                allowDataOverflow={true}
                ticks={[-45, -40, -35, -30, -25, -20, -15, -10, -5, 0, 5, 10, 15, 20, 25, 30, 35, 40, 45]}
              />
              <CartesianGrid strokeDasharray="3 3" />
              <ReferenceLine x={leftSwing.current} stroke="red" strokeDasharray="3 3" strokeWidth={1} />
              <Tooltip
                formatter={(value) => value.toFixed(2)}
                wrapperStyle={{ top: -120, left: 150 }}
              />

              {(() => {
                let rows = []
                for (let i = 0; i < leftSteps.current -1; i++) {
                  rows.push(
                    <Line
                      key={lineNames[i]}
                      name={lineNames[i]}
                      type="basis"
                      dataKey={dataNames[i]}
                      dot={false}
                      stroke={lineColours[i]}
                      activeDot={{ r: 5 }}
                      strokeWidth={2}
                    />
                  )
                }
                return rows
              })()}

            </LineChart>
            <LineChart
              width={570}
              height={350}
              data={leftKneeReAvg.current}
              margin={{ top: 25, right: 0, left: 0, bottom: 0 }}
            >
              <XAxis dataKey="sample" type="number">
                <Label value="Left Knee Flexion/Extension" offset={300} position="top" />
              </XAxis>
              <YAxis
                domain={[-30, 100]}
                allowDataOverflow={true}
                ticks={[
                  -30, -25, -20, -15, -10, -5, 0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50,
                  55, 60, 65, 70, 75, 80, 85, 90, 95, 100,
                ]}
              />
              <CartesianGrid strokeDasharray="3 3" />
              <ReferenceLine x={leftSwing.current} stroke="red" strokeDasharray="3 3" strokeWidth={1} />
              <Tooltip
                formatter={(value) => value.toFixed(2)}
                wrapperStyle={{ top: -120, left: 150 }}
              />

              {(() => {
                let rows = []
                for (let i = 0; i < leftSteps.current -1; i++) {
                  rows.push(
                    <Line
                      key={lineNames[i]}
                      name={lineNames[i]}
                      type="basis"
                      dataKey={dataNames[i]}
                      dot={false}
                      stroke={lineColours[i]}
                      activeDot={{ r: 5 }}
                      strokeWidth={2}
                    />
                  )
                }
                return rows
              })()}
            </LineChart>
            <LineChart
              width={570}
              height={350}
              data={leftAnkleReAvg.current}
              margin={{ top: 25, right: 0, left: 0, bottom: 0 }}
            >
              <XAxis dataKey="sample" type="number">
                <Label value="Left Ankle Dorsiflexion/Plantarflexion" offset={300} position="top" />
              </XAxis>
              <YAxis
                domain={[-45, 45]}
                allowDataOverflow={true}
                ticks={[
                  -45, -40, -35, -30, -25, -20, -15, -10, -5, 0, 5, 10, 15, 20, 25, 30,
                  35, 40, 45
                ]}
              />
              <CartesianGrid strokeDasharray="3 3" />
              <ReferenceLine x={leftSwing.current} stroke="red" strokeDasharray="3 3" strokeWidth={1} />
              <Tooltip
                formatter={(value) => value.toFixed(2)}
                wrapperStyle={{ top: -120, left: 150 }}
              />

              {(() => {
                let rows = []
                for (let i = 0; i < leftSteps.current -1; i++) {
                  rows.push(
                    <Line
                      key={lineNames[i]}
                      name={lineNames[i]}
                      type="basis"
                      dataKey={dataNames[i]}
                      dot={false}
                      stroke={lineColours[i]}
                      activeDot={{ r: 5 }}
                      strokeWidth={2}
                    />
                  )
                }
                return rows
              })()}
            </LineChart><div className="break"></div>
            <LineChart
              width={570}
              height={350}
              data={rightHipReAvg.current}
              margin={{ top: 25, right: 0, left: 0, bottom: 0 }}
            >
              <XAxis dataKey="sample" type="number">
                <Label value="Right Hip Flexion/Extension" offset={300} position="top" />
              </XAxis>
              <YAxis
                domain={[-45, 45]}
                allowDataOverflow={true}
                ticks={[-45, -40, -35, -30, -25, -20, -15, -10, -5, 0, 5, 10, 15, 20, 25, 30, 35, 40, 45]}
              />
              <ReferenceLine x={rightSwing.current} stroke="red" strokeDasharray="3 3" strokeWidth={1} />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip
                formatter={(value) => value.toFixed(2)}
                wrapperStyle={{ top: -120, left: 150 }}
              />

              {(() => {
                let rows = []
                for (let i = 0; i < rightSteps.current -1; i++) {
                  rows.push(
                    <Line
                      key={lineNames[i]}
                      name={lineNames[i]}
                      type="basis"
                      dataKey={dataNames[i]}
                      dot={false}
                      stroke={lineColours[i]}
                      activeDot={{ r: 5 }}
                      strokeWidth={2}
                    />
                  )
                }
                return rows
              })()}
            </LineChart>
            <LineChart
              width={570}
              height={350}
              data={rightKneeReAvg.current}
              margin={{ top: 25, right: 0, left: 0, bottom: 0 }}
            >
              <XAxis dataKey="sample" type="number">
                <Label value="Right Knee Flexion/Extension" offset={300} position="top" />
              </XAxis>
              <YAxis
                domain={[-30, 100]}
                allowDataOverflow={true}
                ticks={[
                  -30, -25, -20, -15, -10, -5, 0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50,
                  55, 60, 65, 70, 75, 80, 85, 90, 95, 100,
                ]}
              />
              <ReferenceLine x={rightSwing.current} stroke="red" strokeDasharray="3 3" strokeWidth={1} />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip
                formatter={(value) => value.toFixed(2)}
                wrapperStyle={{ top: -120, left: 150 }}
              />

              {(() => {
                let rows = []
                for (let i = 0; i < rightSteps.current -1; i++) {
                  rows.push(
                    <Line
                      key={lineNames[i]}
                      name={lineNames[i]}
                      type="basis"
                      dataKey={dataNames[i]}
                      dot={false}
                      stroke={lineColours[i]}
                      activeDot={{ r: 5 }}
                      strokeWidth={2}
                    />
                  )
                }
                return rows
              })()}
            </LineChart>
            <LineChart
              width={570}
              height={350}
              data={rightAnkleReAvg.current}
              margin={{ top: 25, right: 0, left: 0, bottom: 0 }}
            >
              <XAxis dataKey="sample" type="number">
                <Label value="Right Ankle Dorsiflexion/Plantarflexion" offset={300} position="top" />
              </XAxis>
              <YAxis
                domain={[-45, 45]}
                allowDataOverflow={true}
                ticks={[
                  -45, -40, -35, -30, -25, -20, -15, -10, -5, 0, 5, 10, 15, 20, 25, 30,
                  35, 40, 45
                ]}
              />
              <ReferenceLine x={rightSwing.current} stroke="red" strokeDasharray="3 3" strokeWidth={1} />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip
                formatter={(value) => value.toFixed(2)}
                wrapperStyle={{ top: -120, left: 150 }}
              />

              {(() => {
                let rows = []
                for (let i = 0; i < rightSteps.current -1; i++) {
                  rows.push(
                    <Line
                      key={lineNames[i]}
                      name={lineNames[i]}
                      type="basis"
                      dataKey={dataNames[i]}
                      dot={false}
                      stroke={lineColours[i]}
                      activeDot={{ r: 5 }}
                      strokeWidth={2}
                    />
                  )
                }
                return rows
              })()}
            </LineChart>
          </>
        ) : (
          <>
            <LineChart
              width={570}
              height={350}
              data={leftHipRe.current}
              margin={{ top: 25, right: 0, left: 0, bottom: 0 }}
            >
              <XAxis dataKey="sample" type="number">
                <Label value="Left Hip Flexion/Extension" offset={300} position="top" />
              </XAxis>
              <YAxis
                domain={[-45, 45]}
                allowDataOverflow={true}
                ticks={[-45, -40, -35, -30, -25, -20, -15, -10, -5, 0, 5, 10, 15, 20, 25, 30, 35, 40, 45]}
              />
              <CartesianGrid strokeDasharray="3 3" />
              <ReferenceLine x={leftSwing.current} stroke="red" strokeDasharray="3 3" strokeWidth={1} />
              <Tooltip
                formatter={(value) => value.toFixed(2)}
                wrapperStyle={{ top: -120, left: 150 }}
              />

              {(() => {
                let rows = []
                for (let i = 0; i < leftSteps.current -1; i++) {
                  rows.push(
                    <Line
                      key={lineNames[i]}
                      name={lineNames[i]}
                      type="basis"
                      dataKey={dataNames[i]}
                      dot={false}
                      stroke={lineColours[i]}
                      activeDot={{ r: 5 }}
                      strokeWidth={1}                    
                    />
                  )
                }
                return rows
              })()}

            </LineChart>
            <LineChart
              width={570}
              height={350}
              data={leftKneeRe.current}
              margin={{ top: 25, right: 0, left: 0, bottom: 0 }}
            >
              <XAxis dataKey="sample" type="number">
                <Label value="Left Knee Flexion/Extension" offset={300} position="top" />
              </XAxis>
              <YAxis
                domain={[-30, 100]}
                allowDataOverflow={true}
                ticks={[
                  -30, -25, -20, -15, -10, -5, 0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50,
                  55, 60, 65, 70, 75, 80, 85, 90, 95, 100,
                ]}
              />
              <CartesianGrid strokeDasharray="3 3" />
              <ReferenceLine x={leftSwing.current} stroke="red" strokeDasharray="3 3" strokeWidth={1} />
              <Tooltip
                formatter={(value) => value.toFixed(2)}
                wrapperStyle={{ top: -120, left: 150 }}
              />

              {(() => {
                let rows = []
                for (let i = 0; i < leftSteps.current -1; i++) {
                  rows.push(
                    <Line
                      key={lineNames[i]}
                      name={lineNames[i]}
                      type="basis"
                      dataKey={dataNames[i]}
                      dot={false}
                      stroke={lineColours[i]}
                      activeDot={{ r: 5 }}
                    />
                  )
                }
                return rows
              })()}
            </LineChart>
            <LineChart
              width={570}
              height={350}
              data={leftAnkleRe.current}
              margin={{ top: 25, right: 0, left: 0, bottom: 0 }}
            >
              <XAxis dataKey="sample" type="number">
                <Label value="Left Ankle Dorsiflexion/Plantarflexion" offset={300} position="top" />
              </XAxis>
              <YAxis
                domain={[-45, 45]}
                allowDataOverflow={true}
                ticks={[
                  -45, -40, -35, -30, -25, -20, -15, -10, -5, 0, 5, 10, 15, 20, 25, 30,
                  35, 40, 45
                ]}
              />
              <CartesianGrid strokeDasharray="3 3" />
              <ReferenceLine x={leftSwing.current} stroke="red" strokeDasharray="3 3" strokeWidth={1} />
              <Tooltip
                formatter={(value) => value.toFixed(2)}
                wrapperStyle={{ top: -120, left: 150 }}
              />

              {(() => {
                let rows = []
                for (let i = 0; i < leftSteps.current -1; i++) {
                  rows.push(
                    <Line
                      key={lineNames[i]}
                      name={lineNames[i]}
                      type="basis"
                      dataKey={dataNames[i]}
                      dot={false}
                      stroke={lineColours[i]}
                      activeDot={{ r: 5 }}
                    />
                  )
                }
                return rows
              })()}
            </LineChart><div className="break"></div>
            <LineChart
              width={570}
              height={350}
              data={rightHipRe.current}
              margin={{ top: 25, right: 0, left: 0, bottom: 0 }}
            >
              <XAxis dataKey="sample" type="number">
                <Label value="Right Hip Flexion/Extension" offset={300} position="top" />
              </XAxis>
              <YAxis
                domain={[-45, 45]}
                allowDataOverflow={true}
                ticks={[-45, -40, -35, -30, -25, -20, -15, -10, -5, 0, 5, 10, 15, 20, 25, 30, 35, 40, 45]}
              />
              <ReferenceLine x={rightSwing.current} stroke="red" strokeDasharray="3 3" strokeWidth={1} />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip
                formatter={(value) => value.toFixed(2)}
                wrapperStyle={{ top: -120, left: 150 }}
              />

              {(() => {
                let rows = []
                for (let i = 0; i < rightSteps.current -1; i++) {
                  rows.push(
                    <Line
                      key={lineNames[i]}
                      name={lineNames[i]}
                      type="basis"
                      dataKey={dataNames[i]}
                      dot={false}
                      stroke={lineColours[i]}
                      activeDot={{ r: 5 }}
                    />
                  )
                }
                return rows
              })()}
            </LineChart>
            <LineChart
              width={570}
              height={350}
              data={rightKneeRe.current}
              margin={{ top: 25, right: 0, left: 0, bottom: 0 }}
            >
              <XAxis dataKey="sample" type="number">
                <Label value="Right Knee Flexion/Extension" offset={300} position="top" />
              </XAxis>
              <YAxis
                domain={[-30, 100]}
                allowDataOverflow={true}
                ticks={[
                  -30, -25, -20, -15, -10, -5, 0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50,
                  55, 60, 65, 70, 75, 80, 85, 90, 95, 100,
                ]}
              />
              <ReferenceLine x={rightSwing.current} stroke="red" strokeDasharray="3 3" strokeWidth={1} />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip
                formatter={(value) => value.toFixed(2)}
                wrapperStyle={{ top: -120, left: 150 }}
              />

              {(() => {
                let rows = []
                for (let i = 0; i < rightSteps.current -1; i++) {
                  rows.push(
                    <Line
                      key={lineNames[i]}
                      name={lineNames[i]}
                      type="basis"
                      dataKey={dataNames[i]}
                      dot={false}
                      stroke={lineColours[i]}
                      activeDot={{ r: 5 }}
                    />
                  )
                }
                return rows
              })()}
            </LineChart>
            <LineChart
              width={570}
              height={350}
              data={rightAnkleRe.current}
              margin={{ top: 25, right: 0, left: 0, bottom: 0 }}
            >
              <XAxis dataKey="sample" type="number">
                <Label value="Right Ankle Dorsiflexion/Plantarflexion" offset={300} position="top" />
              </XAxis>
              <YAxis
                domain={[-45, 45]}
                allowDataOverflow={true}
                ticks={[
                  -45, -40, -35, -30, -25, -20, -15, -10, -5, 0, 5, 10, 15, 20, 25, 30,
                  35, 40, 45
                ]}
              />
              <ReferenceLine x={rightSwing.current} stroke="red" strokeDasharray="3 3" strokeWidth={1} />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip
                formatter={(value) => value.toFixed(2)}
                wrapperStyle={{ top: -120, left: 150 }}
              />

              {(() => {
                let rows = []
                for (let i = 0; i < rightSteps.current -1; i++) {
                  rows.push(
                    <Line
                      key={lineNames[i]}
                      name={lineNames[i]}
                      type="basis"
                      dataKey={dataNames[i]}
                      dot={false}
                      stroke={lineColours[i]}
                      activeDot={{ r: 5 }}
                    />
                  )
                }
                return rows
              })()}
            </LineChart>

          </>
        )}
      </div>
    </div>

  )
}

export default Graphs
