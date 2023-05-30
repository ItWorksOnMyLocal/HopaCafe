import React, { useState, useEffect } from 'react';
import './Order.css';

const SESSION_STORAGE_KEY = 'order_names';

async function submitOrder(order) {
  const orderWithStatus = { ...order, status: "Pending" };
  const response = await fetch('/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderWithStatus),
  });
  if (!response.ok) {
    throw new Error('Failed to submit order');
  }
  const data = await response.json();
  return data;
}

function Order() {
  const [name, setName] = useState('');
  const [coffeeType, setCoffeeType] = useState('');
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [cachedNames, setCachedNames] = useState([]);

  useEffect(() => {
    // Retrieve cached names from sessionStorage
    const cachedNamesJSON = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (cachedNamesJSON) {
      setCachedNames(JSON.parse(cachedNamesJSON));
    }
  }, []);

  useEffect(() => {
    // Update cached names in sessionStorage
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(cachedNames));
  }, [cachedNames]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!name) {
      setError('Please enter a name');
      return;
    }
    const order = { name, coffeeType, specialRequirements };
    try {
      const data = await submitOrder(order);
      setSuccess('Order submitted successfully');      
      console.log('Order submitted:', data);
    } catch (error) {
      // setError('Failed to submit order');
      console.error('Failed to submit order:', error);
    }
    setError('')
    setName('');
    setCoffeeType('');
    setSpecialRequirements('');
    if (!cachedNames.includes(name)) {
      setCachedNames([...cachedNames, name]);
    }
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleCoffeeTypeChange = (event) => {
    setCoffeeType(event.target.value);
  };

  const handleSpecialRequirementsChange = (event) => {
    setSpecialRequirements(event.target.value);
  };

//   return (
//     <div className="order-container">
//       <form className="order-form" onSubmit={handleSubmit} style={{ backgroundImage: `url('/images/coffePhoto.png')` }}>
//         <label>
//           Name:
//           <input type="text" className="input-field" value={name} onChange={handleNameChange} />
//         </label>
//         <br />

//         <label>
//           Coffee Type:
//           <select className="input-field" value={coffeeType} onChange={handleCoffeeTypeChange}>
//             <option value="Usual">Usual</option>
//             <option value="Cappucino">Cappucino</option>
//             <option value="Latte">Latte</option>
//             <option value="KG">KG</option>
//             <option value="Cortado">Cortado</option>
//             <option value="Flat White">Flat White</option>
//             <option value="Americano">Americano</option>
//             <option value="Macchiato">Flat White</option>
//             <option value="Americano">Americano</option>
//             <option value="Mocha">Americano</option>
//             <option value="Piccolo">Piccolo</option>
//             <option value="Espresso">Espresso</option>
//             <option value="EspressoX2">Espresso</option>
//             <option value="Tea">Tea</option>
//             <option value="Red Cappucino">Red Cappucino</option>
//             <option value="Ice Coffee">Ice Coffee</option>
//           </select>
//         </label>
//         <br />

//         <label>
//           Special Requirements:
//           <textarea className="input-field" value={specialRequirements} onChange={handleSpecialRequirementsChange} />
//         </label>

//         <br />
//         <button type="submit" className="submit-button">Place Order</button>
//       </form>

//       {error && <p className="error-message">{error}</p>}
//       {success && <p className="success-message">{success}</p>}

//       <div className="cached-names-container">
//         <h3>Cached Names:</h3>
//         <ul>
//           {cachedNames.map((cachedName) => (
//             <li key={cachedName}>{cachedName}</li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }

// export default Order;

return (
  <div className="order-container">
    <form className="order-form" onSubmit={handleSubmit} style={{ backgroundImage: `url('/images/coffePhoto.png')` }}>
      <label>
        Name:
        <input type="text" className="input-field" value={name} onChange={handleNameChange} list="nameList" />
        <datalist id="nameList">
          {cachedNames.map((cachedName) => (
            <option key={cachedName} value={cachedName} />
          ))}
        </datalist>
      </label>
      <br />
      <label>
        Coffee Type:
        <select className="input-field" value={coffeeType} onChange={handleCoffeeTypeChange}>
          <option value="Usual">Usual</option>
          <option value="Cappucino">Cappucino</option>
  //      <option value="Latte">Latte</option>
  //      <option value="KG">KG</option>
  //      <option value="Cortado">Cortado</option>
  //      <option value="Flat White">Flat White</option>
  //      <option value="Americano">Americano</option>
  //      <option value="Macchiato">Flat White</option>
  //      <option value="Americano">Americano</option>
//        <option value="Mocha">Americano</option>
//        <option value="Piccolo">Piccolo</option>
//        <option value="Espresso">Espresso</option>
//        <option value="EspressoX2">Espresso</option>
//        <option value="Tea">Tea</option>
//        <option value="Red Cappucino">Red Cappucino</option>
//        <option value="Ice Coffee">Ice Coffee</option>
        </select>
      </label>
      <br />
      <label>
        Special Requirements:
        <textarea className="input-field" value={specialRequirements} onChange={handleSpecialRequirementsChange} />
      </label>
      <br />
      <button type="submit" className="submit-button">Place Order</button>
    </form>
    {error && <p className="error-message">{error}</p>}
    {success && <p className="success-message">{success}</p>}
  </div>
);
}

export default Order;