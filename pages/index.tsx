import React, { useState } from "react"
import { GetStaticProps } from "next"
import Layout from "../components/Layout"
import Post, { PostProps } from "components/Post"
import prisma from 'lib/prisma'
import { signOut, useSession } from 'next-auth/react';
import useSWR from "swr"
import { DailyResponse } from "alphavantage-wrapper-ts/dist/stock-time-series"
import { DailyWindow } from "components/DailyWindow"
import { getStockInfo, getStockSymbols } from "utils/stocks"


export const getStaticProps: GetStaticProps = async () => {
  const feed = await prisma.post.findMany({
    where: { published: true },
    include: {
      author: {
        select: { name: true },
      },
    },
  });
  return {
    props: { feed },
    revalidate: 10,
  };
};

type Props = {
  feed: PostProps[]
}

const Blog: React.FC<Props> = (props) => {
  const { data: session, status } = useSession();
  const feedName = session ? session.user?.name ?? session.user?.email : 'Public';
  const [displayedData, setDisplayedata] = useState<DailyResponse | null>(null);

  const fetchFunction = async () => {
    const getUrl = `/api/stock/AAPL`

    const apiResponse = await fetch(getUrl).catch(error => console.log('error in api', error));
    if (apiResponse) {
      const output = await apiResponse.json();
      setDisplayedata(output);
      console.log(output);
    }
  }
  const stockList = getStockSymbols();
  const stockInfo = getStockInfo();
  console.log(stockList);
  console.log(stockInfo);
  const handleClick = () => {
    fetchFunction();
  }
  console.log(displayedData);
  return (
    <Layout>
      <div className="page">
        <h1>{`${feedName} Feed`}</h1>
        <button onClick={handleClick}>Go fetch</button>
        {displayedData ? <DailyWindow stockData={displayedData} symbol={ displayedData.metadata.symbol} /> : null}
        <main>
          {props.feed.map((post) => (
            <div key={post.id} className="post">
              <Post post={post} />
            </div>
          ))}
        </main>
      </div>
      <style jsx>{`
        .post {
          background: white;
          transition: box-shadow 0.1s ease-in;
        }

        .post:hover {
          box-shadow: 1px 1px 3px #aaa;
        }

        .post + .post {
          margin-top: 2rem;
        }
      `}</style>
    </Layout>
  )
}

export default Blog
