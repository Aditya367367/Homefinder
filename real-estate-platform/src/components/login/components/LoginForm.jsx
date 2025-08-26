   
import { Link } from "react-router-dom";

const LoginForm = () => {
  return (
    <form className="space-y-4">
      <div>
        <label className="block text-sm mb-1">Email</label>
        <input
          type="email"
          placeholder="you@example.com"
          className="w-full px-4 py-2 rounded-md bg-[#2c2f34] border border-gray-700 text-sm outline-none focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Password</label>
        <input
          type="password"
          placeholder="••••••••"
          className="w-full px-4 py-2 rounded-md bg-[#2c2f34] border border-gray-700 text-sm outline-none focus:border-blue-500"
        />
        <div className="text-right text-sm mt-1">
          <Link to="/forgot-password" className="text-blue-400 hover:underline">
            Forgot Password?
          </Link>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-md font-medium transition"
      >
        Login
      </button>
    </form>
  );
};

export default LoginForm;
