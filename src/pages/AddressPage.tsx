import { useEffect, useState } from 'react';
import { getAllTransactions, Transaction } from '../services/services';
import Header from '../components/Header';
import InteractionsCard from '../components/InteractionsCard';
import ActivityCard from '../components/ActivityCard';
import FeeCard from '../components/FeeCard';
import ProtocolsCard from '../components/ProtocolsCard';
import TokensCard from '../components/TokensCard';
import VolumeCard from '../components/VolumeCard';

type Props = {}

const AddressPage = (props: Props) => {
  const address = window.location.search.split('=')[1];
  const [transactionList,setTransactionList] = useState<Transaction[]>([]);
  const [displayModal, setDisplayModal] = useState<boolean>(true);

  useEffect(() =>{
    if(!address || address.length !== 42 || address.slice(0 , 2) !== '0x'){
      window.location.search = '';
      return;
    }
    fetchTranactionList();
  }, [address]);

  const fetchTranactionList = async () => {
    const transactions: Transaction[] = await getAllTransactions(address);
    setTransactionList(transactions)
  }
  
  // 关闭最下面的窗口
  const closeModal = ()=>{
    setDisplayModal(false);
  };

  return (
    <>
      <Header hasSearcheBar />
      <div className="grid mt-20 place-items-center ">
        <div className="grid place-items-center">
          <div className="flex items-center flex-row space-x-5 mt-5">
            <InteractionsCard address={address} transactions={transactionList} />
            <VolumeCard address={address} transactions={transactionList} />
            <FeeCard address={address} transactions={transactionList} />
          </div>
          <div className="flex items-center flex-row space-x-5 mt-1.5">
            <TokensCard address={address} />
            <ActivityCard address={address} transactions={transactionList} />
          </div>
          <ProtocolsCard address={address} transactions={transactionList} />
        </div>
      </div>
    </>
  );
}

export default AddressPage;