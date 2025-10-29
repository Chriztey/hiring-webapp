"use client";

import { useState, useRef, useEffect, useCallback } from 'react'; // Import useCallback
import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import styles from './HandGestureCamera.module.css';
import { supabase } from '@/services/supabase'

// --- Constants ---
const PROCESS_INTERVAL = 3000;
const SEQUENCE_TIMEOUT = 9000;
const STATUS_MAP = {
  0: "Fist",
  1: "Index Finger",
  2: "Peace Sign",
  3: "3 Fingers",
  4: "4 Fingers",
  5: "Open Hand",
};




export default function HandGestureCamera({ onPhotoTaken }) {
  // --- React State (same as before) ---
  const [webcamRunning, setWebcamRunning] = useState(false);
  const [gestureDetectionEnabled, setGestureDetectionEnabled] = useState(false);
  const [currentState, setCurrentState] = useState("WAITING_FOR_1");
  const [fingerCountDisplay, setFingerCountDisplay] = useState("Fingers: -");
  const [gestureStatusDisplay, setGestureStatusDisplay] = useState("Status: Waiting...");
  const [showPhoto, setShowPhoto] = useState(false);
  const [logHistory, setLogHistory] = useState([]);
  const [lastFingerCount, setLastFingerCount] = useState(-1);
  const [videoTip, setVideoTip] = useState("");
  

  // --- React Refs (same as before) ---
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const countdownOverlayRef = useRef(null);
  const countdownNumberRef = useRef(null);
  const photoCanvasRef = useRef(null);
  const liveLogRef = useRef(null);
  const handLandmarkerRef = useRef(null);
  const lastVideoTimeRef = useRef(-1);
  const animationFrameRef = useRef(null); // This ref will hold the animation frame ID
  const lastProcessTimeRef = useRef(0);
  const lastGestureTimeRef = useRef(0);

  // --- 1. MediaPipe Setup (same as before) ---
  useEffect(() => {
    const createHandLandmarker = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.10/wasm"
        );
        const handLandmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          numHands: 2
        });
        handLandmarkerRef.current = handLandmarker;
        console.log("HandLandmarker created");
      } catch (error) {
        console.error("Error creating HandLandmarker:", error);
      }
    };
    createHandLandmarker();
  }, []);

  // --- 2. Helper Functions (Wrapped in useCallback) ---

  const addLogEntry = useCallback((entry) => {
    setLogHistory(prevHistory => [entry, ...prevHistory.slice(0, 19)]);
  }, []); // Empty dependency array means this function never changes

  const logStateEvent = useCallback((type, message) => {
    const timestamp = new Date().toLocaleTimeString();
    let emoji = "";
    switch (type) {
      case "progress": emoji = "⏱️"; break;
      case "success": emoji = "📸"; break;
      case "error": emoji = "❌"; break;
      case "timeout": emoji = "⏰"; break;
      case "reset": emoji = "🔄"; break;
      default: emoji = "ℹ️"; break;
    }
    addLogEntry(`[${timestamp}] ${emoji} ${message}`);
  }, [addLogEntry]);

  const resetStateMachine = useCallback(() => {
    setCurrentState("WAITING_FOR_1");
    lastGestureTimeRef.current = 0;
    setShowPhoto(false);
    setVideoTip("Show your index finger (Pose 1)");
  }, []);

  const updateLiveLog = useCallback((fingerCount, handsDetected) => {
    const statusMap = {
      0: "Fist detected", 1: "One finger", 2: "Two fingers",
      3: "Three fingers", 4: "Four fingers", 5: "Five fingers",
    };
    let status = statusMap[fingerCount] || `${fingerCount} fingers`;
    if (!handsDetected) status = "No hands detected";

    setFingerCountDisplay(`Fingers: ${fingerCount}`);
    setGestureStatusDisplay(`Status: ${status} | State: ${currentState.replace('WAITING_FOR_', '')}`);

    if (fingerCount !== lastFingerCount) {
      const timestamp = new Date().toLocaleTimeString();
      addLogEntry(`[${timestamp}] 👋 ${status}`);
    }
  }, [currentState, lastFingerCount, addLogEntry]); // Depends on state

  const startVisualCountdown = useCallback(() => {
    return new Promise((resolve) => {
      if (!countdownOverlayRef.current || !countdownNumberRef.current) return resolve();
      const overlay = countdownOverlayRef.current;
      const numberEl = countdownNumberRef.current;
      overlay.style.display = "flex";
      let count = 3;
      
      function showNumber() {
        numberEl.textContent = count;
        numberEl.style.animation = "none";
        numberEl.offsetHeight; // Reflow
        numberEl.style.animation = "countdownPulse 1s ease-in-out";
        
        if (count > 1) {
          count--;
          setTimeout(showNumber, 1000);
        } else {
          setTimeout(() => {
            overlay.style.display = "none";
            resolve();
          }, 1000);
        }
      }
      showNumber();
    });
  }, []);

  // const captureAndSavePhoto = useCallback(() => {
  //   if (!videoRef.current || !photoCanvasRef.current) return;
  //   const video = videoRef.current;
  //   const canvas = photoCanvasRef.current;
  //   const ctx = canvas.getContext("2d");
  //   canvas.width = video.videoWidth;
  //   canvas.height = video.videoHeight;
  //   ctx.save();
  //   ctx.scale(-1, 1);
  //   ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
  //   ctx.restore();
    
  //   canvas.toBlob((blob) => {
  //     const reader = new FileReader();
  //     reader.onload = function() {
  //       const base64data = reader.result;
  //       const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  //       const filename = `hand-gesture-photo-${timestamp}`;
  //       try {
  //         localStorage.setItem(filename, base64data);
  //         logStateEvent("success", `Photo saved to local storage as ${filename}`);
  //       } catch (e) {
  //         logStateEvent("error", "Failed to save photo.");
  //       }
  //     };
  //     reader.readAsDataURL(blob);
  //   }, 'image/jpeg', 0.9);
  //   setShowPhoto(true);
  // }, [logStateEvent]);

