import * as angleH from "../home/AngleHelper"

let leftHip = []
let leftKnee = []
let leftAnkle = []

let rightHip = []
let rightKnee = []
let rightAnkle = []

let leftHipRE = []
let leftKneeRE = []
let leftAnkleRE = []

let rightHipRE = []
let rightKneeRE = []
let rightAnkleRE = []

let rightDirectionArray = []
let leftDirectionArray = []

let leftToeDirectionArray = []
let leftHeelDirectionArray = []

let rightToeDirectionArray = []
let rightHeelDirectionArray = []

let steps = 0

let skippedFrames = 30

const processResults = (results, leftData, rightData) => {
    //for (let i = 30; i < results.length; i++) {                   <------
    for (let i = skippedFrames; i < results.length; i++) {
        if (results[i].data.poseWorldLandmarks[31].x > results[i - 1].data.poseWorldLandmarks[31].x) {
            leftToeDirectionArray.push(1)
        } else {
            leftToeDirectionArray.push(0)
        }
        if (results[i].data.poseWorldLandmarks[29].x > results[i - 1].data.poseWorldLandmarks[29].x) {
            leftHeelDirectionArray.push(1)
        } else {
            leftHeelDirectionArray.push(0)
        }
        if (results[i].data.poseWorldLandmarks[32].x > results[i - 1].data.poseWorldLandmarks[32].x) {
            rightToeDirectionArray.push(1)
        } else {
            rightToeDirectionArray.push(0)
        }
        if (results[i].data.poseWorldLandmarks[30].x > results[i - 1].data.poseWorldLandmarks[30].x) {
            rightHeelDirectionArray.push(1)
        } else {
            rightHeelDirectionArray.push(0)
        }

    }
    console.log(rightHeelDirectionArray)
    getDirectionChangeIndex(rightToeDirectionArray, rightHeelDirectionArray, rightDirectionArray)
    //getDirectionChangeIndex(leftToeDirectionArray, leftHeelDirectionArray, leftDirectionArray)
    makeStepAngleArray(rightDirectionArray, results, rightHipRE, rightKneeRE, rightAnkleRE, false)
    //makeStepAngleArray(leftDirectionArray, results, leftHipRE, leftKneeRE, leftAnkleRE, true)



    // console.log(rightToeDirectionArray)
    // const getDirectionChangeIndex = (dirArray, isToe) => {
    //     let certainty = false
    //     if (isToe) {
    //         for (let i = 1; i < dirArray.length; i++) {
    //             if (dirArray[i-1] === 0) {

    //             }
    //         }

    //     } else {

    //     }
    // }

    // rightPrevHeelX = results.poseWorldLandmarks[30].x
    // rightPrevToeX = results.poseWorldLandmarks[32].x
    // leftPrevHeelX = results.poseWorldLandmarks[29].x
    // leftPrevToeX = results.poseWorldLandmarks[31].x
    // angleH.updateAngleHelper(results)    

    // tempLeftData.push({ Hip: angleH.getLeftHipAngle(), Knee: angleH.getLeftKneeAngle(), Ankle: angleH.getLeftAnkleAngle() })
    // tempRightData.push({ Hip: angleH.getRightHipAngle(), Knee: angleH.getRightKneeAngle(), Ankle: angleH.getRightAnkleAngle() })

    // for (let i = 0; i < samples; i++) { // create recharts-dataset
    //     rechartsData.current.push({ sample: i, first: sIndexArray[0][i], second: sIndexArray[1][i], third: sIndexArray[2][i], fourth: sIndexArray[3][i], fifth: sIndexArray[4][i], sixth: sIndexArray[5][i], seventh: sIndexArray[6][i], eighth: sIndexArray[7][i], ninth: sIndexArray[8][i], tenth: sIndexArray[9][i] })
    //   }

    // leftGaitData.forEach(element => {
    //     leftHip.current.push(element.Hip)
    //     leftKnee.current.push(element.Knee)
    //     leftAnkle.current.push(element.Ankle)
    // })
    // rightGaitData.forEach(element => {
    //     rightHip.current.push(element.Hip)
    //     rightKnee.current.push(element.Knee)
    //     rightAnkle.current.push(element.Ankle)
    // })
    // for (let i = 0; i < leftHip.current.length; i++) { // create recharts-dataset
    //     leftHipRE.current.push({ sample: i, Hip: leftHip.current[i] })
    // }
    // console.log(leftHipRE.current)

}


