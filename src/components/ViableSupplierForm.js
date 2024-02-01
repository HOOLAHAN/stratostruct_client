import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import StockistCard from './StockistCard';
import { isValidPostcode } from '../functions/isValidPostcode';
// import MapComponent from "./MapComponent";
import { fetchRouteData } from "../functions/fetchRouteData";
import { validateSupplierForm } from '../functions/validateSupplierForm';

const ViableSupplierForm = ({ cart, sitePostcode, onNewSearch, updateIsNewSearch, updateHasValidPostcode, setSitePostcode, setError, setRouteData, routeData }) => {
  const { user } = useAuthContext();
  const [searching, setSearching] = useState(false);
  // const [routeData, setRouteData] = useState(null);
  // const [suppliersFetched, setSuppliersFetched] = useState(false);

  const handlePostcodeChange = (e) => {
    const newPostcode = e.target.value;
    setSitePostcode(newPostcode);
    updateHasValidPostcode(isValidPostcode(newPostcode));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (searching) {
      handleNewSearch();
      return;
    }

    const errorMessage = validateSupplierForm(user, cart, sitePostcode, updateHasValidPostcode);
    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    setError('');
    updateHasValidPostcode(true);
    setSearching(true);
    // setSuppliersFetched(true);
  }

  const handleNewSearch = () => {
    onNewSearch();
    updateIsNewSearch(true);
    setSearching(false);
    setError(null);
  }

  const handleShowRoute = async (endPostcode) => {
    const token = user.token;
    // Fetch the route data
    const fetchedRouteData = await fetchRouteData(sitePostcode, endPostcode, token);
    if (fetchedRouteData) {
      setRouteData(fetchedRouteData);
      return fetchedRouteData;
    }
    return null;
  };

  const handleRouteChange = (newRouteData) => {
    if (newRouteData) {
      setRouteData(newRouteData);
      console.log('Route data updated with handleRouteChange');
    } else {
      // TODO: handle the case where newRouteData is null or undefined
    }
  };
  
  return (
    <form className="create" onSubmit={handleSubmit} z-index={1} >
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
