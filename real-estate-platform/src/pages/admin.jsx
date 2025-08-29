  // import api from "../components/utils/axiosInstance";
  // import { useEffect, useState } from "react";

  // const AdminPage = () => {
  //   const [stats, setStats] = useState(null);
  //   const [loading, setLoading] = useState(true);
  //   const [error, setError] = useState(null);

  //   useEffect(() => {
  //     const fetchStats = async () => {
  //       try {
  //         const response = await api.get("/admin/");
  //         setStats(response.data);
  //       } catch (err) {
  //         setError("Failed to load stats. Please try again later.");
  //       } finally {
  //         setLoading(false);
  //       }
  //     };

  //     fetchStats();
  //   }, []);

  //   if (loading) return <p className="text-gray-400 mt-4">Loading stats...</p>;
  //   if (error) return <p className="text-red-500 mt-4">{error}</p>;

  //   return (
  //     <div className="max-w-4xl mx-auto p-6 bg-[#1a1d21] rounded-lg shadow-lg text-white mt-8">
  //       <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
  //       {stats ? (
  //         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  //           <div className="bg-[#2a2d31] p-4 rounded-lg">
  //             <h2 className="text-xl font-semibold mb-2">Total Users</h2>
  //             <p className="text-3xl">{stats.total_users}</p>
  //           </div>
  //           <div className="bg-[#2a2d31] p-4 rounded-lg">
  //             <h2 className="text-xl font-semibold mb-2">Total Listings</h2>
  //             <p className="text-3xl">{stats.total_listings}</p>
  //           </div>
  //           <div className="bg-[#2a2d31] p-4 rounded-lg">
  //             <h2 className="text-xl font-semibold mb-2">Active Listings</h2>
  //             <p className="text-3xl">{stats.active_listings}</p>
  //           </div>
  //           <div className="bg-[#2a2d31] p-4 rounded-lg">
  //             <h2 className="text-xl font-semibold mb-2">Pending Approvals</h2>
  //             <p className="text-3xl">{stats.pending_approvals}</p>
  //           </  div>
  //         </div>
  //         ) : (
  //         <p className="text-gray-400 mt-4">No stats available.</p>
  //         )}
  //     </div>
  //   );
  // }
  // export default AdminPage;