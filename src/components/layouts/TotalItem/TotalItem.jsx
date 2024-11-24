import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import getItems from '../../../api/productGet';
import TotalItemTitle from '../TotalItemTitle/TotalItemTitle';
import ItemCard from '../ItemCard/ItemCard';
// import PaginationBar from '../PaginationBar/PaginationBar';
import styles from './TotalItem.module.css';

const TotalItem = () => {
  const mobileWidth = useMediaQuery({ query: '(max-width:768px)' });
  const tabletWidth = useMediaQuery({
    query: '(min-width: 769px) and (max-width: 1200px)',
  });
  const [cardCnt, setCardCnt] = useState(10);
  const [cards, setCards] = useState([]);
  const [order, setOrder] = useState('recent');

  const getProduct = async () => {
    try {
      const items = await getItems({ pageSize: cardCnt, orderBy: order });
      setCards(items.list);
    } catch (error) {
      console.error('아이템 가져오기 실패:', error);
    }
  };

  const orderSelect = (orderQuery) => {
    setOrder(orderQuery);
  };

  useEffect(() => {
    mobileWidth ? setCardCnt(4) : tabletWidth ? setCardCnt(6) : setCardCnt(10);
  }, [mobileWidth, tabletWidth]);

  useEffect(() => {
    getProduct();
  }, [cardCnt, order]);

  return (
    <section className={styles[`total-items`]}>
      <TotalItemTitle onClick={orderSelect} />
      <div className={styles['total-item-list']}>
        {Array.isArray(cards) &&
          cards.map((value, index) => {
            return <ItemCard key={`${index}`} value={value} category="total" />;
          })}
      </div>

      {/* <PaginationBar /> */}
    </section>
  );
};

export default TotalItem;
