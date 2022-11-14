// let leftShoulderHipDot, leftHipKneeDot, leftKneeAnkleDot, leftAnkleFootDot
// let rightShoulderHipDot, rightHipKneeDot, rightKneeAnkleDot, rightAnkleFootDot

// let leftShoulderHipMag, leftHipKneeMag, leftKneeAnkleMag, leftAnkleFootMag
// let rightShoulderHipMag, rightHipKneeMag, rightKneeMag, rightAnkleFootMag

let leftHipX,
  leftHipY,
  leftHipZ,
  leftKneeX,
  leftKneeY,
  leftKneeZ,
  leftAnkleX,
  leftAnkleY,
  leftAnkleZ,
  leftHeelX,
  leftHeelY,
  leftHeelZ,
  leftFootIndexX,
  leftFootIndexY,
  leftFootIndexZ,
  leftShoulderX,
  leftShoulderY,
  leftShoulderZ

let rightHipX,
  rightHipY,
  rightHipZ,
  rightKneeX,
  rightKneeY,
  rightKneeZ,
  rightAnkleX,
  rightAnkleY,
  rightAnkleZ,
  rightHeelX,
  rightHeelY,
  rightHeelZ,
  rightFootIndexX,
  rightFootIndexY,
  rightFootIndexZ,
  rightShoulderY,
  rightShoulderX,
  rightShoulderZ

// leftHipX = -4.0
// leftHipY = -8.0
// leftHipZ = 6.0
// leftKneeX = 1.0
// leftKneeY = 1.0
// leftKneeZ = 2.0
// leftAnkleX = 4.0
// leftAnkleY = 7.0
// leftAnkleZ = 3.0

const updateAngleHelper = (results) => {
  leftShoulderX = results.poseWorldLandmarks[11].x
  leftShoulderY = results.poseWorldLandmarks[11].y
  leftShoulderZ = results.poseWorldLandmarks[11].z
  leftHipX = results.poseWorldLandmarks[23].x
  leftHipY = results.poseWorldLandmarks[23].y
  leftHipZ = results.poseWorldLandmarks[23].z
  leftKneeX = results.poseWorldLandmarks[25].x
  leftKneeY = results.poseWorldLandmarks[25].y
  leftKneeZ = results.poseWorldLandmarks[25].z
  leftAnkleX = results.poseWorldLandmarks[27].x
  leftAnkleY = results.poseWorldLandmarks[27].y
  leftAnkleZ = results.poseWorldLandmarks[27].z

  leftHeelX = results.poseWorldLandmarks[29].x
  leftHeelY = results.poseWorldLandmarks[29].y
  leftHeelZ = results.poseWorldLandmarks[29].z
  leftFootIndexX = results.poseWorldLandmarks[31].x
  leftFootIndexY = results.poseWorldLandmarks[31].y
  leftFootIndexZ = results.poseWorldLandmarks[31].z

  rightShoulderX = results.poseWorldLandmarks[12].x
  rightShoulderY = results.poseWorldLandmarks[12].y
  rightShoulderZ = results.poseWorldLandmarks[12].z
  rightHipX = results.poseWorldLandmarks[24].x
  rightHipY = results.poseWorldLandmarks[24].y
  rightHipZ = results.poseWorldLandmarks[24].z
  rightKneeX = results.poseWorldLandmarks[26].x
  rightKneeY = results.poseWorldLandmarks[26].y
  rightKneeZ = results.poseWorldLandmarks[26].z
  rightAnkleX = results.poseWorldLandmarks[28].x
  rightAnkleY = results.poseWorldLandmarks[28].y
  rightAnkleZ = results.poseWorldLandmarks[28].z
  rightHeelX = results.poseWorldLandmarks[30].x
  rightHeelY = results.poseWorldLandmarks[30].y
  rightHeelZ = results.poseWorldLandmarks[30].z
  rightFootIndexX = results.poseWorldLandmarks[32].x
  rightFootIndexY = results.poseWorldLandmarks[32].y
  rightFootIndexZ = results.poseWorldLandmarks[32].z

  // leftShoulderHipDot = leftShoulderZ*leftHipZ
  // leftHipKneeDot = leftHipZ*leftKneeZ

}
const getLeftDepth = () => {
  return (Math.acos(((leftHipX - leftKneeX) * (leftAnkleX - leftKneeX) + (leftHipY - leftKneeY) * (leftAnkleY - leftKneeY) + (leftHipZ - leftKneeZ) * (leftAnkleZ - leftKneeZ)) / (Math.sqrt(Math.pow((leftHipX - leftKneeX), 2)) + Math.pow((leftHipY - leftKneeY), 2) + Math.pow((leftHipZ - leftKneeZ), 2)) * Math.sqrt(Math.pow((leftAnkleX - leftKneeX), 2) + Math.pow((leftAnkleY - leftKneeY), 2) + Math.pow((leftAnkleZ - leftKneeZ), 2)))) * 180 / Math.PI
}

