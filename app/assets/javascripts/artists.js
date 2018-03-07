$(document).ready(function() {
  getArtistIndex(); // .../artists
  getNewArtist();
  getEditArtist();
  postNewArtist();
  clickOnArtist();
  showAllArtworks();
  deleteArtist();
})


/////// click on nav bar link for All Artists ///////
const getArtistIndex = () => {
  $('#artist_index').on('click', function(e){
    e.preventDefault();
    // history.pushState(null, null, "artists");
    $.get(this.href).success(function(response){
      let _template = response
      let template = $.parseHTML(_template)
      let theHeader = $(template).find(".header")
      let theTableHeader= $(template).find(".table thead tr")
      theIndexBody(theHeader, theTableHeader)
      getAllArtists()
    });
  })
}

///// ADD ALL Artists to the Table /////
function getAllArtists() {
  fetch(`/artists.json`)
   .then(res => res.json())
   .then(artists => {
     artists.forEach(artist => {
       let numofArtworks = artist.artworks.length
       let newArtist = new Artist(artist); //create newArtist
       let theTableData = newArtist.formatArtistIndexData(numofArtworks);
       tableContent(`<tr>${theTableData}</tr>`)
     })
   })
   .then(() => deleteArtist())
}

/////// click on "add new artist" button ///////
const getNewArtist = () => {
  $(document).on('click', "#add_artist", function(e){
    e.preventDefault();
    $.get(this.href).success(function(response){
      let _template = response
      let template = $.parseHTML(_template)
      let theHeader = $(template).find(".header")
      let theForm = $(template).find("#new_artist")
      theNewEditBody(theHeader, theForm)
    })
  })
}

const getEditArtist = () => {
  $(document).on('click', "#update_artist", function(e){
    e.preventDefault();
    $.get(this.href).success(function(response){
      let _template = response
      let template = $.parseHTML(_template)
      let theHeader = $(template).find(".header")
      let theForm = $(template).find(".edit_artist")
      theNewEditBody(theHeader, theForm)
    })
  })
}

const postNewArtist = () => {
  $(document).on('submit', "form#new_artist", function(e){
    e.preventDefault();
    let $form = $(this);
    let action = $form.attr("action");
    let data = $form.serialize();
    $.ajax({
      type: "POST",
      url: action,
      data: data,
      success: function(data){
        let artistLink = $(data).find("#delete_artist")
        artistShow(artistLink)
      },
      error: function(){
        alert("Hm... something didn't work.");
      }
    })
  })
}

///// delete artist /////
const deleteArtist = () => {
  $("#delete_artist").on('click', function(e){
    e.preventDefault();
    let $form = $(this);
    let action = $form.attr("href");
    $.ajax({
      type: "POST",
      url: action,
      data: {_method: 'delete'},
      beforeSend: function(){
        let r = confirm('Are you sure you want to delete this Artist?');
        if (r == true) {
            alert("The Artist was Removed.")
        } else {
            alert('Oops! Looks like something went wrong.');
        }
      },
      success: function (data) {
        debugger;
        // alert("The Artist was Removed.")
        theBodyPage()
      },
      error: function (data) {
        // alert('Oops! Looks like something went wrong.');
      }
    });
  })
}

//Artist's Show; Click on artist's first or last name; redirect to Artist's Show //
const clickOnArtist = () => {
  $(document).on('click', '.artist_show_link', function(e){
    e.preventDefault();
    artistShow(this) //inject the Artist Show page
    showAllArtworks()
  })
}

// pass the clicked Artist's ID; fetch its json to parse the objects
function artistShow(theClickedArtist){
  let artistLink = $(theClickedArtist).attr('href');
  fetch(`${artistLink}.json`)
   .then(res => res.json())
   .then(artist => {
     let newArtist = new Artist(artist);
     let theHeader = newArtist.formatArtistShowHeader();
     objShowBody(theHeader)
   })
}

/// Option A
const showAllArtworks = () => {
  $(document).on('click', "a#load_artworks", function(e){
    e.preventDefault();
    $.get(this.href).success(function(response){
      addContents(response)
    })
  })
}
