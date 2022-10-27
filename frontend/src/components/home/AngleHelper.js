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

const getKneeAngle = (side) => {
    let temp
    if (side) {
        temp = (Math.atan2(leftAnkleY - leftKneeY, leftAnkleX - leftKneeX) - Math.atan2(leftHipY - leftKneeY, leftHipX - leftKneeX)) * (180 / Math.PI)
    } else {
        temp = (Math.atan2(rightAnkleY - rightKneeY, rightAnkleX - rightKneeX) - Math.atan2(rightHipY - rightKneeY, rightHipX - rightKneeX)) * (180 / Math.PI)
    }

    if (temp >= 0) return (temp - 180)
    else return (temp + 180)
    //return (Math.atan2(leftAnkleY - leftKneeY, leftAnkleX - leftKneeX) - Math.atan2(leftHipY - leftKneeY, leftHipX - leftKneeX)) * (180 / Math.PI)
}

const getHipAngle = (side) => {
    let temp
    if (side) {
        temp = ((Math.atan2(leftKneeY - leftHipY, leftKneeX - leftHipX) - Math.atan2(leftShoulderY - leftKneeY, leftShoulderX - leftKneeX)) * (180 / Math.PI))
    } else {
        temp = ((Math.atan2(rightKneeY - rightHipY, rightKneeX - rightHipX) - Math.atan2(rightShoulderY - rightKneeY, rightShoulderX - rightKneeX)) * (180 / Math.PI))
    }

    if (temp >= 0) return (temp - 180)
    else return (temp + 180)
    //return ((Math.atan2(leftKneeY - leftHipY, leftKneeX - leftHipX) - Math.atan2(leftShoulderY - leftKneeY, leftShoulderX - leftKneeX)) * (180 / Math.PI))
}


const getAnkleAngle = (side) => {
    let temp
    if (side) {
        temp = (Math.atan2(leftFootIndexY - leftHeelY, leftFootIndexX - leftHeelX) - Math.atan2(leftKneeY - leftAnkleY, leftKneeX - leftAnkleX)) * (180 / Math.PI)
    } else {
        temp = (Math.atan2(rightFootIndexY - rightHeelY, rightFootIndexX - rightHeelX) - Math.atan2(rightKneeY - rightAnkleY, rightKneeX - rightAnkleX)) * (180 / Math.PI)
    }

    if (temp >= 0) return (temp - 90)
    else return (temp + 90)
    //return (Math.atan2(leftFootIndexY - leftHeelY, leftFootIndexX - leftHeelX) - Math.atan2(leftKneeY - leftAnkleY, leftKneeX - leftAnkleX)) * (180 / Math.PI)
}

export { updateAngleHelper, getHipAngle, getKneeAngle, getAnkleAngle }