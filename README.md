# Simply Gait

<!-- ABOUT THE PROJECT -->
## About The Project

This application is made for web gait analysis using Mediapipe. This application calculates hip, knee and ankle angles and give result charts from side angle videos. 

Link for the app
[Simply Gait](https://s-gait.rahtiapp.fi/)


### Built With

* [React.js](https://reactjs.org/)
* [Math.js](https://mathjs.org/docs/index.html)
* [Recharts](https://recharts.org/en-US/)


### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/ristoml/gait.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```

<!-- USAGE EXAMPLES -->
## Usage

In frontend package use

   ```sh
   npm start
   ```


## Features

- Video support in .mp4, .webm, and .ogg format
- Automatic direction detection
- Automatic gait phase detection for: begin, stance and swing
- Automatic playback calibration based on calculation power
- Possibility to show every step or average
- Possibility to save results as .png
- Experimental 3D to 2D gait calculation

- Settings
  - playbackspeed
  - video start and end time
  - parameters of Mediapipe model complexity, detection confidence and tracking confidence
  - enable experimental 3D to 2D projision 

