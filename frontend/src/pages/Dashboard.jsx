import React, { useEffect, useState } from "react";
import useJobStore from "../store/useJobStore";
import AddJobModal from "../components/AddJobModal";
import EditJobModal from "../components/EditJobModal";
import { useNavigate } from "react-router-dom";

const JOBS_PER_PAGE = 10;

const Dashboard = () => {
  const { jobs, isLoading, getAllJobs, addJob, updateJob, deleteJob } =
    useJobStore();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All Time");
  const [editJob, setEditJob] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("newest");

  const filteredByDate = jobs.filter((job) => {
    const now = new Date();
    const jobDate = new Date(job.createdAt);
    if (dateFilter === "Today")
      return jobDate.toDateString() === now.toDateString();
    if (dateFilter === "This Week")
      return jobDate >= new Date(now - 7 * 24 * 60 * 60 * 1000);
    if (dateFilter === "This Month")
      return (
        jobDate.getMonth() === now.getMonth() &&
        jobDate.getFullYear() === now.getFullYear()
      );
    return true;
  });

  const filteredJobs = filteredByDate.filter((job) =>
    statusFilter === "All" ? true : job.status === statusFilter,
  );

  const sortedJobs = [...filteredJobs].sort((a, b) =>
    sortOrder === "newest"
      ? new Date(b.createdAt) - new Date(a.createdAt)
      : new Date(a.createdAt) - new Date(b.createdAt),
  );

  const stats = {
    Total: filteredByDate.length,
    Applied: filteredByDate.filter((j) => j.status === "Applied").length,
    Saved: filteredByDate.filter((j) => j.status === "Saved").length,
    Interviewing: filteredByDate.filter((j) => j.status === "Interviewing")
      .length,
    Offer: filteredByDate.filter((j) => j.status === "Offer").length,
    Rejected: filteredByDate.filter((j) => j.status === "Rejected").length,
  };
  const totalPages = Math.ceil(filteredJobs.length / JOBS_PER_PAGE);
  const paginatedJobs = sortedJobs.slice(
    (currentPage - 1) * JOBS_PER_PAGE,
    currentPage * JOBS_PER_PAGE,
  );

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleDateFilter = (e) => {
    setDateFilter(e.target.value);
    setCurrentPage(1);
  };

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
            <p className="text-xs text-base-content/40 text-center mb-3">
              Click a card to filter by status
            </p>
            <div className="flex flex-wrap gap-3 justify-center mb-6">
              {Object.entries(stats).map(([label, count]) => (
                <div
                  key={label}
                  onClick={() =>
                    handleStatusFilter(label === "Total" ? "All" : label)
                  }
                  className={`cursor-pointer rounded-box px-6 py-3 text-center transition-all bg-base-200
        ${
          statusFilter === label ||
          (label === "Total" && statusFilter === "All")
            ? "border-2 border-primary"
            : "border-2 border-transparent hover:border-base-content/20"
        }`}
                >
                  <div className="text-2xl font-bold">{count}</div>
                  <div className="text-xs text-base-content/50">{label}</div>
                </div>
              ))}
            </div>
            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-6 text-center items-center justify-center">
              {/* Date Filter */}
              <select
                className="select select-bordered select-sm"
                value={dateFilter}
                onChange={handleDateFilter}
              >
                <option value="All Time">All Time</option>
                <option value="Today">Today</option>
                <option value="This Week">This Week</option>
                <option value="This Month">This Month</option>
              </select>

              <button
                className="btn btn-sm btn-outline"
                onClick={() => {
                  setSortOrder(sortOrder === "newest" ? "oldest" : "newest");
                  setCurrentPage(1);
                }}
              >
                {sortOrder === "newest" ? "Newest First" : "Oldest First"}
              </button>
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
                  {filteredJobs.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-20 text-base-content/40 text-lg"
                      >
                        {jobs.length === 0
                          ? "No applications yet. Add your first job above or use the extension!"
                          : "No applications match your filters."}
                      </td>
                    </tr>
                  ) : (
                    paginatedJobs.map((job) => (
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
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-6">
                <button
                  className="btn btn-sm btn-outline"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  «
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      className={`btn btn-sm ${currentPage === page ? "btn-primary" : "btn-outline"}`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  ),
                )}
                <button
                  className="btn btn-sm btn-outline"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  »
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
