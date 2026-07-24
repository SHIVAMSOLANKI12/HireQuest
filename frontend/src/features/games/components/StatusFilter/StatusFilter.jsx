import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const StatusFilter = ({ value, onChange }) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-40">
        <SelectValue placeholder="Status" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="all">All</SelectItem>
        <SelectItem value="Active">Active</SelectItem>
        <SelectItem value="Draft">Draft</SelectItem>
        <SelectItem value="Archived">Archived</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default StatusFilter;
