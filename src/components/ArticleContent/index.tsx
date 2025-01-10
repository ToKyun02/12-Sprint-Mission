'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Searchbar from '@/components/ArticleSearchbar';
import Dropdown from '../ArticleDropdown';
import ArticleList from './ArticleList';

export default function ArticleContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const [order, setOrder] = useState('최신순');
  return (
    <>
      <div className='flex items-center gap-6 mt-4'>
        <Searchbar />
        <Dropdown order={order} setOrder={setOrder} />
      </div>
      <div className='flex flex-col items-center mt-4 my-12'>
        <ArticleList order={order} q={q} />
      </div>
    </>
  );
}