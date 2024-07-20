import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server"


export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    const { courseId } = params;

    if (!userId) {
      return new NextResponse("Unauthorised acess", { status: 401 })
    }

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        userId: userId
      },
      include: {
        chapters: {
          include: {
            muxData: true
          }
        }
      }
    });

    if (!course) {
      return new NextResponse("Not found", { status: 401 })
    }

    const hasPublishedChapter = course.chapters.some(chapter => chapter.isPublished);

    if (!course.title || !course.description || !course.imageUrl || !course.categoryId || !hasPublishedChapter) {
      return new NextResponse("Missing required field", { status: 401 });
    }

    const publishedCourse = await db.course.update({
      where: {
        id: courseId,
        userId: userId
      },
      data: {
        isPublished: true
      }
    })

    return NextResponse.json(publishedCourse);
  } catch (error) {
    console.log("COURSE_PUBLISHED", error)
    return new NextResponse("Internal server error");
  }
}