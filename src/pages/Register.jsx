import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/auth.service";
import toast from "react-hot-toast";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(form);
      toast.success("Registered successfully. Please login.");
      navigate("/login");
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-white to-blue-100 px-4">
      <div className="max-w-md w-full p-8 bg-white/70 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/30">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-extrabold text-gray-800">Create Account</h1>
          <p className="text-sm text-gray-500 mt-2">Sign up with your company email</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Full Name"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            label="Email"
            placeholder="username@jadeglobal.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <Button className="w-full py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition-all text-lg font-medium">
            Register
          </Button>
        </form>
        <p className="mt-6 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 hover:underline font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
