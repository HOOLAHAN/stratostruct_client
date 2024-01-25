const ViableSupplier = ({ stockist, distance, showRouteButton }) => {
  return (
    <tr>
      <td>{stockist.name}</td>
      <td>{stockist.postcode}</td>
      <td>{distance}</td>
      <td>{showRouteButton}</td>
    </tr>
  );
};

export default ViableSupplier;
 