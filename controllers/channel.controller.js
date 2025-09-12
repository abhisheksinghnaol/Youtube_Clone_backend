import ChannelModel from "../model/Channel.model.js";
import UserModel from "../model/User.model.js";



export async function createChannel(req,res){
    try{
        const {channelName,description,channelBanner}=req.body;
        console.log(req.user);
        
        const channel = await ChannelModel.create({
  channelName,
  description,
  channelBanner,
  owner: req.user._id   
});

        return res.status(201).json({message:"Channel created",channel})

    }
    catch(err){
        console.log("error:",err)
        res.status(500).json({error:err})
    }

}


export async function getChannel(req, res) {
  try {
    const { id } = req.params;

    // find channel by id and populate owner and subscribers (optional limited fields)
    const channel = await ChannelModel.findById(id)
      .populate("owner", "username avatar")
      .populate("subscribedBy", "username avatar")
      .lean();

    if (!channel) return res.status(404).json({ message: "Channel not found" });

    // fetch videos for this channel (you can also use channel.videos if stored)
    const videos = await VideoModel.find({ channel: channel._id })
      .select("title thumbnailUrl views likes dislikes uploadDate")
      .lean();

    return res.status(200).json({ channel, videos });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
}

//subscribe api

export async function subscribe(req,res){
  try{
    
    const userId=req.user._id
   const channel = await ChannelModel.findById(req.params.channelId);

    const user=await UserModel.findById(userId)
    if(channel.subscribedBy.includes(userId)){
      return res.status(400).json({message:"already subscribed"})
    }
    channel.subscribers+=1;
    channel.subscribedBy.push(userId)
    await channel.save()

    user.subscribedChannels.push(req.params.channelId._id)
    await user.save()
    return res.status(200).json({ message: "Subscribed", subscribers: channel.subscribers })
  }
    catch(err){
      console.error(err);
      return res.status(500).json({ message: err.message });
    }
  
}

export async function unsubscribe(req, res) {
  try {
    const channelId = req.params.id;
    const userId = req.user._id;

    const [channel, user] = await Promise.all([
      ChannelModel.findById(channelId),
      UserModel.findById(userId)
    ]);

    if (!channel) return res.status(404).json({ message: "Channel not found" });
    if (!user) return res.status(404).json({ message: "User not found" });

    // check subscribed
    const isSubscribed = channel.subscribedBy.some(id => id.toString() === userId.toString());
    if (!isSubscribed) return res.status(400).json({ message: "Not subscribed" });

    // remove subscription
    channel.subscribedBy = channel.subscribedBy.filter(id => id.toString() !== userId.toString());
    channel.subscribers = Math.max(0, (channel.subscribers || 0) - 1);

    user.subscribedChannels = (user.subscribedChannels || []).filter(
      id => id.toString() !== channel._id.toString()
    );

    await Promise.all([channel.save(), user.save()]);

    return res.status(200).json({ message: "Unsubscribed", subscribers: channel.subscribers });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
}