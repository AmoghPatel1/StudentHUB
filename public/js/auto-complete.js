const searchList = document.getElementById("country-list");

$(function () {
    $('#search-bar-input').autocomplete({
        source: function (req, res) {
            $.ajax({
                url: 'autocomplete/',
                dataType: 'jsonp',
                type: 'GET',
                data: req,
                success: function (data) {
                    console.log(data);
                    loadData(data, searchList);
                },
                error: function (err) {
                    console.log(err.status);
                }
            });
        },
        minLength: 1
    });
});

function loadData(data, element) {
    element.innerHTML = ""
    let innerElement = "";
    if (data) {
        data.forEach((item) => {
            innerElement += `<li>${item.label}</li>`;
        });
    }
    element.innerHTML = innerElement;
    listSelect();
}

function listSelect(){
    const listElements=document.getElementById("country-list").getElementsByTagName('li');
    
    for(var i=0;i<listElements.length;i++){
        listElements[i].addEventListener('click',function(){
            document.getElementById('search-bar-input').value=this.innerText;
        });
    }
}