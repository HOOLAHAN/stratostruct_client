import { getStockists } from "./getStockists";
import { calculateDistance } from "./calculateDistance";

export const handleAddToCart = async (product, cart, user, sitePostcode, setCart) => {
  if (!cart.find((item) => item._id === product._id)) {
    const stockists = await getStockists(product, user);
    const stockistsWithDistances = await Promise.all(stockists.map(async (stockist) => {
      try {
        const distance = await calculateDistance(sitePostcode, stockist.postcode, user.token);
        return { ...stockist, distance };
      } catch (error) {
        console.error("Error fetching distance:", error.message);
        return { ...stockist, distance: "N/A" };
      }
    }));

    const updatedProduct = { ...product, stockists: stockistsWithDistances };
    setCart((prevCart) => [...prevCart, updatedProduct]);
  }
};
