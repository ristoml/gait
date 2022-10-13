import { useEffect, useState } from 'react';

// const imageMimeType = /image\/(png|jpg|jpeg)/i;

function Home() {
    const [file, setFile] = useState(null);
    const [fileDataURL, setFileDataURL] = useState(null); 
    const [videoSrc, setVideoSrc] = useState(null)       

    const handleGo = () => {
        setVideoSrc(fileDataURL)
    }

    const changeHandler = (e) => {
        const file = e.target.files[0];
        // if (!file.type.match(imageMimeType)) {
        //   alert("Image mime type is not valid");
        //   return;
        // }        
        setFile(file);
       
        const videoElement = document.getElementsByClassName('input_video')[0];
        
        async function onFrame() {
            if (!videoElement.paused && !videoElement.ended) {                
                console.log('frame')
                // await pose.send({
                //     image: videoElement
                //   });
                // https://stackoverflow.com/questions/65144038/how-to-use-requestanimationframe-with-promise    
                await new Promise(requestAnimationFrame);                
                onFrame();            }
            else
                setTimeout(onFrame, 500);
        }
                
        videoElement.onloadeddata = (evt) => {
            // let video = evt.target;
            // canvasElement.width = video.videoWidth;
            // canvasElement.height = video.videoHeight;
            // const aspect = video.videoHeight / video.videoWidth;
            // let width, height;
            // if (window.innerWidth > window.innerHeight) {
            //     height = window.innerHeight;
            //     width = height / aspect;
            // }
            // else {
            //     width = window.innerWidth;
            //     height = width * aspect;
            // }           
            videoElement.play();
            onFrame();
        };
    }


    useEffect(() => {

        let fileReader, isCancel = false;
        if (file) {
            fileReader = new FileReader();
            fileReader.onload = (e) => {
                const { result } = e.target;
                if (result && !isCancel) {
                    setFileDataURL(result)
                }
            }
            fileReader.readAsDataURL(file);
        }


        return () => {
            isCancel = true;
            if (fileReader && fileReader.readyState === 1) {
                fileReader.abort();
            }
        }

    }, [file]);

    return (
        <><video className="input_video" src={videoSrc} type='video/mp4' muted="muted"></video>
            <form>
                <p>
                    <label htmlFor='video'>Select video</label>
                    <input
                        type="file"
                        id='video'
                        accept='.mp4, .ogg'
                        onChange={changeHandler}
                    />
                </p>                
            </form>
            {fileDataURL ?                
                 <button type="submit" onClick={handleGo}>Go</button>
              : null}
        </>
    );
}
export default Home;