import React, { useState } from "react";
import { FaEnvelope } from "react-icons/fa";

function CustomForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && email.indexOf("@") > -1) {
      setStatus("success");
      setEmail("");
    } else {
      setStatus("error");
    }
  };

  return (
    <>
      <form action="#" className="py-6" onSubmit={handleSubmit}>
        <fieldset className="relative">
          <input
            className="newsletter-input form-input h-12 w-full rounded-3xl border-none bg-theme-light px-5 py-3 pr-12 text-dark placeholder:text-xs dark:bg-darkmode-theme-dark"
            type="text"
            placeholder="Type And Hit Enter"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FaEnvelope className="absolute top-1/2 right-5 -translate-y-1/2 text-xl transition duration-75" />
        </fieldset>
        <button className="d-block btn btn-primary mt-4 w-full" type="submit">
          Sign In
        </button>
      </form>
      {status === "error" && (
        <div className="mt-4 text-red-700">Please enter a valid email</div>
      )}
      {status === "success" && (
        <div className="mt-4 text-green-700">Subscribed!</div>
      )}
    </>
  );
}

export default CustomForm;