const getKneeAngle = (side, direction) => {
  let temp
  if (side && direction) {
    temp =
      (Math.atan2(leftAnkleY - leftKneeY, leftAnkleX - leftKneeX) -
        Math.atan2(
          (leftHipY + rightHipY) / 2 - leftKneeY,
          (leftHipX + rightHipX) / 2 - leftKneeX
        )) *
      (180 / Math.PI)
    if (temp >= 0) return temp - 180
    else return temp + 180
  } else if (!side && direction) {
    temp =
      (Math.atan2(rightAnkleY - rightKneeY, rightAnkleX - rightKneeX) -
        Math.atan2(
          (rightHipY + leftHipY) / 2 - rightKneeY,
          (rightHipX + leftHipY) / 2 - rightKneeX
        )) *
      (180 / Math.PI)
    if (temp >= 0) return temp - 180
    else return temp + 180
  } else if (side && !direction) {
    temp =
      (Math.atan2(leftAnkleY - leftKneeY, leftAnkleX - leftKneeX) -
        Math.atan2(
          (leftHipY + rightHipY) / 2 - leftKneeY,
          (leftHipX + rightHipX) / 2 - leftKneeX
        )) *
      (180 / Math.PI)
    if (temp >= 180) return 180 - temp
    else return 180 - temp
  } else if (!side && !direction) {
    temp =
      (Math.atan2(rightAnkleY - rightKneeY, rightAnkleX - rightKneeX) -
        Math.atan2(
          (rightHipY + leftHipY) / 2 - rightKneeY,
          (rightHipX + leftHipY) / 2 - rightKneeX
        )) *
      (180 / Math.PI)
    return 180 - temp
  }

  //return (Math.atan2(leftAnkleY - leftKneeY, leftAnkleX - leftKneeX) - Math.atan2(leftHipY - leftKneeY, leftHipX - leftKneeX)) * (180 / Math.PI)
}

const getHipAngle = (side, direction) => {
  let temp
  if (side && direction) {
    temp =
      (Math.atan2(
        leftKneeY - (leftHipY + rightHipY) / 2,
        leftKneeX - (leftHipX + rightHipX) / 2
      ) -
        Math.atan2(
          (leftShoulderY + rightShoulderY) / 2 - leftKneeY,
          (leftShoulderX + rightShoulderX) / 2 - leftKneeX
        )) *
      (180 / Math.PI)
    if (temp >= 0) return 180 - temp
    else return 180 + temp
  } else if (!side && direction) {
    temp =
      (Math.atan2(
        rightKneeY - (rightHipY + leftHipY) / 2,
        rightKneeX - (rightHipX + leftHipX) / 2
      ) -
        Math.atan2(
          (rightShoulderY + leftShoulderY) / 2 - rightKneeY,
          (rightShoulderX + leftShoulderX) / 2 - rightKneeX
        )) *
      (180 / Math.PI)
    if (temp >= 0) return 180 - temp
    else return 180 + temp
  }
  if (side && !direction) {
    temp =
      (Math.atan2(
        leftKneeY - (leftHipY + rightHipY) / 2,
        leftKneeX - (leftHipX + rightHipX) / 2
      ) -
        Math.atan2(
          (leftShoulderY + rightShoulderY) / 2 - leftKneeY,
          (leftShoulderX + rightShoulderX) / 2 - leftKneeX
        )) *
      (180 / Math.PI)
    return temp - 180
  } else if (!side && !direction) {
    temp =
      (Math.atan2(
        rightKneeY - (rightHipY + leftHipY) / 2,
        rightKneeX - (rightHipX + leftHipX) / 2
      ) -
        Math.atan2(
          (rightShoulderY + leftShoulderY) / 2 - rightKneeY,
          (rightShoulderX + leftShoulderX) / 2 - rightKneeX
        )) *
      (180 / Math.PI)
    return temp - 180
  }
  // temp =
  //   (Math.atan2(leftKneeY - 0, leftKneeX - 0) -
  //     Math.atan2(
  //       (leftShoulderY + rightShoulderY) / 2 - leftKneeY,
  //       0 - leftKneeX
  //     )) *
  //   (180 / Math.PI);
  //   } else {
  //     temp =
  //       (Math.atan2(rightKneeY - 0, rightKneeX - 0) -
  //         Math.atan2(
  //           (rightShoulderY + leftShoulderY) / 2 - rightKneeY,
  //           0 - rightKneeX
  //         )) *
  //       (180 / Math.PI);
  //   }

  //return ((Math.atan2(leftKneeY - leftHipY, leftKneeX - leftHipX) - Math.atan2(leftShoulderY - leftKneeY, leftShoulderX - leftKneeX)) * (180 / Math.PI))
}

const getAnkleAngle = (side, direction) => {
  let temp
  if (side && direction) {
    temp =
      (Math.atan2(leftFootIndexY - leftHeelY, leftFootIndexX - leftHeelX) -
        Math.atan2(leftKneeY - leftAnkleY, leftKneeX - leftAnkleX)) *
      (180 / Math.PI)
    if (temp >= 0) return 90 - temp
    else return 90 + temp
  } else if (!side && direction) {
    temp =
      (Math.atan2(rightFootIndexY - rightHeelY, rightFootIndexX - rightHeelX) -
        Math.atan2(rightKneeY - rightAnkleY, rightKneeX - rightAnkleX)) *
      (180 / Math.PI)
    if (temp >= 0) return 90 - temp
    else return 90 + temp
  } else if (side && !direction) {
    temp =
      (Math.atan2(leftFootIndexY - leftHeelY, leftFootIndexX - leftHeelX) -
        Math.atan2(leftKneeY - leftAnkleY, leftKneeX - leftAnkleX)) *
      (180 / Math.PI)
    if (temp >= 0) return temp - 270
    else return temp + 90
  } else if (!side && !direction) {
    temp =
      (Math.atan2(rightFootIndexY - rightHeelY, rightFootIndexX - rightHeelX) -
        Math.atan2(rightKneeY - rightAnkleY, rightKneeX - rightAnkleX)) *
      (180 / Math.PI)
    if (temp >= 0) return temp - 270
    else return 90 + temp
  }

  //return (Math.atan2(leftFootIndexY - leftHeelY, leftFootIndexX - leftHeelX) - Math.atan2(leftKneeY - leftAnkleY, leftKneeX - leftAnkleX)) * (180 / Math.PI)
}

export { updateAngleHelper, getHipAngle, getKneeAngle, getAnkleAngle, getLeftDepth }
