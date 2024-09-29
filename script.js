// A növények tömbje
const plants = ['csicsoka', 'paradicsom', 'paprika', 'burgonya', 'repa'];
const sizes = ['small']; // Csak small méret engedélyezett

// Szavak a felfedéshez
const words = [
    "Drága", "Katinagyi!", "‎ ‎ ‎ Az", "univerzum", "‎ ‎ ‎ úgy", "működik,", 
    "hogy", "mindenkinek", "‎ ‎ van", "születésnapja,", "‎ ‎ ‎ ‎ ‎ ‎ ‎ és", 
    "nagyon", "boldogat", "kívánunk", "most", "neked!"
];

// Locsolókanna objektum
const locsolokanna = {
    tarhely: 10,
    element: null,
    isAtPlant: false // Nyomon követi, hogy a kanna egy növénynél van-e
};

// Csap objektum
const csap = {
    element: null,
};

// Ásó objektum
const aso = {
    element: null,
};

// Vízmennyiség megjelenítése
const waterStatus = document.getElementById('water-status');

// Sorok létrehozása
function createRow(yPosition, startIndex) {
    const row = document.createElement('div');
    row.className = 'row';
    const garden = document.querySelector('.garden');

    for (let i = 0; i < 8; i++) { // 8 növény a sorban
        const plantType = plants[(startIndex + i) % plants.length]; // Egyedi növény típus választása
        const size = 'small'; // Csak small méret

        const plantImage = document.createElement('img');
        plantImage.src = `./images/${plantType}_${size}.png`;
        plantImage.style.left = `${i * 150}px`; // vízszintes távolság növelése
        plantImage.style.top = `${yPosition}px`;
        plantImage.className = 'plant'; // Osztály hozzáadása

        // Szó létrehozása a növény alatt
        const wordElement = document.createElement('div');
        wordElement.textContent = words[(startIndex + i) % words.length]; // Szó beállítása
        wordElement.style.position = 'absolute';
        wordElement.style.left = `${i * 150}px`; // Szó pozíciója a növény alatt
        wordElement.style.top = `${yPosition + 50}px`; // Szó pozíciója a növény alatt
        wordElement.style.fontSize = '12px'; // Kisebb betűméret
        wordElement.style.color = 'aqua'; // Szöveg színe
        wordElement.style.opacity = '0'; // Teljesen átlátszó
        wordElement.style.pointerEvents = 'none'; // Ne legyen kattintható
        wordElement.style.textAlign = 'center';
        garden.appendChild(wordElement);

        // Kattintás esemény kezelése
        plantImage.addEventListener('click', () => {
            if (plantImage.src.includes('_large')) { // Ha large növényre kattintunk
                teleportAso(plantImage, wordElement);
            } else if (!locsolokanna.isAtPlant) { // Csak small növényeknél teleportál a kanna
                teleportLocsolokanna(plantImage);
            }
        });

        garden.appendChild(plantImage);
    }
}

// Két sor létrehozása összesen 16 növénnyel
createRow(50, 0); // Első sor (index 0)
createRow(400, 8); // Második sor (index 8)

// Locsolókanna létrehozása
function createLocsolokanna() {
    locsolokanna.element = document.createElement('img');
    locsolokanna.element.src = './images/locsolokanna.png';
    locsolokanna.element.className = 'kanna';
    document.querySelector('.garden').appendChild(locsolokanna.element);
}

// Csap létrehozása
function createCsap() {
    csap.element = document.createElement('img');
    csap.element.src = './images/csap.png';
    csap.element.className = 'csap';
    csap.element.style.width = '190px'; // Közvetlen szélesség beállítása
    csap.element.style.height = '240px'; // Közvetlen magasság beállítása
    document.querySelector('.garden').appendChild(csap.element);
}

// Ásó létrehozása
function createAso() {
    aso.element = document.createElement('img');
    aso.element.src = './images/aso.png';
    aso.element.className = 'aso';
    aso.element.style.position = 'absolute';
    aso.element.style.left = '40px'; // A csap alá helyezzük
    aso.element.style.top = '300px'; // Ásó magassága
    document.querySelector('.garden').appendChild(aso.element);
}

// Locsolókanna teleportálás
function teleportLocsolokanna(plantImage) {
    if (locsolokanna.tarhely > 0) { // Csak akkor teleportálunk, ha van víz
        locsolokanna.isAtPlant = true; // Kanna növénynél van
        locsolokanna.tarhely--; // Csökkentjük a vízmennyiséget
        // Kanna pozíció beállítása a növény pozíciójára
        locsolokanna.element.style.left = `${plantImage.offsetLeft}px`;
        locsolokanna.element.style.top = `${plantImage.offsetTop}px`;
        
        // Vízmennyiség frissítése
        updateWaterStatus();

        // 2 másodperces visszateleportálás
        setTimeout(() => {
            locsolokanna.element.style.left = 'calc(100% - 270px)'; // A jobb oldalról 270px-re
            locsolokanna.element.style.top = '270px'; // Eredeti top pozíció
            locsolokanna.isAtPlant = false; // Kanna visszatért
            
            // Növény méretének változtatása
            plantImage.src = plantImage.src.replace('_small', '_medium'); // Változtatás medium méretre
            
            // 1 másodperc múlva large méretűvé változtatja a növényt
            setTimeout(() => {
                plantImage.src = plantImage.src.replace('_medium', '_large'); // Változtatás large méretre
            }, 1000);

            // Csap kép cseréje
            updateCsap(); // Csap állapotának frissítése
        }, 2000);
    }
}

// Ásó teleportálás
function teleportAso(plantImage, wordElement) {
    aso.element.style.left = `${plantImage.offsetLeft}px`;
    aso.element.style.top = `${plantImage.offsetTop}px`;
    
    setTimeout(() => {
        // Növény eltüntetése
        plantImage.style.display = 'none'; // Növény eltűnt

        // Szó növelése
        wordElement.style.fontSize = '24px'; // Szó méretének növelése
        wordElement.style.opacity = '1'; // Szó láthatóvá tétele

        // Ásó visszateleportálás
        aso.element.style.left = '40px'; // Visszahelyezés a csap alá
        aso.element.style.top = '300px'; // Ásó magassága
    }, 3000); // 3000 ms (3 másodperc) múlva eltűnik
}

// Vízmennyiség frissítése
function updateWaterStatus() {
    waterStatus.textContent = `${locsolokanna.tarhely} dl / 10 dl`;
}

// Csap állapot frissítése
function updateCsap() {
    // Csap csak akkor folyik, ha a kanna nem tele
    if (!locsolokanna.isAtPlant && locsolokanna.tarhely < 10) {
        csap.element.src = './images/csap_folyik.png'; // Csap_folyik kép beállítása
    } else {
        csap.element.src = './images/csap.png'; // Visszaállítja a normál csapot
    }
}

// Locsolókanna víz feltöltése
function fillWater() {
    if (!locsolokanna.isAtPlant && locsolokanna.tarhely < 10) {
        locsolokanna.tarhely++; // 1 dl víz feltöltése
        updateWaterStatus(); // Vízmennyiség frissítése
    }
}

// Hívjuk meg a locsolókanna, csap és ásó létrehozó függvényeket
createLocsolokanna();
createCsap();
createAso(); // Ásó létrehozása

// Ellenőrizzük a csap állapotát
setInterval(updateCsap, 1000); // Frissítés 1 másodpercenként

// Vízmennyiség ellenőrzése
setInterval(fillWater, 5000); // 5 másodpercenként
