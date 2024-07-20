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

    const unPublishedCourse = await db.course.update({
      where: {
        id: courseId
      },
      data: {
        isPublished: false
      }
    });

    return NextResponse.json(unPublishedCourse);
  } catch (error) {
    console.log("CHAPTER_UNPUBLISHED", error)
    return new NextResponse("Internal server error");
  }
}