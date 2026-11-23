"use client";

import { useRef, useState } from "react";
import { ImagePlusIcon, Loader2Icon, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

/**
 * Uploads an image file to ImgBB and returns the hosted image URL.
 *
 * The ImgBB key is read from `NEXT_PUBLIC_IMAGEBB_API_KEY`. The upload is a
 * plain multipart POST to ImgBB's public `https://api.imgbb.com/1/upload`
 * endpoint (CORS-friendly, so it runs straight from the browser). Resolves to
 * the `data.url` ImgBB returns (e.g. `https://i.ibb.co/xxxx/name.jpg`).
 */
export async function uploadImageToImgbb(file: File): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_IMAGEBB_API_KEY;
  if (!apiKey) {
    throw new Error("ImgBB API key is missing (NEXT_PUBLIC_IMAGEBB_API_KEY).");
  }

  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(
    `https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`,
    { method: "POST", body: formData }
  );

  const data = await res.json();

  if (!res.ok || !data?.success || !data?.data?.url) {
    throw new Error(data?.error?.message || "ImgBB upload failed.");
  }

  return data.data.url as string;
}

/**
 * Drop-in photo picker for the sign-up form.
 *
 * The parent keeps its existing "Photo URL" text input and `setPhotoUrl`
 * state — this component only *feeds* that state: pick a file → it uploads
 * to ImgBB → it calls `onUploaded(url)` with the hosted link. Nothing else
 * in the form has to change.
 */
export function ImgbbUpload({
  onUploaded,
  currentUrl,
}: {
  /** Called with the ImgBB-hosted URL once the upload succeeds. */
  onUploaded: (url: string) => void;
  /** Current value (from the form's photo state) — used for the preview. */
  currentUrl?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // Reset the input so choosing the same file again still fires onChange.
    event.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.add({
        title: "Invalid file",
        description: "Please choose an image file.",
        type: "error",
        timeout: 3000,
      });
      return;
    }

    try {
      setUploading(true);
      const url = await uploadImageToImgbb(file);
      onUploaded(url);
      toast.add({
        title: "Photo uploaded",
        description: "Your profile photo is ready.",
        type: "success",
        timeout: 3000,
      });
    } catch (error) {
      toast.add({
        title: "Upload failed",
        description:
          error instanceof Error ? error.message : "Could not upload the image.",
        type: "error",
        timeout: 3000,
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      {/* Preview thumbnail (if we already have a URL) */}
      <span className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-dashed bg-muted text-muted-foreground">
        {currentUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={currentUrl}
            alt="Profile preview"
            className="size-full object-cover"
          />
        ) : (
          <ImagePlusIcon className="size-5" />
        )}
        {uploading && (
          <span className="absolute inset-0 flex items-center justify-center bg-background/60">
            <Loader2Icon className="size-4 animate-spin" />
          </span>
        )}
      </span>

      <div className="flex flex-col gap-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-fit"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? (
            <>
              <Loader2Icon className="animate-spin" />
              Uploading…
            </>
          ) : (
            <>
              <ImagePlusIcon />
              {currentUrl ? "Change photo" : "Upload photo"}
            </>
          )}
        </Button>
        {currentUrl ? (
          <button
            type="button"
            onClick={() => onUploaded("")}
            className="flex w-fit items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-destructive"
          >
            <XIcon className="size-3" />
            Remove
          </button>
        ) : (
          <span className="text-xs text-muted-foreground">
            Uploade to ImgBB
          </span>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}

export default ImgbbUpload;