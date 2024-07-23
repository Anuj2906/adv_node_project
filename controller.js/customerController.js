import Customer from '../models/Customer.js';
import User from '../models/User.js';

//Controller to save customer data
export const createCustomer = async (req, res) => {
    try {
        const customerData = req.body;

        const customer = new Customer(customerData);

        await customer.save();

        res.status(201).send(customer);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

// Controller to save user info
export const saveUserInfo = async (req, res) => {
    try {
        const userData = req.body;
        console.log(req.body);
        const user = new User(userData);

        await user.save();

        res.status(201).send(user)
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
}

// Controller to get all users
export const getAllUsers = async (req, res) => {
    try {
      const users = await User.find({});
      res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching users', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Controller to get aggregated result
export const getAggregatedResult = async (req, res) => {
    try {
      const customers = await Customer.aggregate([
        {
          $match: {
            dob: { $gt: new Date('2000-01-01') }
          }
        },
        {
          $addFields: {
            annual_income: { $multiply: ["$monthly_income", 12] }
          }
        },
        {
          $project: {
            customer_name: 1,
            annual_income: 1
          }
        }
      ]);
  
      res.status(200).json(customers);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };