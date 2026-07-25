// console.log("start");

// setTimeout(function cb(){
//     console.log("Callback");
// }, 5000 );

// console.log("End");

console.log("start");
var count =0;
document.getElementById("btu");
addEventListener("click", function cb(){
    console.log("Callback", ++count);
});

console.log("End");