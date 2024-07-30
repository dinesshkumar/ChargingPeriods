import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { format } from 'date-fns';

const App = () => {
  const [periods, setPeriods] = useState([]);
  const [writeError, setwriteError] = useState('');
  const [returnMessage, setreturnMessage] = useState('');

  const [form, setForm] = useState({
    period_code: '',
    period_label: '',
    start_date: '',
    end_date: ''
  });

  useEffect(() => {
    axios.get('http://localhost:5000/charging_periods').then(response => {
      setPeriods(response.data);
    });
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    setreturnMessage('');
    e.preventDefault();
    axios.post('http://localhost:5000/charging_periods', form)
      .then(response => {
        setPeriods([...periods, response.data]);
        setForm({
          period_code: '',
          period_label: '',
          start_date: '',
          end_date: ''
        });
        setreturnMessage("Successfully Added."+ form.period_code +response.data.message);
      })
      .catch(error => {
        console.error(error);
        console.error(error.response.data.error);

        setwriteError(error.response.data.error);
      });
  };

  return (
    <div class="container">
      <h1>Charging Periods</h1>
      <form onSubmit={handleSubmit}>
        <div class="col-md-6">
          <label class="form-label">Period Code:</label>
          <input class="form-control" type="text" name="period_code" value={form.period_code} onChange={handleChange} required />
        </div>
        <div class="col-md-6">
          <label class="form-label">Period Label:</label>
          <input class="form-control" type="text" name="period_label" value={form.period_label} onChange={handleChange} />
        </div>
        <div>
          <label class="form-label">Start Date:</label>
          <input class="form-control" type="date" name="start_date" value={form.start_date} onChange={handleChange} required />
        </div>
        <div>
          <label class="form-label">End Date:</label>
          <input class="form-control" type="date" name="end_date" value={form.end_date} onChange={handleChange} required />
        </div>

        <button class="w-10 btn btn-primary btn-lg" type="submit">Add Charging Period</button>
        {writeError}{returnMessage}
      </form>
      <h2>Existing Charging Periods</h2>
      <ul>
      <table class="table">
      <thead>
    <tr>
      <th scope="col">Period Code</th>
      <th scope="col">Period Label</th>
      <th scope="col">Start Date</th>
      <th scope="col">End_date</th>
    </tr>
  </thead>
        {periods.map(period => (


           <tr key={period.id}>
             <td>{period.period_code}</td>
             <td>{period.period_label}</td>
             <td>{format(new Date(period.start_date), 'dd-MMM-yyyy')}</td>
             <td>{format(new Date(period.end_date), 'dd-MMM-yyyy')}</td>
           </tr>

        ))}
                 </table> 

      </ul>
    </div>
  );
};

export default App;

