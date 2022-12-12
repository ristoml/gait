import * as angle2D from "../home/AngleHelper2D"
import * as angle3D from "../home/AngleHelper3D"
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
let leftAnkleDirectionArray = []
let rightToeDirectionArray = []
let rightHeelDirectionArray = []
let rightAnkleDirectionArray = []

let rightSteps = 0
let leftSteps = 0
let maxSteps = 20
let leftSwingIndex = -1
let rightSwingIndex = -1
let skippedFrames = 30
let resampleTarget = 51
let resultsOk = false
let angleH

//direction is true if you walk from left to right in video otherwise its false --- default true
let directionRight = true

const processResults = (results, use3D, dirRight) => {
  directionRight = dirRight  
  use3D ? angleH = angle3D : angleH = angle2D

  //for (let i = 30; i < results.length; i++) {                   <------
  for (let i = skippedFrames; i < results.length; i++) {
    if (results[i].data.poseLandmarks[31].x > results[i - 1].data.poseLandmarks[31].x) {
      dirRight ? leftToeDirectionArray.push(1) : leftToeDirectionArray.push(-1)
      // leftToeDirectionArray.push(1)
    } else {
      dirRight ? leftToeDirectionArray.push(-1) : leftToeDirectionArray.push(1)
      // leftToeDirectionArray.push(-1)
    }
    if (results[i].data.poseLandmarks[29].x > results[i - 1].data.poseLandmarks[29].x) {
      dirRight ? leftHeelDirectionArray.push(1) : leftHeelDirectionArray.push(-1)
      // leftHeelDirectionArray.push(1)
    } else {
      dirRight ? leftHeelDirectionArray.push(-1) : leftHeelDirectionArray.push(1)
      // leftHeelDirectionArray.push(-1)
    }
    if (results[i].data.poseLandmarks[27].x > results[i - 1].data.poseLandmarks[27].x) {
      dirRight ? leftAnkleDirectionArray.push(1) : leftAnkleDirectionArray.push(-1)
      // leftAnkleDirectionArray.push(1)
    } else {
      dirRight ? leftAnkleDirectionArray.push(-1) : leftAnkleDirectionArray.push(1)
      // leftAnkleDirectionArray.push(-1)
    }
    if (results[i].data.poseLandmarks[32].x > results[i - 1].data.poseLandmarks[32].x) {
      dirRight ? rightToeDirectionArray.push(1) : rightToeDirectionArray.push(-1)
      // rightToeDirectionArray.push(1)
    } else {
      dirRight ? rightToeDirectionArray.push(-1) : rightToeDirectionArray.push(1)
      // rightToeDirectionArray.push(-1)
    }
    if (results[i].data.poseLandmarks[30].x > results[i - 1].data.poseLandmarks[30].x) {
      dirRight ? rightHeelDirectionArray.push(1) : rightHeelDirectionArray.push(-1)
      // rightHeelDirectionArray.push(1)
    } else {
      dirRight ? rightHeelDirectionArray.push(-1) : rightHeelDirectionArray.push(1)
      // rightHeelDirectionArray.push(-1)
    }
    if (results[i].data.poseLandmarks[28].x > results[i - 1].data.poseLandmarks[28].x) {
      dirRight ? rightAnkleDirectionArray.push(1) : rightAnkleDirectionArray.push(-1)
      // rightAnkleDirectionArray.push(1)
    } else {
      dirRight ? rightAnkleDirectionArray.push(-1) : rightAnkleDirectionArray.push(1)
      // rightAnkleDirectionArray.push(-1)
    }
  }

  // console.log(leftToeDirectionArray, leftHeelDirectionArray, rightToeDirectionArray, rightHeelDirectionArray)
  // console.log(leftDirectionArray, rightDirectionArray)
  // console.log(leftHeelDirectionArray, leftAnkleDirectionArray)

  getDirectionChangeIndex(rightToeDirectionArray, rightHeelDirectionArray, rightAnkleDirectionArray, rightDirectionArray)
  getDirectionChangeIndex(leftToeDirectionArray, leftHeelDirectionArray, leftAnkleDirectionArray, leftDirectionArray)
 
  rightSwingIndex = getSwingIndex(rightDirectionArray)
  leftSwingIndex = getSwingIndex(leftDirectionArray)
  makeStepAngleArray(rightDirectionArray, results, rightHipRE, rightKneeRE, rightAnkleRE, false)
  makeStepAngleArray(leftDirectionArray, results, leftHipRE, leftKneeRE, leftAnkleRE, true)
  resultsOk = checkArrayLengths(rightHipRE) && checkArrayLengths(leftHipRE)
  rightHipRE = fixArrayLengths(rightHipRE)
  rightKneeRE = fixArrayLengths(rightKneeRE)
  rightAnkleRE = fixArrayLengths(rightAnkleRE)

  leftHipRE = fixArrayLengths(leftHipRE)
  leftKneeRE = fixArrayLengths(leftKneeRE)
  leftAnkleRE = fixArrayLengths(leftAnkleRE)

  // -------------- FILTTERI --------------------
  for (let i = 0; i < 50; i++) {    
    rightHipRE = filterArray(rightHipRE, 2)
    rightKneeRE = filterArray(rightKneeRE, 2)
    rightAnkleRE = filterArray(rightAnkleRE, 2)
    leftHipRE = filterArray(leftHipRE, 2)
    leftKneeRE = filterArray(leftKneeRE, 2)
    leftAnkleRE = filterArray(leftAnkleRE, 2)
  }
  console.log(leftHipRE, leftKneeRE, leftAnkleRE, rightHipRE, rightKneeRE, rightAnkleRE)
}