const getDirectionChangeIndex = (toeDirArray, heelDirArray, dirArray) => {
    let certainty = false
    let forward = true
    let cycleCount = 0
    let start = false



    for (let i = 0; i < heelDirArray.length; i++) {
        if (!certainty) {
            if (heelDirArray[i] === 1 && heelDirArray[i + 3] === 1 && heelDirArray[i + 1] === 1 && heelDirArray[i + 2] === 1) {
                certainty = true
                forward = true
            } else {
                dirArray.push({ state: "unknown", cycleCount: cycleCount - 1 })
            }
        }

        //eteenpäin, varpaat
        if (certainty && forward) {
            if (heelDirArray[i] === 0) {
                let battle = heelDirArray[i] + heelDirArray[i + 1] + heelDirArray[i + 2] + heelDirArray[i + 3] + heelDirArray[i + 4] + heelDirArray[i + 5] + heelDirArray[i + 6]
                if (battle <= 1) {
                    forward = false
                    start = true
                    cycleCount++
                    dirArray.push({ state: "ground", cycleCount: cycleCount })
                    continue
                } else {
                    dirArray.push({ state: "air", cycleCount: cycleCount })
                }
            } else if (start && cycleCount !== 0) {
                dirArray.push({ state: "air", cycleCount: cycleCount })
            } else {
                dirArray.push({ state: "ready", cycleCount: cycleCount - 1 })
            }
        }

        //taaksepäin, kantapää
        if (certainty && !forward) {
            if (toeDirArray[i] === 1) {
                let battle = toeDirArray[i] + toeDirArray[i + 1] + toeDirArray[i + 2] + toeDirArray[i + 3] + toeDirArray[i + 4] + toeDirArray[i + 5] + toeDirArray[i + 6]
                if (battle >= 6) {
                    forward = true
                    dirArray.push({ state: "air", cycleCount: cycleCount })
                } else {
                    dirArray.push({ state: "ground", cycleCount: cycleCount })
                }
            } else {
                dirArray.push({ state: "ground", cycleCount: cycleCount })
            }
        }
    }
    //console.log(dirArray)
}

const makeStepAngleArray = (cycleArray, resultData, recHip, recKnee, recAnkle, side) => {
    console.log(cycleArray)
    console.log(resultData)

    let stepcount = -1
    let tempHipArray = []
    let tempKneeArray = []
    let tempAnkleArray = []


    for (let i = 0; i < cycleArray.length; i++) {

        //eka
        if (stepcount !== cycleArray[i].cycleCount) {
            stepcount = cycleArray[i].cycleCount
            if (tempHipArray.length !== 0) {
                recHip.push(tempHipArray)
                recKnee.push(tempKneeArray)
                recAnkle.push(tempAnkleArray)
            }
            tempHipArray = []
            tempKneeArray = []
            tempAnkleArray = []
        }

        if (cycleArray[i].cycleCount >= 0) {
            angleH.updateAngleHelper(resultData[i + skippedFrames].data)
            tempHipArray.push({ angle: angleH.getHipAngle(side), cycle: cycleArray[i].cycleCount })
            tempKneeArray.push({ angle: angleH.getKneeAngle(side), cycle: cycleArray[i].cycleCount })
            tempAnkleArray.push({ angle: angleH.getAnkleAngle(side), cycle: cycleArray[i].cycleCount })
        }

        //toka

        // if (cycleArray[i - skippedFrames].cycleCount >= 0) {
        //     angleH.updateAngleHelper(resultData[i].data)
        //     recAnkle.push({ angle: angleH.getRightAnkleAngle(), cycle: cycleArray[i - skippedFrames].cycleCount })
        //     recHip.push({ angle: angleH.getRightHipAngle(), cycle: cycleArray[i - skippedFrames].cycleCount })
        //     recKnee.push({ angle: angleH.getRightKneeAngle(), cycle: cycleArray[i - skippedFrames].cycleCount })
        // }

    }
    console.log(recAnkle)
}



export { processResults }