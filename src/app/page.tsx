import MovieCard from "@/components/MovieCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default async function Home() {
  return (
    <div className="px-5">
      <div className="w-full flex gap-2">
        <div>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-[150px]">
          <Input type="text" placeholder="Year" />
        </div>
      </div>
      <div className="mt-5 grid grid-cols-4 gap-3"></div>
    </div>
  );
}
