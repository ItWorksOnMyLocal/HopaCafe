const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const uri = "mongodb+srv://barend:P%40%40sword123@coffee1.2zpgiw9.mongodb.net/";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
let ordersCollection;

// Connect to MongoDB and start the server
async function startServer() {
  try {
    await client.connect();
    ordersCollection = client.db('coffee1').collection('orders');
    console.log('Connected to MongoDB');

    // User client routes
    app.post('/api/orders', async (req, res) => {
      
      const order = req.body;
      // Add the orderTime property with the current timestamp
      order.orderTime = new Date().toISOString();

      try {
        const result = await ordersCollection.insertOne(order);
        res.json(result.ops[0]);
      } catch (error) {
        console.error('Failed to insert order:', error);
        res.sendStatus(500);
      }
    });

    // Barista client routes
    app.get('/api/orders', async (req, res) => {
      try {
        const orders = await ordersCollection.find({}).toArray();
        res.json(orders);
      } catch (error) {
        console.error('Failed to retrieve orders:', error);
        res.sendStatus(500);
      }
    });      

    app.put('/api/orders/:id/status', async (req, res) => {
      const id = req.params.id;
      const { status } = req.body;
      try {
        const result = await ordersCollection.updateOne(
          { _id: new ObjectId(id)  },
          { $set: { status: status } }
        );
        res.json(result);
      } catch (error) {
        console.error(`Failed to update order ${id}:`, error);
        res.sendStatus(500);
      }
    });

    app.put('/api/orders/neworder', async (req, res) => {
      const id = req.params.id;
      const { status: details } = req.body;
      try {
        const result = await ordersCollection.updateOne(
          { _id: new ObjectId(id)  },
          { $set: { status: details } }
        );
        res.json(result);
      } catch (error) {
        console.error(`Failed to update order ${id}:`, error);
        res.sendStatus(500);
      }
    });

    // Serve user client
    app.use(express.static('client/build'));

    // Serve barista client
    app.use('/barista', express.static('barista/build'));

    const port = process.env.PORT || 5000;

    app.listen(port,'0.0.0.0', () => {
      console.log(`Server started on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
}


startServer();
