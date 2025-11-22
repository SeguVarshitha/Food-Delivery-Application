import { useState } from "react";
import { useForm, ValidationError } from "@formspree/react";
import "./Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const [state, handleSubmit] = useForm("xldpjzzq"); // replace with your Formspree ID

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  if (state.succeeded) {
    return (
      <section className="py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="contact-form p-5 shadow-sm bg-white text-center">
                <h2>
                  Thank you for your submission, We will reach out to you very
                  soon!
                </h2>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="contact-form p-5 shadow-sm bg-white">
              <h2 className="text-center mb-4">Get in Touch</h2>
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="form-control custom-input"
                      placeholder="First Name"
                      required
                    />
                    <ValidationError
                      prefix="First Name"
                      field="firstName"
                      errors={state.errors}
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="form-control custom-input"
                      placeholder="Last Name"
                      required
                    />
                    <ValidationError
                      prefix="Last Name"
                      field="lastName"
                      errors={state.errors}
                    />
                  </div>
                  <div className="col-12">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-control custom-input"
                      placeholder="Email Address"
                      required
                    />
                    <ValidationError
                      prefix="Email"
                      field="email"
                      errors={state.errors}
                    />
                  </div>
                  <div className="col-12">
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className="form-control custom-input"
                      rows="5"
                      placeholder="Your Message"
                      required
                    ></textarea>
                    <ValidationError
                      prefix="Message"
                      field="message"
                      errors={state.errors}
                    />
                  </div>
                  <div className="col-12">
                    <button
                      className="btn btn-primary w-100"
                      type="submit"
                      disabled={state.submitting}
                    >
                      {state.submitting ? "Sending..." : "Send Message"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

/*
import React from "react";
import "./Contact.css";

const Contact = () => {
  return (
    <section className="py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="contact-form p-5 shadow-sm bg-white">
              <h2 className="text-center mb-4">Get in Touch</h2>
              <form>
                <div className="row g-3">
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control custom-input"
                      placeholder="First Name"
                    />
                  </div>
                  <div className="col-md-6">
                    <input
                      type="text"
                      className="form-control custom-input"
                      placeholder="Last Name"
                    />
                  </div>
                  <div className="col-12">
                    <input
                      type="email"
                      className="form-control custom-input"
                      placeholder="Email Address"
                    />
                  </div>
                  <div className="col-12">
                    <textarea
                      className="form-control custom-input"
                      rows="5"
                      placeholder="Your Message"
                    ></textarea>
                  </div>
                  <div className="col-12">
                    <button className="btn btn-primary w-100" type="submit">
                      Send Message
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
*/
