import { useEffect, useState, useRef } from 'react'
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ReferenceLine } from 'recharts'
import { resampleData } from './Resample'

// let leftHip = [], leftKnee = [], leftAnkle = []
// let rightHip = [], rightKnee = [], rightAnkle = []

function Graphs({ leftGaitData, rightGaitData }) {

    // const [leftData, setLeftData] = useState(leftGaitData)
    // const [rightData, setRightData] = useState(rightGaitData)
    


    useEffect(() => {
        // data.data.map((dataobj) => {
        //     splitAnglevalues[dataobj.counter] = temparray
        //     if (counterNow === dataobj.counter - 1) {
        //       counterNow = dataobj.counter
        //       temparray = []
        //     }
        //     temparray.push(dataobj.angle)
        //     return ''
        //   })
        console.log(leftGaitData)



    }, [])

    return (
        <div className="Graphs">
            {/* {leftHip.current && (<>
                <LineChart width={590} height={370} data={leftHipRE.current}
                    margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <XAxis dataKey='sample' />
                    <YAxis domain={[-25, 25]} allowDataOverflow={true} ticks={[-25, -20, -15, -10, -5, 0, 5, 10, 15, 20, 25]} />
                    <CartesianGrid strokeDasharray='3 3' />
                    <Tooltip
                        formatter={(value) => value.toFixed(2)}
                        wrapperStyle={{ top: -120, left: 150 }}
                    />
                    <ReferenceLine
                        stroke='red'
                        strokeWidth={2}
                        y={-10}
                    />
                    <ReferenceLine
                        stroke='red'
                        strokeWidth={2}
                        y={10}
                    />
                    <Legend verticalAlign='top' height={50} />
                    <Line key='wot'
                        name='Hip'
                        type='monotone'
                        dataKey='Hip'
                        dot={false}
                        stroke='#a340d9'
                        activeDot={{ r: 5 }} />
                </LineChart>
            </>)} */}
        </div>
    )
}

export default Graphs;
