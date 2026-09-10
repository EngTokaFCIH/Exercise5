function clearAppear(){
    let clearButton = document.querySelector(".clear")
        clearButton.classList.remove("d-none")
}

function clearForm(that){
    resetForm()
    that.classList.add("d-none")
}

/**to check input if it empty or data is invalid pr data is valid ---- i call it from html*/
function checkInput(input) {
    let inputName = input.name,
    inputValue = input.value.trim(),
    //comparison operator 
    isEmpty = inputValue === "",
    errorEle = document.querySelector(`p.alert[data-error-name="${inputName}"]`),
    isInValid = !regexInputs[inputName].test(inputValue),
    errorMsg = "";
    
    input.value = input.value.trim();
    if (isEmpty) {
        errorEle.textContent = "This field is required.";
    } else if (isInValid) {
        errorEle.textContent = "Invalid Field.";
    }

    if (isEmpty || isInValid) {
        // *incorrect
        input.classList.add("is-invalid");
        errorEle.classList.remove("d-none");
        input.classList.remove("is-valid");
    } else {
        // *correct
        input.classList.remove("is-invalid");
        input.classList.add("is-valid");
        errorEle.classList.add("d-none");
    }

}


function uniqueEStudent() {
    let formType = registerForm.getAttribute('data-type');
    let emailInput = registerForm.querySelector("input[name=Email]"),
        inputName = emailInput.name,
        errorEle = document.querySelector(`p.alert[data-error-name="${inputName}"]`);
    if (formType == 'edit') {
        let studentId = Number(registerForm.getAttribute("data-student-id"));
        let studentIndex = findStudentIndex(studentId);
        if (emailInput.value == students[studentIndex][inputName]) {
            emailInput.classList.add("is-valid")
            emailInput.classList.remove("is-invalid")
            let errorEle = document.querySelector(`p.alert[data-error-name="${inputName}"]`);
            errorEle.classList.add('d-none');
            //     emailInput.focus();
            // emailInput.blur();
        } else {
            students.forEach(function (student) {
                if (student.Email === emailInput.value) {
                    emailInput.classList.add("is-invalid");
                    errorEle.classList.remove("d-none");
                    emailInput.classList.remove("is-valid");
                    errorEle.textContent = "this Email is used before";
                }
            })
        }
        console.log(emailInput.value == students[studentIndex][inputName])
    }
    else {
        students.forEach(function (student) {
            if (student.Email === emailInput.value) {
                emailInput.classList.add("is-invalid");
                errorEle.classList.remove("d-none");
                emailInput.classList.remove("is-valid");
                errorEle.textContent = "this Email is used before";
            }
        })
    }
}


function uniquePStudent() {
    let formType = registerForm.getAttribute('data-type');
    let phoneInput = registerForm.querySelector("input[name=Phone]"),
        inputName = phoneInput.name,
        errorEle = document.querySelector(`p.alert[data-error-name="${inputName}"]`);
    if (formType == 'edit') {
        let studentId = Number(registerForm.getAttribute("data-student-id"));
        let studentIndex = findStudentIndex(studentId);
        if (phoneInput.value == students[studentIndex][inputName]) {
            phoneInput.classList.add("is-valid")
            phoneInput.classList.remove("is-invalid")
            let errorEle = document.querySelector(`p.alert[data-error-name="${inputName}"]`);
            errorEle.classList.add('d-none');
        } else {
            students.forEach(function (student) {
                if (student.Phone === phoneInput.value) {
                    phoneInput.classList.add("is-invalid");
                    errorEle.classList.remove("d-none");
                    phoneInput.classList.remove("is-valid");
                    errorEle.textContent = "this Phone is used before";
                }
            })
        }
        console.log(phoneInput.value == students[studentIndex][inputName])
    }
    else {
        students.forEach(function (student) {
            if (student.Phone === phoneInput.value) {
                phoneInput.classList.add("is-invalid");
                errorEle.classList.remove("d-none");
                phoneInput.classList.remove("is-valid");
                errorEle.textContent = "this Phone is used before";
            }
        })
    }
}


