import Jobs from "../models/Job.js";
const parseRelativeDate = (relativeStr) => {
  if (!relativeStr) return new Date();

  // handle full date strings like "3 Oct' 24" or "3 Oct 24"
  const fullDate = new Date(relativeStr.replace(/'/g, ""));
  if (!isNaN(fullDate.getTime())) return fullDate;

  // handle relative strings like "11mo ago", "2w ago"
  const match = relativeStr.match(/(\d+)\s*(mo|w|d|h)/);
  if (!match) return new Date();
  const num = parseInt(match[1]);
  const unit = match[2];
  const now = new Date();
  if (unit === "mo") return new Date(now.getFullYear(), now.getMonth() - num, 1);
  if (unit === "w") return new Date(now - num * 7 * 24 * 60 * 60 * 1000);
  if (unit === "d") return new Date(now - num * 24 * 60 * 60 * 1000);
  return now;
};
const getSource = (url = "") => {
  if (url.includes("linkedin.com")) return "LinkedIn";
  if (url.includes("indeed.com")) return "Indeed";
  if (url.includes("foundit.in")) return "Foundit";
  if (url.includes("wellfound.com")) return "Wellfound";
  if (url.includes("internshala.com")) return "Internshala";
  return "Other";
};

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

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

export const bulkAddJobs = async (req, res) => {
  try {
    const { jobs, pageUrl } = req.body;

    if (!jobs || !Array.isArray(jobs) || jobs.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No job provided" });
    }

    const source = getSource(pageUrl);
    let imported = 0;
    let skipped = 0;

    for (const job of jobs) {
      const { company, role, appliedAt } = job;
      if (!company || !role) {
        skipped++;
        continue;
      }

      const existing = await Jobs.findOne({
        userId: req.user._id,
        company: { $regex: new RegExp(`^${escapeRegex(company)}$`, "i") },
        role: { $regex: new RegExp(`^${escapeRegex(role)}$`, "i") },
      });
      if (existing) {
        skipped++;
        continue;
      }

      const createdAt = parseRelativeDate(appliedAt);
      await Jobs.create({
        userId: req.user._id,
        company,
        role,
        status: "Applied",
        source,
        jobUrl: "",
        notes: `Imported from ${source}`,
        createdAt,
      });

      imported++;
    }

    // moved outside the loop
    res.status(200).json({ success: true, data: { imported, skipped } });
  } catch (error) {
    console.log("bulkAddJobs error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
};
