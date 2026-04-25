import Jobs from "../models/Job.js";

export const getAllJobs = async (req, res) => {
  try {
    const job = await Jobs.find({ userId: req.user._id });

    res.status(200).json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const addJob = async (req, res) => {
  try {
    const { company, role, status, source, jobUrl, notes } = req.body;

    if (!company || !role || !status || !source || !jobUrl) {
      return res
        .status(400)
        .json({ success: false, message: "ALL DETAILS ARE REQUIRED" });
    }

    const job = await Jobs.create({
      userId: req.user._id,
      company,
      role,
      status,
      source,
      jobUrl,
      notes,
    });

    res.status(200).json({ success: true, data: job });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateJob = async (req, res) => {
  try {
    const id = req.params.id;

    const job = await Jobs.findById(id);

    if (!job) {
      return res.status(400).json({ success: false, message: "Not found" });
    }
    if (job.userId.toString() !== req.user._id.toString()) {
      return res.status(400).json({ success: false, message: "Invalid User" });
    }

    const updatedJob = await Jobs.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.status(200).json({
      success: true,
      message: "Updated Successfully",
      data: updatedJob,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const id = req.params.id;
    const job = await Jobs.findById(id);

    if (!job) {
      return res.status(400).json({ success: false, message: "Job not found" });
    }

    if (job.userId.toString() !== req.user._id.toString()) {
      return res.status(400).json({ success: false, message: "inavalid user" });
    }

    await Jobs.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "Deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
