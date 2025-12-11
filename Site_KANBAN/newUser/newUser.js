const regist = document.getElementById("register");
const messageElement = document.getElementById("message");

regist.addEventListener("click", () => {
    messageElement.textContent = "Seu email foi cadastrado com sucesso";
    messageElement.classList.add("show");
});