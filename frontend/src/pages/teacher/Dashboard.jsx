import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Link } from "react-router-dom";
import "./TeacherDashboard.css";
import NameHeader from "../../component/NameHeader";

const TeacherDashboard = () => {
  const [className, setClassName] = useState("");
  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  

  const itemsPerPage = 5;

  const fetchClasses = async () => {
    try {
      const res = await api.get("/class/getclass");
      setClasses(res.data.data);
    } catch (err) {
      alert("Failed to load classes");
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const createClass = async () => {
    if (!className) return alert("Class name required");

    try {
      setLoading(true);
      await api.post("/class/create-class", { className });
      setClassName("");
      fetchClasses();
      console.log("class nhi create ",className);
      
    } catch (err) {
      alert(err.response?.data?.error || "Class already exists");
    } finally {
      setLoading(false);
    }
  };

  // 🔎 Search Filter
  const filteredClasses = classes.filter((cls) =>
    cls.className.toLowerCase().includes(search.toLowerCase())
  );

  // 📄 Pagination
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentClasses = filteredClasses.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredClasses.length / itemsPerPage);

  return (
    <div className="dashboard-container">

      {/* Top Section */}
      <div className="dashboard-header">
        <NameHeader/>

        <div className="add-class">
          <input
            placeholder="Enter class name"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
          />
          <button onClick={createClass}>
            {loading ? "Creating..." : "+ Add Class"}
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="search-box">
        <input
          placeholder="Search class..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="class-card">
        <table>
          <thead>
            <tr>
              <th>Class Name</th>
              <th>Students</th>
              <th>Status</th>
              <th>Manage</th>
              <th>Live</th>
            </tr>
          </thead>

          <tbody>
            {currentClasses.map((cls) => (
              <tr key={cls._id}>
                <td>{cls.className}</td>
                <td>{cls.studentsIds.length}</td>

                <td>
                  <span className="badge active">Active</span>
                </td>

                <td>
                  <Link
                    to={`/teacher/class/${cls._id}/students`}
                    className="btn manage"
                  >
                    Manage
                  </Link>
                </td>

                <td>
                  <Link
                    to={`/teacher/class/${cls._id}/live`}
                    className="btn live"
                  >
                    Start
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={currentPage === i + 1 ? "active-page" : ""}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
