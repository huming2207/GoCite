"use strict";

function parse_isbn_json()
{
    var list = document.getElementById("isbn-result-list");
    var isbn = document.getElementById("isbn-textbox").value;

    $.getJSON("https://openlibrary.org/api/books?bibkeys=ISBN:" + isbn + "&jscmd=details&format=json",
        function (data) 
        {
            try
            {
                var details = data["ISBN:" + isbn].details;
            }
            catch(error)
            {
                var error_message = error.message.toString();
                console.log(error);
                if(error_message.includes("undefined"))
                {
                    alert("ISBN not found.");
                }
            }

            // Generate reference string
            var ref_str = generate_book_ref(details.authors["0"].name, // So far only one author's name can be parsed due to upstream API bugs
                                        details.publish_date, 
                                        details.edition_name, 
                                        details.publish_places["0"].split(", ")["0"], // Get the larger area only if it gives more than one
                                        details.publishers["0"],
                                        details.title);
            
            // Append new item to list 
            var entry = document.createElement('li');
            var span_content = document.createElement("span");
            var span_id = generate_guid().toString();
            span_content.setAttribute("id", span_id);
            entry.className = "list-group-item";
            entry.appendChild(span_content);
            list.appendChild(entry);

            document.getElementById(span_id).innerHTML = ref_str;
        });
}

function generate_book_ref(authors_raw, publish_date, edition, publish_addr, publisher, title)
{
    var author = generate_author(authors_raw);
    
    // If edition is not found, then just generate the reference without it
    if(!edition)
    {
        var book_ref = author + " " +  publish_date + ", <em>" + title + "</em>, " + publisher + ", " + publish_addr + ".";
    }
    else
    {
        var book_ref = author + " " +  publish_date + ", <em>" + title + "</em>, " + edition.toString().replace("ed.", "edn") + ", " + publisher + ", " + publish_addr + ".";  
    }

    return book_ref;
}

