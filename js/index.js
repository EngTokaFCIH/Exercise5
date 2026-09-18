let registerForm = document.querySelector("form"),
    registerInputs = registerForm.querySelectorAll("input"),
    // we create this arr to collect all student objects in one place so it's easy to push it in the table just in one time 
    students = [],
    id = 0,
    // we just want to select table body not all table
    tableBody = document.querySelector("#Data tbody"),
    regexInputs = {
        'FirstName': /^(([A-Za-z]{3,})|([A-Za-z]{2}\-[A-Za-z]{3,}))$/,
        'LastName': /^(([A-Za-z]{3,})|([A-Za-z]{2}\-[A-Za-z]{3,}))$/,
        'Email': /^[A-Za-z_]?[A-Za-z_\.]+[0-9]{0,}@(gmail|yahoo)\.(com|org)$/,
        'Age': /^[1-9][0-9]$/,
        'Phone': /^(((02)?01(0|1|2|5)[0-9]{8})|(02)[0-9]{8})$/
    },
    popupEle = document.querySelector("#Popup"),
    popupBoxEle = popupEle.querySelector("#Popup .box"),
    deleteButton,
    searchInput = document.querySelector("#SearchInput"),
    isEditing = false,
    selectedButton,
    clearButton = document.querySelector(".clear"),
    resetButton = document.querySelector(".reset-icon");

if (localStorage.getItem('students') === null) {
    updateLocalStorage();
} else {
    students = JSON.parse(localStorage.getItem('students'));
    // we reinitialize id here although we initialized it up => (id = 0) ,
    // as when we reload page and then add a new student + exist students in table id will return 
    // to 0 so we want to make it increase on the last id
    id = students[students.length - 1]?.id ?? 0;
    // if students[students.length - 1] = undefined don't enter to id then if it was undefined initialize id = 0
    showStudents(students);
}


registerForm.addEventListener("submit", function (e) {
    /**we stop the work of form so we will take data from inputs to check it by myself */
    e.preventDefault();

    let invalidInput = registerForm.querySelector("input.is-invalid");
    if (invalidInput != null) {
        invalidInput.blur();
        return;
    }

    let formType = registerForm.getAttribute('data-type');

    // *to control the action of enter key
    for (let input of registerInputs) {
        if (input.value == "") {
            input.focus();
            return;
        }
        else if (input.value != "") {
            input.blur();
        }
    }

    registerInputs.forEach(function (input, index) {
        input.addEventListener("keydown", function (e) {
            if (e.key == "Enter") {
                if (registerInputs[index].value == "") {
                    registerInputs[index].focus();
                } else {
                    if (registerInputs[index + 1] && registerInputs[index + 1].value == "") {
                        e.preventDefault();
                        registerInputs[index + 1]?.focus()
                    }
                    else if (registerInputs[index + 1] && registerInputs[index + 1].value != "") {
                        emptyInput = registerForm.querySelector("input")
                        if (emptyInput.value == "") {
                            ;
                            emptyInput.focus();
                        }
                    }
                }
            }
        })
    })

    if (formType == 'add') {
        addStudent();
    } else if (formType == 'edit') {
        let studentId = registerForm.getAttribute('data-student-id'),
        trEle = tableBody.querySelector(`tr[data-student-id="${studentId}"]`);
        formBtn.onclick = function () {
            setTimeout(function () {
                if (!registerForm.querySelector(".is-invalid")) {
                    openPopUp(popupEle, studentId, trEle, 'Edit')
                };
            }, 0)
        }
    }


});



searchInput.addEventListener("keyup",function(){
    search
    (this.value)
})