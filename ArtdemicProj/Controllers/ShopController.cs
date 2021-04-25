using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ArtdemicProj.ViewModel;
using ArtdemicProj.Models;

namespace ArtdemicProj.Controllers
{
    public class ShopController : Controller
    {
        private ECommsEntities objECommsEntities;

        public ShopController()
        {
            objECommsEntities = new ECommsEntities();

        }
        // GET: Shop
        public ActionResult Index()
        {
            IEnumerable<ShopView> listOfShopViews = (from objItem in objECommsEntities.Items
                                                     join objCate in objECommsEntities.Categories
                                                     on objItem.CategoryID equals objCate.CategoryID
                                                     select new ShopView()
                                                     {
                                                         ImagePath = objItem.ImagePath,
                                                         ItemName = objItem.ItemName,
                                                         Description = objItem.Description,
                                                         ItemPrice = objItem.ItemPrice,
                                                         ItemID = objItem.ItemID,
                                                         Category = objCate.CategoryName,
                                                         ItemCode = objItem.ItemCode
                                                     }
                                                ).ToList();

            return View(listOfShopViews);
        }


    }
}