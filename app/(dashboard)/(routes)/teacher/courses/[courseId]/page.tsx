import { IconBadge } from "@/components/icon-badge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { IndianRupeeIcon, LayoutDashboard, ListChecks } from "lucide-react";
import { redirect } from "next/navigation";
import { TitleForm } from "./_components/title-form";
import { DescriptionForm } from "./_components/description-form";
import { ImageForm } from "./_components/image-upload";
import { CategoryForm } from "./_components/category-form.tsx";
import { PriceForm } from "./_components/price-form";

const CourseIdPage = async ({ params }: { params: { courseId: string } }) => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/");
  }

  const course = await db.course.findUnique({
    where: {
      id: params.courseId
    }
  });

  const categories = await db.category.findMany({
    orderBy: {
      name: 'asc'
    }
  })

  if (!course) {
    return redirect("/");
  }

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId
  ]

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completiontext = `(${completedFields} / ${totalFields})`
  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium">
            Course setup
          </h1>
          <span className="text-sm text-slate-700">
            Complete all fields {completiontext}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div>
          <div className="flex items-center gap-2">
            <IconBadge size="sm" icon={LayoutDashboard} />
            <h2 className="text-xl">
              Customize your course
            </h2>
          </div>
          <TitleForm initialData={course} courseId={course.id} />
          <DescriptionForm initialData={course} courseId={course.id} />
          <ImageForm initialData={course} courseId={course.id} />
          <CategoryForm initialData={course} courseId={course.id}
            options={categories.map((option) => ({ label: option.name, value: option.id }))}
          />
        </div>
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge size="sm" icon={ListChecks} />
              <h2 className="text-xl"> Course chapters</h2>
            </div>
            <div>TODO: Chapters</div>
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge size="sm" icon={IndianRupeeIcon} />
              <h2>Sell your course</h2>
            </div>
            <PriceForm initialData={course} courseId={course.id} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseIdPage;