import { useEffect, useState, useRef } from 'react'
import { Pose, POSE_CONNECTIONS } from "@mediapipe/pose"
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils"
import * as angleH from "../components/home/AngleHelper"

// const imageMimeType = /image\/(png|jpg|jpeg)/i
let leftData = []
let rightData = []
let tempArray = []

let rightPrevHeelX = 0
let leftPrevHeelX = 0

let rightHeelRepeated = 0
let leftHeelRepeated = 0

let rightToeRepeated = 0
let leftToeRepeated = 0

let rightPrevToeR = 0
let leftPrevToeR = 0

let rightLegForward = false
let leftLegForward = false

let rightPrevToeX = 0
let leftPrevToeX = 0


// let rightPrev2ToeX = 0
// let leftPrevT2oeX = 0

let rightStep = false
let leftStep = false

let calibrated = false
let mediapipeCalibrated = false

let startTime, prevTime
let calibrationTick = 0
let lastCalibrationTick

function Home() {
    const [file, setFile] = useState(null)
    //const [fileDataURL, setFileDataURL] = useState(null) //poista?
    const [videoSrc, setVideoSrc] = useState(null)
    const [poseTest, setPose] = useState(null)
    // const [firstRun, setFirstRun] = useState(true)
    // const canvasRef = useRef(null)
    const videoRef = useRef(null)

    function onResults(results) {
        //console.log(results)
        if (results.poseLandmarks) {
            if (!calibrated) {
                if (results.poseWorldLandmarks[30].visibility > 0.2) {
                    startTime = Date.now()
                    rightPrevHeelX = results.poseWorldLandmarks[30].x
                    rightPrevToeX = results.poseWorldLandmarks[32].x
                    leftPrevHeelX = results.poseWorldLandmarks[29].x
                    leftPrevToeX = results.poseWorldLandmarks[31].x
                    calibrated = true
                    videoRef.current.currentTime = 0
                    console.log("calibrated")
                    return
                }
            }
            
            if (calibrated && !mediapipeCalibrated) {   
                videoRef.current.loop = true             
                calibrationTick++
                if (Date.now() - startTime > 999) {
                    if (calibrationTick < 101 && videoRef.current.playbackRate > 0.2) {
                        if (videoRef.current.playbackRate > 0.2) {
                            videoRef.current.playbackRate = videoRef.current.playbackRate - 0.05
                            console.log("slowing down")
                            console.log(videoRef.current.playbackRate)
                            console.log(calibrationTick)
                        }
                        calibrationTick = 0
                        startTime = Date.now()
                    } else if (calibrationTick > 99 || videoRef.current.playbackRate < 0.25) {       
                        console.log("playbackspeed calibrated:")
                        console.log(videoRef.current.playbackRate)                 
                        mediapipeCalibrated = true
                        videoRef.current.currentTime = 0
                        videoRef.current.loop = false
                    }
                }
            }

            if (calibrated && mediapipeCalibrated) {
                //console.log('f')               

                if (rightToeRepeated > 1) {
                    rightLegForward = true
                    console.log("Right f")
                    rightToeRepeated = 0
                }
                if (rightToeRepeated < -1) {
                    if (rightLegForward) {
                        // console.log("Right heel strike")
                    }
                    rightLegForward = false
                    rightToeRepeated = 0
                }
                if (leftToeRepeated > 1) {
                    leftLegForward = true
                    console.log("Left f")
                    leftToeRepeated = 0
                }
                if (leftToeRepeated < -1) {
                    leftLegForward = false
                    leftToeRepeated = 0
                }
                if (results.poseWorldLandmarks[32].x > rightPrevToeX) {
                    rightToeRepeated++
                } else {
                    rightToeRepeated--
                }
                if (results.poseWorldLandmarks[31].x > leftPrevToeX) {
                    leftToeRepeated++
                } else {
                    leftToeRepeated--
                }

                rightPrevHeelX = results.poseWorldLandmarks[32].x
                rightPrevToeX = results.poseWorldLandmarks[32].x
                leftPrevHeelX = results.poseWorldLandmarks[29].x
                leftPrevToeX = results.poseWorldLandmarks[31].x
            }
        }


        return;

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
            }
            else // calibrated=false tänne?
                setTimeout(onFrame, 500)
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
            minDetectionConfidence: 0.7,
            minTrackingConfidence: 0.7,
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
            <div className="container">
                <video className="input_video" src={videoSrc} type='video/mp4' muted="muted" width="960" height="540"></video>
                {/* <div className="canvas-container">
                    <canvas ref={canvasRef} className="output_canvas" width="1280px" height="720px">
                    </canvas>
                </div> */}
                <form>
                    <p style={{ display: file ? 'none' : 'block' }}>
                        <input
                            type="file"
                            id='video'
                            accept='.mp4, .ogg, .webm'
                            onChange={changeHandler}
                        />
                    </p>
                </form>
            </div>
        </>
    )
}
export default Home