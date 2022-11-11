import * as angleH from "../home/AngleHelper2"
import * as resample from "./Resample"

let leftHipRE = []
let leftKneeRE = []
let leftAnkleRE = []

let rightHipRE = []
let rightKneeRE = []
let rightAnkleRE = []

let leftHipREAvg = []

let rightDirectionArray = []
let leftDirectionArray = []

let leftToeDirectionArray = []
let leftHeelDirectionArray = []

let rightToeDirectionArray = []
let rightHeelDirectionArray = []

let steps = 0
let maxSteps = 20

let skippedFrames = 30

let resampleTarget = 51

//direction is true if you walk from left to right in video otherwise its false --- default true
let direction = true

const processResults = (results, leftData, rightData) => {
  let forwardCount = 0
  let backwardCount = 0
  //for (let i = 30; i < results.length; i++) {                   <------
  for (let i = skippedFrames; i < results.length; i++) {
    if (results[i].data.poseWorldLandmarks[31].x > results[i - 1].data.poseWorldLandmarks[31].x) {
      leftToeDirectionArray.push(1)
    } else {
      leftToeDirectionArray.push(-1)
    }
    if (results[i].data.poseWorldLandmarks[29].x > results[i - 1].data.poseWorldLandmarks[29].x) {
      leftHeelDirectionArray.push(1)
    } else {
      leftHeelDirectionArray.push(-1)
    }
    if (results[i].data.poseWorldLandmarks[32].x > results[i - 1].data.poseWorldLandmarks[32].x) {
      rightToeDirectionArray.push(1)
    } else {
      rightToeDirectionArray.push(-1)
    }
    if (results[i].data.poseWorldLandmarks[30].x > results[i - 1].data.poseWorldLandmarks[30].x) {
      rightHeelDirectionArray.push(1)
    } else {
      rightHeelDirectionArray.push(-1)
    }
  }
  for (let i = skippedFrames; i < results.length; i++) {
    if (rightHeelDirectionArray[i] === 1) {
      forwardCount++
    } else {
      backwardCount++
    }
  }
  if (forwardCount > backwardCount) {
    direction = false
    for (let i = 0; i < rightHeelDirectionArray.length; i++) {
      if (rightHeelDirectionArray[i] === 1) {
        rightHeelDirectionArray[i] = -1
      } else if (rightHeelDirectionArray[i] === -1) rightHeelDirectionArray[i] = 1

      if (rightToeDirectionArray[i] === 1) {
        rightToeDirectionArray[i] = -1
      } else if (rightToeDirectionArray[i] === -1) rightToeDirectionArray[i] = 1

      if (leftHeelDirectionArray[i] === 1) {
        leftHeelDirectionArray[i] = -1
      } else if (leftHeelDirectionArray[i] === -1) leftHeelDirectionArray[i] = 1

      if (leftToeDirectionArray[i] === 1) {
        leftToeDirectionArray[i] = -1
      } else if (leftToeDirectionArray[i] === -1) leftToeDirectionArray[i] = 1
    }
  }
  console.log(leftToeDirectionArray, leftHeelDirectionArray, rightToeDirectionArray, rightHeelDirectionArray)
  console.log(leftDirectionArray, rightDirectionArray)
  getDirectionChangeIndex(rightToeDirectionArray, rightHeelDirectionArray, rightDirectionArray)
  getDirectionChangeIndex(leftToeDirectionArray, leftHeelDirectionArray, leftDirectionArray)
  makeStepAngleArray(rightDirectionArray, results, rightHipRE, rightKneeRE, rightAnkleRE, false)
  makeStepAngleArray(leftDirectionArray, results, leftHipRE, leftKneeRE, leftAnkleRE, true)
  console.log(leftHipRE, leftKneeRE, leftAnkleRE, rightHipRE, rightKneeRE, rightAnkleRE)

  //formAvgRechartsArray(leftHipRE, steps)
}

