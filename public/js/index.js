// SIDEBAR 

const menuItems=document.querySelectorAll('.menu-item');

// To remove active class from menu items
const changeActiveItem = () => {
    menuItems.forEach(item => {
        item.classList.remove('active');
    })
}

menuItems.forEach(item => {
    item.addEventListener('click',()=>{
        changeActiveItem();
        item.classList.add('active');
        if(item.id!='notifications'){
            document.querySelector('.notification-popup').style.display='none';
        }
        else{
            document.querySelector('.notification-popup').style.display='block';
            document.querySelector('#notifications .notification-count').style.display='none';   
        }
    })
})


document.getElementById('create-issue-side-bar').addEventListener('click',()=>{
    openModal();
});

document.getElementById('create-issue-nav-bar').addEventListener('click',()=>{
    openModal();
});

document.getElementById('profile-photo-nav').addEventListener('click',()=>{
    console.log('Profile photo clicked');
    if(document.getElementById('profile-menu').classList.contains('hidden-popup')){
        document.getElementById('profile-menu').classList.remove('hidden-popup');
    }
    else{
        document.getElementById('profile-menu').classList.add('hidden-popup');
    }
})

const openModal=()=>{
    console.log('create-modal');
    console.log(document.getElementById('modal_container'));
    document.getElementById('modal_container').classList.remove('modal-close');
    document.querySelector('body').style.overflow='hidden';
}


document.getElementById('close-modal').addEventListener('click',()=>{
    document.getElementById('modal_container').classList.add('modal-close');
    document.querySelector('body').style.overflow='scroll';
})

document.getElementById('search-bar-input').addEventListener('focus',()=>{
    document.querySelector('main').style.opacity=0.4
})

document.querySelector('main').addEventListener('click',()=>{
    document.querySelector('main').style.opacity=1;
    document.querySelector("#country-list").innerHTML=""
})


// MODAL 

const wrapper = document.querySelector(".wrapper");
// const fileName = document.querySelector(".file-name");
const defaultBtn = document.querySelector("#default-btn");
const customBtn = document.querySelector("#add_file_button");
// const cancelBtn = document.querySelector("#cancel-btn i");
const img = document.querySelector("#display-post-image");
let regExp = /[0-9a-zA-Z\^\&\'\@\{\}\[\]\,\$\=\!\-\#\(\)\.\%\+\~\_ ]+$/;

function defaultBtnActive() {
    defaultBtn.click();
}
defaultBtn.addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function () {
            const result = reader.result;
            img.src = result;
            img.style.visibility = "visible";
            wrapper.classList.add("active");
        }
        // cancelBtn.addEventListener("click", function () {
        //     img.src = "";
        //     wrapper.classList.remove("active");
        // })
        reader.readAsDataURL(file);
    }
});


