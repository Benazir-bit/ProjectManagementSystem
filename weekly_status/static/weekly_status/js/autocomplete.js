$( function() {
    
    var projects = [
      {
        value: "jquery",
        label: "jQuery",
        desc: "the write less, do more, JavaScript library",
        icon: "default_image.jpg"
      },
      {
        value: "jquery-ui",
        label: "jQuery UI",
        desc: "the official user interface library for jQuery",
        icon: "default_image.jpg"
      },
      {
        value: "sizzlejs",
        label: "Sizzle JS",
        desc: "a pure-JavaScript CSS selector engine",
        icon: "default_image.jpg"
      }
    ];
    $( "#recipent" ).autocomplete({
      minLength: 0,
      source: projects,
      focus: function( event, ui ) {
        $( "#recipent" ).val( ui.item.label );
        return false;
      },
      select: function( event, ui ) {
        $( "#recipent" ).val( ui.item.label );
        $( "#recipent-id" ).val( ui.item.value );
        $( "#recipent-description" ).html( ui.item.desc );
        $( "#recipent-icon" ).attr( "src", "static/uspl/img/" + ui.item.icon );
 
        return false;
      }
    })
    .autocomplete( "instance" )._renderItem = function( ul, item ) {
      return $( "<li>" )
        .append( "<div>" + item.label + "<br>" + item.desc + "</div>" )
        .appendTo( ul );
    };
  } );