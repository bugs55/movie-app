import NotFoundIcon from "@/icons/NotFoundIcon";

export default function NotFound() {
  return (
    <div className="w-full flex flex-col justify-center items-center mt-6">
      <h2 className="text-xl font-bold mb-4">Movie not found.</h2>
      <NotFoundIcon fontSize={200} fill="#d4d4d4" />
    </div>
  );
}
