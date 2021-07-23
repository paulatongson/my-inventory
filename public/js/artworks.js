const app = angular.module("app", []);

app.controller("artworks", function ($scope, $http) {
  $scope.name = `ARTWORKS`;
  $scope.artworksLength = 0;
  $scope.targetArtworks = [];
  $scope.srcArtworks = [];
  const artworksLimit = 3;

  $scope.pagination = function (page) {
    const limit = page * artworksLimit;
    $scope.targetArtworks = $scope.srcArtworks.slice(
      limit - artworksLimit,
      limit
    );
    console.log(`${$scope.srcArtworks} , ${$scope.targetArtworks}`);
  };

  $http
    .get("/api/shop/artworks")
    .then((res) => res.data)
    .then((data) => {
      $scope.srcArtworks = data;
      $scope.targetArtworks = data.slice(0, 3);

      $scope.artworksLength = Math.ceil(data.length / 3);
    });

  $scope.addToCart = addToCart;

  $scope.range = range;
});

function range(length) {
  return [...new Array(length).keys()];
}

function addToCart(object) {
  if (!confirm("Are you sure you want to add to cart?")) {
    return;
  }

  const product = { ...object };
  delete product.$$hashKey;
  product.Quantity = 1;

  const cookie = getCookie();
  if (!cookie && cookie.length === 0) {
    createCookie([product]);
    return;
  }
  const isObjectExist = cookie.find(
    (item) => item.ProductID === object.ProductID
  );
  if (isObjectExist) {
    return;
  }
  cookie.push(product);
  createCookie(cookie);
}
