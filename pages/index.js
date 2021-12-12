import Head from 'next/head';
import axios from 'axios';

const HomePage = ({ products }) => {

  return (
    <>
      <Head>
        <meta name="This is test page description" />
        <title>Shop</title>
      </Head>
      <h1>
        Hehe
        {products.map(product => (
          <div key={Math.random()}>{product.title}{product.price}</div>
        ))}
      </h1>
    </>
  );
};

export const getStaticProps = async () => {
  const { data: { data: { products } } } = await axios('http://localhost:3200/api/v1/products');
  return {
    props: { products }
  }
};

export default HomePage;