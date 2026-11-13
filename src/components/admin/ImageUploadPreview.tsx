import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Image as ImageIcon } from 'lucide-react';

export interface ImageUploadPreviewProps {
  coverImage: string;
  setCoverImage: (url: string) => void;
}

export const ImageUploadPreview: React.FC<ImageUploadPreviewProps> = ({ coverImage, setCoverImage }) => {
  return (
    <Card className="border-[var(--si-color-border-subtle)]">
      <CardHeader className="bg-white border-b border-slate-100">
        <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-900 font-serif">
          <ImageIcon className="w-4 h-4 text-[var(--si-color-brand-primary,#7a0f16)]" />
          <span>Imagem Destacada</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 bg-white p-6">
        <Input
          label="URL da Imagem *"
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
          placeholder="https://..."
        />

        {coverImage && (
          <div className="rounded overflow-hidden border border-slate-200 aspect-[16/10] bg-slate-100">
            <img
              src={coverImage}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
