$(document).ready(function() {
    $("#btn_search").click(function() {
    var movie_btn = $("input[name='movie_person']:checked").val();
        console.log(movie_btn);
        var validate = Validate();
        $("#message").html(validate);
        console.log(validate)
        if (validate.length == 0 && movie_btn == "movie") {
            CallAPI();
        } else if (validate.length == 0 && movie_btn == "person"){
            CallAPI2();
        }

    });
    function CallAPI() {
        $.ajax({
            url: "https://api.themoviedb.org/3/search/movie?api_key=dc662b7f1d2f741b834a79e3ebf185e5&query=" + $("#search").val()+"&primary_release_year="+$("#yearInput").val(),
            dataType: "json",
            success: function(result) {
                var resulthtml = $("<div class=\"resultDiv\"> <p>Movies</p>");
                for (let i = 0; i < result["results"].length; i++) {
                    var image = result["results"][i]["poster_path"] == null ? "img/no-image.png" : "https://image.tmdb.org/t/p/w500/" + result["results"][i]["poster_path"];
                    var date = result["results"][i]["release_date"] == null ? "Unknown" : result["results"][i]["release_date"].substr(0,4);

                    resulthtml.append("<div class=\"result\"resourceId=\""+ result["results"][i]["id"]+"\">"
                    +"<img src=\""+image+"\"/>"
                    + "<p><a>" + result["results"][i]["title"] + " " + result["results"][i]["original_language"] + "</a></p>"
                    + "<p><a>" + date + "</a></p></div>");
                }

                $("#message").html(resulthtml);
            },
        });
    }

    
    $("#message").on("click", ".result", function () {
        var resourceId = $(this).attr("resourceId");
        if($("input[name='movie_person']:checked").val() == "movie"){
        $.ajax({
            url: "https://api.themoviedb.org/3/movie/" + resourceId +"?"+ "api_key=dc662b7f1d2f741b834a79e3ebf185e5&append_to_response=credits",
        
            dataType: 'json',
            success: function (result) {
                $("#modalTitleH4").html(result["title"]);
                
                var date = result["release_date"] == null ? "Unknown" : result["release_date"].substr(0,4);
                var language = result["spoken_languages"] == null ? "No information available" : result["spoken_languages"][0]["name"];
                var runtime = result["runtime"] == null ? "" : "RunTime: " + result["runtime"];
                var overview = result["overview"] == null ? "Not available" : result["overview"];

                var resulthtml = "<p>Release Year: " + date + "</p><p>" + "Language: " + language + "</p>";
                resulthtml += "<p>" + runtime + "</p>" + "<p>" + overview + "</p>" + "<p>" + "Hompage: <a href="+result["homepage"]+">" + result["homepage"]+ "</a></p><p>Genre: </p>";

            for (let i = 0; i < result["genres"].length; i++) {
                resulthtml += "<ul><li>" + result["genres"][i]["name"]+"</li></ul>";             
            }

            resulthtml += "<p>Production Companies: </p>";

            for (let i = 0; i < result["production_companies"].length; i++) {
                resulthtml += "<ul><li>" + result["production_companies"][i]["name"]+"</li></ul>";                
            }

            resulthtml += "<p>Cast: </p>";

            for (let i = 0; i < result["credits"]["cast"].length; i++) {
                resulthtml += "<ul><li>"+result["credits"]["cast"][i]["name"]+ " as " + result["credits"]["cast"][i]["character"]+"</li></ul>";                
            }

            resulthtml += "<p>Crew: </p>";

            for (i = 0; i < result["credits"]["crew"].length; i++) {
                resulthtml += "<ul><li>"+result["credits"]["crew"][i]["name"]+" -- "+result["credits"]["crew"][i]["job"]+"</li></ul>";
            }

            $("#modalBodyDiv").html(resulthtml);

            $("#myModal").show();

            $(".close").click(function() {
                $("#myModal").hide();
            });

            $(".btn_default").click(function() {
                $("#myModal").hide();
            });

        },

        });
        }

    });

    $("#message").on("click", ".result", function () {
        var resourceId = $(this).attr("resourceId");
        if($("input[name='movie_person']:checked").val() == "person") {
        $.ajax({
            url: "https://api.themoviedb.org/3/person/" + resourceId+"?"+ "api_key=dc662b7f1d2f741b834a79e3ebf185e5&append_to_response=credits",
            
            dataType: 'json',
            success: function (result) {
                $("#modalTitleH4").html(result["name"]);

                var activity = result["known_for_department"] == null ? "Unknown" : result["known_for_department"]
                var biography = result["biography"] == null ? "No information available" : result["biography"];
                var deceased = result["deathday"] == null ? "" : "  /  "+result["deathday"];
                var homepage = result["homepage"] == null ? "" : result["homepage"];

                var resultHtml = "<p>Job: "+activity+"</p><p>" + biography + "</p>";
                resultHtml += "<p>Birthday: " + result["birthday"]  + deceased + "</p><p>Place of Birth: " + result["place_of_birth"]+"</p><p>HomePage: <a href="+homepage+">" + homepage+ "</a></p>";

                for (i = 0; i < result["credits"]["cast"].length; i++) {
                    resultHtml += "<ul><li>"+result["credits"]["cast"][i]["title"]+" --- "+result["credits"]["cast"][i]["release_date"].substr(0,4)+" --- Acting"+"</li></ul>"
                }

                for (i = 0; i < result["credits"]["crew"].length; i++) {
                    resultHtml += "<ul><li>"+result["credits"]["crew"][i]["title"]+" ----  "+result["credits"]["crew"][i]["release_date"].substr(0,4)+" ----  " +result["credits"]["crew"][i]["job"]+"</li></ul>"
                }
                

                $("#modalBodyDiv").html(resultHtml);

            $("#myModal").show();

            $(".close").click(function() {
                $("#myModal").hide();
            });

            $(".btn_default").click(function() {
                $("#myModal").hide();
            });
            },
            
        });
        }
    });
   

    function CallAPI2() {
        $.ajax({
            url: "https://api.themoviedb.org/3/search/person?&query=" + $("#search").val(),
            data: { "api_key": "dc662b7f1d2f741b834a79e3ebf185e5" },
            dataType: "json",
            success: function (result) {
                var resultHtml = $("<div class=\"resultDiv\"><p>Names</p>");
                 for (i = 0; i < result["results"].length; i++) {

                            var image = result["results"][i]["profile_path"] == null ? "img/no-image.png" : "https://image.tmdb.org/t/p/w500/" + result["results"][i]["profile_path"];

                            resultHtml.append("<div class=\"result\" resourceId=\"" + result["results"][i]["id"] + "\">" + "<img src=\"" + image + "\" />" + "<p><a>" + result["results"][i]["name"] + "</a></p>" + "<p><a>" + result["results"][i]["known_for_department"] + "</a></p></div>")

                        }
                
                
                $("#message").html(resultHtml);
            },
           
        });
    }


    function Validate() {
        var errorMessage = "";
        if ($("#search").val() == "" || $("input[name='movie_person']:checked").val() == null) {
            errorMessage += "Choose category and enter Movie or Person name";
        }
        return errorMessage;
    }

});