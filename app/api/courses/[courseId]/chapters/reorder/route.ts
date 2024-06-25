import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    const { list } = await req.json();

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

    for (let item of list) {
      await db.chapter.update({
        where: { id: item.id },
        data: { position: item.position }
      })
    }

    return new NextResponse("Success", { status: 200 });
  } catch (error) {
    console.error("[CHAPTERS_REORDER_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}