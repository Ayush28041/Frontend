export default function RoomCard({ room }) {
    return (
      <div className="border p-4 rounded shadow">
        <h2 className="text-xl font-semibold">{room.name}</h2>
        <p>Location: {room.location}</p>
        <p>Capacity: {room.capacity}</p>
        <p>Status: {room.availability}</p>
        <p className="text-sm text-gray-500 italic">{room.feedback}</p>
      </div>
    );
  }
  