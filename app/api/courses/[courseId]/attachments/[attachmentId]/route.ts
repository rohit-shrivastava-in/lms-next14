import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";


export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string, attachmentId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorised", { status: 401 });
    }

    const { courseId, attachmentId } = params;
    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        userId: userId
      }
    })

    if (!courseOwner) {
      return new NextResponse("Unauthorised", { status: 401 });
    }

    await db.attachment.delete({
      where: {
        id: attachmentId
      }
    })

    return NextResponse.json({
      courseId, attachmentId
    });
  } catch (error) {
    console.error("[COURSE_ID_DELETE_ATTACHMENTS", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}