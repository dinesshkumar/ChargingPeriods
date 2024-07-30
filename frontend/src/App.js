import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { format } from 'date-fns';

const App = () => {
  document.title="Charing Periods";
  const [periods, setPeriods] = useState([]);
  const [writeError, setwriteError] = useState('');
  const [returnMessage, setReturnMessage] = useState('');
  const [reload, setReload] = useState(false); 

  const [form, setForm] = useState({
    period_code: '',
    period_label: '',
    start_date: '',
    end_date: ''
  });

  const fetchPeriods = async () => {
    // e.preventDefault();

    try {
      const response = await axios.get('http://localhost:5000/charging_periods');
      setPeriods(response.data);
    } catch (error) {
      console.error('Failed to fetch periods:', error);
    }
};

  useEffect(() => {
    fetchPeriods();    
},[reload]);


useEffect(() => {
  if (returnMessage) {
    const timer = setTimeout(() => {
      setReturnMessage('');
    }, 5000);
    return () => clearTimeout(timer);}
}, [returnMessage]);
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
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
        setReturnMessage(response.data.message);
        setwriteError('');
        setReload(!reload);
      })
      .catch(error => {
        console.error(error);
        console.error(error.response.data.error);
        setReturnMessage('');
        setwriteError(error.response.data.error);
      });
      fetchPeriods();    

  };
  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/charging_periods/${id}`)

      .then(response => {
        setReload(!reload);
      })
      .catch(error => {
        console.error(error)  ;

      });
      fetchPeriods();    

  };


  return (
    <div class="container">
      <h1>Charging Periods</h1>
      <form onSubmit={handleSubmit}>
      <div className="row mb-3">
        <div class="col-md-3">
          <label class="form-label">Period Code:</label>
          <input class="form-control" type="text" name="period_code" value={form.period_code} onChange={handleChange} required />
        </div>
        <div class="col-md-9">
          <label class="form-label">Period Label:</label>
          <input class="form-control" type="text" name="period_label" value={form.period_label} onChange={handleChange} />
        </div>
        </div>

        <div className="row mb-3">
        <div class="col-md-3">
          <label class="form-label">Start Date:</label>
          <input class="form-control" type="date" name="start_date" value={form.start_date} onChange={handleChange} required />
        </div>
        <div class="col-md-3">
          <label class="form-label">End Date:</label>
          <input class="form-control" type="date" name="end_date" value={form.end_date} onChange={handleChange} required />
        </div>
        </div>

        <button class="btn btn-primary" type="submit" >Add Charging Period</button>
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
      {/* <th scope="col">Edit</th> */}
      <th scope="col">Delete</th>

    </tr>
  </thead>
        {periods.map(period => (


           <tr key={period.id}>
             <td>{period.period_code}</td>
             <td>{period.period_label}</td>
             <td>{period.start_date}</td>
             <td>{period.end_date}</td>
             {/* <td>{format(new Date(period.start_date), 'dd-MMM-yyyy')}</td>
             <td>{format(new Date(period.end_date), 'dd-MMM-yyyy')}</td> */}
             <td>
             <button className="btn btn-link text-danger" onClick={() => handleDelete(period.id)}>
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
  <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
</svg>
             </button></td>
           </tr>

        ))}
                 </table> 

      </ul>
    </div>
  );
};

export default App;

