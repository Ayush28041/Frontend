import { useEffect, useState } from "react";
import { getUserReservations } from "../services/reservations.service";
import toast from "react-hot-toast";

export default function Reservations() {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const data = await getUserReservations();
        setReservations(data);
      } catch (err) {
        toast.error("Could not load reservations");
      }
    };
    fetchReservations();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">My Reservations</h1>
      {reservations.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <ul className="space-y-4">
          {reservations.map((res) => (
            <li key={res.id} className="border p-4 rounded shadow">
              <h2 className="text-lg font-bold">{res.title}</h2>
              <p>Room: {res.room.name} ({res.room.location})</p>
              <p>
                {new Date(res.startTime).toLocaleString()} – {new Date(res.endTime).toLocaleString()}
              </p>
              <p>Status: {res.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