const checkArrayLengths = (array) => {
  let lengthOk = true
  let max = 0
  for (let i = 0; i < array.length; i++) {
    if (array[i].length > max) {
      max = array[i].length
    }
  }
  if (max < resampleTarget + 1) {
    lengthOk = false
    
  } 
  for (let i = 0; i < array.length; i++) {
    if (array[i].length <= 0.6 * max || array[i].length >= 135) {
     
      lengthOk = false
    }
  }
  return lengthOk
}

const fixArrayLengths = (array) => {
  let max = 0
  let temp = []  
  // console.log(array)
  for (let i = 0; i < array.length; i++) {
    if (array[i].length > max) {
      max = array[i].length
    }
  }  
  for (let i = 0; i < array.length; i++) {
    if (array[i].length <= 0.6 * max && i < array.length - 2) {
      if (array[i].length + array[i + 1].length <= 0.7 * max) {
        temp.push(array[i].concat(array[i + 1].concat(array[i + 2])))
        i += 2
      } else {
        temp.push(array[i].concat(array[i + 1]))
        i++
      }
    } else {
      temp.push(array[i])
    }
  }
  // console.log(temp)
  return temp
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
        if (toeDirArray[i + 2] === -1 && ankleDirArray[i + 2] === -1) battle--
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
        if (toeDirArray[i + 2] === 1 && ankleDirArray[i + 2] === 1) battle++
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

const getSwingIndex = (array) => {
  let groundTemp = []
  let airTemp = []
  let saved = false
  let first = 0
  let firstSet = false
  for (let i = 0; i < array.length; i++) {
    if (!saved && array[i].state === "ground") {
      if (!firstSet) {
        groundTemp.push(0)
        first = i
        firstSet = true
      } else {
        groundTemp.push(i - first)
      }
      saved = true
    } else if (saved && array[i].state === "air") {
      airTemp.push(i - first)
      saved = false
    }
  }
  let sum = 0
  let avg = 0
  for (let i = groundTemp.length; i > 2; i--) {
    sum += (airTemp[i - 2] - groundTemp[i - 2]) / (groundTemp[i - 1] - groundTemp[i - 2])
  }
  avg = sum / (groundTemp.length - 2)
  return Math.floor(avg * 100)
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
      tempHipArray.push(angleH.getHipAngle(side, directionRight))
      tempKneeArray.push(angleH.getKneeAngle(side, directionRight))
      tempAnkleArray.push(angleH.getAnkleAngle(side, directionRight))
    }
  }
  side ? rightSteps = stepcount : leftSteps = stepcount
}

