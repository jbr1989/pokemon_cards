document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".cardItemEffect");
    console.log(cards);

    cards.forEach((card) => {
        card.addEventListener("mousemove", (evt) => {
        mouseHoverCard(card, evt);
        });
        card.addEventListener("mouseleave", () => {
        mouseLeaveCard(card);
        });
    });
});

function mouseHoverCard(card, evt) {
    const height = card.clientHeight;
    const width = card.clientWidth;

    const { layerX, layerY } = evt;

    const yRotation = ((layerX - width / 2) / width) * -20;
    const xRotation = ((layerY - height / 2) / height) * 20;

    const string = `perspective(500px) rotateX(${xRotation}deg) rotateY(${yRotation}deg) scale(1.05)`;

    card.style.transform = string;
}

function mouseLeaveCard(card) {
    card.style.transform =
    "perspective(500px) rotateX(0deg) rotateY(0deg) scale(1)";
}