const app = angular.module("app", []);

const Categories = [
  { id: 1, name: "Pens & Pencils" },
  { id: 2, name: "Markers" },
  { id: 3, name: "Drawing Pads" },
  { id: 4, name: "Coloring" },
  { id: 5, name: "Brushes" },
  { id: 6, name: "Others" },
];

app.controller("materials", function ($scope, $http) {
  $scope.name = "Materials";
  $scope.targetArray = [];
  $scope.srcArray = [];
  $scope.materialsLength = 0;
  const productLimitPerPage = 4;
  const materials = {
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
  };

  $scope.Categories = Categories;
  $scope.range = range;
  $scope.addToCart = addToCart;
  $scope.limitQuantity = limitQuantity;

  $http
    .get("/api/shop/materials")
    .then((res) => res.data)
    .then((data) => {
      data.forEach((value) => {
        value.Quantity = 1;
        materials[value.CategoryID].push(value);
      });
      $scope.mountArray(1);
    });

  $scope.pagination = function (page) {
    const limit = page * productLimitPerPage;
    $scope.targetArray = $scope.srcArray.slice(
      limit - productLimitPerPage,
      limit
    );
  };

  $scope.mountArray = function (id) {
    $scope.srcArray = materials[id];
    $scope.targetArray = $scope.srcArray.slice(0, 4);
    $scope.materialsLength = Math.ceil(
      materials[id].length / productLimitPerPage
    );
  };
});

function range(length) {
  return [...new Array(length).keys()];
}

function addToCart(object) {
  if (!confirm("Are you sure you want to add to cart?")) {
    return;
  }
  const product = { ...object };
  object.Quantity = 1;
  delete product.$$hashKey;

  const cookie = getCookie();
  if (!cookie && cookie.length === 0) {
    createCookie([product]);
    return;
  }

  const isIndexExist = cookie.findIndex(
    (item) => item.ProductID === product.ProductID
  );
  if (cookie[isIndexExist]) {
    cookie[isIndexExist].Quantity += product.Quantity;
    createCookie(cookie);
    return;
  }

  cookie.push(product);
  createCookie(cookie);
}

function limitQuantity(object) {
  const Quantity = object.Quantity;
  if (!Quantity) {
    object.Quantity = 1;
    return;
  }
  if (Quantity < 1) {
    object.Quantity = 1;
  }
  if (Quantity > 100) {
    object.Quantity = 100;
  }
}
