import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import Mux from "@mux/mux-node"

import { db } from "@/lib/db";

const { video } = new Mux({
  tokenId: process.env['MUX_TOKEN_ID'],
  tokenSecret: process.env['MUX_TOKEN_SECRET'],
});

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

    if (values.videourl) {
      const exitingMuxData = await db.muxData.findFirst({
        where: {
          chapterId: params.chapterId
        }
      });

      if (exitingMuxData?.assetsId) {
        await video.assets.delete(exitingMuxData.assetsId);
        await db.muxData.delete({
          where: {
            id: exitingMuxData.id
          }
        });
      }

      const assest = await video.assets.create({
        input: values.videourl,
        playback_policy: ["public"],
        test: false
      });

      await db.muxData.create({
        data: {
          chapterId: params.chapterId,
          assetsId: assest.id,
          playbackId: assest.playback_ids?.[0].id
        }
      })
    }


    return NextResponse.json(course);
  } catch (error) {
    console.error("[COURSE_CHAPTER_ID", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}