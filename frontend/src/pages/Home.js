import { useEffect, useState, useRef } from "react"
import { Pose } from "@mediapipe/pose"
// import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils"
import Graphs from "../components/graphs/Graphs"
// import HomeGraphs from "../components/home/HomeGraphs"
import * as dPp from "../components/graphs/DataPostprocess"
import Button from "../components/home/Button"
//import * as angleH from "../components/home/AngleHelper"

// import {
//   ResponsiveContainer,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Label,
//   Legend,
//   LineChart,
//   Line,
//   ReferenceLine,
// } from "recharts"

// const imageMimeType = /image\/(png|jpg|jpeg)/i
let poseResults = []

let calibrated = false
let mediapipeCalibrated = false
let didPlay = false
let useAnkleFix = true
let useHipFix = false
let toeXOffsetValue = 0
// let hipXOffsetMultiplier = 1.03
// let hipYOffsetMultiplier = 0.95
let toeXOffSetMultiplier = 0.67
let hipXOffsetMultiplier = 1
let hipYOffsetMultiplier = 1
// let toeXOffSetMultiplier = 1
// let toeYOffset = -0.02   
let toeYOffset = 0
let startTime
let calibrationTick = 0
let completeTime = 0

function Home() {
  const [file, setFile] = useState(null)
  //const [fileDataURL, setFileDataURL] = useState(null) //poista?
  const [videoSrc, setVideoSrc] = useState(null)
  const [poseTest, setPose] = useState(null)
  const [showVid, setShowVid] = useState(false)
  const [showGraphs, setShowGraphs] = useState(false)
  const [showLoading, setShowLoading] = useState(true)
  // const [showGraphsButton, setShowGraphsButton] = useState(false)
  // const [showContinueBtn, setShowContinueBtn] = useState(false)

  const counter = useRef(0)
  const canvasRef = useRef(null)
  const canvasRef2 = useRef(null)
  const videoRef = useRef(null)

  // const leftHipRe = useRef([])
  // const leftKneeRe = useRef([])
  // const leftAnkleRe = useRef([])

  // const rightHipRe = useRef([])
  // const rightKneeRe = useRef([])
  // const rightAnkleRe = useRef([])

  const canvasCtxx = useRef()
  const canvasCtxx2 = useRef()


  function refresh() {
    window.location.reload("Refresh")
  }
  function onResults(results) {
    const canvasElement = canvasRef.current
    const canvasCtx = canvasElement.getContext("2d")

    const canvasElement2 = canvasRef2.current
    const canvasCtx2 = canvasElement2.getContext("2d")

    canvasCtxx.current = canvasCtx
    canvasCtxx2.current = canvasCtx2
    // canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height)


    //console.log(results)
    if (results.poseLandmarks) {
      if (!calibrated) {
        if (results.poseWorldLandmarks[30].visibility > 0.2) {
          if (useAnkleFix && results.poseLandmarks[32].y - results.poseLandmarks[30].y <= 0.03 && results.poseLandmarks[32].y - results.poseLandmarks[30].y >= -0.03) {
            toeXOffsetValue = (results.poseLandmarks[32].x - results.poseLandmarks[30].x) - toeXOffSetMultiplier * (results.poseLandmarks[32].x - results.poseLandmarks[30].x)
            console.log("ToeXOffset: " + toeXOffsetValue)
            startTime = Date.now()
            calibrated = true
            videoRef.current.currentTime = 0
            console.log(videoRef.current.framerate)
            console.log("Mediapipe initialized")
            // return
          } else if (!useAnkleFix) {
            startTime = Date.now()
            calibrated = true
            videoRef.current.currentTime = 0
            console.log("Mediapipe initialized")
          }
        }
      }

      if (calibrated && !mediapipeCalibrated) {
        const videoWidth = videoRef.current.videoWidth
        const videoHeight = videoRef.current.videoHeight
        // canvasRef.current.width = videoWidth <= 600 ? videoWidth / 1.4 : videoWidth / 2.66
        // canvasRef.current.height = videoWidth <= 600 ? videoHeight / 1.4 : videoHeight / 2.66
        canvasRef.current.height = 600
        canvasRef.current.width = 600 / (videoHeight/videoWidth)
        canvasRef2.current.width = 800
        canvasRef2.current.height = 100
        // canvasCtx.clearRect(0, 0, videoWidth, videoHeight)
        completeTime = 0
        if (Date.now() - startTime > 2999) {
          calibrationTick++
        }
        if (Date.now() - startTime > 5999) {
          console.log("calibration ticks: " + calibrationTick)
          if (calibrationTick / 303 > 0.1) {
            videoRef.current.playbackRate = (calibrationTick / 303) * 1.15
            // videoRef.current.playbackRate = 1.1
            console.log("playbackrate adjusted to: " + videoRef.current.playbackRate)
            mediapipeCalibrated = true
            videoRef.current.currentTime = 0

            setShowVid(true)
            setShowLoading(false)
          } else {
            // videoRef.current.playbackRate = 0.1
            videoRef.current.playbackRate = 0.15
            console.log("playbackrate adjusted to: " + videoRef.current.playbackRate)
            mediapipeCalibrated = true
            videoRef.current.currentTime = 0

            setShowVid(true)
          }
        }
      }
      if (calibrated && mediapipeCalibrated) {
        didPlay = true
        counter.current++
        canvasCtx.drawImage(
          results.image,
          0,
          0,
          canvasElement.width,
          canvasElement.height
        )
        canvasCtx2.clearRect(0, 0, 1000, 100)
        // drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
        //   color: "#77bdff",
        //   lineWidth: 2,
        // });
        // drawLandmarks(canvasCtx, results.poseLandmarks, {
        //   color: "#bd77ff",
        //   lineWidth: 1,
        // });
        if (useHipFix) {
          results.poseLandmarks[23].x *= hipXOffsetMultiplier
          results.poseLandmarks[23].y *= hipYOffsetMultiplier
          results.poseLandmarks[24].x *= hipXOffsetMultiplier
          results.poseLandmarks[24].y *= hipYOffsetMultiplier
        }
        if (useAnkleFix) {
          results.poseLandmarks[31].y -= toeYOffset
          results.poseLandmarks[32].y -= toeYOffset
          if (results.poseLandmarks[27].x < results.poseLandmarks[25].x) {
            results.poseLandmarks[31].x -= toeXOffsetValue
          }
          if (results.poseLandmarks[28].x < results.poseLandmarks[26].x) {
            results.poseLandmarks[32].x -= toeXOffsetValue
          }
        }
        drawCircles(results)
        poseResults.push({ data: results, time: Date.now() })
        // if (counter.current % 5 === 0) {
        // angleH.updateAngleHelper(results)
        // if (angleH.getLeftZ() > leftMaxZ) {
        //   leftMaxZ = angleH.getLeftZ()
        // }
        // if (angleH.getRightZ() > rightMaxZ) {
        //   rightMaxZ = angleH.getRightZ()
        // }
        // console.log("l: " + angleH.getLeftZ())
        // console.log("r: " + angleH.getRightZ())
        // console.log("l: " + angleH.getLeftDepth())
        // console.log("r: " + angleH.getRightDepth())

        //   leftHipRe.current.push({ angle: angleH.getHipAngle(true) })
        //   leftKneeRe.current.push({ angle: angleH.getKneeAngle(true) })
        //   leftAnkleRe.current.push({ angle: angleH.getAnkleAngle(true) })

        //   rightHipRe.current.push({ angle: angleH.getHipAngle(false) })
        //   rightKneeRe.current.push({ angle: angleH.getKneeAngle(false) })
        //   rightAnkleRe.current.push({ angle: angleH.getAnkleAngle(false) })
        // }
      }
    } 
  }

  const changeHandler = (e) => {
    const file = e.target.files[0]


    setFile(file)


    videoRef.current = document.getElementsByClassName("input_video")[0]

    async function onFrame() {
      if (!videoRef.current.ended) {
        await poseTest.send({
          image: videoRef.current,
        })
        await new Promise(requestAnimationFrame)
        if (videoRef.current.currentTime / videoRef.current.duration > 0.99) {
          completeTime = 1
        } else {
          completeTime = videoRef.current.currentTime / videoRef.current.duration
        }
        onFrame()
      } else if (videoRef.current.ended && didPlay) {
        dPp.processResults(poseResults)
        // console.log(poseResults)
        if (dPp.getResultsOk()) {
          // setShowGraphsButton(true)
          setShowGraphs(true)
        } else {
          setShowVid(false)
        }

      } else {
        // calibrated=false tänne?
        setTimeout(onFrame, 500)
      }
    }

    videoRef.current.onloadeddata = (evt) => {
      videoRef.current.playbackRate = 1
      videoRef.current.play()
      onFrame()
    }
  }

  const changeView = () => {
    setShowGraphs(true)
  }

  //first version of drawing pose
  const drawCircles = (results) => {
    const leftHipCircle = new Path2D()
    const leftKneeCircle = new Path2D()
    const leftAnkleCircle = new Path2D()
    const leftHeelCircle = new Path2D()
    const leftFootCircle = new Path2D()

    const rightHipCircle = new Path2D()
    const rightKneeCircle = new Path2D()
    const rightAnkleCircle = new Path2D()
    const rightHeelCircle = new Path2D()
    const rightFootCircle = new Path2D()

    const progressArc1 = new Path2D()
    const progressArc2 = new Path2D()
    const beginProgressArc = new Path2D()
    const endProgressArc = new Path2D()

    const hipCircle = new Path2D()
    const shoulderCircle = new Path2D()

    canvasCtxx2.current.fillStyle = "#e1f5fe"
    beginProgressArc.arc(
      canvasRef2.current.width * 0.10,
      50,
      25,
      0,
      2 * Math.PI
    )
    endProgressArc.arc(
      canvasRef2.current.width * 0.10 + canvasRef2.current.width * 0.80,
      50,
      25,
      0,
      2 * Math.PI
    )


    canvasCtxx2.current.fillRect(canvasRef2.current.width * 0.10, 25, canvasRef2.current.width * 0.80, 50)

    canvasCtxx2.current.fill(endProgressArc)
    canvasCtxx2.current.fill(beginProgressArc)

    canvasCtxx2.current.fillStyle = "#039be5"

    progressArc1.arc(
      canvasRef2.current.width * 0.10,
      50,
      20,
      0,
      2 * Math.PI
    )
    progressArc2.arc(
      canvasRef2.current.width * 0.10 + completeTime * (canvasRef2.current.width * 0.80),
      50,
      20,
      0,
      2 * Math.PI
    )

    canvasCtxx2.current.fillRect(canvasRef2.current.width * 0.10, 30, completeTime * canvasRef2.current.width * 0.8, 40)
    canvasCtxx2.current.fill(progressArc2)
    canvasCtxx2.current.fill(progressArc1)


    canvasCtxx2.current.beginPath()

    canvasCtxx2.current.fillStyle = "#000000"

    canvasCtxx2.current.font = "100 30px Segoe UI"
    canvasCtxx2.current.fillText((completeTime * 100).toFixed(2) + "%", canvasRef2.current.width * 0.10 + completeTime * canvasRef2.current.width * 0.8 - 27, 22)

    canvasCtxx.current.fillStyle = "#ffffff"

    hipCircle.arc(
      ((results.poseLandmarks[23].x + results.poseLandmarks[24].x) / 2) *
      canvasRef.current.width,
      ((results.poseLandmarks[23].y + results.poseLandmarks[24].y) / 2) *
      canvasRef.current.height,
      4,
      0,
      2 * Math.PI
    )
    shoulderCircle.arc(
      ((results.poseLandmarks[11].x + results.poseLandmarks[12].x) / 2) *
      canvasRef.current.width,
      ((results.poseLandmarks[11].y + results.poseLandmarks[12].y) / 2) *
      canvasRef.current.height,
      4,
      0,
      2 * Math.PI
    )

    leftHipCircle.arc(results.poseLandmarks[23].x * canvasRef.current.width, results.poseLandmarks[23].y * canvasRef.current.height, 4, 0, 2 * Math.PI)
    rightHipCircle.arc(results.poseLandmarks[24].x * canvasRef.current.width, results.poseLandmarks[24].y * canvasRef.current.height, 4, 0, 2 * Math.PI)
    leftKneeCircle.arc(
      results.poseLandmarks[25].x * canvasRef.current.width,
      results.poseLandmarks[25].y * canvasRef.current.height,
      4,
      0,
      2 * Math.PI
    )
    leftAnkleCircle.arc(
      results.poseLandmarks[27].x * canvasRef.current.width,
      results.poseLandmarks[27].y * canvasRef.current.height,
      4,
      0,
      2 * Math.PI
    )
    leftHeelCircle.arc(
      results.poseLandmarks[29].x * canvasRef.current.width,
      results.poseLandmarks[29].y * canvasRef.current.height,
      4,
      0,
      2 * Math.PI
    )
    leftFootCircle.arc(
      results.poseLandmarks[31].x * canvasRef.current.width,
      results.poseLandmarks[31].y * canvasRef.current.height,
      4,
      0,
      2 * Math.PI
    )

    //rightHipCircle.arc(results.poseLandmarks[24].x * canvasRef.current.width, results.poseLandmarks[24].y * canvasRef.current.height, 6, 0, 2 * Math.PI)
    rightKneeCircle.arc(
      results.poseLandmarks[26].x * canvasRef.current.width,
      results.poseLandmarks[26].y * canvasRef.current.height,
      4,
      0,
      2 * Math.PI
    )
    rightAnkleCircle.arc(
      results.poseLandmarks[28].x * canvasRef.current.width,
      results.poseLandmarks[28].y * canvasRef.current.height,
      4,
      0,
      2 * Math.PI
    )
    rightHeelCircle.arc(
      results.poseLandmarks[30].x * canvasRef.current.width,
      results.poseLandmarks[30].y * canvasRef.current.height,
      4,
      0,
      2 * Math.PI
    )


    rightFootCircle.arc(
      results.poseLandmarks[32].x * canvasRef.current.width,
      results.poseLandmarks[32].y * canvasRef.current.height,
      4,
      0,
      2 * Math.PI
    )


    canvasCtxx.current.beginPath()
    //
    canvasCtxx.current.moveTo(
      ((results.poseLandmarks[23].x + results.poseLandmarks[24].x) / 2) *
      canvasRef.current.width,
      ((results.poseLandmarks[23].y + results.poseLandmarks[24].y) / 2) *
      canvasRef.current.height
    )

    //canvasCtxx.current.moveTo(results.poseLandmarks[23].x * canvasRef.current.width, results.poseLandmarks[23].y * canvasRef.current.height)
    canvasCtxx.current.strokeStyle = "#2b2b2b"

    canvasCtxx.current.lineTo(
      results.poseLandmarks[25].x * canvasRef.current.width,
      results.poseLandmarks[25].y * canvasRef.current.height
    )
    canvasCtxx.current.moveTo(
      results.poseLandmarks[25].x * canvasRef.current.width,
      results.poseLandmarks[25].y * canvasRef.current.height
    )
    canvasCtxx.current.lineTo(
      results.poseLandmarks[27].x * canvasRef.current.width,
      results.poseLandmarks[27].y * canvasRef.current.height
    )
    canvasCtxx.current.moveTo(
      results.poseLandmarks[27].x * canvasRef.current.width,
      results.poseLandmarks[27].y * canvasRef.current.height
    )
    canvasCtxx.current.lineTo(
      results.poseLandmarks[29].x * canvasRef.current.width,
      results.poseLandmarks[29].y * canvasRef.current.height
    )
    canvasCtxx.current.moveTo(
      results.poseLandmarks[27].x * canvasRef.current.width,
      results.poseLandmarks[27].y * canvasRef.current.height
    )
    canvasCtxx.current.lineTo(
      results.poseLandmarks[31].x * canvasRef.current.width,
      results.poseLandmarks[31].y * canvasRef.current.height
    )
    canvasCtxx.current.moveTo(
      results.poseLandmarks[29].x * canvasRef.current.width,
      results.poseLandmarks[29].y * canvasRef.current.height
    )
    canvasCtxx.current.lineTo(
      results.poseLandmarks[31].x * canvasRef.current.width,
      results.poseLandmarks[31].y * canvasRef.current.height
    )

    canvasCtxx.current.moveTo(
      ((results.poseLandmarks[23].x + results.poseLandmarks[24].x) / 2) *
      canvasRef.current.width,
      ((results.poseLandmarks[23].y + results.poseLandmarks[24].y) / 2) *
      canvasRef.current.height
    )

    //canvasCtxx.current.moveTo(results.poseLandmarks[24].x * canvasRef.current.width, results.poseLandmarks[24].y * canvasRef.current.height)
    canvasCtxx.current.lineTo(
      results.poseLandmarks[26].x * canvasRef.current.width,
      results.poseLandmarks[26].y * canvasRef.current.height
    )
    canvasCtxx.current.moveTo(
      results.poseLandmarks[26].x * canvasRef.current.width,
      results.poseLandmarks[26].y * canvasRef.current.height
    )
    canvasCtxx.current.lineTo(
      results.poseLandmarks[28].x * canvasRef.current.width,
      results.poseLandmarks[28].y * canvasRef.current.height
    )
    canvasCtxx.current.moveTo(
      results.poseLandmarks[28].x * canvasRef.current.width,
      results.poseLandmarks[28].y * canvasRef.current.height
    )
    canvasCtxx.current.lineTo(
      results.poseLandmarks[30].x * canvasRef.current.width,
      results.poseLandmarks[30].y * canvasRef.current.height
    )
    canvasCtxx.current.moveTo(
      results.poseLandmarks[28].x * canvasRef.current.width,
      results.poseLandmarks[28].y * canvasRef.current.height
    )
    canvasCtxx.current.lineTo(
      results.poseLandmarks[32].x * canvasRef.current.width,
      results.poseLandmarks[32].y * canvasRef.current.height
    )
    canvasCtxx.current.moveTo(
      results.poseLandmarks[30].x * canvasRef.current.width,
      results.poseLandmarks[30].y * canvasRef.current.height
    )

    canvasCtxx.current.lineTo(
      results.poseLandmarks[32].x * canvasRef.current.width,
      results.poseLandmarks[32].y * canvasRef.current.height
    )


    canvasCtxx.current.moveTo(
      ((results.poseLandmarks[23].x + results.poseLandmarks[24].x) / 2) *
      canvasRef.current.width,
      ((results.poseLandmarks[23].y + results.poseLandmarks[24].y) / 2) *
      canvasRef.current.height
    )
    canvasCtxx.current.lineTo(
      ((results.poseLandmarks[11].x + results.poseLandmarks[12].x) / 2) *
      canvasRef.current.width,
      ((results.poseLandmarks[11].y + results.poseLandmarks[12].y) / 2) *
      canvasRef.current.height
    )

    canvasCtxx.current.stroke()

    canvasCtxx.current.fill(shoulderCircle)
    canvasCtxx.current.fill(hipCircle)
    // canvasCtxx.current.fill(leftHipCircle)
    canvasCtxx.current.fill(leftKneeCircle)
    canvasCtxx.current.fill(leftAnkleCircle)
    canvasCtxx.current.fill(leftHeelCircle)
    canvasCtxx.current.fill(leftFootCircle)

    // canvasCtxx.current.fill(rightHipCircle)
    canvasCtxx.current.fill(rightKneeCircle)
    canvasCtxx.current.fill(rightAnkleCircle)
    canvasCtxx.current.fill(rightHeelCircle)
    canvasCtxx.current.fill(rightFootCircle)
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
      minTrackingConfidence: 0.1
    })

    setPose(pose)
    pose.onResults(onResults)

    let fileReader,
      isCancel = false
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
        <>
          {" "}
          <form>
            <p style={{ display: file ? "none" : "block" }}>
              <label className="videoLabel" htmlFor="video">
                Select video
              </label>
              <input
                style={{ display: "none" }}
                className="videoLabel"
                type="file"
                id="video"
                accept=".mp4, .ogg, .webm"
                onChange={changeHandler}
              />
            </p>
          </form>
          <div className="homeContainer">
            <div
              style={{ display: file && (!showVid && showLoading) ? "block" : "none" }}
            >
              <h2 className="reminder">Keep this window focused at all times.</h2>
              <h1
                className="loading">
                Loading...{" "}
              </h1>
              <p className="reminder3">(This shouldn't take longer than 10 seconds.)</p>
            </div>
            <div
              className="error"
              style={{ display: file && (!showVid && !showLoading) ? "block" : "none" }}>
              <h1 className="errorText">Something went wrong.</h1><br/>Bad video or window focus was lost during analysis.<br/>
            {file && (!showVid && !showLoading) &&
              <Button
                className='btn2'
                text="Try again"
                onClick={() => {
                  refresh()
                }}></Button>}
                </div>
            <div>
              <div className="canvasDiv">
                <video
                  style={{ display: "none" }}
                  className="input_video"
                  src={videoSrc}
                  type="video/mp4"
                  muted="muted"
                  width="960"
                  height="540"
                ></video>
                <div
                  style={{ display: showVid ? "block" : "none" }}
                  className="canvas-container"
                >
                  <canvas ref={canvasRef} className="output_canvas"></canvas>
                  <br />
                  <canvas ref={canvasRef2} className="output_canvas2"></canvas>
                  <h2 className="reminder2">Keep this window focused!</h2>
                </div>
              </div>


              {/* <div style={{ display: showVid ? "block" : "none" }}>
                <HomeGraphs
                  leftHip={leftHipRe.current}
                  leftKnee={leftKneeRe.current}
                  leftAnkle={leftAnkleRe.current}
                  rightHip={rightHipRe.current}
                  rightKnee={rightKneeRe.current}
                  rightAnkle={rightAnkleRe.current}
                ></HomeGraphs>
              </div> */}
            </div>
            {/* <div className="continueBtn" style={{ display: showContinueBtn ? "block" : "none" }}>
              <Button
                className='btn2'
                text="Continue"
                onClick={() => {
                  setShowGraphs(true)
                }}
              />
            </div> */}


          </div>
        </>
      ) : (
        <Graphs
          leftHip={dPp.getLeftHipAngle(false)}
          leftKnee={dPp.getLeftKneeAngle(false)}
          leftAnkle={dPp.getLeftAnkleAngle(false)}
          rightHip={dPp.getRightHipAngle(false)}
          rightKnee={dPp.getRightKneeAngle(false)}
          rightAnkle={dPp.getRightAnkleAngle(false)}
          steps={dPp.getSteps()}
          median={dPp.getMedian()}
          leftSwing={dPp.getLeftSwingIndex()}
          rightSwing={dPp.getRightSwingIndex()}
        ></Graphs>
      )}
    </>
  )
}
export default Home

