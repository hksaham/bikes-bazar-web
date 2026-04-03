import { useState, useCallback, useRef } from "react";
import { motion, Reorder } from "framer-motion";
import { Upload, X, GripVertical, Image as ImageIcon } from "lucide-react";
import { uploadBikeImage, deleteBikeImage, compressImage } from "@/lib/storage";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

interface ImageUploaderProps {
  bikeId: string;
  images: string[];
  onImagesChange: (images: string[]) => void;
}

export default function ImageUploader({
  bikeId,
  images,
  onImagesChange,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files).filter((f) =>
        f.type.startsWith("image/")
      );
      if (fileArray.length === 0) return;

      setUploading(true);
      setUploadProgress(0);

      const newUrls: string[] = [];
      for (let i = 0; i < fileArray.length; i++) {
        try {
          const url = await uploadBikeImage(bikeId, fileArray[i]);
          newUrls.push(url);
          setUploadProgress(Math.round(((i + 1) / fileArray.length) * 100));
        } catch (err) {
          console.error("Upload failed:", err);
          toast({
            title: `Failed to upload ${fileArray[i].name}`,
            variant: "destructive",
          });
        }
      }

      onImagesChange([...images, ...newUrls]);
      setUploading(false);
      setUploadProgress(0);
      toast({ title: `${newUrls.length} image(s) uploaded` });
    },
    [bikeId, images, onImagesChange, toast]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleDelete = async (url: string) => {
    try {
      await deleteBikeImage(url);
      onImagesChange(images.filter((img) => img !== url));
      toast({ title: "Image removed" });
    } catch {
      toast({ title: "Failed to delete image", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-4">
      <label className="text-xs text-muted-foreground block">
        Images {images.length > 0 && `(${images.length})`} — First image is the main photo
      </label>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ${
          dragOver
            ? "border-accent bg-accent/10 scale-[1.02]"
            : "border-border hover:border-muted-foreground"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
        {uploading ? (
          <div className="space-y-2">
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className="bg-accent h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Compressing & uploading... {uploadProgress}%
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload size={24} className="text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Drag & drop images or <span className="text-accent">browse</span>
            </p>
            <p className="text-[10px] text-muted-foreground/60">
              Images auto-compressed to 1200px width
            </p>
          </div>
        )}
      </div>

      {/* Reorderable preview grid */}
      {images.length > 0 && (
        <Reorder.Group
          axis="x"
          values={images}
          onReorder={onImagesChange}
          className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
        >
          {images.map((url, i) => (
            <Reorder.Item
              key={url}
              value={url}
              className="relative flex-shrink-0 group cursor-grab active:cursor-grabbing"
            >
              <div className={`relative rounded-md overflow-hidden ${i === 0 ? "ring-2 ring-accent" : ""}`}>
                <img
                  src={url}
                  alt={`Gallery ${i + 1}`}
                  className="w-24 h-20 object-cover"
                  loading="lazy"
                />
                {/* Overlay controls */}
                <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                  <GripVertical size={14} className="text-muted-foreground" />
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(url); }}
                    className="p-1 text-destructive hover:text-destructive/80"
                  >
                    <X size={14} />
                  </button>
                </div>
                {i === 0 && (
                  <div className="absolute bottom-0 left-0 right-0 bg-accent/80 text-accent-foreground text-[8px] text-center py-0.5 font-medium">
                    MAIN
                  </div>
                )}
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      )}
    </div>
  );
}
