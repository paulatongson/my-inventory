const app = angular.module("app", []);

app.controller("orders", async function ($scope, $http) {
  $scope.name = "ORDERS";
  $scope.orders = [];
  let tempOrders = [];
  $scope.search = null;

  $scope.deleteOrder = function (id) {
    const isConfirmDeletion = confirm(
      "Are you sure you want to delete this Order?"
    );
    if (!isConfirmDeletion) return;
    const OrderID = { OrderID: id };
    $http
      .delete("/api/admin/orders", {
        data: OrderID,
        headers: { "Content-Type": "application/json;charset=utf-8" },
      })
      .then(
        (res) =>
          ($scope.orders = $scope.orders.filter((item) => item.OrderID !== id))
      );
  };

  $scope.search = function (keywords) {
    $scope.orders = tempOrders.filter((item) => {
      return keywords.split(" ").some((word) => {
        return item.ContactName.toLowerCase().includes(word.toLowerCase());
      });
    });
  };

  $http
    .get("/api/admin/orders")
    .then((res) => res.data)
    .then((data) => {
      $scope.orders = data;
      tempOrders = data;
    });
});
