import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Stats = () => {
  const { code } = useParams();
  const [stats, setStats] = useState("");
  const fetchStats = async (code) => {
    try {
      const response = await fetch(`http://localhost:3000/api/links/${code}`);
      const data = await response.json();
      console.log(data);
      setStats(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchStats(code);
  }, []);
  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Welcome to Stats:</h1>

      {!stats ? (
        <p>No data available for this shortCode</p>
      ) : (
        <div className="space-y-2 bg-white shadow p-4 rounded max-w-md mx-auto">
          <p>
            <strong>Short Code:</strong> {stats.shortCode}
          </p>

          <p>
            <strong>Target URL:</strong> {stats.targetUrl}
          </p>

          <p>
            <strong>Total Clicks:</strong> {stats.totalClicks}
          </p>

          <p>
            <strong>Last Clicked:</strong>{" "}
            {stats.lastClickedTime
              ? new Date(stats.lastClickedTime).toLocaleString()
              : "Never clicked"}
          </p>
        </div>
      )}
    </div>
  );
};

export default Stats;
