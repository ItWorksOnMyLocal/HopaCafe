import React, { useState, useEffect } from 'react';
import './App.css';
import io from 'socket.io-client';

function App() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const interval = setInterval(fetchOrders, 750); // Polling interval: 0.75 seconds

    return () => {
      clearInterval(interval);
    };
  }, []);

  const markOrderAsComplete = async (orderId) => {
    try {
      const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Completed' }),
      };
      const response = await fetch(`/api/orders/${orderId}/status`, requestOptions);
      const updatedOrder = await response.json();
      setOrders((prevOrders) =>
        prevOrders.map((order) => (order._id === updatedOrder._id ? updatedOrder : order))
      );
    } catch (error) {
      console.error(error);
    }
  };

  const markAllOrdersAsComplete = async () => {
    try {
      const updatedOrders = orders.map(async (order) => {
        const requestOptions = {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'Completed' }),
        };
        const response = await fetch(`/api/orders/${order._id}/status`, requestOptions);
        const updatedOrder = await response.json();
        return updatedOrder;
      });
  
      const completedOrders = await Promise.all(updatedOrders);
      setOrders(completedOrders);
    } catch (error) {
      console.error(error);
    }
  };

  const getTimeElapsed = (orderTime) => {
    const currentTime = new Date();
    const timeDiff = currentTime.getTime() - new Date(orderTime).getTime();

    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
    const seconds = Math.floor((timeDiff / 1000) % 60);

    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

function formatTimeElapsed(time) {
  const seconds = Math.floor((time / 1000) % 60);
  const minutes = Math.floor((time / (1000 * 60)) % 60);
  const hours = Math.floor((time / (1000 * 60 * 60)) % 24);

  return `${hours}:${minutes}:${seconds}`;
}

return (
  <div className="App">
    <h1>Outstanding Orders</h1>
    <button className="clear-all-button" onClick={markAllOrdersAsComplete}>
        All Done
    </button>
    <div className="order-container">      
      {orders
        .filter((order) => order.status === 'Pending')
        .map((order) => {
          const orderTime = new Date(order.orderTime);
          const currentTime = new Date();
          const timeElapsed = formatTimeElapsed(currentTime - orderTime);

          return (
            <div className="order-box" key={order._id}>
              <h2>{order.name}</h2>
              <p>Order: <strong>{order.coffeeType}</strong></p>
              <p>Note: <strong>{order.specialRequirements}</strong></p>
              <p>Time Elapsed: <strong>{getTimeElapsed(order.orderTime)}</strong></p>
              <button onClick={() => markOrderAsComplete(order._id)}>
                Done
              </button>
            </div>
          );
        })}
    </div>
  </div>
);
}

export default App;
