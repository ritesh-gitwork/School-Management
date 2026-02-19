import { useLocation } from "react-router-dom";

const Breadcrumb = () => {
  const location = useLocation();
  const pathParts = location.pathname.split("/").filter(Boolean);

  return (
    <div style={{ marginBottom: "15px", fontSize: "14px" }}>
      {pathParts.map((part, index) => (
        <span key={index}>
          {part}
          {index < pathParts.length - 1 && " / "}
        </span>
      ))}
    </div>
  );
};

export default Breadcrumb;
