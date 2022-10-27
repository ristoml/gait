import { useEffect, useState, useRef } from 'react'
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ReferenceLine } from 'recharts'



function Graphs(props) {
 
    const leftHipRe = useRef(props.leftHip)
    const leftKneeRe = useRef(props.leftKnee)
    const leftAnkleRe = useRef(props.leftAnkle)

    const rightHipRe = useRef(props.rightHip)
    const rightKneeRe = useRef(props.rightKnee)
    const rightAnkleRe = useRef(props.rightAnkle)

    const ready = useRef(false)
    const steps = useRef(props.steps)




    useEffect(() => {       

        console.log(steps.current)
        console.log(leftHipRe.current)
        console.log(leftKneeRe.current)
        console.log(leftAnkleRe.current)
        console.log(rightHipRe.current)
        console.log(rightKneeRe.current)
        console.log(rightAnkleRe.current)


    }, [])

    return (
        <div className="Graphs">
            {/* {ready && (<>
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
