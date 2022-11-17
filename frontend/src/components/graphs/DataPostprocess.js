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
let leftAnkleDirectionArray = []

let rightToeDirectionArray = []
let rightHeelDirectionArray = []
let rightAnkleDirectionArray = []

let steps = 0
let medianGraphs = false
let maxSteps = 20

let skippedFrames = 30

let resampleTarget = 51

//direction is true if you walk from left to right in video otherwise its false --- default true
let direction = true

const processResults = (results) => {
  let forwardCount = 0
  let backwardCount = 0
  //for (let i = 30; i < results.length; i++) {                   <------
  for (let i = skippedFrames; i < results.length; i++) {

    if (results[i].data.poseLandmarks[31].x > results[i - 1].data.poseLandmarks[31].x) {
      leftToeDirectionArray.push(1)
    } else {
      leftToeDirectionArray.push(-1)
    }
    if (results[i].data.poseLandmarks[29].x > results[i - 1].data.poseLandmarks[29].x) {
      leftHeelDirectionArray.push(1)
    } else {
      leftHeelDirectionArray.push(-1)
    }
    if (results[i].data.poseLandmarks[27].x > results[i - 1].data.poseLandmarks[27].x) {
      leftAnkleDirectionArray.push(1)
    } else {
      leftAnkleDirectionArray.push(-1)
    }
    if (results[i].data.poseLandmarks[32].x > results[i - 1].data.poseLandmarks[32].x) {
      rightToeDirectionArray.push(1)
    } else {
      rightToeDirectionArray.push(-1)
    }
    if (results[i].data.poseLandmarks[30].x > results[i - 1].data.poseLandmarks[30].x) {
      rightHeelDirectionArray.push(1)
    } else {
      rightHeelDirectionArray.push(-1)
    }
    if (results[i].data.poseLandmarks[28].x > results[i - 1].data.poseLandmarks[28].x) {
      rightAnkleDirectionArray.push(1)
    } else {
      rightAnkleDirectionArray.push(-1)
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
  // console.log(leftToeDirectionArray, leftHeelDirectionArray, rightToeDirectionArray, rightHeelDirectionArray)
  // console.log(leftDirectionArray, rightDirectionArray)
  console.log(leftHeelDirectionArray, leftAnkleDirectionArray)
  getDirectionChangeIndex(rightToeDirectionArray, rightHeelDirectionArray, rightAnkleDirectionArray, rightDirectionArray)
  getDirectionChangeIndex(leftToeDirectionArray, leftHeelDirectionArray, leftAnkleDirectionArray, leftDirectionArray)
  makeStepAngleArray(rightDirectionArray, results, rightHipRE, rightKneeRE, rightAnkleRE, false)
  makeStepAngleArray(leftDirectionArray, results, leftHipRE, leftKneeRE, leftAnkleRE, true)
  // for (let i = 0; i < 5; i++) {
  //   rightHipRE = filterArray(rightHipRE, 4)
  //   rightKneeRE = filterArray(rightKneeRE, 4)
  //   rightAnkleRE = filterArray(rightAnkleRE, 4)
  //   leftHipRE = filterArray(leftHipRE, 4)
  //   leftKneeRE = filterArray(leftKneeRE, 4)
  //   leftAnkleRE = filterArray(leftAnkleRE, 4)
  // }

  console.log(leftHipRE, leftKneeRE, leftAnkleRE, rightHipRE, rightKneeRE, rightAnkleRE)

  //formAvgRechartsArray(leftHipRE, steps)
}

const getDirectionChangeIndex = (toeDirArray, heelDirArray, ankleDirArray, dirArray) => {
  let certainty = false
  let forward = true
  let cycleCount = 0
  let start = false
  let dirChangeIndex
  let dirChangePending = false
  let gaitDelayValue = 7

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
      if (heelDirArray[i] === -1 && ankleDirArray[i] === -1) {
        let battle = 0
        // if (toeDirArray[i + 1] === -1 && ankleDirArray[i + 1] === -1) battle--
        if (toeDirArray[i + 2] === -1 && ankleDirArray[i + 2] === -1) battle--
        // if (toeDirArray[i + 3] === -1 && ankleDirArray[i + 3] === -1) battle--
        // let battle =
        //   heelDirArray[i + 1] +
        //   heelDirArray[i + 2] +
        //   ankleDirArray[i + 1] +
        //   ankleDirArray[i + 2]
        // heelDirArray[i + 3]
        // heelDirArray[i + 4]
        // heelDirArray[i + 5] +
        // heelDirArray[i + 6] 
        // heelDirArray[i + 7] +
        // heelDirArray[i + 8]
        // let battle2 =         
        //   ankleDirArray[i + 1] +
        //   ankleDirArray[i + 2]  
        // ankleDirArray[i + 3] 
        // ankleDirArray[i + 4]
        // // ankleDirArray[i + 5] +
        // ankleDirArray[i + 6] 
        // ankleDirArray[i + 7] +
        // ankleDirArray[i + 8]
        if (!dirChangePending && battle <= -1) {
          dirChangePending = true
          dirChangeIndex = i
        }
        if (dirChangePending && i - dirChangeIndex >= gaitDelayValue) {
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
      dirChangePending = false
      if (toeDirArray[i] === 1 && ankleDirArray[i] === 1) {
        let battle = 0
        // if (toeDirArray[i + 1] === 1 && ankleDirArray[i + 1] === 1) battle++
        if (toeDirArray[i + 2] === 1 && ankleDirArray[i + 2] === 1) battle++
        // if (toeDirArray[i + 3] === 1 && ankleDirArray[i + 3] === 1) battle++
        // if (toeDirArray[i+1] === ankleDirArray[i+1]) battle++
        // if (toeDirArray[i+1] === ankleDirArray[i+1]) battle++

        // let battle =
        //   toeDirArray[i + 1] + // 1
        //   toeDirArray[i + 2] +
        //   ankleDirArray[i + 1] +
        //   ankleDirArray[i + 2]
        // toeDirArray[i + 3]  
        // toeDirArray[i + 4]
        // toeDirArray[i + 5] +
        // toeDirArray[i + 6] 
        // toeDirArray[i + 7] +
        // toeDirArray[i + 8]
        // let battle2 =

        // ankleDirArray[i + 3]
        // ankleDirArray[i + 4]
        // ankleDirArray[i + 5] +
        // ankleDirArray[i + 6] 
        // ankleDirArray[i + 7] +
        // ankleDirArray[i + 8]
        if (battle >= 1) {
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

// const modifiedWords = words.filter((word, index, arr) => {
//   arr[index + 1] += ' extra';
//   return word.length < 6;
// });

const filterArray = (array, tresh) => {
  let treshold = tresh

  for (let i = 0; i < array.length; i++) {
    // const filtered = array[i].map((element, index, arr) => {
    for (let j = 0; j < array[i].length; j++) {
      if (array[i][j] - array[i][j + 1] < 0) {
        if (array[i][j] - array[i][j + 1] < treshold * -1) {
          if (i < array.length - 1) {
            array[i][j + 1] = (array[i][j] + array[i][j + 2]) / 2
          }
        }
      } else if (array[i][j] - array[i][j + 1] > treshold) {
        if (i < array.length - 1) {
          array[i][j + 1] = (array[i][j] + array[i][j + 2]) / 2
        }
      }
    }
  }
  return array
}

const resampleAngleData = (array, target, median) => {
  let temp = []
  let temp2 = []
  let medianTemp = []
  if (median) {
    for (let i = 0; i < array.length; i++) {
      array[i] = resample.resampleData(array[i], 200)
    }
    for (let j = 0; j < array[0].length; j++) {
      for (let i = 0; i < array.length; i++) {
        medianTemp.push(array[i][j])
      }
      temp.push(calculateMedian(medianTemp))
      medianTemp = []
    }
    temp = resample.resampleData(temp, target)
    for (let i = 0; i < temp.length; i++) {
      temp2.push(temp[i])
      if (i < temp.length - 1) {
        temp2.push((temp[i] + temp[i + 1]) / 2)
      }
    }
    // console.log(temp2)
    temp = temp2
  } else {
    for (let i = 0; i < array.length; i++) {
      array[i] = resample.resampleData(array[i], 200)
    }
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
    // temp = temp2
  }
  return array
}

const formRechartsArray = (array, steps, median) => {
  if (median) medianGraphs = true
  let reArray = resampleAngleData(array, resampleTarget, median)
  let temp = []
  console.log(reArray)
  if (median) {
    for (let i = 0; i < 101; i++) {
      temp.push({
        sample: i,
        first: reArray[i],
        second: reArray[i],
        third: reArray[i],
        fourth: reArray[i],
        fifth: reArray[i],
        sixth: reArray[i],
        seventh: reArray[i],
        eighth: reArray[i],
        ninth: reArray[i],
        tenth: reArray[i],
        eleventh: reArray[i],
        twelvth: reArray[i],
        thirteenth: reArray[i],
        fourteenth: reArray[i],
        fiftheenth: reArray[i],
        sixteenth: reArray[i],
        seventeenth: reArray[i],
        eightteenth: reArray[i],
        ninteenth: reArray[i],
        twentieth: reArray[i],
      })
    }
  } else {
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
  }
  return temp
}
const calculateMedian = (values) => {
  values.sort(function (a, b) {
    return a - b;
  });
  var half = Math.floor(values.length / 2);

  if (values.length % 2)
    return values[half];
  else
    return (values[half - 1] + values[half]) / 2.0;
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

const getLeftHipAngle = (median) => {
  return formRechartsArray(leftHipRE, steps, median)
}
const getLeftKneeAngle = (median) => {
  return formRechartsArray(leftKneeRE, steps, median)
}
const getLeftAnkleAngle = (median) => {
  return formRechartsArray(leftAnkleRE, steps, median)
}
const getRightHipAngle = (median) => {
  return formRechartsArray(rightHipRE, steps, median)
}
const getRightKneeAngle = (median) => {
  return formRechartsArray(rightKneeRE, steps, median)
}
const getRightAnkleAngle = (median) => {
  return formRechartsArray(rightAnkleRE, steps, median)
}
const getSteps = () => {
  return steps
}
const getMedian = () => {
  return medianGraphs
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
  getMedian
  // getLeftHipAvgAngle,
  // getLeftKneeAvgAngle,
  // getLeftAnkleAvgAngle,
  // getRightHipAvgAngle,
  // getRightKneeAvgAngle,
  // getRightAnkleAvgAngle,
}
