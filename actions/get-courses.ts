import { db } from "@/lib/db";
import { Category, Course } from "@prisma/client";
import { GetProgress } from "./get-progress";

type CourseWithProgressWithhCategory = Course & {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
}

type GetCoursesProps = {
  userId: string;
  title?: string;
  categoryId?: string;
}
export const GetCourses = async ({
  userId,
  title,
  categoryId
}: GetCoursesProps): Promise<CourseWithProgressWithhCategory[] | []> => {
  try {
    const courses = await db.course.findMany({
      where: {
        isPublished: true,
        title: {
          contains: title,
        },
        categoryId,
      },
      include: {
        category: true,
        chapters: {
          where: {
            isPublished: true
          },
          select: {
            id: true
          }
        },
        purchases: {
          where: {
            userId,
          }
        }
      },
      orderBy: {
        createAt: "desc"
      }
    })

    const coursesWithProgress: CourseWithProgressWithhCategory[] = await Promise.all(
      courses.map(async course => {
        if (course.purchases.length === 0) {
          return {
            ...course,
            progress: null
          }
        }

        const progressPercentage = await GetProgress(userId, course.id);
        return {
          ...course,
          progress: progressPercentage
        }
      })
    )

    return coursesWithProgress;
  } catch (error) {
    console.log("[GET_COURSES]", error);
    return [];
  }
}