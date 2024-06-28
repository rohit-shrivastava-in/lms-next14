import { IconBadge } from "@/components/icon-badge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { ArrowLeft, Eye, LayoutDashboard, Video } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ChapterTitleForm } from "./_components/chapter-title-form";
import { ChapterDescriptionForm } from "./_components/chapter-description-form";
import { ChapterAccessForm } from "./_components/chapter-access-form";
import { ChapterVideoForm } from "./_components/video-form";

const ChapterIdPage = async ({
  params
}: { params: { courseId: string, chapterId: string } }) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const chapter = await db.chapter.findUnique({
    where: {
      id: params.chapterId,
      courseId: params.courseId
    },
    include: {
      muxData: true
    },
  });

  if (!chapter) {
    return redirect("/");
  }

  const requireFields = [
    chapter?.title,
    chapter?.description,
    chapter?.videourl
  ];

  const totalFields = requireFields.length;
  const completedFields = requireFields.filter(Boolean).length;

  const completiontext = `(${completedFields}/${totalFields})`;


  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="w-full">
          <Link
            href={`/teacher/courses/${params.courseId}`}
            className="flex items-center text-sm hover:opacity-75 transition mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to course setup
          </Link>
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-2xl font-medium">
                Chapter Creation
              </h1>
              <span className="text-sm text-slate-700">
                Complete all fields {completiontext}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div className="space-y-4">
          <div className="flex items-center gap-x-2">
            <IconBadge size="sm" icon={LayoutDashboard} />
            <h2 className="text-xl">
              Customise your chapter
            </h2>
          </div>
          <ChapterTitleForm
            initialData={chapter}
            chapterId={params.chapterId}
            courseId={params.courseId}
          />
          <ChapterDescriptionForm
            initialData={chapter}
            chapterId={params.chapterId}
            courseId={params.courseId}
          />
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge size="sm" icon={Eye} />
              <h2 className="text-xl">
                Access settings
              </h2>
            </div>
            <ChapterAccessForm
              initialData={chapter}
              chapterId={params.chapterId}
              courseId={params.courseId}
            />
          </div>
        </div>
        <div className="">
          <div className="flex items-center gap-x-2">
            <IconBadge size="sm" icon={Video} />
            <h2 className="text-xl">
              Add a videos
            </h2>
          </div>
          <ChapterVideoForm
            initialData={chapter}
            chapterId={params.chapterId}
            courseId={params.courseId}
          />
        </div>
      </div>
    </div>
  )
}

export default ChapterIdPage