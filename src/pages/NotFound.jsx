import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="text-center p-6">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mb-4">Page not found</p>
      <Link to="/" className="text-blue-500 underline">Go to Dashboard</Link>
    </div>
  );
}