/* *to get information of student from table or form */
function getStudent(id) {
    /**collect info of one student in one object */
    /*? why we don't use id as a var not parameter => as i want to increment it in submit but in edit no so we will make it dynamically */
    let newStudent = { id: id };
    //loop on all inputs and collect data into student object
    registerInputs.forEach(function (registerInput) {
        let key = registerInput.name,
            value = registerInput.value
        newStudent[key] = value
    },);
    return newStudent;
}


function addStudent() {
    /* *we write this because the last input enter to case of submit before call checkInput function and 
    *so if we enter an invalid value this will show in table*/
    // *so we want to tell the input that we stand on it right now(focus) to enter to case of blur before submit 
    // *so we can call checkInput function and check the value of input
    let focusInput = registerForm.querySelector("input:focus");
    if(focusInput){}
    /* *we use ? because focusInput.blur() give an error as when value is correct it will enter to submit 
       *but now focusInput dose not exist so blur() now refer to null */
    focusInput?.blur();

    // *if there is any input with invalid value this student won't appear in table => stop submit action
    let invalidInput = registerForm.querySelector("input.is-invalid");
    if (invalidInput != null) {
        invalidInput.blur();
        return;
    }

    /* *we need an identifier to reach the wanted student easly as when i say ninth student i can catch it => id 
       * so we will pass it as an argument to getStudent to initialize it when creating student 
      */
    let student = getStudent(++id);

    // *collect all student's in one array
    students.push(student)

    updateLocalStorage();

    // show student in table
    showStudent(student);

    isNoData(students);

    // reset form after submit
    resetForm();
}



function resetForm() {
    registerForm.reset();
    registerInputs.forEach(function (input) {
        input.classList.remove("is-valid")
        input.classList.remove("is-invalid")
        let errorEle = registerForm.querySelector(`p.alert[data-error-name="${input.name}"]`);
        errorEle.classList.add("d-none");
    })
    registerForm.setAttribute('data-type', 'add');
    formBtn = registerForm.querySelector("button")
    formBtn.innerHTML = "<i class='fa-solid fa-user-plus me-1'></i>Add";
    formBtn.classList.remove("edit-button", "text-light");
}


// now we store all students in localStorage but this not enough to appear students in table continuously so we will call showStudents
function updateLocalStorage() {
    if (students.length == 0) {
        id = 0;
    }
    localStorage.setItem("students", JSON.stringify(students));
}


function isNoData(data) {
    // we don't initialize tableAlert as a global var in index.js because innerHTML+= => 
    let tableAlert = tableBody.querySelector("#table-alert");
    if (data.length == 0) {
        tableAlert.classList.remove("d-none")
    } else {
        tableAlert.classList.add("d-none")
    }
}

// to put student from form into table
function showStudent(student) {
    tableBody.innerHTML += `<tr data-student-id="${student.id}">
                                <th >${student.id}</th>
                                <td>${student.FirstName}</td>
                                <td>${student.LastName}</td>
                                <td>${student.Email}</td>
                                <td>${student.Age}</td>
                                <td>${student.Phone}</td>
                                <td>
                                    <div class="buttons">
                                        <button class="edit btn me-3" onclick="handleEditUndo('${student.id}' , this) " ><i class='fa-solid fa-user-pen me-1'></i>Edit</button>
                                        <button class="delete btn" onclick="openPopUp(popupEle , ${student.id} , this , 'Delete')"><i class="fa-solid fa-user-minus me-1"></i>Delete</button>
                                    </div>
                                </td>
                            </tr>`
}


// loop on localStorage to appear students in table continuously
function showStudents(data) {
    tableBody.innerHTML =` <tr>
                    <td id="table-alert" colspan="7" class="table-warning text-center">
                        There are no data
                    </td>
                </tr>`
    isNoData(data);
    data.forEach(function (student) {
        showStudent(student);
    })
}