//   const captureAndSavePhoto = useCallback(() => {
//   if (!videoRef.current || !photoCanvasRef.current) return;
//   const video = videoRef.current;
//   const canvas = photoCanvasRef.current;
//   const ctx = canvas.getContext("2d");
//   canvas.width = video.videoWidth;
//   canvas.height = video.videoHeight;
//   ctx.save();
//   ctx.scale(-1, 1);
//   ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
//   ctx.restore();

//   canvas.toBlob(async (blob) => {
//     if (!blob) return;

//     const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
//     const filename = `hand-gesture-${timestamp}.jpeg`;

//     try {
//       // 1️⃣ Upload to Supabase Storage
//       const { data, error: uploadError } = await supabase.storage
//         .from("profile-photos") // your bucket name
//         .upload(filename, blob, { contentType: "image/jpeg" });

//       if (uploadError) throw uploadError;

//       // 2️⃣ Get public URL
//       const { data: publicData } = supabase.storage
//         .from("profile-photos")
//         .getPublicUrl(filename);

//       const photoUrl = publicData.publicUrl;

//       // 3️⃣ Save record to your table
//       const { error: dbError } = await supabase
//         .from("your_table_name") // e.g., "candidates"
//         .insert({
//           fullName: "Test User", // replace with actual form data
//           email: "test@example.com",
//           photoProfile: photoUrl, // new column
//         });

//       if (dbError) throw dbError;

//       logStateEvent("success", `Photo uploaded and DB record created!`);
//     } catch (err) {
//       console.error(err);
//       logStateEvent("error", "Failed to upload photo to Supabase.");
//     }
//   }, "image/jpeg", 0.9);

