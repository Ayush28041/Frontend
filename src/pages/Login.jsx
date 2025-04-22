import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/auth.service";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser({ email, password });
      login(res.token);
      toast.success("Login successful!");
      navigate("/rooms");
    } catch {
      toast.error("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100 px-4">
      <div className="max-w-md w-full p-8 bg-white/70 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/30">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-extrabold text-gray-800">Welcome</h1>
          <p className="text-sm text-gray-500 mt-2">Please login to continue</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email"
            placeholder="username@jadeglobal.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button className="w-full py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition-all text-lg font-medium">
            Login
          </Button>
        </form>
        <p className="mt-6 text-sm text-center text-gray-600">
          Don’t have an account?{" "}
          <a href="/register" className="text-indigo-600 hover:underline font-medium">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