function findStudentIndex(studentId) {
    return students.findIndex((student) => student.id == studentId);
}

function deleteStudent(studentId) {
    let popupDeleteBtn = popupBoxEle.querySelector(".box .delete");
    // let deleteStudentIndex = students.findIndex(function(student){
    //     return student.id == studentId;}
    // )

    // conclude this using arrow function by delete functionWord , return , {} , ; 
    let deleteStudentIndex = findStudentIndex(studentId)

    // now i have id that i want to delete so we will delete it using splice
    students.splice(deleteStudentIndex, 1);
    updateLocalStorage()
    trEle = deleteButton.closest('tr');
    trEle.remove();
    isNoData(students);
    closePopup(popupEle);
}


function showPopupEle(id, studentId, that) {
    if (id == 'Delete') {
        deleteButton = that;
        popupBoxEle.innerHTML = `    
                    <div class="head mb-3 px-3 pt-2 d-flex align-items-center justify-content-between">
                        <p class="my-3">Delete</p>
                        <i class="fa-solid fa-xmark" onclick="closePopup(popupEle)"></i>
                    </div>
                    <div class="body mb-3 px-3">
                        <p>Are you sure?</p>
                    </div>
                    <div class=" foot px-3">
                        <div class="buttons d-flex align-items-center justify-content-end column-gap-2 ">
                            <button class="discard btn text-light" onclick="closePopup(popupEle)">Discard</button> 
                        <button class="delete btn text-light" onclick="deleteStudent(${studentId})">Yes, delete</button>
                        </div>
                    </div>`} else if (id == 'Edit') {
        popupBoxEle.innerHTML = `    
                                    <div class="head mb-3 px-3 pt-2 d-flex align-items-center justify-content-between">
                                        <p class="my-3">Edit</p>
                                        <i class="exit fa-solid fa-xmark" onclick="closePopup(popupEle)"></i>
                                    </div>
                                    <div class="body mb-3 px-3">
                                        <p>do you want to save changes?</p>
                                    </div>
                                    <div class=" foot px-3">
                                        <div class="buttons d-flex align-items-center justify-content-end column-gap-2 ">
                                            <button class="discard btn text-light" onclick="closePopup(popupEle)">Discard</button> 
                                            <button class="btn text-light" style="background-color : #6a89ce;" onclick="editStudent() ">Yes, save</button>
                                        </div>
                                    </div>`}
}


function openPopUp(popupEle, studentId, that, id) {
    showPopupEle(id, studentId, that);
    popupEle.classList.add("active");
    setTimeout(function () {
        popupEle.classList.add("show");
    }, 10);

}


function closePopup(popupEle) {
    popupExit = popupBoxEle.querySelector(".box i"),
        popupDiscardBtn = popupBoxEle.querySelector(".box .discard");
    popupBoxEle.addEventListener("click", function (e) {
        e.stopPropagation();
    });
    popupEle.classList.remove("show");
    setTimeout(function () {
        popupEle.classList.remove("active");
    }, 1000);
}

function insertStudentFromTableIntoForm(studentId, that, id) {
    let resetButton = registerForm.querySelector(".reset-icon");
    resetButton.classList.remove("d-none")
    resetButton.setAttribute("data-student-id",studentId);
    studentIndex = findStudentIndex(studentId),
        trEle = tableBody.querySelector(`tr[data-student-id="${studentId}"]`);
    resetForm();
    // .find() function search on full object but findIndex() search on index of object
    // difference between filter() and find() => the first return array of suitable object but the second return the first match that it find
    let editStudent = students.find(function (student) {
        return student.id == studentId
    })
    for (let input of registerInputs) {
        input.value = editStudent[input.name];
        input.focus();
        input.blur();
        if (input.value == students[studentIndex][input.name]) {
            input.classList.add("is-valid")
            input.classList.remove("is-invalid")
            let errorEle = document.querySelector(`p.alert[data-error-name="${input.name}"]`);
            errorEle.classList.add('d-none');
        }
    }


    formBtn = registerForm.querySelector("button");
    formBtn.innerHTML = "<i class='fa-solid fa-user-pen me-1'></i>Edit";
    formBtn.classList.remove("btn-success");
    formBtn.classList.add("edit-button", "text-light");
    registerForm.setAttribute('data-type', 'edit')
    registerForm.setAttribute('data-student-id', studentId)
}

