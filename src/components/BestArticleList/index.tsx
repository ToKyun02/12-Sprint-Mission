'use client';

import { useState, useEffect } from 'react';
import { getArticles } from '@/api/articles';
import BestArticle from '@/components/BestArticle';
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

export default function BestArticleList() {
  const [list, setList] = useState<List>({ articles: [], loading: true });
  const [pageSize, setPageSize] = useState<number | null>(null);

  useEffect(() => {
    const getInitCnt = () => {
      if (window.innerWidth >= 1200) return 3;
      if (window.innerWidth >= 768) return 2;
      return 1;
    };

    setPageSize(getInitCnt());

    const updatePageSize = () => {
      setPageSize(getInitCnt());
    };

    window.addEventListener('resize', updatePageSize);
    return () => window.removeEventListener('resize', updatePageSize);
  }, []);

  useEffect(() => {
    if (pageSize === null) return;

    const fetchArticles = async () => {
      setList({ articles: [], loading: true });
      try {
        const { list } = await getArticles({
          page: 1,
          pageSize,
          orderBy: 'like',
        });
        setList({ articles: list, loading: false });
      } catch (error) {
        console.error('Error fetching articles:', error);
        setList((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchArticles();
  }, [pageSize]);

  return (
    <div className='md:flex md:gap-6'>
      {list.loading || pageSize === null ? <SkeletonUi cnt={pageSize ?? 1} /> : list.articles.map((article) => <BestArticle key={article.id} article={article} />)}
    </div>
  );
}