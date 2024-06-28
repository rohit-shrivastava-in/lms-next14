import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string, chapterId: string } }
) {
  try {
    const { userId } = auth();
    const { courseId, chapterId } = params;
    const { isPublished, ...values } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorised", { status: 401 });
    }

    const course = await db.chapter.update({
      where: {
        id: chapterId,
        courseId,
      },
      data: {
        ...values
      }
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error("[COURSE_CHAPTER_ID", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}