// SIDEBAR 

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
    document.querySelector('#modal_container').style.visibility='visible'
    document.querySelector('body').style.overflow='hidden';
}


document.getElementById('close-modal').addEventListener('click',()=>{
    document.querySelector('#modal_container').style.visibility='hidden';
    document.querySelector('body').style.overflow='scroll';
})


document.getElementById('search-bar-input').addEventListener('focus',()=>{
    document.querySelector('main').style.opacity=0.4
})

document.querySelector('main').addEventListener('click',()=>{
    document.querySelector('main').style.opacity=1
})
