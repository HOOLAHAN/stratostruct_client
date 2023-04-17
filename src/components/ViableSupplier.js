import React from 'react';

const ViableSupplier = ({ stockist, distance, error }) => {
  return (
    <tr>
    <td style={{textAlign: 'left'}}>{stockist.name}</td>
    <td style={{textAlign: 'left'}}>{stockist.postcode}</td>
    <td style={{textAlign: 'left'}}>{error ? 'Error' : `${distance}`}</td>
    </tr>
  )
}

export default ViableSupplier;