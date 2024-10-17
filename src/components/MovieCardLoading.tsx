import { Skeleton } from "./ui/skeleton";

export default function MovieCardLoading() {
  return (
    <div>
      <Skeleton className="w-full h-[441px] rounded-md" />
      <div className="mt-3">
        <Skeleton className="w-full h-3 rounded-full" />
        <div className="flex flex-col gap-2 mt-2">
          <Skeleton className="w-full h-2 rounded-full" />
          <Skeleton className="w-full h-2 rounded-full" />
          <Skeleton className="w-full h-2 rounded-full" />
        </div>
      </div>
    </div>
  );
}
