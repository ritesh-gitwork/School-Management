import Class from "../models/class.model.js";
import JoinRequest from "../models/joinRequest.model.js";

export const requestToJoin = async (req, res) => {
  try {
    const { classId } = req.body;

    const request = await JoinRequest.create({
      classId,
      studentId: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: request,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: "Request already sent",
    });
  }
};

export const getClassRequests = async (req, res) => {
  const { classId } = req.params;

  const requests = await JoinRequest.find({
    classId,
    status: "pending",
  }).populate("studentId", "name email");

  res.json({
    success: true,
    data: requests,
  });
};



export const handleRequest = async (req, res) => {
  const { requestId, action } = req.body;

  const request = await JoinRequest.findById(requestId);

  if (!request) {
    return res.status(404).json({ error: "Request not found" });
  }

  if (action === "accept") {
    request.status = "accepted";

    await Class.findByIdAndUpdate(request.classId, {
      $addToSet: { studentsIds: request.studentId },
    });
  }

  if (action === "reject") {
    request.status = "rejected";
  }

  await request.save();

  res.json({ success: true });
};


export const getMyRequests = async (req, res) => {
  try {
    const studentId = req.user.id;

    const requests = await JoinRequest.find({
      studentId,
    })
      .populate("classId", "className")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error) {
    console.error("Get my requests error:", error);

    res.status(500).json({
      success: false,
      error: "Failed to fetch join requests",
    });
  }
};
