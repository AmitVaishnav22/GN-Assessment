import {loadData,saveData} from "../temp_db/temp_db.js"

const getPedingVideos = async (req, res) => {
    try {
        const videos = loadData("video.model.json");
        const pendingVideos = videos.filter(v => !v.approved);
        res.status(200).json(pendingVideos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



const approveVideo = async (req, res) => {
    try {
        const { id } = req.params;
        const videos = loadData("video.model.json");
        const video = videos.find(v => v.id == id);
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }
        video.approved = true;
        saveData("video.model.json", videos);
        res.status(200).json({ message: "Video approved successfully", videoData: video });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const getApprovedVideos = async (req, res) => {
    try {
        const videos = loadData("video.model.json");
        const approvedVideos = videos.filter(v => v.approved);
        res.status(200).json(approvedVideos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const rejectVideo=async (req,res)=>{
    try {
        const id = Number(req.params.id);
        const videos=loadData("video.model.json")
        const videoIndex = videos.findIndex(video => video.id === id);
        if (videoIndex==-1) {
            return res.status(404).json({ message: "Video not found" });
        }
        videos[videoIndex].approved = false;
        saveData("video.model.json",videos)
        res.status(200).json({message:"Video rejected successfully",videoData:videos[videoIndex]})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}


export {getPedingVideos,approveVideo,rejectVideo,getApprovedVideos}