import * as angleH from "../home/AngleHelper"
import * as resample from "./Resample"

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
let maxSteps = 20

let skippedFrames = 30

let resampleTarget = 80

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
    getDirectionChangeIndex(rightToeDirectionArray, rightHeelDirectionArray, rightDirectionArray)
    getDirectionChangeIndex(leftToeDirectionArray, leftHeelDirectionArray, leftDirectionArray)    
    makeStepAngleArray(rightDirectionArray, results, rightHipRE, rightKneeRE, rightAnkleRE, false)
    console.log(rightHipRE, rightKneeRE, rightAnkleRE, leftHipRE, leftKneeRE, leftAnkleRE)
    makeStepAngleArray(leftDirectionArray, results, leftHipRE, leftKneeRE, leftAnkleRE, true)
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
}

const makeStepAngleArray = (cycleArray, resultData, recHip, recKnee, recAnkle, side) => {

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
            tempHipArray.push(angleH.getHipAngle(side))
            tempKneeArray.push(angleH.getKneeAngle(side))
            tempAnkleArray.push(angleH.getAnkleAngle(side))
        }
    }
    steps = stepcount    
}

const resampleAngleData = (array, target) => {
    for (let i = 0; i < array.length; i++) {
        array[i] = resample.resampleData(array[i], target)
    }
}

const formRechartsArray = (array, steps) => {   
//    // resampleAngleData(array, resampleTarget)   
//     let temp = []
//     for (let i = steps - 1; i <= maxSteps; i++) {        
//         array[i] = array[0]
//     }    
//     for (let i = 0; i < resampleTarget; i++) {
//         temp.push({ sample: i, first: array[0][i], second: array[1][i], third: array[2][i], fourth: array[3][i], fifth: array[4][i], sixth: array[5][i], seventh: array[6][i], eighth: array[7][i], ninth: array[8][i], tenth: array[9][i], eleventh: array[10][i], twelvth: array[11][i], thirteenth: array[12][i], fourteenth: array[13][i], fiftheenth: array[14][i], sixteenth: array[15][i], seventeenth: array[16][i], eightteenth: array[17][i], ninteenth: array[18][i], twentieth: array[19][i] })        
//     }    
    return array
}

const getLeftHipAngle = () => {
    return formRechartsArray(leftHipRE, steps)
}
const getLeftKneeAngle = () => {
    return formRechartsArray(leftKneeRE, steps)
}
const getLeftAnkleAngle = () => {
    return formRechartsArray(leftAnkleRE, steps)
}
const getRightHipAngle = () => {
    return formRechartsArray(rightHipRE, steps) 
}
const getRightKneeAngle = () => {
    return formRechartsArray(rightKneeRE, steps)
}
const getRightAnkleAngle = () => {
    return formRechartsArray(rightAnkleRE, steps)
}
const getSteps = () => {
    return steps
}

export { processResults, getLeftHipAngle, getLeftKneeAngle, getLeftAnkleAngle, getRightHipAngle, getRightKneeAngle, getRightAnkleAngle, getSteps }