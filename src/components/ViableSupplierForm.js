import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import StockistCard from './StockistCard';
import { isValidPostcode } from '../functions/isValidPostcode';
import MapComponent from "./MapComponent";
import { fetchRouteData } from "../functions/fetchRouteData";

const ViableSupplierForm = ({ cart, sitePostcode, onNewSearch, updateIsNewSearch, updateHasValidPostcode, setSitePostcode, setError }) => {
  const { user } = useAuthContext();
  const [searching, setSearching] = useState(false);
  const [routeData, setRouteData] = useState(null);
  const [suppliersFetched, setSuppliersFetched] = useState(false);

  const handlePostcodeChange = (e) => {
    const newPostcode = e.target.value;
    setSitePostcode(newPostcode);
    updateHasValidPostcode(isValidPostcode(newPostcode));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (searching) {
      // Handle "New Search" button click
      onNewSearch();
      updateIsNewSearch(true);
      // setSitePostcode('');
      setSearching(false);
      setError(null);
      return;
    }

    if (!user) {
      setError('You must be logged in');
      return;
    }

    if (cart.length === 0) {
      setError('Please select at least one product.');
      return;
    }

    if (sitePostcode === '') {
      setError('Please input a postcode.');
      return;
    }

    if (!isValidPostcode(sitePostcode)) {
      setError('Invalid postcode');
      updateHasValidPostcode(false);
      return;
    }

    setError('');
    updateHasValidPostcode(true);
    setSearching(true);
    setSuppliersFetched(true);
  }

  const handleShowRoute = async (endPostcode) => {
    const token = user.token
    const routeData = await fetchRouteData(sitePostcode, endPostcode, token);
    if (routeData) {
      setRouteData(routeData);
    }
  };

  const handleRouteChange = (newRouteData) => {
    setRouteData(newRouteData);
  };

  console.log('routeData in ViableSupplierForm', routeData)

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h1>Check for suppliers:</h1>
      <h2>Step 1 - Enter your postcode:</h2>
      <div className="input-button-container">
        <input
          type="text"
          id="postcode"
          onChange={handlePostcodeChange}
          value={sitePostcode}
          placeholder="e.g. SE10 8XJ"
        />
        <center>
          <button type="submit">
            {searching ? 'New Search' : 'Find Suppliers'}
          </button>
        </center>
      </div>
      {
      suppliersFetched && (
        <MapComponent
          sitePostcode={sitePostcode}
          token={user.token}
          routeData={routeData}
        />
      )}
      {searching && cart.length > 0 &&
        <div className="search-results-container">
          <h3>Suppliers:</h3>
          {cart.map((product, index) => {
            console.log("Passing routeData to StockistCard:", routeData);
            return (
              <StockistCard
                key={product._id + (routeData ? '_routeLoaded' : '')}
                product={product}
                index={index + 1}
                sitePostcode={sitePostcode}
                handleShowRoute={handleShowRoute}
                routeData={routeData}
                token={user.token}
                handleRouteChange={handleRouteChange}
              />
            );
          })}
        </div>
      }

    </form>
  );
};

export default ViableSupplierForm;
