const Conversation = require("../models/Conversation");
const Listing = require("../models/Listing");

// @POST /api/conversations
// Start or get existing conversation about a listing
const startConversation = async (req, res) => {
  const { listingId } = req.body;

  const listing = await Listing.findById(listingId);
  if (!listing) return res.status(404).json({ message: "Listing not found" });

  const ownerId = listing.owner.toString();
  const userId = req.user._id.toString();

  if (ownerId === userId)
    return res.status(400).json({ message: "You can't message yourself" });

  // Check if conversation already exists between these two for this listing
  let convo = await Conversation.findOne({
    listing: listingId,
    participants: { $all: [req.user._id, listing.owner] },
  })
    .populate("listing", "title images rent location type")
    .populate("participants", "name avatar phone")
    .populate("messages.sender", "name avatar");

  if (!convo) {
    convo = await Conversation.create({
      listing: listingId,
      participants: [req.user._id, listing.owner],
      messages: [],
    });
    convo = await Conversation.findById(convo._id)
      .populate("listing", "title images rent location type")
      .populate("participants", "name avatar phone")
      .populate("messages.sender", "name avatar");
  }

  res.json(convo);
};

// @GET /api/conversations
// Get all conversations for the logged-in user
const getMyConversations = async (req, res) => {
  const convos = await Conversation.find({
    participants: req.user._id,
  })
    .populate("listing", "title images rent location type status")
    .populate("participants", "name avatar phone")
    .populate("messages.sender", "name avatar")
    .sort("-lastMessage");

  res.json(convos);
};

// @GET /api/conversations/:id
// Get a single conversation
const getConversation = async (req, res) => {
  const convo = await Conversation.findById(req.params.id)
    .populate("listing", "title images rent location type status")
    .populate("participants", "name avatar phone")
    .populate("messages.sender", "name avatar");

  if (!convo)
    return res.status(404).json({ message: "Conversation not found" });

  const isParticipant = convo.participants.some(
    (p) => p._id.toString() === req.user._id.toString(),
  );
  if (!isParticipant)
    return res.status(403).json({ message: "Not authorized" });

  // Mark all messages from the other person as read
  let changed = false;
  convo.messages.forEach((m) => {
    if (m.sender._id.toString() !== req.user._id.toString() && !m.read) {
      m.read = true;
      changed = true;
    }
  });
  if (changed) await convo.save();

  res.json(convo);
};

// @POST /api/conversations/:id/messages
// Send a message inside a conversation
const sendMessage = async (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim())
    return res.status(400).json({ message: "Message cannot be empty" });

  const convo = await Conversation.findById(req.params.id);
  if (!convo)
    return res.status(404).json({ message: "Conversation not found" });

  const isParticipant = convo.participants.some(
    (p) => p.toString() === req.user._id.toString(),
  );
  if (!isParticipant)
    return res.status(403).json({ message: "Not authorized" });

  convo.messages.push({ sender: req.user._id, text: text.trim() });
  convo.lastMessage = new Date();
  await convo.save();

  // Return fully populated convo
  const updated = await Conversation.findById(convo._id)
    .populate("listing", "title images rent location type status")
    .populate("participants", "name avatar phone")
    .populate("messages.sender", "name avatar");

  res.json(updated);
};

// @GET /api/conversations/unread-count
// How many conversations have unread messages for the logged-in user
const getUnreadCount = async (req, res) => {
  const convos = await Conversation.find({ participants: req.user._id });
  let count = 0;
  convos.forEach((c) => {
    c.messages.forEach((m) => {
      if (m.sender.toString() !== req.user._id.toString() && !m.read) count++;
    });
  });
  res.json({ count });
};

module.exports = {
  startConversation,
  getMyConversations,
  getConversation,
  sendMessage,
  getUnreadCount,
};
