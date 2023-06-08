import  { useState } from 'react';
import Header from '../components/Header';
import {TiSocialTwitter} from "react-icons/ti";


const Home = () => {
    const [address, setAddress] = useState<string>('');
  
    // 设置点击enter按钮搜索事件
    const handleSubmit = () =>{
        if(address === '' || address.length !== 42 || !address.startsWith('0x')){
            alert("请输入正确地址");
            return;
        }
        window.location.search = '?address=' + address;
    }

  return (
   <>
    <Header hasSearcheBar={false} />
    <div className="grid mt-36 place-items-center">
        <div className="grid place-items-center">
          <h1 className="font-bold text-6xl text-black dark:text-white mb-10 ">zkSync查漏补缺</h1>
          <p className="text-black dark:text-white font-light text-2xl text-center mr-4 ml-4 max-w-5xl">
          本工具是一个可以跟踪你的地址，查看你在不同的zkSync协议上做了多少交易量的网站。
          </p>
          <div className="w-9/12 mt-20">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg
                  aria-hidden="true"
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
              </div>
              <input
                type="search"
                id="default-search"
                className="outline-none block w-full p-4 pl-10 text-sm border rounded-lg dark:bg-gray-700 dark:border-gray-600 placeholder-gray-400 text-blank focus:ring-blue-500 focus:border-blue-500"
                placeholder="输入你的地址搜索"
                required
                onChange={(e) => setAddress(e.target.value)}
              />
              <button
                onClick={handleSubmit}
                className="text-white absolute right-2.5 bottom-2.5 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2 bg-blue-600 hover:bg-blue-700 focus:ring-blue-800"
              >
                搜索
              </button>
            </div>
          </div>
          <div className="text-black dark:text-white font-light text-2xl text-center mr-4 ml-4 mt-40 max-w-5xl">
          <img src={'/zk-tool/protocol/rule.png'} alt="交互脑图" />
            本工具由 <a className='text-black dark:text-white 'href="https://twitter.com/Coinman_Paul">Paul</a> 开发，有任何问题或改进可以推特留言
            </div>
            <a className="text-black dark:text-white font-light  text-center mr-4 ml-4 mt-10 mb-20 max-w-5xl" href="https://twitter.com/Coinman_Paul">
                <TiSocialTwitter  /></a>
        </div>
      </div>
   </>
  )
}

export default Home;