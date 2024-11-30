import styled from 'styled-components';
import { useCallback, useEffect, useState, useRef } from 'react';
import closeImg from '../../../../assets/images/ic_X.svg';
import plusImg from '../../../../assets/images/ic_plus.svg';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin: 70px auto 0;
  width: 90%;
  max-width: 1200px;
  @media (max-width: 500px) {
    margin-top: 130px;
  }
`;

const Title = styled.h1`
  font-size: 20px;
  font-weight: 700;
`;

const Label = styled.label`
  font-size: 18px;
  font-weight: 700;
`;

const Input = styled.input`
  margin-bottom: 20px;
  border: 1px solid var(--gray100);
  border-radius: 12px;
  padding-left: 16px;
  background-color: var(--gray100);
  height: 56px;
  font-size: 16px;

  font-family: Pretendard, sans-serif;
  &::placeholder {
    color: var(--gray400);
  }
`;

const Textarea = styled.textarea`
  border: 1px solid var(--gray100);
  border-radius: 12px;
  padding: 16px 0 0 16px;
  height: 300px;
  background-color: var(--gray100);
  font-size: 16px;
  font-family: Pretendard, sans-serif;
  resize: none;
  &::placeholder {
    color: var(--gray400);
  }
`;

const FileInput = styled.input`
  display: none;
`;

const FileButton = styled.label`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--gray100);
  border-radius: 12px;
  width: 280px;
  height: 280px;
  background-color: var(--gray100);
  color: var(--gray400);
  cursor: pointer;

  @media (max-width: 1200px) {
    width: 170px;
    height: 170px;
  }
  @media (max-width: 500px) {
    width: 100px;
    height: 100px;
  }
`;

const SubmitButton = styled.button`
  border: 1px solid
    ${({ disabled }) => (disabled ? 'var(--gray400)' : 'var(--blue)')};
  border-radius: 8px;
  padding: 10px 20px;
  background-color: ${({ disabled }) =>
    disabled ? 'var(--gray400)' : 'var(--blue)'};
  color: #ffffff;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
`;

const TitleDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 8px;
  margin-top: 30px;
`;

const PreviewImg = styled.img`
  border-radius: 12px;
  width: 280px;
  height: 280px;
  @media (max-width: 1200px) {
    width: 170px;
    height: 170px;
  }
  @media (max-width: 500px) {
    width: 100px;
    height: 100px;
  }
`;

const ImgArea = styled.div`
  display: flex;
  gap: 10px;
`;

const WarningMessage = styled.p`
  color: #f74747;
  font-size: 16px;
  font-weight: 400;
`;

const PreviewImgArea = styled.div`
  position: relative;
`;

const CloseImg = styled.img`
  position: absolute;
  top: 10px;
  right: 10px;
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 50px;
`;

const Tag = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 6px;
  border: 1px solid var(--gray100);
  border-radius: 26px;
  padding: 6px 12px;
  background-color: var(--gray100);
`;

const TagName = styled.span`
  font-size: 16px;
  font-weight: 400;
`;

const RegisterForm = () => {
  const [imgPreview, setImgPreview] = useState(null);
  const [isValid, setIsValid] = useState(false);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [isImg, setIsImg] = useState(false);
  const [tags, setTags] = useState([]);
  const fileInputRef = useRef(null);

  const changeImg = ({ target }) => {
    const file = target.files[0];
    if (!file) return;
    if (imgPreview) {
      setIsImg(true);
      return;
    }

    const preview = URL.createObjectURL(file);

    setImgPreview(preview);
  };
  const checkValid = useCallback(() => {
    const validResult = name.trim() !== '' && price > 0;
    setIsValid(validResult);
  }, [name, price]);
  //inputChange 중복 정의 대신 커링 방식으로 setter함수 넘겨주기
  const inputChangeHandler = (setter) => (e) => {
    let value = e.target.value;
    e.preventDefault();
    if (setter === setPrice) {
      value = value.trim();
      let num = Number(value.replace(/,/g, ''));
      if (isNaN(num)) {
        setter('');
        return;
      }
      //최대 금액 설정
      if (num > 1_000_000_000) num = 1_000_000_000;
      setter(num);
      return;
    }
    setter(value);
  };

  const closePreview = () => {
    if (imgPreview) {
      URL.revokeObjectURL(imgPreview);
      setImgPreview(null);
      setIsImg(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    }
  };

  const isExistArray = (element, elements) => {
    return elements.some((prevElement) => element === prevElement);
  };

  const keydownHandler = (e) => {
    const value = e.target.value;
    //엔터 혹은 스페이스바
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      //중복된거 있으면 태그 추가 막기
      if (isExistArray(value, tags)) return;
      setTags((prevTags) => {
        e.target.value = '';
        return [value, ...prevTags];
      });
    }
  };

  const deleteTag = (index) => {
    setTags((prevTags) => {
      return prevTags.filter((_, prevIndex) => index !== prevIndex);
    });
  };

  const preventSubmit = (e) => {
    if (e.key === 'Enter') e.preventDefault();
  };

  useEffect(() => {
    checkValid();
  }, [name, price, checkValid]);

  return (
    <Form>
      <TitleDiv>
        <Title>상품 등록하기</Title>
        <SubmitButton disabled={!isValid}>등록</SubmitButton>
      </TitleDiv>

      <Label>상품 이미지</Label>
      <ImgArea>
        <FileButton htmlFor="file">
          <img src={plusImg} alt="+ 이미지" />
          이미지 등록
        </FileButton>
        <FileInput
          id="file"
          type="file"
          onChange={changeImg}
          ref={fileInputRef}
        />
        {imgPreview && (
          <PreviewImgArea>
            <PreviewImg src={imgPreview} alt="이미지 미리보기" />
            <CloseImg src={closeImg} alt="닫기 이미지" onClick={closePreview} />
          </PreviewImgArea>
        )}
      </ImgArea>
      {isImg && (
        <WarningMessage>*이미지 등록은 최대 1개까지 가능합니다.</WarningMessage>
      )}

      <Label htmlFor="item-name">상품명</Label>
      <Input
        id="item-name"
        name="item-name"
        type="text"
        placeholder="상품명을 입력해주세요"
        onChange={inputChangeHandler(setName)}
        onKeyDown={preventSubmit}
      />

      <Label htmlFor="item-explain">상품 소개</Label>
      <Textarea
        id="item-explain"
        name="item-explain"
        placeholder="상품 소개를 입력해주세요"
      />

      <Label htmlFor="item-price">판매 가격</Label>
      <Input
        id="item-price"
        name="item-price"
        type="text"
        placeholder="판매 가격을 입력해주세요"
        value={price.toLocaleString()}
        onChange={inputChangeHandler(setPrice)}
        onKeyDown={preventSubmit}
      />

      <Label htmlFor="tag">태그</Label>
      <Input
        id="tag"
        name="tag"
        type="text"
        placeholder="태그를 입력해주세요"
        onKeyDown={keydownHandler}
      />
      <Tags>
        {tags.map((value, index) => {
          return (
            <Tag key={index}>
              <TagName>{`#${value}`}</TagName>
              <img
                src={closeImg}
                alt="닫기 이미지"
                onClick={() => deleteTag(index)}
              />
            </Tag>
          );
        })}
      </Tags>
    </Form>
  );
};

export default RegisterForm;
