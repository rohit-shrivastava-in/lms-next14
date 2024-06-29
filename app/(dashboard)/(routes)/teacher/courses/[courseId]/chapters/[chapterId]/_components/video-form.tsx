"use client";

import * as z from "zod";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Pencil, PlusCircle, VideoIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Chapter, MuxData } from "@prisma/client";
import { FileUpload } from "@/components/file-upload";
import VideoPlayer from '@mux/mux-player-react';

interface ChapterVideoFormProps {
  initialData: Chapter & { muxData?: MuxData | null };
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  videourl: z.string().min(1),
});

export const ChapterVideoForm = ({
  initialData,
  courseId,
  chapterId
}: ChapterVideoFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const toggleEdit = () => setIsEditing((current) => !current);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
      toast.success("Chapter updated");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong")
    }
  }

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Chapter video
        <Button onClick={toggleEdit} variant="ghost">
          {
            isEditing && (
              <>Cancel</>
            )}
          {!isEditing && !initialData.videourl &&
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add video
            </>
          }
          {!isEditing && initialData.videourl &&
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit video
            </>
          }
        </Button>
      </div>
      <div>
        {
          !isEditing && (
            !initialData.videourl ? (
              <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                <VideoIcon className="h-10 w-10 text-slate-500" />
              </div>
            ) : (
              <div className="relative aspect-video mt-2">
                <VideoPlayer
                  playbackId={initialData?.muxData?.playbackId || ""}
                />
              </div>
            )
          )
        }

        {isEditing && (
          <>
            <FileUpload
              endpoint="chapterVideo"
              onChange={(url) => {
                if (url) {
                  onSubmit({ videourl: url })
                }
              }}
            />
            <div className="text-sx text-muted-foreground mt-4">
              Upload this chapter&apos;s video
            </div>
          </>
        )}
        {
          initialData.videourl && !isEditing && (
            <div className="text-xs text-muted-foreground mt-2">
              Video can take few minute to process. Refresh the page if video does not appear.
            </div>
          )
        }
      </div>
    </div>
  )
}