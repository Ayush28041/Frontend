export default function Input({ label, type = "text", ...rest }) {
    return (
      <div className="mb-4">
        <label className="block mb-1 font-medium">{label}</label>
        <input
          type={type}
          {...rest}
          className="w-full border border-gray-300 p-2 rounded"
        />
      </div>
    );
  }
  