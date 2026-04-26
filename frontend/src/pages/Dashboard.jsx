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
  const [editJob, setEditJob] = useState(null);

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
                  {jobs.map((job) => (
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
