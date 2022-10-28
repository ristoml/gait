import { useEffect, useState, useRef } from 'react'
import { Pose, POSE_CONNECTIONS } from "@mediapipe/pose"
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils"
import Graphs from "../components/graphs/Graphs"
import * as dPp from "../components/graphs/DataPostprocess"

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
    const canvasRef = useRef(null)
    const videoRef = useRef(null)
    const [showGraphs, setShowGraphs] = useState(false)



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
                canvasRef.current.width = videoWidth / 2
                canvasRef.current.height = videoHeight / 2
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
            <div className="container">
                {!showGraphs ? (
                    <>
                        <h1 style={{ display: file && !showVid ? 'block' : 'none' }}>Loading... </h1>
                        <div className='homeContainer'>
                            <div className='canvasDiv'>
                                <video style={{ display: 'none' }} className="input_video" src={videoSrc} type='video/mp4' muted="muted" width="960" height="540"></video>
                                <div className="canvas-container">
                                    <canvas ref={canvasRef} className="output_canvas" width="1280px" height="720px">
                                    </canvas>
                                </div>
                            </div>
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
                    </>) : (
                    <Graphs leftHip={dPp.getLeftHipAngle()}
                        leftKnee={dPp.getLeftKneeAngle()}
                        leftAnkle={dPp.getLeftAnkleAngle()}
                        rightHip={dPp.getRightHipAngle()}
                        rightKnee={dPp.getRightKneeAngle()}
                        rightAnkle={dPp.getRightAnkleAngle()}
                        steps={dPp.getSteps()}
                    ></Graphs>)}

            </div>
        </>
    )
}
export default Home