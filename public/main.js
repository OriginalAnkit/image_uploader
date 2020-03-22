$(
    function () {
        let form = $("form");
        let allowedFormats = ["jpg", "jpeg", "png", "gif"]
        form.submit(function (e) {
            e.preventDefault();
            let formData = $(e.target);
            let selectedFile = formData.find("input[type='file']")[0].files[0].name.split(".").pop();
            if (!allowedFormats.find(f => f == selectedFile)) {
                alert(`only ${allowedFormats} are allowed`)
                return
            }
            let data = new FormData();
            data.append("name", formData.find("input[type='text']").val())
            data.append("file", formData.find("input[type='file']")[0].files[0])
            $.ajax({
                url: '/upload/' + formData.find("select").val(),
                data: data,
                contentType: false,
                processData: false,
                type: 'POST',
                success: function (data) {
                    getFiles()
                }
            });
        })

        getFiles();

        $(document).find("select").change(
            function(){
               getFiles()
               console.log("sdf")
            }
        )

    }
)


getFiles = function () {
    $(".uploaded-sec").empty()
    $.ajax({
        url: '/getfiles/'+$(document).find("select").val(),
        type: 'GET',
        success: function ({ data }) {
            data.forEach(
                d => {
                    let tempname = d.split("/");
                    $(".uploaded-sec").append(`<div class="col-4"><img style="width:100% " src="${d}"/><h5>${tempname[tempname.length - 1]}</h5></div>`)
                }

            )
        }
    });
}