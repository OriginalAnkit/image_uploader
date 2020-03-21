$(
    function () {
        let form = $("form");
        form.submit(function (e) {
            e.preventDefault();
            let formData = $(e.target);
            let data = new FormData()
            data.append("name", formData.find("input[type='text']").val())
            // data.append("uploadType", )
            data.append("file",formData.find("input[type='file']")[0].files[0])
            $.ajax({
                url: '/upload/'+formData.find("select").val(),
                data: data,
                contentType: false,
                processData: false,
                type: 'POST',
                success: function(data){
                    getFiles()
                }
            });
        })

        getFiles()

    }
)


getFiles=function(){
    $(".uploaded-sec").empty()
    $.ajax({
        url: '/getfiles',
        type: 'GET',
        success: function({data}){
            data.forEach(
            d=>{
                let tempname=d.split("/");
                $(".uploaded-sec").append(`<div class="col-4"><img style="width:100% " src="${d}"/><h5>${tempname[tempname.length-1]}</h5></div>`)}
            
            )
        }
    });
}