import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server"


export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string, chapterId: string } }
) {
  try {
    const { userId } = auth();
    const { chapterId, courseId } = params;

    if (!userId) {
      return new NextResponse("Unauthorised access", { status: 401 })
    }


    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        userId: userId
      }
    });

    if (!courseOwner) {
      return new NextResponse("Unauthorised access", { status: 401 })
    }

    const publishedChapter = await db.chapter.update({
      where: {
        id: chapterId,
        courseId: courseId
      },
      data: {
        isPublished: false
      }
    });

    const publishedChapterInCourse = await db.chapter.findMany({
      where: {
        id: chapterId,
        isPublished: true
      }
    });

    if (!publishedChapterInCourse?.length) {
      await db.course.update({
        where: {
          id: courseId
        },
        data: {
          isPublished: false
        }
      })
    }

    return NextResponse.json(publishedChapter);
  } catch (error) {
    console.log("CHAPTER_UNPUBLISHED", error)
    return new NextResponse("Internal server error");
  }
}