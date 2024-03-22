"use client";
 
import { UploadButton } from "@/utils/uploadthing";
import { ClientUploadedFileData } from "uploadthing/types";
 
export default function UploadButtonArea({ handleImageSelect }: { handleImageSelect: (res:ClientUploadedFileData<{
  uploadedBy: string;
}>[]) => void }) {

  return (
      <UploadButton
        className="bg-sky-900 px-4 py-2 text-white rounded-lg" endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          if (res) {
            handleImageSelect(res);
          }
        }}
        onUploadError={(error: Error) => {
          alert(`ERROR! ${error.message}`);
        }}
      />
  );
}