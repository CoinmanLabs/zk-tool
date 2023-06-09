import { Fragment, useRef, useState,FC, useEffect} from 'react'
import { Dialog, Transition } from '@headlessui/react';
import { Transaction } from '../services/services.ts';
import { sortTransfer } from '../utils/utils.ts';
interface ReportdProps {
    address: string;
    transactions: Transaction[];
  }

const Report : FC<ReportdProps> = ({ address, transactions })  => {
  const [open, setOpen] = useState(true)
  const cancelButtonRef = useRef(null)
  const [fees, setFees] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0);
  const [interactions, setInteractions] = useState<number>(0);
  const [level, setLevel] = useState<String>('Tier 4');
  const [suggets, setSuggets] = useState<String>('');

  const classRedName = "text-sm text-red-500 text-sm font-semibold";
  const classGreeName = "text-sm text-green-500 text-sm font-semibold";

  useEffect(() => {
    setInteractions(0);
    setFees(0);
    setVolume(0);
    transactions.forEach((transaction) => {
      if (transaction.initiatorAddress.toLowerCase() === address.toLowerCase()) {
        setInteractions((prev) => prev + 1);

        transaction.balanceChanges.forEach((balanceChange) => {
            let tmpFees = 0;
            if (balanceChange.type === 'fee') {
              tmpFees =
                parseInt(balanceChange.amount, 16) *
                10 ** -balanceChange.tokenInfo.decimals *
                balanceChange.tokenInfo.usdPrice;
            } else if (balanceChange.from.toLowerCase() === '0x0000000000000000000000000000000000008001') {
              tmpFees -=
                parseInt(balanceChange.amount, 16) *
                10 ** -balanceChange.tokenInfo.decimals *
                balanceChange.tokenInfo.usdPrice;
            }
            setFees((prev) => prev + tmpFees);
          });

        const erc20Transfers = transaction.erc20Transfers.sort(sortTransfer);

        if (erc20Transfers.length === 0) return;

        const tmpVolume =
            parseInt(erc20Transfers[0].amount, 16) *
            10 ** -erc20Transfers[0].tokenInfo.decimals *
            erc20Transfers[0].tokenInfo.usdPrice;

        setVolume((prev) => prev + tmpVolume);
         
        // 判断钱包等级
        if(volume <= 500 || interactions <= 3){
            setLevel('Tier 4' );
            setSuggets('请优先将交互金额提升到500以上,交互次数至少是10次以上');
        }else{
            if( (volume  > 500 && volume < 2000)  || (interactions >= 10 && interactions < 15) || (fees >= 10 && fees < 50) ){
                setLevel('Tier 3');
                setSuggets('请优先将交互金额提升到2000以上,交互次数至少是15次以上');
            }else{
                if((volume > 2000 && volume < 200000) || (interactions >= 15 && interactions < 25) || (fees >=50 && fees < 100 )){
                    setLevel('Tier 2');
                    setSuggets('可以考虑冲击下Tier1');
                }else{
                    setLevel('Tier 1');
                    setSuggets('请继续坚持你的计划,现在你在5%');
                }
            }
        }
        


      }
    });
  }, [address, transactions]);
   
  return (
    <Transition.Root show={open} as={Fragment}>
    <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      </Transition.Child>

      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-10 sm:w-full sm:max-w-lg">
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                      zkSync交互评估报告
                    </Dialog.Title>
                    <div className='mt-2'>
                       下图是Dune查看面板根据Arb和OP空投规则的出钱包等级,
                       基于链上数据，对于Tier 1，空投几乎可以肯定，而对于Tier 4，这仍然是可能的，但可能性较小.
                      <img src={'/protocol/tier.png'} />
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 text-sm font-semibold">
                        <b>地址</b>：{address} 
                      </p>
                      <p className="text-sm text-gray-500">
                        <b>钱包等级</b>：{level} (钱包等级按照总交互金额优先)
                      </p>
                      <p className={interactions < 25? classRedName: classGreeName}>
                        <b>总交互次数</b>：{interactions} 
                      </p>
                      <p className={volume < 2000 ? classRedName : classGreeName}>
                        <b>总交互金额</b>：{Math.round(volume)} USDT
                      </p>
                      <p className={fees < 10 ? classRedName : classRedName}>
                        <b>总花费Gas</b>：{Math.round(fees)} USDT
                      </p>
                    </div>
                    <div className='mt-3'>
                     <p className="text-sm text-gray-1000">
                        <b>建议</b>：<br />
                         {suggets}

                      </p> 
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                  onClick={() => setOpen(false)}
                >
                 确定
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </div>
    </Dialog>
  </Transition.Root>
  )
}

export default Report;