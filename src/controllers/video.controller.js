import {loadData,saveData} from "../temp_db/temp_db.js"
import { uploadOnCloudinary,deleteOnCloudinary } from "../utils/cloudinary.util.js"

const uploadVideo=async (req,res)=>{
    try {
        const {title,description,category, genre, version} = req.body
        const videoFile=req.files?.videoFile[0]?.path
        const thumbnailFile=req.files?.thumbnailFile[0]?.path

        if(!title || !description || !category || !genre || !version){
            return res.status(400).json({message:"Please provide all fields"})
        }
        if(!videoFile || !thumbnailFile){
            return res.status(400).json({message:"Please upload video and thumbnail"})
        }

        const videos=loadData("video.model.json")||[] 
        const videoExists=videos.find(video=>video.title===title)
        if(videoExists){
            return res.status(400).json({message:"Video already exists"})
        }

        const videoFilePath=await uploadOnCloudinary(videoFile)
        if(!videoFilePath){
            return res.status(500).json({message:"failed to upload video"})
        }
        const thumbnailPath=await uploadOnCloudinary(thumbnailFile)
        if(!thumbnailPath){
            return res.status(500).json({message:"failed to upload thumbnail"})
        }
        const newVideo={
            id:Date.now(),
            owner:req.user.id,
            title,
            description,
            videoFile:videoFilePath.url,
            thumbnailFile:thumbnailPath.url,
            category,
            genre,
            version,
            createdAt:new Date().toISOString(),
        }
        videos.push(newVideo)
        saveData("video.model.json",videos)
        res.status(201).json({message:"Video uploaded successfully",videoDetails:newVideo})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

const getAllVideos=async (req,res)=>{
    try {
        const videos=loadData("video.model.json")||[] 
        res.status(200).json({message:"Videos found",videos})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}
const deleteVideo = async (req, res) => {
    try {
      const videoId = Number(req.params.id);
      const videos = loadData("video.model.json") || [];
      const videoIndex = videos.findIndex(video => video.id === videoId);
  
      if (videoIndex === -1) {
        return res.status(404).json({ message: "Video not found" });
      }
  
      const video = videos[videoIndex];
  
      if (req.user.id !== video.owner) {
        return res.status(403).json({ message: "You are not allowed to delete this video" });
      }
  
      const videoDeleteResponse = await deleteOnCloudinary(video.videoFile);
      const thumbDeleteResponse = await deleteOnCloudinary(video.thumbnailFile);
  
      if (!videoDeleteResponse?.result === "ok") {
        return res.status(500).json({ message: "Failed to delete video file from Cloudinary" });
      }
      if (!thumbDeleteResponse?.result === "ok") {
        return res.status(500).json({ message: "Failed to delete thumbnail file from Cloudinary" });
      }
  
      // Remove from local JSON DB
      videos.splice(videoIndex, 1);
      saveData("video.model.json", videos);
  
      return res.status(200).json({ message: "Video deleted successfully" });
  
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };


  const updateVideo = async (req, res) => {
    try {
      const videoId = Number(req.params.id);
      const { title, description, category, genre, version } = req.body;
  
      const videos = loadData("video.model.json") || [];
      const videoIndex = videos.findIndex(video => video.id === videoId);
  
      if (videoIndex === -1) {
        return res.status(404).json({ message: "Video not found" });
      }
  
      const video = videos[videoIndex];
  
      if (req.user.id !== video.owner) {
        return res.status(403).json({ message: "You are not allowed to update this video" });
      }
      
      if (title) video.title = title;
      if (description) video.description = description;
      if (category) video.category = category;
      if (genre) video.genre = genre;
      if (version) video.version = version;
  
      // Save changes
      saveData("video.model.json", videos);
  
      return res.status(200).json({
        message: "Video updated successfully",
        updatedVideo: video
      });
  
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };
export {uploadVideo,getAllVideos,deleteVideo,updateVideo}