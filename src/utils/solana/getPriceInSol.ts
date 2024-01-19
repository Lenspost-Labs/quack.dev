import axios from "axios";

export const getPriceInSol = async (priceInEth: number) => {
  const response = await axios.get(
    "https://price.jup.ag/v4/price?ids=ETH&vsToken=SOL"
  );
  let price = response.data?.data?.ETH?.price * priceInEth;
  price = price / 10 + price;
  price = parseFloat(price.toFixed(5));
  return price || 0;
};

export const getPriceInUSDC = async (priceInEth: number) => {
  const response = await axios.get(
    "https://price.jup.ag/v4/price?ids=ETH&vsToken=USDC"
  );
  return response.data?.data?.ETH?.price * priceInEth || 0;
};

export default getPriceInSol;
