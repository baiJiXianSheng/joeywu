// import Common from  "./common";

// console.log("Author is:", Common.author);

document.getElementById("click-btn").onclick = evt => {
    alert("click!");
    document.getElementsByTagName("section")[0].style.background = "deepskyblue";
}

var age = 20,
    sex = "male",
    str = `age:${age} male:${sex}`;