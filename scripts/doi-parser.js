"use strict";

function parse_doi_json()
{
    var list = document.getElementById("doi-result-list");
    var doi_str = document.getElementById("doi-textbox").value;

    $.getJSON("http://api.crossref.org/works/" + doi_str,
        function (data) 
        {
            if(data)
            {
                alert("DOI not found.");
            }

            var details = data.message;

            // Generate reference string
            var ref_str = generate_book_ref(details.authors, 
                                        details.publish_date, 
                                        details.edition_name, 
                                        details.publish_places["0"],
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

function generate_article_ref(name,)