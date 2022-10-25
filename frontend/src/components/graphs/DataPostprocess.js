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

let leftToeDirectionArray = []
let leftHeelDirectionArray = []

let rightToeDirectionArray = []
let rightHeelDirectionArray = []

let steps = 0

const processResults = (results, leftData, rightData) => {

    for (let i = 30; i < results.length; i++) {
        if (results[i].poseWorldLandmarks[31].x > results[i-1].poseWorldLandmarks[31].x) {
            leftToeDirectionArray.push(1)
        } else {
            leftToeDirectionArray.push(0)
        }
        if (results[i].poseWorldLandmarks[29].x > results[i-1].poseWorldLandmarks[29].x) {
            leftHeelDirectionArray.push(1)
        } else {
            leftHeelDirectionArray.push(0)
        }        
        if (results[i].poseWorldLandmarks[32].x > results[i-1].poseWorldLandmarks[32].x) {
            rightToeDirectionArray.push(1)
        } else {
            rightToeDirectionArray.push(0)
        }
        if (results[i].poseWorldLandmarks[30].x > results[i-1].poseWorldLandmarks[30].x) {
            rightHeelDirectionArray.push(1)
        } else {
            rightHeelDirectionArray.push(0)
        }

    }
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



export { processResults }