import * as React from "react";
import { FaLock, FaEnvelope, FaUser, FaUnlock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import useGlobalStore from '../zustand/store';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RegisterForm() {
  const { setLogedIn } = useGlobalStore();
  const navigate = useNavigate();
  
  // State to manage registration error message
  const [registerError, setRegisterError] = React.useState(null);

  // Register function
  const registerUser = async (email, username, password) => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/signup', {
        username,
        email,
        password,
        confirm_password: password
      });

      setRegisterError(null);
      // setLogedIn(true);
      toast.success('Registration successful! Please login.');
      navigate('/Auth');
      
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setRegisterError(error.response.data.error);
      } else {
        setRegisterError('Error: Could not register. Please try again.');
      }
    }
  };

  // Yup validation schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Please enter a valid email address")
      .required("Email is required"),
    username: Yup.string()
      .min(3, "Username must be at least 3 characters long")
      .required("Username is required"),
    password: Yup.string()
      .min(5, "Password must be at least 5 characters long")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], "Passwords must match")
      .required("Confirm password is required")
  });

  return (
    <Formik
      initialValues={{ email: "", username: "", password: "", confirmPassword: "" }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        registerUser(values.email, values.username, values.password);
      }}
    >
      {({ touched, errors, handleChange, handleBlur }) => (
        <Form className="flex flex-col self-center mt-3 max-w-full text-xs text-white w-[364px]">
          <div className="text-7xl self-center font-bold max-md:mr-2.5 max-md:text-4xl">
            Welcome
          </div>
          <div className="self-center mt-2 text-sm">
            Join to see wonders
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

          {/* Username Field */}
          <div className="relative mt-4">
            <label htmlFor="username" className="sr-only">Username</label>
            <div className={`flex gap-1.5 px-5 py-3.5 whitespace-nowrap rounded-xl bg-zinc-100 text-zinc-900 ${touched.username && errors.username ? 'border-2 border-red-500' : ''}`}>
              <FaUser size={24} className="shrink-0 text-gray-600" />
              <Field
                type="text"
                name="username"
                className="flex-auto my-auto w-[293px] bg-transparent border-none focus:outline-none placeholder-gray-800"
                placeholder="Username"
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
            <ErrorMessage name="username" component="div" className="text-red-500 mt-1 text-xs" />
          </div>

          {/* Password Field */}
          <div className="relative mt-4">
            <label htmlFor="password" className="sr-only">Password</label>
            <div className={`flex gap-1.5 px-5 py-3.5 whitespace-nowrap rounded-xl bg-zinc-100 text-zinc-900 ${touched.password && errors.password ? 'border-2 border-red-500' : ''}`}>
              <FaUnlock size={24} className="shrink-0 text-gray-600" />
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

          {/* Confirm Password Field */}
          <div className="relative mt-4">
            <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
            <div className={`flex gap-1.5 px-5 py-3.5 whitespace-nowrap rounded-xl bg-zinc-100 text-zinc-900 ${touched.confirmPassword && errors.confirmPassword ? 'border-2 border-red-500' : ''}`}>
              <FaLock size={24} className="shrink-0 text-gray-600" />
              <Field
                type="password"
                name="confirmPassword"
                className="flex-auto my-auto w-[293px] bg-transparent border-none focus:outline-none placeholder-gray-800"
                placeholder="Confirm Password"
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
            <ErrorMessage name="confirmPassword" component="div" className="text-red-500 mt-1 text-xs" />
          </div>

          {/* Display Registration Error Message */}
          {registerError && <div className="text-red-500 mt-3 text-xs">{registerError}</div>}

          {/* Submit Button */}
          <button type="submit" className="px-9 py-4 mt-6 font-bold text-black whitespace-nowrap bg-lime-300 rounded-xl max-md:px-5 active:scale-95 transition-transform duration-150">
            Register
          </button>

          {/* Login Link */}
          <div className="self-center mt-3 text-base">
            Already have an Account? <button className="font-bold text-white" onClick={() => { navigate('/Auth'); }}>Login</button>
          </div>
        </Form>
      )}
    </Formik>
  );
}