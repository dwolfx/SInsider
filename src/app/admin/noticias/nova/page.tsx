import React from 'react';
import { getCategories, getUsers } from '@/lib/api';
import { ArticleForm } from '@/components/admin/ArticleForm';

export default async function NewArticlePage() {
  const [categories, users] = await Promise.all([
    getCategories(),
    getUsers(),
  ]);

  const currentUser = users[0]; // Victor Hugo

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-serif font-black text-slate-900">
          Publicador & Editor de Notícias
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Crie matérias com rapidez utilizando padrões de chapéu, SEO integrado e imagens em alta resolução.
        </p>
      </div>

      <ArticleForm
        categories={categories}
        users={users}
        currentUser={currentUser}
      />
    </div>
  );
}
