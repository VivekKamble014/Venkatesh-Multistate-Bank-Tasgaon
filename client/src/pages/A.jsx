import React, { useRef, useState } from "react";

const Attendance = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [image, setImage] = useState(null);
  const [stream, setStream] = useState(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" }, // Front Camera
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);
      const imageData = canvasRef.current.toDataURL("image/png");
      setImage(imageData);
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  const handleSubmit = () => {
    console.log("Submitting Image:", image);
    // Here you can send the image to your server
    alert("Attendance marked successfully!");
  };

  return (
    <div className="flex flex-col items-center p-4">
      {!image ? (
        <>
          <button
            onClick={startCamera}
            className="bg-blue-500 text-white p-2 rounded mb-2"
          >
            Mark Attendance
          </button>
          <video ref={videoRef} autoPlay playsInline className="w-64 h-48" />
          <button
            onClick={capturePhoto}
            className="bg-green-500 text-white p-2 rounded mt-2"
          >
            Capture Photo
          </button>
        </>
      ) : (
        <>
          <img src={image} alt="Captured" className="w-64 h-48 border" />
          <button
            onClick={handleSubmit}
            className="bg-purple-500 text-white p-2 rounded mt-2"
          >
            Submit Attendance
          </button>
        </>
      )}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default Attendance;
