const express = require("express");
const router = express.Router();
const { jwtAuthMiddleware } = require("./../jwt");
const Candidate = require("../models/candidate");
const User = require("../models/user");

const checkAdminRole = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return false; // user not found
    return user.role === "admin";
  } catch (err) {
    return false;
  }
};

// POST method to add data in database...
router.post("/", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id))) {
      return res.status(403).json({ message: "user does not have admin role" });
    }

    const newCandidate = new Candidate(req.body);
    const response = await newCandidate.save();

    console.log("data saved");
    res.status(201).json({ response });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "internal server error" });
  }
});

router.put("/:candidateId", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!checkAdminRole(req.user.id))
      return res.status(403).json({ message: "user does not have admin role" });

    const candidateId = req.params.candidateId;
    const updatedCandidateData = req.body;
    const response = await Candidate.findByIdAndUpdate(
      candidateId,
      updatedCandidateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!response) {
      return res.status(403).json({ error: "Candidate not found" });
    }

    console.log("candidate data updated");
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "internal server error" });
  }
});
router.delete("/:candidateId", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!checkAdminRole(req.user.id))
      return res.status(403).json({ message: "user does not have admin role" });

    const candidateId = req.params.candidateId;

    const response = await Candidate.findByIdAndDelete(candidateId);

    if (!response) {
      return res.status(403).json({ error: "Candidate not found" });
    }

    console.log("candidate deleted");
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "internal server error" });
  }
});

router.post("/vote/:candidateId", jwtAuthMiddleware, async (req, res) => {
  candidateId = req.params.candidateId;
  userId = req.user.id;

  try {
    const candidate = await Candidate.findById(candidateId);

    if (!candidate)
      return res.status(404).json({ message: "Candidate not found" });

    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "user not found" });

    if (user.isVoted) {
      return res.status(400).json({ message: "you have already voted" });
    }

    if (user.role === "admin")
      res.status(403).json({ message: "admin is not allowed" });

    candidate.votes.push({ user: userId });
    candidate.voteCount++;
    await candidate.save();

    user.isVoted = true;
    await user.save();

    res.status(200).json({ message: "Vote recorded succesfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "internal server error" });
  }
});

router.get("/vote/count", async (req, res) => {
  try {
    const candidate = await Candidate.find().sort({ voteCount: "descending" });

    const voteRecord = candidate.map((data) => {
      return {
        party: data.party,
        count: data.voteCount,
      };
    });
    return res.status(200).json(voteRecord);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "internal server error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const candidates = await Candidate.find({}, "name party -_id");

    res.status(200).json(candidates);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
