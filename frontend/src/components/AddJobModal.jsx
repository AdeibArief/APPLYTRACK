import React, { useState } from "react";
import useJobStore from "../store/useJobStore";

const AddJobModal = ({ onClose }) => {
  const { addJob, isLoading } = useJobStore();
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    status: "Applied",
    source: "",
    jobUrl: "",
    notes: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addJob(
      formData.company,
      formData.role,
      formData.status,
      formData.source,
      formData.jobUrl,
      formData.notes,
    );
    await onClose();
  };
  return (
    <div
      className="flex fixed inset-0 z-50  bg-transparent/50 items-center justify-center scroll-auto"
      onClick={() => onClose()}
    >
      {isLoading ? (
        <span className="loading loading-spinner loading-lg"></span>
      ) : (
        <div
          className="card bg-base-200 card-bordered card-normal w-fit p-10 overflow-scroll overflow-x-hidden overflow-y-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="card-body">
            <h1 className="text-center card-title font-bold text-3xl items-center justify-center text-base-content/75">
              Add
            </h1>
          </div>
          <form className="form">
            <div className="flex gap-3 flex-col">
              <input
                type="text"
                onChange={handleChange}
                value={formData.company}
                name="company"
                className="input input-bordered w-fit text-center mx-auto px-9"
                placeholder="Company"
              />
              <input
                type="text"
                onChange={handleChange}
                value={formData.role}
                name="role"
                className="input input-bordered w-fit text-center mx-auto px-9"
                placeholder="Role"
              />

              <select
                name="status"
                onChange={handleChange}
                value={formData.status}
                className="select select-bordered items-center text-center"
              >
                <option value="Applied">Applied</option>
                <option value="Saved">Saved</option>
                <option value="Interviewing">Interviewing</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
              </select>
              <input
                type="text"
                onChange={handleChange}
                value={formData.jobUrl}
                name="jobUrl"
                className="input input-bordered w-fit text-center mx-auto px-9"
                placeholder="URL"
              />
              <input
                type="text"
                onChange={handleChange}
                value={formData.source}
                name="source"
                className="input input-bordered w-fit text-center mx-auto px-9"
                placeholder="Source"
              />
              <input
                type="text"
                onChange={handleChange}
                value={formData.notes}
                name="notes"
                className="input input-bordered w-fit text-center mx-auto px-9  "
                placeholder="Notes"
              />
            </div>
          </form>
          <button className="btn btn-primary mt-4" onClick={handleSubmit}>
            Add
          </button>
        </div>
      )}
    </div>
  );
};

export default AddJobModal;
