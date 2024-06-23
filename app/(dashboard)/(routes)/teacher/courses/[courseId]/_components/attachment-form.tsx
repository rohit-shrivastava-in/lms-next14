"use client";

import * as z from "zod";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { File, Loader2, PlusCircle, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Attachment, Course } from "@prisma/client";
import { FileUpload } from "@/components/file-upload";
import Image from "next/image";



interface AttachmentFormProps {
  initialData: Course & { attachments: Attachment[] }
  courseId: string
}

const formSchema = z.object({
  url: z.string().min(1),
});

export const AttachmentForm = ({
  initialData,
  courseId
}: AttachmentFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const toggleEdit = () => setIsEditing((current) => !current);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/attachments`, values);
      toast.success("Course updated");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong")
    }
  }

  const onDelete = async (attachmentId: string) => {
    try {
      setDeletingId(attachmentId);
      await axios.delete(`/api/courses/${courseId}/attachments/${attachmentId}`)
      toast.success("Attachment deleted")
      router.refresh()
    } catch {
      toast.error("Something went wrong")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course image
        <Button onClick={toggleEdit} variant="ghost">
          {
            isEditing ?
              <>Cancel</> :
              <>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add attachment
              </>
          }
        </Button>
      </div>
      <div>
        {
          !isEditing && (
            <>
              {initialData.attachments.length === 0 && (
                <p className="text-sm mt-2">
                  No attachments yet
                </p>
              )}
              {initialData.attachments.length > 0 &&
                <div className="space-y-2">
                  {initialData.attachments.map(attachment => (
                    <div key={attachment.url} className="flex items-center w-full bg-sky-100
                    border-sky-200 border text-sky-700 rounded-md">
                      <File className="h-4 w-4 mr-2 flex-shrink-0" />
                      <p className="text-sx line-clamp-1">{attachment.name}</p>
                      {deletingId === attachment.id && (
                        <div>
                          <Loader2 className="h4 w4 animate-spin" />
                        </div>
                      )}
                      {deletingId !== attachment.id && (
                        <button onClick={() => onDelete(attachment.id)} className="ml-auto hover:opacity-75 transition">
                          <X className="h4 w4" />
                        </button>
                      )}
                    </div>
                  ))
                  }
                </div>
              }
            </>
          )
        }

        {isEditing && (
          <>
            <FileUpload
              endpoint="courseAttachment"
              onChange={(url) => {
                if (url) {
                  onSubmit({ url })
                }
              }}
            />
            <div className="text-sx text-muted-foreground mt-4">
              Add anything your student might need to complete the course.
            </div>
          </>
        )}
      </div>
    </div>
  )
}