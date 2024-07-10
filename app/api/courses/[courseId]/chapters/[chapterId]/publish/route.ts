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
      return new NextResponse("Unauthorised acess", { status: 401 })
    }


    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        userId: userId
      }
    });

    if (!courseOwner) {
      return new NextResponse("Unauthorised acess", { status: 401 })
    }

    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        courseId,
      },
    });

    const muxData = await db.muxData.findUnique({
      where: {
        chapterId: params.chapterId
      }
    });

    if (!chapter || !muxData || !chapter.title || !chapter.description || !chapter.videourl) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    const publishedChapter = await db.chapter.update({
      where: {
        id: chapterId,
        courseId: courseId
      },
      data: {
        isPublished: true
      }
    })

    return NextResponse.json(publishedChapter);
  } catch (error) {
    console.log("CHAPTER_PUBLISHED", error)
    return new NextResponse("Internal server error");
  }
}