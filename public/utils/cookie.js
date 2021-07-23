function createCookie(array = []) {
  const stringifyArray = JSON.stringify(array);
  const name = `item=`;
  const cookieItem = `${name}${stringifyArray}; path=/`;
  document.cookie = cookieItem;
  return cookieItem;
}

function deleteCookie() {
  document.cookie = "item= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
  return document.cookie;
}

function getCookie(cname = "item") {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return JSON.parse(c.substring(name.length, c.length));
    }
  }
  return "";
}
