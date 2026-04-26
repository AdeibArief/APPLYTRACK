import React, { useEffect, useState } from "react";
import useJobStore from "../store/useJobStore";
import AddJobModal from "../components/AddJobModal";
import EditJobModal from "../components/EditJobModal";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { jobs, isLoading, getAllJobs, addJob, updateJob, deleteJob } =
    useJobStore();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All Time");
  const [editJob, setEditJob] = useState(null);

  const filteredJobs = jobs.filter((job) => {
    // Status filter
    const statusMatch =
      statusFilter === "All" ? true : job.status === statusFilter;

    // Date filter
    const now = new Date();
    const jobDate = new Date(job.createdAt);
    let dateMatch = true;

    if (dateFilter === "Today") {
      dateMatch = jobDate.toDateString() === now.toDateString();
    } else if (dateFilter === "This Week") {
      const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
      dateMatch = jobDate >= weekAgo;
    } else if (dateFilter === "This Month") {
      dateMatch =
        jobDate.getMonth() === now.getMonth() &&
        jobDate.getFullYear() === now.getFullYear();
    }

    return statusMatch && dateMatch;
  });

  useEffect(() => {
    getAllJobs();
  }, []);

  useEffect(() => {
    window.addEventListener("focus", getAllJobs);
    return () => window.removeEventListener("focus", getAllJobs);
  }, []);
  return (
    <div className="flex flex-col max-h-screen justify-center items-center p-10">
      <div className="overflow-x-auto w-full">
        {isLoading ? (
          <span className="loading loading-spinner loading-lg items-center justify-center flex-col text-center"></span>
        ) : (
          <div>
            <div className="flex flex-row items-center justify-center text-center gap-3 mb-10">
              <button
                className=" btn btn-primary"
                onClick={() => setShowModal(!showModal)}
              >
                Add Job
              </button>
              <a
                href="https://chrome.google.com/webstore"
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline btn-md"
              >
                Download Extension
              </a>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-6 text-center items-center justify-center">
              {/* Status Filter */}
              <div className="flex gap-2 flex-wrap">
                {[
                  "All",
                  "Applied",
                  "Saved",
                  "Interviewing",
                  "Offer",
                  "Rejected",
                ].map((status) => (
                  <button
                    key={status}
                    className={`btn btn-sm ${statusFilter === status ? "btn-primary" : "btn-outline"}`}
                    onClick={() => setStatusFilter(status)}
                  >
                    {status}
                  </button>
                ))}
              </div>

              {/* Date Filter */}
              <select
                className="select select-bordered select-sm"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option value="All Time">All Time</option>
                <option value="Today">Today</option>
                <option value="This Week">This Week</option>
                <option value="This Month">This Month</option>
              </select>
            </div>

            {showModal && <AddJobModal onClose={() => setShowModal(false)} />}
            <div className="overflow-x-auto w-full rounded-box border border-base-content/20 bg-base-100">
              <table className="table">
                <thead>
                  <tr className="text-2xl text-center ">
                    <th>Company</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Notes</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {filteredJobs.map((job) => (
                    <tr key={job._id} className="hover:bg-base-200">
                      <td>{job.company}</td>
                      <td>{job.role}</td>
                      <td>{job.status}</td>
                      <td>{new Date(job.createdAt).toLocaleDateString()}</td>
                      <td>{job.notes}</td>
                      <td className="flex gap-2 items-center justify-center">
                        <button
                          className="btn btn-sm btn-error"
                          onClick={() => deleteJob(job._id)}
                        >
                          Delete
                        </button>

                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => setEditJob(job)}
                        >
                          Edit
                        </button>
                        {editJob && (
                          <EditJobModal
                            job={editJob}
                            onClose={() => setEditJob(null)}
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
