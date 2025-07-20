// LLM_NOTE: Refactored to use Vercel API proxy for secure webhook handling.

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("email-form");
  const feedback = document.getElementById("form-feedback");
  const webhookUrl = '/api/boonfay-webhook';

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    feedback.textContent = "";
    feedback.style.color = '';

    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!subject || !message) {
      feedback.textContent = "Please fill in both Subject and Message fields.";
      feedback.style.color = '#ff4d4f';
      return;
    }

    const payload = {
      type: "Email",
      Subject: subject,
      Message: message // HTML content
    };

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        feedback.textContent = `Error: ${response.status} - ${errorText}`;
        feedback.style.color = '#ff4d4f';
        return;
      }

      feedback.textContent = "Email sent successfully!";
      feedback.style.color = '#4ade80';
      form.reset();
    } catch (err) {
      feedback.textContent = `Network error: ${err.message}`;
      feedback.style.color = '#ff4d4f';
    }
  });
});
  