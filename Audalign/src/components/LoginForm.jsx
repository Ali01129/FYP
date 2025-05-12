import * as React from "react";
import { useNavigate } from 'react-router-dom';
import { FaLock, FaEnvelope } from 'react-icons/fa';
import LoginButton from './LoginButton';
import axios from 'axios';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import useGlobalStore from '../zustand/store';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function LoginForm() {
  const navigate = useNavigate();
  const { setLogedIn } = useGlobalStore();
  
  // State to manage login error message
  const [loginError, setLoginError] = React.useState(null);

  const loginOptions = [
    {
      provider: "google",
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/fbe8e4922b53c2edc15ae61007cbea18bbc9a6c73e883791a0e4b25726222a53?placeholderIfAbsent=true&apiKey=5c70ca3f18714fc893785ac3990400f6"
    },
    {
      provider: "Facebook",
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/9f2c0fc65d682b4217bd9b868addde01c1ed81b88a706942c71440896dce9d44?placeholderIfAbsent=true&apiKey=5c70ca3f18714fc893785ac3990400f6"
    }
  ];

  // Login function
  const loginUser = async (email, password, setErrors) => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/login', {
        email,
        password
      });

      setLoginError(null);
      setLogedIn(true);
      toast.success('Login successful!');
      navigate('/');
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setLoginError(error.response.data.error);
      } else {
        setLoginError('An unexpected error occurred. Please try again.');
      }
      setErrors({});
    }
  };

  // Yup validation schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Please enter a valid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(5, "Password must be at least 5 characters long")
      .required("Password is required")
  });

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={validationSchema}
      onSubmit={(values, { setErrors }) => {
        loginUser(values.email, values.password, setErrors);
      }}
    >
      {({ touched, errors, handleChange, handleBlur }) => (
        <Form className="flex flex-col self-center mt-3 max-w-full text-xs text-white w-[364px]">
          <div className="text-7xl self-center font-bold max-md:mr-2.5 max-md:text-4xl">
            Welcome
          </div>
          <div className="self-center mt-2 text-sm">
            We are glad to see you back with us
          </div>
          
          {/* Email Field */}
          <div className="relative mt-10">
            <label htmlFor="email" className="sr-only">Email</label>
            <div className={`flex gap-1.5 px-5 py-3.5 whitespace-nowrap rounded-xl bg-zinc-100 text-zinc-900 ${touched.email && errors.email ? 'border-2 border-red-500' : ''}`}>
              <FaEnvelope size={24} className="shrink-0 text-gray-600" />
              <Field
                type="text"
                name="email"
                className="flex-auto my-auto w-[293px] bg-transparent border-none focus:outline-none placeholder-gray-800"
                placeholder="Email"
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
            <ErrorMessage name="email" component="div" className="text-red-500 mt-1 text-xs" />
          </div>

          {/* Password Field */}
          <div className="relative mt-4">
            <label htmlFor="password" className="sr-only">Password</label>
            <div className={`flex gap-1.5 px-5 py-3.5 whitespace-nowrap rounded-xl bg-zinc-100 text-zinc-900 ${touched.password && errors.password ? 'border-2 border-red-500' : ''}`}>
              <FaLock size={24} className="shrink-0 text-gray-600" />
              <Field
                type="password"
                name="password"
                className="flex-auto my-auto w-[293px] bg-transparent border-none focus:outline-none placeholder-gray-800"
                placeholder="Password"
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
            <ErrorMessage name="password" component="div" className="text-red-500 mt-1 text-xs" />
          </div>

          {/* Display Login Error Message */}
          {loginError && <div className="text-red-500 mt-3 text-xs">{loginError}</div>}

          {/* Submit Button */}
          <button type="submit" className="px-9 py-4 mt-6 font-bold text-black whitespace-nowrap bg-lime-300 rounded-xl max-md:px-5 active:scale-95 transition-transform duration-150">
            LOGIN
          </button>

          {/* Register Link */}
          <div className="self-center mt-3 text-base">
            Don't have an Account? <button className="font-bold text-white" onClick={() => navigate('/Register')}>Register</button>
          </div>
          <div className="self-center mt-3 text-base">
            <span className="font-bold text-white">Login</span> with Others
          </div>

          {/* Login Options (e.g., Google, Facebook) */}
          {loginOptions.map((option, index) => (
            <LoginButton
              key={option.provider}
              icon={option.icon}
              provider={option.provider}
              className={index === 0 ? "mt-5" : "mt-4"}
            />
          ))}
        </Form>
      )}
    </Formik>
  );
}