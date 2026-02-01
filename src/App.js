import { useEffect, useState } from "react";
import { registerForPush } from "./push";

const API = process.env.REACT_APP_API_BASE_URL;

function App() {
  const [form, setForm] = useState({
    name: "", email: "", dob: "", phone: ""
  });

  useEffect(() => {
    registerForPush().then(sub => {
      if (!sub) return;
      fetch(`${API}/api/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub)
      });
    });
  }, []);

  const submit = async e => {
    e.preventDefault();
    await fetch(`${API}/api/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    alert("Submitted");
  };

  return (
    <form onSubmit={submit}>
      <input placeholder="Name" onChange={e => setForm({...form, name:e.target.value})} />
      <input placeholder="Email" onChange={e => setForm({...form, email:e.target.value})} />
      <input type="date" onChange={e => setForm({...form, dob:e.target.value})} />
      <input placeholder="Phone" onChange={e => setForm({...form, phone:e.target.value})} />
      <button>Submit</button>
    </form>
  );
}

export default App;
