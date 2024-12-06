import { useParams } from 'react-router-dom';
import { getItemDetail } from 'api/productAPI';
import { useCallback, useEffect, useState, useRef } from 'react';
import defaultItemImg from 'assets/images/img_default.png';
import emptyProfileImg from 'assets/images/ic_profile.svg';
import dropdownImg from 'assets/images/ic_kebab.svg';
import { ReactComponent as HeartIcon } from 'assets/images/heart_empty.svg';

const ItemInfo = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const imgRef = useRef();

  const errorImg = () => {
    imgRef.current.src = defaultItemImg;
  };

  const getItem = useCallback(async () => {
    const response = await getItemDetail(id);
    setItem(response);
  }, [id]);

  useEffect(() => {
    getItem();
  }, [getItem]);

  if (!item) {
    return <p>로딩중</p>;
  }

  const {
    images,
    name,
    price,
    description,
    tags,
    ownerNickname,
    createdAt,
    favoriteCount,
    ownerImages,
  } = item;

  return (
    <section className="flex flex-col gap-6 border-b border-gray-200 mt-36 mx-auto pb-10 w-4/5 md:flex-row sm:mt-20">
      <img
        src={images[0]}
        alt="상품 이미지"
        onError={errorImg}
        ref={imgRef}
        className="rounded-xl object-cover w-2/5 aspect-square h-auto"
      />

      <div className="flex flex-col relative flex-1">
        <p className="text-xl font-semibold text-gray-800">{name}</p>
        <p className="border-b border-gray-200 mt-2 pb-4 text-3xl font-semibold text-gray-800">{`${price.toLocaleString()}원`}</p>
        <img
          src={dropdownImg}
          alt="드롭다운 이미지"
          className="absolute top-0 right-0 cursor-pointer"
        />
        <p className="mt-4 mb-4 font-semibold text-gray-600">상품 소개</p>
        <p className="font-normal text-gray-600">{description}</p>
        <p className="mt-4 mb-4 font-semibold text-gray-600">상품 태그</p>
        <div className="flex flex-wrap gap-2">
          {tags?.map((value) => (
            <span
              className="rounded-3xl py-1.5 px-4 bg-gray-100 text-gray-800 font-normal"
              key={value}
            >{`#${value}`}</span>
          ))}
        </div>

        <div className="flex items-center gap-4 flex-1 mt-12 ">
          <img
            src={ownerImages?.[0] ?? emptyProfileImg}
            alt="상품 소유자 프로필 이미지"
            className="w-10 h-10"
          />
          <div className="flex flex-col justify-between flex-1 border-r border-gray-200">
            <p>{ownerNickname}</p>
            <p>{createdAt.slice(0, 10).split('-').join('.')}</p>
          </div>
          <button className="flex items-center gap-1 border border-gray-200 rounded-3xl py-1 px-4 group">
            <HeartIcon className="group-hover:fill-pink-500" />
            {favoriteCount}
          </button>
        </div>
      </div>
    </section>
  );
};

export default ItemInfo;