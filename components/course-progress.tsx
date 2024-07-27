import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface CourseProgressPros {
  value: number;
  variant?: 'default' | 'success';
  size?: "default" | "sm"
}

const colorByVariant = {
  default: "text-sky-700",
  success: "text-emerald-700"
}

const sizeByVariant = {
  default: "text-sm",
  sm: "text-xs"
}

const CourseProgress = ({
  value,
  size,
  variant
}: CourseProgressPros) => {
  return (
    <div>
      <Progress
        variant={variant}
        className="h-2"
        value={value}
      />
      <p className={cn(
        "font-medium mt-2 text-sky-700",
        colorByVariant[variant || "default"],
        sizeByVariant[size || "default"]
      )}>
        {Math.round(value)} % Completed
      </p>
    </div>
  );
}

export default CourseProgress;