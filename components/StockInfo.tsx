import React from "react";
import Router from "next/router";
import ReactMarkdown from "react-markdown";

export type StockInfoProps = {
  symbol: string;
  link: string;
  name: string;
  info: string;
};

const Post: React.FC<StockInfoProps> = ({ symbol, link, info, name }) => {
  return (
    <div>
      <h2>{symbol}</h2>
      <small>{link}</small>
      <h4>{name}</h4>
      <p>{info}</p>
      <style jsx>{`
        div {
          color: inherit;
          padding: 2rem;
        }
      `}</style>
    </div>
  );
};

export default Post;
