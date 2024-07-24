import { db } from "@/lib/db"

export const GetProgress = async (
  userId: string,
  courseId: string,
): Promise<number> => {
  try {
    const publishedChapter = await db.chapter.findMany({
      where: {
        courseId: courseId,
        isPublished: true
      },
      select: {
        id: true
      }
    });

    const publishedChapterIds = publishedChapter.map((chapter) => chapter.id);
    const validCompletedChapter = await db.userProgress.count({
      where: {
        userId: userId,
        chapterId: {
          in: publishedChapterIds
        },
        isCompleted: true
      }
    });

    const progressPercentage = (validCompletedChapter / publishedChapterIds.length) * 100;

    return progressPercentage;
  } catch (error) {
    console.log("[GET_PROGRESS]", error)
    return 0;
  }
}