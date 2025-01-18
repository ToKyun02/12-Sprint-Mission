'use client';
import { submitComment } from '@/actions/submit-comment';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface CommentFormData {
  content: string;
}

export default function CommentForm({ id }: { id: string }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<CommentFormData>({
    defaultValues: { content: '' },
    mode: 'onChange',
  });
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const formValues = watch();
  const isFormValid = formValues.content;
  const queryClient = useQueryClient();

  const onSubmit = async (data: CommentFormData) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('content', data.content);
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      const result = await submitComment(formData, accessToken, refreshToken, Number(id));
      setResultMessage(result.message);
      reset({ content: '' });

      if (result.success) {
        queryClient.invalidateQueries({
          queryKey: ['article-comments', Number(id)],
        });
      }
    } catch (err) {
      setResultMessage(err instanceof Error ? err.message : '댓글 등록 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4 mt-6 mx-auto w-[100%] max-w-[1200px] px-6'>
      <label className='flex flex-col gap-2'>
        <span className='font-bold text-lg'>댓글달기</span>
        <textarea
          {...register('content', { required: '내용을 반드시 입력해야 합니다.' })}
          className='w-full h-[104px] rounded-xl py-4 px-6 bg-gray-100 resize-none'
          placeholder='내용을 입력해주세요'
        />
        {errors.content && <span className='text-red-error'>{errors.content.message}</span>}
      </label>
      <button type='submit' className={`${isFormValid ? 'bg-blue-100' : 'bg-gray-400'} ml-auto w-[100px] text-white py-2 px-6 rounded-lg`} disabled={!isFormValid}>
        등록
      </button>
      {resultMessage && <p className='text-green-500'>{resultMessage}</p>}
    </form>
  );
}
