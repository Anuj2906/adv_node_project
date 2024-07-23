import mongoose from 'mongoose';

// Schema for customer details
const customerSchema = new mongoose.Schema({
  customer_name: {
    type: String,
    required: true
  },
  dob: {
    type: Date,
    required: true,
    validate: {// validates whether costumer's age is 15 or less
      validator: function (value) {
        // Calculates age
        const ageDiffs = Date.now() - value.getTime();
        const ageDate = new Date(ageDiffs); 
        return Math.abs(ageDate.getUTCFullYear() - 1970) > 15;
      },
      message: 'Age must be above 15'
    }
  },
  monthly_income: {
    type: Number,
    required: true
  }
});

const Customer = mongoose.model('Customer', customerSchema);

export default Customer;