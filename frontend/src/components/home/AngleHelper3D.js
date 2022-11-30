// let leftShoulderHipDot, leftHipKneeDot, leftKneeAnkleDot, leftAnkleFootDot
// let rightShoulderHipDot, rightHipKneeDot, rightKneeAnkleDot, rightAnkleFootDot

// let leftShoulderHipMag, leftHipKneeMag, leftKneeAnkleMag, leftAnkleFootMag
// let rightShoulderHipMag, rightHipKneeMag, rightKneeMag, rightAnkleFootMag
import * as mathjs from 'mathjs'

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
  leftShoulderZ,
  vLeftAnkle1,
  vLeftAnkle2,
  vLeftHip1,
  vLeftHip2,
  vLeftFoot1,
  vLeftFoot2,
  vLeftAnkle1_proj,
  vLeftAnkle2_proj,
  vLeftHip1_proj,
  vLeftHip2_proj,
  vLeftFoot1_proj,
  vLeftFoot2_proj

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
  rightShoulderZ,
  vRightAnkle1,
  vRightAnkle2,
  vRightHip1,
  vRightHip2,
  vRightFoot1,
  vRightFoot2,
  vRightAnkle1_proj,
  vRightAnkle2_proj,
  vRightHip1_proj,
  vRightHip2_proj,
  vRightFoot1_proj,
  vRightFoot2_proj

let n, v, e1, e2, A, vOrigo


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

  //normaali vektori
  // n = [rightHipX - leftHipX, rightHipY - leftHipY, rightHipZ - leftHipZ]
  n = [leftHipX - rightHipX, leftHipY - rightHipY, leftHipZ - rightHipZ]
  //apuvektori
  v = [1, 0, 0]

  e1 = mathjs.cross(v, n)

  //e1 / mathjs.norm(e1, 'fro')  
  e1 = mathjs.divide(e1, mathjs.norm(e1))


  e2 = mathjs.cross(e1, n)
  e2 = mathjs.divide(e2, mathjs.norm(e2))

  A = [e1, e2]

  vOrigo = [(rightHipX + leftHipX) / 2, (rightHipY + leftHipY) / 2, (rightHipZ + leftHipZ) / 2]

  vLeftAnkle1 = [leftAnkleX - leftKneeX, leftAnkleY - leftKneeY, leftAnkleZ - leftKneeZ]
  // vLeftAnkle2 = [rightHipX - leftKneeX, rightHipY - leftKneeY, rightHipZ - leftKneeZ]
  vLeftAnkle2 = [(rightHipX + leftHipX) / 2 - leftKneeX, (rightHipY + leftHipY) / 2 - leftKneeY, (rightHipZ + leftHipZ) / 2 - leftKneeZ]
  //vLeftAnkle2 = [leftHipX - leftKneeX, leftHipY - leftKneeY, leftHipZ - leftKneeZ]
  //vLeftAnkle2 = [leftKneeX, leftKneeY, leftKneeZ]

  vRightAnkle1 = [rightAnkleX - rightKneeX, rightAnkleY - rightKneeY, rightAnkleZ - rightKneeZ]
  vRightAnkle2 = [(rightHipX + leftHipX) / 2 - rightKneeX, (rightHipY + leftHipY) / 2 - rightKneeY, (rightHipZ + leftHipZ) / 2 - rightKneeZ]
  //vRightAnkle2 = [rightHipX - rightKneeX, rightHipY - rightKneeY, rightHipZ - rightKneeZ]
  //vRightAnkle2 = [rightKneeX, rightKneeY, rightKneeZ]

  vLeftHip1 = [(rightShoulderX + leftShoulderX) / 2 - leftHipX, (rightShoulderY + leftShoulderY) / 2 - leftHipY, (rightShoulderZ + leftShoulderZ) / 2 - leftHipZ]
  vLeftHip2 = [leftKneeX - leftHipX, leftKneeY - leftHipY, leftKneeZ - leftHipZ]

  vRightHip1 = [(rightShoulderX + leftShoulderX) / 2 - rightHipX, (rightShoulderY + leftShoulderY) / 2 - rightHipY, (rightShoulderZ + leftShoulderZ) / 2 - rightHipZ]
  vRightHip2 = [rightKneeX - rightHipX, rightKneeY - rightHipY, rightKneeZ - rightHipZ]

  vLeftFoot1 = [leftFootIndexX - leftHeelX, leftFootIndexY - leftHeelY, leftFootIndexZ - leftHeelZ]
  vLeftFoot2 = [leftKneeX - leftAnkleX, leftKneeY - leftAnkleY, leftKneeZ - leftAnkleZ]
  // (Math.atan2(vLeftFoot1_proj[0], vLeftFoot1_proj[1]) - Math.atan2(vLeftFoot2_proj[0], vLeftFoot2_proj[1])) * 180 / Math.PI + 90

  vRightFoot1 = [rightFootIndexX - rightHeelX, rightFootIndexY - rightHeelY, rightFootIndexZ - rightHeelZ]
  vRightFoot2 = [rightKneeX - rightAnkleX, rightKneeY - rightAnkleY, rightKneeZ - rightAnkleZ]

  vLeftAnkle1_proj = mathjs.multiply(A, vLeftAnkle1)
  vLeftAnkle2_proj = mathjs.multiply(A, vLeftAnkle2)

  vRightAnkle1_proj = mathjs.multiply(A, vRightAnkle1)
  vRightAnkle2_proj = mathjs.multiply(A, vRightAnkle2)

  vLeftHip1_proj = mathjs.multiply(A, vLeftHip1)
  vLeftHip2_proj = mathjs.multiply(A, vLeftHip2)

  vRightHip1_proj = mathjs.multiply(A, vRightHip1)
  vRightHip2_proj = mathjs.multiply(A, vRightHip2)

  vLeftFoot1_proj = mathjs.multiply(A, vLeftFoot1)
  vLeftFoot2_proj = mathjs.multiply(A, vLeftFoot2)

  vRightFoot1_proj = mathjs.multiply(A, vRightFoot1)
  vRightFoot2_proj = mathjs.multiply(A, vRightFoot2)
  // vLeftFoot1 = 

  // leftShoulderHipDot = leftShoulderZ*leftHipZ
  // leftHipKneeDot = leftHipZ*leftKneeZ

}
// const getLeftDepth = () => {
//   return (Math.acos(((leftHipX - leftKneeX) * (leftAnkleX - leftKneeX) + (leftHipY - leftKneeY) * (leftAnkleY - leftKneeY) + (leftHipZ - leftKneeZ) * (leftAnkleZ - leftKneeZ)) / (Math.sqrt(Math.pow((leftHipX - leftKneeX), 2)) + Math.pow((leftHipY - leftKneeY), 2) + Math.pow((leftHipZ - leftKneeZ), 2)) * Math.sqrt(Math.pow((leftAnkleX - leftKneeX), 2) + Math.pow((leftAnkleY - leftKneeY), 2) + Math.pow((leftAnkleZ - leftKneeZ), 2)))) * (180 / Math.PI)
// }
const getLeftZ = () => {
  return leftKneeZ
}

const getRightZ = () => {
  return rightKneeZ
}

const getKneeAngle = (side, direction) => {
  let temp
  if (side && direction) {

    return (Math.atan2(vLeftAnkle1_proj[1], vLeftAnkle1_proj[0]) - Math.atan2(vLeftAnkle2_proj[1], vLeftAnkle2_proj[0])) * 180 / Math.PI
  } else if (!side && direction) {

    return (Math.atan2(vRightAnkle1_proj[1], vRightAnkle1_proj[0]) - Math.atan2(vRightAnkle2_proj[1], vRightAnkle2_proj[0])) * 180 / Math.PI
  }
  else if (side && !direction) {

    return (Math.atan2(vLeftAnkle1_proj[1], vLeftAnkle1_proj[0]) - Math.atan2(vLeftAnkle2_proj[1], vLeftAnkle2_proj[0])) * 180 / Math.PI
  } else if (!side && !direction) {

    return (Math.atan2(vRightAnkle1_proj[1], vRightAnkle1_proj[0]) - Math.atan2(vRightAnkle2_proj[1], vRightAnkle2_proj[0])) * 180 / Math.PI
  }


}

const getHipAngle = (side, direction) => {
  let temp
  if (side && direction) {


    return (Math.atan2(vLeftHip1_proj[1], vLeftHip1_proj[0]) - Math.atan2(vLeftHip2_proj[1], vLeftHip2_proj[0])) * 180 / Math.PI

  } else if (!side && direction) {

    return (Math.atan2(vRightHip1_proj[1], vRightHip1_proj[0]) - Math.atan2(vRightHip2_proj[1], vRightHip2_proj[0])) * 180 / Math.PI
  }
  if (side && !direction) {

    return ((Math.atan2(vLeftHip1_proj[1], vLeftHip1_proj[0]) - Math.atan2(vLeftHip2_proj[1], vLeftHip2_proj[0])) * 180 / Math.PI) - 180
  } else if (!side && !direction) {

    return ((Math.atan2(vRightHip1_proj[1], vRightHip1_proj[0]) - Math.atan2(vRightHip2_proj[1], vRightHip2_proj[0])) * 180 / Math.PI) - 180
  }

}

const getAnkleAngle = (side, direction) => {
  let temp
  if (side && direction) {

    return (Math.atan2(vLeftFoot1_proj[1], vLeftFoot1_proj[0]) - Math.atan2(vLeftFoot2_proj[1], vLeftFoot2_proj[0])) * 180 / Math.PI
  } else if (!side && direction) {

    return (Math.atan2(vRightFoot1_proj[1], vRightFoot1_proj[0]) - Math.atan2(vRightFoot2_proj[1], vRightFoot2_proj[0])) * 180 / Math.PI
  } else if (side && !direction) {

    return ((Math.atan2(vLeftFoot1_proj[1], vLeftFoot1_proj[0]) - Math.atan2(vLeftFoot2_proj[1], vLeftFoot2_proj[0])) * 180 / Math.PI)
  } else if (!side && !direction) {

    return ((Math.atan2(vRightFoot1_proj[1], vRightFoot1_proj[0]) - Math.atan2(vRightFoot2_proj[1], vRightFoot2_proj[0])) * 180 / Math.PI)
  }

}

export { updateAngleHelper, getHipAngle, getKneeAngle, getAnkleAngle, getLeftZ, getRightZ }
