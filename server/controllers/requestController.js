const RentRequest = require("../models/RentRequest");
const Listing = require("../models/Listing");

// @POST /api/requests
const createRequest = async (req, res) => {
  const { listingId, message, moveInDate } = req.body;
  const listing = await Listing.findById(listingId);
  if (!listing) return res.status(404).json({ message: "Listing not found" });
  if (listing.owner.toString() === req.user._id.toString())
    return res
      .status(400)
      .json({ message: "You can't request your own listing" });

  const existing = await RentRequest.findOne({
    listing: listingId,
    requester: req.user._id,
  });
  if (existing)
    return res.status(400).json({ message: "Request already sent" });

  const request = await RentRequest.create({
    listing: listingId,
    requester: req.user._id,
    owner: listing.owner,
    message,
    moveInDate,
  });

  await request.populate(["listing", "requester", "owner"]);
  res.status(201).json(request);
};

// @GET /api/requests/my (requests I sent)
const getMyRequests = async (req, res) => {
  const requests = await RentRequest.find({ requester: req.user._id })
    .populate("listing", "title images rent location type")
    .populate("owner", "name phone")
    .sort("-createdAt");
  res.json(requests);
};

// @GET /api/requests/received (requests for my listings)
const getReceivedRequests = async (req, res) => {
  const requests = await RentRequest.find({ owner: req.user._id })
    .populate("listing", "title images rent location type")
    .populate("requester", "name phone email avatar")
    .sort("-createdAt");
  res.json(requests);
};

// @PUT /api/requests/:id
const updateRequest = async (req, res) => {
  const request = await RentRequest.findById(req.params.id);
  if (!request) return res.status(404).json({ message: "Request not found" });

  if (
    request.owner.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  )
    return res.status(403).json({ message: "Not authorized" });

  request.status = req.body.status;
  await request.save();

  if (req.body.status === "approved") {
    await Listing.findByIdAndUpdate(request.listing, { status: "rented" });
  }

  res.json(request);
};

module.exports = {
  createRequest,
  getMyRequests,
  getReceivedRequests,
  updateRequest,
};
