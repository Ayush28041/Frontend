import { useEffect, useState } from "react";
import { getAllRooms } from "../services/rooms.service";
import RoomCard from "../components/meeting-rooms/RoomCard";
import toast from "react-hot-toast";

export default function MeetingRooms() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      // try {
        const data = await getAllRooms();
        console.log(data);
        setRooms(data);
      // } catch (err) {
      //   toast.error("Failed to fetch rooms");
      // }
    };
    fetchRooms();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Available Meeting Rooms</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </div>
  );
}
