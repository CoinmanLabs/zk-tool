import  {FC, useState} from 'react'
import {TiSocialTwitter} from "react-icons/ti";
interface HeaderProps {
    hasSearcheBar: boolean;
}

const Header: FC<HeaderProps> = ({ hasSearcheBar }) => {
  const [displayModal, setDisplayModal] = useState<boolean>(true);

  
  // 关闭最下面的窗口
  const closeModal = ()=>{
      setDisplayModal(false);
  };

  return (
    <nav className="z-10 bg-white border-b border-gray-700 dark:bg-gray-800 fixed top-0 left-0 w-full">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
        <a className="flex items-center bg" href="/">
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">zkSync查补</span>
        </a>
        <div className="items-center justify-between hidden w-full md:flex sm:w-auto" id="navbar-search">
          <div className="relative mt-3">
            <a href="https://twitter.com/Coinman_Paul" target='black'><TiSocialTwitter size="3em"/></a>
          </div>
        </div>
      </div>
      {displayModal && hasSearcheBar && (
        <div
          id="sticky-banner"
          className="fixed bottom-0 left-0 z-50 flex justify-between w-full p-4 border-b border-gray-200 bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
        >
          <div className="flex items-center mx-auto">
            <p className="flex items-center text-sm font-normal text-gray-500 dark:text-gray-400">
              <span className="inline-flex p-1 mr-3 bg-gray-200 rounded-full dark:bg-gray-600">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z"></path>
                </svg>
                <span className="sr-only">Light bulb</span>
              </span>
              <span>本工具由 <a className='text-black dark:text-white 'href="https://twitter.com/Coinman_Paul">Paul</a> 开发，有任何问题或改进可以推特留言</span>
              <span className="text-white whitespace-pre-wrap"> </span>
            </p>
          </div>
          <div className="flex items-center">
            <button
              data-dismiss-target="#sticky-banner"
              type="button"
              onClick={closeModal}
              className="flex-shrink-0 inline-flex justify-center items-center text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <svg
                aria-hidden="true"
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="sr-only">Close banner</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Header;