const filterArray = (array, tresh) => {
  let threshold = tresh
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array[i].length; j++) {
      if (array[i][j] - array[i][j + 1] < 0) {
        if (array[i][j] - array[i][j + 1] < threshold * -1) {
          if (j < array.length - 4) {
            if (array[i][j] - (array[i][j] + array[i][j + 2]) / 2 < threshold * -1) {
              if (array[i][j] - (array[i][j] + array[i][j + 3]) / 2 < threshold * -1) {
                array[i][j + 1] = (array[i][j] + array[i][j + 4]) / 2
              } else {
                array[i][j + 1] = (array[i][j] + array[i][j + 3]) / 2
              }             
            } else {
              array[i][j + 1] = (array[i][j] + array[i][j + 2]) / 2
            }
          }
        }
      } else if (array[i][j] - array[i][j + 1] > threshold) {
        if (j < array.length - 4) {
          if (array[i][j] - (array[i][j] + array[i][j + 2]) / 2 > threshold) {
            if (array[i][j] - (array[i][j] + array[i][j + 3]) / 2 > threshold) {
              array[i][j + 1] = (array[i][j] + array[i][j + 4]) / 2
            } else {
              array[i][j + 1] = (array[i][j] + array[i][j + 3]) / 2
            }
          } else {
            array[i][j + 1] = (array[i][j] + array[i][j + 2]) / 2
          }
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
      array[i] = resample.resampleData(array[i], target)
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
    temp = temp2
  } else {
    for (let i = 0; i < array.length; i++) {
      array[i] = resample.resampleData(array[i], target)
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
  }
  return temp
}

const formRechartsArray = (array, steps) => {
  console.log(steps)

  let reArray = resampleAngleData(array, resampleTarget)
  let temp = []

  for (let i = steps - 2; i <= maxSteps; i++) {
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

const formAvgRechartsArray = (array) => {
  array = resampleAngleData(array, resampleTarget, false)
  let avgTemp = []
  let avgTemp2 = []
  let medianTemp = []
  let temp = []
  let threshold = 10
  let angles = 0
  let median = 0

  for (let i = 0; i < 101; i++) {
    for (let j = 0; j < array.length; j++) {
      medianTemp.push(array[j][i])
    }
    median = calculateMedian(medianTemp)
    for (let j = 0; j < medianTemp.length; j++) {
      if (Math.abs(medianTemp[j] - median) < threshold) {
        avgTemp.push(medianTemp[j])
      }
    }
    for (let j = 0; j < avgTemp.length; j++) {
      angles += avgTemp[j]
    }
    avgTemp2.push(angles / avgTemp.length)
    angles = 0
    avgTemp = []
    medianTemp = []
    median = 0
  }
  for (let i = 0; i < 101; i++) {
    temp.push({
      sample: i,
      first: avgTemp2[i],
    })
  }
  console.log(avgTemp2)
  return temp
}


const getLeftHipAngle = () => {
  return formRechartsArray(leftHipRE, leftSteps)
}
const getLeftKneeAngle = () => {
  return formRechartsArray(leftKneeRE, leftSteps)
}
const getLeftAnkleAngle = () => {
  return formRechartsArray(leftAnkleRE, leftSteps)
}
const getRightHipAngle = () => {
  return formRechartsArray(rightHipRE, rightSteps)
}
const getRightKneeAngle = () => {
  return formRechartsArray(rightKneeRE, rightSteps)
}
const getRightAnkleAngle = () => {
  return formRechartsArray(rightAnkleRE, rightSteps)
}
const getLeftHipAngleAvg = () => {
  return formAvgRechartsArray(leftHipRE)
}
const getLeftKneeAngleAvg = () => {
  return formAvgRechartsArray(leftKneeRE)
}
const getLeftAnkleAngleAvg = () => {
  return formAvgRechartsArray(leftAnkleRE)
}
const getRightHipAngleAvg = () => {
  return formAvgRechartsArray(rightHipRE)
}
const getRightKneeAngleAvg = () => {
  return formAvgRechartsArray(rightKneeRE)
}
const getRightAnkleAngleAvg = () => {
  return formAvgRechartsArray(rightAnkleRE)
}
const getRightSteps = () => {
  console.log(rightSteps)
  return rightSteps
}
const getLeftSteps = () => {
  console.log(leftSteps)
  return leftSteps
}
const getLeftSwingIndex = () => {
  return leftSwingIndex
}
const getRightSwingIndex = () => {
  return rightSwingIndex
}
const getResultsOk = () => {
  return resultsOk
}

export {
  processResults,
  getLeftHipAngle,
  getLeftKneeAngle,
  getLeftAnkleAngle,
  getRightHipAngle,
  getRightKneeAngle,
  getRightAnkleAngle,
  getRightSteps,
  getLeftSteps,
  getLeftSwingIndex,
  getRightSwingIndex,
  getResultsOk,
  getLeftHipAngleAvg,
  getLeftKneeAngleAvg,
  getLeftAnkleAngleAvg,
  getRightHipAngleAvg,
  getRightKneeAngleAvg,
  getRightAnkleAngleAvg
}
