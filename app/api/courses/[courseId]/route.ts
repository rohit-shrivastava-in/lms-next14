import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import Mux from "@mux/mux-node";
import { NextResponse } from "next/server";

const { video } = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorised", { status: 401 });
    }

    const { courseId } = params;

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
    })

    if (!course) {
      return new NextResponse("Not found", { status: 404 });
    }

    for (let chapter of course.chapters) {
      if (chapter.muxData?.assetsId) {
        // assest will be available only for 2 days in demo account
        const assets = await video.assets.retrieve(chapter.muxData.assetsId);
        if (assets) {
          await video.assets.delete(chapter.muxData.assetsId);
        }
      }
    }


    const deletedCourse = await db.course.delete({
      where: {
        id: courseId
      }
    });

    return NextResponse.json(deletedCourse);
  } catch (error) {
    console.log("COURSE_ID_DELETE", error);
    return new NextResponse("Internal server error", { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    const { courseId } = params;
    const values = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorised", { status: 401 });
    }

    const course = await db.course.update({
      where: {
        id: courseId,
        userId,
      },
      data: {
        ...values
      }
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error("[COURSE_ID", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}