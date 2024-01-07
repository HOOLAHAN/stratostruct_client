const ViableSupplier = ({ stockist, distance, error }) => {

  return (
    <tr>
      <td style={{textAlign: 'left'}}>{stockist.name}</td>
      <td style={{textAlign: 'left'}}>{stockist.postcode}</td>
      <td style={{textAlign: 'left'}}>{error ? 'Error' : `${distance}`}</td>
      <td>
      </td>
    </tr>
  );
}

export default ViableSupplier;
