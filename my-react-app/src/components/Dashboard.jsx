import React, { useState, useEffect } from "react";

const Dashboard = () => {
  const [links, setLinks] = useState([]);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    targetUrl: "",
    shortCode: "",
  });
  const handleDelete = async (code) => {
    try {
      await fetch(`/api/links/${code}`, {
        method: "DELETE",
      });
      fetchLinks();
    } catch (error) {
      console.log("Delete error:", error);
    }
  };
  const fetchLinks = () => {
    fetch("/api/links")
      .then((res) => res.json())
      .then((data) => setLinks(data))
      .catch((error) => {
        setError("Error fetching data");
        console.log(error);
      });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    try {
      // e.preventDefault();
      const { targetUrl, shortCode } = formData;
      const response = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUrl, shortCode }),
      });
      const data = await response.json();
      console.log("Created:", data);
      fetchLinks();
    } catch (error) {
      console.log("Error:", error);
    }
  };
  useEffect(() => {
    fetchLinks();
  }, []);
  if (error) return <h2>{error}</h2>;
  return (
    <div className="p-6 space-y-10">
      <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow">
        <h1 className="text-xl font-semibold mb-4 text-center">
          Form to add new link
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="targetUrl"
              className="block text-sm font-medium text-gray-700 text-center"
            >
              Target URL*
            </label>
            <input
              type="text"
              name="targetUrl"
              id="targetUrl"
              required
              placeholder="E.g: https://example.com"
              value={formData.targetUrl}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="shortCode"
              className="block text-sm font-medium text-gray-700 text-center"
            >
              short Code
            </label>
            <input
              type="text"
              name="shortCode"
              id="shortCode"
              placeholder="E.g: aWfdYnM"
              value={formData.shortCode}
              onChange={handleChange}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Add Link
          </button>
        </form>
      </div>
      <div className="p-6 bg-white rounded-xl shadow">
        <h1 className="text-xl font-semibold mb-4 text-center">
          Table of all links
        </h1>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-center border-b">Short Code</th>
                <th className="px-4 py-2 text-center border-b">Target URL</th>
                <th className="px-4 py-2 text-center border-b">Total Clicks</th>
                <th className="px-4 py-2 text-center border-b">Last Clicked</th>
                <th className="px-4 py-2 text-center border-b"></th>
              </tr>
            </thead>
            <tbody>
              {links.map((link) => (
                <tr
                  key={link.shortCode}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-2 border-b text-center">
                    {link.shortCode}
                  </td>
                  <td className="px-4 py-2 border-b text-center">
                    {link.targetUrl}
                  </td>
                  <td className="px-4 py-2 border-b text-center">
                    {link.totalClicks}
                  </td>
                  <td className="px-4 py-2 border-b text-center">
                    {link.lastClickedTime
                      ? new Date(link.lastClickedTime).toLocaleString()
                      : "NA"}
                  </td>
                  <td className="px-4 py-2 border-b text-center">
                    <button
                      onClick={() => handleDelete(link.shortCode)}
                      className="bg-red-500 text-white py-2 px-5 rounded-lg hover:bg-red-600 transition "
                    >
                      delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
