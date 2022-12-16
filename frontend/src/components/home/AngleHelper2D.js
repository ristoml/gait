let leftHipX,
  leftHipY,
  leftKneeX,
  leftKneeY,
  leftAnkleX,
  leftAnkleY,
  leftHeelX,
  leftHeelY,
  leftFootIndexX,
  leftFootIndexY,
  leftShoulderX,
  leftShoulderY

let rightHipX,
  rightHipY,
  rightKneeX,
  rightKneeY,
  rightAnkleX,
  rightAnkleY,
  rightHeelX,
  rightHeelY,
  rightFootIndexX,
  rightFootIndexY,
  rightShoulderY,
  rightShoulderX

const updateAngleHelper = (results) => {
  leftHipX = results.poseLandmarks[23].x
  leftHipY = results.poseLandmarks[23].y
  leftKneeX = results.poseLandmarks[25].x
  leftKneeY = results.poseLandmarks[25].y
  leftAnkleX = results.poseLandmarks[27].x
  leftAnkleY = results.poseLandmarks[27].y
  leftHeelX = results.poseLandmarks[29].x
  leftHeelY = results.poseLandmarks[29].y
  leftFootIndexX = results.poseLandmarks[31].x
  leftFootIndexY = results.poseLandmarks[31].y
  leftShoulderX = results.poseLandmarks[11].x
  leftShoulderY = results.poseLandmarks[11].y

  rightHipX = results.poseLandmarks[24].x
  rightHipY = results.poseLandmarks[24].y
  rightKneeX = results.poseLandmarks[26].x
  rightKneeY = results.poseLandmarks[26].y
  rightAnkleX = results.poseLandmarks[28].x
  rightAnkleY = results.poseLandmarks[28].y
  rightHeelX = results.poseLandmarks[30].x
  rightHeelY = results.poseLandmarks[30].y
  rightFootIndexX = results.poseLandmarks[32].x
  rightFootIndexY = results.poseLandmarks[32].y
  rightShoulderX = results.poseLandmarks[12].x
  rightShoulderY = results.poseLandmarks[12].y
}

const getKneeAngle = (side, direction) => {
  let temp
  if (side && direction) {
    temp =
      (Math.atan2(leftAnkleY - leftKneeY, leftAnkleX - leftKneeX) - Math.atan2(
        leftHipY - leftKneeY,
        leftHipX - leftKneeX
      )) *
      (180 / Math.PI)
    if (temp >= 0) temp = temp - 180// return temp - 180
    else temp = temp + 180 //return temp + 180
    return temp
  } else if (!side && direction) {
    temp =
      (Math.atan2(rightAnkleY - rightKneeY, rightAnkleX - rightKneeX) -
        Math.atan2(
          rightHipY - rightKneeY,
          rightHipX - rightKneeX
        )) *
      (180 / Math.PI)
    if (temp >= 0) temp = temp - 180 //return temp - 180
    else temp = temp + 180 //return temp + 180
    return temp
  } else if (side && !direction) {
    temp =
      (Math.atan2(leftAnkleY - leftKneeY, leftAnkleX - leftKneeX) -
        Math.atan2(
          leftHipY - leftKneeY,
          leftHipX - leftKneeX
        )) *
      (180 / Math.PI)
    if (temp >= 180) temp = 180 - temp //return 180 - temp
    else temp = 180 - temp //return 180 - temp
    return temp
  } else if (!side && !direction) {
    temp =
      (Math.atan2(rightAnkleY - rightKneeY, rightAnkleX - rightKneeX) -
        Math.atan2(
          rightHipY - rightKneeY,
          rightHipX - rightKneeX
        )) *
      (180 / Math.PI)
    temp = 180 - temp
    return temp
  }


}

const getHipAngle = (side, direction) => {
  let temp
  if (side && direction) {
    temp =
      (Math.atan2(
        (leftHipY + rightHipY) / 2 - (leftShoulderY + rightShoulderY) / 2,
        (leftHipX + rightHipX) / 2 - (leftShoulderX + rightShoulderX) / 2
      ) -
        Math.atan2(
          leftKneeY - leftHipY,
          leftKneeX - leftHipX)) *
      180 / Math.PI

    return temp
  } else if (!side && direction) {
    temp =
      (Math.atan2(
        (leftHipY + rightHipY) / 2 - (leftShoulderY + rightShoulderY) / 2,
        (leftHipX + rightHipX) / 2 - (leftShoulderX + rightShoulderX) / 2
      ) -
        Math.atan2(
          rightKneeY - rightHipY,
          rightKneeX - rightHipX)) *
      (180 / Math.PI)

    return temp

  } else if (!side && !direction) {
    temp =
      (Math.atan2(
        (leftHipY + rightHipY) / 2 - (leftShoulderY + rightShoulderY) / 2,
        (leftHipX + rightHipX) / 2 - (leftShoulderX + rightShoulderX) / 2
      ) -
        Math.atan2(
          rightKneeY - rightHipY,
          rightKneeX - rightHipX)) *
      (180 / Math.PI)
    return temp * -1
  } else if (side && !direction) {

    temp =
      (Math.atan2(
        (leftHipY + rightHipY) / 2 - (leftShoulderY + rightShoulderY) / 2,
        (leftHipX + rightHipX) / 2 - (leftShoulderX + rightShoulderX) / 2
      ) -
        Math.atan2(
          leftKneeY - leftHipY,
          leftKneeX - leftHipX)) *
      180 / Math.PI

    return temp * -1
  }
}

const getAnkleAngle = (side, direction) => {
  let temp
  if (side && direction) {
    temp =
      (Math.atan2(leftFootIndexY - leftHeelY, leftFootIndexX - leftHeelX) -
        Math.atan2(leftKneeY - leftAnkleY, leftKneeX - leftAnkleX)) *
      180 / Math.PI
    return 90 - temp
  } else if (!side && direction) {
    temp =
      (Math.atan2(rightFootIndexY - rightHeelY, rightFootIndexX - rightHeelX) -
        Math.atan2(rightKneeY - rightAnkleY, rightKneeX - rightAnkleX)) *
      180 / Math.PI
    if (temp >= 0) return 90 - temp
    else return 90 + temp
  } else if (side && !direction) {
    temp =
      (Math.atan2(leftFootIndexY - leftHeelY, leftFootIndexX - leftHeelX) -
        Math.atan2(leftKneeY - leftAnkleY, leftKneeX - leftAnkleX)) *
      180 / Math.PI
    if (temp >= 0) return temp - 270
    else return temp + 90
  } else if (!side && !direction) {
    temp =
      (Math.atan2(rightFootIndexY - rightHeelY, rightFootIndexX - rightHeelX) -
        Math.atan2(rightKneeY - rightAnkleY, rightKneeX - rightAnkleX)) *
      180 / Math.PI
    if (temp >= 0) return temp - 270
    else return 90 + temp
  }


}

export { updateAngleHelper, getHipAngle, getKneeAngle, getAnkleAngle }
