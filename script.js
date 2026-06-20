const counters = document.querySelectorAll(".counter");

counters.forEach(counter => {
    const update = () => {
        const target = +counter.getAttribute("data-target");
        const current = +counter.innerText;

        const increment = target / 100;

        if(current < target){
            counter.innerText =
            Math.ceil(current + increment);

            setTimeout(update,20);
        }
        else{
            counter.innerText = target + "+";
        }
    };

    update();
});

function sendWhatsApp(){

    const name =
    document.getElementById("name").value;

    const phone =
    document.getElementById("phone").value;

    const location =
    document.getElementById("location").value;

    const rice =
    document.getElementById("rice").value;

    const quantity =
    document.getElementById("quantity").value;

    const message =
    document.getElementById("message").value;

    const text =

`🌾 Traditional Rice Vijayashri Order

Name : ${name}

Phone : ${phone}

Location : ${location}

Rice Variety : ${rice}

Quantity : ${quantity}

Additional Notes :
${message}`;

    const whatsappNumber =
    "918825668558";

    const url =
    `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;

    window.open(url, "_blank");
}