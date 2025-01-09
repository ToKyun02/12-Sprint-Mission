'use client';

import { useState, useEffect } from 'react';
import { getArticles } from '@/api/articles';
import ArticleItem from '@/components/ArticleItem';
import { Article } from '@/types';

interface List {
  articles: Article[];
  loading: boolean;
}

function SkeletonUi({ cnt }: { cnt: number }) {
  return (
    <>
      {Array.from({ length: cnt }).map((_, i) => (
        <div key={i} className='flex flex-col gap-6 rounded-lg p-6 bg-gray-100'>
          <div className='w-[102px] h-[30px] bg-gray-200'></div>
          <div className='flex gap-2 justify-between'>
            <div className='w-[256px] h-[64px] bg-gray-200'></div>
            <div className='w-[72px] h-[72px] bg-gray-200'></div>
          </div>
          <div className='flex justify-between'>
            <div className='flex gap-4'>
              <div className='w-14 h-6 bg-gray-200'></div>
              <div className='flex items-center gap-1'>
                <div className='w-3.5 h-3.5 bg-gray-200'></div>
                <div className='w-12 h-4 bg-gray-200'></div>
              </div>
            </div>
            <div className='w-20 h-4 bg-gray-200'></div>
          </div>
        </div>
      ))}
    </>
  );
}

export default function ArticleList() {
  const [list, setList] = useState<List>({ articles: [], loading: true });
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    const fetchArticles = async () => {
      setList({ articles: [], loading: true });
      try {
        const { list } = await getArticles({
          page,
          pageSize: 5,
          orderBy: 'like',
        });
        setList({ articles: list, loading: false });
      } catch (error) {
        console.error('Error fetching articles:', error);
        setList((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchArticles();
  }, [page]);

  return <div className='flex flex-col gap-6 w-[100%]'>{list.loading ? <SkeletonUi cnt={5} /> : list.articles.map((article) => <ArticleItem key={article.id} article={article} />)}</div>;
}