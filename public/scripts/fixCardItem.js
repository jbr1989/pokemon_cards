const imageCards = {};

function fixImageCard(image) {

    const cardId = image.dataset.id;
    imageCards[cardId] = [];

    let langs = ["en", "ja", "es"];
    const langDefault = image.dataset.lang || "";

    if (langDefault!="") langs = [langDefault, ...langs.filter(l => l !== langDefault)]; // poner el idioma actual al final para probarlo al inicio

    const u = new URL(image.src);
    // console.log("URL", u);
    const partes = u.pathname.split("/");
    // console.log("PARTES", partes);

    for (const lang of langs) {

        partes[1] = lang;

        // SETID en MAYUSCULAS
        partes[2] = partes[2].toUpperCase(); // SerieID en mayúscula

        // SetID: Antes del numero en MAYUSCULAS, despues del numero en minusculas
        const match = partes[3].match(/^([^0-9]*)(.*)$/);
        partes[3] = match[1].toUpperCase() + match[2].toLowerCase(); 

        imageCards[cardId].push(u.origin + partes.join("/"));

        // TODO EN MAYUSCULAS
        partes[2] = partes[2].toUpperCase(); // SerieID en minuscula
        partes[3] = match[1].toUpperCase() + match[2].toUpperCase(); 

        imageCards[cardId].push(u.origin + partes.join("/"));

        // TODO EN MINUSCULAS
        partes[2] = partes[2].toLowerCase(); // SerieID en minuscula
        partes[3] = match[1].toLowerCase() + match[2].toLowerCase(); 

        imageCards[cardId].push(u.origin + partes.join("/"));
    }

    // // console.log("PARTES", partes);
    // partes[2] = partes[2].toUpperCase(); // SerieID en mayúscula

    // // SetID: Antes del numero en MAYUSCULAS, despues del numero en minusculas
    // const match = partes[3].match(/^([^0-9]*)(.*)$/);
    // partes[3] = match[1].toUpperCase() + match[2].toLowerCase(); 

    // let newSrc = u.origin + partes.join("/");
    // // console.log("NEW SRC", newSrc);

    image.onerror = function() {
        changeImage(image);
    };

    changeImage(image);
    // image.src = newSrc;
}

function changeImage(image) {
    console.log("IMAGE CARDS", imageCards, image);

    const cardId = image.dataset.id;

    if (!imageCards[cardId] || imageCards[cardId].length === 0) {
        //console.log("NO IMAGE SRC TO TRY");
        image.closest(".cardItem").dataset.imageError = "true"; // marcar como error en la imagen
        return;
    }

    //console.log("TRYING IMAGE SRC", cardId, imageCards[cardId][0]);
    // Asignar el primer src alternativo disponible
    image.src = imageCards[cardId].shift();
}