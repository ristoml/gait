import { useEffect, useState, useRef } from 'react'
import { Pose, POSE_CONNECTIONS } from "@mediapipe/pose"
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils"
import Graphs from "../components/graphs/Graphs"
import HomeGraphs from '../components/home/HomeGraphs'
import * as dPp from "../components/graphs/DataPostprocess"
import * as angleH from "../components/home/AngleHelper"

// const imageMimeType = /image\/(png|jpg|jpeg)/i
let poseResults = []

let calibrated = false
let mediapipeCalibrated = false

let startTime
let calibrationTick = 0


function Home() {
    const [file, setFile] = useState(null)
    //const [fileDataURL, setFileDataURL] = useState(null) //poista?
    const [videoSrc, setVideoSrc] = useState(null)
    const [poseTest, setPose] = useState(null)
    const [showVid, setShowVid] = useState(false)
    const [showGraphs, setShowGraphs] = useState(false)   
    const counter = useRef(0)
    const canvasRef = useRef(null)
    const videoRef = useRef(null)

    const leftHipRe = useRef([])
    const leftKneeRe = useRef([])
    const leftAnkleRe = useRef([])

    const rightHipRe = useRef([])
    const rightKneeRe = useRef([])
    const rightAnkleRe = useRef([])


    function onResults(results) {
        const canvasElement = canvasRef.current
        const canvasCtx = canvasElement.getContext("2d")

        //console.log(results)
        if (results.poseLandmarks) {
            if (!calibrated) {
                if (results.poseWorldLandmarks[30].visibility > 0.2) {
                    startTime = Date.now()
                    calibrated = true
                    videoRef.current.currentTime = 0
                    videoRef.current.loop = true
                    console.log("calibrated")
                    return
                }
            }

            if (calibrated && !mediapipeCalibrated) {
                const videoWidth = videoRef.current.videoWidth
                const videoHeight = videoRef.current.videoHeight
                canvasRef.current.width = videoWidth / 1.33
                canvasRef.current.height = videoHeight / 1.33
                canvasCtx.clearRect(0, 0, videoWidth, videoHeight)
                if (Date.now() - startTime > 999) {
                    calibrationTick++
                }
                if (Date.now() - startTime > 1999) {
                    console.log(calibrationTick)
                    if (calibrationTick / 101 > 0.1) {
                        videoRef.current.playbackRate = calibrationTick / 101 * 1
                        // videoRef.current.playbackRate = 0.15
                        console.log('playbackrate adjusted to')
                        console.log(videoRef.current.playbackRate)
                        mediapipeCalibrated = true
                        videoRef.current.currentTime = 0
                        videoRef.current.loop = false
                        setShowVid(true)
                    } else {
                        // videoRef.current.playbackRate = 0.1
                        videoRef.current.playbackRate = 0.15
                        console.log('playbackrate adjusted to')
                        console.log(videoRef.current.playbackRate)
                        mediapipeCalibrated = true
                        videoRef.current.currentTime = 0
                        videoRef.current.loop = false
                        setShowVid(true)
                    }
                }
            }
            if (calibrated && mediapipeCalibrated) {
                counter.current++
                canvasCtx.drawImage(
                    results.image,
                    0,
                    0,
                    canvasElement.width,
                    canvasElement.height
                )
                drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
                    color: "#77bdff",
                    lineWidth: 2,
                });
                drawLandmarks(canvasCtx, results.poseLandmarks, {
                    color: "#bd77ff",
                    lineWidth: 1,
                });
                poseResults.push({ data: results, time: Date.now() })
                if (counter.current % 5 === 0) {
                    angleH.updateAngleHelper(results)
                    leftHipRe.current.push({ angle: angleH.getHipAngle(true) })
                    leftKneeRe.current.push({ angle: angleH.getKneeAngle(true) })
                    leftAnkleRe.current.push({ angle: angleH.getAnkleAngle(true) })

                    rightHipRe.current.push({ angle: angleH.getHipAngle(false) })
                    rightKneeRe.current.push({ angle: angleH.getKneeAngle(false) })
                    rightAnkleRe.current.push({ angle: angleH.getAnkleAngle(false) })
                }
            }
        }
    }

    const changeHandler = (e) => {

        const file = e.target.files[0];

        setFile(file)

        videoRef.current = document.getElementsByClassName('input_video')[0]

        async function onFrame() {
            if (!videoRef.current.ended) {

                await poseTest.send({
                    image: videoRef.current
                })
                await new Promise(requestAnimationFrame)
                onFrame()
            } else if (videoRef.current.ended) {
                dPp.processResults(poseResults)
                setShowGraphs(true)
            }
            else {// calibrated=false tänne?
                setTimeout(onFrame, 500)
            }
        }


        videoRef.current.onloadeddata = (evt) => {
            videoRef.current.playbackRate = 1
            videoRef.current.play()
            onFrame()
        }
    }

    useEffect(() => {
        const pose = new Pose({
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
            },
        })

        pose.setOptions({
            modelComplexity: 2,
            smoothLandmarks: true,
            enableSegmentation: false,
            smoothSegmentation: false,
            minDetectionConfidence: 0.1,
            minTrackingConfidence: 0.1,
        })

        setPose(pose)
        pose.onResults(onResults)

        let fileReader, isCancel = false
        if (file) {
            fileReader = new FileReader()
            fileReader.onload = (e) => {
                const { result } = e.target
                if (result && !isCancel) {
                    calibrated = false
                    setVideoSrc(result)
                    //setFileDataURL(result)
                }
            }
            fileReader.readAsDataURL(file)
        }


        return () => {
            isCancel = true
            if (fileReader && fileReader.readyState === 1) {
                fileReader.abort()
            }
        }

    }, [file])


    return (

        <>

            {!showGraphs ? (

                <> <form>
                    <p style={{ display: file ? 'none' : 'block' }} >
                        <input
                            className='videoLabel'
                            type="file"
                            id='video'
                            accept='.mp4, .ogg, .webm'
                            onChange={changeHandler}
                        />
                    </p>
                </form>
                    <div className="container">
                        <h1 className='loading' style={{ display: file && !showVid ? 'block' : 'none' }}>Loading... </h1>
                        <div className='homeContainer'>
                            <div className='canvasDiv'>
                                <video style={{ display: 'none' }} className="input_video" src={videoSrc} type='video/mp4' muted="muted" width="960" height="540"></video>
                                <div style={{ display: showVid ? 'block' : 'none' }} className="canvas-container" >
                                    <canvas ref={canvasRef} className="output_canvas" >
                                    </canvas>
                                </div>
                            </div>

                            <div style={{ display: showVid ? 'block' : 'none' }}>
                                <HomeGraphs
                                    leftHip={leftHipRe.current}
                                    leftKnee={leftKneeRe.current}
                                    leftAnkle={leftAnkleRe.current}
                                    rightHip={rightHipRe.current}
                                    rightKnee={rightKneeRe.current}
                                    rightAnkle={rightAnkleRe.current}></HomeGraphs>
                            </div>
                        </div>
                    </div>
                </>) : (
                <Graphs leftHip={dPp.getLeftHipAngle()}
                    leftKnee={dPp.getLeftKneeAngle()}
                    leftAnkle={dPp.getLeftAnkleAngle()}
                    rightHip={dPp.getRightHipAngle()}
                    rightKnee={dPp.getRightKneeAngle()}
                    rightAnkle={dPp.getRightAnkleAngle()}
                    steps={dPp.getSteps()}
                ></Graphs>)}
        </>
    )
}
export default Home