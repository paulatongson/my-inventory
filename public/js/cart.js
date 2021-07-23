const app = angular.module("app", []);

app.controller("cart", function ($scope, $http) {
  $scope.name = "Cart";
  $scope.products = getCookie();
  let subTotalPrice = 0;

  $scope.contact = {
    ContactName: "",
    MobileNumber: "",
    EmailAdd: "",
    Address: "",
  };

  $scope.subTotalPrice = function () {
    if (!$scope.products && $scope.products.length === 0) return;

    const price = $scope.products.reduce((acc, curr) => {
      const multiplyPriceQuantity = curr.Price * curr.Quantity;
      return acc + multiplyPriceQuantity;
    }, 0);
    subTotalPrice = price;
    return price;
  };

  $scope.shippingFee = function () {
    return subTotalPrice * 0.12;
  };

  $scope.totalPrice = function () {
    return subTotalPrice + $scope.shippingFee();
  };

  $scope.submitOrder = function () {
    const contact = { ...$scope.contact };
    for (const key in contact) {
      if (!$scope.contact[key].trim()) {
        return alert(
          "You must fill all the required shipping details\n in order to proceed"
        );
      }
    }

    const orders = [...$scope.products].map((product) => {
      product.ProductName = product.Name;
      delete product.Name;
      return product;
    });

    const purchase = {
      contact: {},
      orders: [],
    };

    purchase.contact = contact;
    purchase.orders = orders;
    $http.post("/api/cart", purchase).then((v) => {
      for (const key in contact) {
        $scope.contact[key] = "";
      }
      $scope.products = [];
      createCookie([]);
      alert("Your order has been successfully send over to the server");
    });
  };

  $scope.limitQuantity = function (object) {
    const quantity = object.Quantity;
    if (!quantity) {
      object.Quantity = 1;
    }
    if (quantity > 100) {
      object.Quantity = 100;
    }
    if (quantity < 1) {
      object.Quantity = 1;
    }
  };

  $scope.updateQuantity = function (object) {
    if (!confirm("Are you sure you want to remove this product's quantity?"))
      return;

    const products = getCookie();
    products.find((prod) => prod.ProductID === object.ProductID).Quantity =
      object.Quantity;

    createCookie(products);
  };

  $scope.deleteProduct = function (object) {
    if (!confirm("Are you sure you want to remove this product?")) return;

    $scope.products = $scope.products.filter((product) => product !== object);
    const products = $scope.products.map((products) => {
      delete products.$$hashKey;
      return products;
    });
    createCookie(products);
  };
});