function enableButtons(){
    tableBody.querySelectorAll(".edit, .delete").forEach(function (button) {
            button.classList.remove("disabled")})
}


function disableButtons(){
    tableBody.querySelectorAll(".edit, .delete").forEach(function (button) {
        button.classList.add("disabled")
    })
}

function editStudent() {
    let invalidInput = registerForm.querySelector("input.is-invalid");
    if (invalidInput != null) {
        invalidInput.blur();
        return;
    }
    let studentId = registerForm.dataset.studentId,
        student = getStudent(studentId),
        studentIndex = findStudentIndex(studentId),
        trEle = tableBody.querySelector(`tr[data-student-id="${studentId}"]`),
        isChanged = false;
    for (let key in students[studentIndex]) {
        if (students[studentIndex][key] != student[key]) {
            isChanged = false;
            break;
        } else {
            isChanged = true;
        }
    }
    if (isChanged) {
        confirm("data doesn't changed");
        closePopup(popupEle);
        return;
    }
    students[studentIndex] = student;
    trEle.innerHTML = ` <th>${student.id}</th>
                        <td>${student.FirstName}</td>
                        <td>${student.LastName}</td>
                        <td>${student.Email}</td>
                        <td>${student.Age}</td>
                        <td>${student.Phone}</td>
                        <td>
                            <div class="buttons">
                                <button class="edit btn me-3" onclick="handleEditUndo('${student.id}' , this)" ><i class='fa-solid fa-user-pen me-1'></i>Edit</button>
                                <button class="delete btn" onclick="openPopUp(popupEle , ${student.id} , this , 'Delete')"><i class="fa-solid fa-user-minus me-1"></i>Delete</button>
                            </div>
                        </td>
`
    trEle.classList.add("table-success")
    setTimeout(function(){
        trEle.classList.remove("table-success")
    },3000)
    updateLocalStorage();
    resetForm();
    enableButtons();
    closePopup(popupEle)
}


function handleEditUndo(studentId, that) {
    let selectedButton = that;
    if (selectedButton.classList.contains("edit")) {
        insertStudentFromTableIntoForm(studentId, that, 'Edit');
        selectedButton.classList.remove("edit");
        selectedButton.classList.add("undo");
        selectedButton.textContent = "Undo"
        disableButtons();
    } else if (that.classList.contains("undo")){
        let resetButton = registerForm.querySelector(".reset-icon");
        resetButton.classList.add("d-none")
        selectedButton.classList.add("edit");
        selectedButton.classList.remove("undo");
        selectedButton.innerHTML = "<i class='fa-solid fa-user-pen me-1'></i>Edit"
        enableButtons();
        resetForm();
    }}


function reset(that){
   let studentId = that.getAttribute("data-student-id")
   selectedButton = tableBody.querySelector("button.undo")
   handleEditUndo(studentId , selectedButton)
}    
    
function search(searchValue){
    let filteredStudents = students.filter(function(student){
        if(searchValue == ""){
            return [];
        }
        return student.FirstName.toLowerCase().includes(searchValue.toLowerCase()) ||
         student.LastName.toLowerCase().includes(searchValue.toLowerCase()) ||
         student.Email.toLowerCase().includes(searchValue.toLowerCase())||
         student.Phone.toLowerCase().includes(searchValue.toLowerCase())
    })
    showStudents(filteredStudents)
    isNoData(filteredStudents)
    console.log(filteredStudents)
}
