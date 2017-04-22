"use strict";

function generate_author(authors)
{
    var author_ref = "";
    var authors_list = authors.replace(".", "").split(", ")
    var given_name_regex = /[A-Z]/i; // Get all upper case letters from given name


    for(var author_index = 0; author_index < authors_list.length; author_index++)
    {
        var names = authors_list[author_index].split(" ");
        var given_name_initials = "";

        // Filter all given names and get the initials
        for(var name_index = 0; name_index < (names.length - 1); name_index++)
        {
            given_name_initials += names[name_index].match(given_name_regex);
        }

        if(author_index == 0)
        {
            author_ref += names[(names.length - 1)] + ", " + given_name_initials;
        }
        else if(author_index == (authors_list.length  - 1))
        {
            author_ref += " & " + names[(names.length  - 1)] + ", " + given_name_initials;
        }
        else
        {
            author_ref += ", " + names[(names.length  - 1)] + ", " + given_name_initials;
        }
    }

    return author_ref;
}



// GUID Generator, see: http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
function generate_guid() 
{
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}