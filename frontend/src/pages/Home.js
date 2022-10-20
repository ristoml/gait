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

let rightLegForward = false
let leftLegForward = false

let rightPrevToeX = 0
let leftPrevToeX = 0

let rightStep = false
let leftStep = false

let calibrated = false

function Home() {
    const [file, setFile] = useState(null)
    const [fileDataURL, setFileDataURL] = useState(null)
    const [videoSrc, setVideoSrc] = useState(null)
    const [poseTest, setPose] = useState(null)
    // const [firstRun, setFirstRun] = useState(true)
    // const canvasRef = useRef(null)
    const videoRef = useRef(null)

    const handleGo = () => {
        setVideoSrc(fileDataURL)
    }

    //const canvasCtx = document.getElementsByClassName('output_canvas')[0]

    function onResults(results) {
        //console.log(results)
        if (results.poseLandmarks) {
            if (!calibrated) {
                if (results.poseWorldLandmarks[30].visibility > 0.2) {
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

            if (calibrated) {
                if (rightLegForward && rightHeelRepeated < -2) {
                    console.log("Heel strike")
                }
                if (rightHeelRepeated > 2) {
                    rightLegForward = true
                    rightHeelRepeated = 0
                }
                if (rightHeelRepeated < -2) {
                    rightLegForward = false
                    rightHeelRepeated = 0
                }
                if (results.poseWorldLandmarks[30].x > rightPrevHeelX) {
                    rightHeelRepeated++
                } else {
                    rightHeelRepeated--
                }
                if (results.poseWorldLandmarks[29].x > leftPrevHeelX) {
                    leftHeelRepeated++
                } else {
                    leftHeelRepeated--
                }
                rightPrevHeelX = results.poseWorldLandmarks[30].x
                rightPrevToeX = results.poseWorldLandmarks[32].x
                leftPrevHeelX = results.poseWorldLandmarks[29].x
                leftPrevToeX = results.poseWorldLandmarks[31].x
            }
        }

        /*
                    const canvasElement = canvasRef.current
                    const canvasCtx = canvasElement.getContext("2d")
                    canvasCtx.save()
                    canvasCtx.clearRect(0, 0, 1280, 720)
                    canvasCtx.translate(720, 0)
                    canvasCtx.scale(-1, 1)
                    canvasCtx.font = "40px Verdana"
                    canvasCtx.fillStyle = "#bdffff"
                    canvasCtx.drawImage(
                        results.image,
                        0,
                        0,
                        canvasCtx.width,
                        canvasCtx.height
                    )
        
                    const leftLeg = [
                        results.poseLandmarks[24],
                        results.poseLandmarks[23],
                        results.poseLandmarks[25],
                        results.poseLandmarks[27],
                    ]
        
                    drawConnectors(canvasCtx, leftLeg, POSE_CONNECTIONS, {
                        color: "#77bdff",
                        lineWidth: 4,
                    })
                    drawLandmarks(canvasCtx, leftLeg, {
                        color: "#bd77ff",
                        lineWidth: 2,
                    })
        */

        //videoElement.play()
        //videoRef.current.pause()
        return;
        //}
    }

    const changeHandler = (e) => {


        const file = e.target.files[0];
        // if (!file.type.match(imageMimeType)) {
        //   alert("Image mime type is not valid")
        //   return
        // }        
        setFile(file)

        videoRef.current = document.getElementsByClassName('input_video')[0]

        async function onFrame() {
            if (!videoRef.current.ended) {
                videoRef.current.play()
                // if (firstRun) {
                //     console.log("first frame")
                //     //setFirstRun(false)
                //     firstRun = false
                //     videoRef.current.pause()
                //     setTimeout(onFrame, 1000)
                // }

                await poseTest.send({
                    image: videoRef.current
                })
                //videoRef.current.pause()


                // console.log('frame')
                // console.log(testArray.length)

                // await pose.send({
                //     image: videoRef.current
                //   })
                // https://stackoverflow.com/questions/65144038/how-to-use-requestanimationframe-with-promise    
                await new Promise(requestAnimationFrame)
                onFrame()
            }
            else // calibrated=false tänne?
                setTimeout(onFrame, 500)
        }


        videoRef.current.onloadeddata = (evt) => {
            //let video = evt.target

            //console.log(video)
            //canvasElement.width = video.videoWidth
            //canvasElement.height = video.videoHeight

            //canvasRef.current.width = video.videoWidth
            //canvasRef.current.height = video.videoHeight

            //const aspect = video.videoHeight / video.videoWidth
            //let width, height
            //if (window.innerWidth > window.innerHeight) {
            //    height = window.innerHeight
            //   width = height / aspect
            // }
            // else {
            //    width = window.innerWidth
            //     height = width * aspect
            // }
            videoRef.current.playbackRate = 0.2
            videoRef.current.play()
            onFrame()
        }
    }

    useEffect(() => {
        console.log("pose")
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

    }, [])

    useEffect(() => {

        let fileReader, isCancel = false
        if (file) {
            fileReader = new FileReader()
            fileReader.onload = (e) => {
                const { result } = e.target
                if (result && !isCancel) { // calibrated = false tänne?
                    setVideoSrc(result)
                    setFileDataURL(result)
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
                <video className="input_video" src={videoSrc} type='video/mp4' muted="muted" width="480" height="270"></video>
                {/* <div className="canvas-container">
                    <canvas ref={canvasRef} className="output_canvas" width="1280px" height="720px">
                    </canvas>
                </div> */}
                <form>
                    <p>
                        <label htmlFor='video'>Select video</label>
                        <input
                            type="file"
                            id='video'
                            accept='.mp4, .ogg'
                            onChange={changeHandler}
                        />
                    </p>
                </form>
                {fileDataURL ?
                    <button type="submit" onClick={handleGo}>Go</button>
                    : null}
            </div>
        </>
    )
}
export default Home