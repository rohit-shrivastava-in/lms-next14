import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    const { url } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorised", { status: 401 });
    }

    const { courseId } = params;
    const courseOwner = await db.course.findUnique({
      where: {
        id: courseId,
        userId: userId
      }
    })

    if (!courseOwner) {
      return new NextResponse("Unauthorised", { status: 401 });
    }

    const attachment = await db.attachment.create({
      data: {
        url,
        name: url.split('/').pop(),
        courseId: courseId
      }
    })

    return NextResponse.json(attachment);
  } catch (error) {
    console.error("[COURSE_ID_ATTACHMENTS", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}