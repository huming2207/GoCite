"use strict";

function parse_doi_json() 
{
    var list = document.getElementById("doi-result-list");
    var doi_str = document.getElementById("doi-textbox").value;

    $.getJSON("http://api.crossref.org/works/" + doi_str,
        function (data) 
        {
            var details = data.message;

            if(typeof data.message.issue === undefined)
            {
                alert("DOI not found!");
            }

            // Generate reference string
            var ref_str = generate_article_ref(details.author, // Author
                details.issued["date-parts"], // Date
                details.title["0"], // Title of article
                details["container-title"]["0"], // Paper's database or publisher
                details.volume, // Volume number
                details.issue, // Issue number
                details.page, // Page range
                details.DOI); // DOI ID      

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

function generate_article_ref(author_names_raw, publish_date, article_title, article_publisher,
    article_vol, article_issue, article_page, article_doi) 
{
    var author_names = "";

    for (var author_index = 0; author_index < author_names_raw.length; author_index++)
    {
        author_names += author_names_raw[author_index].given + " " + author_names_raw[author_index].family + ", ";
    }

    // Remove the last ", " two characters to prevent formatting issues later.
    author_names = author_names.substring(0, author_names.length - 2);

    // C#-like String.format workaround, see: http://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format/4673436#4673436
    if (!String.format) 
    {
        String.format = function (format) 
        {
            var args = Array.prototype.slice.call(arguments, 1);
            return format.replace(/{(\d+)}/g, function (match, number) 
            {
                return typeof args[number] != 'undefined' ?
                    args[number] :
                    match;
            });
        };
    }

    var article_ref = String.format(
        "{0} " + // Name(s)
        "{1}," + // Publish year
        "\'{2}\', " + // Paper title
        "<em>{3}</em>, " + // Paper's database or publisher
        "vol. {4}, " + // Volume number
        "no. {5}, " + // Issue number
        "pp. {6}, " + // Page number
        "doi: {7}", // DOI serial number
        generate_author(author_names),
        publish_date["0"]["0"],
        article_title,
        article_publisher,
        article_vol,
        article_issue,
        article_page,
        article_doi
    );

    return article_ref;
}