const getDirectionChangeIndex = (toeDirArray, heelDirArray, dirArray) => {
  let certainty = false
  let forward = true
  let cycleCount = 0
  let start = false

  for (let i = 0; i < heelDirArray.length; i++) {
    if (!certainty) {
      if (
        heelDirArray[i] === 1 &&
        heelDirArray[i + 3] === 1 &&
        heelDirArray[i + 1] === 1 &&
        heelDirArray[i + 2] === 1
      ) {
        certainty = true
        forward = true
      } else {
        dirArray.push({ state: "unknown", cycleCount: cycleCount - 1 })
      }
    }

    //eteenpäin, kantapää
    if (certainty && forward) {
      if (heelDirArray[i] === -1) {
        let battle =
          heelDirArray[i] +
          heelDirArray[i + 1] +
          heelDirArray[i + 2] +
          heelDirArray[i + 3] +
          heelDirArray[i + 4] +
          heelDirArray[i + 5] +
          heelDirArray[i + 6] +
          heelDirArray[i + 7] +
          heelDirArray[i + 8]
        if (battle <= -2) {
          forward = false
          start = true
          cycleCount++
          dirArray.push({ state: "ground", cycleCount: cycleCount })
          continue
        } else if (start && cycleCount !== 0) {
          dirArray.push({ state: "air", cycleCount: cycleCount })
        } else {
          dirArray.push({ state: "ready", cycleCount: cycleCount - 1 })
        }
      } else if (start && cycleCount !== 0) {
        dirArray.push({ state: "air", cycleCount: cycleCount })
      } else {
        dirArray.push({ state: "ready", cycleCount: cycleCount - 1 })
      }
    }

    //taaksepäin, varpaat
    if (certainty && !forward) {
      if (toeDirArray[i] === 1) {
        let battle =
          toeDirArray[i] +
          toeDirArray[i + 1] +
          toeDirArray[i + 2] +
          toeDirArray[i + 3] +
          toeDirArray[i + 4] +
          toeDirArray[i + 5] +
          toeDirArray[i + 6] +
          toeDirArray[i + 7] +
          toeDirArray[i + 8]
        if (battle >= 2) {
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
      tempHipArray.push(angleH.getHipAngle(side, direction))
      tempKneeArray.push(angleH.getKneeAngle(side, direction))
      tempAnkleArray.push(angleH.getAnkleAngle(side, direction))
    }
  }
  steps = stepcount
}

const resampleAngleData = (array, target) => {
  for (let i = 0; i < array.length; i++) {
    array[i] = resample.resampleData(array[i], target)
  }

  let temp = []
  let temp2 = []
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array[i].length; j++) {
      temp2.push(array[i][j])
      if (j < array[i].length - 1) {
        temp2.push((array[i][j] + array[i][j + 1]) / 2)
      }
    }
    temp.push(temp2)
    temp2 = []

  }

  return temp
}

const formRechartsArray = (array, steps) => {
  let reArray = resampleAngleData(array, resampleTarget)

  console.log(reArray)
  let temp = []
  for (let i = steps - 1; i <= maxSteps; i++) {
    reArray[i] = reArray[0]
  }
  for (let i = 0; i < 101; i++) {
    temp.push({
      sample: i,
      first: reArray[0][i],
      second: reArray[1][i],
      third: reArray[2][i],
      fourth: reArray[3][i],
      fifth: reArray[4][i],
      sixth: reArray[5][i],
      seventh: reArray[6][i],
      eighth: reArray[7][i],
      ninth: reArray[8][i],
      tenth: reArray[9][i],
      eleventh: reArray[10][i],
      twelvth: reArray[11][i],
      thirteenth: reArray[12][i],
      fourteenth: reArray[13][i],
      fiftheenth: reArray[14][i],
      sixteenth: reArray[15][i],
      seventeenth: reArray[16][i],
      eightteenth: reArray[17][i],
      ninteenth: reArray[18][i],
      twentieth: reArray[19][i],
    })
  }
  return temp
}

// const formAvgRechartsArray = (array, steps) => {
//   resampleAngleData(array, resampleTarget)
//   let avgTemp = []
//   let temp = []
//   let angles = 0
//   console.log(steps)
//   for (let i = 0; i < resampleTarget; i++) {
//     for (let j = 0; j < steps - 1; j++) {
//       angles += array[j][i]
//       if (j === steps - 2) {
//         avgTemp.push(angles / steps - 1)
//         angles = 0
//       }
//     }
//   }
//   for (let i = 0; i < resampleTarget; i++) {
//     temp.push({
//       sample: i,
//       first: array[0][i],
//     })
//   }
//   console.log(avgTemp)
//   return temp
// // }

// const getLeftHipAvgAngle = () => {
//   return formAvgRechartsArray(leftHipRE, steps)
// }

// const getLeftKneeAvgAngle = () => {
//   return formAvgRechartsArray(leftKneeRE, steps)
// }

// const getLeftAnkleAvgAngle = () => {
//   return formAvgRechartsArray(leftAnkleRE, steps)
// }

// const getRightHipAvgAngle = () => {
//   return formAvgRechartsArray(rightHipRE, steps)
// }

// const getRightKneeAvgAngle = () => {
//   return formAvgRechartsArray(rightKneeRE, steps)
// }

// const getRightAnkleAvgAngle = () => {
//   return formAvgRechartsArray(rightAnkleRE, steps)
// }

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

export {
  processResults,
  getLeftHipAngle,
  getLeftKneeAngle,
  getLeftAnkleAngle,
  getRightHipAngle,
  getRightKneeAngle,
  getRightAnkleAngle,
  getSteps,
  // getLeftHipAvgAngle,
  // getLeftKneeAvgAngle,
  // getLeftAnkleAvgAngle,
  // getRightHipAvgAngle,
  // getRightKneeAvgAngle,
  // getRightAnkleAvgAngle,
}