//   setShowPhoto(true);
// }, [logStateEvent]);

  const captureAndSavePhoto = useCallback(() => {
  if (!videoRef.current || !photoCanvasRef.current) return;

  const video = videoRef.current;
  const canvas = photoCanvasRef.current;
  const ctx = canvas.getContext("2d");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.save();
  ctx.scale(-1, 1); // mirror horizontally if needed
  ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
  ctx.restore();

  canvas.toBlob((blob) => {
    if (!blob) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result; // this is your base64 string

      // ✅ send back to ResumeForm
      if (onPhotoTaken && typeof base64data === "string") {
        onPhotoTaken(base64data);
      }
    };
    reader.readAsDataURL(blob);
  }, "image/jpeg", 0.9);

  setShowPhoto(true);
}, [onPhotoTaken]);


  const countFingers = useCallback((handLandmarks) => {
    if (!handLandmarks || handLandmarks.length === 0) return 0;
    let fingerCount = 0;
    const isRightHand = handLandmarks[5].x < handLandmarks[17].x;
    if (isRightHand) {
      if (handLandmarks[4].x < handLandmarks[3].x) fingerCount++;
    } else {
      if (handLandmarks[4].x > handLandmarks[3].x) fingerCount++;
    }
    if (handLandmarks[8].y < handLandmarks[6].y) fingerCount++;
    if (handLandmarks[12].y < handLandmarks[10].y) fingerCount++;
    if (handLandmarks[16].y < handLandmarks[14].y) fingerCount++;
    if (handLandmarks[20].y < handLandmarks[18].y) fingerCount++;
    return fingerCount;
  }, []);

  const processGestureStateMachine = useCallback((fingerCount) => {
    const currentTime = Date.now();
    
    if (currentState !== "WAITING_FOR_1" && currentTime - lastGestureTimeRef.current > SEQUENCE_TIMEOUT) {
      logStateEvent("timeout", `Sequence timed out`);
      resetStateMachine();
      return;
    }
    
    switch (currentState) {
      case "WAITING_FOR_1":
        if (fingerCount === 1) {
          // captureAndSavePhoto();
          logStateEvent("progress", "Got 1. Waiting for 2...");
          setCurrentState("WAITING_FOR_2");
          setVideoTip("Show a peace sign (Pose 2)");
          lastGestureTimeRef.current = currentTime;
        }
        break;
      case "WAITING_FOR_2":
        if (fingerCount === 2) {
          logStateEvent("progress", "Got 2. Waiting for 3...");
          setCurrentState("WAITING_FOR_3");
          setVideoTip("Show 3 fingers (Pose 3)");
          lastGestureTimeRef.current = currentTime;
        } else if (fingerCount !== 0 && fingerCount !== 1) {
          logStateEvent("error", `Wrong gesture (${fingerCount}). Resetting.`);
          resetStateMachine();
        }
        break;
      case "WAITING_FOR_3":
        if (fingerCount === 3) {
          logStateEvent("success", "Got 3! Starting countdown...");
          setVideoTip("Great! Hold still...");
          startVisualCountdown().then(() => {
            captureAndSavePhoto();
            resetStateMachine();
          });
        } else if (fingerCount !== 0 && fingerCount !== 2) {
          logStateEvent("error", `Wrong gesture (${fingerCount}). Resetting.`);
          resetStateMachine();
        }
        break;
      default:
        break;
    }
  }, [currentState, resetStateMachine, logStateEvent, startVisualCountdown, captureAndSavePhoto]);

  // --- 3. The Prediction Function (no loop inside) ---
  // This function just processes a single frame.
  const predictWebcam = useCallback(() => {
    if (!handLandmarkerRef.current || !videoRef.current || !canvasRef.current) {
      return;
    }
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext("2d");

    if (video.videoWidth === 0 || video.videoHeight === 0) {
      return;
    }
    
    if (canvas.width !== video.videoWidth) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }
    
    const startTimeMs = performance.now();
    let results;
    if (video.currentTime !== lastVideoTimeRef.current) {
      lastVideoTimeRef.current = video.currentTime;
      results = handLandmarkerRef.current.detectForVideo(video, startTimeMs);
    } else {
      results = { landmarks: [] };
    }

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (results.landmarks && results.landmarks.length > 0) {
for (const landmarks of results.landmarks) {
        
        // 1. Calculate Bounding Box
        let minX = 1.0, minY = 1.0, maxX = 0.0, maxY = 0.0;
        for (const point of landmarks) {
          minX = Math.min(minX, point.x);
          minY = Math.min(minY, point.y);
          maxX = Math.max(maxX, point.x);
          maxY = Math.max(maxY, point.y);
        }
        
        // 2. Un-normalize coordinates and add padding
        const padding = 20;
        const bboxX = (minX * canvas.width) - padding;
        const bboxY = (minY * canvas.height) - padding;
        const bboxWidth = ((maxX - minX) * canvas.width) + (padding * 2);
        const bboxHeight = ((maxY - minY) * canvas.height) + (padding * 2);

        // 3. Get Gesture Name
        const fingerCount = countFingers(landmarks);
        const gestureName = STATUS_MAP[fingerCount] || `${fingerCount} fingers`;

        // 4. Draw Bounding Box
        canvasCtx.strokeStyle = "#00FF00"; // Green box
        canvasCtx.lineWidth = 4;
        canvasCtx.strokeRect(bboxX, bboxY, bboxWidth, bboxHeight);
        
        // 5. Draw Text Background
        canvasCtx.fillStyle = "#00FF00";
        const textWidth = canvasCtx.measureText(gestureName).width;
        canvasCtx.fillRect(bboxX, bboxY - 24, textWidth + 48, 24); 

        // 6. Draw Text
        canvasCtx.fillStyle = "#000000"; // Black text
        canvasCtx.font = "18px sans-serif";
        canvasCtx.fillText(gestureName, bboxX + 5, bboxY - 6); // Text on top
      }
      
      if (gestureDetectionEnabled) {
        const currentTime = Date.now();
        if (currentTime - lastProcessTimeRef.current >= PROCESS_INTERVAL) {
          lastProcessTimeRef.current = currentTime;
          const fingerCount = countFingers(results.landmarks[0]);
          processGestureStateMachine(fingerCount);
          updateLiveLog(fingerCount, true);
          setLastFingerCount(fingerCount);
        }
      }
    } else if (gestureDetectionEnabled) {
      // Handle no hands detected
      const currentTime = Date.now();
      if (currentTime - lastProcessTimeRef.current >= PROCESS_INTERVAL) {
        lastProcessTimeRef.current = currentTime;
        processGestureStateMachine(0);
        updateLiveLog(0, false);
        setLastFingerCount(0);
      }
    }
    canvasCtx.restore();

  }, [gestureDetectionEnabled, processGestureStateMachine, updateLiveLog, countFingers]); // Re-create if these functions change


  // --- 4. NEW: useEffect for the Animation Loop ---
  // This effect starts/stops the loop based on `webcamRunning`
  useEffect(() => {
    
    // This is the function that will be called every frame
    const loop = () => {
      if (webcamRunning) {
        predictWebcam(); // Call the single-frame processing function
        animationFrameRef.current = requestAnimationFrame(loop); // Continue the loop
      }
    };

    if (webcamRunning) {
      // Start the loop
      animationFrameRef.current = requestAnimationFrame(loop);
    } else {
      // Stop the loop
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      // Also stop the video stream
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    }

    // Cleanup function: This runs when the component unmounts
    // or when `webcamRunning` changes (before the effect runs again).
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [webcamRunning, predictWebcam]); // This effect re-runs if webcamRunning or predictWebcam changes


  // --- 5. MODIFIED: Enable/Disable Camera ---
  const enableCam = () => {
    if (!handLandmarkerRef.current) {
      console.log("Wait! HandLandmarker not loaded yet.");
      return;
    }

    if (webcamRunning) {
      setWebcamRunning(false); // This will trigger the useEffect to stop the loop
      setGestureDetectionEnabled(false);
      setVideoTip("");
    } else {
      setGestureDetectionEnabled(true);
      resetStateMachine(); // Reset state
      
      const constraints = { video: true };
      navigator.mediaDevices.getUserMedia(constraints)
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            // We just set the state here. The useEffect will handle the rest.
            setWebcamRunning(true);
          }
        })
        .catch((err) => {
          console.error("Error accessing webcam:", err);
          alert("Could not access webcam. Please check permissions.");
        });
    }
  };
  
  // --- 6. Photo Controls (Wrapped in useCallback) ---
  const downloadPhoto = useCallback(() => {
    if (!photoCanvasRef.current) return;
    const link = document.createElement("a");
    link.download = `hand-gesture-photo-${Date.now()}.png`;
    link.href = photoCanvasRef.current.toDataURL();
    link.click();
  }, []);

  const retakePhoto = useCallback(() => {
    setShowPhoto(false);
    resetStateMachine();
    logStateEvent("reset", "Ready for new photo sequence");
  }, [resetStateMachine, logStateEvent]);

  // --- 7. JSX (Render) ---
  // (This is the same as your provided code, just uses the functions defined above)
  return (
    <section>

      <div className={styles.videoView}>
        <button id="webcamButton" className={styles.webcamButton} onClick={enableCam}>
          {webcamRunning ? "DISABLE WEBCAM" : "ENABLE WEBCAM"}
        </button>

        <div className={styles.videoContainer}>
          <video 
            id="webcam" 
            ref={videoRef} 
            className={styles.webcamVideo}
            autoPlay
            playsInline
          ></video>
          <canvas 
            className={styles.output_canvas}
            ref={canvasRef}
          ></canvas>

          {/* === ADD THIS ELEMENT === */}
          {webcamRunning && (
            <div className={styles.gestureTip}>
              {videoTip}
            </div>
          )}
          {/* ======================= */}

          <div className={styles.countdownOverlay} ref={countdownOverlayRef}>
            <div className={styles.countdownNumber} ref={countdownNumberRef}>3</div>
          </div>
        </div>
        
        <div style={{ display: showPhoto ? 'block' : 'none', marginTop: '20px', textAlign: 'center' }}>
          <canvas ref={photoCanvasRef} className={styles.photoCanvas}></canvas>
          {/* <div style={{ marginTop: '10px' }}>
            <button onClick={downloadPhoto} className={styles.actionButton}>
              Download Photo
            </button>
            <button onClick={retakePhoto} className={styles.actionButton}>
              Take Another
            </button>
          </div> */}
        </div>
      </div>
    </section>
  );
}