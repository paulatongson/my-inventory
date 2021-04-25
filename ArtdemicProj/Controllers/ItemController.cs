using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ArtdemicProj.Models;
using ArtdemicProj.ViewModel;
using System.IO;

namespace ArtdemicProj.Controllers
{
    public class ItemController : Controller
    {
        private ECommsEntities objECommsEntities;

        public ItemController()
        {
            objECommsEntities = new ECommsEntities();
        }
        // GET: Item
        public ActionResult Index()
        {
            ItemView objItemView = new ItemView();
            objItemView.CategorySelectListItem = (from objCat in objECommsEntities.Categories
                                                  select new SelectListItem()
                                                  {
                                                      Text = objCat.CategoryName,
                                                      Value = objCat.CategoryID.ToString(),
                                                      Selected = true
                                                  });
            return View(objItemView);
        }

        [HttpPost]
        public JsonResult Index(ItemView objItemView)
        {
            string NewImage = Guid.NewGuid() + Path.GetExtension(objItemView.ImagePath.FileName);
            objItemView.ImagePath.SaveAs(filename: Server.MapPath("~/Images/" + NewImage));
            Item objItem = new Item();
            objItem.ImagePath = "~/Images/" + NewImage;
            objItem.CategoryID = objItemView.CategoryID;
            objItem.Description = objItemView.Description;
            objItem.ItemCode = objItemView.ItemCode;
            objItem.ItemID = Guid.NewGuid();
            objItem.ItemName = objItemView.ItemName;
            objItem.ItemPrice = objItemView.ItemPrice;
            objECommsEntities.Items.Add(objItem);
            objECommsEntities.SaveChanges();

            return Json(new {Success=true,Message="Item Added!"}, JsonRequestBehavior.AllowGet);
        }
    }
}