// function findViableSupplier(cartArray) {
//   for (let i = 0; i < cartArray.length; i++) {
//     const product = cartArray[i]._id;
//     let stockists = [];
//     for (let j = 0; j < suppliers.length; j++) {
//       const supplier = suppliers[j];
//       const productIds = supplier.products.map((p) => p._id);
//       if (productIds.includes(product)) {
//         if (!stockists) {
//           stockists = [];
//         }
//         stockists.push(supplier);
//       }
//     }
//     cartArray[i].stockists = stockists;
//     if (!stockists) {
//       cartArray[i].stockists = [];
//     }
//   }
//   setUpdatedCart(cartArray);
//   console.log('updatedCart');
//   console.log(updatedCart);
//   return cartArray;
// }

// export default findViableSupplier;