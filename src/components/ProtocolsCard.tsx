import { FC, useEffect, useState } from 'react';
import { Transaction } from '../services/services.ts';
import { availableProtocols } from '../utils/available-protocols.ts';
import { countTransactionPeriods, getTimeAgo, sortTransfer } from '../utils/utils.ts';
import { Protocol } from '../utils/available-protocols.ts';

interface ProtocolsCardProps {
  address: string;
  transactions: Transaction[];
}

export interface ProtocolState {
  name: string;
  id: string;
  lastActivity: string;
  volume: number;
  interactions: number;
  activeDays: number;
}

const getEraBridgeState = (address: string, transactions: Transaction[], tmpProtocolState: ProtocolState) => {
  tmpProtocolState.lastActivity = '';
  tmpProtocolState.volume = 0;
  tmpProtocolState.interactions = 0;

  transactions.forEach((transaction: Transaction) => {
    const erc20Transfers = transaction.erc20Transfers.sort(sortTransfer);
    if (erc20Transfers.length === 0) return;

    if (
      (transaction.data.contractAddress.toLowerCase() === '0x000000000000000000000000000000000000800A'.toLowerCase() &&
        transaction.data.calldata.startsWith('0x51cff8d9')) ||
      (transaction.data.contractAddress.toLowerCase() === address.toLowerCase() && transaction.isL1Originated)
    ) {
      tmpProtocolState.interactions += 1;
      tmpProtocolState.volume +=
        parseInt(erc20Transfers[0].amount, 16) *
        10 ** -erc20Transfers[0].tokenInfo.decimals *
        erc20Transfers[0].tokenInfo.usdPrice;
      if (tmpProtocolState.lastActivity === '') tmpProtocolState.lastActivity = transaction.receivedAt;
      if (new Date(tmpProtocolState.lastActivity) < new Date(transaction.receivedAt))
        tmpProtocolState.lastActivity = transaction.receivedAt;
    }
  });
};

const ProtocolsCard: FC<ProtocolsCardProps> = ({ address, transactions }) => {
  const [protocolsState, setProtocolsState] = useState<ProtocolState[]>([]);

  const getProtocolsState = () => {
    setProtocolsState([]);
    availableProtocols.forEach((protocol: Protocol) => {
      const tmpProtocolState: ProtocolState = {
        name: protocol.name,
        id: protocol.id,
        lastActivity: '',
        volume: 0,
        interactions: 0,
        activeDays: 0,
      };

      transactions.forEach((transaction: Transaction) => {
        const erc20Transfers = transaction.erc20Transfers.sort(sortTransfer);
        if (erc20Transfers.length === 0) return;

        if (
          protocol.addresses.includes(erc20Transfers[0].to.toLowerCase()) ||
          protocol.addresses.includes(erc20Transfers[0].from.toLowerCase())
        ) {
          tmpProtocolState.interactions += 1;
          tmpProtocolState.volume +=
            parseInt(erc20Transfers[0].amount, 16) *
            10 ** -erc20Transfers[0].tokenInfo.decimals *
            erc20Transfers[0].tokenInfo.usdPrice;
          if (tmpProtocolState.lastActivity === '') tmpProtocolState.lastActivity = transaction.receivedAt;
          if (new Date(tmpProtocolState.lastActivity) < new Date(transaction.receivedAt))
            tmpProtocolState.lastActivity = transaction.receivedAt;
        }
      });
      tmpProtocolState.activeDays = countTransactionPeriods(address, transactions, protocol).days;

      if (protocol.id === 'zksynceraportal') {
        getEraBridgeState(address, transactions, tmpProtocolState);
      }
      setProtocolsState((prevState) => [...prevState, tmpProtocolState]);
    });
    setProtocolsState((prevState) => prevState.sort((a, b) => b.volume - a.volume));
  };

  useEffect(() => {
    getProtocolsState();
  }, [transactions]);
   


  return (
    <div className="relative mt-1.5 rounded-lg dark:border-gray-700 border border-gray-200 mb-20 ml-4 mr-4">
      <table className="text-sm w-[812px] text-left text-gray-500 dark:text-gray-400 ">
        <caption className="p-5 text-lg font-semibold text-left text-gray-900 bg-white dark:text-white dark:bg-gray-800 rounded-t-lg">
        {address} 交互的应用(DAPP)
        </caption>
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              应用(DAPP)
            </th>
            <th scope="col" className="px-6 py-3 text-center">
              交互次数
            </th>
            <th scope="col" className="px-6 py-3 text-center">
              最新交互时间
            </th>
            <th scope="col" className="px-6 py-3 text-center">
              交易量 $
            </th>
          </tr>
        </thead>
        <tbody className="rounded-lg">
          {protocolsState &&
            protocolsState.map((protocolState, index) => {
              return (
                <tr
                  className={
                    'bg-white dark:bg-gray-800 ' +
                    (index !== protocolsState.length - 1 && 'border-b dark:border-gray-700')
                  }
                  key={protocolState.id}
                >
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    <div className="flex items-center space-x-4">
                      <img
                        className={'w-10 h-10 rounded-full ' + (!protocolState.interactions && 'grayscale')}
                        src={'/protocol/' + protocolState.id + '.png'}
                        alt=""
                      />
                      <div className="font-medium dark:text-white">
                        <div>{protocolState.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {protocolState.activeDays <= 1
                            ?   ' 交互天数：' +protocolState.activeDays
                            :   ' 交互天数：' + protocolState.activeDays}
                        </div>
                      </div>
                    </div>
                  </th>
                  <td className="px-6 py-4 text-center font-medium text-gray-900 dark:text-white">
                    {protocolState.interactions}
                  </td>
                  <td className="px-6 py-4 text-center font-medium">
                    {protocolState.lastActivity === '' ? (
                      <span className="bg-red-100 text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-red-400 border border-red-400">
                        未交互
                      </span>
                    ) : new Date(protocolState.lastActivity).getTime() > new Date().getTime() - 86400000 * 7 ? (
                      <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400">
                        {getTimeAgo(protocolState.lastActivity)}
                      </span>
                    ) : (
                      <span className="bg-yellow-100 text-yellow-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-yellow-300 border border-yellow-300">
                        {getTimeAgo(protocolState.lastActivity)}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center font-medium text-gray-900 dark:text-white">
                    {protocolState.volume.toFixed(2)}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default ProtocolsCard;
