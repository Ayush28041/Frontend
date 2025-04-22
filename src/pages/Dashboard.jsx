import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
      <p>Your email: {user?.email}</p>
      <p>Your role: {user?.role}</p>
    </div>
  );
}