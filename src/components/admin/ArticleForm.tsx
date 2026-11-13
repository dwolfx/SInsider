'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Category, User, ArticleStatus, ArticleFormat } from '@/types';
import { Input, Textarea } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { createArticle } from '@/lib/api';
import { FileText } from 'lucide-react';
import { QuickPresets, PresetType } from './QuickPresets';
import { GoogleSnippetPreview } from './GoogleSnippetPreview';
import { PublishingSettingsCard } from './PublishingSettingsCard';
import { ImageUploadPreview } from './ImageUploadPreview';

interface ArticleFormProps {
  categories: Category[];
  users: User[];
  currentUser: User;
}

export const ArticleForm: React.FC<ArticleFormProps> = ({
  categories,
  currentUser,
}) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [kicker, setKicker] = useState('NOTÍCIA');
  const [format, setFormat] = useState<ArticleFormat>('padrao');
  const [subtitle, setSubtitle] = useState('');
  const [categorySlug, setCategorySlug] = useState(categories[0]?.slug || 'regulatorio');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState(
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&auto=format&fit=crop&q=80'
  );
  const [status, setStatus] = useState<ArticleStatus>('published');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBreaking, setIsBreaking] = useState(false);
  const [isSponsored, setIsSponsored] = useState(false);
  const [tagsInput, setTagsInput] = useState('Saúde, ANS, Mercado');

  // Quick Preset Helper
  const applyPreset = (type: PresetType) => {
    switch (type) {
      case 'urgente':
        setKicker('URGENTE / FURO');
        setFormat('padrao');
        setIsBreaking(true);
        setIsFeatured(true);
        break;
      case 'entrevista':
        setKicker('GRANDE ENTREVISTA');
        setFormat('entrevista');
        setIsFeatured(true);
        break;
      case 'opiniao':
        setKicker('OPINIÃO');
        setFormat('opiniao');
        setCategorySlug('opiniao');
        setIsFeatured(false);
        break;
      case 'podcast':
        setKicker('PODCAST');
        setFormat('podcast');
        setCategorySlug('podcasts');
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !subtitle || !content) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setIsSubmitting(true);
    try {
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      const created = await createArticle({
        title,
        kicker,
        subtitle,
        content,
        categorySlug,
        coverImage,
        status,
        isFeatured,
        isBreaking,
        authorId: currentUser.id,
        tags,
      });

      setSuccess(true);
      setTimeout(() => {
        router.push(`/noticia/${created.slug}`);
      }, 1200);
    } catch (err) {
      alert('Erro ao criar notícia. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 font-sans">
      <QuickPresets onSelectPreset={applyPreset} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Fields (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-[var(--si-color-border-subtle)]">
            <CardHeader className="bg-white border-b border-slate-100">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-900 font-serif">
                <FileText className="w-4 h-4 text-[var(--si-color-brand-primary,#7a0f16)]" />
                <span>Conteúdo Editorial da Notícia</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 bg-white p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Input
                    label="Chapéu / Kicker *"
                    value={kicker}
                    onChange={(e) => setKicker(e.target.value)}
                    placeholder="Ex: REGULATÓRIO"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 font-mono">
                    Editoria *
                  </label>
                  <select
                    value={categorySlug}
                    onChange={(e) => setCategorySlug(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-[var(--si-color-brand-primary,#7a0f16)] focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 font-mono">
                    Modelo de Postagem *
                  </label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value as ArticleFormat)}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-[var(--si-color-brand-primary,#7a0f16)] focus:outline-none"
                  >
                    <option value="padrao">📰 Matéria Padrão (single.css)</option>
                    <option value="entrevista">🎙️ Grande Entrevista (entrevista.css)</option>
                    <option value="podcast">🎧 Podcast com Áudio</option>
                    <option value="cupula">🏛️ Especial Cúpula</option>
                    <option value="opiniao">✍️ Artigo de Opinião</option>
                    <option value="branded">📢 Branded Content / Patrocinado</option>
                  </select>
                </div>
              </div>

              <Input
                label="Título Principal (Manchete) *"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: ANS aprova nova resolução normativa sobre capital regulatório..."
                required
              />

              <Textarea
                label="Linha Fina / Subtítulo *"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Resumo executivo de impacto que contextualiza a notícia para a liderança."
                rows={2}
                required
              />

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 font-mono">
                  Corpo da Notícia (HTML / Texto Formatado) *
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={10}
                  className="w-full p-3 font-mono text-xs bg-white border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-[var(--si-color-brand-primary,#7a0f16)] focus:outline-none leading-relaxed"
                  placeholder="<p class='lead'>Primeiro parágrafo de impacto...</p>
<p>Desenvolvimento da matéria...</p>
<h2>Subtítulo de seção</h2>
<p>Mais detalhes...</p>"
                  required
                />
              </div>

              <Input
                label="Tags (separadas por vírgula)"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="ANS, Hospitais, Judicialização"
              />
            </CardContent>
          </Card>

          <GoogleSnippetPreview title={title} subtitle={subtitle} />
        </div>

        {/* Sidebar Options (1 Col) */}
        <div className="space-y-6">
          <PublishingSettingsCard
            status={status}
            setStatus={setStatus}
            isFeatured={isFeatured}
            setIsFeatured={setIsFeatured}
            isBreaking={isBreaking}
            setIsBreaking={setIsBreaking}
            isSponsored={isSponsored}
            setIsSponsored={setIsSponsored}
            isSubmitting={isSubmitting}
            success={success}
          />

          <ImageUploadPreview coverImage={coverImage} setCoverImage={setCoverImage} />
        </div>
      </div>
    </form>
  );
};
