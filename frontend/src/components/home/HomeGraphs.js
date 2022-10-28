import { useEffect, useState, useRef } from 'react'
import { ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Label, Legend, LineChart, Line, ReferenceLine } from 'recharts'

function HomeGraphs(props) {

    const leftHipRe = useRef(props.leftHip)
    const leftKneeRe = useRef(props.leftKnee)
    const leftAnkleRe = useRef(props.leftAnkle)

    const rightHipRe = useRef(props.rightHip)
    const rightKneeRe = useRef(props.rightKnee)
    const rightAnkleRe = useRef(props.rightAnkle) 
    const [timer, setTimer] = useState(new Date());     

    useEffect(() => {        

        const interval = setInterval(() => {            
            setTimer(new Date());
        }, 100);

        // This is important, you must clear your interval when component unmounts
        return () => clearInterval(interval);

    }, [])    

    return (
        <>
            <div className='homeGraph'> 
          
                    <LineChart width={700} height={120} data={leftHipRe.current}
                        margin={{ top: 10, right: 10, left: 70, bottom: 0 }}
                        key={Math.random()}>
                        <XAxis dataKey='angle' hide='true'></XAxis>
                        <YAxis domain={[-30, 20]} allowDataOverflow={true} ticks={[-30, -25, -20, -15, -10, -5, 0, 5, 10, 15, 20]} ><Label value="L Hip" position="left"></Label></YAxis>
                        <CartesianGrid strokeDasharray='3 3' />

                        {/* <Tooltip
                            formatter={(value) => value.toFixed(2)}
                            wrapperStyle={{ top: -120, left: 150 }}
                        /> */}
                        <Line key='angle'
                            name='angle'
                            type='monotone'
                            isAnimationActive={false}
                            dataKey='angle'
                            dot={false}
                            stroke='#a340d9'
                            activeDot={{ r: 5 }} />
                    </LineChart>
                    <LineChart width={700} height={120} data={leftKneeRe.current}
                        margin={{ top: 10, right: 10, left: 70, bottom: 0 }}
                        key={Math.random()}>
                        <XAxis dataKey='angle' hide='true'></XAxis>
                        <YAxis domain={[-20, 100]} allowDataOverflow={true} ticks={[-20, -15, -10, -5, 0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100]} ><Label value="L Knee" position="left"></Label></YAxis>
                        <CartesianGrid strokeDasharray='3 3' />

                        {/* <Tooltip
                            formatter={(value) => value.toFixed(2)}
                            wrapperStyle={{ top: -120, left: 150 }}
                        /> */}
                        <Line key='angle'
                            name='angle'
                            type='monotone'
                            isAnimationActive={false}
                            dataKey='angle'
                            dot={false}
                            stroke='#a340d9'
                            activeDot={{ r: 5 }} />
                    </LineChart>
                    <LineChart width={700} height={120} data={leftAnkleRe.current}
                        margin={{ top: 10, right: 10, left: 70, bottom: 0 }}
                        key={Math.random()}>
                        <XAxis dataKey='angle' hide='true'></XAxis>
                        <YAxis domain={[-40, 40]} allowDataOverflow={true} ticks={[-40, -35, -30, -25, -20, -15, -10, -5, 0, 5, 10, 15, 20, 25, 30, 35, 40]}  ><Label value="L Ankle" position="left"></Label></YAxis>
                        <CartesianGrid strokeDasharray='3 3' />

                        {/* <Tooltip
                            formatter={(value) => value.toFixed(2)}
                            wrapperStyle={{ top: -120, left: 150 }}
                        /> */}
                        <Line key='angle'
                            name='angle'
                            type='monotone'
                            isAnimationActive={false}
                            dataKey='angle'
                            dot={false}
                            stroke='#a340d9'
                            activeDot={{ r: 5 }} />
                    </LineChart>
                    <LineChart width={700} height={120} data={rightHipRe.current}
                        margin={{ top: 10, right: 10, left: 70, bottom: 0 }}
                        key={Math.random()}>
                        <XAxis dataKey='angle' hide='true'></XAxis>
                        <YAxis domain={[-30, 20]} allowDataOverflow={true} ticks={[-30, -25, -20, -15, -10, -5, 0, 5, 10, 15, 20]} ><Label value="R Hip" position="left"></Label></YAxis>
                        <CartesianGrid strokeDasharray='3 3' />

                        {/* <Tooltip
                            formatter={(value) => value.toFixed(2)}
                            wrapperStyle={{ top: -120, left: 150 }}
                        /> */}
                        <Line key='angle'
                            name='angle'
                            type='monotone'
                            isAnimationActive={false}
                            dataKey='angle'
                            dot={false}
                            stroke='#a340d9'
                            activeDot={{ r: 5 }} />
                    </LineChart>
                    <LineChart width={700} height={120} data={rightKneeRe.current}
                        margin={{ top: 10, right: 10, left: 70, bottom: 0 }}
                        key={Math.random()}>
                        <XAxis dataKey='angle' hide='true'></XAxis>
                        <YAxis domain={[-20, 100]} allowDataOverflow={true} ticks={[-20, -15, -10, -5, 0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100]} ><Label value="R Knee" position="left"></Label></YAxis>
                        <CartesianGrid strokeDasharray='3 3' />

                        {/* <Tooltip
                            formatter={(value) => value.toFixed(2)}
                            wrapperStyle={{ top: -120, left: 150 }}
                        /> */}
                        <Line key='angle'
                            name='angle'
                            type='monotone'
                            isAnimationActive={false}
                            dataKey='angle'
                            dot={false}
                            stroke='#a340d9'
                            activeDot={{ r: 5 }} />
                    </LineChart>
                    <LineChart width={700} height={120} data={rightAnkleRe.current}
                        margin={{ top: 10, right: 10, left: 70, bottom: 0 }}
                        key={Math.random()}>
                        <XAxis dataKey='angle' hide='true'></XAxis>
                        <YAxis domain={[-40, 40]} allowDataOverflow={true} ticks={[-40, -35, -30, -25, -20, -15, -10, -5, 0, 5, 10, 15, 20, 25, 30, 35, 40]}  ><Label value="R Ankle" position="left"></Label></YAxis>
                        <CartesianGrid strokeDasharray='3 3' />

                        {/* <Tooltip
                            formatter={(value) => value.toFixed(2)}
                            wrapperStyle={{ top: -120, left: 150 }}
                        /> */}
                        <Line key='angle'
                            name='angle'
                            type='monotone'
                            isAnimationActive={false}
                            dataKey='angle'
                            dot={false}
                            stroke='#a340d9'
                            activeDot={{ r: 5 }} />
                    </LineChart>
               
            </div>
        </>
    )
}

export default HomeGraphs;
