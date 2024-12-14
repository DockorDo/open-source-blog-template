"use client";
import React from 'react'
import { AiOutlineSearch, AiOutlineAlignRight, AiOutlineAlignCenter, AiOutlineAlignLeft, AiOutlineDoubleRight, AiOutlineDoubleLeft } from "react-icons/ai";
import { textAlignMap } from './map'
import { useRequest } from 'ahooks';


interface InitialConfig {
  textAlign: 0 | 1 | 2;
};
const initialConfig: InitialConfig = {
  textAlign: 1,// 0: left, 1: center, 2: right
};

type Action =
  | { type: "changeTextAlign", textAlign: 0 | 1 | 2 }

function reducer(state: InitialConfig, action: Action) {
  switch (action.type) {
    case "changeTextAlign":
      return { ...state, textAlign: action.textAlign };
    default:
      throw new Error();
  }
}

async function fetchBaseList() {
  return fetch('/api/getCatalogue').then(res => res.json());
}

export default function SiderBarLeft() {
  const [config, dispatch] = React.useReducer(reducer, initialConfig);
  const changeTextAlign = (textAlign: 0 | 1 | 2) => dispatch({ type: 'changeTextAlign', textAlign });

  const [baseList, setBaseList] = React.useState([]);

  useRequest(fetchBaseList, {
    // manual: true，
    onSuccess: (result) => {
      setBaseList(result.list);
    }
  });

  const [isClose, setIsClose] = React.useState(false);

  return (
    <div className={
      [
        isClose ? "w-0" : "w-[fit-content]",
        'relative h-full flex flex-col '
      ].join(' ')
    }>
      <ul className={[
        isClose ? "w-0 px-0" : " md:w-[200px] w-[100vw] md:px-2 px-4 fixed right-0",
        "transition-all relative text-white h-[100%] dark:bg-blue-600/20 bg-cyan-100 dark:bg-slack-bg-dark pt-3 overflow-hidden",

      ].join(' ')}>
        <div>
          <div className='bg-white/50 m-2 mx-0 rounded flex shadow md:ml-0 ml-14 '>
            <input type="text" className="bg-transparent outline-none w-full h-8 pl-3 text-black" placeholder='Search Catalogue' />
            <button className="m-1 p-1 rounded dark:bg-white/10 bg-black/10 hover:bg-black/20  text-black/40 dark:hover:text-black dark:hover:bg-white/70  hover:text-black/60"><AiOutlineSearch /></button>
          </div>
          <div>
            <button className="cursor-pointer text-black/40 dark:text-white/60 dark:hover:text-white hover:text-black" onClick={() => { changeTextAlign([1, 2, 0][config.textAlign] as 0 | 1 | 2) }}>
              {[<AiOutlineAlignLeft />, <AiOutlineAlignCenter />, <AiOutlineAlignRight />][config.textAlign]}
            </button>
          </div>
        </div>
        {baseList.map((item, index) => (
          <li className={[
            textAlignMap[config.textAlign],
            'text-slate-600 dark:hover:text-slate-200 hover:text-black/70 w-full cursor-pointer dark:hover:bg-white/20 hover:bg-black/10 rounded py-1 text-base px-1',
          ].join(' ')} key={index}>{item}</li>
        ))}

      </ul>
      <div className={[
        isClose ? "right-[-28px] w-10 justify-end pr-2" : "right-[-16px] justify-center w-8",
        ' h-8 top-[15%] absolute z-10 dark:bg-white/20 bg-black/20 dark:hover:bg-white/40 hover:bg-black/40 text-black flex items-center rounded-full'
      ].join(' ')} onClick={() => setIsClose(!isClose)}
        title="catalogue"
      >
        {isClose ? <AiOutlineDoubleRight /> : <AiOutlineDoubleLeft />}
      </div>
    </div>
  )
}
