import { useState } from "react";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div style={{ padding: 24, maxWidth: 700, margin: "0 auto" }}>
      <h1>Contact Us</h1>
      <p style={{ color: "#4f5687" }}>
        Share your query and our team will reach out.
      </p>

      {submitted ? (
        <div style={{ marginTop: 16, color: "#2d8a5b" }}>
          Message submitted successfully.
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
          style={{ display: "grid", gap: 10, marginTop: 16 }}
        >
          <input required placeholder="Your name" />
          <input required type="email" placeholder="Your email" />
          <textarea required placeholder="Your message" rows={5} />
          <button type="submit">Send Message</button>
        </form>
      )}
    </div>
  );
}
