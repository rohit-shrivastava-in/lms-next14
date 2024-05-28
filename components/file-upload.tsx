"use client";

import toast from "react-hot-toast";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { UploadDropzone } from "@/lib/uploadthing";

interface FileUploadProps {
  onChange: (url: string) => void;
  endpoint: keyof typeof ourFileRouter;
}

export const FileUpload = ({
  onChange,
  endpoint
}: FileUploadProps) => {
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0]?.url)
      }}
      onUploadError={(error: Error) => {
        toast.error(`${error.message}`)
      }}
    />
  )
}
// export default function Home() {
//   return (
//     <main className="flex min-h-screen flex-col items-center justify-between p-24">
//       <UploadButton
//         endpoint="imageUploader"
//         onClientUploadComplete={(res) => {
//           // Do something with the response
//           console.log("Files: ", res);
//           alert("Upload Completed");
//         }}
//         onUploadError={(error: Error) => {
//           // Do something with the error.
//           alert(`ERROR! ${error.message}`);
//         }}
//       />
//     </main>
//   );
// }