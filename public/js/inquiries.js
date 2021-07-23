const app = angular.module("app", []);

app.controller("inquiries", function ($scope, $http) {
  $scope.name = "Inquiries";
  $scope.inquiries = [];
  $http
    .get("/api/admin/inquiries")
    .then((res) => res.data)
    .then((data) => ($scope.inquiries = data));

  $scope.deleteInquiry = function (id) {
    const isConfirmDeletion = confirm(
      "Are you sure you want to delete this Inquiry?"
    );
    if (!isConfirmDeletion) return;
    const inquiryID = { id: id };
    $http
      .delete("/api/admin/inquiries", {
        data: inquiryID,
        headers: { "Content-Type": "application/json;charset=utf-8" },
      })
      .then(
        (res) =>
          ($scope.inquiries = $scope.inquiries.filter(
            (inquiry) => inquiry.ID !== id
          ))
      );
  };
});
