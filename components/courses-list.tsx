import { Category, Course } from "@prisma/client";
import { CourseCard } from "./course-card";

type CoursesWithProgressWithCategory = Course & {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
}

interface CoursesListProps {
  items: CoursesWithProgressWithCategory[]
}

export const CoursesList = ({ items }: CoursesListProps) => {
  return (
    <div className="grid sm:grid-cols-2 md: grid-col-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-2">
      {
        items.map((item) => (
          <div key={item.id}>
            <CourseCard
              key={item.id}
              id={item.id}
              title={item.title}
              imageUrl={item.imageUrl!}
              chaptersLength={item.chapters.length}
              price={item.price!}
              progress={item.progress}
              category={item.category?.name!}
            />
          </div>
        ))
      }
      {
        items.length === 0 && (
          <div className="text-center text-sm text-muted-foreground mt-10">
            No courses found
          </div>
        )
      }
    </div>
  )
}
