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
                    alert("Book not found.");
                }
            }

            var ref = generate_book_ref(details.authors, 
                                        details.publish_date, 
                                        details.edition_name, 
                                        details.publish_places["0"],
                                        details.publishers["0"],
                                        details.title);

            var entry = document.createElement('li');
            var span_content = document.createElement("span");
            var span_id = guid().toString();
            span_content.setAttribute("id", span_id);
            entry.className = "list-group-item";
            entry.appendChild(span_content);
            list.appendChild(entry);

            document.getElementById(span_id).innerHTML = ref;
        });
}

function generate_book_ref(authors_raw, publish_date, edition, publish_addr, publisher, title)
{
    var author = generate_author(authors_raw);
    var book_ref = author + " " +  publish_date + ", <em>" + title + "</em>, " + edition + ", " + publisher + ", " + publish_addr + ".";
    return book_ref;
}

function generate_author(authors_raw)
{
    var author_index = 0;
    var author = "";
    for(author_index = 0; author_index < authors_raw.length; author_index++)
    {
        if(author_index == 0)
        {
            author += authors_raw[author_index].name.toString().split(" ")["1"] + ", " + authors_raw[author_index].name.toString().split(" ")["0"].charAt(0);
        }
        else if(author_index == (authors_raw.size()  - 1))
        {
            author += " & " + authors_raw[author_index].name.toString().split(" ")["1"] + ", " + authors_raw[author_index].name.toString().split(" ")["0"].charAt(0);
        }
        else
        {
            author += ", " + authors_raw[author_index].name.toString().split(" ")["1"] + ", " + authors_raw[author_index].name.toString().split(" ")["0"].charAt(0);
        }
    }

    return author;
}

// GUID Generator, see: http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
function guid() 
{
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}
