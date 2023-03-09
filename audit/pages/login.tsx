import { useState,useEffect } from 'react';
import PocketBase from 'pocketbase';
import { useRouter } from 'next/router';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const pb = new PocketBase('https://3c18-45-136-254-11.ap.ngrok.io');

  useEffect(() => {
    if (pb.authStore.isValid) {
      router.push('/dashboard');
    }
  }, []);

  const handleSubmit = async (event:any) => {
    event.preventDefault();

    try {
      const authData = await pb.collection('users').authWithPassword(email, password);
      console.log(authData);
      // redirect to the dashboard page or do something else
      if(pb.authStore.isValid && pb.authStore.token){
        router.push('/dashboard');
      }else{
        setError("Invalid credentials");
      }
    } catch (error) {
      console.error(error);
      // display an error message to the user
    }
  };
    
  return(
   <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="text"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="error">{error}</div>}
        <button type="submit">Login</button>
      </form>
    </div>

  )
}
