import { Skeleton } from "./ui/skeleton";

export default function MovieCardLoading() {
  return (
    <div>
      <Skeleton className="w-full aspect-[342/300] h-[300px] rounded-md" />
      <div className="mt-3">
        <Skeleton className="w-full h-3 rounded-full" />
        <div className="flex flex-col gap-2 mt-3">
          <Skeleton className="w-4/5 h-2 rounded-full" />
          <Skeleton className="w-3/5 h-2 rounded-full" />
          <Skeleton className="w-2/5 h-2 rounded-full" />
        </div>
        <Skeleton className="w-full h-[40px] rounded-md mt-6" />
      </div>
    </div>
  );
}
