"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";


import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Course } from "@prisma/client";
import { formatPrice } from "@/lib/format";



interface PriceFormProps {
  initialData: Course,
  courseId: string
}

const formSchema = z.object({
  price: z.coerce.number(),
});

export const PriceForm = ({
  initialData,
  courseId
}: PriceFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      price: initialData.price || undefined
    }
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success("Course updated");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong")
    }
  }

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Course price
        <Button onClick={toggleEdit} variant="ghost">
          {
            isEditing ?
              <>Cancel</> :
              <>
                <Pencil className="h-4 w-4 mr-2" />
                Edit price
              </>
          }
        </Button>
      </div>
      <div>
        {
          !isEditing ? (
            <p className="text-sm mt-2">
              {!!initialData.price ? formatPrice(initialData.price) : "No price"}
            </p>
          )
            :
            (<Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 mt-4"
              >
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          disabled={isSubmitting}
                          placeholder="Set price for your course"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="flex items-center gap-x-2">
                  <Button
                    disabled={!isValid || isSubmitting}
                    type="submit"
                    variant="ghost"
                  >
                    Save
                  </Button>
                </div>
              </form>
            </Form>
            )
        }
      </div>
    </div>
  )
}