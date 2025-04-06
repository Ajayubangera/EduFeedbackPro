
document.addEventListener("DOMContentLoaded", loadMessageDetails);

function loadMessageDetails() {
  const messageData = JSON.parse(localStorage.getItem("replyMessage"));

  document.getElementById("messageSender").textContent = messageData.name;
  document.getElementById("messageEmail").textContent = messageData.email;
  document.getElementById("messageText").textContent = messageData.message;
}

async function sendReply() {
  const replyText = document.getElementById("replyMessage").value;
  const messageData = JSON.parse(localStorage.getItem("replyMessage"));

  if (!replyText) {
    alert("Reply cannot be empty!");
    return;
  }

  await fetch("http://localhost:3000/send-reply", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: messageData.email,
      reply: replyText
    })
  });

  alert("Reply sent successfully!");
  window.location.href = "inbox.html";
}

function goBack() {
  window.history.back();
}
