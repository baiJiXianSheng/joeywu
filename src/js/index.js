import Common from  "./common";

console.log("Author is:", Common.author);

document.getElementById("click-btn").onclick = evt => {
    alert("click!");
    document.getElementsByTagName("section")[0].style.opacity = 0.3;
}