const taskContainer = document.querySelector(".task-container");

const globalStore = [];
let currentEditingId = null;

console.log (taskContainer);

const generateNewCard  =  (taskData) => 

    `
    <div class="card bg-black mt-5 border border-opacity-25 custom-border-color custom-shadow" id="${taskData.id}">
    <div class="card-header border border-opacity-25 custom-border-color">
    <div class="button d-flex justify-content-end gap-2"> 

        <button type="button" class="btn btn-outline-success" onclick="editCard('${taskData.id}')"><i class="fa-solid fa-pen-to-square fa-beat-fade"></i></button>
        <button type="button" class="btn btn-outline-danger" onclick="deleteCard('${taskData.id}')"><i class="fa-regular fa-trash-can fa-beat-fade"></i></i></button>

    </div>
    </div>
    <div class="card-body">
    <h4 class="card-title texty">${taskData.tasktitle}</h4>
    <p class="card-text text-white change-black">${taskData.taskdescription}</p>
    <a href="#" class="btn custom-button">
        <i class="fa-solid fa-check-to-slot fa-beat-fade" style="color: #edeff2;"></i>
        <span class="text-white ms-2">${taskData.taskSessions}</span>
    </a>
    </div>
    </div>

    `

;


const loadInitialCardData = () => {
    //local Storage to get tasky card data
    const getCardData = localStorage.getItem("taskly");

    if (!getCardData) return;

    //convert to normal object
    const {cards} = JSON.parse(getCardData);

    //loop over those array of task object to create HTML card , inject it to DOM
    cards.map((cardObject) => {

        taskContainer.insertAdjacentHTML("beforeend" , generateNewCard(cardObject));

        //update our globalStore
        globalStore.push(cardObject);

    })

    //update 
}


// hum changes to save krne ke liye function likhe hai
// humne baad me .value add liya qki hume bhot kuch mil rha tha or .value hume exact value degi
const saveChanges = () => {
    const taskData = {
        //id : `${Date.now()}`,
        id: currentEditingId ? currentEditingId : `${Date.now()}`,
        tasktitle : document.getElementById("taskTitle").value,
        taskdescription : document.getElementById("taskDescription").value,
        taskSessions : document.getElementById("inputGroupSelect").value
    };
    console.log (taskData);



    
    if (currentEditingId) {
        //Hum  Update krege  the existing card
        const card = document.getElementById(currentEditingId);
        card.querySelector(".card-title").textContent = taskData.tasktitle;
        card.querySelector(".card-text").textContent = taskData.taskdescription;
        card.querySelector(".btn.custom-button .ms-2").textContent = taskData.taskSessions;

        const cardIndex = globalStore.findIndex((card) => card.id === currentEditingId);
        globalStore[cardIndex] = taskData;
        currentEditingId = null;
    }else {
        // NHI to nya card bnayege
        taskContainer.insertAdjacentHTML("beforeend", generateNewCard(taskData));

        // hum chahte hai card just after previous card ke baad push ho 
        // but why we are pushing it in array then in localStorage 
        // 1 because we can't directly push the object in the local storage 
        // 2 it is good to first push the updated value in the array and then push in local storage
        globalStore.push(taskData);

    }

    // localStorage.setItem( "taskly" ,globalStore); 
    localStorage.setItem("taskly" , JSON.stringify({cards : globalStore}));

};


const editCard = (id) => {
    currentEditingId = id;
    const card = globalStore.find((task) => task.id === id);
    document.getElementById("taskTitle").value = card.tasktitle;
    document.getElementById("taskDescription").value = card.taskdescription;
    document.getElementById("inputGroupSelect").value = card.taskSessions;

    const modal = new bootstrap.Modal(document.getElementById('exampleModal'));
    modal.show();
};

const deleteCard = (id) => {
    const card = document.getElementById(id);
    taskContainer.removeChild(card);

    const updatedGlobalStore = globalStore.filter((task) => task.id !== id);
    globalStore.length = 0;
    globalStore.push(...updatedGlobalStore);

    localStorage.setItem("taskly", JSON.stringify({ cards: globalStore }));
};


 // Add event listener to the button element to trigger the saveChanges function on click
document.addEventListener ("DOMContentLoaded" , function () {

    const saveChangeButton = document.getElementById("saveChange");
    saveChangeButton.addEventListener("click", saveChanges);

    const lightModeButton = document.getElementById("lightModeButton");
    const darkModeButton = document.getElementById("darkModeButton");

    lightModeButton.addEventListener("click", () => {
        document.body.classList.add("light-mode");
        // But refresh krne pr dark-mode me switch ho ja rha tha isliye local Storage me store kiye
        localStorage.setItem("mode", "light"); // Store the mode in localStorage
    });

    darkModeButton.addEventListener("click", () => {
        document.body.classList.remove("light-mode");
        localStorage.setItem("mode", "dark"); // Store the mode in localStorage
    });


    // Check if mode is stored in localStorage
    const mode = localStorage.getItem("mode");
    if (mode === "light") {
        document.body.classList.add("light-mode");
    } else {
        document.body.classList.remove("light-mode");
    }


    // loadInitialCardData();

    const dropdownItems = document.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
        item.addEventListener('click', function () {
            filterTasks(item.textContent); // Pass the session type (All, Active, Completed)
        });
    });

    // Function to filter tasks based on session type
    const filterTasks = (sessionType) => {
        const cards = document.querySelectorAll('.card'); // Get all cards

        cards.forEach(card => {
            const sessionSpan = card.querySelector('.text-white.ms-2'); // Get the session span

            // Check if the session type matches the card's session
            if (sessionType === 'All' || sessionSpan.textContent === sessionType) {
                card.style.display = 'block'; // Display the card
            } else {
                card.style.display = 'none'; // Hide the card
            }
        });
    };

    
    
})