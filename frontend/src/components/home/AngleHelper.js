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
  leftShoulderY;

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
  rightShoulderX;

const updateAngleHelper = (results) => {
  leftHipX = results.poseWorldLandmarks[23].x;
  leftHipY = results.poseWorldLandmarks[23].y;
  leftKneeX = results.poseWorldLandmarks[25].x;
  leftKneeY = results.poseWorldLandmarks[25].y;
  leftAnkleX = results.poseWorldLandmarks[27].x;
  leftAnkleY = results.poseWorldLandmarks[27].y;
  leftHeelX = results.poseWorldLandmarks[29].x;
  leftHeelY = results.poseWorldLandmarks[29].y;
  leftFootIndexX = results.poseWorldLandmarks[31].x;
  leftFootIndexY = results.poseWorldLandmarks[31].y;
  leftShoulderX = results.poseWorldLandmarks[11].x;
  leftShoulderY = results.poseWorldLandmarks[11].y;

  rightHipX = results.poseWorldLandmarks[24].x;
  rightHipY = results.poseWorldLandmarks[24].y;
  rightKneeX = results.poseWorldLandmarks[26].x;
  rightKneeY = results.poseWorldLandmarks[26].y;
  rightAnkleX = results.poseWorldLandmarks[28].x;
  rightAnkleY = results.poseWorldLandmarks[28].y;
  rightHeelX = results.poseWorldLandmarks[30].x;
  rightHeelY = results.poseWorldLandmarks[30].y;
  rightFootIndexX = results.poseWorldLandmarks[32].x;
  rightFootIndexY = results.poseWorldLandmarks[32].y;
  rightShoulderX = results.poseWorldLandmarks[12].x;
  rightShoulderY = results.poseWorldLandmarks[12].y;
};

const getKneeAngle = (side) => {
  let temp;
  if (side) {
    temp =
      (Math.atan2(leftAnkleY - leftKneeY, leftAnkleX - leftKneeX) -
        Math.atan2(leftHipY - leftKneeY, leftHipX - leftKneeX)) *
      (180 / Math.PI);
  } else {
    temp =
      (Math.atan2(rightAnkleY - rightKneeY, rightAnkleX - rightKneeX) -
        Math.atan2(rightHipY - rightKneeY, rightHipX - rightKneeX)) *
      (180 / Math.PI);
  }

  if (temp >= 0) return temp - 180;
  else return temp + 180;
  //return (Math.atan2(leftAnkleY - leftKneeY, leftAnkleX - leftKneeX) - Math.atan2(leftHipY - leftKneeY, leftHipX - leftKneeX)) * (180 / Math.PI)
};

const getHipAngle = (side) => {
  let temp;
  if (side) {
    //     temp =
    //       (Math.atan2(leftKneeY - leftHipY, leftKneeX - leftHipX) -
    //         Math.atan2(leftShoulderY - leftKneeY, leftShoulderX - leftKneeX)) *
    //       (180 / Math.PI);
    //   } else {
    //     temp =
    //       (Math.atan2(rightKneeY - rightHipY, rightKneeX - rightHipX) -
    //         Math.atan2(rightShoulderY - rightKneeY, rightShoulderX - rightKneeX)) *
    //       (180 / Math.PI);
    //   }
    temp =
      (Math.atan2(leftKneeY - 0, leftKneeX - 0) -
        Math.atan2(
          (leftShoulderY + rightShoulderY) / 2 - leftKneeY,
          0 - leftKneeX
        )) *
      (180 / Math.PI);
  } else {
    temp =
      (Math.atan2(rightKneeY - 0, rightKneeX - 0) -
        Math.atan2(
          (rightShoulderY + leftShoulderY) / 2 - rightKneeY,
          0 - rightKneeX
        )) *
      (180 / Math.PI);
  }

  if (temp >= 0) return 180 - temp;
  else return 180 + temp;
  //return ((Math.atan2(leftKneeY - leftHipY, leftKneeX - leftHipX) - Math.atan2(leftShoulderY - leftKneeY, leftShoulderX - leftKneeX)) * (180 / Math.PI))
};

const getAnkleAngle = (side) => {
  let temp;
  if (side) {
    temp =
      (Math.atan2(leftFootIndexY - leftHeelY, leftFootIndexX - leftHeelX) -
        Math.atan2(leftKneeY - leftAnkleY, leftKneeX - leftAnkleX)) *
      (180 / Math.PI);
  } else {
    temp =
      (Math.atan2(rightFootIndexY - rightHeelY, rightFootIndexX - rightHeelX) -
        Math.atan2(rightKneeY - rightAnkleY, rightKneeX - rightAnkleX)) *
      (180 / Math.PI);
  }

  if (temp >= 0) return 90 - temp;
  else return 90 + temp;
  //return (Math.atan2(leftFootIndexY - leftHeelY, leftFootIndexX - leftHeelX) - Math.atan2(leftKneeY - leftAnkleY, leftKneeX - leftAnkleX)) * (180 / Math.PI)
};

export { updateAngleHelper, getHipAngle, getKneeAngle, getAnkleAngle };